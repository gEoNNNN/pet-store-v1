# -*- coding: utf-8 -*-
"""Seed Eco Natura Pet products (cat-litter + our-other-products categories)."""
import io
import json
import os
import sys

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8")
HERE = os.path.dirname(__file__)

HYGIENE = "Curățare, igienă și dezinfecție"

PRODUCTS = [
    # (slug, name_ro, category, product_type, labels_extra, package, desc_ro)
    ("eco-natura-pet-pine-scented-bentonite-cat-litter",
     "Nisip bentonitic Eco Natura Pet pentru pisici, parfum de pin",
     "Pisici", "Nisip pentru pisici", [HYGIENE, "Pisici"], "10 Lt",
     "Nisip aglomerant din bentonită albă 100% naturală, cu parfum de pin. "
     "Produs din materii prime naturale, fără substanțe chimice care pot dăuna sănătății pisicii."),
    ("eco-natura-pet-vanilla-scented-bentonite-cat-litter",
     "Nisip bentonitic Eco Natura Pet pentru pisici, parfum de vanilie",
     "Pisici", "Nisip pentru pisici", [HYGIENE, "Pisici"], "10 Lt",
     "Nisip aglomerant din bentonită albă 100% naturală, cu parfum plăcut de vanilie. "
     "Materii prime naturale, fără chimicale dăunătoare."),
    ("eco-natura-pet-marseille-soap-scented-bentonite-cat-litter",
     "Nisip bentonitic Eco Natura Pet pentru pisici, parfum de săpun de Marsilia",
     "Pisici", "Nisip pentru pisici", [HYGIENE, "Pisici"], "10 Lt",
     "Nisip aglomerant din bentonită albă 100% naturală, cu parfum de săpun de Marsilia. "
     "Formula specială pentru controlul mirosurilor, fără chimicale dăunătoare."),
    ("eco-natura-pet-baby-powder-scented-bentonite-cat-litter",
     "Nisip bentonitic Eco Natura Pet pentru pisici, parfum de pudră de talc",
     "Pisici", "Nisip pentru pisici", [HYGIENE, "Pisici"], "10 Lt",
     "Nisip aglomerant din bentonită albă 100% naturală, cu parfum delicat de pudră pentru bebeluși. "
     "Materii prime naturale, sigur pentru sănătatea pisicii."),
    ("eco-natura-pet-assortment-plastic-ball-cat-toy-24-pcs",
     "Set 24 mingiuțe din plastic Eco Natura Pet, jucării pentru pisici",
     "Pisici", "Jucării pentru pisici", ["Jucărie", "Pisici"], "24 buc",
     "Set de 24 mingiuțe colorate din plastic pentru joaca pisicii — stimulează "
     "instinctul de vânător și menține pisica activă."),
    ("eco-natura-pet-carrier-plastic-covered-carrying-box-no1",
     "Cusca de transport Eco Natura Pet cu ușă din plastic, nr. 1",
     "Pisici", "Cuști de transport", ["Transport", "Pisici", "Câini"], "Nr. 1",
     "Cusca de transport sigură cu ușă din plastic, pentru călătorii cu pisica, "
     "câinele de talie mică sau alte animale de companie."),
    ("eco-natura-pet-carrier-plastic-covered-carrying-box-no2",
     "Cusca de transport Eco Natura Pet cu ușă din plastic, nr. 2",
     "Pisici", "Cuști de transport", ["Transport", "Pisici", "Câini"], "Nr. 2",
     "Cusca de transport sigură cu ușă din plastic, dimensiune medie, pentru "
     "călătorii cu pisica sau câinele de talie mică."),
    ("eco-natura-pet-cat-litter-box",
     "Litieră (toaletă) Eco Natura Pet pentru pisici de interior",
     "Pisici", "Litieră și accesorii", [HYGIENE, "Pisici"], "1 buc",
     "Toaletă pentru pisici de interior — practică și igienică, ușor de curățat."),
    ("eco-natura-pet-dry-clean-powder-vanilia-scented-150-gr",
     "Pudră de curățare uscată Eco Natura Pet, parfum de vanilie, 150 g",
     "Pisici", "Îngrijire și igienă", [HYGIENE, "Pisici", "Câini"], "150 g",
     "Pudră de curățare uscată (șampon uscat) cu parfum de vanilie — împrospătează "
     "blana fără apă, ideală pentru animalele care nu tolerează baia."),
    ("eco-natura-pet-grass-kit",
     "Kit Eco Natura Pet pentru iarbă de pisică (cat grass)",
     "Pisici", "Îngrijire și igienă", ["Pisici"], "1 kit",
     "Kit de iarbă pentru pisici din semințe 100% naturale — bogată în clorofilă, "
     "enzime și minerale; susține digestia și ajută la eliminarea ghemelor de blană."),
    ("eco-natura-pet-natural-orchard-grass",
     "Fân natural de livadă Eco Natura Pet pentru rozătoare",
     "Rozătoare", "Hrană și suplimente", ["Rozătoare"], "1 pachet",
     "Fân natural uscat pentru rozătoare (hamsteri, iepuri, porcușori de Guineea) — "
     "100% natural, ușor de digerat, sursă de energie și fibre."),
    ("eco-natura-pet-softwood-shaving-for-rodents-15lt",
     "Așternut din așchii de lemn de pin Eco Natura Pet pentru rozătoare, 15 L",
     "Rozătoare", "Așternut pentru rozătoare", [HYGIENE, "Rozătoare"], "15 Lt",
     "Așternut din așchii de lemn de pin 100% natural pentru cuștile rozătoarelor "
     "(hamsteri, iepuri, porcușori) — absorbție mare, reține umezeala și mirosurile."),
]


def main():
    products = []
    for slug, name, cat, ptype, labels, pkg, desc in PRODUCTS:
        products.append({
            "id": slug,
            "name": name,
            "slug": slug,
            "category": cat,
            "description": desc,
            "image": "",
            "images": [],
            "labels": ["Eco Natura Pet", ptype] + labels,
            "package_sizes": [pkg],
            "url": f"https://econaturapet.com/urun/{slug}/",
            "product_type": ptype,
            "breadcrumbs": ["Acasă", "Produse", "Eco Natura Pet", ptype],
            "features": [], "ingredient_tags": [], "videos": [],
            "sections": {}, "fresh_ingredients": [],
            "metabolizable_energy": None, "raw_text": desc,
        })
    data = {
        "brand": "Eco Natura Pet",
        "source": "https://econaturapet.com",
        "scraped_at": "wayback+search",
        "product_count": len(products),
        "products": products,
    }
    out = os.path.join(HERE, "econatura_products.json")
    json.dump(data, open(out, "w", encoding="utf-8"), ensure_ascii=False, indent=2)
    print("scris", out, len(products), "produse")


if __name__ == "__main__":
    main()
