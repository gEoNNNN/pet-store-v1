# -*- coding: utf-8 -*-
"""Seed Natura dog collars/harnesses/leashes + cat collars (category pages 1-4).

Names include size + colour (XS-XL style) as requested.
Also fixes `image` fields for existing products to point at local files.
"""
import json
import os
import sys
import io

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8")

JSON_PATH = os.path.join(os.path.dirname(__file__), "natura_products.json")
IMG_DIR = os.path.join(os.path.dirname(__file__), "..", "public", "products", "natura")

SIZES = {
    "3xs-2xs": ("3XS/2XS", "15–25 cm"),
    "xs": ("XS", "20–25 cm"),
    "xs-s": ("XS/S", "20–30 cm"),
    "s": ("S", "25–35 cm"),
    "m": ("M", "30–40 cm"),
    "m-l": ("M/L", "25–35 cm"),
    "l": ("L", "35–50 cm"),
    "l-xl": ("L/XL", "40–55 cm"),
    "xl": ("XL", "30–45 cm"),
    "2xs": ("2XS", "15–20 cm"),
    "unica": ("Mărime universală", ""),
}

COLLAR_DESC = (
    "Zgardă reglabilă Natura pentru câini, confectionată din material textil "
    "rezistent, cu cataramă sigură și inel metalic pentru prinderea lesei. "
    "Croiala ajustabilă asigură potrivirea confortabilă pe gâtul câinelui."
)
REFL_DESC = (
    "Zgardă reflectorizantă Natura pentru câini — banda reflectorizantă crește "
    "vizibilitatea animalului pe timp de noapte sau în condiții de lumină "
    "redusă. Reglabilă, cu cataramă rezistentă și inel pentru lesă."
)
BUTTERFLY_DESC = (
    "Ham tip fluture Natura pentru câini — se îmbracă ușor, fără a trece peste "
    "cap, cu elemente reflectorizante pentru siguranță la plimbările de seară. "
    "Material moale, reglabil, nu apasă pe gât."
)
AIRNET_DESC = (
    "Ham Natura din plasă aerisită (Air Net) pentru câini — material moale și "
    "respirabil care distribuie uniform presiunea, ideal pentru plimbări "
    "zilnice. Ajustabil, ușor de îmbrăcat și de curățat."
)
BASIC_DESC = (
    "Ham moale Natura pentru câini, simplu și confortabil, cu curele reglabile "
    "și închideri sigure. Distribuie tracțiunea pe piept, nu pe gât."
)
LEASH_DBL_DESC = (
    "Lesă dublă Natura pentru plimbarea a doi câini simultan — două brațe "
    "rezistente cu carabine metalice, mâner confortabil unic."
)
LEASH_EXT_DESC = (
    "Lesă de prelungire / uz general Natura, 140 cm lungime — material textil "
    "rezistent cu carabină metalică rotativă."
)
CAT_DESC = (
    "Zgardă Natura pentru pisici, ușoară și confortabilă, cu închidere sigură "
    "și clopoțel. Reglabilă pentru potrivirea ideală."
)
CAT_HARN_DESC = (
    "Ham Natura pentru pisici — croială adaptată corpului felin, material moale "
    "și ușor, reglabil pentru plimbări sigure în aer liber."
)

