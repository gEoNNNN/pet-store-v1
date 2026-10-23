import io
import json
import sys

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8")

IMG = "/products/ekoprom/"
U = "https://www.ekoprom.org/brands/neoterica/unitabs/"
C = "https://www.ekoprom.org/brands/ekoprom/chistotel/"
VIT = "Vitamine, minerale și premixuri"
ANTIP = "Antiparazitare interne și externe"
IGIENA = "Curățare, igienă și dezinfecție"

UNITABS_SUFFIX = " Complex vitaminomineral cu coenzima Q10, din gama Unitabs — formule dezvoltate de Neoterica GmbH (Germania), conform standardului european de calitate."
VIT_FEATS = [
    "Conține coenzima Q10 — antioxidant puternic care accelerează metabolismul, întărește imunitatea și încetinește îmbătrânirea.",
    "Compoziții atent selectate, cu absorbție și acceptare ridicată.",
    "Formulă dezvoltată de Neoterica GmbH (Germania).",
]

def entry(code, slug, name, url, image, category, brand_slug, brand_line,
          species, pack, ptype, desc, comp, labels_extra, feats=None):
    return {
        "id": f"{brand_slug.split('-')[-1]}-{slug}",
        "name": name,
        "url": url,
        "slug": slug,
        "category": category,
        "brand_slug": brand_slug,
        "breadcrumbs": ["Produse", "Ekoprom", brand_line, name.split("—")[-1].strip()[:60]],
        "labels": ["Ekoprom", brand_line, code] + labels_extra,
        "description": desc + f" Produs de Ekoprom, gama {brand_line}.",
        "overview": [desc.split(".")[0] + "."],
        "features": feats or [],
        "package_sizes": [pack],
        "product_type": ptype,
        "image": IMG + image,
        "images": [{"url": IMG + image, "alt": name, "role": "main"}],
        "videos": [],
        "composition": comp,
        "sections": {"Indicații": {"text": desc, "tables": []}},
        "fresh_ingredients": [],
        "metabolizable_energy": "",
        "raw_text": f"{name} Ekoprom {brand_line} {species} {desc[:180]}",
    }


def u(code, slug, name, image, species, pack, desc, comp="Complex vitaminomineral cu coenzima Q10.", extra=None):
    return entry(code, slug, name, U + image[1], image[0], VIT, "neoterica-unitabs",
                 "Unitabs", species, pack, "Supliment vitaminomineral", desc + UNITABS_SUFFIX,
                 comp, ["Supliment", "Vitamine"] + (extra or []), VIT_FEATS)


