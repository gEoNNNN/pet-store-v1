import json
import re
import sys
import time
import urllib.parse
import urllib.request
from concurrent.futures import ThreadPoolExecutor, as_completed

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")

TYPE_MAP = {
    "Dry Dog Food": "Hrană uscată câini",
    "Wet Dog Food": "Hrană umedă câini",
    "Dog Pouches": "Plicuri câini",
    "Dog Snacks": "Recompense câini",
    "Dog Cans": "Conserve câini",
    "Dry Cat Food": "Hrană uscată pisici",
    "Wet Cat Food": "Hrană umedă pisici",
    "Cat Pouches": "Plicuri pisici",
    "Cat Snacks": "Recompense pisici",
    "Cat Cans": "Conserve pisici",
    "Snacks": "Recompense",
    "Pouch": "Plicuri",
    "Cans": "Conserve",
}

FEATURE_MAP = {
    "Fresh Meat & Organs": "Carne proaspătă și organe",
    "Fresh Meat": "Carne proaspătă",
    "Grain-free": "Fără cereale",
    "Grain-Free": "Fără cereale",
    "Potato-free": "Fără cartofi",
    "No Chicken Meat and Fat": "Fără carne și grăsime de pui",
    "No Artificial Preservatives, Flavour, Colouring": "Fără conservanți, arome sau coloranți artificiali",
    "Forest Fruits, Vegetables & Herbs": "Fructe de pădure, legume și ierburi",
    "Natural source of antioxidants": "Sursă naturală de antioxidanți",
    "Immunity support": "Susținerea imunității",
}

TAG_MAP = {
    "Salmon": "Somon",
    "Turkey": "Curcan",
    "Duck": "Rață",
    "Pheasant": "Fazan",
    "Lamb": "Miel",
    "Wild Boar": "Mistreț",
    "Wildboar": "Mistreț",
    "Venison": "Vânat (Căprioară)",
    "Reindeer": "Ren",
    "Beef": "Vită",
    "Trout": "Păstrăv",
    "Quail": "Prepeliță",
    "Rabbit": "Iepure",
    "Ostrich": "Struț",
    "Sardines": "Sardine",
    "Sardine": "Sardine",
    "Mackerel": "Macrou",
    "Buffalo": "Bivol",
    "Chicken": "Pui",
    "Carp": "Crap",
    "Herring": "Hering",
    "Tuna": "Ton",
}

LABEL_MAP = {
    "Gift": "Cadou",
    "Active": "Activ",
    "Sterilised": "Sterilizat",
    "Hypoallergenic": "Hipoalergenic",
    "Grain-free": "Fără cereale",
    "New": "Nou",
}

SECTION_TITLE_MAP = {
    "Composition": "Compoziție",
    "Analytical constituents": "Compuși analitici",
    "Analytical ingredients": "Compuși analitici",
    "Nutritional additives per 1 kg": "Aditivi nutriționali per 1 kg",
    "Feeding guide": "Ghid de hrănire",
    "Metabolizable energy": "Energie metabolizabilă",
    "Fresh ingredients": "Ingrediente proaspete",
}

# In-memory translation cache to save requests on repeated texts
CACHE = {}


def google_translate(text: str) -> str:
    text = (text or "").strip()
    if not text:
        return ""
    if text in CACHE:
        return CACHE[text]
    # For very short words in map
    if text in TAG_MAP:
        return TAG_MAP[text]

    for attempt in range(3):
        try:
            url = (
                "https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=ro&dt=t&q="
                + urllib.parse.quote(text)
            )
            req = urllib.request.Request(
                url, headers={"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"}
            )
            with urllib.request.urlopen(req, timeout=12) as res:
                raw = res.read().decode("utf-8")
                data = json.loads(raw)
                translated = "".join(part[0] for part in data[0] if part and part[0])
                CACHE[text] = translated
                return translated
        except Exception as e:
            time.sleep(0.5 * (attempt + 1))
    return text


def polish_ro(text: str) -> str:
    if not text:
        return ""
    # Common fixes
    replacements = [
        (r"\btratamente\b", "recompense"),
        (r"\bTratamente\b", "Recompense"),
        (r"\btratament\b", "recompensă"),
        (r"\bpateuri\b", "pâté"),
        (r"\bpateu\b", "pâté"),
        (r"\bcompletă hrană\b", "hrană completă"),
        (r"\bCompletă hrană\b", "Hrană completă"),
        (r"\bpachet de valoare\b", "Pachet promoțional"),
        (r"\bPachet de valoare\b", "Pachet promoțional"),
        (r"\bFOR FREE\b", "GRATUIT"),
        (r"\bfor free\b", "gratuit"),
        (r"\bcrude protein\b", "proteină brută"),
        (r"\bcrude fat\b", "grăsime brută"),
        (r"\bcrude ash\b", "cenușă brută"),
        (r"\bcrude fibre\b", "fibră brută"),
        (r"\bmoisture\b", "umiditate"),
        (r"\bcalcium\b", "calciu"),
        (r"\bphosphorus\b", "fosfor"),
        (r"\bsodium\b", "sodiu"),
        (r"\bmetabolizable energy\b", "energie metabolizabilă"),
        (r"\bMetabolizable energy\b", "Energie metabolizabilă"),
    ]
    res = text
    for pat, rep in replacements:
        res = re.sub(pat, rep, res, flags=re.IGNORECASE)
    return res


