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

# (cod, slug-ro, url pagina, nume fisier imagine)
PRODUCTS = [
    ("N201", "kombo-kapli-koshki-1-4", "/brands/neoterica/insektal/kapli-dlia-koshek-i-sobak-ot-2-do-4-kg-1/", "insektal-kombo-kapli-pisici-1-4kg.webp"),
    ("N202", "kombo-kapli-koshki-4-8", "/brands/neoterica/insektal/kapli-dlia-koshek-i-sobak-ot-2-do-4-kg-2/", "insektal-kombo-kapli-pisici-4-8kg.webp"),
    ("N203", "kombo-kapli-sobaki-1-4", "/brands/neoterica/insektal/kapli-dlia-koshek-i-sobak-ot-2-do-4-kg-3/", "insektal-kombo-kapli-caini-1-4kg.webp"),
    ("N204", "kombo-kapli-sobaki-4-10", "/brands/neoterica/insektal/kapli-dlia-koshek-i-sobak-ot-2-do-4-kg-4/", "insektal-kombo-kapli-caini-4-10kg.webp"),
    ("N205", "kombo-kapli-sobaki-10-25", "/brands/neoterica/insektal/kapli-dlia-koshek-i-sobak-ot-2-do-4-kg-5/", "insektal-kombo-kapli-caini-10-25kg.webp"),
    ("N206", "kombo-kapli-sobaki-25-40", "/brands/neoterica/insektal/kapli-dlia-koshek-i-sobak-ot-2-do-4-kg-6/", "insektal-kombo-kapli-caini-25-40kg.webp"),
    ("N207", "kombo-kapli-sobaki-40-60", "/brands/neoterica/insektal/kapli-dlia-koshek-i-sobak-ot-2-do-4-kg-7/", "insektal-kombo-kapli-caini-40-60kg.webp"),
    ("N101", "kapli-2-4", "/brands/neoterica/insektal/kapli-dlia-koshek-i-sobak-ot-2-do-4-kg/", "insektal-kapli-pisici-caini-2-4kg.webp"),
    ("N111", "kapli-2-4-6pip", "/brands/neoterica/insektal/kapli-dlia-koshek-i-sobak-ot-2-do-4-kg-6-pipetok/", "insektal-kapli-pisici-caini-2-4kg-6pip.webp"),
    ("N102", "kapli-4-10", "/brands/neoterica/insektal/kapli-ot-kleshchei-i-blokh-dlia-sobak-4-10-kg/", "insektal-kapli-pisici-caini-4-10kg.webp"),
    ("N112", "kapli-4-10-6pip", "/brands/neoterica/insektal/kapli-ot-kleshchei-i-blokh-dlia-koshek-i-sobak-4-10-kg-6-pipetok/", "insektal-kapli-pisici-caini-4-10kg-6pip.webp"),
    ("N103", "kapli-10-20", "/brands/neoterica/insektal/kapli-ot-kleshchei-i-blokh-dlia-sobak-10-20-kg/", "insektal-kapli-caini-10-20kg.webp"),
    ("N113", "kapli-10-20-6pip", "/brands/neoterica/insektal/kapli-ot-kleshchei-i-blokh-dlia-sobak-10-20-kg-6-pipetok/", "insektal-kapli-caini-10-20kg-6pip.webp"),
    ("N104", "kapli-20-40", "/brands/neoterica/insektal/kapli-ot-kleshchei-i-blokh-dlia-sobak-20-40-kg/", "insektal-kapli-caini-20-40kg.webp"),
    ("N114", "kapli-20-40-6pip", "/brands/neoterica/insektal/kapli-ot-kleshchei-i-blokh-dlia-sobak-20-40-kg-6-pipetok/", "insektal-kapli-caini-20-40kg-6pip.webp"),
    ("N105", "kapli-40-60", "/brands/neoterica/insektal/kapli-ot-kleshchei-i-blokh-dlia-sobak-40-60-kg/", "insektal-kapli-caini-40-60kg.webp"),
    ("N115", "kapli-40-60-6pip", "/brands/neoterica/insektal/kapli-ot-kleshchei-i-blokh-dlia-sobak-40-60-kg-6-pipetok/", "insektal-kapli-caini-40-60kg-6pip.webp"),
    ("N109", "osheinik-40", "/brands/neoterica/insektal/osheinik-dlia-koshek-i-melkikh-sobak-40-sm/", "insektal-zgarda-pisici-caini-mici-40cm.webp"),
    ("N110", "osheinik-65", "/brands/neoterica/insektal/insektal-osheinik-dlia-srednikh-i-krupnykh-sobak-65-sm/", "insektal-zgarda-caini-mari-65cm.webp"),
]

IMG_RE = re.compile(r'(?:href|src)="(/site/assets/files/\d+/[^"]+?\.(?:jpg|jpeg|png|webp))"', re.I)
TAG_RE = re.compile(r"<[^>]+>")


def fetch(url):
    req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
    return urllib.request.urlopen(req, timeout=30).read()


def clean_text(html):
    # scoate tag-urile si normalizeaza spatiile
    text = TAG_RE.sub(" ", html)
    text = re.sub(r"&nbsp;?", " ", text)
    text = re.sub(r"\s+", " ", text)
    return text.strip()


results = []
for code, slug, path, img_name in PRODUCTS:
    url = BASE + path
    try:
        html = fetch(url).decode("utf-8", errors="replace")
    except Exception as e:
        print(code, "ESEC pagina:", e)
        continue

    # titlu din <h1>
    m = re.search(r"<h1[^>]*>(.*?)</h1>", html, re.S | re.I)
    title = clean_text(m.group(1)) if m else ""

    # imaginea produsului: link spre /site/assets/files/ in zona de continut
    imgs = IMG_RE.findall(html)
    img_url = BASE + imgs[0] if imgs else None

    # descriere: blocul dintre </h1> si link-ul catre imagine/instructiune
    desc = ""
    body = html
    if m:
        after = html[m.end():]
        # taie la primul link spre imagine sau pdf
        cut = re.split(r'<a[^>]+/site/assets/files/', after, maxsplit=1)
        desc = clean_text(cut[0])

    # descarca imaginea
    local = ""
    if img_url:
        try:
            data = fetch(img_url)
            im = Image.open(io.BytesIO(data)).convert("RGB")
            out = os.path.join(OUT_DIR, img_name)
            im.save(out, "WEBP", quality=88)
            local = "/" + out.replace("\\", "/")[len("public/"):]
            print(code, "OK", title[:60], "| img", im.size, "| desc", len(desc), "car")
        except Exception as e:
            print(code, "ESEC img", img_url, e)
    else:
        print(code, "FARA IMG", title[:60])

    results.append({
        "code": code,
        "slug_src": slug,
        "title_ru": title,
        "url": url,
        "img_remote": img_url,
        "image": local,
        "desc_ru": desc[:3000],
    })

with open("scrape/insektal_raw.json", "w", encoding="utf-8") as f:
    json.dump(results, f, ensure_ascii=False, indent=2)
print("salvat", len(results), "in scrape/insektal_raw.json")