# (slug, fisier, url-path)
UF = {
 "U312": ("unitabs-total-iepuri-pasari-rozatoare-10ml", "unitabs-total-iepuri-pasari-rozatoare-10ml.webp", "total-dlia-dlia-krolikov-ptitc-i-gryzunov-10-ml/"),
 "U313": ("unitabs-total-pisici-20ml", "unitabs-total-pisici-20ml.webp", "total-dlia-koshek-20-ml/"),
 "U314": ("unitabs-total-caini-50ml", "unitabs-total-caini-50ml.webp", "total-dlia-koshek-20-ml-1/"),
 "U311": ("unitabs-neokaprol-catei-caini-100tab", "unitabs-neokaprol-100tab.webp", "neokaprol/"),
 "U310": ("unitabs-prebiotic-pisici-caini-100tab", "unitabs-prebiotic-100tab.webp", "prebiotic-dlia-koshek-i-sobak-100-tab/"),
 "U309": ("unitabs-maltvit-pasta-pisici-120ml", "unitabs-maltvit-pasta-pisici-120ml.webp", "malt-vit-pasta-s-taurinom-dlia-koshek-120-ml/"),
 "U305": ("unitabs-biotinplus-pasta-pisici-120ml", "unitabs-biotinplus-pasta-pisici-120ml.webp", "biotinplus-pasta-s-biotinom-i-taurinom-dlia-koshek-120-ml/"),
 "U306": ("unitabs-sterilcat-pasta-120ml", "unitabs-sterilcat-pasta-120ml.webp", "sterilcat-pasta-dlia-kastr-kotov-i-steriliz-koshek-120-ml/"),
 "U307": ("unitabs-immunocat-pasta-120ml", "unitabs-immunocat-pasta-120ml.webp", "immunocat-pasta-s-taurinom-dlia-koshek-s-1-goda-do-8-let-120-ml/"),
 "U308": ("unitabs-mamakitty-pasta-120ml", "unitabs-mamakitty-pasta-120ml.webp", "mama-kitty-pasta-dlia-kotiat-beremennykh-i-kormiashchikh-koshek-120-ml/"),
 "U301": ("unitabs-biotinplus-pisici-120tab", "unitabs-biotinplus-pisici-120tab.webp", "biotinplus-dlia-koshek-120-tab/"),
 "U3012": ("unitabs-biotinplus-pisici-200tab", "unitabs-biotinplus-pisici-200tab.webp", "biotinplus-dlia-koshek-200-tab/"),
 "U302": ("unitabs-sterilcat-pisici-120tab", "unitabs-sterilcat-pisici-120tab.webp", "sterilcat-120-tab/"),
 "U3022": ("unitabs-sterilcat-pisici-200tab", "unitabs-sterilcat-pisici-200tab.webp", "sterilcat-200-tab/"),
 "U303": ("unitabs-immunocat-pisici-120tab", "unitabs-immunocat-pisici-120tab.webp", "immunocat-120-tab/"),
 "U3032": ("unitabs-immunocat-pisici-200tab", "unitabs-immunocat-pisici-200tab.webp", "immunocat-200-tab/"),
 "U304": ("unitabs-mamakitty-120tab", "unitabs-mamakitty-120tab.webp", "mama-kitty-dlia-kotiat-beremennykh-i-kormiashchikh-koshek-120-tab/"),
 "U3042": ("unitabs-mamakitty-200tab", "unitabs-mamakitty-200tab.webp", "mama-kitty-200-tab/"),
 "U201": ("unitabs-arthroactive-100tab", "unitabs-arthroactive-100tab.webp", "arthroactive-100-tab/"),
 "U2012": ("unitabs-arthroactive-200tab", "unitabs-arthroactive-200tab.webp", "arthroactive-200-tab/"),
 "U202": ("unitabs-brewerscomplex-caini-mari-100tab", "unitabs-brewerscomplex-mari-100tab.webp", "brewerscomplex-s-pivnymi-drozhzhami-dlia-krupnykh-sobak-100-tab/"),
 "U2022": ("unitabs-brewerscomplex-caini-mari-200tab", "unitabs-brewerscomplex-mari-200tab.webp", "brewerscomplex-s-pivnymi-drozhzhami-dlia-krupnykh-sobak-200-tab/"),
 "U203": ("unitabs-brewerscomplex-caini-mici-100tab", "unitabs-brewerscomplex-mici-100tab.webp", "brewerscomplex-s-pivnymi-drozhzhami-dlia-melkikh-sobak-100-tab/"),
 "U2032": ("unitabs-brewerscomplex-caini-mici-200tab", "unitabs-brewerscomplex-mici-200tab.webp", "brewerscomplex-s-pivnymi-drozhzhami-dlia-melkikh-sobak-200-tab/"),
 "U204": ("unitabs-calciplus-100tab", "unitabs-calciplus-100tab.webp", "calciplus-100-tab/"),
 "U2042": ("unitabs-calciplus-200tab", "unitabs-calciplus-200tab.webp", "calciplus-200-tab/"),
 "U205": ("unitabs-immunocomplex-caini-mari-100tab", "unitabs-immunocomplex-mari-100tab.webp", "immunocomplex-dlia-krupnykh-sobak-100-tab/"),
 "U206": ("unitabs-immunocomplex-caini-mici-100tab", "unitabs-immunocomplex-mici-100tab.webp", "immunocomplex-dlia-melkikh-sobak-100-tab/"),
 "U208": ("unitabs-mamacare-100tab", "unitabs-mamacare-100tab.webp", "mamacare-dlia-shchenkov-i-kormiashchikh-sobak-100-tab/"),
 "U207": ("unitabs-juniorcomplex-100tab", "unitabs-juniorcomplex-100tab.webp", "juniorcomplex-dlia-shchenkov-100-tab/"),
 "U2072": ("unitabs-juniorcomplex-200tab", "unitabs-juniorcomplex-200tab.webp", "juniorcomplex-200-tab/"),
 "U209": ("unitabs-seniorcomplex-100tab", "unitabs-seniorcomplex-100tab.webp", "seniorcomplex-dlia-sobak-starshe-7-let-100-tab/"),
 "U210": ("unitabs-slimcomplex-100tab", "unitabs-slimcomplex-100tab.webp", "slimcomplex-s-l-kartinitom-dlia-sobak-100-tab/"),
}

