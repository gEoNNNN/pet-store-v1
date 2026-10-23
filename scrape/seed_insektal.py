import io
import json
import sys

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8")

CAT = "Antiparazitare interne și externe"
IMG = "/products/ekoprom/"

COMBO_K_DESC = (
    "Insektal Combo K se administrează pisicilor pentru tratamentul și prevenirea "
    "entomozelor, otodectozei, notoedrozei, acarozelor produse de căpușe ixodide, "
    "nematodozelor gastro-intestinale (toxocaroză, toxascarioză, uncinarioză, "
    "anchilostomoză), precum și pentru prevenirea dirofilariozei."
)
COMBO_S_DESC = (
    "Insektal Combo S se administrează câinilor pentru tratamentul și prevenirea "
    "entomozelor, demodectozei, otodectozei, sarcoptozei, acarozelor produse de "
    "căpușe ixodide, nematodozelor gastro-intestinale (toxocaroză, toxascarioză, "
    "uncinarioză, anchilostomoză, tricocefaloză), precum și pentru prevenirea "
    "dirofilariozei."
)
COMBO_FEATS = [
    "Protecție complexă: paraziți externi (căpușe, purici, insecte) și interni (nematozi).",
    "După o singură aplicare, efectul insecticid durează până la 6 săptămâni, iar cel acaricid — până la 4 săptămâni.",
    "Formulă fipronil + moxidectin, dezvoltată de Neoterica GmbH (Germania).",
]
DROPS_DESC_BOTH = (
    "Insektal picături se utilizează împotriva ectoparaziților câinilor și pisicilor. "
    "Se administrează de la vârsta de 3 luni în entomoze, otodectoză, notoedroză, "
    "sarcoptoză și infestări cu căpușe ixodide. Se aplică spot-on: blana se desface "
    "și produsul se aplică pe pielea uscată și integră din zona gâtului, la baza "
    "craniului sau între omoplați, în locuri inaccesibile linsului. Protecția după o "
    "singură aplicare: împotriva căpușelor — până la 30 de zile la câini și 21 de "
    "zile la pisici; împotriva insectelor — până la 2 luni la câini și 1,5 luni la pisici."
)
DROPS_DESC_DOGS = (
    "Insektal picături se utilizează împotriva ectoparaziților câinilor. Se administrează "
    "de la vârsta de 3 luni în entomoze, otodectoză, notoedroză, sarcoptoză și infestări "
    "cu căpușe ixodide. Se aplică spot-on: blana se desface și produsul se aplică pe "
    "pielea uscată și integră din zona gâtului, la baza craniului sau între omoplați, "
    "în locuri inaccesibile linsului. Protecția după o singură aplicare: împotriva "
    "căpușelor — până la 30 de zile; împotriva insectelor — până la 2 luni."
)
DROPS_FEATS = [
    "Formulă cu două componente: fipronil + piriproxifen — acționează asupra ectoparaziților în toate stadiile de dezvoltare.",
    "Aplicare simplă spot-on pe pielea uscată, în zona gâtului sau între omoplați.",
    "Protecție îndelungată după o singură aplicare.",
]
COLLAR_DESC_BOTH = (
    "Zgarda Insektal se utilizează la câini și pisici pentru distrugerea puricilor, "
    "păduchilor, malofagelor și căpușelor ixodide și pentru prevenirea atacului "
    "acestora. Purtarea continuă a zgărzii asigură protecție împotriva insectelor "
    "timp de 5 luni și împotriva căpușelor ixodide timp de 4 luni. Zgarda se pune "
    "animalului cu 2–3 zile înainte de contactul presupus cu paraziții. Culoare: "
    "auriu-sidef — zgarda este nu doar protecție, ci și un accesoriu."
)
COLLAR_DESC_DOGS = COLLAR_DESC_BOTH.replace(
    "la câini și pisici", "la câini"
).replace("câinilor și pisicilor", "câinilor")

LABELS = ["Ekoprom", "Neoterica", "Insektal", "Antiparazitar"]


