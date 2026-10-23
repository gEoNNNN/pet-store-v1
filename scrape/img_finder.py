"""Cauta imagini de produs prin Serper.dev (Google Images) si le salveaza local.

Folosire:
  1. Lipeste cheia Serper.dev in scrape/.api_key (o singura linie)
     Alternativ: cheie SerpAPI cu al doilea rand "serpapi" in fisier.
  2. python scrape/img_finder.py            -> toate produsele Natura fara imagine reala
  3. python scrape/img_finder.py <slug>     -> doar un produs
"""
import io
import json
import os
import sys
import time
import urllib.request
import urllib.parse

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8")
from PIL import Image

BRAND = "natura"
if len(sys.argv) > 1 and sys.argv[1].startswith("--file="):
    _f = sys.argv.pop(1).split("=", 1)[1]
    BRAND = _f.replace("_products.json", "")
JSON_FILE = f"scrape/{BRAND}_products.json"
OUT_DIR = f"public/products/{BRAND}"
os.makedirs(OUT_DIR, exist_ok=True)
KEY_FILE = "scrape/.api_key"

UA = {"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36"}


def api_key():
    lines = [l.strip() for l in open(KEY_FILE, encoding="utf-8") if l.strip()]
    key = lines[0].split("=", 1)[-1].strip()  # accepta si formatul key=...
    return key, (lines[1] if len(lines) > 1 else "serper")


def search_images(query, n=8):
    key, provider = api_key()
    if provider == "serpapi":
        url = ("https://serpapi.com/search.json?engine=google_images&ijn=0&q="
               + urllib.parse.quote(query) + "&api_key=" + key)
        j = json.loads(urllib.request.urlopen(
            urllib.request.Request(url, headers=UA), timeout=30).read())
        return [r.get("original") for r in j.get("images_results", [])][:n]
    # default: serper.dev
    req = urllib.request.Request(
        "https://google.serper.dev/images",
        data=json.dumps({"q": query, "num": n}).encode(),
        headers={"X-API-KEY": key, "Content-Type": "application/json", **UA},
        method="POST",
    )
    j = json.loads(urllib.request.urlopen(req, timeout=30).read())
    pairs = []
    for r in j.get("images", []):
        pairs.append((r.get("imageUrl"), r.get("thumbnailUrl")))
    # prefera imageUrl; daca e pe naturapetfood.com (IP-ul nostru e banat), ia thumbnail-ul google
    out = []
    for img, thumb in pairs:
        if img and "naturapetfood.com" not in img and "econaturapet.com" not in img:
            out.append(img)
        if thumb:
            out.append(thumb)
    return out[: n * 2]


def download(url):
    req = urllib.request.Request(url, headers={**UA, "Accept": "image/*,*/*"})
    return urllib.request.urlopen(req, timeout=30).read()


def used_sources(data, exclude_slug):
    return {p.get("img_source") for p in data["products"]
            if p["slug"] != exclude_slug and p.get("img_source")}


def is_real(img):
    """Respinge imagini aproape uniforme (placeholder) sau prea mici."""
    if img.size[0] < 200 or img.size[1] < 200:
        return False
    small = img.resize((8, 8))
    lum = [sum(px[:3]) / 3 for px in small.getdata()]
    return max(lum) - min(lum) > 15


def query_for(p):
    if p.get("search_query"):
        return p["search_query"] + " naturapetfood"
    # numele englezesc din URL e mai sigur decat traducerea romaneasca
    slug = p["url"].rstrip("/").rsplit("/", 1)[-1]
    words = slug.replace("-", " ")
    return f"{words} econaturapet" if BRAND == "econatura" else f"{words} naturapetfood"


def ahash(img):
    """Average hash 8x8 -> int de 64 biti (rezista la re-encodare)."""
    g = img.convert("L").resize((8, 8))
    px = list(g.getdata())
    avg = sum(px) / 64
    bits = 0
    for v in px:
        bits = (bits << 1) | (v > avg)
    return bits


def existing_ahashes(exclude_slug):
    hashes = []
    for f in os.listdir(OUT_DIR):
        if exclude_slug and f.startswith(exclude_slug):
            continue
        fp = os.path.join(OUT_DIR, f)
        try:
            hashes.append(ahash(Image.open(fp)))
        except Exception:
            pass
    return hashes


def is_dup(im, hashes, max_dist=6):
    h = ahash(im)
    return any(bin(h ^ e).count("1") <= max_dist for e in hashes)


def main():
    only = sys.argv[1] if len(sys.argv) > 1 else None
    data = json.load(open(JSON_FILE, encoding="utf-8"))
    ok = fail = skip = 0
    for p in data["products"]:
        slug = p["slug"]
        if only and slug != only:
            continue
        out_name = slug + ".webp"
        out_path = os.path.join(OUT_DIR, out_name)
        if os.path.exists(out_path) and p["image"] == f"/products/{BRAND}/{out_name}" and not only:
            skip += 1
            continue
        q = query_for(p)
        try:
            urls = search_images(q)
        except Exception as e:
            print(slug, "ESEC search:", str(e)[:90])
            fail += 1
            time.sleep(2)
            continue
        got = False
        # la zgarzi/hamuri/lese, aceeasi forma in culori diferite produce
        # acelasi hash grayscale -> verificarea de duplicate ar respinge
        # imagini corecte. Ne bazam doar pe deduplicarea dupa URL sursa.
        skip_hash = any(slug.startswith(t) for t in
                        ("natura-zgarda", "natura-ham", "natura-lesa", "eco-natura",
                         "natura-bone", "natura-cat-bed", "natura-cube", "natura-cylinder",
                         "natura-ceramic", "natura-cat-head", "natura-cat-toilet",
                         "natura-hexagon", "natura-food", "natura-double",
                         "natura-barrel", "natura-plastic", "natura-litter",
                         "natura-dog-training", "natura-pet-nail", "natura-small-pin",
                         "natura-self-clean", "natura-double-side", "natura-cat-dog"))
        used_h = [] if skip_hash else existing_ahashes(exclude_slug=slug)
        used_u = used_sources(data, slug)
        for u in urls:
            if u in used_u:
                continue
            try:
                raw = download(u)
                im = Image.open(io.BytesIO(raw)).convert("RGB")
                if not is_real(im) or is_dup(im, used_h):
                    continue
                im.save(out_path, "WEBP", quality=88)
                p["image"] = f"/products/{BRAND}/{out_name}"
                p["images"] = [{"url": p["image"], "alt": p["name"], "role": "main"}]
                p["img_source"] = u
                json.dump(data, open(JSON_FILE, "w", encoding="utf-8"),
                          ensure_ascii=False, indent=2)
                print(slug, "OK", im.size, "<-", u[:80])
                ok += 1
                got = True
                break
            except Exception:
                continue
        if not got:
            print(slug, "NIMIC valid din", len(urls), "rezultate")
            fail += 1
        time.sleep(1.2)  # respecta limita free de ~1 req/s

    json.dump(data, open(JSON_FILE, "w", encoding="utf-8"),
              ensure_ascii=False, indent=2)
    print(f"gata: {ok} ok, {fail} esec, {skip} deja aveau")


if __name__ == "__main__":
    main()
