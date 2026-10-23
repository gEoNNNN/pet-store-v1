"""Adauga in natura_products.json categoriile care-training:
cat-and-dog-beds, brushes-and-combs, ceramic-bowls,
plastic-accessories, fence-playground (din Wayback, ian. 2025).
Nume in romana cu model/culoare/marime; imaginile le ia img_finder.py.
"""
import io
import json
import sys

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8")

FILE = "scrape/natura_products.json"
BASE = "https://naturapetfood.com/product/"

CULORI = {
    "beige": "bej", "gold": "auriu", "gray-burgundy-plaid": "gri-bordo în carouri",
    "cinnamon": "scorțișoară", "light-blue": "albastru deschis", "pink": "roz",
    "burgundy": "bordo", "coffee": "maro cafea", "navy-blue": "bleumarin",
    "green": "verde", "black": "negru", "blue": "albastru", "gray": "gri",
    "red": "roșu",
}

ACCESORII = "Accesorii și jucării"
IGIENA = "Curățare, igienă și dezinfecție"


def produs(slug, name, category, ptype, labels_extra, sizes, desc):
    return {
        "id": slug,
        "name": name,
        "slug": slug,
        "category": category,
        "description": desc,
        "image": "",
        "images": [],
        "labels": ["Natura Pet", ptype] + labels_extra,
        "package_sizes": sizes,
        "url": BASE + slug + "/",
        "product_type": ptype,
        "breadcrumbs": ["Acasă", "Produse", "Natura Pet", ptype],
        "features": [],
        "ingredient_tags": [],
        "videos": [],
        "sections": {"Descriere": {"text": desc, "tables": []}},
        "fresh_ingredients": [],
        "metabolizable_energy": None,
        "raw_text": "",
    }


def cul(slug):
    """Extrage culoarea din sfarsitul slug-ului."""
    for k in sorted(CULORI, key=len, reverse=True):
        if slug.endswith("-" + k):
            return CULORI[k]
    return None


def nr(slug):
    for n in ("no-1", "no-2", "no-3"):
        if n in slug:
            return "Nr. " + n[-1]
    return None


PRODUSE = []

# ---------------- cat-and-dog-beds (24) ----------------
BEDS_TIP = {
    "natura-bone-cushion-bed": ("Pat-pernă Natura Bone pentru câini și pisici",
        "Pat-pernă moale Natura Bone pentru câini și pisici, cu husă din material textil rezistent și umplutură confortabilă care își păstrează forma. Ideală ca loc de odihnă în casă sau în cușcă."),
    "natura-bone-oval-bed-bed": ("Pat oval Natura Bone pentru câini și pisici",
        "Pat oval Natura Bone pentru câini și pisici, cu margini înălțate care oferă sprijin și senzație de siguranță. Material textil moale, ușor de întreținut."),
    "natura-bone-oval-bed": ("Pat oval Natura Bone pentru câini și pisici",
        "Pat oval Natura Bone pentru câini și pisici, cu margini înălțate care oferă sprijin și senzație de siguranță. Material textil moale, ușor de întreținut."),
    "natura-bone-oval-bed-set": ("Set pat oval Natura Bone pentru câini și pisici",
        "Set Natura Bone cu pat oval și pătură/jucărie asortată pentru câini și pisici. Material textil moale și confortabil, potrivit pentru odihna zilnică."),
    "natura-cat-bed": ("Pat Natura pentru pisici",
        "Pat moale Natura pentru pisici, confecționat din material textil plăcut la atingere, cu formă care oferă căldură și siguranță. Ușor de curățat și de mutat."),
    "natura-cube-house-bed": ("Casuță-cub Natura pentru pisici și câini mici",
        "Casuță în formă de cub Natura pentru pisici și câini de talie mică — spațiu închis și liniștit pentru odihnă, cu intrare frontală și pernă interioară moale."),
    "natura-cylinder-functional-house-bed": ("Casuță cilindrică multifuncțională Natura",
        "Casuță cilindrică multifuncțională Natura pentru pisici și câini mici — poate fi folosită deschisă ca pat sau închisă ca vizuină, din material textil moale."),
}
BEDS = [
    "natura-bone-cushion-bed-no-1-beige", "natura-bone-cushion-bed-no-1-gold",
    "natura-bone-cushion-bed-no-1-gray-burgundy-plaid",
    "natura-bone-cushion-bed-no-2-beige", "natura-bone-cushion-bed-no-2-gold",
    "natura-bone-cushion-bed-no-2-gray-burgundy-plaid",
    "natura-bone-oval-bed-bed-no-1-cinnamon", "natura-bone-oval-bed-bed-no-2-cinnamon",
    "natura-bone-oval-bed-no-1-beige", "natura-bone-oval-bed-no-1-light-blue",
    "natura-bone-oval-bed-no-2-beige", "natura-bone-oval-bed-no-2-light-blue",
    "natura-bone-oval-bed-set-no-1-pink", "natura-bone-oval-bed-set-no-2-pink",
    "natura-cat-bed-burgundy", "natura-cat-bed-coffee", "natura-cat-bed-gold",
    "natura-cat-bed-navy-blue",
    "natura-cube-house-bed-burgundy", "natura-cube-house-bed-coffee",
    "natura-cube-house-bed-gray-burgundy-plaid", "natura-cube-house-bed-green",
    "natura-cylinder-functional-house-bed-gold",
    "natura-cylinder-functional-house-bed-gray-burgundy-plaid",
]
for s in BEDS:
    base = next(v for k, v in BEDS_TIP.items() if s.startswith(k))
    titlu, desc0 = base
    c, n = cul(s), nr(s)
    sufix = (f" – {c}" if c else "") + (f" ({n})" if n else "")
    extra = ((f" Culoare: {c}." if c else "") + (f" Dimensiune: {n}." if n else ""))
    cat = "Pisici" if "cat-bed" in s else "Câini"
    specii = ["Pisici", "Câini"] if ("cat-bed" in s or "cube" in s or "cylinder" in s) else ["Câini", "Pisici"]
    PRODUSE.append(produs(s, titlu + sufix, cat, "Paturi și culușuri",
                          specii + ([f"Culoare: {c}"] if c else []),
                          [n] if n else [], desc0 + extra))

