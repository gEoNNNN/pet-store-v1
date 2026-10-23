import json
import re
import sys
import time
import urllib.parse
import urllib.request
from concurrent.futures import ThreadPoolExecutor, as_completed
from pathlib import Path

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")

FILE_PATH = Path(__file__).with_name("carnilove_products.json")
DELIMITER = "\n===SPLIT===\n"
TITLE_MAP = {
    "product details": "Detalii produs",
    "ingredients": "Ingrediente",
    "feeding guide": "Ghid de hrănire",
    "nutrition": "Valori nutriționale",
}
TABLE_MAP = {
    "Cat weight (kg)": "Greutatea pisicii (kg)",
    "Dog weight (kg)": "Greutatea câinelui (kg)",
    "Weight of cat (kg)": "Greutatea pisicii (kg)",
    "Weight of dog (kg)": "Greutatea câinelui (kg)",
    "Daily amount (g)": "Cantitatea zilnică (g)",
    "Pouches per day": "Plicuri pe zi",
    "Pcs/ day": "Bucăți pe zi",
    "Pcs/day": "Bucăți pe zi",
    "Age (Months)": "Vârsta (luni)",
    "To be used as complete food (g)": "Cantitate ca hrană completă (g)",
    "To be used as complementary food, 50% combination with CARNILOVE Cat Dry (g)": "Cantitate ca hrană complementară, în combinație 50% cu hrana uscată CARNILOVE (g)",
}


def translate(text):
    if not text.strip():
        return text
    for attempt in range(4):
        try:
            url = (
                "https://translate.googleapis.com/translate_a/single?client=at&sl=en&tl=ro&dt=t&q="
                + urllib.parse.quote(text)
            )
            request = urllib.request.Request(
                url,
                headers={"User-Agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 16_6 like Mac OS X)"},
            )
            with urllib.request.urlopen(request, timeout=15) as response:
                payload = json.loads(response.read().decode("utf-8"))
                return "".join(part[0] for part in payload[0] if part and part[0])
        except Exception:
            time.sleep(0.8 * (attempt + 1))
    raise RuntimeError("Serviciul de traducere nu a răspuns")


def polish(text):
    replacements = {
        "pachet valoros": "pachet promoțional",
        "Pachet valoros": "Pachet promoțional",
        "dulciuri": "recompense",
        "Dulciuri": "Recompense",
        "pușuri": "plicuri",
        "Pușuri": "Plicuri",
        "pungi": "plicuri",
        "Pungi": "Plicuri",
        "mistreț sălbatic": "mistreț",
        "Mistret": "mistreț",
        "Somon": "somon",
    }
    result = text.strip()
    for source, target in replacements.items():
        result = result.replace(source, target)
    result = re.sub(r"\s+([,.;:%])", r"\1", result)
    result = re.sub(r"[ \t]+", " ", result)
    return result


def is_table_fragment(value):
    value = value.strip()
    if value in TABLE_MAP:
        return True
    return bool(re.fullmatch(r"[\d\s.,%+>–—-]+", value))


def translate_product(product):
    sections = product.get("sections")
    if not isinstance(sections, dict):
        return product

    records = []
    for title, section in sections.items():
        if not isinstance(section, dict):
            continue
        paragraphs = section.get("paragraphs")
        if not isinstance(paragraphs, list):
            continue
        for paragraph in paragraphs:
            paragraph = str(paragraph).strip()
            if paragraph and not is_table_fragment(paragraph):
                records.append((title, paragraph))

    if not records:
        return product

    translated = translate(DELIMITER.join(text for _, text in records))
    parts = translated.split("===SPLIT===")
    if len(parts) != len(records):
        raise RuntimeError(f"Separarea traducerii a eșuat: {len(parts)} / {len(records)}")

    grouped = {}
    for (title, _), part in zip(records, parts):
        grouped.setdefault(title, []).append(polish(part))

    normalized = {}
    for title, section in sections.items():
        if not isinstance(section, dict):
            continue
        normalized_title = TITLE_MAP.get(title.lower(), title)
        section_copy = dict(section)
        section_copy["text"] = "\n\n".join(grouped.get(title, []))
        section_copy["paragraphs"] = grouped.get(title, [])
        section_copy["tables"] = [
            [[TABLE_MAP.get(str(cell).strip(), polish(str(cell))) for cell in row] for row in table]
            for table in section.get("tables", [])
        ]
        normalized[normalized_title] = section_copy

    product = dict(product)
    product["sections"] = normalized
    product["product_details"] = normalized.get("Detalii produs", {}).get("text", product.get("product_details"))
    product["ingredients"] = normalized.get("Ingrediente", {}).get("text", product.get("ingredients"))
    product["feeding_guide"] = normalized.get("Ghid de hrănire", {}).get("text", product.get("feeding_guide"))
    product["nutrition"] = normalized.get("Valori nutriționale", {}).get("text", product.get("nutrition"))
    return product


def main():
    data = json.loads(FILE_PATH.read_text(encoding="utf-8"))
    products = data.get("products", [])
    translated = [None] * len(products)
    with ThreadPoolExecutor(max_workers=4) as executor:
        futures = {executor.submit(translate_product, product): index for index, product in enumerate(products)}
        completed = 0
        for future in as_completed(futures):
            index = futures[future]
            translated[index] = future.result()
            completed += 1
            if completed % 15 == 0 or completed == len(products):
                print(f"[{completed}/{len(products)}] secțiuni traduse și formatate", flush=True)

    data["products"] = translated
    FILE_PATH.write_text(json.dumps(data, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"Salvate {len(translated)} produse Carnilove")


if __name__ == "__main__":
    main()
