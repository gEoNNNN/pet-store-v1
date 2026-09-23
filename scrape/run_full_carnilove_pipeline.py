import json
import re
import sys
import time
import urllib.parse
import urllib.request
from concurrent.futures import ThreadPoolExecutor, as_completed
from deep_translator import MyMemoryTranslator

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
    "Improved Digestion": "Digestie îmbunătățită",
}

TAG_MAP = {
    "Salmon": "Somon",
    "Turkey": "Curcan",
    "Duck": "Rață",
    "Pheasant": "Fazan",
    "Lamb": "Miel",
    "Wild Boar": "Mistreț",
    "Wildboar": "Mistreț",
    "Venison": "Vânat",
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
    "Pumpkin": "Dovleac",
    "Peas": "Mazăre",
    "Pea": "Mazăre",
    "Salmon Oil": "Ulei de somon",
    "Catnip": "Iarba mâței (Catnip)",
    "Valerian": "Valeriană",
    "Echinacea": "Echinaceea",
    "Dandelion": "Păpădie",
    "Marigold": "Gălbenele",
    "Oregano": "Oregano",
    "Rosemary": "Rozmarin",
    "Cranberries": "Merișoare",
    "Blueberries": "Afine",
    "Raspberry Leaves": "Frunze de zmeur",
    "Sea Buckthorn": "Cătină",
}

LABEL_MAP = {
    "Gift": "Cadou",
    "Active": "Activ",
    "Sterilised": "Sterilizat",
    "Hypoallergenic": "Hipoalergenic",
    "Grain-free": "Fără cereale",
    "New": "Nou",
    "Freeze-dried": "Liofilizat",
}

SECTION_TITLE_MAP = {
    "Product details": "Detalii produs",
    "Ingredients": "Ingrediente",
    "Feeding guide": "Ghid de hrănire",
    "Nutrition": "Valori nutriționale",
    "Composition": "Compoziție",
    "Analytical constituents": "Compuși analitici",
    "Analytical ingredients": "Compuși analitici",
    "Nutritional additives per 1 kg": "Aditivi nutriționali per 1 kg",
    "Metabolizable energy": "Energie metabolizabilă",
    "Fresh ingredients": "Ingrediente proaspete",
}

mymemory_translator = MyMemoryTranslator(source="en-US", target="ro-RO")


def translate_text(text: str) -> str:
    text = (text or "").strip()
    if not text:
        return ""

    # Attempt 1: Google client=at
    for client in ("at", "gtx"):
        try:
            url = (
                f"https://translate.googleapis.com/translate_a/single?client={client}&sl=en&tl=ro&dt=t&q="
                + urllib.parse.quote(text)
            )
            req = urllib.request.Request(
                url,
                headers={
                    "User-Agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 16_6 like Mac OS X) AppleWebKit/605.1.15"
                },
            )
            with urllib.request.urlopen(req, timeout=8) as res:
                data = json.loads(res.read().decode("utf-8"))
                return "".join(part[0] for part in data[0] if part and part[0])
        except Exception:
            pass

    # Attempt 2: MyMemoryTranslator
    try:
        return mymemory_translator.translate(text)
    except Exception:
        return text


def polish_ro(text: str) -> str:
    if not text:
        return ""
    replacements = [
        (r"\bpachet de valoare\b", "Pachet promoțional"),
        (r"\bPachet de valoare\b", "Pachet promoțional"),
        (r"\bpachet valoros\b", "Pachet promoțional"),
        (r"\bPachet valoros\b", "Pachet promoțional"),
        (r"\bFOR FREE\b", "GRATUIT"),
        (r"\bfor free\b", "gratuit"),
        (r"\btratamente\b", "recompense"),
        (r"\bTratamente\b", "Recompense"),
        (r"\btratament\b", "recompensă"),
        (r"\bdulciuri\b", "delicatese"),
        (r"\bDulciuri\b", "Delicatese"),
        (r"\bpușuri\b", "plicuri"),
        (r"\bPușuri\b", "Plicuri"),
        (r"\bpungi\b", "plicuri"),
        (r"\bPungi\b", "Plicuri"),
        (r"\bpouch\b", "plic"),
        (r"\bpouches\b", "plicuri"),
        (r"\bpâté\b", "pâté"),
        (r"\bpateu\b", "pâté"),
        (r"\bcompletă hrană\b", "hrană completă"),
        (r"\bCompletă hrană\b", "Hrană completă"),
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
        (r"\bcatnip\b", "iarba mâței (catnip)"),
        (r"\bCatnip\b", "Iarba mâței (catnip)"),
    ]
    res = text
    for pat, rep in replacements:
        res = re.sub(pat, rep, res, flags=re.IGNORECASE)
    return res


