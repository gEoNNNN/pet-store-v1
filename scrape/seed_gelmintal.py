import io
import json
import sys

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8")

CAT = "Antiparazitare interne și externe"
IMG = "/products/ekoprom/"
G = "https://www.ekoprom.org/brands/neoterica/gelmintal/"
LABELS = ["Ekoprom", "Neoterica", "Gelmintal", "Antiparazitar", "Anthelmintic"]

MINI_DESC = (
    "Gelmintal Mini Tabs — primul anthelmintic din viața animalului: eliberează "
    "cățeii și pisoii nu doar de helminti, ci și de coccidii, care provoacă "
    "diaree, întârziere în creștere și deces. Tabletele au aromă de carne, ceea "
    "ce facilitează administrarea chiar și la animale agresive, încăpățânate sau "
    "sperioase. Distrug eficient nematozii, larvele acestora și coccidiile. "
    "Produsul aparține clasei a 4-a de periculozitate (cea mai scăzută) și poate "
    "fi utilizat de la vârsta de 2 săptămâni și greutatea de 500 g. Formulă "
    "dezvoltată de Neoterica GmbH (Germania)."
)
MINI_ADMIN = (
    "Dozare: 1 tabletă la 1 kg greutate corporală; în ambalaj: 10 tablete. "
    "Se administrează oral, individual, cu o cantitate mică de hrană sau forțat "
    "pe rădăcina limbii, după hrănire. Produsul prezintă contraindicații — "
    "este necesară consultarea medicului veterinar."
)

def t_desc(species, per_kg):
    return (
        f"Gelmintal T se administrează {species} cu scop curativ și profilactic în "
        "nematodoze (toxocaroză, toxascarioză, uncinarioză, anchilostomoză, "
        "tricocefaloză), cestodoze (teniaze, dipilidioză, echinococoză, "
        "difilobotrioză, mezocestoidoză) și invazii mixte nematodo-cestone, precum "
        "și pentru prevenirea dirofilariozei. Combinația moxidectin + praziquantel "
        "acționează asupra tuturor fazelor de dezvoltare ale helmintilor rotunzi "
        "și în formă de bandă."
    ), (
        f"Se administrează oral, individual, la hrănirea de dimineață cu o "
        f"cantitate mică de hrană sau forțat pe rădăcina limbii, după hrănire, "
        f"în doza de 1 tabletă la {per_kg} greutate corporală."
    )

K_DESC = (
    "Gelmintal K se administrează pisicilor cu scop curativ și profilactic în "
    "nematodoze intestinale (toxocaroză, toxascarioză, uncinarioză, "
    "anchilostomoză), cestodoze (teniaze, dipilidioză, echinococoze), entomoze "
    "produse de purici, otodectoză și notoedroză, precum și pentru prevenirea "
    "dirofilariozei. Picăturile spot-on reduc stresul în timpul aplicării."
)
K_ADMIN = (
    "Se aplică spot-on pe pielea uscată și integră. Se rupe capătul pipetei și "
    "produsul se aplică pe piele, în locuri inaccesibile linsului — în zona "
    "gâtului, la baza craniului."
)
C_DESC = (
    "Gelmintal C se administrează câinilor cu scop curativ și profilactic în "
    "nematodoze intestinale (toxocaroză, toxascarioză, uncinarioză, "
    "anchilostomoză), cestodoze (teniaze, dipilidioză, echinococoză), entomoze "
    "produse de purici, păduchi și malofagi, demodectoză, otodectoză și "
    "sarcoptoză, precum și pentru prevenirea dirofilariozei. Picăturile spot-on "
    "reduc stresul în timpul aplicării."
)
C_ADMIN = (
    "Se aplică spot-on pe pielea uscată și integră. Se rupe capătul pipetei, se "
    "desface blana și produsul se aplică pe piele, în locuri inaccesibile "
    "linsului — între omoplați, la baza gâtului. La câinii mari, conținutul "
    "pipetelor se aplică în 3–4 puncte."
)

