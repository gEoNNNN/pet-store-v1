/**
 * Extrage brandul (producătorul) și secțiunile Compoziție/Indicații din textele
 * prospectelor SAIT FARMAVET și le salvează în scrape/farmavet_brands.json și
 * scrape/farmavet_sections.json (cheie = slugul fișierului de prospect din
 * public/prospecte).
 *
 * Rulare:  node scripts/farmavet-brands.mjs   (necesită folderele extrase din temp)
 */
import { existsSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";

const extracted = process.env.EXTRACTED_DIR || "C:/Users/Eugen Ostafi/AppData/Local/Temp/opencode/extracted";
if (!existsSync(extracted)) {
  console.error("Lipsesc textele extrase (EXTRACTED_DIR). Rulează întâi extract_docs.ps1.");
  process.exit(1);
}

function tokens(v) {
  return v.toLowerCase()
    .replace(/[șş]/g, "s").replace(/[țţ]/g, "t").replace(/ă/g, "a").replace(/â/g, "i").replace(/î/g, "i")
    .replace(/[^a-z0-9]+/g, " ").trim().split(" ").filter(Boolean)
    .map((t) => (t === "insectal" ? "insektal" : t));
}

const RULES = [
  [/OLKAR|O\.L\.KAR|Șargorod|Shargorod|Șarhorod/i, "olkar"],
  [/Hebei|Vezong/i, "hebei-vezong"],
  [/Vanelli/i, "vanellivet"],
  [/RUVERA/i, "ruvera"],
  [/CID LINES/i, "cid-lines"],
  [/BAVET/i, "bavet"],
  [/Veyx[- ]Pharma/i, "veyx-pharma"],
  [/TECRO/i, "tecro"],
  [/BIOCEVAL|Bioceval/i, "bioceval"],
  [/Vitafor/i, "vitafor"],
  [/AVEFLOR/i, "aveflor"],
  [/Shandong Luxi/i, "shandong-luxi"],
  [/ICB Pharma/i, "icb-pharma"],
  [/Biofabrica Armavir|Armavir/i, "biofabrica-armavir"],
  [/PROMARK/i, "promark-trade"],
  [/Marel/i, "marel"],
  [/Vetsintez/i, "vetsintez"],
  [/Dyntec|Dynabio/i, "dyntec"],
  [/VNIIVViM|virosologie veterinară/i, "vniivvim"],
  [/Stavropol/i, "fgbu-stavropol"],
  [/MSD Animal Health|Intervet/i, "msd"],
  [/AT Biofarm|Biofarm/i, "biofarm"],
];

// produsele fără producător clar în text primesc distribuitorul (Farmavet)
// vita start+/vita-biotic: familia VITA* e de la Vitafor (Belgia)
const MANUAL = {
  "prospect-vita-start": "vitafor",
  "prospect-vita-biotic-liquid": "vitafor",
};

function section(text, re) {
  const m = text.match(new RegExp("(?:^|\\n)\\s*(?:\\d+\\.\\s*)?" + re, "i"));
  if (!m) return "";
  const start = text.indexOf(m[0], m.index) + m[0].length;
  const rest = text.slice(start);
  const stop = rest.search(/\n\s*(?:\d+\.|CONTRAINDICA|REAC|SPECII|POSOLOGIE|PREZENTARE|ATEN|MOD DE|NUMAI)/i);
  return (stop >= 0 ? rest.slice(0, stop) : rest.slice(0, 700)).replace(/\s+/g, " ").trim().slice(0, 600);
}

const brands = {};
const sections = {};
const evidence = {};

// 1. textele reale: sar peste mardelele EXTRACTION_FAILED (generate pentru .doc)
//    și unesc sub cheile corecte conținutul fișierelor doc_* (extrase din binar)
const texts = new Map(); // key (slug prospect) → text
for (const f of readdirSync(extracted).filter((x) => x.endsWith(".txt") && !x.startsWith("_"))) {
  let stem = f.split("__").pop().replace(/\.txt$/, "");
  const isDocFallback = stem.startsWith("doc_");
  if (isDocFallback) stem = stem.slice(4); // "doc_PROSPECT PRANTAL" → "PROSPECT PRANTAL"
  const key = tokens(stem).join("-");
  const text = readFileSync(path.join(extracted, f), "utf8");
  if (text.includes("EXTRACTION_FAILED")) continue;
  const prev = texts.get(key);
  if (!prev || prev.includes("EXTRACTION_FAILED") || prev.length < text.length) texts.set(key, text);
}

for (const [key, text] of texts) {
  let brand = MANUAL[key] || "";
  let why = MANUAL[key] ? "manual" : "";
  if (!brand) {
    for (const [re, slug] of RULES) {
      if (re.test(text)) { brand = slug; why = String(re); break; }
    }
  }
  if (!brand) { brand = /farmavet/i.test(text) ? "farmavet" : "farmavet"; why = "default"; }
  brands[key] = brand;
  evidence[key] = brand + " [" + (why || "").slice(0, 40) + "]";
  const comp = section(text, "(?:COMPOZI|CONCENTRA|substan(\\s|ț)e\\s*active)[^\\n]*\\n");
  const ind = section(text, "(?:3\\.)?\\s*INDICA(?:TII|ȚII)[^\\n]*\\n");
  if (comp || ind) sections[key] = { comp: comp.slice(0, 450), ind: ind.slice(0, 500) };
}

// elimină intrările duplicate inter-folder (păstrează prima)
writeFileSync("scrape/farmavet_brands.json", JSON.stringify(brands, null, 2) + "\n");
writeFileSync("scrape/farmavet_sections.json", JSON.stringify(sections, null, 2) + "\n");
const tally = {};
for (const v of Object.values(brands)) tally[v] = (tally[v] || 0) + 1;
console.log("branduri:", tally);
console.log("\nprobabile de verificat manual:");
for (const [k, v] of Object.entries(evidence)) if (/default/.test(v)) console.log("  ", k, "=>", v);