# (slug_suffix, type, size_key, colour_ro, extra_name_ro, desc)
DOG_COLLARS = [
    # Zgărzi clasice 3XS/2XS
    ("3xs-2xs", "zgarda", "roșu, model lăbuțe și oase", COLLAR_DESC),
    ("3xs-2xs", "zgarda", "albastru, model lăbuțe și oase", COLLAR_DESC),
    ("3xs-2xs", "zgarda", "roz, model Puppy", COLLAR_DESC),
    ("3xs-2xs", "zgarda", "negru, model oase colorate", COLLAR_DESC),
    # Zgărzi clasice XS/S
    ("xs-s", "zgarda", "albastru, model oase", COLLAR_DESC),
    ("xs-s", "zgarda", "roșu, model oase", COLLAR_DESC),
    ("xs-s", "zgarda", "roșu, model lăbuțe", COLLAR_DESC),
    ("xs-s", "zgarda", "albastru, model lăbuțe și oase", COLLAR_DESC),
    ("xs-s", "zgarda", "roz, model Puppy", COLLAR_DESC),
    ("xs-s", "zgarda", "albastru", COLLAR_DESC),
    ("xs-s", "zgarda", "negru, model craniu", COLLAR_DESC),
    # Zgărzi clasice M/L
    ("m-l", "zgarda", "negru", COLLAR_DESC),
    ("m-l", "zgarda", "albastru, model oase", COLLAR_DESC),
    ("m-l", "zgarda", "roșu, model oase", COLLAR_DESC),
    ("m-l", "zgarda", "albastru, model lăbuțe și oase", COLLAR_DESC),
    ("m-l", "zgarda", "roșu, model lăbuțe și oase", COLLAR_DESC),
    ("m-l", "zgarda", "roșu, model lăbuțe", COLLAR_DESC),
    ("m-l", "zgarda", "negru, model craniu", COLLAR_DESC),
    # Zgărzi clasice XL
    ("xl", "zgarda", "negru", COLLAR_DESC),
    # Zgărzi reflectorizante
    ("3xs-2xs", "zgarda-refl", "negru", REFL_DESC),
    ("3xs-2xs", "zgarda-refl", "galben", REFL_DESC),
    ("3xs-2xs", "zgarda-refl", "albastru", REFL_DESC),
    ("xs-s", "zgarda-refl", "negru", REFL_DESC),
    ("xs-s", "zgarda-refl", "roșu", REFL_DESC),
    ("xs-s", "zgarda-refl", "albastru", REFL_DESC),
    ("xs-s", "zgarda-refl", "mov", REFL_DESC),
    ("xs-s", "zgarda-refl", "galben", REFL_DESC),
    ("m-l", "zgarda-refl", "roșu", REFL_DESC),
    ("m-l", "zgarda-refl", "albastru", REFL_DESC),
    ("m-l", "zgarda-refl", "mov", REFL_DESC),
    ("m-l", "zgarda-refl", "galben", REFL_DESC),
    ("m-l", "zgarda-refl", "negru", REFL_DESC),
    # Hamuri fluture (Kelebek) — reflectorizante
    ("xs", "ham-fluture", "negru", BUTTERFLY_DESC),
    ("s", "ham-fluture", "negru", BUTTERFLY_DESC),
    ("m", "ham-fluture", "negru", BUTTERFLY_DESC),
    ("l", "ham-fluture", "negru", BUTTERFLY_DESC),
    ("l", "ham-fluture", "albastru", BUTTERFLY_DESC),
    ("m", "ham-fluture", "mov", BUTTERFLY_DESC),
    ("l", "ham-fluture", "mov", BUTTERFLY_DESC),
    ("unica", "ham-fluture", "galben neon", BUTTERFLY_DESC),
    ("xs", "ham-fluture", "portocaliu neon", BUTTERFLY_DESC),
    ("m", "ham-fluture", "roșu", BUTTERFLY_DESC),
    ("l", "ham-fluture", "roșu", BUTTERFLY_DESC),
    ("l", "ham-fluture", "portocaliu", BUTTERFLY_DESC),
    ("l", "ham-fluture", "roz", BUTTERFLY_DESC),
    # Hamuri Air Net (plasă)
    ("2xs", "ham-airnet", "portocaliu neon", AIRNET_DESC),
    ("2xs", "ham-airnet", "verde mușchi", AIRNET_DESC),
    ("xs", "ham-airnet", "negru", AIRNET_DESC),
    ("xs", "ham-airnet", "mov", AIRNET_DESC),
    ("xs", "ham-airnet", "albastru", AIRNET_DESC),
    ("xs", "ham-airnet", "galben neon", AIRNET_DESC),
    ("xs", "ham-airnet", "roz", AIRNET_DESC),
    ("s", "ham-airnet", "corai", AIRNET_DESC),
    ("s", "ham-airnet", "verde crin", AIRNET_DESC),
    ("s", "ham-airnet", "roz", AIRNET_DESC),
    ("m", "ham-airnet", "roz neon", AIRNET_DESC),
    ("m", "ham-airnet", "galben neon", AIRNET_DESC),
    ("m", "ham-airnet", "mov", AIRNET_DESC),
    ("m", "ham-airnet", "roșu", AIRNET_DESC),
    ("m", "ham-airnet", "albastru", AIRNET_DESC),
    ("l", "ham-airnet", "portocaliu neon", AIRNET_DESC),
    ("l", "ham-airnet", "roșu", AIRNET_DESC),
    ("l", "ham-airnet", "albastru", AIRNET_DESC),
    ("l", "ham-airnet", "verde crin", AIRNET_DESC),
    ("xl", "ham-airnet", "roșu", AIRNET_DESC),
    ("xl", "ham-airnet", "albastru", AIRNET_DESC),
    ("xl", "ham-airnet", "verde mușchi", AIRNET_DESC),
    ("xl", "ham-airnet", "verde crin", AIRNET_DESC),
    ("xl", "ham-airnet", "roz", AIRNET_DESC),
    ("xl", "ham-airnet", "negru", AIRNET_DESC),
    # Hamuri moale Basic
    ("xs", "ham-basic", "albastru", BASIC_DESC),
    ("s", "ham-basic", "albastru", BASIC_DESC),
    ("l", "ham-basic", "albastru", BASIC_DESC),
    ("m", "ham-basic", "roșu", BASIC_DESC),
    ("s", "ham-basic", "portocaliu", BASIC_DESC),
    ("l", "ham-basic", "portocaliu", BASIC_DESC),
    ("xs", "ham-basic", "roz", BASIC_DESC),
    ("unica", "ham-basic", "neon", BASIC_DESC),
]

