"""Leaga produsele din natura_products.json de slug-urile oficiale arhivate
(scrape/_wb_slugs.json) si extrage imaginea oficiala din pagina arhivata.

python scrape/match_natura_official.py match  -> scrape/_natura_slugmap.json
python scrape/match_natura_official.py fetch   -> descarca imaginile oficiale
"""
import io
import json
import os
import re
import sys
import time
import urllib.request

from PIL import Image

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from wayback_natura_images import get  # noqa: E402

sys.stdout.reconfigure(encoding="utf-8")

JSON_FILE = "scrape/natura_products.json"
SLUGS_FILE = "scrape/_wb_slugs.json"
MAP_FILE = "scrape/_natura_slugmap.json"
OUT_DIR = "public/products/natura"

# culoare romaneasca -> (engleza, turca)
COLORS = {
    "negru": ("black", "siyah"),
    "albastru": ("blue", "mavi"),
    "roșu": ("red", "kirmizi"),
    "roz": ("pink", "pembe"),
    "mov": ("purple", "mor"),
    "galben": ("yellow", "sari"),
    "verde": ("green", "yesil"),
    "portocaliu": ("orange", "turuncu"),
    "galben neon": ("neon-yellow", "neon-sari"),
    "roz neon": ("neon-pink", "neon-pembe"),
    "portocaliu neon": ("neon-orange", "neon-turuncu"),
    "verde lime neon": ("neon-lime", "neon-lime"),
    "neon": ("neon-lime", "neon-lime"),
    "verde mușchi": ("algae-green", "yosun-yesili"),
    "verde crin": ("green-lily", "yesil-zambak"),
    "verde viridian": ("viridian-green", "viridian-yesili"),
    "corai": ("living-coral", "mercan"),
    "zebră curcubeu": ("rainbow-zebra", "gokkusagi-zebra"),
}

SIZES = {
    "3XS/2XS": "3xs-2xs",
    "XS/S": "xs-s",
    "M/L": "m-l",
    "XL": "xl",
    "XS": "xs",
    "S": "s",
    "M": "m",
    "L": "l",
    "2XS": "2xs",
}


def color_of(product):
    for label in product["labels"]:
        if label.startswith("Culoare:"):
            value = label.split(":", 1)[1].strip()
            base = value.split(",")[0].strip().lower()
            return base, value.lower()
    return None, None


def size_of(product):
    for label in product["labels"]:
        if label.startswith("Mărime"):
            value = label.replace("Mărime", "").strip()
            return SIZES.get(value)
    return None


