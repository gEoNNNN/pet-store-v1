"""Descarca imaginile OFICIALE Natura (de pe naturapetfood.com).

Site-ul blocheaza accesul direct, iar Wayback a arhivat paginile dar nu si
fisierele imagine. Solutia: cautam prin Serper codul EAN al produsului (numele
fisierului oficial) si acceptam DOAR rezultatele a caror imagine este gazduita
pe naturapetfood.com, descarcand copia din cache-ul Google a aceleiasi imagini.

  python scrape/natura_official_images.py            -> toate produsele
  python scrape/natura_official_images.py <slug>...  -> doar anumite produse
"""
import io
import json
import os
import re
import sys
import time
import urllib.request

from PIL import Image

sys.stdout.reconfigure(encoding="utf-8")

JSON_FILE = "scrape/natura_products.json"
OFFICIAL_MAP = "scrape/_natura_official.json"
SLUG_MAP = "scrape/_natura_slugmap.json"
OUT_DIR = "public/products/natura"
KEY_FILE = "scrape/.api_key"
UA = {"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/124.0 Safari/537.36"}
EAN_RE = re.compile(r"/uploads/\d{4}/\d{2}/(\d{8,})")
OFFICIAL_HOSTS = ("naturapetfood.com",)


def api_key():
    lines = [l.strip() for l in open(KEY_FILE, encoding="utf-8") if l.strip()]
    return lines[0].split("=", 1)[-1].strip()


def search(query, num=10):
    request = urllib.request.Request(
        "https://google.serper.dev/images",
        data=json.dumps({"q": query, "num": num}).encode(),
        headers={"X-API-KEY": api_key(), "Content-Type": "application/json"},
        method="POST",
    )
    return json.loads(urllib.request.urlopen(request, timeout=30).read()).get("images", [])


def official_candidates(results, ean=None):
    """Doar rezultate a caror imagine sta pe site-ul oficial Natura."""
    out = []
    for item in results:
        image_url = item.get("imageUrl") or ""
        if not any(host in image_url for host in OFFICIAL_HOSTS):
            continue
        if ean and ean not in image_url:
            continue
        # site-ul e blocat -> folosim copia din cache-ul Google a aceleiasi imagini
        if item.get("thumbnailUrl"):
            out.append(item["thumbnailUrl"])
        out.append(image_url)
    return out


def save(url, slug):
    try:
        raw = urllib.request.urlopen(
            urllib.request.Request(url, headers={**UA, "Accept": "image/*,*/*"}), timeout=30
        ).read()
        image = Image.open(io.BytesIO(raw)).convert("RGB")
        if image.size[0] < 180 or image.size[1] < 180:
            return None
        image.save(os.path.join(OUT_DIR, slug + ".webp"), "WEBP", quality=90)
        return image.size
    except Exception:
        return None


def title_words(slug):
    return slug.replace("natura-", "").replace("-", " ")


def queries_for(product, official_slug, ean):
    out = []
    if ean:
        out.append(ean)
    if official_slug:
        out.append(f"Natura {title_words(official_slug)} naturapetfood")
    out.append(f"{product['name']} naturapetfood")
    return out


def main():
    only = set(sys.argv[1:]) or None
    official = json.load(open(OFFICIAL_MAP, encoding="utf-8")) if os.path.exists(OFFICIAL_MAP) else {}
    slug_map = json.load(open(SLUG_MAP, encoding="utf-8")) if os.path.exists(SLUG_MAP) else {}
    data = json.load(open(JSON_FILE, encoding="utf-8"))
    ok = fail = skip = 0
    for product in data["products"]:
        slug = product["slug"]
        if only and slug not in only:
            continue
        if product.get("img_source", "").startswith("official-img:") and not only:
            skip += 1
            continue
        site_slug = product.get("url", "").rstrip("/").rsplit("/", 1)[-1]
        official_slug = slug_map.get(slug) or (site_slug if site_slug in official else None)
        image_url = official.get(slug) or official.get(site_slug) or official.get(official_slug or "")
        found = EAN_RE.search(image_url or "")
        ean = found.group(1) if found else None

        saved = False
        for query in queries_for(product, official_slug, ean):
            try:
                results = search(query)
            except Exception as exc:
                print(slug, "eroare cautare:", str(exc)[:60])
                time.sleep(3)
                continue
            for candidate in official_candidates(results, ean if query == ean else None):
                size = save(candidate, slug)
                if size:
                    product["image"] = f"/products/natura/{slug}.webp"
                    product["images"] = [{"url": product["image"], "alt": product["name"], "role": "main"}]
                    product["img_source"] = f"official-img:{query if query == ean else official_slug or 'name'}"
                    print(slug, "OK", size, "<- oficial", f"EAN {ean}" if query == ean else query[:50])
                    ok += 1
                    saved = True
                    break
            if saved:
                break
            time.sleep(1.2)
        if not saved:
            print(slug, "FARA imagine oficiala")
            fail += 1
        json.dump(data, open(JSON_FILE, "w", encoding="utf-8"), ensure_ascii=False, indent=2)
        time.sleep(1.2)
    print(f"gata: {ok} oficiale, {fail} fara, {skip} deja aveau")


if __name__ == "__main__":
    main()