# ---------------- brushes-and-combs (15) ----------------
PERII = {
    "natura-cat-dog-oval-brush-mk328-small":
        ("Perie ovală Natura pentru câini și pisici MK328 – S",
         "Perie ovală Natura cu peri flexibili pentru descurcarea și netezirea blăii câinilor și pisicilor. Mâner ergonomic, potrivită pentru uz zilnic.", "S"),
    "natura-double-side-oval-pet-brush-mk325-small":
        ("Perie ovală cu două fețe Natura MK325 – S",
         "Perie ovală cu două fețe Natura: o față cu peri pentru descurcat și o față pentru finisare și luciu. Pentru câini și pisici.", "S"),
    "natura-double-side-oval-pet-brush-mk326-large":
        ("Perie ovală cu două fețe Natura MK326 – L",
         "Perie ovală cu două fețe Natura: o față cu peri pentru descurcat și o față pentru finisare și luciu. Pentru câini și pisici.", "L"),
    "natura-pet-flea-comb-mk335":
        ("Pieptene pentru purici Natura MK335",
         "Pieptene fin Natura pentru îndepărtarea puricilor și a murdăriei din blana câinilor și pisicilor. Dinți metalici desi, mâner confortabil.", None),
    "natura-pet-nail-clipper-mk621":
        ("Clește pentru unghii Natura MK621",
         "Clește pentru tăiatul unghiilor câinilor și pisicilor, cu lame din oțel inoxidabil și mâner antiderapant pentru o tăiere sigură și precisă.", None),
    "natura-pet-nail-scissor-mk638-small":
        ("Foarfecă pentru unghii Natura MK638 – S",
         "Foarfecă pentru unghii Natura, dimensiune mică, ideală pentru pisici și câini de talie mică. Lame din oțel, mâner ergonomic.", "S"),
    "natura-rubber-grooming-glove-ld-3024":
        ("Mănușă de îngrijire din cauciuc Natura LD-3024",
         "Mănușă de îngrijire Natura din cauciuc moale — îndepărtează părul căzut și masează pielea în timpul periajului. Pentru câini și pisici.", None),
    "natura-self-clean-small-pin-pet-brush-mk406-medium":
        ("Perie cu auto-curățare Natura MK406 – M",
         "Perie cu ace și buton de auto-curățare Natura — părul strâns se eliberează cu o apăsare. Pentru câini și pisici cu blană medie/lungă.", "M"),
    "natura-self-clean-small-pin-pet-brush-mk407-large":
        ("Perie cu auto-curățare Natura MK407 – L",
         "Perie cu ace și buton de auto-curățare Natura — părul strâns se eliberează cu o apăsare. Pentru câini și pisici cu blană medie/lungă.", "L"),
    "natura-small-pin-metalic-frame-pet-brush-mk9502-medium":
        ("Perie cu ace și ramă metalică Natura MK9502 – M",
         "Perie cu ace pe ramă metalică Natura pentru descurcarea blăii câinilor și pisicilor. Ace rotunjite, delicate cu pielea.", "M"),
    "natura-small-pin-metalic-frame-pet-brush-mk9503-small":
        ("Perie cu ace și ramă metalică Natura MK9503 – S",
         "Perie cu ace pe ramă metalică Natura pentru descurcarea blăii câinilor și pisicilor. Ace rotunjite, delicate cu pielea.", "S"),
    "natura-small-pin-pet-brush-mk421-small":
        ("Perie cu ace Natura MK421 – S",
         "Perie cu ace Natura pentru periajul zilnic al câinilor și pisicilor. Mâner ergonomic, ace cu vârf rotunjit.", "S"),
    "natura-small-pin-pet-brush-mk422-medium":
        ("Perie cu ace Natura MK422 – M",
         "Perie cu ace Natura pentru periajul zilnic al câinilor și pisicilor. Mâner ergonomic, ace cu vârf rotunjit.", "M"),
    "natura-small-pin-pet-brush-mk423-large":
        ("Perie cu ace Natura MK423 – L",
         "Perie cu ace Natura pentru periajul zilnic al câinilor și pisicilor. Mâner ergonomic, ace cu vârf rotunjit.", "L"),
    "natura-small-pin-pet-brush-mk424-xlarge":
        ("Perie cu ace Natura MK424 – XL",
         "Perie cu ace Natura pentru periajul zilnic al câinilor și pisicilor. Mâner ergonomic, ace cu vârf rotunjit.", "XL"),
}
for s, (titlu, desc, mar) in PERII.items():
    PRODUSE.append(produs(s, titlu, "Câini", "Perii, piepteni și îngrijirea blănii",
                          [IGIENA, "Câini", "Pisici"], [mar] if mar else [], desc))

