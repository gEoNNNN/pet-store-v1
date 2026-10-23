import json
import re
from pathlib import Path

FILE_PATH = Path(__file__).with_name("carnilove_products.json")

TITLE_MAP = {
    "product details": "Detalii produs",
    "ingredients": "Ingrediente",
    "feeding guide": "Ghid de hrănire",
    "nutrition": "Valori nutriționale",
    "composition": "Compoziție",
    "analytical constituents": "Compuși analitici",
    "analytical ingredients": "Compuși analitici",
    "nutritional additives per 1 kg": "Aditivi nutriționali per 1 kg",
    "metabolizable energy": "Energie metabolizabilă",
}

TABLE_TERMS = {
    "Cat weight (kg)": "Greutatea pisicii (kg)",
    "Dog weight (kg)": "Greutatea câinelui (kg)",
    "Weight of cat (kg)": "Greutatea pisicii (kg)",
    "Weight of dog (kg)": "Greutatea câinelui (kg)",
    "Daily amount (g)": "Cantitatea zilnică (g)",
    "Pouches per day": "Plicuri pe zi",
    "Pcs/ day": "Bucăți pe zi",
    "Pcs/day": "Bucăți pe zi",
    "Age (Months)": "Vârsta (luni)",
    "Adult dog weight (kg)/ Age (Months)": "Greutatea câinelui adult (kg) / Vârsta (luni)",
    "Body weight of bitch/ weeks in Gestation": "Greutatea femelei / săptămâna de gestație",
    "To be used as complete food (g)": "Cantitate ca hrană completă (g)",
    "To be used as complementary food, 50% combination with CARNILOVE Cat Dry (g)": "Cantitate ca hrană complementară, în combinație 50% cu hrana uscată CARNILOVE (g)",
}

TEXT_REPLACEMENTS = {
    "CARNILOVE ACTIVE Cat Dry Made with Lamb & Wild boar for Sterilised Adult All Breeds 400g": "CARNILOVE ACTIVE hrană uscată cu miel și mistreț pentru pisici adulte sterilizate, toate rasele, 400 g",
    "CARNILOVE Cat POUCH GRAVY rich in Wild Boar enriched with Chamomile 85 g": "CARNILOVE plic pentru pisici, în sos, cu mistreț și mușețel, 85 g",
    "CARNILOVE Cat POUCH JELLY rich in Pheasant enriched with Raspberry Leaves 85 g": "CARNILOVE plic pentru pisici, în gelatină, cu fazan și frunze de zmeur, 85 g",
    "CARNILOVE Cat CAN Paté Made with Turkey & Salmon 100 g": "CARNILOVE conservă pâté pentru pisici, cu curcan și somon, 100 g",
    "CARNILOVE Cat CRUNCHY Snack Lamb enriched with Blackberries 50 g": "CARNILOVE recompensă crocantă pentru pisici, cu miel și mure, 50 g",
    "CARNILOVE Cat SOFT Snack Sardine enriched with Strawberry 50 g": "CARNILOVE recompensă moale pentru pisici, cu sardine și căpșuni, 50 g",
    "For best flavour, serve at room temperature.": "Pentru cel mai bun gust, serviți la temperatura camerei.",
    "Make sure your feline companion always has fresh drinking water available.": "Asigurați-vă că pisica are întotdeauna apă proaspătă la dispoziție.",
    "The opened package can be frozen, or must be stored in the fridge and used within 3 days.": "Pachetul deschis poate fi congelat sau păstrat la frigider și consumat în maximum 3 zile.",
}


def normalize_product_name(text):
    result = text
    replacements = {
        "Cat Dry Made with": "hrană uscată pentru pisici cu",
        "Cat Dry Fabricat cu": "hrană uscată pentru pisici cu",
        "Pisică uscată Fabricat cu": "hrană uscată pentru pisici cu",
        "Cat POUCH GRAVY rich in": "plic pentru pisici în sos cu",
        "Cat plic GRAVY bogat în": "plic pentru pisici în sos cu",
        "Cat POUCH JELLY rich in": "plic pentru pisici în gelatină cu",
        "PUCH JELEE pentru pisici bogata in": "plic pentru pisici în gelatină cu",
        "Cat CAN Paté Made with": "conservă pâté pentru pisici cu",
        "Cat CAN Fabricat cu": "conservă pâté pentru pisici cu",
        "Cat CRUNCHY Snack": "recompensă crocantă pentru pisici cu",
        "Pisică CRUNCHY Gustare": "recompensă crocantă pentru pisici cu",
        "Cat SOFT Snack": "recompensă moale pentru pisici cu",
        "enriched with": "și",
        "îmbogățit cu": "și",
        "for Sterilised Adult All Breeds": "pentru pisici adulte sterilizate, toate rasele",
        "pentru Adult Sterilizat Toate Rasele": "pentru pisici adulte sterilizate, toate rasele",
        "Lamb & Wild boar": "miel și mistreț",
        "Miel & Mistret": "miel și mistreț",
        "Turkey & Salmon": "curcan și somon",
        "Turkey & Somon": "curcan și somon",
        "Wild Boar": "mistreț",
        "Mistret": "mistreț",
        "Pheasant": "fazan",
        "Raspberry Leaves": "frunze de zmeur",
        "Chamomile": "mușețel",
        "Blackberries": "mure",
        "Sardine": "sardine",
        "Strawberry": "căpșuni",
    }
    for source, target in replacements.items():
        result = result.replace(source, target)
    return re.sub(r"\s+", " ", result).strip()