UD = {
 "U312": ("Unitabs Total — complex pentru iepuri, păsări și rozătoare, 10 ml",
          "Supliment alimentar pentru îmbunătățirea stării pielii, blănii și penajului și pentru îmbogățirea cu vitamine a iepurilor decorativi, rozătoarelor și păsărilor. Norma zilnică depinde de greutatea animalului.",
          "iepuri, păsări, rozătoare"),
 "U313": ("Unitabs Total — complex pentru pisici, 20 ml",
          "Supliment alimentar pentru pisici care asigură sănătatea și netezimea pielii și stimulează creșterea blănii.",
          "pisici"),
 "U314": ("Unitabs Total — complex pentru câini, 50 ml",
          "Supliment alimentar pentru câini care asigură sănătatea și netezimea pielii și stimulează creșterea blănii.",
          "câini"),
 "U311": ("Unitabs Neokaprol pentru căței și câini, 100 tablete",
          "Supliment alimentar pentru dezobișnuirea de coprofagie și reducerea mirosului fecalelor la căței și câini. Doza zilnică: 1 tabletă la 5 kg greutate corporală, timp de 2–4 săptămâni.",
          "căței, câini"),
 "U310": ("Unitabs Prebiotic pentru pisici și câini, 100 tablete",
          "Normalizează digestia, restaurează microflora benefică a intestinului și întărește imunitatea.",
          "pisici, câini"),
 "U309": ("Unitabs Malt+Vit — pastă cu taurină pentru pisici, 120 ml",
          "Pastă care ajută la eliminarea blănii din stomac și îmbogățește organismul cu vitamine și taurină.",
          "pisici"),
 "U305": ("Unitabs BiotinPlus — pastă cu biotină și taurină pentru pisici, 120 ml",
          "Îmbunătățește starea pielii și a blănii și întărește sistemul imunitar.",
          "pisici"),
 "U306": ("Unitabs SterilCat — pastă pentru motani castrați și pisici sterilizate, 120 ml",
          "Îmbunătățește funcționarea sistemului urinar și previne formarea calculilor urinari (struviți).",
          "pisici sterilizate"),
 "U307": ("Unitabs ImmunoCat — pastă cu taurină pentru pisici de 1–8 ani, 120 ml",
          "Întărește sistemul imunitar, reduce riscul de îmbolnăvire, acoperă necesarul de vitamine, macro- și microelemente și normalizează metabolismul.",
          "pisici"),
 "U308": ("Unitabs Mama+Kitty — pastă pentru pisoi și pisici gestante sau lactante, 120 ml",
          "Contribuie la dezvoltarea armonioasă a puișorilor și acoperă necesarul sporit de vitamine, macro- și microelemente la mame.",
          "pisoi, pisici gestante"),
 "U301": ("Unitabs BiotinPlus pentru pisici, 120 tablete",
          "Asigură sănătatea și netezimea pielii, reînnoirea celulelor, stimulează creșterea blănii și previne căderea acesteia. Întărește sistemul imunitar.",
          "pisici"),
 "U3012": ("Unitabs BiotinPlus pentru pisici, 200 tablete",
          "Asigură sănătatea și netezimea pielii, reînnoirea celulelor, stimulează creșterea blănii și previne căderea acesteia. Întărește sistemul imunitar.",
          "pisici"),
 "U302": ("Unitabs SterilCat pentru pisici, 120 tablete",
          "Îmbunătățește funcționarea sistemului urinar, previne formarea calculilor urinari (struviți) și previne obezitatea.",
          "pisici sterilizate"),
 "U3022": ("Unitabs SterilCat pentru pisici, 200 tablete",
          "Îmbunătățește funcționarea sistemului urinar, previne formarea calculilor urinari (struviți) și previne obezitatea.",
          "pisici sterilizate"),
 "U303": ("Unitabs ImmunoCat pentru pisici, 120 tablete",
          "Întărește sistemul imunitar, acoperă necesarul de vitamine, macro- și microelemente și normalizează metabolismul.",
          "pisici"),
 "U3032": ("Unitabs ImmunoCat pentru pisici, 200 tablete",
          "Întărește sistemul imunitar, acoperă necesarul de vitamine, macro- și microelemente și normalizează metabolismul.",
          "pisici"),
 "U304": ("Unitabs Mama+Kitty pentru pisoi și pisici gestante sau lactante, 120 tablete",
          "Contribuie la dezvoltarea armonioasă a puișorilor și acoperă necesarul sporit de vitamine, macro- și microelemente.",
          "pisoi, pisici gestante"),
 "U3042": ("Unitabs Mama+Kitty pentru pisoi și pisici gestante sau lactante, 200 tablete",
          "Contribuie la dezvoltarea armonioasă a puișorilor și acoperă necesarul sporit de vitamine, macro- și microelemente.",
          "pisoi, pisici gestante"),
 "U201": ("Unitabs ArthroActive pentru câini cu glucozamină și MSM, 100 tablete",
          "Menține funcția articulațiilor și a cartilagiilor la câinii de talie mare de la vârsta de 3 luni, la câinii seniori și la cei cu exces de greutate. Se administrează în hrană sau oral, zilnic, 1 tabletă la 10 kg greutate corporală.",
          "câini"),
 "U2012": ("Unitabs ArthroActive pentru câini cu glucozamină și MSM, 200 tablete",
          "Menține funcția articulațiilor și a cartilagiilor la câinii de talie mare de la vârsta de 3 luni, la câinii seniori și la cei cu exces de greutate. Se administrează în hrană sau oral, zilnic, 1 tabletă la 10 kg greutate corporală.",
          "câini"),
 "U202": ("Unitabs BrewersComplex cu drojdie de bere pentru câini mari, 100 tablete",
          "Contribuie la creșterea activă, elimină fragilitatea și uscăciunea blănii și asigură sănătatea și netezimea pielii.",
          "câini de talie mare"),
 "U2022": ("Unitabs BrewersComplex cu drojdie de bere pentru câini mari, 200 tablete",
          "Contribuie la creșterea activă, elimină fragilitatea și uscăciunea blănii și asigură sănătatea și netezimea pielii.",
          "câini de talie mare"),
 "U203": ("Unitabs BrewersComplex cu drojdie de bere pentru câini mici, 100 tablete",
          "Contribuie la creșterea activă, elimină fragilitatea și uscăciunea blănii și asigură sănătatea și netezimea pielii.",
          "câini de talie mică"),
 "U2032": ("Unitabs BrewersComplex cu drojdie de bere pentru câini mici, 200 tablete",
          "Contribuie la creșterea activă, elimină fragilitatea și uscăciunea blănii și asigură sănătatea și netezimea pielii.",
          "câini de talie mică"),
 "U204": ("Unitabs CalciPlus cu calciu, fosfor și vitamină D, 100 tablete",
          "Întărește țesutul osos și dinții și contribuie la creșterea și dezvoltarea activă.",
          "câini, pisici"),
 "U2042": ("Unitabs CalciPlus cu calciu, fosfor și vitamină D, 200 tablete",
          "Întărește țesutul osos și dinții și contribuie la creșterea și dezvoltarea activă.",
          "câini, pisici"),
 "U205": ("Unitabs ImmunoComplex pentru câini mari, 100 tablete",
          "Întărește sistemul imunitar, reduce riscul de îmbolnăvire, acoperă necesarul de vitamine și microelemente și normalizează metabolismul.",
          "câini de talie mare"),
 "U206": ("Unitabs ImmunoComplex pentru câini mici, 100 tablete",
          "Întărește sistemul imunitar, reduce riscul de îmbolnăvire, acoperă necesarul de vitamine și microelemente și normalizează metabolismul.",
          "câini de talie mică"),
 "U208": ("Unitabs MamaCare pentru cățele gestante și lactante, 100 tablete",
          "Asigură dezvoltarea armonioasă a puișorilor și a fătului, îmbunătățește compoziția și secreția laptelui.",
          "cățele gestante"),
 "U207": ("Unitabs JuniorComplex pentru căței, 100 tablete",
          "Stimulează creșterea și dezvoltarea, susține imunitatea și îmbunătățește apetitul.",
          "căței"),
 "U2072": ("Unitabs JuniorComplex pentru căței, 200 tablete",
          "Stimulează creșterea și dezvoltarea, susține imunitatea și îmbunătățește apetitul.",
          "căței"),
 "U209": ("Unitabs SeniorComplex pentru câini peste 7 ani, 100 tablete",
          "Încetinește procesul de îmbătrânire, susține imunitatea și normalizează metabolismul.",
          "câini seniori"),
 "U210": ("Unitabs SlimComplex cu L-carnitină pentru câini, 100 tablete",
          "Reduce excesul de greutate, întărește sistemul imunitar, normalizează metabolismul și scade nivelul colesterolului.",
          "câini"),
}