# ---------------- ceramic-bowls (18) ----------------
BOLURI = [
    ("natura-ceramic-bowl-axolotl-250-ml-13-cm", "Axolotl", "250 ml (13 cm)", "Pisici"),
    ("natura-ceramic-bowl-cat-blinky-200-ml-14-cm", "Cat Blinky", "200 ml (14 cm)", "Pisici"),
    ("natura-ceramic-bowl-cat-fish-200-ml-14-cm", "Cat Fish", "200 ml (14 cm)", "Pisici"),
    ("natura-ceramic-bowl-cat-meow-200-ml-14-cm", "Cat Meow", "200 ml (14 cm)", "Pisici"),
    ("natura-ceramic-bowl-cat-smiley-200-ml-14-cm", "Cat Smiley", "200 ml (14 cm)", "Pisici"),
    ("natura-ceramic-bowl-dog-bone-400-ml-15-cm", "Dog Bone", "400 ml (15 cm)", "Câini"),
    ("natura-ceramic-bowl-dog-love-400-ml-15-cm", "Dog Love", "400 ml (15 cm)", "Câini"),
    ("natura-ceramic-bowl-dog-rainbow-400-ml-15-cm", "Dog Rainbow", "400 ml (15 cm)", "Câini"),
    ("natura-ceramic-bowl-jack-250-ml-14-5-cm", "Jack", "250 ml (14,5 cm)", "Câini"),
    ("natura-ceramic-bowl-meow-250-ml-14-5-cm", "Meow", "250 ml (14,5 cm)", "Pisici"),
    ("natura-ceramic-bowl-moon-cat-250-ml-13-cm", "Moon Cat", "250 ml (13 cm)", "Pisici"),
    ("natura-ceramic-bowl-prince-250-ml-13-cm", "Prince", "250 ml (13 cm)", "Câini"),
    ("natura-ceramic-bowl-princess-250-ml-13-cm", "Princess", "250 ml (13 cm)", "Pisici"),
    ("natura-ceramic-bowl-rainbow-250-ml-14-5-cm", "Rainbow", "250 ml (14,5 cm)", "Pisici"),
    ("natura-ceramic-bowl-totorro-250-ml-14-5-cm", "Totorro", "250 ml (14,5 cm)", "Pisici"),
    ("natura-ceramic-bowl-totorro-400-ml-15-cm", "Totorro", "400 ml (15 cm)", "Pisici"),
    ("natura-ceramic-bowl-ufo-250-ml-145-cm", "UFO", "250 ml (14,5 cm)", "Pisici"),
    ("natura-ceramic-bowl-zz-cat-250-ml-13-cm", "ZZ Cat", "250 ml (13 cm)", "Pisici"),
]
for s, model, volum, sp in BOLURI:
    desc = (f"Bol ceramic Natura pentru hrană sau apă, model {model}. Ceramica este grea și stabilă, "
            f"nu se mișcă în timpul mesei și se spală ușor, inclusiv în mașina de spălat vase. "
            f"Volum: {volum}.")
    specii = [sp] + (["Pisici"] if sp == "Câini" else ["Câini"])
    PRODUSE.append(produs(s, f"Bol ceramic Natura {model} {volum}", sp, "Castroane și boluri",
                          specii, [volum], desc))

