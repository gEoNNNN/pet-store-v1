import io
import json
import os
import re
import sys
import time
import urllib.request

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8")
from PIL import Image

OUT_DIR = "public/products/natura"
os.makedirs(OUT_DIR, exist_ok=True)

# toate imaginile din uploads de pe pagina produsului
WP_IMG = re.compile(r'(https?://naturapetfood\.com/wp-content/uploads/[^"\'\s]+?\.(?:jpg|jpeg|png|webp))', re.I)
HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36",
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
    "Accept-Language": "en-US,en;q=0.9",
    "Referer": "https://naturapetfood.com/",
}


def fetch(url):
    return urllib.request.urlopen(urllib.request.Request(url, headers=HEADERS), timeout=40).read()


def pick_image(html, slug):
    """Alege imaginea de produs: varianta -430x450 a celei mai mari imagini din uploads."""
    imgs = WP_IMG.findall(html)
    # prefera fisierele care contin bucati din slug (numele produsului)
    slug_parts = [s for s in slug.split("-") if len(s) > 3]
    def score(u):
        name = u.lower().rsplit("/", 1)[-1]
        s = sum(1 for p in slug_parts[:6] if p in name)
        if "430x450" in u or "300x" in u:  # thumbnail de produs
            s += 2
        if "logo" in name or "icon" in name or "news" in name:
            s -= 10
        return s
    imgs.sort(key=score, reverse=True)
    return imgs[0] if imgs else None


def is_real(img):
    """Respinge imagini aproape uniforme (placeholder negru/alb) sau prea mici."""
    if img.size[0] < 200 or img.size[1] < 200:
        return False
    small = img.resize((8, 8))
    px = list(small.getdata())
    lum = [sum(p[:3]) / 3 for p in px]
    return max(lum) - min(lum) > 15


data = json.load(open("scrape/natura_products.json", encoding="utf-8"))
ok = fail = skip = 0
for p in data["products"]:
    slug = p["slug"]
    out_name = slug + ".webp"
    out_path = os.path.join(OUT_DIR, out_name)
    if p["image"] == f"/products/natura/{out_name}" and os.path.exists(out_path):
        skip += 1
        continue
    try:
        html = fetch(p["url"]).decode("utf-8", errors="replace")
        img_url = pick_image(html, slug)
        if not img_url:
            print(slug, "FARA IMG")
            fail += 1
            continue
        raw = fetch(img_url)
        im = Image.open(io.BytesIO(raw)).convert("RGB")
        if not is_real(im):
            print(slug, "PLACEHOLDER", im.size, img_url[-60:])
            fail += 1
        else:
            im.save(out_path, "WEBP", quality=88)
            p["image"] = f"/products/natura/{out_name}"
            p["images"] = [{"url": p["image"], "alt": p["name"], "role": "main"}]
            # salveaza progresiv
            json.dump(data, open("scrape/natura_products.json", "w", encoding="utf-8"),
                      ensure_ascii=False, indent=2)
            print(slug, "OK", im.size)
            ok += 1
    except Exception as e:
        print(slug, "ESEC", str(e)[:80])
        fail += 1
    time.sleep(8)

json.dump(data, open("scrape/natura_products.json", "w", encoding="utf-8"),
          ensure_ascii=False, indent=2)
print(f"gata: {ok} ok, {fail} esec, {skip} deja aveau")