products = []
for code, (slug, img, path) in UF.items():
    name, desc, species = UD[code]
    products.append(entry(code, slug, name, U + path, img, VIT,
                          "neoterica-unitabs", "Unitabs", species,
                          name.split(",")[-1].strip() if "," in name else "1 flacon",
                          "Supliment vitaminomineral", desc + UNITABS_SUFFIX,
                          "Complex vitaminomineral cu coenzima Q10.",
                          ["Supliment", "Vitamine"], VIT_FEATS))

# ---------- CHISTOTEL ----------
CH_FEATS_ANTIP = [
    "Formula îmbunătățită, cu spectru larg de acțiune.",
    "Raport preț–calitate excelent — marca populară Чистотел.",
]

def c(code, slug, name, path, img, species, pack, ptype, desc, comp, labels_extra, cat=ANTIP):
    return entry(code, slug, name, C + path, img, cat, "chistotel", "Chistotel",
                 species, pack, ptype, desc, comp, labels_extra, CH_FEATS_ANTIP)

CH = "chistotel/"
products += [
    c("C101", "chistotel-tablete-anthelmintice-caini-pisici-6tab",
      "Chistotel — tablete anthelmintice pentru câini și pisici, 6 tablete",
      "antigelmintnye-tabletki-dlia-sobak-i-koshek-6-sht/",
      "chistotel-tablete-anthelmintice-6tab.webp", "câini, pisici", "6 tablete",
      "Anthelmintic",
      "Chistotel anthelmintic se administrează câinilor și pisicilor cu scop curativ și profilactic în nematodoze (toxocaroză, toxascarioză, uncinarioză, anchilostomoză) și cestodoze (teniaze, dipilidioză, echinococoze, difilobotrioză). Se administrează o singură dată, oral, la hrănirea de dimineață cu puțină hrană — 1 tabletă la 5 kg greutate corporală. În invazii masive, deparazitarea se repetă după 14 zile.",
      "Substanțe active în 1 tabletă: pirantel pamoat 125 mg, praziquantel 25 mg.",
      ["Anthelmintic", "Deparazitare"]),
    c("C102", "chistotel-suspensie-anthelmintica-pisici-5ml",
      "Chistotel — suspensie anthelmintică pentru pisici, 5 ml",
      "antigelmintnaia-suspenziia-dlia-koshek-5-ml/",
      "chistotel-suspensie-pisici-5ml.webp", "pisici", "5 ml",
      "Suspensie anthelmintică",
      "Suspensie anthelmintică cu spectru larg de acțiune asupra tuturor stadiilor de dezvoltare ale helmintilor rotunzi și în formă de bandă, pentru pisici.",
      "Substanțe active în 1 ml: pirantel pamoat 50 mg, praziquantel 10 mg.",
      ["Anthelmintic", "Deparazitare"]),
    c("C103", "chistotel-suspensie-anthelmintica-caini-7ml",
      "Chistotel — suspensie anthelmintică pentru câini, 7 ml",
      "antigelmintnaia-suspenziia-dlia-sobak-7-ml/",
      "chistotel-suspensie-caini-7ml.webp", "câini", "7 ml",
      "Suspensie anthelmintică",
      "Suspensie anthelmintică cu spectru larg de acțiune asupra tuturor stadiilor de dezvoltare ale helmintilor rotunzi și în formă de bandă, pentru câini.",
      "Substanțe active în 1 ml: pirantel pamoat 250 mg, praziquantel 50 mg.",
      ["Anthelmintic", "Deparazitare"]),
    c("C104", "chistotel-suspensie-anthelmintica-junior-3ml",
      "Chistotel Junior — suspensie anthelmintică, 3 ml",
      "antigelmintnaia-suspenziia-iunior-3-ml/",
      "chistotel-suspensie-junior-3ml.webp", "căței, pisoi", "3 ml",
      "Suspensie anthelmintică",
      "Suspensie anthelmintică cu spectru larg de acțiune asupra tuturor stadiilor de dezvoltare ale helmintilor rotunzi și în formă de bandă, pentru căței și pisoi.",
      "Substanțe active în 1 ml: pirantel pamoat 50 mg, praziquantel 10 mg.",
      ["Anthelmintic", "Deparazitare", "Junior"]),
    c("C105", "chistotel-suspensie-anthelmintica-caini-mici-5ml",
      "Chistotel — suspensie anthelmintică pentru câini de talie mică, 5 ml",
      "antigelmintnaia-suspenziia-dlia-melkikh-sobak-5-ml/",
      "chistotel-suspensie-caini-mici-5ml.webp", "câini de talie mică", "5 ml",
      "Suspensie anthelmintică",
      "Suspensie anthelmintică cu spectru larg de acțiune asupra tuturor stadiilor de dezvoltare ale helmintilor rotunzi și în formă de bandă, pentru câini de talie mică.",
      "Substanțe active în 1 ml: pirantel pamoat 50 mg, praziquantel 10 mg.",
      ["Anthelmintic", "Deparazitare"]),
    c("C710", "chistotel-lotiune-ochi-taurina-25ml",
      "Chistotel — loțiune pentru ochi cu taurină, 25 ml",
      "los-on-dlia-glaz-25-ml/",
      "chistotel-lotiune-ochi-taurina-25ml.webp", "câini, pisici", "25 ml",
      "Loțiune pentru ochi",
      "Loțiune pentru îngrijirea ochilor: îndepărtează delicat murdăria și secrețiile, reduce edemul, pruritul și iritația și previne afecțiunile oculare. Taurina menține ochii tineri și sănătoși.",
      "Cu taurină.",
      ["Îngrijire", "Ochi"], IGIENA),
]