# ---------------- plastic-accessories (19) ----------------
PLASTIC = [
    ("natura-barrel-pet-food-container-with-wheels-pt-280",
     "Container cu roți pentru hrană Natura PT-280", "Câini",
     ["Câini", "Pisici"], ACCESORII, [],
     "Container tip butoi Natura cu roți pentru depozitarea hranei uscate. Capac cu închidere ermetică care păstrează prospețimea și roți pentru deplasare ușoară."),
    ("natura-cat-head-toilet-mat-black", "Covoraș pentru litieră Natura Cat Head – negru", "Pisici",
     ["Pisici"], IGIENA, [], None),
    ("natura-cat-head-toilet-mat-blue", "Covoraș pentru litieră Natura Cat Head – albastru", "Pisici",
     ["Pisici"], IGIENA, [], None),
    ("natura-cat-head-toilet-mat-gray", "Covoraș pentru litieră Natura Cat Head – gri", "Pisici",
     ["Pisici"], IGIENA, [], None),
    ("natura-cat-head-toilet-mat-red", "Covoraș pentru litieră Natura Cat Head – roșu", "Pisici",
     ["Pisici"], IGIENA, [], None),
    ("natura-cat-toilet-mat-black", "Covoraș pentru litieră Natura – negru", "Pisici",
     ["Pisici"], IGIENA, [], None),
    ("natura-cat-toilet-mat-gray", "Covoraș pentru litieră Natura – gri", "Pisici",
     ["Pisici"], IGIENA, [], None),
    ("natura-cat-toilet-mat-navy-blue", "Covoraș pentru litieră Natura – bleumarin", "Pisici",
     ["Pisici"], IGIENA, [], None),
    ("natura-cat-toilet-mat-red", "Covoraș pentru litieră Natura – roșu", "Pisici",
     ["Pisici"], IGIENA, [], None),
    ("natura-dog-training-toilet-pt-310",
     "Toaletă de antrenament pentru câini Natura PT-310", "Câini",
     ["Câini"], IGIENA, ["PT-310"],
     "Toaletă de antrenament Natura pentru căței și câini de apartament — tavă din plastic cu grătar detașabil, ușor de spălat. Ajută la învățarea igienelor în casă."),
    ("natura-double-food-water-bowl-pt-260",
     "Bol dublu pentru hrană și apă Natura PT-260", "Câini",
     ["Câini", "Pisici"], ACCESORII, ["PT-260"],
     "Bol dublu din plastic Natura pentru hrană și apă, pe suport comun stabil. Compartimentele se spală ușor și sunt potrivite pentru câini și pisici."),
    ("natura-food-water-bowl-pt-250",
     "Bol pentru hrană și apă Natura PT-250", "Câini",
     ["Câini", "Pisici"], ACCESORII, ["PT-250"],
     "Bol din plastic rezistent Natura pentru hrană sau apă. Ușor de spălat, potrivit pentru uz zilnic la câini și pisici."),
    ("natura-food-water-bowl-pt-255",
     "Bol pentru hrană și apă Natura PT-255", "Câini",
     ["Câini", "Pisici"], ACCESORII, ["PT-255"],
     "Bol din plastic rezistent Natura pentru hrană sau apă. Ușor de spălat, potrivit pentru uz zilnic la câini și pisici."),
    ("natura-food-water-dispenser-pt-200",
     "Dispenser pentru hrană și apă Natura PT-200", "Câini",
     ["Câini", "Pisici"], ACCESORII, ["PT-200"],
     "Dispenser automat Natura pentru hrană uscată sau apă — rezervorul reumple bolul pe măsură ce animalul consumă. Ideal când sunteți plecați de acasă."),
    ("natura-food-water-dispenser-pt-205",
     "Dispenser pentru hrană și apă Natura PT-205", "Câini",
     ["Câini", "Pisici"], ACCESORII, ["PT-205"],
     "Dispenser automat Natura pentru hrană uscată sau apă — rezervorul reumple bolul pe măsură ce animalul consumă. Ideal când sunteți plecați de acasă."),
    ("natura-litter-tray-three-part-with-separating-system-pt300",
     "Litieră în trei părți cu sistem de separare Natura PT-300", "Pisici",
     ["Pisici"], IGIENA, ["PT-300"],
     "Litieră Natura din trei părți cu sistem de sită încorporat — permite separarea nisipului curat de cel folosit fără lopățică. Din plastic rezistent, ușor de curățat."),
    ("natura-plastic-cat-litter-scoop-pt-355",
     "Lopățică pentru litieră Natura PT-355", "Pisici",
     ["Pisici"], IGIENA, ["PT-355"],
     "Lopățică din plastic Natura pentru curățarea litierei, cu fante care lasă nisipul curat să cadă înapoi în tavă."),
    ("natura-plastic-food-storage-container-6-lt-pt-285",
     "Container plastic pentru hrană 6 Lt Natura PT-285", "Câini",
     ["Câini", "Pisici"], ACCESORII, ["6 Lt", "PT-285"],
     "Container din plastic Natura de 6 litri pentru depozitarea hranei uscate, cu capac cu închidere ermetică care păstrează prospețimea și aromele."),
    ("natura-plastic-scoop-pt-360",
     "Lopățică din plastic Natura PT-360", "Câini",
     ["Câini", "Pisici"], IGIENA, ["PT-360"],
     "Lopățică din plastic Natura pentru hrană uscată sau nisip — utilă la porționarea hranei și curățarea litierei."),
]
MAT_DESC = ("Covoraș Natura pentru litieră, din plastic flexibil cu suprafață care reține "
            "nisipul de pe lăbuțe și menține podeaua curată. Se clătește ușor.")