def entry(code, slug, name, url, image, species_ro, weight, desc, feats, comp, pack):
    return {
        "id": f"insektal-{slug}",
        "name": name,
        "url": url,
        "slug": slug,
        "category": CAT,
        "brand_slug": "neoterica-insektal",
        "breadcrumbs": ["Produse", "Neoterica", "Insektal", name.split("—")[-1].strip()],
        "labels": LABELS + [code],
        "description": desc + " Produs de Ekoprom, gama Neoterica Insektal.",
        "overview": [desc.split(".")[0] + "."],
        "features": feats,
        "package_sizes": [pack],
        "product_type": "Antiparazitar extern",
        "image": IMG + image,
        "images": [{"url": IMG + image, "alt": name, "role": "main"}],
        "videos": [],
        "composition": comp,
        "sections": {
            "Indicații": {"text": desc, "tables": []},
            "Substanțe active": {"text": comp, "tables": []},
        },
        "fresh_ingredients": [],
        "metabolizable_energy": "",
        "raw_text": (
            f"{name} Ekoprom Neoterica Insektal {species_ro} {weight} antiparazitar "
            "purici căpușe viermi nematozi dirofilarioză fipronil moxidectin "
            "piriproxifen deparazitare externă spot-on pipetă zgardă"
        ),
    }


B = "https://www.ekoprom.org/brands/neoterica/insektal/"
K = "kapli-dlia-koshek-i-sobak-ot-2-do-4-kg"