LEASHES = [
    ("lesa-dubla-15cm", "Lesă dublă Natura 1,5 cm", "roșu", LEASH_DBL_DESC),
    ("lesa-dubla-15cm", "Lesă dublă Natura 1,5 cm", "albastru", LEASH_DBL_DESC),
    ("lesa-dubla-25cm", "Lesă dublă Natura 2,5 cm", "albastru", LEASH_DBL_DESC),
    ("lesa-dubla-25cm", "Lesă dublă Natura 2,5 cm", "negru", LEASH_DBL_DESC),
    ("lesa-uzatma-140", "Lesă Natura 140 × 2 cm", "roșu", LEASH_EXT_DESC),
    ("lesa-uzatma-140", "Lesă Natura 140 × 2 cm", "verde crin", LEASH_EXT_DESC),
    ("lesa-uzatma-140", "Lesă Natura 140 × 2 cm", "verde mușchi", LEASH_EXT_DESC),
    ("lesa-uzatma-140", "Lesă Natura 140 × 2 cm", "verde viridian", LEASH_EXT_DESC),
    ("lesa-neagra", "Lesă Natura", "negru", LEASH_EXT_DESC),
]

CAT_COLLARS = [
    ("zgarda-pisica", "unica", "negru", CAT_DESC),
    ("zgarda-pisica", "unica", "albastru", CAT_DESC),
    ("zgarda-pisica", "unica", "mov", CAT_DESC),
    ("zgarda-pisica", "unica", "model pisicuțe", CAT_DESC),
    ("zgarda-pisica", "unica", "albastru, model craniu", CAT_DESC),
    ("zgarda-pisica", "unica", "verde, model nazar boncuk", CAT_DESC),
    ("zgarda-pisoi", "unica", "roz", CAT_DESC),
    ("zgarda-pisoi", "unica", "model nazar boncuk", CAT_DESC),
    ("zgarda-pisoi", "unica", "roșu, model peștișor și lăbuțe", CAT_DESC),
    ("ham-pisica", "unica", "roșu", CAT_HARN_DESC),
    ("ham-pisica", "unica", "zebră curcubeu", CAT_HARN_DESC),
    ("ham-pisica", "unica", "albastru, model kîlçık și lăbuțe", CAT_HARN_DESC),
    ("ham-pisoi", "unica", "roz", CAT_HARN_DESC),
    ("ham-airnet-pisica", "xl", "roșu", CAT_HARN_DESC),
    ("ham-airnet-pisica", "l", "verde lime neon", CAT_HARN_DESC),
    ("ham-airnet-pisica", "l", "albastru", CAT_HARN_DESC),
]

COLOR_EN = {
    "roșu": "red", "albastru": "blue", "negru": "black", "roz": "pink",
    "mov": "purple", "galben": "yellow", "verde": "green", "portocaliu": "orange",
    "corai": "coral", "roșu, model lăbuțe și oase": "red paw and bone",
    "albastru, model lăbuțe și oase": "blue paw and bone",
    "roz, model Puppy": "pink puppy", "negru, model oase colorate": "colored bone black",
    "albastru, model oase": "blue bone patterned", "roșu, model oase": "red bone patterned",
    "roșu, model lăbuțe": "red paw patterned", "negru, model craniu": "black skull",
    "galben neon": "neon yellow", "portocaliu neon": "neon orange",
    "roz neon": "neon pink", "verde mușchi": "moss green", "verde crin": "lily green",
    "verde viridian": "viridian green", "verde lime neon": "neon lime",
    "neon": "neon", "model pisicuțe": "cat patterned",
    "albastru, model craniu": "blue skull", "verde, model nazar boncuk": "green nazar boncuk",
    "model nazar boncuk": "nazar boncuk", "roșu, model peștișor și lăbuțe": "red fish skeleton paw",
    "zebră curcubeu": "rainbow zebra", "albastru, model kîlçık și lăbuțe": "blue fishbone paw",
}

TYPE_NAME = {
    "zgarda": "Zgardă Natura pentru câini",
    "zgarda-refl": "Zgardă reflectorizantă Natura pentru câini",
    "ham-fluture": "Ham tip fluture reflectorizant Natura pentru câini",
    "ham-airnet": "Ham Air Net Natura pentru câini",
    "ham-basic": "Ham moale Natura Basic pentru câini",
    "zgarda-pisica": "Zgardă Natura pentru pisici adulte",
    "zgarda-pisoi": "Zgardă Natura pentru pisoi",
    "ham-pisica": "Ham Natura pentru pisici",
    "ham-pisoi": "Ham Natura pentru pisoi",
    "ham-airnet-pisica": "Ham Air Net Natura pentru pisici",
}