for s, titlu, cat, specii, vetlabel, sizes, desc in PLASTIC:
    if desc is None:
        desc = MAT_DESC + (" Model Cat Head." if "cat-head" in s else "")
    PRODUSE.append(produs(s, titlu, cat, "Accesorii din plastic",
                          [vetlabel] + specii, sizes, desc))

# ---------------- fence-playground (3) ----------------
TARC = {
    "natura-hexagon-pet-playpen-small": "S",
    "natura-hexagon-pet-playpen-medium": "M",
    "natura-hexagon-pet-playpen-large": "L",
}
for s, mar in TARC.items():
    titlu = f"Târc hexagonal Natura pentru animale – {mar}"
    desc = (f"Târc hexagonal Natura pentru câini, căței și alte animale de companie — "
            f"spațiu sigur de joacă sau odihnă, în casă sau afară. Panourile se montează și "
            f"se demontează rapid, fără scule. Mărime: {mar}.")
    PRODUSE.append(produs(s, titlu, "Câini", "Târcuri și parcuri de joacă",
                          [ACCESORII, "Câini", "Pisici"], [mar], desc))


def main():
    data = json.load(open(FILE, encoding="utf-8"))
    existente = {p["slug"] for p in data["products"]}
    noi = [p for p in PRODUSE if p["slug"] not in existente]
    data["products"].extend(noi)
    if "product_count" in data:
        data["product_count"] = len(data["products"])
    json.dump(data, open(FILE, "w", encoding="utf-8"), ensure_ascii=False, indent=2)
    print(f"adaugate: {len(noi)}, total: {len(data['products'])}")


if __name__ == "__main__":
    main()