def translate_nutrition(text):
    result = normalize_product_name(text)
    replacements = {
        "crude protein": "proteină brută",
        "crude fat": "grăsime brută",
        "moisture": "umiditate",
        "crude ash": "cenușă brută",
        "crude fibre": "fibră brută",
        "crude fiber": "fibră brută",
        "calcium": "calciu",
        "phosphorus": "fosfor",
        "sodium": "sodiu",
        "magnesium": "magneziu",
        "omega-3 fatty acids": "acizi grași omega-3",
        "omega-6 fatty acids": "acizi grași omega-6",
        "animal protein from total protein content": "proteine animale din conținutul total de proteine",
        "Nutritional additives per 1 kg": "Aditivi nutriționali per 1 kg",
        "Vitamin": "vitamina",
        "choline chloride": "clorură de colină",
        "taurine": "taurină",
        "biotin": "biotină",
        "folic acid": "acid folic",
        "calcium D-pantothenate": "D-pantotenat de calciu",
        "D-pantothenate": "D-pantotenat",
        "L-methionine": "L-metionină",
        "niacinamide": "niacinamidă",
        "zinc": "zinc",
        "iron": "fier",
        "manganese": "mangan",
        "potassium iodide": "iodură de potasiu",
        "copper": "cupru",
        "Metabolizable energy": "Energie metabolizabilă",
    }
    for source, target in replacements.items():
        result = re.sub(re.escape(source), target, result, flags=re.IGNORECASE)
    return re.sub(r"\s+", " ", result).strip()


def replace_terms(text):
    result = text or ""
    for source, target in TEXT_REPLACEMENTS.items():
        result = result.replace(source, target)
    for source, target in TABLE_TERMS.items():
        result = result.replace(source, target)
    result = normalize_product_name(result)
    result = re.sub(r"\s+", " ", result).strip()
    return result


def translate_table(table):
    return [
        [TABLE_TERMS.get(str(cell).strip(), replace_terms(str(cell))) for cell in row]
        for row in table
    ]


def main():
    data = json.loads(FILE_PATH.read_text(encoding="utf-8"))
    for product in data.get("products", []):
        sections = product.get("sections")
        if not isinstance(sections, dict):
            continue

        normalized = {}
        for title, section in sections.items():
            if not isinstance(section, dict):
                continue
            normalized_title = TITLE_MAP.get(title.lower(), title)
            section_copy = dict(section)

            if normalized_title == "Detalii produs":
                section_copy["text"] = product.get("product_details") or section_copy.get("text", "")
            elif normalized_title in ("Ingrediente", "Compoziție"):
                section_copy["text"] = product.get("ingredients") or section_copy.get("text", "")
            elif normalized_title == "Ghid de hrănire":
                section_copy["text"] = product.get("feeding_guide") or section_copy.get("text", "")
            elif normalized_title == "Valori nutriționale":
                paragraphs = section_copy.get("paragraphs", [])
                meaningful = [
                    translate_nutrition(str(paragraph))
                    for paragraph in paragraphs
                    if str(paragraph).strip() and not re.fullmatch(r"[\d\s.,%+>–—-]+", str(paragraph).strip())
                ]
                section_copy["text"] = "\n\n".join(meaningful) or translate_nutrition(product.get("nutrition", ""))

            section_copy["text"] = replace_terms(section_copy.get("text", ""))
            section_copy["tables"] = [translate_table(table) for table in section_copy.get("tables", [])]
            normalized[normalized_title] = section_copy

        product["sections"] = normalized
        product["feeding_guide"] = replace_terms(product.get("feeding_guide", ""))
        product["nutrition"] = replace_terms(product.get("nutrition", ""))
        product["ingredients"] = replace_terms(product.get("ingredients", ""))

    FILE_PATH.write_text(json.dumps(data, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"Formatted sections for {len(data.get('products', []))} Carnilove products")


if __name__ == "__main__":
    main()
