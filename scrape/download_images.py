"""Download toate imaginile produselor local si rescrie JSON-urile.

- Descarca image / images[].url / fresh_ingredients[].image pentru Brit si Carnilove
- Deduplica dupa URL (multe produse refolosesc aceleasi imagini)
- Converteste la WebP (max 900px), salveaza in public/products/<brand>/
- Rescrie JSON-ul sursa ca sa pointeze la caile locale /products/<brand>/<fisier>.webp
- Cache incremental in scrape/image_map.json (rerularea descarca doar ce lipseste)
"""

import hashlib
import io
import json
import os
import re
import sys
import threading
import time
from concurrent.futures import ThreadPoolExecutor, as_completed
from urllib.parse import urlparse, urlunparse

import requests
from PIL import Image

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8")

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SCRAPE_DIR = os.path.join(ROOT, "scrape")
PUBLIC_DIR = os.path.join(ROOT, "public", "products")
MAP_PATH = os.path.join(SCRAPE_DIR, "image_map.json")

CATALOGS = {
    "brit": os.path.join(SCRAPE_DIR, "products.json"),
    "carnilove": os.path.join(SCRAPE_DIR, "carnilove_products.json"),
}

MAX_DIM = 900
QUALITY = 85
WORKERS = 10
TIMEOUT = 20
RETRIES = 3

print_lock = threading.Lock()


def log(msg):
    with print_lock:
        print(msg, flush=True)


def load_json(path):
    with open(path, encoding="utf-8") as f:
        return json.load(f)


def collect_urls(product):
    urls = []
    if product.get("image"):
        urls.append(product["image"])
    for img in product.get("images") or []:
        if isinstance(img, dict) and img.get("url"):
            urls.append(img["url"])
    for ing in product.get("fresh_ingredients") or []:
        if isinstance(ing, dict) and ing.get("image"):
            urls.append(ing["image"])
    return urls


def local_filename(url):
    base = os.path.basename(urlparse(url).path) or "img"
    base = re.sub(r"\.(png|jpe?g|webp|gif|avif)$", "", base, flags=re.I)
    base = re.sub(r"[^a-zA-Z0-9_-]+", "-", base).strip("-").lower()[:60] or "img"
    digest = hashlib.md5(url.encode()).hexdigest()[:8]
    return f"{base}-{digest}.webp"


def fetch_url(url):
    """brit-petfood.com este offline — imaginile se iau din Wayback Machine."""
    if "brit-petfood.com" in url:
        # variantele /960x960/SHRINK_ONLY nu sunt arhivate — ia fisierul de baza
        parts = urlparse(url)
        base_path = re.sub(r"/\d+x\d+/(FIT|SHRINK_ONLY|EXACT)$", "", parts.path)
        clean = urlunparse((parts.scheme, parts.netloc, base_path, "", "", ""))
        return f"https://web.archive.org/web/2im_/{clean}"
    return url


def download_and_convert(url, out_path):
    headers = {"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"}
    last_err = None
    fetch = fetch_url(url)
    is_archive = "web.archive.org" in fetch
    timeout = 60 if is_archive else TIMEOUT
    os.makedirs(os.path.dirname(out_path), exist_ok=True)
    for attempt in range(RETRIES):
        try:
            if is_archive:
                time.sleep(4 + attempt * 15)  # archive.org limiteaza agresiv
            r = requests.get(fetch, headers=headers, timeout=timeout)
            r.raise_for_status()
            im = Image.open(io.BytesIO(r.content))
            im.load()
            if im.mode in ("RGBA", "LA", "P"):
                im = im.convert("RGBA")
            elif im.mode != "RGB":
                im = im.convert("RGB")
            if max(im.size) > MAX_DIM:
                im.thumbnail((MAX_DIM, MAX_DIM), Image.Resampling.LANCZOS)
            im.save(out_path, "WEBP", quality=QUALITY)
            return True
        except Exception as e:
            last_err = e
    log(f"  FAIL {url} -> {last_err}")
    return False


def rewrite_catalogs(url_map):
    replaced = 0
    kept_remote = 0
    for brand, path in CATALOGS.items():
        data = load_json(path)
        for p in data["products"]:
            if p.get("image") in url_map:
                p["image"] = url_map[p["image"]]
                replaced += 1
            elif str(p.get("image", "")).startswith("http"):
                kept_remote += 1
            for img in p.get("images") or []:
                if isinstance(img, dict) and img.get("url") in url_map:
                    img["url"] = url_map[img["url"]]
            for ing in p.get("fresh_ingredients") or []:
                if isinstance(ing, dict) and ing.get("image") in url_map:
                    ing["image"] = url_map[ing["image"]]
        with open(path, "w", encoding="utf-8") as f:
            json.dump(data, f, ensure_ascii=False, indent=2)
    log(f"  JSON rescris: {replaced} imagini principale localizate, {kept_remote} ramase remote.")


def main():
    os.makedirs(PUBLIC_DIR, exist_ok=True)
    url_map = {}
    if os.path.exists(MAP_PATH):
        url_map = load_json(MAP_PATH)

    # Colecteaza toate URL-urile unice per brand
    jobs = {}  # url -> (brand, out_path)
    for brand, path in CATALOGS.items():
        data = load_json(path)
        for p in data["products"]:
            for url in collect_urls(p):
                if url.startswith("/"):
                    continue  # deja local
                if url in url_map:
                    continue
                fname = local_filename(url)
                jobs[url] = (brand, os.path.join(PUBLIC_DIR, brand, fname))

    # Fisierele deja pe disc (mapare pierduta la intrerupere) intra direct in map
    for url, (brand, out_path) in jobs.items():
        if os.path.exists(out_path):
            url_map[url] = f"/products/{brand}/{os.path.basename(out_path)}"

    todo = [u for u, (_, p) in jobs.items() if u not in url_map and not os.path.exists(p)]

    # Doua etape: CDN-ul Carnilove e rapid; imaginile Brit vin din Wayback (limitat, lent)
    fast_todo = [u for u in todo if "brit-petfood.com" not in u]
    slow_todo = [u for u in todo if "brit-petfood.com" in u]
    log(f"De descarcat: {len(fast_todo)} rapide + {len(slow_todo)} prin Wayback (din {len(jobs)} total)")

    # Aplica imediat ceea ce e deja descarcat (din rularile anterioare)
    rewrite_catalogs(url_map)

    for label, urls, workers in (("CDN", fast_todo, WORKERS), ("Wayback", slow_todo, 1)):
        if not urls:
            continue
        done = 0
        with ThreadPoolExecutor(max_workers=workers) as pool:
            futures = {pool.submit(download_and_convert, u, jobs[u][1]): u for u in urls}
            for fut in as_completed(futures):
                url = futures[fut]
                brand, out_path = jobs[url]
                if fut.result():
                    url_map[url] = f"/products/{brand}/{os.path.basename(out_path)}"
                done += 1
                if done % 50 == 0:
                    log(f"  [{label}] {done}/{len(urls)}")
                    with open(MAP_PATH, "w", encoding="utf-8") as f:
                        json.dump(url_map, f, ensure_ascii=False, indent=1)
        rewrite_catalogs(url_map)
        with open(MAP_PATH, "w", encoding="utf-8") as f:
            json.dump(url_map, f, ensure_ascii=False, indent=1)

    rewrite_catalogs(url_map)
    log("Gata.")


if __name__ == "__main__":
    main()