TABS_FEATS = [
    "Combinație unică moxidectin + praziquantel — eficientă inclusiv împotriva paraziților cu rezistență la alte preparate.",
    "Acționează asupra tuturor fazelor de dezvoltare ale nematozilor și cestozilor.",
    "Arome alimentare pentru o mai bună acceptare de către animal.",
    "Dozaj convenabil — efect la un volum mic de produs.",
]
DROPS_FEATS = [
    "Picături pe cernel (spot-on) — reduc stresul în timpul aplicării.",
    "Combinație moxidectin + praziquantel, dezvoltată de Neoterica GmbH (Germania).",
    "Protecție împotriva nematozilor, cestozilor și ectoparaziților (purici).",
]


def entry(code, slug, name, url, image, species, weight, desc, admin, comp, pack):
    return {
        "id": f"gelmintal-{slug}",
        "name": name,
        "url": url,
        "slug": slug,
        "category": CAT,
        "brand_slug": "neoterica-gelmintal",
        "breadcrumbs": ["Produse", "Neoterica", "Gelmintal", name.split("—")[-1].strip()],
        "labels": LABELS + [code],
        "description": desc + " Produs de Ekoprom, gama Neoterica Gelmintal.",
        "overview": [desc.split(".")[0] + "."],
        "features": TABS_FEATS if "tablete" in slug else DROPS_FEATS,
        "package_sizes": [pack],
        "product_type": "Anthelmintic",
        "image": IMG + image,
        "images": [{"url": IMG + image, "alt": name, "role": "main"}],
        "videos": [],
        "composition": comp,
        "sections": {
            "Indicații": {"text": desc, "tables": []},
            "Substanțe active": {"text": comp, "tables": []},
            "Mod de administrare": {"text": admin, "tables": []},
        },
        "fresh_ingredients": [],
        "metabolizable_energy": "",
        "raw_text": (
            f"{name} Ekoprom Neoterica Gelmintal {species} {weight} anthelmintic "
            "deparazitare internă viermi nematozi cestozi dirofilarioză "
            "moxidectin praziquantel toltrazuril coccidii tablete picături spot-on"
        ),
    }


d301, a301 = t_desc("pisicilor adulte și pisoilor", "2 kg")
d302, a302 = t_desc("pisicilor", "8 kg")
d303, a303 = t_desc("câinilor adulți și cățeilor", "5 kg")
d304, a304 = t_desc("câinilor", "25 kg")