products = [
    # Combo K — pisici (fipronil 10% + moxidectin 1%)
    entry("N201", "insektal-kombo-picaturi-pisici-1-4kg",
          "Insektal Combo K — picături spot-on pentru pisici 1–4 kg",
          B + K + "-1/", "insektal-kombo-kapli-pisici-1-4kg.webp",
          "pisici", "1–4 kg", COMBO_K_DESC, COMBO_FEATS,
          "Substanțe active: fipronil 10%, moxidectin 1%.", "1 pipetă spot-on"),
    entry("N202", "insektal-kombo-picaturi-pisici-4-8kg",
          "Insektal Combo K — picături spot-on pentru pisici 4–8 kg",
          B + K + "-2/", "insektal-kombo-kapli-pisici-4-8kg.webp",
          "pisici", "4–8 kg", COMBO_K_DESC, COMBO_FEATS,
          "Substanțe active: fipronil 10%, moxidectin 1%.", "1 pipetă spot-on"),
    # Combo S — câini (fipronil 10% + moxidectin 2,5%)
    entry("N203", "insektal-kombo-picaturi-caini-1-4kg",
          "Insektal Combo S — picături spot-on pentru câini 1–4 kg",
          B + K + "-3/", "insektal-kombo-kapli-caini-1-4kg.webp",
          "câini", "1–4 kg", COMBO_S_DESC, COMBO_FEATS,
          "Substanțe active: fipronil 10%, moxidectin 2,5%.", "1 pipetă spot-on"),
    entry("N204", "insektal-kombo-picaturi-caini-4-10kg",
          "Insektal Combo S — picături spot-on pentru câini 4–10 kg",
          B + K + "-4/", "insektal-kombo-kapli-caini-4-10kg.webp",
          "câini", "4–10 kg", COMBO_S_DESC, COMBO_FEATS,
          "Substanțe active: fipronil 10%, moxidectin 2,5%.", "1 pipetă spot-on"),
    entry("N205", "insektal-kombo-picaturi-caini-10-25kg",
          "Insektal Combo S — picături spot-on pentru câini 10–25 kg",
          B + K + "-5/", "insektal-kombo-kapli-caini-10-25kg.webp",
          "câini", "10–25 kg", COMBO_S_DESC, COMBO_FEATS,
          "Substanțe active: fipronil 10%, moxidectin 2,5%.", "1 pipetă spot-on"),
    entry("N206", "insektal-kombo-picaturi-caini-25-40kg",
          "Insektal Combo S — picături spot-on pentru câini 25–40 kg",
          B + K + "-6/", "insektal-kombo-kapli-caini-25-40kg.webp",
          "câini", "25–40 kg", COMBO_S_DESC, COMBO_FEATS,
          "Substanțe active: fipronil 10%, moxidectin 2,5%.", "1 pipetă spot-on"),
    entry("N207", "insektal-kombo-picaturi-caini-40-60kg",
          "Insektal Combo S — picături spot-on pentru câini 40–60 kg",
          B + K + "-7/", "insektal-kombo-kapli-caini-40-60kg.webp",
          "câini", "40–60 kg", COMBO_S_DESC, COMBO_FEATS,
          "Substanțe active: fipronil 10%, moxidectin 2,5%.", "1 pipetă spot-on"),
    # Picături clasice — pisici + câini (fipronil 10% + piriproxifen 2%)
    entry("N101", "insektal-picaturi-pisici-caini-2-4kg",
          "Insektal — picături spot-on pentru pisici și câini 2–4 kg",
          B + K + "/", "insektal-kapli-pisici-caini-2-4kg.webp",
          "pisici și câini", "2–4 kg", DROPS_DESC_BOTH, DROPS_FEATS,
          "Substanțe active: fipronil 10%, piriproxifen 2%.", "1 pipetă spot-on"),
    entry("N111", "insektal-picaturi-pisici-caini-2-4kg-6-pipete",
          "Insektal — picături spot-on pentru pisici și câini 2–4 kg, 6 pipete",
          B + K + "-6-pipetok/", "insektal-kapli-pisici-caini-2-4kg-6pip.webp",
          "pisici și câini", "2–4 kg", DROPS_DESC_BOTH, DROPS_FEATS,
          "Substanțe active: fipronil 10%, piriproxifen 2%.", "6 pipete spot-on"),
    entry("N102", "insektal-picaturi-pisici-caini-4-10kg",
          "Insektal — picături spot-on pentru pisici și câini 4–10 kg",
          B + "kapli-ot-kleshchei-i-blokh-dlia-sobak-4-10-kg/", "insektal-kapli-pisici-caini-4-10kg.webp",
          "pisici și câini", "4–10 kg", DROPS_DESC_BOTH, DROPS_FEATS,
          "Substanțe active: fipronil 10%, piriproxifen 2%.", "1 pipetă spot-on"),
    entry("N112", "insektal-picaturi-pisici-caini-4-10kg-6-pipete",
          "Insektal — picături spot-on pentru pisici și câini 4–10 kg, 6 pipete",
          B + "kapli-ot-kleshchei-i-blokh-dlia-koshek-i-sobak-4-10-kg-6-pipetok/",
          "insektal-kapli-pisici-caini-4-10kg-6pip.webp",
          "pisici și câini", "4–10 kg", DROPS_DESC_BOTH, DROPS_FEATS,
          "Substanțe active: fipronil 10%, piriproxifen 2%.", "6 pipete spot-on"),
    # Picături clasice — doar câini
    entry("N103", "insektal-picaturi-caini-10-20kg",
          "Insektal — picături spot-on pentru câini 10–20 kg",
          B + "kapli-ot-kleshchei-i-blokh-dlia-sobak-10-20-kg/", "insektal-kapli-caini-10-20kg.webp",
          "câini", "10–20 kg", DROPS_DESC_DOGS, DROPS_FEATS,
          "Substanțe active: fipronil 10%, piriproxifen 2%.", "1 pipetă spot-on"),
    entry("N113", "insektal-picaturi-caini-10-20kg-6-pipete",
          "Insektal — picături spot-on pentru câini 10–20 kg, 6 pipete",
          B + "kapli-ot-kleshchei-i-blokh-dlia-sobak-10-20-kg-6-pipetok/",
          "insektal-kapli-caini-10-20kg-6pip.webp",
          "câini", "10–20 kg", DROPS_DESC_DOGS, DROPS_FEATS,
          "Substanțe active: fipronil 10%, piriproxifen 2%.", "6 pipete spot-on"),
    entry("N104", "insektal-picaturi-caini-20-40kg",
          "Insektal — picături spot-on pentru câini 20–40 kg",
          B + "kapli-ot-kleshchei-i-blokh-dlia-sobak-20-40-kg/", "insektal-kapli-caini-20-40kg.webp",
          "câini", "20–40 kg", DROPS_DESC_DOGS, DROPS_FEATS,
          "Substanțe active: fipronil 10%, piriproxifen 2%.", "1 pipetă spot-on"),
    entry("N114", "insektal-picaturi-caini-20-40kg-6-pipete",
          "Insektal — picături spot-on pentru câini 20–40 kg, 6 pipete",
          B + "kapli-ot-kleshchei-i-blokh-dlia-sobak-20-40-kg-6-pipetok/",
          "insektal-kapli-caini-20-40kg-6pip.webp",
          "câini", "20–40 kg", DROPS_DESC_DOGS, DROPS_FEATS,
          "Substanțe active: fipronil 10%, piriproxifen 2%.", "6 pipete spot-on"),
    entry("N105", "insektal-picaturi-caini-40-60kg",
          "Insektal — picături spot-on pentru câini 40–60 kg",
          B + "kapli-ot-kleshchei-i-blokh-dlia-sobak-40-60-kg/", "insektal-kapli-caini-40-60kg.webp",
          "câini", "40–60 kg", DROPS_DESC_DOGS, DROPS_FEATS,
          "Substanțe active: fipronil 10%, piriproxifen 2%.", "1 pipetă spot-on"),
    entry("N115", "insektal-picaturi-caini-40-60kg-6-pipete",
          "Insektal — picături spot-on pentru câini 40–60 kg, 6 pipete",
          B + "kapli-ot-kleshchei-i-blokh-dlia-sobak-40-60-kg-6-pipetok/",
          "insektal-kapli-caini-40-60kg-6pip.webp",
          "câini", "40–60 kg", DROPS_DESC_DOGS, DROPS_FEATS,
          "Substanțe active: fipronil 10%, piriproxifen 2%.", "6 pipete spot-on"),
    # Zgărzi
    entry("N109", "insektal-zgarda-pisici-caini-mici-40cm",
          "Insektal — zgardă antiparazitară pentru pisici și câini mici, 40 cm",
          B + "osheinik-dlia-koshek-i-melkikh-sobak-40-sm/", "insektal-zgarda-pisici-caini-mici-40cm.webp",
          "pisici și câini mici", "40 cm", COLLAR_DESC_BOTH,
          [
              "Protecție continuă: 5 luni împotriva insectelor, 4 luni împotriva căpușelor ixodide.",
              "Formulă fipronil + piriproxifen — acționează și asupra larvelor.",
              "Culoare auriu-sidef — zgarda este și un accesoriu.",
          ],
          "Substanțe active: fipronil 5%, piriproxifen 2%.", "1 zgardă, 40 cm"),
    entry("N110", "insektal-zgarda-caini-65cm",
          "Insektal — zgardă antiparazitară pentru câini medii și mari, 65 cm",
          B + "insektal-osheinik-dlia-srednikh-i-krupnykh-sobak-65-sm/",
          "insektal-zgarda-caini-mari-65cm.webp",
          "câini", "65 cm", COLLAR_DESC_DOGS,
          [
              "Protecție continuă: 5 luni împotriva insectelor, 4 luni împotriva căpușelor ixodide.",
              "Formulă fipronil + piriproxifen — acționează și asupra larvelor.",
              "Culoare auriu-sidef — zgarda este și un accesoriu.",
          ],
          "Substanțe active: fipronil 5%, piriproxifen 2%.", "1 zgardă, 65 cm"),
]

path = "scrape/ekoprom_products.json"
data = json.load(open(path, encoding="utf-8"))
existing = {p["slug"] for p in data["products"]}
added = [p for p in products if p["slug"] not in existing]
data["products"].extend(added)
json.dump(data, open(path, "w", encoding="utf-8"), ensure_ascii=False, indent=2)
print(f"adaugate {len(added)} produse noi; total ekoprom: {len(data['products'])}")