def translate_product(p: dict) -> dict:
    item = dict(p)

    # 1. Category
    raw_cat = (item.get("category") or "").lower()
    if raw_cat in ("dogs", "caini"):
        item["category"] = "Câini"
    elif raw_cat in ("cats", "pisici"):
        item["category"] = "Pisici"
    elif raw_cat in ("rodents", "rozatoare"):
        item["category"] = "Rozătoare"
    else:
        name_lower = item.get("name", "").lower()
        item["category"] = "Pisici" if any(w in name_lower for w in ["cat", "kitten"]) else "Câini"

    # 2. Product Type
    raw_type = item.get("product_type") or ""
    item["product_type"] = TYPE_MAP.get(raw_type, raw_type)

    # 3. Breadcrumbs
    crumbs = item.get("breadcrumbs") or []
    item["breadcrumbs"] = [
        "Acasă" if c.lower() in ("home", "acasa") else TYPE_MAP.get(c, c)
        for c in crumbs
    ]

    # 4. Labels
    labels = item.get("labels") or []
    item["labels"] = [LABEL_MAP.get(l, l) for l in labels]

    # 5. Features
    feats = item.get("features") or []
    item["features"] = [FEATURE_MAP.get(f, f) for f in feats]

    # 6. Ingredient Tags
    tags = item.get("ingredient_tags") or []
    item["ingredient_tags"] = [TAG_MAP.get(t, t) for t in tags]

    # 7. Description
    if item.get("description"):
        item["description"] = polish_ro(google_translate(item["description"]))

    # 8. Product Details
    if item.get("product_details"):
        item["product_details"] = polish_ro(google_translate(item["product_details"]))

    # 9. Ingredients (Compoziție)
    if item.get("ingredients"):
        item["ingredients"] = polish_ro(google_translate(item["ingredients"]))

    # 10. Feeding Guide
    if item.get("feeding_guide"):
        item["feeding_guide"] = polish_ro(google_translate(item["feeding_guide"]))

    # 11. Nutrition & Analytical Constituents
    if item.get("nutrition"):
        item["nutrition"] = polish_ro(google_translate(item["nutrition"]))
    if item.get("analytical_constituents"):
        item["analytical_constituents"] = polish_ro(google_translate(item["analytical_constituents"]))
    if item.get("nutritional_additives"):
        item["nutritional_additives"] = polish_ro(google_translate(item["nutritional_additives"]))

    # 12. Fresh Ingredients
    fresh = item.get("fresh_ingredients") or []
    new_fresh = []
    for fi in fresh:
        f_name = fi.get("name") or ""
        f_desc = fi.get("description") or ""
        new_name = TAG_MAP.get(f_name, f_name)
        new_desc = polish_ro(google_translate(f_desc)) if f_desc else ""
        new_fresh.append({
            "name": new_name,
            "description": new_desc,
            "image": fi.get("image"),
        })
    item["fresh_ingredients"] = new_fresh

    # 13. Sections
    secs = item.get("sections")
    if isinstance(secs, dict):
        new_secs = {}
        for s_title, s_data in secs.items():
            trans_title = SECTION_TITLE_MAP.get(s_title, s_title)
            if isinstance(s_data, dict):
                s_text = s_data.get("text") or ""
                trans_text = polish_ro(google_translate(s_text)) if s_text else ""
                new_data = dict(s_data)
                new_data["text"] = trans_text
                new_secs[trans_title] = new_data
            else:
                new_secs[trans_title] = s_data
        item["sections"] = new_secs
    elif isinstance(secs, list):
        new_secs = []
        for s in secs:
            if isinstance(s, dict):
                s_title = s.get("title") or ""
                s_text = s.get("text") or ""
                trans_title = SECTION_TITLE_MAP.get(s_title, s_title)
                trans_text = polish_ro(google_translate(s_text)) if s_text else ""
                new_secs.append({
                    "title": trans_title,
                    "text": trans_text,
                    "tables": s.get("tables") or [],
                })
        item["sections"] = new_secs

    # 14. SEO
    seo = item.get("seo") or {}
    if seo.get("description"):
        seo["description"] = polish_ro(google_translate(seo["description"]))
    item["seo"] = seo

    return item


def main():
    file_path = "scrape/carnilove_products.json"
    with open(file_path, "r", encoding="utf-8") as f:
        data = json.load(f)

    products = data.get("products", [])
    total = len(products)
    print(f"Translating {total} Carnilove products to fluent Romanian...")

    translated_products = [None] * total

    with ThreadPoolExecutor(max_workers=6) as executor:
        futures = {
            executor.submit(translate_product, p): idx
            for idx, p in enumerate(products)
        }
        done = 0
        for future in as_completed(futures):
            idx = futures[future]
            try:
                res = future.result()
                translated_products[idx] = res
                done += 1
                if done % 10 == 0 or done == total:
                    print(f"[{done}/{total}] Translated {res.get('name')}", flush=True)
            except Exception as e:
                print(f"Error translating product #{idx}: {e}", flush=True)
                translated_products[idx] = products[idx]

    data["products"] = [p for p in translated_products if p]
    with open(file_path, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)

    print(f"Successfully saved {len(data['products'])} translated products to {file_path}")


if __name__ == "__main__":
    main()
