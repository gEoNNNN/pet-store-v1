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

R = "/brands/neoterica/rolfclub-3d/"

PRODUCTS = [
    # picaturi pisici
    ("R401", R + "kapli-ot-kleshchei-i-blokh-dlia-koshek-menee-4-kg/", "rolfclub-picaturi-pisici-sub4kg.webp"),
    ("R442", R + "kapli-ot-kleshchei-i-blokh-dlia-koshek-menee-4-kg-3-pipetki/", "rolfclub-picaturi-pisici-sub4kg-3pipete.webp"),
    ("R425", R + "kapli-ot-kleshchei-i-blokh-dlia-koshek-4-8-kg/", "rolfclub-picaturi-pisici-4-8kg.webp"),
    ("R443", R + "kapli-ot-kleshchei-i-blokh-dlia-koshek-4-8-kg-3-pipetki/", "rolfclub-picaturi-pisici-4-8kg-3pipete.webp"),
    ("R426", R + "kapli-ot-kleshchei-i-blokh-dlia-koshek-8-15-kg/", "rolfclub-picaturi-pisici-8-15kg.webp"),
    # picaturi caini
    ("R402", R + "kapli-ot-kleshchei-i-blokh-dlia-sobak-do-4-kg/", "rolfclub-picaturi-caini-sub4kg.webp"),
    ("R444", R + "kapli-ot-kleshchei-i-blokh-dlia-sobak-do-4-kg-1/", "rolfclub-picaturi-caini-sub4kg-3pipete.webp"),
    ("R403", R + "kapli-ot-kleshchei-i-blokh-dlia-sobak-4-10-kg/", "rolfclub-picaturi-caini-4-10kg.webp"),
    ("R445", R + "kapli-ot-kleshchei-i-blokh-dlia-sobak-4-10-kg-3-pipetki/", "rolfclub-picaturi-caini-4-10kg-3pipete.webp"),
    ("R404", R + "kapli-ot-kleshchei-i-blokh-dlia-sobak-10-20-kg/", "rolfclub-picaturi-caini-10-20kg.webp"),
    ("R446", R + "kapli-ot-kleshchei-i-blokh-dlia-sobak-10-20-kg-3-pipetki/", "rolfclub-picaturi-caini-10-20kg-3pipete.webp"),
    ("R405", R + "kapli-ot-kleshchei-i-blokh-dlia-sobak-20-40-kg/", "rolfclub-picaturi-caini-20-40kg.webp"),
    ("R447", R + "kapli-ot-kleshchei-i-blokh-dlia-sobak-20-40-kg-3-pipetki/", "rolfclub-picaturi-caini-20-40kg-3pipete.webp"),
    ("R424", R + "kapli-ot-kleshchei-i-blokh-dlia-sobak-40-60-kg/", "rolfclub-picaturi-caini-40-60kg.webp"),
    ("R448", R + "kapli-ot-kleshchei-i-blokh-dlia-sobak-40-60-kg-3-pipetki/", "rolfclub-picaturi-caini-40-60kg-3pipete.webp"),
    # zgarzi (pina la zgarda de pisici inclusiv)
    ("R433", R + "osheinik-ot-kleshchei-i-blokh-dlia-shchenkov-i-melkikh-sobak-40-sm/", "rolfclub-zgarda-catei-caini-mici-40cm.webp"),
    ("R434", R + "osheinik-ot-kleshchei-i-blokh-dlia-srednikh-sobak-65-sm/", "rolfclub-zgarda-caini-medii-65cm.webp"),
    ("R435", R + "osheinik-ot-kleshchei-i-blokh-dlia-krupnykh-sobak-75-sm/", "rolfclub-zgarda-caini-mari-75cm.webp"),
    ("R431", R + "osheinik-ot-kleshchei-i-blokh-dlia-kotiat-40-sm/", "rolfclub-zgarda-pisoi-40cm.webp"),
    ("R432", R + "osheinik-ot-kleshchei-i-blokh-dlia-koshek-40-sm/", "rolfclub-zgarda-pisici-40cm.webp"),
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
            print(code, "OK", title[:55], "| img", im.size)
        except Exception as e:
            print(code, "ESEC img", img_url, e)
    else:
        print(code, "FARA IMG", title[:55])

    results.append({
        "code": code, "title_ru": title, "url": url,
        "img_remote": img_url, "image": local, "desc_ru": desc[:3000],
    })

with open("scrape/rolfclub_raw.json", "w", encoding="utf-8") as f:
    json.dump(results, f, ensure_ascii=False, indent=2)
print("salvat", len(results), "in scrape/rolfclub_raw.json")
