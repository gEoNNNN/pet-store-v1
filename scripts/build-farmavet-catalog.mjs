/**
 * Construiește catalogul scrape/farmavet_products.json din documentele
 * „SAIT FARMAVET 2026”. Fiecare intrare din TABEL de mai jos este produsul
 * clasificat manual (categorie, specii, imagine, descriere) pe baza textului
 * extras din prospectul Word corespunzător; câmpul `prospect` se leagă automat
 * de fișierul deja copiat în public/prospecte (aceeași normare ca în
 * scripts/prospecte.mjs).
 *
 * Rulare:  node scripts/build-farmavet-catalog.mjs
 */
import { existsSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";

const root = process.cwd();
const sourceDir = path.join(root, "SAIT FARMAVET 2026");
const targetDir = path.join(root, "public", "prospecte");
const outFile = path.join(root, "scrape", "farmavet_products.json");
const brandsFile = path.join(root, "scrape", "farmavet_brands.json");
const sectionsFile = path.join(root, "scrape", "farmavet_sections.json");

/** slug de producător (brand_slug) → nume afișat; trebuie sincronizat cu
 *  ProductBrandSlug din src/data/products.ts. */
export const FARM_BRANDS = {
  farmavet: "Farmavet",
  olkar: "O.L.KAR",
  "hebei-vezong": "Hebei Vezong",
  biofarm: "Biofarm",
  vetsintez: "Vetsintez",
  aveflor: "Aveflor",
  bavet: "BAVET",
  msd: "MSD Animal Health",
  vanellivet: "Vanellivet",
  ruvera: "RUVERA",
  "veyx-pharma": "Veyx-Pharma",
  "cid-lines": "CID Lines",
  "shandong-luxi": "Shandong Luxi",
  "icb-pharma": "ICB Pharma",
  "fgbu-stavropol": "FGBU Stavropol",
  "biofabrica-armavir": "Biofabrica Armavir",
  vniivvim: "VNIIVViM",
  "promark-trade": "Promark Trade",
  tecro: "Tecro",
  marel: "Marel",
  bioceval: "Bioceval",
  vitafor: "Vitafor",
};

/* --------------------------------------------------------------- categorii */

const CAT = {
  antibact: "Antibacteriene și antifungice",
  antiinf: "Antiinflamatoare și analgezice",
  antip: "Antiparazitare interne și externe",
  antis: "Antiseptice și produse pentru îngrijirea rănilor",
  tonice: "Tonice și produse pentru rehidratare",
  repro: "Produse pentru reproducție și sănătatea glandei mamare",
  vaccin: "Vaccinuri și alte produse biologice",
  imun: "Imunostimulatoare",
  vit: "Vitamine, minerale și premixuri",
  dezinf: "Curățare, igienă și dezinfecție",
  dezin: "Dezinsecție și deratizare",
};

const IMG = {
  bovine: "/cards/bovine.jpeg",
  ovine: "/cards/ovine.jpeg",
  porcine: "/cards/porcine.jpeg",
  pasari: "/cards/pasari.jpeg",
  pets: "/cards/animale decomponie.jpeg",
  horse: "/hero/horse.webp",
  iepure: "/hero/rabbit.webp",
  mediu: "/magazin.jpeg",
};

/* ---------------------------------------------------- normare (ca în prospecte.mjs) */

function normalizeText(value) {
  return value
    .toLowerCase()
    .replace(/[șş]/g, "s")
    .replace(/[țţ]/g, "t")
    .replace(/ă/g, "a")
    .replace(/â/g, "i")
    .replace(/î/g, "i")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function tokens(value) {
  return normalizeText(value)
    .split(" ")
    .filter(Boolean)
    .map((token) => (token === "insectal" ? "insektal" : token)); // alias, ca în prospecte.mjs
}

function slugify(value) {
  return tokens(value).join("-");
}

/* --------------------------------------------------------------- tabel produse */
// key = numele fișierului sursă normat (fără extensie); duplicatele inter-folder
// (Amoclox/Mastilong/Metristar, IAM≡Funghibak) apar o singură dată.

const TABEL = [
  // ————————— ANTIBACTERIERE ȘI ANTIFUNGICE (17)
  { key: "prospect tilozin", name: "Tilozină 20% pulbere", cat: CAT.antibact, img: IMG.bovine, sp: ["Bovine", "Ovine", "Porcine", "Câini", "Pisici", "Păsări", "Caprine"],
    desc: "Antibiotic macrolidic pe bază de tilozină pentru bovine, ovine, porcine, câini, pisici și găini. Tratamentul infecțiilor respiratorii, genito-urinare și ale glandei mamare produse de bacterii sensibile la tilozină." },
  { key: "prospect amoxacilin", name: "Amoxacilin — amoxicilină injectabilă", cat: CAT.antibact, img: IMG.bovine, sp: ["Bovine", "Ovine", "Porcine", "Câini", "Pisici", "Caprine"],
    desc: "Antibiotic cu amoxicilină pentru tratamentul la bovine, ovine, caprine, porcine, câini și pisici al bolilor tractului digestiv și respirator, ale sistemului urogenital, precum și a infecțiilor de plagă." },
  { key: "prospect biovit 80", name: "Biovit 80 — clortetraciclină 8% pulbere", cat: CAT.antibact, img: IMG.bovine, sp: ["Bovine", "Porcine", "Păsări", "Iepuri"],
    desc: "Antibiotic pulbere pe bază de clortetraciclină pentru viței, purcei, animale de blană și păsări de curte. Tratament împotriva pasteurelozei, colibacteriozei, salmonelozei, listeriozei și infecțiilor respiratorii." },
  { key: "prospect bitinovet 5", name: "Biținovet-5 — pulbere pentru suspensie injectabilă", cat: CAT.antibact, img: IMG.pets, sp: ["Câini", "Pisici"],
    desc: "Antibiotic injectabil pentru câini și nurci. Tratamentul necrobacteriozei, pasteurelozei, pneumoniei, mastitei, metritei, otitei și infecțiilor de plagă cauzate de microorganisme sensibile." },
  { key: "prospect ceftiofur", name: "Ceftiofur — suspensie injectabilă", cat: CAT.antibact, img: IMG.porcine, sp: ["Porcine", "Bovine", "Ovine"],
    desc: "Antibiotic cefalosporinic injectabil pentru porcine și bovine. Tratamentul bolilor respiratorii bacteriene, metrită-magaliță-agalactie (MMA) și infecțiilor produse de bacterii sensibile la ceftiofur." },
  { key: "prospect colivetoprim", name: "Colivetoprim — pulbere hidrosolubilă", cat: CAT.antibact, img: IMG.bovine, sp: ["Bovine", "Ovine", "Porcine", "Iepuri", "Păsări", "Caprine"],
    desc: "Asociație de sulfadimidină și trimetoprim pentru viței, miei, iezi, suine, iepuri și păsări. Tratamentul infecțiilor gastro-intestinale determinate de germeni sensibili." },
  { key: "prospect enroflacina injecta", name: "Enrofloxacină 10% soluție injectabilă", cat: CAT.antibact, img: IMG.bovine, sp: ["Bovine", "Porcine", "Păsări", "Câini", "Pisici", "Ovine", "Caprine"],
    desc: "Antibiotic injectabil cu enrofloxacină, spectru larg, pentru bovine, suine, păsări, câini și pisici. Infecții respiratorii, digestive, urogenitale și ale pielii cauzate de bacterii sensibile la fluoroquinolone." },
  { key: "prospect farmazin", name: "Farazin — pulbere orală", cat: CAT.antibact, img: IMG.pasari, sp: ["Păsări", "Bovine", "Ovine", "Porcine", "Iepuri"],
    desc: "Antibiotic pulbere pentru păsări (pui broiler, pui de găină și de curcan) în enterite, artrită infecțioasă, vibrioză și spirochetoză, precum și pentru alte specii de ferme." },
  { key: "prospect funghibak iam", name: "Funghibak-IAM — unguent antimicotic", cat: CAT.antibact, img: IMG.bovine, sp: ["Bovine", "Ovine", "Porcine", "Câini", "Pisici", "Cabaline", "Caprine"],
    desc: "Unguent antimicotic de uz extern pentru tratamentul complex la bovine, cabaline, caprine, porcine, câini și pisici: microsporidioză, trihofitie, dermatofitoză și leziuni ale pielii." },
  { key: "prospect metronidazol 25", name: "Metronidazol 25% pulbere", cat: CAT.antibact, img: IMG.pets, sp: ["Câini", "Pisici"],
    desc: "Preparat antimicrobian și antiprotozoaric pe bază de metronidazol pentru câini, pisici și nurci. Tratamentul diareei provocate de Campylobacter, lambliazei, amoebiazei, giardiozei și gingivitelor ulcerative." },
  { key: "prospect nifulin", name: "Nifulin MOF — pulbere orală", cat: CAT.antibact, img: IMG.pets, sp: ["Câini", "Pisici", "Păsări"],
    desc: "Antibiotic intestinal pe bază de nifuruxazim pentru câini, pisici, animale de blană și porumbei decorativi. Boli ale tractului digestiv și prevenirea complicațiilor postoperatorii." },
  { key: "prospect noredon c", name: "Noredon C — florfenicol comprimate pentru păsări", cat: CAT.antibact, img: IMG.pasari, sp: ["Păsări"],
    desc: "Antibiotic cu florfenicol sub formă de comprimate pentru păsări (găini, broiler, curcani). Tratamentul și profilaxia infecțiilor bacteriene din efectivele cu diagnostic confirmat." },
  { key: "prospect norflox", name: "Norflox 10% soluție orală", cat: CAT.antibact, img: IMG.pasari, sp: ["Păsări"],
    desc: "Antibiotic cu norfloxacină pentru păsările de curte (pui, curcani, gâște, rațe). Tratamentul rinitei infecțioase, enteritei necrozante, colibacilozei și pasteurelozei." },
  { key: "prospect peniprok", name: "Peniprok — penicilină injectabilă", cat: CAT.antibact, img: IMG.bovine, sp: ["Bovine", "Porcine", "Câini", "Pisici", "Ovine"],
    desc: "Antibiotic pe bază de procaină-penicilină și benzatin-penicilină pentru bovine, porcine, câini și pisici. Omfalite, artrite, mastite, septicemii și infecții ale plagilor." },
  { key: "prospect trimeroxin", name: "Trimeroxin — pulbere orală", cat: CAT.antibact, img: IMG.bovine, sp: ["Bovine", "Ovine", "Porcine", "Câini", "Pisici", "Caprine"],
    desc: "Asociation antibacteriană (sulfamidă + trimetoprim) pentru viței, ovine, caprine, porcine, câini și pisici. Infecții ale sistemului respirator și digestiv sensibile la sulfamide." },
  { key: "prospect trimicozin", name: "Trimicozin — soluție orală pentru păsări", cat: CAT.antibact, img: IMG.pasari, sp: ["Păsări"],
    desc: "Soluție orală cu enrofloxacină și tilozină pentru păsări. Tratamentul bolilor infecțioase cauzate de microflora bacteriană sensibilă." },
  { key: "prospect bromodox rev f", name: "Bromodox — soluție injectabilă", cat: CAT.antibact, img: IMG.bovine, sp: ["Bovine", "Ovine", "Porcine", "Caprine"],
    desc: "Antibiotic injectabil cu doxiciclină pentru bovine, ovine, caprine și porcine. Bronhopneumonii, pneumonii, pneumonia enzootică și alte infecții sensibile la tetracicline." },

  // ————————— ANTIINFLAMATOARE ȘI ANALGEZICE (8)
  { key: "prospect analghin", name: "Analghin 50% soluție injectabilă", cat: CAT.antiinf, img: IMG.horse, sp: ["Bovine", "Cabaline", "Câini", "Pisici"],
    desc: "Analgezic și antipiretic pe bază de metamizolă pentru reducerea durerilor de diverse origini, colici, afecțiuni ale mușchilor și articulațiilor la cabaline, bovine, câini și pisici." },
  { key: "prospect ketoline", name: "Ketoline — soluție injectabilă", cat: CAT.antiinf, img: IMG.bovine, sp: ["Bovine", "Cabaline", "Porcine", "Ovine"],
    desc: "Antiinflamator nesteroidian cu ketoprofen pentru bovine, cabaline și porcine. Mastită și edem mamar, infecții respiratorii, procese inflamatorii ale aparatului locomotor, laminită." },
  { key: "unguent ecomint", name: "Ecomint — unguent antiinflamator", cat: CAT.antiinf, sp: ["Toate speciile"], img: IMG.bovine,
    desc: "Unguent antiinflamator și analgezic de uz veterinar pentru toate speciile. Inflamații puternice și dureri, mastite, leziuni musculare și tendinoase, contuzii, mușcături de insecte." },
  { key: "unguent gren plus", name: "Green Plus — liniment pentru articulații", cat: CAT.antiinf, img: IMG.bovine, sp: ["Bovine", "Cabaline"],
    desc: "Liniment verde topic cu mentol, eucalipt și camfor pentru tratarea rapidă a durerilor din afecțiuni inflamatorii ale articulațiilor, mușchilor, ligamentelor și tendoanelor; și în mastite." },
  { key: "unguent therma", name: "Therma Vet Cream — cremă de masaj", cat: CAT.antiinf, img: IMG.horse, sp: ["Cabaline", "Câini"],
    desc: "Cremă cu acțiune dublă (răcire urmată de încălzire) pe bază de capsaicin, salicilat de metil și mentol. Reduce stresul muscular și durerea după efort; leziuni ale tendoanelor și ligamentelor." },
  { key: "unguent viexat", name: "Veyxat Gel — gel contra durerilor", cat: CAT.antiinf, img: IMG.horse, sp: ["Bovine", "Cabaline", "Câini"],
    desc: "Gel cu camfor și salicilat de metil pentru durerile asociate cu artrite, miozite și tendinite, abcese, hematoame și mastite. Îmbunătățește circulația locală și grăbește rezorbția proceselor inflamatorii." },
  { key: "unguent ecocamfora", name: "EcoCamfora — unguent de masaj 100 g", cat: CAT.antiinf, img: IMG.bovine, sp: ["Bovine", "Cabaline", "Câini", "Pisici"],
    desc: "Unguent suplimentar cu camfor pentru bovine, cabaline, câini și pisici. Inflamații ale glandei mamare (aplicat după muls cu masaj ușor), răni, zgârieturi, luxații, contuzii și inflamații articulare." },
  { key: "unguent aloe gel", name: "AloeGel — gel cu aloe vera și castan", cat: CAT.antiinf, img: IMG.bovine, sp: ["Bovine"],
    desc: "Gel topic cu extracte de aloe vera, castan sălbatic, camfor și salicilat de metil pentru bovine. Reduce edemul ugerului după fătare sau mastită, regenerează țesuturile și susține circulația periferică." },

  // ————————— ANTIPARAZITARE INTERNE ȘI EXTERNE (24)
  { key: "prospect adtab caini", name: "AdTab — tablete antiparazitare pentru câini", cat: CAT.antip, img: IMG.pets, sp: ["Câini"],
    desc: "Tablete cu lotilaner pentru tratamentul infestării cu purici și căpușe la câini. Eliminare imediată și protecție care durează până la 8 săptămâni." },
  { key: "prospect adtab pisici", name: "AdTab — tablete antiparazitare pentru pisici", cat: CAT.antip, img: IMG.pets, sp: ["Pisici"],
    desc: "Tablete cu lotilaner pentru tratamentul infestării cu purici și căpușe la pisici. Eliminare imediată și protecție de lungă durată." },
  { key: "prospect arpalit neo", name: "Arpalit Neo — spray ectoparazitar", cat: CAT.antip, img: IMG.pets, sp: ["Câini", "Pisici", "Iepuri", "Rozătoare"],
    desc: "Soluție ectoparazitară sub formă de spray pentru animalele nealimentare. Acționează împotriva puricilor, căpușelor, păduchilor și altor ectoparaziți." },
  { key: "prospect batik", name: "Ba-Tick — soluție ectoparaziticidă pour-on", cat: CAT.antip, img: IMG.bovine, sp: ["Bovine", "Ovine", "Câini"],
    desc: "Soluție ectoparaziticidă pour-on pentru bovine. Combaterea căpușelor (Rhipicephalus, Hyalomma, Dermacentor), păduchilor, potrvaelurilor și miazelor." },
  { key: "prospect bravecta caini masticabil", name: "Bravecto — tablete masticabile pentru câini", cat: CAT.antip, img: IMG.pets, sp: ["Câini"],
    desc: "Insecticid și acaricid sistemic pentru tratarea infestațiilor cu căpușe și purici la câini. Protecție de până la 12 săptămâni după o singură doză." },
  { key: "prospect bravecto injectabil", name: "Bravecto — suspensie injectabilă pentru câini", cat: CAT.antip, img: IMG.pets, sp: ["Câini"],
    desc: "Bravecto 150 mg/ml, pulbere și solvent pentru suspensie injectabilă. Tratamentul infestațiilor cu căpușe și purici la câini, protecție de până la 6 luni." },
  { key: "prospect bravecto pisici", name: "Bravecto — soluție spot-on pentru pisici", cat: CAT.antip, img: IMG.pets, sp: ["Pisici"],
    desc: "Bravecto 112,5 mg soluție spot-on pentru pisici (1,2–2,8 kg). Tratamentul infestațiilor cu căpușe și purici." },
  { key: "prospect burdi spray", name: "Burdi fipro — spray insecto-acaricid", cat: CAT.antip, img: IMG.pets, sp: ["Câini", "Pisici"],
    desc: "Spray cu fipronil pentru prevenirea și tratamentul ectoparaziților la câini și pisici: purici, păduchi, malofage, căpușe." },
  { key: "prospect albendazol 10", name: "Albendazol 10% suspensie orală", cat: CAT.antip, img: IMG.ovine, sp: ["Bovine", "Ovine", "Caprine"],
    desc: "Suspensie anthelmintică pentru bovine, ovine și caprine. Deparazitarea nematodelor gastro-intestinale și pulmonare, cestodozelor și trematozelor." },
  { key: "prospect fenbendazol granulat", name: "Fenbendazol granulat", cat: CAT.antip, img: IMG.ovine, sp: ["Bovine", "Ovine", "Porcine", "Păsări", "Iepuri", "Cabaline", "Caprine"],
    desc: "Anthelmintic cu fenbendazol pentru bovine, ovine, caprine, cabaline, porcine, iepuri și păsări. Tratamentul parazitozelor produse de stadii mature și imature ale nematodelor și cestodelor." },
  { key: "prospect fenbendazol", name: "Fenbendazol pentru păsări (găini)", cat: CAT.antip, img: IMG.pasari, sp: ["Păsări"],
    desc: "Anthelmintic pentru păsări (găini). Tratamentul helmintozelor produse de Ascaridia, Heterakis, Capillaria și alți paraziți intestinali." },
  { key: "prospect insectol 1000", name: "Insectol 1000 — spray pentru câini și pisici", cat: CAT.antip, img: IMG.pets, sp: ["Câini", "Pisici"],
    desc: "Spray insecto-acaricid pentru tratarea și prevenirea infestării cu ectoparaziți (purici, păduchi, căpușe) a câinilor și pisicilor." },
  { key: "prospect pranatan caini", name: "Pranatan — suspensie pentru câini", cat: CAT.antip, img: IMG.pets, sp: ["Câini"],
    desc: "Suspensie antiparazitară pentru dehelmintizarea câinilor în cestode (echinococoză, tenioză) și nematode intestinale." },
  { key: "prospect pranatan catei si pisici", name: "Pranatan — suspensie pentru căței și pisoi", cat: CAT.antip, img: IMG.pets, sp: ["Câini", "Pisici"],
    desc: "Suspensie pentru prevenirea și tratamentul nematodelor și cestodelor la căței și pisoși (toxocaroză, ancylostomoză, tricocefaloză)." },
  { key: "prospect pranatan pisici", name: "Pranatan — suspensie pentru pisici", cat: CAT.antip, img: IMG.pets, sp: ["Pisici"],
    desc: "Suspensie orală cu praziquantel și pirantel pamoat pentru tratarea viermilor intestinali la pisici." },
  { key: "prospect prantal", name: "Prantal — comprimate antihelmintice", cat: CAT.antip, img: IMG.pets, sp: ["Câini", "Pisici"],
    desc: "Comprimate cu pirantel și praziquantel pentru profilaxia și tratamentul parazitozelor (nematode și cestode) la câini și pisici." },
  { key: "prospect rex si musea", name: "Rex și Musea — spray insecto-acaricid", cat: CAT.antip, img: IMG.pets, sp: ["Câini", "Pisici"],
    desc: "Spray pentru prevenirea și tratamentul câinilor și pisicilor afectate de ectoparaziți: purici, păduchi, malofage, căpușe." },
  { key: "prospect sampun antipux", name: "Șampon Antipoux Van Plant", cat: CAT.antip, img: IMG.pets, sp: ["Câini", "Pisici"],
    desc: "Șampon veterinar cu extract de pelin și ulei de citronela pentru câini și pisici. Îndepărtează puricii, păduchii și scabia, calmează pruritul provocat de paraziți." },
  { key: "prospect vanmectin", name: "Vanmectin — soluție orală pentru ovine", cat: CAT.antip, img: IMG.ovine, sp: ["Ovine"],
    desc: "Soluție orală cu ivermectină 0,8 mg/ml pentru ovine. Tratamentul nematodelor gastro-intestinale și pulmonare, miazelor și ectoparaziților." },
  { key: "prospect zgarda burdi", name: "Zgardă Burdi fipro 2 în 1", cat: CAT.antip, img: IMG.pets, sp: ["Câini", "Pisici"],
    desc: "Zgardă insecto-acaricidă pentru prevenirea și tratamentul infestațiilor cu purici și căpușe la câini și pisici." },
  { key: "prospect profiverm 1", name: "Profiverm 1% soluție injectabilă", cat: CAT.antip, img: IMG.bovine, sp: ["Bovine", "Ovine", "Porcine", "Câini", "Caprine"],
    desc: "Soluție injectabilă cu ivermectină pentru prevenirea și tratarea bovinelor, ovinelor, caprinelor, porcinelor și câinilor cu nematode gastro-intestinale, pulmonare și ectoparaziți." },
  { key: "prospect diazinon", name: "Diazinon 60% — insecto-acaricid emulsionabil", cat: CAT.antip, img: IMG.bovine, sp: ["Bovine", "Ovine", "Porcine", "Câini", "Caprine"],
    desc: "Insecto-acaricid concentrat emulsionabil de uz veterinar pentru controlul și tratamentul scabiei (sarcoptice, psoroptice, chorioptice), myazelor și insectelor la bovine, ovine, porcine, cabaline și câini." },

  // ————————— ANTISEPTICE ȘI PRODUSE PENTRU ÎNGRIJIREA RĂNILOR (7)
  { key: "prospect cubatol", name: "Cubatol Pix — spray pentru plăgi", cat: CAT.antis, img: IMG.bovine, sp: ["Bovine", "Ovine", "Câini"],
    desc: "Spray antiseptic pentru animale agricole și de companie (cu excepția pisicilor). Leziuni ale pielii, răni, zgârieturi, arsuri, după operații, tratarea cornelor și dezectomie." },
  { key: "prospect dezy spray", name: "Dezy Spray — antiseptic pentru plăgi", cat: CAT.antis, img: IMG.pets, sp: ["Câini", "Pisici"],
    desc: "Spray antiseptic pentru câini și pisici. Tratamentul plăgilor traumatice și chirurgicale (inclusiv după castrare), dermatitelor și leziunilor cutanate." },
  { key: "prospect hloritin 500", name: "Hlorțin 500 — unguent antiseptic", cat: CAT.antis, img: IMG.bovine, sp: ["Bovine", "Ovine", "Porcine", "Câini", "Pisici", "Cabaline"],
    desc: "Unguent de uz extern cu efect antiseptic și antimicotic pentru afecțiuni ale pielii cauzate de microflora bacteriană și fungică: trichofitie la vaci, cai, câini și pisici." },
  { key: "prospect iodoform", name: "Iodoform 5% pulbere pentru răni", cat: CAT.antis, img: IMG.bovine, sp: ["Bovine", "Ovine", "Porcine", "Câini", "Pisici", "Cabaline", "Caprine"],
    desc: "Pulbere antiseptică pe bază de iodoform pentru tratamentul extern al rănilor infectate și postoperatorii la bovine, cabaline, ovine, caprine, porcine, câini și pisici." },
  { key: "prospect xeralxon", name: "Xeralxon — pulbere antimicrobiană de uz extern", cat: CAT.antis, img: IMG.pets, sp: ["Câini", "Pisici"],
    desc: "Pulbere antimicrobiană pentru tratamentul plăgilor cutanate, musculare și podale și prevenirea infecțiilor plăgilor operatorii la câini și pisici." },
  { key: "prospect zabolitvaia", name: "Zabolitvaia — unguent pentru uger și blană", cat: CAT.antis, img: IMG.bovine, sp: ["Bovine", "Ovine", "Caprine"],
    desc: "Unguent topic pentru bovine și caprine. Tratamentul zgârieturilor, tăieturilor, arsurilor, crăcăturilor și degerăturilor pielii, ale ugerului și țeiței." },
  { key: "prospect unguent ihtiol 10 rev f", name: "Unguent Ihtiol 10%", cat: CAT.antis, img: IMG.bovine, sp: ["Bovine", "Cabaline", "Ovine", "Porcine", "Câini", "Pisici", "Caprine"],
    desc: "Unguent cu ihtiol pentru uz extern: arsuri, răni, eczeme, dermatite, furunculoză, piodermie și procese inflamatorii ale țesuturilor moi la toate speciile de animale." },

  // ————————— CURĂȚARE, IGHIENĂ ȘI DEZINFECȚIE (8)
  { key: "preospect kenokox", name: "Kenocox — soluție contra coccidiozei și cryptosporidiozei", cat: CAT.dezinf, img: IMG.mediu, sp: ["Bovine", "Ovine", "Iepuri", "Păsări"],
    desc: "Dezinfectant pentru tratarea și prevenția coccidiozei și cryptosporidiozei la păsări, iepuri și viței. Se aplică pe echipamente și în spațiile de creștere, reducând pierderile economice." },
  { key: "propect dmcid s", name: "DM CID S — soluție spumantă alcalină de curățare și dezinfecție", cat: CAT.dezinf, img: IMG.mediu, sp: ["Mediu"],
    desc: "Agent de curățare cu efect dezinfectant (bactericid și fungicid) pe bază de hipoclorit de sodiu pentru industria alimentară (carne, lapte, conserve), pereți, pardoseli, mașini și mijloace de transport." },
  { key: "prospe4t cid 2000", name: "CID 2000 — igiena apei de băut (O2 + acidifiere)", cat: CAT.dezinf, img: IMG.mediu, sp: ["Mediu"],
    desc: "Amestec de peroxid de hidrogen și acid peracetic pentru igiena optimă a sistemelor de apă de băut: curăță biofilmul, îndepărtează depunerile organice și anorganice și optimizează pH-ul." },
  { key: "prospect kenosan", name: "Kenosan — detergent spumant alcalin zootehnic", cat: CAT.dezinf, img: IMG.mediu, sp: ["Mediu"],
    desc: "Soluție profesională concentrată de curățat incubatoare, grajduri, hale, săli de muls, mijloace auto, anexe și cotețe. Înmoaie și dizolvă murdăria, dejecțiile și grăsimile." },
  { key: "prospect hatchonet", name: "Hatchonet — soluție de curățare pentru incubatoare", cat: CAT.dezinf, img: IMG.mediu, sp: ["Mediu", "Păsări"],
    desc: "Soluție universală de curățare specială pentru incubatoare de păsări: îndepărtează impuritățile și reziduurile de pe toate suprafețele fără să fie corozivă, eficientă și în apă dură." },
  { key: "prospect pho cid", name: "Pho CID — soluție acidă pentru instalații de lapte", cat: CAT.dezinf, img: IMG.mediu, sp: ["Mediu"],
    desc: "Soluție acidă pe bază de acid fosforic și sulfuric pentru instalațiile CIP din industria laptelui: îndepărtează depunerile de calciu și piatra de lapte de pe echipamente și conducte." },
  { key: "prospect tormax s", name: "Tormax S — soluție acidă spumogenă de curățare", cat: CAT.dezinf, img: IMG.mediu, sp: ["Mediu"],
    desc: "Curățitor acid spumogen puternic, decalcifiant, pentru îndepărtarea proteinelor, varului și depunerilor de fier de pe echipamentele și conductele din industria alimentară." },
  { key: "prospect virocid", name: "Virocid — dezinfectant concentrat cu spectru larg", cat: CAT.dezinf, img: IMG.mediu, sp: ["Mediu"],
    desc: "Dezinfectant concentrat pe bază de quarternary amonium compounds și glutaraldehidă pentru spitale veterinare, adăposturi, echipamente și vehicule. Spectru larg împotriva bacteriilor, virusurilor, fungilor și algelor." },

  // ————————— DEZINSECȚIE ȘI DERATIZARE (8)
  { key: "prospect cypermetrin", name: "Cypermethrin 10% EC — insecticid pentru suprafețe", cat: CAT.dezin, img: IMG.mediu, sp: ["Mediu"],
    desc: "Insecticid cu spectru larg pentru controlul insectelor zburătoare și târâtoare în interiorul și exteriorul încăperilor zootehnice și industriale (20 ml/1 L apă pentru 10 m²)." },
  { key: "prospect istrebiteli", name: "Istrebiteli — momeală rodenticidă", cat: CAT.dezin, img: IMG.mediu, sp: ["Mediu"],
    desc: "Momeală otrăvitoare pe bază de brodifacum pentru distrugerea șobolanilor și șoarecelor de casă în locuințe, depozite, subsoluri și anexe. Conține Bitrex ca agent de descurajare pentru oameni." },
  { key: "prospect killer komarov 300", name: "Killer Komarov 300 — insecticid microencapsulat", cat: CAT.dezin, img: IMG.mediu, sp: ["Mediu"],
    desc: "Suspensie microencapsulată cu cipermetrină împotriva insectelor zburătoare (țânțari, muște, molii) și târâtoare (gândaci, furnici, purici, păianjeni, căpușe). Efect de durată până la 6 luni." },
  { key: "prospect killer muh 500", name: "Killer Muh 500 — insecticid microencapsulat contra muștelor", cat: CAT.dezin, img: IMG.mediu, sp: ["Mediu"],
    desc: "Insecticid microencapsulat pe bază de cipermetrină pentru combaterea muștelor și a altor insecte în spații de igienă publică și grajduri, efect prelungit de până la 6 luni." },
  { key: "prospect muhostop", name: "Muhostop — granule solubile contra muștelor", cat: CAT.dezin, img: IMG.mediu, sp: ["Mediu"],
    desc: "Granule solubile profesionale cu acetamiprid pentru combaterea muștelor în încăperi și adăposturi. Conține agent amar (benzoat de denatoniu) pentru siguranță." },
  { key: "prospect corsar", name: "Corsar — insecticid lichid emulsionabil", cat: CAT.dezin, img: IMG.mediu, sp: ["Mediu"],
    desc: "Insecticid cu cipermetrină și tetrametrină pentru combaterea insectelor zburătoare și târâtoare în sectorul de igienă și sănătate publică, în interiorul și exteriorul clădirilor." },
  { key: "prospect dergall rom", name: "Dergall — soluție pentru deparazitarea adăposturilor de păsări", cat: CAT.dezin, img: IMG.mediu, sp: ["Păsări", "Mediu"],
    desc: "Concentrat solubil cu acțiune fizică pentru controlul căpușei roșii a păsărilor (Dermanyssus gallinae), gândacului de grajd și alte dăunători ale aviculturii, aplicabil în prezența găinilor ouătoare." },
  { key: "prospect rozaticid", name: "Rozaticid — momeală rodenticidă pe bază de grâu", cat: CAT.dezin, img: IMG.mediu, sp: ["Mediu", "Rozătoare"],
    desc: "Momeală gata de utilizare cu bromadiolon, eficientă împotriva șoarecelui de casă și șobolanilor (cenușiu și negru) în gospodării, depozite și anexe." },

  // ————————— IMUNOSTIMULATOARE (3)
  { key: "prospect asd 2", name: "ASD fracția 2 — soluție imunostimulantă", cat: CAT.imun, img: IMG.bovine, sp: ["Bovine", "Ovine", "Porcine", "Cabaline", "Păsări", "Câini"],
    desc: "Stimulator biogenic cu efect antimicrobian, imunomodulator și regenerant pentru animalele de fermă (inclusiv păsări) și câini. Profilaxia și tratamentul afecțiunilor digestive, respiratorii și ale pielii." },
  { key: "prospect vita biotic liquid", name: "Vita-Biotic Liquid — probiotic pentru păsări", cat: CAT.imun, img: IMG.pasari, sp: ["Păsări"],
    desc: "Amestec echilibrat de acizi grași, monogliceride, prebiotice și uleiuri esențiale care promovează microflora intestinală benefică și inhibă bacteriile patogene — alternativă eficientă la promotorii de creștere." },
  { key: "prospect vita start", name: "Vita-Start+ FL — prebiotice și acizi grași", cat: CAT.imun, img: IMG.pasari, sp: ["Păsări", "Porcine"],
    desc: "Amestec de acizi grași cu lanț scurt, acizi tamponați, gliceride ale acidului butiric, prebiotice și uleiuri esențiale pentru sănătatea intestinală și stimularea imunității la păsări și animalele tinere." },

  // ————————— PRODUSE PENTRU REPRODUCȚIE ȘI SĂNĂTATEA GLANDEI MAMARE (10)
  { key: "prospect amoclox", name: "Amoclox DC — seringi intramamare pentru vaci (repaus mamar)", cat: CAT.repro, img: IMG.bovine, sp: ["Bovine", "Ovine"],
    desc: "Suspensie intramamara cu cloxacilină și ampicilină pentru tratamentul mastitei la vaci în perioada de repaus mamar și prevenirea infecțiilor din această perioadă." },
  { key: "prospect mastilong", name: "Mastilong Forte — seringi intramamare", cat: CAT.repro, img: IMG.bovine, sp: ["Bovine", "Ovine"],
    desc: "Suspensie intramamara pentru tratamentul vacilor cu forme clinice și subclinice de mastită de etiologie bacteriană cauzată de microorganisme sensibile la componentele produsului." },
  { key: "prospect metristar", name: "Metristar — suspensie intrauterină pentru vaci", cat: CAT.repro, img: IMG.bovine, sp: ["Bovine"],
    desc: "Suspensie pentru administrare intrauterină în tratamentul vacilor cu endometrită subacută și cronică (la peste 14 zile de la fătare) cauzată de microorganisme sensibile." },
  { key: "prospect oxitocin", name: "Oxitocină — soluție injectabilă", cat: CAT.repro, img: IMG.bovine, sp: ["Bovine", "Ovine", "Porcine", "Câini", "Pisici", "Cabaline", "Caprine"],
    desc: "Hormon injectabil pentru animalele femele (vaci, iepe, oi, capre, scroafe, cățele, pisici) care stimulează contracțiile uterine, ejacularea laptelui și involuția uterină." },
  { key: "prospect estromax", name: "Estromax — soluție injectabilă", cat: CAT.repro, img: IMG.bovine, sp: ["Bovine", "Porcine", "Câini", "Ovine", "Cabaline", "Pisici"],
    desc: "Prostaglandină injectabilă pentru bovine, suine și cățele: sincronizarea căldurilor, tratamentul afecțiunilor uterine, avortul terapeutic și inducerea fătării." },
  { key: "prospect castrin", name: "Castrin — suspensie injectabilă pentru controlul ciclului", cat: CAT.repro, img: IMG.pets, sp: ["Câini", "Pisici"],
    desc: "Suspensie injectabilă pentru prevenirea sau întreruperea pe termen lung a estrusului la pisici și cățele și prevenirea gestațiilor nedorite." },
  { key: "prospect sexinon", name: "Sexinon — tablete pentru întreruperea estrului", cat: CAT.repro, img: IMG.pets, sp: ["Câini", "Pisici"],
    desc: "Tablete pentru blocarea și amânarea estrului și prevenirea gestației nedorite la cățele și pisici; pentru calmarea câinilor și pisoilor în perioadele de stres." },
  { key: "prospect kenopur", name: "Keno Pure — dezinfectant pentru mameloane", cat: CAT.repro, img: IMG.bovine, sp: ["Bovine", "Ovine"],
    desc: "Soluție pe bază de acid lactic cu dublă acțiune: curăță și dezinfectează mameloanele bovinelor, ovinelor și caprinelor înainte de muls, diminuând încărcătura de germeni a glandei mamare." },
  { key: "unguent neem plus", name: "Neem Plus — unguent protector pentru uger", cat: CAT.repro, img: IMG.bovine, sp: ["Bovine"],
    desc: "Unguent topic cu uleiuri esențiale de neem, cuișoare și pin, acid lactic și salicilat de metil pentru protecția ugerului: regenerare, peliculă barieră și efect repelent împotriva muștelor." },
  { key: "unguent profimast", name: "Profimast — unguent igienic pentru uger", cat: CAT.repro, img: IMG.bovine, sp: ["Bovine"],
    desc: "Unguent cu propolis, ulei de măsline ozonat, gălbenele și vitamina E pentru igiena ugerului. Susține imunitatea locală și reduce edemul mamar după fătare; aplicat după fiecare muls." },

  // ————————— TONICE ȘI PRODUSE PENTRU REHIDRATARE (7)
  { key: "prospect clorura de calciu md", name: "Clorură de calciu 10% soluție injectabilă", cat: CAT.tonice, img: IMG.bovine, sp: ["Bovine", "Ovine", "Porcine", "Câini", "Cabaline", "Caprine"],
    desc: "Soluție injectabilă de calciu pentru bovine, cabaline, caprine, ovine, porcine și câini. Tratamentul hipocalcemiilor, alergieși, pneumonii și ca agent antiinflamator." },
  { key: "prospect borogluconat de ca", name: "Borogluconat de calciu soluție injectabilă", cat: CAT.tonice, img: IMG.bovine, sp: ["Bovine", "Cabaline", "Porcine", "Câini", "Pisici", "Ovine", "Caprine"],
    desc: "Toniant cu calciu pentru prevenirea și tratamentul parezei puerperale, hipocalcemiilor și intoxicațiilor la bovine, cabaline, ovine, porcine, câini și pisici." },
  { key: "prospect calfostar 1000", name: "Calfostar 1000 — soluție injectabilă calciu + fosfor", cat: CAT.tonice, img: IMG.bovine, sp: ["Bovine", "Ovine", "Porcine", "Cabaline", "Caprine"],
    desc: "Complex de calciu, fosfor și magneziu pentru tratamentul hipocalciemiei și parezei puerperale, rahitismului și osteomalaciei la animalele de fermă." },
  { key: "prospect clorura de sodiu", name: "Clorură de sodiu 0,9% soluție injectabilă", cat: CAT.tonice, img: IMG.bovine, sp: ["Bovine", "Cabaline", "Porcine", "Câini", "Ovine", "Caprine"],
    desc: "Soluție fiziologică pentru rehidratarea animalelor în caz de deshidratare severă, intoxicații, diaree, intervenții chirurgicale și deficit de sodiu." },
  { key: "prospect cofeina", name: "Cofeină benzoat de sodiu 20% soluție injectabilă", cat: CAT.tonice, img: IMG.bovine, sp: ["Bovine", "Cabaline", "Ovine", "Porcine", "Câini", "Pisici", "Caprine"],
    desc: "Stimulator al sistemului nervos central pentru tratarea bolilor însoțite de inhibarea funcțiilor vitale, colaps și slăbirea activității cardiace la toate speciile." },
  { key: "prospect glucoza 40", name: "Glucoză 40% soluție injectabilă", cat: CAT.tonice, img: IMG.bovine, sp: ["Bovine", "Cabaline", "Porcine", "Păsări", "Câini", "Pisici", "Ovine", "Caprine"],
    desc: "Soluție energetică și rehidratantă pentru terapia complexă a animalelor cu forme severe de boli infecțioase acute, intoxicații și hipoglicemie." },
  { key: "prospect bromenghil rev f", name: "Bromenghil — soluție orală pentru păsări", cat: CAT.tonice, img: IMG.pasari, sp: ["Păsări"],
    desc: "Soluție perorală cu bromhexină și mentol pentru pui de carne și păsări de curte de înlocuire: fluidifiant bronșic în bolile respiratorii cu secreții abundente." },

  // ————————— VACCINURI ȘI ALTE PRODUSE BIOLOGICE (6)
  { key: "vaccin canvac r", name: "Canvac R — vaccin antirabic pentru câini", cat: CAT.vaccin, img: IMG.pets, sp: ["Câini"],
    desc: "Vaccin inactivat suspensie injectabilă pentru imunizarea câinilor împotriva rabiei (virus rabic inactivat, minim 2 UI/doză)." },
  { key: "vaccin canvac 8", name: "Canvac 8 DHPPiL — vaccin polivalent pentru câini", cat: CAT.vaccin, img: IMG.pets, sp: ["Câini"],
    desc: "Liofilizat și solvent pentru suspensie injectabilă. Imunizarea câinilor împotriva cinomozei, leptospirozei, hepatitei infecțioase, parainfluenzei, coronavirozei, parvovirozei și infecției cu Bordetella." },
  { key: "vaccin hemoragic", name: "Vaccin hemoragic viral (RHD) pentru iepuri", cat: CAT.vaccin, img: IMG.iepure, sp: ["Iepuri"],
    desc: "Vaccin inactivat suspensie injectabilă pentru imunizarea iepurilor împotriva bolii hemoragice virale (RHD/VHD)." },
  { key: "vaccin mixomatoz", name: "Vaccin contra mixomatozei pentru iepuri", cat: CAT.vaccin, img: IMG.iepure, sp: ["Iepuri"],
    desc: "Vaccin pentru prevenirea mixomatozei la iepuri, imunizare activă împotriva virusului mixomatozei." },
  { key: "vaccina ltf 130", name: "Vaccin LTF-130 contra tricofitozei la bovine", cat: CAT.vaccin, img: IMG.bovine, sp: ["Bovine"],
    desc: "Vaccin viu liofilizat din cultură atenuată de Trichophyton verrucosum pentru prevenirea și tratamentul tricofitozei (limboneala) la bovine." },
  { key: "vacin contra rujetului", name: "Vaccin VR-2 contra rujețului la porcine", cat: CAT.vaccin, img: IMG.porcine, sp: ["Porcine"],
    desc: "Vaccin viu liofilizat din tulpina atenuată Erysipelothrix rhusiopathiae VR-2 pentru prevenirea rujețului (erysipelas) la porcine." },

  // ————————— VITAMINE, MINERALE ȘI PREMIXURI (28)
  { key: "calciu vitaminizat", name: "Calciu Vitaminizat Aromatizat — pulbere", cat: CAT.vit, img: IMG.pasari, sp: ["Păsări", "Bovine", "Ovine", "Porcine", "Cabaline", "Caprine", "Iepuri"],
    desc: "Furaj complementar pe bază de calciu (min 39%) cu premix de vitamine A, D3, E, K3, B, microelemente și aminoacizi pentru păsări de curte, păsări exotice și animale de gospodărie." },
  { key: "prospect seevit inj 500", name: "Seevit — soluție injectabilă (seleniu + vitamina E)", cat: CAT.vit, img: IMG.bovine, sp: ["Bovine", "Ovine", "Porcine", "Păsări", "Câini", "Pisici", "Cabaline", "Caprine"],
    desc: "Complex de seleniu și vitamina E injectabil pentru prevenirea și tratamentul hiposeleniemiei, distrofiilor musculare și retinerii placentei la toate speciile de animale." },
  { key: "prospect megavit 1000", name: "Megavit — soluție injectabilă multivitaminică", cat: CAT.vit, img: IMG.bovine, sp: ["Bovine", "Ovine", "Porcine", "Câini", "Cabaline"],
    desc: "Complex de vitamine A, D, E și grupa B pentru prevenirea și tratamentul hipovitaminozelor, rahitismului, osteodistrofiei, cetozei și hepatodistrofiei." },
  { key: "prospect tetravin sol inj rev 1000", name: "Tetravin — soluție injectabilă (A, D3, E)", cat: CAT.vit, img: IMG.bovine, sp: ["Bovine", "Ovine", "Porcine", "Cabaline", "Caprine"],
    desc: "Soluție injectabilă cu vitaminele A, D3 și E pentru prevenirea și tratamentul hipovitaminozei, osteodistrofiilor, cetozei, rahitismului și hipocalcemiei la animalele de fermă." },
  { key: "prospect ferrum b12 rev f", name: "Ferrum + B12 — soluție injectabilă", cat: CAT.vit, img: IMG.bovine, sp: ["Bovine", "Ovine", "Porcine", "Cabaline", "Caprine"],
    desc: "Fier complexat 100 mg/ml cu cianocobalamină pentru tratamentul și profilaxia anemiei feriprive la bovine, ovine, caprine, porcine și cabaline." },
  { key: "prospect vetozal 1000", name: "Vetozal 10% soluție injectabilă", cat: CAT.vit, img: IMG.bovine, sp: ["Bovine", "Ovine", "Porcine", "Păsări", "Câini", "Pisici", "Cabaline", "Caprine"],
    desc: "Complex de oligoelemente care stimulează hematopoieza, corectează tulburările metabolice cauzate de hrănirea irațională și sporește rezistența la boli." },
  { key: "prospect ulei de peste", name: "Ulei de Pește — Omega-3, vitamine A și D", cat: CAT.vit, img: IMG.pasari, sp: ["Păsări", "Porcine", "Câini", "Pisici", "Pești"],
    desc: "Sursă naturală de acizi grași polinesaturați Omega-3/Omega-6, iod și vitaminele A și D pentru creștere, lână, plumaj, fertilitate și digestie sănătoasă." },
  { key: "prospect faina peste", name: "Făină de Pește Vitaminizată", cat: CAT.vit, img: IMG.porcine, sp: ["Porcine", "Păsări"],
    desc: "Aditiv furajer cu 65% proteină brută, vitamine și minerale pentru compensarea insuficienței proteice și minerale din rațiile porcinelor și păsărilor." },
  { key: "prospect drojdie", name: "Drojdie Furajeră — 46% proteină", cat: CAT.vit, img: IMG.bovine, sp: ["Bovine", "Ovine", "Porcine", "Păsări"],
    desc: "Aditiv furajer bogat în proteine și vitaminele grupei B care crește conversia hranei, lactația la vaci, producția de carne și ouă." },
  { key: "prospect biotan", name: "Biotan — concentrat de vitamine și minerale", cat: CAT.vit, img: IMG.bovine, sp: ["Bovine", "Ovine", "Porcine", "Păsări", "Iepuri"],
    desc: "Amestec concentrat de macroelemente, oligominerale, vitamine și aminoacizi pentru toate speciile de animale în perioada de creștere și reproducție." },
  { key: "prospect sulf furajer", name: "Sulf Furajer", cat: CAT.vit, img: IMG.pasari, sp: ["Bovine", "Ovine", "Porcine", "Păsări"],
    desc: "Sulf pulbere pentru îmbunătățirea metabolismului, creșterea producției de lână, plumaj și lapte, ca laxativ ușor și antidot în intoxicațiile cu metale grele." },
  { key: "prospect profimilk lacto", name: "ProfiMilk LactoStart — înlocuitor de lapte pentru viței", cat: CAT.vit, img: IMG.bovine, sp: ["Bovine"],
    desc: "Înlocuitor integral de lapte pentru viței de la 10 la 21 de zile, cu probiotice, vitamine și minerale pentru viței sănătoși cu vitalitate crescută." },
  { key: "prospect agrocid super", name: "Agrocid Super — acidifiant pentru apa de băut", cat: CAT.vit, img: IMG.pasari, sp: ["Păsări", "Porcine", "Iepuri"],
    desc: "Amestec de acizi organici (formic, propionic, acetic, lactic) care scade rapid pH-ul apei de băut, reduce proliferarea coccidiilor și bacteriilor patogene și decalcifică sistemele de adăpare." },
  { key: "prospect vita acid", name: "Vita-Acid — acidifiant pentru hrana animalelor", cat: CAT.vit, img: IMG.pasari, sp: ["Păsări", "Porcine"],
    desc: "Amestec echilibrat de acizi organici (formic, propionic, lactic, fumaric) cu spectru larg de acțiune în hrana pentru animale: previne tulburările bacteriene și optimizează performanța de creștere." },
  { key: "prospect vita citrus 1", name: "Vita-Citrus C200 — polivitaminic pentru păsări", cat: CAT.vit, img: IMG.pasari, sp: ["Păsări"],
    desc: "Complex cu 20% vitamina C și ulei de citrice pentru reducerea stresului termic la păsări, susținerea imunității și potențarea efectului vaccinării." },
  { key: "prospect vita micotox plus", name: "Vita-Micotox Plus — binder de micotoxine", cat: CAT.vit, img: IMG.pasari, sp: ["Păsări", "Porcine"],
    desc: "Amestec sinergic de adsorbanți puternici de micotoxine (aflatoxine) îmbogățit cu minerale argiloase și conservanți pentru protecția animalelor din efective." },
  { key: "prospect vita multi stress", name: "Vita Multi Stress — vitamine + aminoacizi", cat: CAT.vit, img: IMG.pasari, sp: ["Păsări", "Iepuri", "Porcine"],
    desc: "Combinație echilibrată de vitamine și aminoacizi administrată prin apa de băut în perioade de stres, vaccinări și tratamente pentru menținerea vitalității." },
  { key: "prospect vita phoscal", name: "Vita Phoscal — complex polimineral", cat: CAT.vit, img: IMG.pasari, sp: ["Păsări", "Iepuri", "Porcine", "Bovine", "Ovine", "Caprine", "Cabaline"],
    desc: "Complex stabilizat de fosfor, calciu, magneziu, sodiu și oligoelemente pentru dezvoltarea scheletului, productivitate și recuperare după tratamentele antibacteriene și antiparazitare." },
  { key: "premix pui starter", name: "Premix Pui Starter 1% — faza I (0–30 zile)", cat: CAT.vit, img: IMG.pasari, sp: ["Păsări"],
    desc: "Premix vitamino-mineral pentru pui broiler în faza de start (0–30 zile), cu vitamine, minerale, antioxidanți și aminoacizi pentru un start bun al creșterii." },
  { key: "premix pui crestere", name: "Premix Pui Creștere 1% — faza II (peste 30 zile)", cat: CAT.vit, img: IMG.pasari, sp: ["Păsări"],
    desc: "Premix vitamino-mineral pentru pui de creștere de la 30 de zile, pentru o rație echilibrată și dezvoltare uniformă a efectului." },
  { key: "premix gaini ouatoare", name: "Premix Găini Ouătoare", cat: CAT.vit, img: IMG.pasari, sp: ["Păsări"],
    desc: "Premix vitamino-mineral cu calciu, metionină și fitază pentru găinile ouătoare: coajă rezistentă, vârf de ouare prelungit și producție stabilă." },
  { key: "premix rate", name: "Premix Rațe 1%", cat: CAT.vit, img: IMG.pasari, sp: ["Păsări"],
    desc: "Premix pentru rația zilnică a rațelor, cu vitamine (A, D3, E, K3, B), minerale și antioxidanți pentru o alimentație balansată." },
  { key: "premix giste", name: "Premix Gâște 1%", cat: CAT.vit, img: IMG.pasari, sp: ["Păsări"],
    desc: "Premix pentru gâște cu vitamine, minerale și metionină pentru o rație zilnică echilibrată și productivitate crescută." },
  { key: "premix prepelite", name: "Premix Prepelițe 2%", cat: CAT.vit, img: IMG.pasari, sp: ["Păsări"],
    desc: "Premix pentru prepelițe cu vitamine, minerale și antioxidanți pentru o rație echilibrată și producție stabilă de ouă." },
  { key: "premix porc 0 2 luni", name: "Premix Purcei 1% (0–2 luni)", cat: CAT.vit, img: IMG.porcine, sp: ["Porcine"],
    desc: "Premix vitamino-mineral pentru purcei de 0–2 luni, bogat în calciu și fosfor pentru un start solid după înțărcare." },
  { key: "premix porc 2 4 luni", name: "Premix Purcei 1% (2–4 luni)", cat: CAT.vit, img: IMG.porcine, sp: ["Porcine"],
    desc: "Premix pentru rația zilnică a purceilor de la 2 la 4 luni, cu vitamine și minerale pentru creștere armonioasă." },
  { key: "premix de la 4 luni", name: "Premix Purcei 1% (peste 4 luni)", cat: CAT.vit, img: IMG.porcine, sp: ["Porcine"],
    desc: "Premix vitamino-mineral pentru purcei de la 4 luni până la sacrificare pentru o rație alimentară balansată." },
  { key: "premix scroafe gestant", name: "Premix Scroafe Gestante", cat: CAT.vit, img: IMG.porcine, sp: ["Porcine"],
    desc: "Premix cu vitamine, minerale, lizină și metionină pentru rația scroafelor gestante: sănătatea fătului și viabilitatea purceilor." },
];

/* --------------------------------------------------------------- constructie */

function walkFiles(directory) {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(directory, entry.name);
    if (entry.isDirectory()) return walkFiles(full);
    if (entry.isFile() && /\.(docx?|pdf)$/i.test(entry.name)) {
      return [{ name: entry.name, extension: path.extname(entry.name).toLowerCase(), dir: directory }];
    }
    return [];
  });
}