products = [
    entry("E300", "gelmintal-mini-tabs-catei-pisoi-10tab",
          "Gelmintal Mini Tabs — tablete împotriva helmintilor și coccidiilor pentru căței și pisoi, 10 tablete",
          G + "tabletki-dlia-kotiat-i-koshek-menee-4-kg-2-sht/",
          "gelmintal-tablete-gelminti-coccidii-10tab.webp",
          "căței și pisoi", "de la 500 g", MINI_DESC, MINI_ADMIN,
          "Substanțe active în 1 tabletă: toltrazuril 9 mg, moxidectin 0,3 mg.",
          "10 tablete"),
    entry("E301", "gelmintal-t-tablete-pisoi-pisici-sub4kg",
          "Gelmintal T — tablete anthelmintice pentru pisoi și pisici sub 4 kg, 2 tablete",
          G + "tabletki-dlia-kotiat-i-koshek-menee-4-kg-2-sht-1/",
          "gelmintal-tablete-pisoi-pisici-sub4kg.webp",
          "pisoi și pisici", "sub 4 kg", d301, a301,
          "Substanțe active în 1 tabletă: moxidectin 0,4 mg, praziquantel 10 mg.",
          "2 tablete"),
    entry("E302", "gelmintal-t-tablete-pisici-peste4kg",
          "Gelmintal T — tablete anthelmintice pentru pisici peste 4 kg, 2 tablete",
          G + "tabletki-dlia-koshek-bolee-4-kg-2-sht/",
          "gelmintal-tablete-pisici-peste4kg.webp",
          "pisici", "peste 4 kg", d302, a302,
          "Substanțe active în 1 tabletă: moxidectin 1,6 mg, praziquantel 40 mg.",
          "2 tablete"),
    entry("E303", "gelmintal-t-tablete-catei-caini-sub10kg",
          "Gelmintal T — tablete anthelmintice pentru căței și câini sub 10 kg, 2 tablete",
          G + "tabletki-dlia-shchenkov-i-sobak-menee-10kg-2-sht/",
          "gelmintal-tablete-catei-caini-sub10kg.webp",
          "căței și câini", "sub 10 kg", d303, a303,
          "Substanțe active în 1 tabletă: moxidectin 1 mg, praziquantel 25 mg.",
          "2 tablete"),
    entry("E304", "gelmintal-t-tablete-caini-peste10kg",
          "Gelmintal T — tablete anthelmintice pentru câini peste 10 kg, 2 tablete",
          G + "tabletki-dlia-sobak-bolee-10kg-2-sht/",
          "gelmintal-tablete-caini-peste10kg.webp",
          "câini", "peste 10 kg", d304, a304,
          "Substanțe active în 1 tabletă: moxidectin 5 mg, praziquantel 125 mg.",
          "2 tablete"),
    entry("E101", "gelmintal-k-picaturi-pisici-sub4kg",
          "Gelmintal K — picături spot-on anthelmintice pentru pisici sub 4 kg",
          G + "kapli-ot-gelmintov-dlia-koshek-menee-4-kg/",
          "gelmintal-picaturi-pisici-sub4kg.webp",
          "pisici", "sub 4 kg", K_DESC, K_ADMIN,
          "Substanțe active în 1 ml: moxidectin 1%, praziquantel 4%.",
          "1 pipetă spot-on"),
    entry("E111", "gelmintal-k-picaturi-pisici-sub4kg-3pipete",
          "Gelmintal K — picături spot-on anthelmintice pentru pisici sub 4 kg, 3 pipete",
          G + "kapli-ot-gel-mintov-dlia-koshek-menee-4-kg-3-pipetki/",
          "gelmintal-picaturi-pisici-sub4kg-3pip.webp",
          "pisici", "sub 4 kg", K_DESC, K_ADMIN,
          "Substanțe active în 1 ml: moxidectin 1%, praziquantel 4%.",
          "3 pipete spot-on"),
    entry("E106", "gelmintal-k-picaturi-pisici-4-10kg",
          "Gelmintal K — picături spot-on anthelmintice pentru pisici 4–10 kg",
          G + "kapli-ot-gelmintov-dlia-koshek-4-10-kg/",
          "gelmintal-picaturi-pisici-4-10kg.webp",
          "pisici", "4–10 kg", K_DESC, K_ADMIN,
          "Substanțe active în 1 ml: moxidectin 1%, praziquantel 4%.",
          "1 pipetă spot-on"),
    entry("E116", "gelmintal-k-picaturi-pisici-4-10kg-3pipete",
          "Gelmintal K — picături spot-on anthelmintice pentru pisici 4–10 kg, 3 pipete",
          G + "kapli-ot-gel-mintov-dlia-koshek-4-10-kg-3-pipetki/",
          "gelmintal-picaturi-pisici-4-10kg-3pip.webp",
          "pisici", "4–10 kg", K_DESC, K_ADMIN,
          "Substanțe active în 1 ml: moxidectin 1%, praziquantel 4%.",
          "3 pipete spot-on"),
    entry("E107", "gelmintal-c-picaturi-caini-sub10kg",
          "Gelmintal C — picături spot-on anthelmintice pentru câini sub 10 kg",
          G + "kapli-ot-gelmintov-dlia-sobak-menee-10-kg/",
          "gelmintal-picaturi-caini-sub10kg.webp",
          "câini", "sub 10 kg", C_DESC, C_ADMIN,
          "Substanțe active în 1 ml: moxidectin 2,5%, praziquantel 4%.",
          "1 pipetă spot-on"),
    entry("E108", "gelmintal-c-picaturi-caini-peste10kg",
          "Gelmintal C — picături spot-on anthelmintice pentru câini peste 10 kg",
          G + "kapli-ot-gelmintov-dlia-sobak-bolee-10-kg/",
          "gelmintal-picaturi-caini-peste10kg.webp",
          "câini", "peste 10 kg", C_DESC, C_ADMIN,
          "Substanțe active în 1 ml: moxidectin 2,5%, praziquantel 4%.",
          "1 pipetă spot-on"),
]

path = "scrape/ekoprom_products.json"
data = json.load(open(path, encoding="utf-8"))
existing = {p["slug"] for p in data["products"]}
added = [p for p in products if p["slug"] not in existing]
data["products"].extend(added)
json.dump(data, open(path, "w", encoding="utf-8"), ensure_ascii=False, indent=2)
print(f"adaugate {len(added)} produse noi; total ekoprom: {len(data['products'])}")