def translate_product_batch(p: dict) -> dict:
    item = dict(p)

    # 1. Category
    raw_cat = (item.get("category") or "").lower()
    if raw_cat in ("dogs", "caini"):
        item["category"] = "Câini"
    elif raw_cat in ("cats", "pisici"):
        item["category"] = "Pisici"
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

    # Batch translate all large text blocks in one go:
    # 0: description
    # 1: product_details
    # 2: ingredients
    # 3: feeding_guide
    # 4: nutrition
    # 5+: fresh_ingredients descriptions
    blocks = [
        item.get("description") or "",
        item.get("product_details") or "",
        item.get("ingredients") or "",
        item.get("feeding_guide") or "",
        item.get("nutrition") or "",
    ]

    fresh = item.get("fresh_ingredients") or []
    for fi in fresh:
        blocks.append(fi.get("description") or "")

    delimiter = "\n\n===SPLIT===\n\n"
    combined = delimiter.join(blocks)
    translated_combined = translate_text(combined)
    parts = translated_combined.split("===SPLIT===")

    # If split matches, assign back
    if len(parts) >= 5:
        item["description"] = polish_ro(parts[0].strip())
        item["product_details"] = polish_ro(parts[1].strip())
        item["ingredients"] = polish_ro(parts[2].strip())
        item["feeding_guide"] = polish_ro(parts[3].strip())
        item["nutrition"] = polish_ro(parts[4].strip())

        new_fresh = []
        for idx, fi in enumerate(fresh):
            f_name = fi.get("name") or ""
            new_name = TAG_MAP.get(f_name, f_name)
            fi_trans = (
                polish_ro(parts[5 + idx].strip())
                if (5 + idx) < len(parts)
                else fi.get("description", "")
            )
            new_fresh.append({
                "name": new_name,
                "description": fi_trans,
                "image": fi.get("image"),
            })
        item["fresh_ingredients"] = new_fresh
    else:
        # Fallback individually if delimiter was stripped
        if item.get("description"):
            item["description"] = polish_ro(translate_text(item["description"]))
        if item.get("product_details"):
            item["product_details"] = polish_ro(translate_text(item["product_details"]))
        if item.get("ingredients"):
            item["ingredients"] = polish_ro(translate_text(item["ingredients"]))
        if item.get("feeding_guide"):
            item["feeding_guide"] = polish_ro(translate_text(item["feeding_guide"]))
        if item.get("nutrition"):
            item["nutrition"] = polish_ro(translate_text(item["nutrition"]))

        new_fresh = []
        for fi in fresh:
            f_name = fi.get("name") or ""
            new_name = TAG_MAP.get(f_name, f_name)
            new_desc = polish_ro(translate_text(fi.get("description") or ""))
            new_fresh.append({
                "name": new_name,
                "description": new_desc,
                "image": fi.get("image"),
            })
        item["fresh_ingredients"] = new_fresh

    # Synchronize sections map with the translated fields
    secs = item.get("sections")
    if isinstance(secs, dict):
        new_secs = {}
        for s_title, s_data in secs.items():
            trans_title = SECTION_TITLE_MAP.get(s_title, s_title)
            if isinstance(s_data, dict):
                data_copy = dict(s_data)
                # Map standard section texts
                if s_title in ("Product details", "Detalii produs"):
                    data_copy["text"] = item.get("product_details") or data_copy.get("text", "")
                elif s_title in ("Ingredients", "Ingrediente", "Composition", "Compoziție"):
                    data_copy["text"] = item.get("ingredients") or data_copy.get("text", "")
                elif s_title in ("Feeding guide", "Ghid de hrănire"):
                    data_copy["text"] = item.get("feeding_guide") or data_copy.get("text", "")
                elif s_title in ("Nutrition", "Valori nutriționale"):
                    data_copy["text"] = item.get("nutrition") or data_copy.get("text", "")
                new_secs[trans_title] = data_copy
            else:
                new_secs[trans_title] = s_data
        item["sections"] = new_secs

    # SEO description
    seo = item.get("seo") or {}
    if seo.get("description"):
        seo["description"] = item["description"]
    item["seo"] = seo

    return item


def main():
    file_path = "scrape/carnilove_products.json"
    with open(file_path, "r", encoding="utf-8") as f:
        data = json.load(f)

    products = data.get("products", [])
    total = len(products)
    print(f"Translating {total} Carnilove products in fast batch mode...")

    translated_products = [None] * total

    with ThreadPoolExecutor(max_workers=5) as executor:
        futures = {
            executor.submit(translate_product_batch, p): idx
            for idx, p in enumerate(products)
        }
        done = 0
        for future in as_completed(futures):
            idx = futures[future]
            try:
                res = future.result()
                translated_products[idx] = res
                done += 1
                if done % 15 == 0 or done == total:
                    print(f"[{done}/{total}] OK: {res.get('name')}", flush=True)
            except Exception as e:
                print(f"Error on #{idx}: {e}", flush=True)
                translated_products[idx] = products[idx]

    data["products"] = [p for p in translated_products if p]
    with open(file_path, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)

    print(f"\nDone! Successfully saved {len(data['products'])} translated products to {file_path}")


if __name__ == "__main__":
    main()
