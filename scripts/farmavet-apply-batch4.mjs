// Batch 2026-11-04 — imagini identificate vizual (vision subagent) + 2 prospecte PDF:
//  - 5 produse noi: ERGOFOR II, Glucoză 25%, Cypermethrin 10% EC (veterinar),
//    Turil 2,5% (Vetsintez, toltrazuril), Gentavet 10 (Vetsintez, gentamicină)
//  - 4 produse existente primesc poze reale + brand corectat (Farmavet)
import { copyFileSync, existsSync, readFileSync, unlinkSync, writeFileSync } from "node:fs";
import path from "node:path";

const root = process.cwd();
const srcDir = path.join(root, "public", "products", "add");
const dstDir = path.join(root, "public", "products", "farmavet");
const catalogFile = path.join(root, "scrape", "farmavet_products.json");

const P = "WhatsApp Image 2026-11-03 at ";

function detectExt(buf) {
  if (buf.length >= 12) {
    if (buf[0] === 0xff && buf[1] === 0xd8) return ".jpg";
    if (buf[0] === 0x89 && buf[1] === 0x50) return ".png";
    if (buf.slice(0, 4).toString() === "RIFF" && buf.slice(8, 12).toString() === "WEBP") return ".webp";
  }
  return ".jpg";
}

function install(srcName, slug) {
  const buf = readFileSync(path.join(srcDir, srcName));
  const ext = detectExt(buf);
  const file = `${slug}${ext}`;
  copyFileSync(path.join(srcDir, srcName), path.join(dstDir, file));
  return file;
}

function unlinkOld(image, newFile) {
  const old = image.split("/").pop();
  if (old && old !== newFile && existsSync(path.join(dstDir, old))) unlinkSync(path.join(dstDir, old));
}

const catalog = JSON.parse(readFileSync(catalogFile, "utf8"));
const bySlug = new Map(catalog.products.map((p) => [p.slug, p]));

// ---------- 1. Produse noi ----------
const NEW = [
  {
    file: `${P}13.05.18.jpeg`,
    id: "400139",
    brand_slug: "farmavet",
    name: "ERGOFOR II — soluție injectabilă energizantă",
    slug: "ergofor-ii-solutie-injectabila-energizanta",
    category: "Tonice și produse pentru rehidratare",
    packageSizes: [],
    labels: ["Bovine"],
    description:
      "Supliment nutritiv veterinar energizant, soluție injectabilă. Compoziție pe 1 ml de produs: glucoză anhidrică 250 mg, alcool etilic 125 mg, clorură de magneziu 10 mg, clorură de tiamină 2,5 mg. Susține metabolismul energetic și rehidratarea animalelor.\n\nNumai pentru uz veterinar. Păstrare: +5°C la +25°C, loc uscat, ferit de lumină, nu la vedere și îndemâna copiilor.\n\nProducător: S.A. 'Farmavet', Republica Moldova (volumul total al sticlei nu a fost vizibil pe etichetă).",
  },
  {
    file: `${P}13.05.19.jpeg`,
    id: "400140",
    brand_slug: "farmavet",
    name: "Glucoză 25% — soluție injectabilă",
    slug: "glucoza-25-solutie-injectabila",
    category: "Tonice și produse pentru rehidratare",
    packageSizes: ["100 ml"],
    labels: ["Toate speciile"],
    description:
      "Soluție injectabilă cu glucoză 25%, pentru aport energetic rapid la animale. Numai pentru uz veterinar.\n\nPrezentare: 100 ml, sticlă injectabilă. Preparat 07.10.2025, expiră 07.04.2027. Păstrare: temperatură de cameră, loc uscat, ferit de lumină.\n\nProducător: S.A. 'Farmavet', Republica Moldova.",
  },
  {
    file: `${P}13.05.19 (1).jpeg`,
    id: "400141",
    brand_slug: "farmavet",
    name: "Cypermethrin 10% EC — soluție pentru paraziți externi",
    slug: "cypermethrin-10-ec-solutie-paraziti-externi",
    category: "Antiparazitare interne și externe",
    packageSizes: ["1000 ml"],
    labels: ["Bovine", "Cabaline", "Caprine"],
    description:
      "Insecticid/acaricid pe bază de cipermetrină 10%, concentrat emulsionabil, pentru combaterea paraziților externi (păduchi, căpușe, muște) la bovine, cabaline și caprine.\n\nPrezentare: 1000 ml. Mfg. 28.06.2026, Exp. 27.06.2029, Lot 2026062801. Numai pentru uz veterinar.\n\nMarcă/producător: nu a fost vizibilă pe eticheta din imagine; produs distribuit prin S.A. 'Farmavet', Republica Moldova.",
  },
  {
    file: "Hen_sitting_facing_forward_202609050729.jpeg",
    id: "400142",
    brand_slug: "vetsintez",
    name: "Turil 2,5% — soluție orală (toltrazuril)",
    slug: "turil-2-5-solutie-orala-toltrazuril",
    category: "Antiparazitare interne și externe",
    packageSizes: ["1000 ml"],
    labels: ["Păsări"],
    description:
      "Turil 2,5% soluție orală — toltrazuril 25 mg/ml (Vetsintez, Ucraina). Medicament de uz veterinar, certificat de înregistrare ANSA Moldova (revizuit 2025), cod ATCvet QP51BC01. Se eliberează cu prescripție.\n\nCompoziție: 1 ml soluție conține toltrazuril 25 mg. Excipienți: trietanolamină, polietilenglicol.\n\nSpecii țintă: păsări (pui broiler și de înlocuire), curcani.\n\nIndicații: tratamentul coccidiozei (eimeriozei) la pui și curcani, cauzată de eimerii sensibili la toltrazuril: la pui Eimeria acervulina, E. brunetti, E. maxima, E. mitis, E. necatrix, E. tenella; la curcani Eimeria adenoides, E. meleagridis, E. meleagrimitis.\n\nDozare (prin apa de băut): 1 ml Turil 2,5% la 1 litru de apă potabilă timp de 48 de ore, sau 3 ml la 1 litru de apă potabilă, administrat 8 ore/zi, 2 zile consecutiv. Ambele scheme corespund aproximativ dozei de 7 mg toltrazuril/kg greutate corporală/zi.\n\nContraindicații: hipersensibilitate la toltrazuril; nu se utilizează la găinile ouătoare ale căror ouă sunt destinate consumului uman. Nu se utilizează simultan cu alte coccidiostatice.\n\nPerioadă de așteptare: carne — 7 zile.\n\nAmbalaje: flacoane 100 ml, 200 ml; canistre 1 L, 5 L.\n\nProducător: SRL Vetsintez, Ucraina. Reprezentant local: SA Farmavet, Republica Moldova.",
  },
  {
    file: `${P}14.27.39.jpeg`,
    id: "400143",
    brand_slug: "vetsintez",
    name: "Gentavet 10 — soluție orală (gentamicină)",
    slug: "gentavet-10-solutie-orala-gentamicina",
    category: "Antibacteriene și antifungice",
    packageSizes: ["1000 ml"],
    labels: ["Porcine"],
    description:
      "Gentavet 10% soluție orală — gentamicină sulfat 100 mg/ml (Vetsintez, Ucraina). Medicament de uz veterinar antibacterian, certificat de înregistrare ANSA Moldova nr. 260011, revizuit 05/2026, cod ATCvet QJ01GB03. Se eliberează cu prescripție.\n\nCompoziție: 1 ml conține gentamicină sulfat 100,0 mg. Excipienți: metabisulfit de sodiu, trilon B, 1,2-propilenglicol, apă purificată.\n\nSpecie țintă: porcine.\n\nIndicații: tratamentul bolilor gastrointestinale la porci (gastrită, enterită, peritonită, enterocolită, dizenterie) cauzate de microorganisme sensibile la gentamicină.\n\nDozare (oral): individual 5 ml la 100 kg greutate corporală/zi (4 mg/kg); în grup 5 ml la 10 litri de apă potabilă, împărțit în două administrări; pentru dizenterie 30–40 ml la 100 litri de apă. Cura de tratament 3–5 zile.\n\nContraindicații: hipersensibilitate la gentamicină; nu se utilizează la animale cu disfuncție renală, auditivă sau vestibulară; precauție la purcei în prima săptămână de viață (jumătate din doza terapeutică). Nu se utilizează simultan cu alte aminoglicozide sau antibiotice nefrotoxice.\n\nPerioadă de așteptare: carne — 10 zile.\n\nAmbalaje: flacoane 10 ml, 50 ml, 100 ml, 500 ml, 1 litru.\n\nProducător: SRL Vetsintez, Ucraina. Reprezentant local: SA Farmavet, Republica Moldova.",
  },
];

