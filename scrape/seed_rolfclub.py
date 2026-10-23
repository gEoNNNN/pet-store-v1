import io
import json
import sys

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8")

IMG = "/products/ekoprom/"
R = "https://www.ekoprom.org/brands/neoterica/rolfclub-3d/"
ANTIP = "Antiparazitare interne și externe"

DROP_DESC_CATS = (
    "Picăturile RolfClub 3D pentru pisici se administrează pisicilor și pisoiilor "
    "peste 12 săptămâni în entomoze (purici, malofagi), otodectoză, notoedroză, "
    "infestare cu căpușe ixodide și pentru protecția împotriva insectelor zburătoare "
    "hematofage. Se aplică o singură dată prin metoda spot-on pe pielea uscată și "
    "integrată, în zona gâtului la baza craniului sau între omoplați. Căpușele și "
    "insectele parazite se desprind și mor în 1–2 ore. Acțiunea protectoare durează "
    "30 de zile împotriva căpușelor ixodide și până la 2 luni împotriva insectelor."
)
DROP_COMP_CATS = "Substanțe active: fipronil 9,8%, etofenprox 15%, piriproxifen 2%."

DROP_DESC_DOGS = (
    "Picăturile RolfClub 3D pentru câini se administrează câinilor în entomoze "
    "(purici, malofagi), otodectoză, sarcoptoză, infestare cu căpușe ixodide și "
    "pentru protecția împotriva insectelor zburătoare hematofage. Se aplică o "
    "singură dată prin metoda spot-on pe pielea uscată și integrată, între omoplați "
    "sau de-a lungul spinării. Căpușele și insectele parazite se desprind și mor în "
    "1–2 ore. Acțiunea protectoare durează 30 de zile împotriva căpușelor ixodide "
    "și până la 2 luni împotriva insectelor."
)
DROP_COMP_DOGS = "Substanțe active: fipronil 9,8%, D-cifenotrin 5,2%, piriproxifen 2%."

COLLAR_DESC_DOGS = (
    "Zgarda RolfClub 3D pentru câini se utilizează pentru tratamentul și prevenirea "
    "arahno-entomozelor cauzate de purici, păduchi, malofagi și căpușe ixodide, "
    "pentru protecția câinilor împotriva insectelor zburătoare hematofage și pentru "
    "prevenirea bolilor transmisive (babesioză, borrelioză, dirofilarioză). După "
    "deschiderea ambalajului, zgarda se desface, se ajustează lăsând 1–1,5 cm între "
    "gât și zgardă, se fixează și excesul se taie. Utilizarea continuă asigură "
    "protecție împotriva puricilor, păduchilor, malofagelor și căpușelor ixodide "
    "timp de până la 6 luni."
)
COLLAR_COMP_DOGS = "Substanțe active: fipronil 5%, D-cifenotrin 5%, piriproxifen 2%."

COLLAR_DESC_CATS = (
    "Zgarda RolfClub 3D pentru pisici se utilizează în entomoze cauzate de purici "
    "și malofagi, în infestarea cu căpușe ixodide, pentru protecția pisicilor "
    "împotriva insectelor zburătoare hematofage și pentru prevenirea "
    "dirofilariozei. După deschiderea ambalajului, zgarda se desface, se ajustează "
    "lăsând 1–1,5 cm între gât și zgardă, se fixează și excesul se taie. Utilizarea "
    "continuă asigură protecție împotriva insectelor și căpușelor ixodide timp de "
    "8 luni."
)
COLLAR_COMP_CATS = "Substanțe active: fipronil 5%, etofenprox 5%, piriproxifen 2%."

FEATS = [
    "Triplă protecție: distruge paraziții înainte de mușcătură, protejează animalul până la 2 luni și întrerupe reproducerea paraziților.",
    "Efect knock-down în 2 minute: acțiunea paralitică nu permite căpușei să se deplaseze și să muște.",
    "Protecție împotriva a 9 tipuri de paraziți externi: căpușe ixodide, otodectice și sarcoptice, purici (toate stadiile), păduchi, malofagi, țânțari și musculițe.",
    "Substanțele active nu se absorb în circulația sistemică — sigure pentru animal.",
    "Formula cu trei componente nu induce rezistență la paraziți.",
]


def entry(code, slug, name, url, image, species, pack, ptype, desc, comp, labels_extra):
    return {
        "id": f"rolfclub-{slug}",
        "name": name,
        "url": url,
        "slug": slug,
        "category": ANTIP,
        "brand_slug": "neoterica-rolfclub-3d",
        "breadcrumbs": ["Produse", "Ekoprom", "RolfClub 3D", name.split("—")[-1].strip()[:60]],
        "labels": ["Ekoprom", "RolfClub 3D", code] + labels_extra,
        "description": desc + " Produs de Ekoprom, gama Neoterica RolfClub 3D.",
        "overview": [desc.split(".")[0] + "."],
        "features": FEATS,
        "package_sizes": [pack],
        "product_type": ptype,
        "image": IMG + image,
        "images": [{"url": IMG + image, "alt": name, "role": "main"}],
        "videos": [],
        "composition": comp,
        "sections": {"Indicații": {"text": desc, "tables": []}},
        "fresh_ingredients": [],
        "metabolizable_energy": "",
        "raw_text": f"{name} Ekoprom RolfClub Neoterica {species} {desc[:180]}",
    }


