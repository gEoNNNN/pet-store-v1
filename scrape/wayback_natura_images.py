"""Construieste maparea slug -> imagine oficiala Natura din paginile de categorie
arhivate in Wayback Machine (site-ul naturapetfood.com e inaccesibil).

Pas 1: python scrape/wayback_natura_images.py map   -> scrape/_natura_official.json
Pas 2: python scrape/wayback_natura_images.py fetch -> descarca imaginile lipsa
"""
import io
import json
import os
import re
import sys
import time
import urllib.parse
import urllib.request

sys.stdout.reconfigure(encoding="utf-8")
from PIL import Image

H = {"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/124.0 Safari/537.36"}
MAP_FILE = "scrape/_natura_official.json"
OUT_DIR = "public/products/natura"
JSON_FILE = "scrape/natura_products.json"

CATEGORIES = [
    "for-cats/cat-litter",
    "for-cats/cat-toys",
    "for-cats/cat-collars",
    "for-cats/cat-harness",
    "for-dogs/dog-collars",
    "for-dogs/dog-harness",
    "for-dogs/dog-leashes",
    "for-dogs/dog-toys",
    "care-training/cosmetic",
    "care-training/cat-and-dog-beds",
    "care-training/brushes-and-combs",
    "care-training/ceramic-bowls",
    "care-training/plastic-accessories",
    "care-training/fence-playground",
    "care-training/training",
]
PAGES = ["", "page/2/", "page/3/", "page/4/", "page/5/"]


def get(url, timeout=90, tries=5):
    """Wayback da frecvent 429 — backoff progresiv generos."""
    for attempt in range(tries):
        try:
            return urllib.request.urlopen(urllib.request.Request(url, headers=H), timeout=timeout).read()
        except urllib.error.HTTPError as exc:
            if exc.code == 429 and attempt < tries - 1:
                time.sleep(60 * (attempt + 1))
                continue
            if attempt == tries - 1:
                raise
            time.sleep(6)
        except Exception:
            if attempt == tries - 1:
                raise
            time.sleep(6)
    return b""


def snapshots(url):
    api = (f"https://web.archive.org/cdx/search/cdx?url={urllib.parse.quote(url)}"
           "&output=json&fl=timestamp&filter=statuscode:200&collapse=digest&limit=4")
    try:
        rows = json.loads(get(api, timeout=60))
        return [r[0] for r in rows[1:]]
    except Exception:
        return []


# <a href=".../product/<slug>/"> ... <img ... src="<wayback>/wp-content/uploads/....jpg">
PROD_RE = re.compile(r"/product/([a-z0-9\-]+)/")
IMG_RE = re.compile(r"(https?://web\.archive\.org/web/\d+(?:im_)?/https?://[^\"'\s]*?wp-content/uploads/[^\"'\s]+?\.(?:jpe?g|png|webp))")


def parse_page(html):
    """{slug: image_url} — imaginea produsului urmeaza imediat dupa link-ul lui."""
    slugs = [(m.start(), m.group(1)) for m in PROD_RE.finditer(html)]
    images = [(m.start(), m.group(1)) for m in IMG_RE.finditer(html)]
    out = {}
    for pos, slug in slugs:
        if slug in out:
            continue
        nearby = [(abs(ipos - pos), url) for ipos, url in images if abs(ipos - pos) < 2500]
        if not nearby:
            continue
        nearby.sort()
        url = nearby[0][1]
        # prefera varianta mare a aceluiasi fisier
        base = re.sub(r"-\d+x\d+(\.[a-z]+)$", r"\1", url)
        bigger = [u for _, u in nearby if re.sub(r"-\d+x\d+(\.[a-z]+)$", r"\1", u) == base]
        out[slug] = sorted(bigger, key=lambda u: -len(u))[0] if bigger else url
    return out


def cmd_map():
    mapping = {}
    if os.path.exists(MAP_FILE):
        mapping = json.load(open(MAP_FILE, encoding="utf-8"))
    for cat in CATEGORIES:
        for page in PAGES:
            url = f"https://naturapetfood.com/product-category/{cat}/{page}"
            ts_list = snapshots(url)
            if not ts_list:
                print("fara snapshot:", cat, page or "p1")
                continue
            found = {}
            for ts in ts_list[:2]:
                try:
                    html = get(f"https://web.archive.org/web/{ts}/{url}").decode("utf-8", "replace")
                except Exception as exc:
                    print("eroare fetch", cat, page, str(exc)[:50])
                    continue
                found.update(parse_page(html))
                if found:
                    break
            mapping.update(found)
            print(f"{cat}/{page or 'p1'}: {len(found)} produse", flush=True)
            json.dump(mapping, open(MAP_FILE, "w", encoding="utf-8"), ensure_ascii=False, indent=1)
            time.sleep(5)
    print("TOTAL slug-uri cu imagine oficiala:", len(mapping))


def wayback_variants(url):
    """Incearca mai multe variante de redirect pentru acelasi fisier."""
    bare = re.sub(r"^https?://web\.archive\.org/web/\d+(?:im_)?/", "", url)
    yield url
    yield f"https://web.archive.org/web/2025id_/{bare}"
    yield f"https://web.archive.org/web/2024id_/{bare}"
    # varianta fara sufixul de dimensiune (fisierul original)
    base = re.sub(r"-\d+x\d+(\.[a-z]+)$", r"\1", bare)
    if base != bare:
        yield f"https://web.archive.org/web/2025id_/{base}"


def cmd_fetch(only_slugs=None):
    mapping = json.load(open(MAP_FILE, encoding="utf-8"))
    data = json.load(open(JSON_FILE, encoding="utf-8"))
    ok = fail = skip = 0
    for product in data["products"]:
        slug = product["slug"]
        site_slug = product.get("url", "").rstrip("/").rsplit("/", 1)[-1]
        url = mapping.get(slug) or mapping.get(site_slug)
        if only_slugs and slug not in only_slugs:
            continue
        if not url:
            skip += 1
            continue
        if product.get("img_source") == url and not only_slugs:
            continue
        saved = False
        for candidate in wayback_variants(url):
            try:
                raw = get(candidate, timeout=60, tries=1)
                image = Image.open(io.BytesIO(raw)).convert("RGB")
                if image.size[0] < 150:
                    continue
                image.save(os.path.join(OUT_DIR, slug + ".webp"), "WEBP", quality=88)
                product["image"] = f"/products/natura/{slug}.webp"
                product["images"] = [{"url": product["image"], "alt": product["name"], "role": "main"}]
                product["img_source"] = url
                print(slug, "OK", image.size)
                saved = True
                ok += 1
                break
            except Exception:
                continue
        if not saved:
            print(slug, "ESEC", url[:100])
            fail += 1
        json.dump(data, open(JSON_FILE, "w", encoding="utf-8"), ensure_ascii=False, indent=2)
        time.sleep(0.4)
    print(f"gata: {ok} ok, {fail} esec, {skip} fara mapare oficiala")


if __name__ == "__main__":
    command = sys.argv[1] if len(sys.argv) > 1 else "map"
    if command == "map":
        cmd_map()
    else:
        cmd_fetch(set(sys.argv[2:]) or None)