COLLAR_DESC = (
    "Zgarda Chistotel Maximum se utilizează pentru distrugerea puricilor, malofagelor și "
    "căpușelor ixodide și pentru protecția animalelor împotriva atacului acestora, mai ales "
    "în sezonul cald. Purtarea continuă asigură protecție împotriva căpușelor ixodide timp "
    "de 3 luni și împotriva insectelor timp de 4 luni. Pentru efect maxim, zgarda se pune "
    "animalului cu 2–3 zile înainte de contactul presupus cu paraziții."
)
COLLAR_COMP = "Substanțe active: fipronil 5%, permetrin 1%."
COLLAR_PLUS = (
    "Zgarda Chistotel Plus se utilizează pentru distrugerea puricilor, păduchilor, "
    "malofagelor și căpușelor ixodide și pentru protecția animalelor împotriva atacului "
    "acestora. Purtarea continuă asigură protecție împotriva căpușelor ixodide timp de "
    "3 luni și împotriva insectelor timp de 4 luni. După deschiderea ambalajului, zgarda "
    "se desface, se ajustează lăsând un spațiu de 1–1,5 cm între gât și zgardă, se fixează "
    "și excesul se taie. Se pune cu 2–3 zile înainte de contactul presupus cu paraziții."
)
COLLAR_PLUS_COMP = "Substanțe active: diazinon 10%."