def candidates(product):
    """Slug-uri oficiale posibile pentru produsul dat."""
    slug = product["slug"]
    size = size_of(product)
    base_color, full_color = color_of(product)
    pair = COLORS.get(base_color or "", (None, None))
    en, tr = pair
    out = []

    def add(*values):
        out.extend([v for v in values if v and "none" not in v])

    if slug.startswith("natura-zgarda-refl-") and size and en:
        add(f"natura-reflective-dog-collar-{size}-{en}",
            f"natura-reflektorlu-kopek-boyun-tasmasi-{tr}-{size}")
    elif slug.startswith("natura-zgarda-pisica"):
        if "pisoi" in slug and en:
            add(f"natura-reflective-kitten-collar-{en}",
                f"natura-reflektorlu-yavru-kedi-boyun-tasmasi-{tr}")
        else:
            pattern = {
                "model pisicuțe": "cat-patterned",
                "model nazar boncuk": "eye-beads-green",
                "verde, model nazar boncuk": "eye-beads-green",
                "zebră curcubeu": "rainbow-zebra",
            }.get(full_color or "")
            if "craniu" in slug:
                pattern = f"cat-skull-{en}" if en else None
            if "pestisor" in slug or "peștișor" in slug:
                pattern = "fish-skeleton-and-paw-blue"
            if "kilcik" in slug or "kîlçık" in slug:
                pattern = "fish-skeleton-and-paw-blue"
            add(f"natura-adult-cat-collar-{pattern or en}")
    elif slug.startswith("natura-ham-pisica"):
        pattern = None
        if "craniu" in slug:
            pattern = f"cat-skull-{en}" if en else None
        elif "pisicute" in slug:
            pattern = "cat-patterned"
        elif "zebra" in slug:
            pattern = "rainbow-zebra"
        elif "kilcik" in slug or "pestisor" in slug:
            pattern = "fish-skeleton-and-paw-blue"
        add(f"natura-adult-cat-harness-{pattern or en}")
    elif slug.startswith("natura-ham-fluture-") and en:
        size_part = size or "m"
        add(f"natura-reflective-basic-harness-{en}-{size_part}",
            f"natura-reflektorlu-kelebek-gogus-tasmasi-{tr}-{size_part}")
    elif slug.startswith("natura-ham-airnet-") and en and size:
        add(f"natura-air-net-harness-{size}-{en}",
            f"natura-air-net-ayarlanabilir-bel-tasmasi-{size}-{tr}",
            f"natura-air-net-ayarlanabilir-bel-tasmasi-{tr}-{size}")
    elif slug.startswith("natura-ham-basic-") and en and size:
        add(f"natura-basic-harness-{en}-{size}")
    elif slug.startswith("natura-lesa") and en:
        add(f"natura-leash-{en}")
    elif slug.startswith("natura-zgarda-") and size:
        # zgarzi simple cu model
        pattern = None
        if "oase-colorate" in slug:
            pattern = "renkli-kemik-desenli"
        if pattern and tr:
            add(f"natura-kopek-boyun-tasmasi-{pattern}-{tr}-{size}")
        if "model" not in slug and tr:
            add(f"natura-kopek-boyun-tasmasi-{tr}-{size}")
        if "puppy" in slug and tr:
            add(f"natura-kopek-boyun-tasmasi-puppy-{tr}-{size}")
    return out


def cmd_match():
    archived = set(json.load(open(SLUGS_FILE, encoding="utf-8")))
    data = json.load(open(JSON_FILE, encoding="utf-8"))
    mapping, missing = {}, []
    for product in data["products"]:
        slug = product["slug"]
        site_slug = product.get("url", "").rstrip("/").rsplit("/", 1)[-1]
        if site_slug in archived:
            mapping[slug] = site_slug
            continue
        hit = next((c for c in candidates(product) if c in archived), None)
        if hit:
            mapping[slug] = hit
        else:
            missing.append(slug)
    json.dump(mapping, open(MAP_FILE, "w", encoding="utf-8"), ensure_ascii=False, indent=1)
    print(f"mapate oficial: {len(mapping)} | nemapate: {len(missing)}")
    for slug in missing:
        print("  -", slug)


OG_RE = re.compile(r"<meta[^>]+property=\"og:image\"[^>]+content=\"([^\"]+)\"")
UPLOAD_RE = re.compile(r"(https?://[^\"'\s]*?naturapetfood\.com/wp-content/uploads/[^\"'\s]+?\.(?:jpe?g|png|webp))")


def official_image_url(site_slug):
    """Extrage URL-ul imaginii din pagina de produs arhivata."""
    page = f"https://web.archive.org/web/2025/https://naturapetfood.com/product/{site_slug}/"
    try:
        html = get(page, timeout=70, tries=3).decode("utf-8", "replace")
    except Exception as exc:
        return None, f"pagina indisponibila ({str(exc)[:40]})"
    urls = UPLOAD_RE.findall(html)
    found = OG_RE.search(html)
    if found:
        urls.insert(0, found.group(1))
    junk = ("paw-", "logo", "icon", "favicon", "-32x32", "-16x16", "placeholder",
            "woocommerce-placeholder", "banner", "sprite")
    urls = [u for u in urls if not any(j in u.lower() for j in junk)]
    # fotografiile de produs sunt denumite dupa codul EAN (8682315...)
    coded = [u for u in urls if re.search(r"/\d{8,}[_\-]", u)]
    pool = coded or urls
    if not pool:
        return None, "fara imagine in pagina"
    # prefera rezolutia cea mai mare a aceluiasi fisier
    best = max(pool, key=lambda u: int((re.search(r"-(\d+)x\d+\.", u) or [0, 0])[1]))
    return best, None


