import io
import json
import os
import re
import sys
import urllib.request

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8")
from PIL import Image

BASE = "https://www.ekoprom.org"
OUT_DIR = "public/products/ekoprom"
os.makedirs(OUT_DIR, exist_ok=True)

G = "/brands/neoterica/gelmintal/"
# (cod, url pagina, nume fisier imagine) — fara siropuri
PRODUCTS = [
    ("E300", G + "tabletki-dlia-kotiat-i-koshek-menee-4-kg-2-sht/", "gelmintal-tablete-gelminti-coccidii-10tab.webp"),
    ("E301", G + "tabletki-dlia-kotiat-i-koshek-menee-4-kg-2-sht-1/", "gelmintal-tablete-pisoi-pisici-sub4kg.webp"),
    ("E302", G + "tabletki-dlia-koshek-bolee-4-kg-2-sht/", "gelmintal-tablete-pisici-peste4kg.webp"),
    ("E303", G + "tabletki-dlia-shchenkov-i-sobak-menee-10kg-2-sht/", "gelmintal-tablete-catei-caini-sub10kg.webp"),
    ("E304", G + "tabletki-dlia-sobak-bolee-10kg-2-sht/", "gelmintal-tablete-caini-peste10kg.webp"),
    ("E101", G + "kapli-ot-gelmintov-dlia-koshek-menee-4-kg/", "gelmintal-picaturi-pisici-sub4kg.webp"),
    ("E111", G + "kapli-ot-gel-mintov-dlia-koshek-menee-4-kg-3-pipetki/", "gelmintal-picaturi-pisici-sub4kg-3pip.webp"),
    ("E106", G + "kapli-ot-gelmintov-dlia-koshek-4-10-kg/", "gelmintal-picaturi-pisici-4-10kg.webp"),
    ("E116", G + "kapli-ot-gel-mintov-dlia-koshek-4-10-kg-3-pipetki/", "gelmintal-picaturi-pisici-4-10kg-3pip.webp"),
    ("E107", G + "kapli-ot-gelmintov-dlia-sobak-menee-10-kg/", "gelmintal-picaturi-caini-sub10kg.webp"),
    ("E108", G + "kapli-ot-gelmintov-dlia-sobak-bolee-10-kg/", "gelmintal-picaturi-caini-peste10kg.webp"),
]

IMG_RE = re.compile(r'(?:href|src)="(/site/assets/files/\d+/[^"]+?\.(?:jpg|jpeg|png|webp))"', re.I)
TAG_RE = re.compile(r"<[^>]+>")


def fetch(url):
    req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
    return urllib.request.urlopen(req, timeout=30).read()


def clean_text(html):
    text = TAG_RE.sub(" ", html)
    text = re.sub(r"&nbsp;?", " ", text)
    return re.sub(r"\s+", " ", text).strip()


results = []
for code, path, img_name in PRODUCTS:
    url = BASE + path
    try:
        html = fetch(url).decode("utf-8", errors="replace")
    except Exception as e:
        print(code, "ESEC pagina:", e)
        continue

    m = re.search(r"<h1[^>]*>(.*?)</h1>", html, re.S | re.I)
    title = clean_text(m.group(1)) if m else ""

    imgs = IMG_RE.findall(html)
    img_url = BASE + imgs[0] if imgs else None

    desc = ""
    if m:
        after = html[m.end():]
        cut = re.split(r'<a[^>]+/site/assets/files/', after, maxsplit=1)
        desc = clean_text(cut[0])

    local = ""
    if img_url:
        try:
            data = fetch(img_url)
            im = Image.open(io.BytesIO(data)).convert("RGB")
            out = os.path.join(OUT_DIR, img_name)
            im.save(out, "WEBP", quality=88)
            local = "/" + out.replace("\\", "/")[len("public/"):]
            print(code, "OK", title[:55], "| img", im.size, "| desc", len(desc))
        except Exception as e:
            print(code, "ESEC img", img_url, e)
    else:
        print(code, "FARA IMG", title[:55])

    results.append({
        "code": code, "title_ru": title, "url": url,
        "img_remote": img_url, "image": local, "desc_ru": desc[:3000],
    })

with open("scrape/gelmintal_raw.json", "w", encoding="utf-8") as f:
    json.dump(results, f, ensure_ascii=False, indent=2)
print("salvat", len(results), "in scrape/gelmintal_raw.json")