for (const n of NEW) {
  if (bySlug.has(n.slug)) { console.log(`· ${n.slug} există deja, se sare`); continue; }
  const image = install(n.file, n.slug);
  const url = `/products/farmavet/${image}`;
  const product = {
    id: n.id,
    brand_slug: n.brand_slug,
    name: n.name,
    slug: n.slug,
    category: n.category,
    description: n.description,
    image: url,
    labels: n.labels,
    features: [],
    benefits: [],
    package_sizes: n.packageSizes,
    variants: [],
    url: "",
    prospect: "",
    images: [{ url, alt: n.name, role: "main" }],
    breadcrumbs: [n.category, n.name],
    product_type: "",
    sourcePage: "manual",
  };
  catalog.products.push(product);
  bySlug.set(n.slug, product);
  console.log(`➕ ${n.name} (${image})`);
}

// ---------- 2. Actualizare poze (produse existente) ----------
const UPDATES = [
  { file: `${P}13.05.18 (1).jpeg`, slug: "clorura-de-sodiu-0-9-solutie-injectabila", brand_slug: "farmavet" },
  { file: `${P}13.05.19 (4).jpeg`, slug: "glucoza-40-solutie-injectabila", brand_slug: "farmavet" },
  { file: `${P}13.05.19 (2).jpeg`, slug: "borogluconat-de-calciu-solutie-injectabila", brand_slug: "farmavet" },
  { file: `${P}13.05.19 (3).jpeg`, slug: "clorura-de-calciu-10-solutie-injectabila", brand_slug: "farmavet" },
];

for (const u of UPDATES) {
  const p = bySlug.get(u.slug);
  if (!p) { console.log(`✗ ${u.slug}: nu e în catalog`); continue; }
  const dst = install(u.file, u.slug);
  unlinkOld(p.image, dst);
  p.image = `/products/farmavet/${dst}`;
  p.sourcePage = "manual";
  if (p.images?.length) p.images[0] = { url: p.image, alt: p.name, role: "main" };
  if (u.brand_slug) p.brand_slug = u.brand_slug;
  console.log(`✔ ${u.file} → ${p.name} (${dst}) [brand: ${p.brand_slug}]`);
}

// Glucoza 25% was in NEW list already; remove from UPDATES (it's not existing)
// (already handled in NEW)

writeFileSync(catalogFile, JSON.stringify(catalog, null, 2) + "\n");

const real = catalog.products.filter((p) => p.image?.startsWith("/products/farmavet/")).length;
console.log(`total: ${catalog.products.length}, reale: ${real}/${catalog.products.length}`);
