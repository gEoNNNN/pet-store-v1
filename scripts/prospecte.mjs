/**
 * Copiază prospectele medicamentoase (Word) din "SAIT FARMAVET 2026" în
 * public/prospecte și leagă automat produsele din catalog de prospectul
 * potrivit, scriind câmpul `prospect` în scrape/ekoprom_products.json.
 *
 * Reguli de potrivire:
 *  - numele medicamentului din fișier (după cuvântul "prospect" și după
 *    normalizarea diacriticelor) trebuie să fie chiar la începutul numelui
 *    produsului din catalog (familiile Insektal, Gelmintal T etc.);
 *  - potrivirile sigure se salvează; restul se pot atașa manual din panou.
 *
 * Rulare:  node scripts/prospecte.mjs
 * Idempotent: duplicatle la fel de numite se copiază o singură dată, iar
 * câmpurile `prospect` care nu se mai potrivesc se șterg.
 */
import {
  copyFileSync,
  existsSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import path from "node:path";

const root = process.cwd();
const sourceDir = path.join(root, "SAIT FARMAVET 2026");
const targetDir = path.join(root, "public", "prospecte");
const catalogFile = path.join(root, "scrape", "ekoprom_products.json");

const PROSPECT_WORDS = new Set([
  "prospect",
  "prospec",
  "preospect",
  "propect",
  "prospe4t",
  "vaccin",
  "vacina",
  "vacin",
]);

/** greșeli de tastare frecvente în numele fișierelor → numele corect din catalog */
const NAME_ALIASES = new Map([["insectal", "insektal"]]);

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

function tokenize(value) {
  return normalizeText(value)
    .split(" ")
    .filter(Boolean)
    .map((token) => NAME_ALIASES.get(token) ?? token);
}

/** token-urile numelui medicamentului (fără cuvântul "prospect" și sufixe de revizie) */
function medicineTokens(stem) {
  const cleaned = stem.replace(/rev[\s_-]*f$/i, "").replace(/\(\d+\)/g, " ");
  const tokens = tokenize(cleaned);
  const first = tokens[0];
  if (first && (PROSPECT_WORDS.has(first) || first.startsWith("prosp"))) {
    return tokens.slice(1);
  }
  return tokens;
}

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

function isPrefixMatch(medicine, product) {
  return medicine.length > 0 &&
    product.length >= medicine.length &&
    medicine.every((token, index) => token === product[index]);
}

/* ------------------------------------------------------------------ copiere */

if (!existsSync(sourceDir)) {
  console.error(`Nu am găsit folderul cu prospecte: ${sourceDir}`);
  process.exit(1);
}

rmSync(targetDir, { recursive: true, force: true });
mkdirSync(targetDir, { recursive: true });

const takenSlugs = new Map(); // slug de fișier → calea sursă
const messages = [];
const prospects = []; // { file, url, tokens, label }

const files = walkFiles(sourceDir).sort((a, b) => a.name.localeCompare(b.name, "ro"));
for (const file of files) {
  const stem = path.basename(file.name, path.extname(file.name));
  const slug = tokenize(stem).join("-");
  if (!slug) {
    messages.push(`⚠ omis (nume invalid): ${file.name}`);
    continue;
  }
  const sourcePath = path.relative(sourceDir, path.join(file.dir, file.name));
  if (takenSlugs.has(slug)) {
    messages.push(`↧ duplicat omis: ${sourcePath} (== ${takenSlugs.get(slug)})`);
    continue;
  }
  const targetName = `${slug}${file.extension}`;
  copyFileSync(path.join(file.dir, file.name), path.join(targetDir, targetName));
  takenSlugs.set(slug, sourcePath);
  prospects.push({
    file: targetName,
    url: `/prospecte/${targetName}`,
    tokens: medicineTokens(stem),
    label: stem.replace(/^(prospect|vaccin|premix|unguent)\b/i, "").trim() || stem,
  });
}

/* ---------------------------------------------------------------- potrivire */

const data = JSON.parse(readFileSync(catalogFile, "utf8"));
const products = data.products;

const matches = []; // { prospect, productNames: string[] }
for (const prospect of prospects) {
  const hits = [];
  for (const product of products) {
    const nameTokens = tokenize(String(product.name ?? ""));
    if (isPrefixMatch(prospect.tokens, nameTokens)) {
      hits.push(product);
    }
  }
  if (hits.length > 0) {
    for (const hit of hits) hit.prospect = prospect.url;
    matches.push({ prospect, products: hits });
  }
  prospect.matched = hits.length > 0;
}

// curățare: produsele care nu se mai potrivesc cu niciun prospect pierd câmpul
const matchedUrls = new Set(matches.flatMap((match) => match.products.map((p) => p.slug)));
for (const product of products) {
  if (product.prospect && !matchedUrls.has(String(product.slug ?? ""))) {
    delete product.prospect;
  }
}

data.products = products;
writeFileSync(catalogFile, `${JSON.stringify(data, null, 2)}\n`, "utf8");

/* ------------------------------------------------------------------- raport */

console.log(`\n Prospecte copiate: ${prospects.length} din ${files.length} fișiere → public/prospecte/`);
if (messages.length > 0) console.log(messages.join("\n"));

const matchedProducts = products.filter((product) => product.prospect);
console.log(`\n Produse legate automat de un prospect: ${matchedProducts.length}`);
for (const match of matches) {
  console.log(`\n ✔ ${match.prospect.file}`);
  for (const product of match.products) {
    console.log(`     ${product.slug} — ${product.name.slice(0, 70)}`);
  }
}

const unmatched = prospects.filter((prospect) => !prospect.matched);
console.log(`\n Prospecte fără potrivire automată (${unmatched.length}) — pot fi atașate manual din panou (câmpul „Prospect”):`);
for (const prospect of unmatched) console.log(`   ${prospect.file}`);