def drop(code, slug, name, path, img, species, pack, comp):
    desc = DROP_DESC_CATS if "pisic" in species or "pisoi" in species else DROP_DESC_DOGS
    return entry(code, slug, name, R + path, img, species, pack,
                 "Picături spot-on antiparazitare", desc, comp,
                 ["Picături", "Spot-on", "Purici", "Căpușe"])


def collar(code, slug, name, path, img, species, pack, comp):
    desc = COLLAR_DESC_CATS if "pisic" in species or "pisoi" in species else COLLAR_DESC_DOGS
    return entry(code, slug, name, R + path, img, species, pack,
                 "Zgardă antiparazitară", desc, comp,
                 ["Zgardă", "Purici", "Căpușe"])


products = [
    drop("R401", "rolfclub-picaturi-pisici-sub4kg", "RolfClub 3D — picături antiparazitare pentru pisici sub 4 kg",
         "kapli-ot-kleshchei-i-blokh-dlia-koshek-menee-4-kg/", "rolfclub-picaturi-pisici-sub4kg.webp",
         "pisici sub 4 kg", "1 pipetă", DROP_COMP_CATS),
    drop("R442", "rolfclub-picaturi-pisici-sub4kg-3pipete", "RolfClub 3D — picături antiparazitare pentru pisici sub 4 kg, 3 pipete",
         "kapli-ot-kleshchei-i-blokh-dlia-koshek-menee-4-kg-3-pipetki/", "rolfclub-picaturi-pisici-sub4kg-3pipete.webp",
         "pisici sub 4 kg", "3 pipete", DROP_COMP_CATS),
    drop("R425", "rolfclub-picaturi-pisici-4-8kg", "RolfClub 3D — picături antiparazitare pentru pisici 4–8 kg",
         "kapli-ot-kleshchei-i-blokh-dlia-koshek-4-8-kg/", "rolfclub-picaturi-pisici-4-8kg.webp",
         "pisici 4–8 kg", "1 pipetă", DROP_COMP_CATS),
    drop("R443", "rolfclub-picaturi-pisici-4-8kg-3pipete", "RolfClub 3D — picături antiparazitare pentru pisici 4–8 kg, 3 pipete",
         "kapli-ot-kleshchei-i-blokh-dlia-koshek-4-8-kg-3-pipetki/", "rolfclub-picaturi-pisici-4-8kg-3pipete.webp",
         "pisici 4–8 kg", "3 pipete", DROP_COMP_CATS),
    drop("R426", "rolfclub-picaturi-pisici-8-15kg", "RolfClub 3D — picături antiparazitare pentru pisici 8–15 kg",
         "kapli-ot-kleshchei-i-blokh-dlia-koshek-8-15-kg/", "rolfclub-picaturi-pisici-8-15kg.webp",
         "pisici 8–15 kg", "1 pipetă", DROP_COMP_CATS),
    drop("R402", "rolfclub-picaturi-caini-sub4kg", "RolfClub 3D — picături antiparazitare pentru câini sub 4 kg",
         "kapli-ot-kleshchei-i-blokh-dlia-sobak-do-4-kg/", "rolfclub-picaturi-caini-sub4kg.webp",
         "câini sub 4 kg", "1 pipetă", DROP_COMP_DOGS),
    drop("R444", "rolfclub-picaturi-caini-sub4kg-3pipete", "RolfClub 3D — picături antiparazitare pentru câini sub 4 kg, 3 pipete",
         "kapli-ot-kleshchei-i-blokh-dlia-sobak-do-4-kg-1/", "rolfclub-picaturi-caini-sub4kg-3pipete.webp",
         "câini sub 4 kg", "3 pipete", DROP_COMP_DOGS),
    drop("R403", "rolfclub-picaturi-caini-4-10kg", "RolfClub 3D — picături antiparazitare pentru câini 4–10 kg",
         "kapli-ot-kleshchei-i-blokh-dlia-sobak-4-10-kg/", "rolfclub-picaturi-caini-4-10kg.webp",
         "câini 4–10 kg", "1 pipetă", DROP_COMP_DOGS),
    drop("R445", "rolfclub-picaturi-caini-4-10kg-3pipete", "RolfClub 3D — picături antiparazitare pentru câini 4–10 kg, 3 pipete",
         "kapli-ot-kleshchei-i-blokh-dlia-sobak-4-10-kg-3-pipetki/", "rolfclub-picaturi-caini-4-10kg-3pipete.webp",
         "câini 4–10 kg", "3 pipete", DROP_COMP_DOGS),
    drop("R404", "rolfclub-picaturi-caini-10-20kg", "RolfClub 3D — picături antiparazitare pentru câini 10–20 kg",
         "kapli-ot-kleshchei-i-blokh-dlia-sobak-10-20-kg/", "rolfclub-picaturi-caini-10-20kg.webp",
         "câini 10–20 kg", "1 pipetă", DROP_COMP_DOGS),
    drop("R446", "rolfclub-picaturi-caini-10-20kg-3pipete", "RolfClub 3D — picături antiparazitare pentru câini 10–20 kg, 3 pipete",
         "kapli-ot-kleshchei-i-blokh-dlia-sobak-10-20-kg-3-pipetki/", "rolfclub-picaturi-caini-10-20kg-3pipete.webp",
         "câini 10–20 kg", "3 pipete", DROP_COMP_DOGS),
    drop("R405", "rolfclub-picaturi-caini-20-40kg", "RolfClub 3D — picături antiparazitare pentru câini 20–40 kg",
         "kapli-ot-kleshchei-i-blokh-dlia-sobak-20-40-kg/", "rolfclub-picaturi-caini-20-40kg.webp",
         "câini 20–40 kg", "1 pipetă", DROP_COMP_DOGS),
    drop("R447", "rolfclub-picaturi-caini-20-40kg-3pipete", "RolfClub 3D — picături antiparazitare pentru câini 20–40 kg, 3 pipete",
         "kapli-ot-kleshchei-i-blokh-dlia-sobak-20-40-kg-3-pipetki/", "rolfclub-picaturi-caini-20-40kg-3pipete.webp",
         "câini 20–40 kg", "3 pipete", DROP_COMP_DOGS),
    drop("R424", "rolfclub-picaturi-caini-40-60kg", "RolfClub 3D — picături antiparazitare pentru câini 40–60 kg",
         "kapli-ot-kleshchei-i-blokh-dlia-sobak-40-60-kg/", "rolfclub-picaturi-caini-40-60kg.webp",
         "câini 40–60 kg", "1 pipetă", DROP_COMP_DOGS),
    drop("R448", "rolfclub-picaturi-caini-40-60kg-3pipete", "RolfClub 3D — picături antiparazitare pentru câini 40–60 kg, 3 pipete",
         "kapli-ot-kleshchei-i-blokh-dlia-sobak-40-60-kg-3-pipetki/", "rolfclub-picaturi-caini-40-60kg-3pipete.webp",
         "câini 40–60 kg", "3 pipete", DROP_COMP_DOGS),
    collar("R433", "rolfclub-zgarda-catei-caini-mici-40cm",
           "RolfClub 3D — zgardă antiparazitară pentru căței și câini mici, 40 cm",
           "osheinik-ot-kleshchei-i-blokh-dlia-shchenkov-i-melkikh-sobak-40-sm/",
           "rolfclub-zgarda-catei-caini-mici-40cm.webp", "căței, câini mici", "1 zgardă, 40 cm", COLLAR_COMP_DOGS),
    collar("R434", "rolfclub-zgarda-caini-medii-65cm",
           "RolfClub 3D — zgardă antiparazitară pentru câini de talie medie, 65 cm",
           "osheinik-ot-kleshchei-i-blokh-dlia-srednikh-sobak-65-sm/",
           "rolfclub-zgarda-caini-medii-65cm.webp", "câini medii", "1 zgardă, 65 cm", COLLAR_COMP_DOGS),
    collar("R435", "rolfclub-zgarda-caini-mari-75cm",
           "RolfClub 3D — zgardă antiparazitară pentru câini de talie mare, 75 cm",
           "osheinik-ot-kleshchei-i-blokh-dlia-krupnykh-sobak-75-sm/",
           "rolfclub-zgarda-caini-mari-75cm.webp", "câini mari", "1 zgardă, 75 cm", COLLAR_COMP_DOGS),
    collar("R431", "rolfclub-zgarda-pisoi-40cm",
           "RolfClub 3D — zgardă antiparazitară pentru pisoi, 40 cm",
           "osheinik-ot-kleshchei-i-blokh-dlia-kotiat-40-sm/",
           "rolfclub-zgarda-pisoi-40cm.webp", "pisoi", "1 zgardă, 40 cm", COLLAR_COMP_CATS),
    collar("R432", "rolfclub-zgarda-pisici-40cm",
           "RolfClub 3D — zgardă antiparazitară pentru pisici, 40 cm",
           "osheinik-ot-kleshchei-i-blokh-dlia-koshek-40-sm/",
           "rolfclub-zgarda-pisici-40cm.webp", "pisici", "1 zgardă, 40 cm", COLLAR_COMP_CATS),
]

path = "scrape/ekoprom_products.json"
data = json.load(open(path, encoding="utf-8"))
existing = {p["slug"] for p in data["products"]}
added = [p for p in products if p["slug"] not in existing]
data["products"].extend(added)
json.dump(data, open(path, "w", encoding="utf-8"), ensure_ascii=False, indent=2)
print(f"adaugate {len(added)} produse noi; total ekoprom: {len(data['products'])}")
