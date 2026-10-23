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

U = "/brands/neoterica/unitabs/"
C = "/brands/ekoprom/chistotel/"

PRODUCTS = [
    # ---------- UNITABS (toate, 33) ----------
    ("U312", U + "total-dlia-dlia-krolikov-ptitc-i-gryzunov-10-ml/", "unitabs-total-iepuri-pasari-rozatoare-10ml.webp"),
    ("U313", U + "total-dlia-koshek-20-ml/", "unitabs-total-pisici-20ml.webp"),
    ("U314", U + "total-dlia-koshek-20-ml-1/", "unitabs-total-caini-50ml.webp"),
    ("U311", U + "neokaprol/", "unitabs-neokaprol-100tab.webp"),
    ("U310", U + "prebiotic-dlia-koshek-i-sobak-100-tab/", "unitabs-prebiotic-100tab.webp"),
    ("U309", U + "malt-vit-pasta-s-taurinom-dlia-koshek-120-ml/", "unitabs-maltvit-pasta-pisici-120ml.webp"),
    ("U305", U + "biotinplus-pasta-s-biotinom-i-taurinom-dlia-koshek-120-ml/", "unitabs-biotinplus-pasta-pisici-120ml.webp"),
    ("U306", U + "sterilcat-pasta-dlia-kastr-kotov-i-steriliz-koshek-120-ml/", "unitabs-sterilcat-pasta-120ml.webp"),
    ("U307", U + "immunocat-pasta-s-taurinom-dlia-koshek-s-1-goda-do-8-let-120-ml/", "unitabs-immunocat-pasta-120ml.webp"),
    ("U308", U + "mama-kitty-pasta-dlia-kotiat-beremennykh-i-kormiashchikh-koshek-120-ml/", "unitabs-mamakitty-pasta-120ml.webp"),
    ("U301", U + "biotinplus-dlia-koshek-120-tab/", "unitabs-biotinplus-pisici-120tab.webp"),
    ("U3012", U + "biotinplus-dlia-koshek-200-tab/", "unitabs-biotinplus-pisici-200tab.webp"),
    ("U302", U + "sterilcat-120-tab/", "unitabs-sterilcat-pisici-120tab.webp"),
    ("U3022", U + "sterilcat-200-tab/", "unitabs-sterilcat-pisici-200tab.webp"),
    ("U303", U + "immunocat-120-tab/", "unitabs-immunocat-pisici-120tab.webp"),
    ("U3032", U + "immunocat-200-tab/", "unitabs-immunocat-pisici-200tab.webp"),
    ("U304", U + "mama-kitty-dlia-kotiat-beremennykh-i-kormiashchikh-koshek-120-tab/", "unitabs-mamakitty-120tab.webp"),
    ("U3042", U + "mama-kitty-200-tab/", "unitabs-mamakitty-200tab.webp"),
    ("U201", U + "arthroactive-100-tab/", "unitabs-arthroactive-100tab.webp"),
    ("U2012", U + "arthroactive-200-tab/", "unitabs-arthroactive-200tab.webp"),
    ("U202", U + "brewerscomplex-s-pivnymi-drozhzhami-dlia-krupnykh-sobak-100-tab/", "unitabs-brewerscomplex-mari-100tab.webp"),
    ("U2022", U + "brewerscomplex-s-pivnymi-drozhzhami-dlia-krupnykh-sobak-200-tab/", "unitabs-brewerscomplex-mari-200tab.webp"),
    ("U203", U + "brewerscomplex-s-pivnymi-drozhzhami-dlia-melkikh-sobak-100-tab/", "unitabs-brewerscomplex-mici-100tab.webp"),
    ("U2032", U + "brewerscomplex-s-pivnymi-drozhzhami-dlia-melkikh-sobak-200-tab/", "unitabs-brewerscomplex-mici-200tab.webp"),
    ("U204", U + "calciplus-100-tab/", "unitabs-calciplus-100tab.webp"),
    ("U2042", U + "calciplus-200-tab/", "unitabs-calciplus-200tab.webp"),
    ("U205", U + "immunocomplex-dlia-krupnykh-sobak-100-tab/", "unitabs-immunocomplex-mari-100tab.webp"),
    ("U206", U + "immunocomplex-dlia-melkikh-sobak-100-tab/", "unitabs-immunocomplex-mici-100tab.webp"),
    ("U208", U + "mamacare-dlia-shchenkov-i-kormiashchikh-sobak-100-tab/", "unitabs-mamacare-100tab.webp"),
    ("U207", U + "juniorcomplex-dlia-shchenkov-100-tab/", "unitabs-juniorcomplex-100tab.webp"),
    ("U2072", U + "juniorcomplex-200-tab/", "unitabs-juniorcomplex-200tab.webp"),
    ("U209", U + "seniorcomplex-dlia-sobak-starshe-7-let-100-tab/", "unitabs-seniorcomplex-100tab.webp"),
    ("U210", U + "slimcomplex-s-l-kartinitom-dlia-sobak-100-tab/", "unitabs-slimcomplex-100tab.webp"),
    # ---------- CHISTOTEL ----------
    ("C101", C + "antigelmintnye-tabletki-dlia-sobak-i-koshek-6-sht/", "chistotel-tablete-anthelmintice-6tab.webp"),
    ("C102", C + "antigelmintnaia-suspenziia-dlia-koshek-5-ml/", "chistotel-suspensie-pisici-5ml.webp"),
    ("C103", C + "antigelmintnaia-suspenziia-dlia-sobak-7-ml/", "chistotel-suspensie-caini-7ml.webp"),
    ("C104", C + "antigelmintnaia-suspenziia-iunior-3-ml/", "chistotel-suspensie-junior-3ml.webp"),
    ("C105", C + "antigelmintnaia-suspenziia-dlia-melkikh-sobak-5-ml/", "chistotel-suspensie-caini-mici-5ml.webp"),
    ("C710", C + "los-on-dlia-glaz-25-ml/", "chistotel-lotiune-ochi-taurina-25ml.webp"),
    ("C605", C + "osheinik-ot-blokh-i-kleshchei-dlia-koshek-chernyi/", "chistotel-zgarda-pisici-neagra.webp"),
    ("C606", C + "osheinik-ot-blokh-i-kleshchei-dlia-koshek-fioletovyi/", "chistotel-zgarda-pisici-violet.webp"),
    ("C607", C + "osheinik-ot-blokh-i-kleshchei-dlia-koshek-krasnyi/", "chistotel-zgarda-pisici-rosu.webp"),
    ("C608", C + "osheinik-ot-blokh-i-kleshchei-dlia-sobak-chernyi/", "chistotel-zgarda-caini-neagra.webp"),
    ("C609", C + "osheinik-ot-blokh-i-kleshchei-dlia-sobak-fioletovyi/", "chistotel-zgarda-caini-violet.webp"),
    ("C610", C + "osheinik-ot-blokh-i-kleshchei-dlia-sobak-krasnyi/", "chistotel-zgarda-caini-rosu.webp"),
    ("C611", C + "osheinik-ot-blokh-i-kleshchei-dlia-shchenkov-i-kotiat-chernyi/", "chistotel-zgarda-catei-pisoi-neagra.webp"),
    ("C612", C + "osheinik-ot-blokh-i-kleshchei-dlia-shchenkov-i-kotiat-fioletovyi/", "chistotel-zgarda-catei-pisoi-violet.webp"),
    ("C613", C + "osheinik-ot-blokh-i-kleshchei-dlia-shchenkov-i-kotiat-krasnyi/", "chistotel-zgarda-catei-pisoi-rosu.webp"),
    ("C620", C + "osheinik-ot-blokh-i-kleshchei-dlia-koshek-i-sobak-3-tcveta/", "chistotel-zgarda-pisici-caini-3culori.webp"),
    ("C202", C + "osheinik-ot-blokh-i-kleshchei-dlia-sobak-65-sm/", "chistotel-zgarda-caini-65cm.webp"),
    ("C201", C + "osheinik-ot-blokh-i-kleshchei-dlia-koshek-35-sm/", "chistotel-zgarda-pisici-35cm.webp"),
    ("C314", C + "antiparazitarnyi-shampun-universalnyi-180-ml/", "chistotel-sampon-antiparazitar-180ml.webp"),
    ("C327", C + "sprei-dlia-koshek-sobak-i-dekorativnykh-krolikov-100-ml/", "chistotel-spray-pisici-caini-iepuri-100ml.webp"),
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

with open("scrape/unitabs_chistotel_raw.json", "w", encoding="utf-8") as f:
    json.dump(results, f, ensure_ascii=False, indent=2)
print("salvat", len(results), "in scrape/unitabs_chistotel_raw.json")