const sourceFiles = new Map(); // normalized stem -> { file, extension }
for (const file of walkFiles(sourceDir)) {
  const stem = path.basename(file.name, path.extname(file.name));
  const key = tokens(stem).join(" ");
  if (!sourceFiles.has(key)) sourceFiles.set(key, file);
}

const availableProspects = new Set(
  existsSync(targetDir) ? readdirSync(targetDir) : [],
);

const products = [];
const warnings = [];
let nextId = 400000;

const prevCatalog = {};
try {
  Object.assign(prevCatalog, existsSync(outFile) ? JSON.parse(readFileSync(outFile, "utf8")) : {});
} catch {}
const previousImages = new Map((prevCatalog.products || []).map((p) => [p.slug, p]));
const imagesDir = path.join(root, "public", "products", "farmavet");
const downloadedFiles = existsSync(imagesDir) ? readdirSync(imagesDir) : [];
const brandMap = existsSync(brandsFile) ? JSON.parse(readFileSync(brandsFile, "utf8")) : {};
const sectionMap = existsSync(sectionsFile) ? JSON.parse(readFileSync(sectionsFile, "utf8")) : {};

const clean = (s) => (s || "").replace(/https?:\/\/\S+/g, "").replace(/\s{2,}/g, " ").trim();

for (const entry of TABEL) {
  const source = sourceFiles.get(entry.key);
  if (!source) {
    warnings.push(`Sursă lipsă pentru: ${entry.key}`);
    continue;
  }
  const stem = path.basename(source.name, path.extname(source.name));
  const prospectKey = tokens(stem).join("-");
  const prospectFile = `${prospectKey}${source.extension}`;
  const prospectUrl = availableProspects.has(prospectFile)
    ? `/prospecte/${prospectFile}`
    : "";
  if (!prospectUrl) warnings.push(`Prospect necopiat pentru: ${prospectFile}`);

  const name = entry.name;
  const slug = slugify(name);
  const brandSlug = brandMap[prospectKey] || "farmavet";

  // descriere: rezumat + compoziție/indicații din prospect
  const sec = sectionMap[prospectKey] || {};
  let description = entry.desc;
  const comp = clean(sec.comp);
  const ind = clean(sec.ind);
  if (comp.length > 30) description += `\n\nCompoziție: ${comp.slice(0, 420)}${comp.length > 420 ? "…" : ""}`;
  if (ind.length > 30) description += `\n\nIndicații: ${ind.slice(0, 560)}${ind.length > 560 ? "…" : ""}`;

  // imagine descărcată anterior se păstrează dacă fișierul există pe disc
  const prev = previousImages.get(slug);
  const hasDownloaded =
    prev && typeof prev.image === "string" && prev.image.startsWith("/products/farmavet/") &&
    downloadedFiles.some((f) => prev.image.endsWith(f));
  const image = hasDownloaded ? prev.image : entry.img;

  products.push({
    id: String(nextId++),
    brand_slug: brandSlug,
    name,
    slug,
    category: entry.cat,
    description,
    image,
    labels: [...entry.sp],
    features: [],
    benefits: [],
    package_sizes: [],
    variants: [],
    url: "",
    prospect: prospectUrl,
    images: [{ url: image, alt: name, role: "main" }],
    breadcrumbs: [entry.cat, name],
    product_type: "",
  });
}

const catalog = {
  brand: "Farmavet",
  source: "SAIT FARMAVET 2026",
  scraped_at: new Date().toISOString().slice(0, 10),
  product_count: products.length,
  products,
};

writeFileSync(outFile, `${JSON.stringify(catalog, null, 2)}\n`, "utf8");

const perCat = new Map();
for (const p of products) perCat.set(p.category, (perCat.get(p.category) || 0) + 1);
console.log(`Scris ${outFile}: ${products.length} produse`);
for (const [cat, count] of perCat) console.log(`  ${String(count).padStart(3)}  ${cat}`);
if (warnings.length) console.log("Avertismente:\n" + warnings.join("\n"));