products += [
    c("C605", "chistotel-zgarda-pisici-neagra",
      "Chistotel Maximum — zgardă antiparazitară pentru pisici, neagră",
      "osheinik-ot-blokh-i-kleshchei-dlia-koshek-chernyi/",
      "chistotel-zgarda-pisici-neagra.webp", "pisici (de la 4 luni)", "1 zgardă",
      "Zgardă antiparazitară", COLLAR_DESC, COLLAR_COMP, ["Zgardă", "Purici", "Căpușe"]),
    c("C606", "chistotel-zgarda-pisici-violet",
      "Chistotel Maximum — zgardă antiparazitară pentru pisici, violet",
      "osheinik-ot-blokh-i-kleshchei-dlia-koshek-fioletovyi/",
      "chistotel-zgarda-pisici-violet.webp", "pisici (de la 4 luni)", "1 zgardă",
      "Zgardă antiparazitară", COLLAR_DESC, COLLAR_COMP, ["Zgardă", "Purici", "Căpușe"]),
    c("C607", "chistotel-zgarda-pisici-rosu",
      "Chistotel Maximum — zgardă antiparazitară pentru pisici, roșu",
      "osheinik-ot-blokh-i-kleshchei-dlia-koshek-krasnyi/",
      "chistotel-zgarda-pisici-rosu.webp", "pisici (de la 4 luni)", "1 zgardă",
      "Zgardă antiparazitară", COLLAR_DESC, COLLAR_COMP, ["Zgardă", "Purici", "Căpușe"]),
    c("C608", "chistotel-zgarda-caini-neagra",
      "Chistotel Maximum — zgardă antiparazitară pentru câini, neagră",
      "osheinik-ot-blokh-i-kleshchei-dlia-sobak-chernyi/",
      "chistotel-zgarda-caini-neagra.webp", "câini", "1 zgardă",
      "Zgardă antiparazitară", COLLAR_DESC, COLLAR_COMP, ["Zgardă", "Purici", "Căpușe"]),
    c("C609", "chistotel-zgarda-caini-violet",
      "Chistotel Maximum — zgardă antiparazitară pentru câini, violet",
      "osheinik-ot-blokh-i-kleshchei-dlia-sobak-fioletovyi/",
      "chistotel-zgarda-caini-violet.webp", "câini", "1 zgardă",
      "Zgardă antiparazitară", COLLAR_DESC, COLLAR_COMP, ["Zgardă", "Purici", "Căpușe"]),
    c("C610", "chistotel-zgarda-caini-rosu",
      "Chistotel Maximum — zgardă antiparazitară pentru câini, roșu",
      "osheinik-ot-blokh-i-kleshchei-dlia-sobak-krasnyi/",
      "chistotel-zgarda-caini-rosu.webp", "câini", "1 zgardă",
      "Zgardă antiparazitară", COLLAR_DESC, COLLAR_COMP, ["Zgardă", "Purici", "Căpușe"]),
    c("C611", "chistotel-zgarda-catei-pisoi-neagra",
      "Chistotel Maximum — zgardă antiparazitară pentru căței și pisoi, neagră",
      "osheinik-ot-blokh-i-kleshchei-dlia-shchenkov-i-kotiat-chernyi/",
      "chistotel-zgarda-catei-pisoi-neagra.webp", "căței, pisoi", "1 zgardă",
      "Zgardă antiparazitară", COLLAR_DESC, COLLAR_COMP, ["Zgardă", "Purici", "Căpușe"]),
    c("C612", "chistotel-zgarda-catei-pisoi-violet",
      "Chistotel Maximum — zgardă antiparazitară pentru căței și pisoi, violet",
      "osheinik-ot-blokh-i-kleshchei-dlia-shchenkov-i-kotiat-fioletovyi/",
      "chistotel-zgarda-catei-pisoi-violet.webp", "căței, pisoi", "1 zgardă",
      "Zgardă antiparazitară", COLLAR_DESC, COLLAR_COMP, ["Zgardă", "Purici", "Căpușe"]),
    c("C613", "chistotel-zgarda-catei-pisoi-rosu",
      "Chistotel Maximum — zgardă antiparazitară pentru căței și pisoi, roșu",
      "osheinik-ot-blokh-i-kleshchei-dlia-shchenkov-i-kotiat-krasnyi/",
      "chistotel-zgarda-catei-pisoi-rosu.webp", "căței, pisoi", "1 zgardă",
      "Zgardă antiparazitară", COLLAR_DESC, COLLAR_COMP, ["Zgardă", "Purici", "Căpușe"]),
    c("C620", "chistotel-zgarda-pisici-caini-3culori",
      "Chistotel Maximum — set 3 zgărzi antiparazitare pentru pisici și câini, culori diferite",
      "osheinik-ot-blokh-i-kleshchei-dlia-koshek-i-sobak-3-tcveta/",
      "chistotel-zgarda-pisici-caini-3culori.webp", "pisici, câini", "3 zgărzi",
      "Zgardă antiparazitară", COLLAR_DESC, COLLAR_COMP, ["Zgardă", "Purici", "Căpușe"]),
    c("C202", "chistotel-zgarda-caini-65cm",
      "Chistotel Plus — zgardă antiparazitară pentru câini, 65 cm",
      "osheinik-ot-blokh-i-kleshchei-dlia-sobak-65-sm/",
      "chistotel-zgarda-caini-65cm.webp", "câini", "1 zgardă, 65 cm",
      "Zgardă antiparazitară", COLLAR_PLUS, COLLAR_PLUS_COMP, ["Zgardă", "Purici", "Căpușe"]),
    c("C201", "chistotel-zgarda-pisici-35cm",
      "Chistotel Plus — zgardă antiparazitară pentru pisici, 35 cm",
      "osheinik-ot-blokh-i-kleshchei-dlia-koshek-35-sm/",
      "chistotel-zgarda-pisici-35cm.webp", "pisici", "1 zgardă, 35 cm",
      "Zgardă antiparazitară", COLLAR_PLUS, COLLAR_PLUS_COMP, ["Zgardă", "Purici", "Căpușe"]),
    c("C314", "chistotel-sampon-antiparazitar-180ml",
      "Chistotel — șampon antiparazitar universal, 180 ml",
      "antiparazitarnyi-shampun-universalnyi-180-ml/",
      "chistotel-sampon-antiparazitar-180ml.webp", "câini, pisici", "180 ml",
      "Șampon antiparazitar",
      "Șampon zoo tehnic pentru distrugerea agenților de entomoze (purici, păduchi, malofagi) care parazitează câinii și pisicile. Se udă abundent blana cu apă caldă, apoi se aplică șamponul în doză de 0,5–1 ml pe kg greutate corporală, se freacă ușor până la formarea spumei, evitând contactul cu ochii și lingerea de către animal.",
      "Substanțe active: permetrin 0,4%.",
      ["Șampon", "Purici", "Deparazitare"]),
    c("C327", "chistotel-spray-pisici-caini-iepuri-100ml",
      "Chistotel — spray antiparazitar pentru pisici, câini și iepuri decorativi, 100 ml",
      "sprei-dlia-koshek-sobak-i-dekorativnykh-krolikov-100-ml/",
      "chistotel-spray-pisici-caini-iepuri-100ml.webp",
      "pisici, câini, iepuri decorativi", "100 ml",
      "Spray antiparazitar",
      "Spray zoo tehnic pentru distrugerea căpușelor ixodide și sarcoptice, puricilor, păduchilor și malofagelor care parazitează câinii, pisicile și iepurii decorativi, precum și pentru prevenirea atacului ectoparaziților. Se agită flaconul și se pulverizează de la 15–20 cm pe suprafața tratată.",
      "Substanțe active: permetrin 0,35%, alcool izopropilic, glicerină.",
      ["Spray", "Purici", "Căpușe"]),
]

path = "scrape/ekoprom_products.json"
data = json.load(open(path, encoding="utf-8"))
existing = {p["slug"] for p in data["products"]}
added = [p for p in products if p["slug"] not in existing]
data["products"].extend(added)
json.dump(data, open(path, "w", encoding="utf-8"), ensure_ascii=False, indent=2)
print(f"adaugate {len(added)} produse noi; total ekoprom: {len(data['products'])}")