def download_image(url, slug):
    stamp = re.match(r"^https?://web\.archive\.org/web/(\d+)", url)
    bare = re.sub(r"^https?://web\.archive\.org/web/\d+(?:im_)?/", "", url)
    base = re.sub(r"-\d+x\d+(\.[a-z]+)$", r"\1", bare)
    alt = bare.replace("://www.", "://") if "://www." in bare else bare.replace("://", "://www.")
    candidates_list = [url]
    if stamp:
        candidates_list.append(f"https://web.archive.org/web/{stamp.group(1)}id_/{bare}")
    candidates_list += [
        f"https://web.archive.org/web/2025id_/{bare}",
        f"https://web.archive.org/web/2024id_/{bare}",
        f"https://web.archive.org/web/2025id_/{alt}",
        f"https://web.archive.org/web/2025id_/{base}",
    ]
    for candidate in candidates_list:
        try:
            raw = get(candidate, timeout=60, tries=2)
            image = Image.open(io.BytesIO(raw)).convert("RGB")
            if image.size[0] < 150:
                continue
            image.save(os.path.join(OUT_DIR, slug + ".webp"), "WEBP", quality=88)
            return image.size
        except Exception:
            continue
    return None


def cmd_fetch(only=None):
    mapping = json.load(open(MAP_FILE, encoding="utf-8"))
    direct = {}
    if os.path.exists("scrape/_natura_official.json"):
        direct = json.load(open("scrape/_natura_official.json", encoding="utf-8"))
    data = json.load(open(JSON_FILE, encoding="utf-8"))
    cache_file = "scrape/_natura_imgurls.json"
    cache = json.load(open(cache_file, encoding="utf-8")) if os.path.exists(cache_file) else {}
    ok = fail = 0
    for product in data["products"]:
        slug = product["slug"]
        if only and slug not in only:
            continue
        site_url_slug = product.get("url", "").rstrip("/").rsplit("/", 1)[-1]
        site_slug = mapping.get(slug)
        # imaginea oficiala luata direct din pagina de categorie arhivata
        direct_url = (direct.get(slug) or direct.get(site_url_slug)
                      or (direct.get(site_slug) if site_slug else None))
        if not site_slug and not direct_url:
            continue
        if product.get("img_source", "").startswith("official:") and not only:
            continue
        if direct_url:
            size = download_image(direct_url, slug)
            if size:
                product["image"] = f"/products/natura/{slug}.webp"
                product["images"] = [{"url": product["image"], "alt": product["name"], "role": "main"}]
                product["img_source"] = f"official:{slug}"
                print(slug, "OK", size, "<- categorie arhivata")
                ok += 1
                json.dump(data, open(JSON_FILE, "w", encoding="utf-8"), ensure_ascii=False, indent=2)
                time.sleep(0.4)
                continue
        if not site_slug or os.environ.get("DIRECT_ONLY"):
            print(slug, "ESEC descarcare directa")
            fail += 1
            continue
        url = cache.get(site_slug)
        if not url:
            url, error = official_image_url(site_slug)
            if not url:
                print(slug, "ESEC:", error)
                fail += 1
                time.sleep(1)
                continue
            cache[site_slug] = url
            json.dump(cache, open(cache_file, "w", encoding="utf-8"), ensure_ascii=False, indent=1)
        size = download_image(url, slug)
        if size:
            product["image"] = f"/products/natura/{slug}.webp"
            product["images"] = [{"url": product["image"], "alt": product["name"], "role": "main"}]
            product["img_source"] = f"official:{site_slug}"
            print(slug, "OK", size, "<-", site_slug)
            ok += 1
        else:
            print(slug, "ESEC descarcare", url[:90])
            fail += 1
        json.dump(data, open(JSON_FILE, "w", encoding="utf-8"), ensure_ascii=False, indent=2)
        time.sleep(8)  # Wayback limiteaza agresiv; mergem incet
    print(f"gata: {ok} ok, {fail} esec")


if __name__ == "__main__":
    command = sys.argv[1] if len(sys.argv) > 1 else "match"
    if command == "match":
        cmd_match()
    else:
        cmd_fetch(set(sys.argv[2:]) or None)