PRODUCT_TYPE = {
    "zgarda": "Zgărzi pentru câini", "zgarda-refl": "Zgărzi pentru câini",
    "ham-fluture": "Hamuri pentru câini", "ham-airnet": "Hamuri pentru câini",
    "ham-basic": "Hamuri pentru câini",
    "zgarda-pisica": "Zgărzi pentru pisici", "zgarda-pisoi": "Zgărzi pentru pisici",
    "ham-pisica": "Hamuri pentru pisici", "ham-pisoi": "Hamuri pentru pisici",
    "ham-airnet-pisica": "Hamuri pentru pisici",
}


def slugify_color(c):
    return (c.lower().replace("ș", "s").replace("ț", "t").replace("â", "a")
            .replace("î", "i").replace("ă", "a").replace("î", "i")
            .replace(" ", "-").replace(",", "").replace("kîlçık", "kilcik"))


def make(size_key, type_key, colour, desc, category="Câini"):
    size_label, cm = SIZES[size_key]
    colour_slug = slugify_color(colour)
    slug = f"natura-{type_key}-{size_key}-{colour_slug}"
    name = f"{TYPE_NAME[type_key]} {size_label} – {colour}"
    pkg = f"{size_label} ({cm})" if cm else size_label
    labels = ["Natura Pet", PRODUCT_TYPE[type_key], f"Mărime {size_label}", f"Culoare: {colour}"]
    return {
        "id": slug,
        "name": name,
        "slug": slug,
        "category": category,
        "description": f"{desc} Culoare: {colour}. Mărime: {size_label}" + (f" ({cm})." if cm else "."),
        "image": "",
        "images": [],
        "labels": labels,
        "package_sizes": [pkg],
        "url": f"https://naturapetfood.com/product/{slug}/",
        "product_type": PRODUCT_TYPE[type_key],
        "breadcrumbs": ["Acasă", "Produse", "Natura Pet", PRODUCT_TYPE[type_key]],
        "search_query": f"Natura {'cat' if category == 'Pisici' else 'dog'} {type_key.replace('zgarda','collar').replace('ham','harness').replace('-refl',' reflective').replace('-fluture',' butterfly').replace('-airnet',' air net').replace('-basic',' basic').replace('-pisica','').replace('-pisoi',' kitten')} {size_label} {COLOR_EN.get(colour, colour)}",
    }


def main():
    data = json.load(open(JSON_PATH, encoding="utf-8"))
    products = data["products"]
    existing = {p["slug"] for p in products}

    # 1) fix image paths for existing products
    fixed = 0
    for p in products:
        local = f"/products/natura/{p['slug']}.webp"
        if os.path.exists(os.path.join(IMG_DIR, f"{p['slug']}.webp")) and p["image"] != local:
            p["image"] = local
            p["images"] = [local]
            fixed += 1
    print(f"fixed image paths: {fixed}")

    # 2) seed new products
    new = []
    for size_key, tkey, colour, desc in DOG_COLLARS:
        p = make(size_key, tkey, colour, desc)
        if p["slug"] not in existing:
            new.append(p)
            existing.add(p["slug"])
    for lslug, lname, colour, desc in LEASHES:
        colour_slug = slugify_color(colour)
        slug = f"natura-{lslug}-{colour_slug}"
        if slug in existing:
            continue
        new.append({
            "id": slug, "name": f"{lname} – {colour}", "slug": slug,
            "category": "Câini",
            "description": f"{desc} Culoare: {colour}.",
            "image": "", "images": [],
            "labels": ["Natura Pet", "Lese și zgărzi pentru câini", f"Culoare: {colour}"],
            "package_sizes": ["140 cm" if "140" in lname else lname.split()[-2] + " " + lname.split()[-1]],
            "url": f"https://naturapetfood.com/product/{slug}/",
            "product_type": "Lese pentru câini",
            "breadcrumbs": ["Acasă", "Produse", "Natura Pet", "Lese pentru câini"],
            "search_query": f"Natura dog leash {lname.split('Natura')[-1].strip()} {COLOR_EN.get(colour, colour)}",
        })
        existing.add(slug)
    for tkey, size_key, colour, desc in CAT_COLLARS:
        p = make(size_key, tkey, colour, desc, category="Pisici")
        if p["slug"] not in existing:
            new.append(p)
            existing.add(p["slug"])

    products.extend(new)
    data["product_count"] = len(products)
    json.dump(data, open(JSON_PATH, "w", encoding="utf-8"), ensure_ascii=False, indent=2)
    print(f"added {len(new)} products, total {len(products)}")
    for p in new:
        print(" +", p["slug"], "|", p["name"])


if __name__ == "__main__":
    main()
