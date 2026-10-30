#!/usr/bin/env node
/**
 * Traduce conținutul produselor din scrape/*.json în EN și RU, folosind
 * endpointul gratuit Google (client=gtx). Rezultatul: public/i18n/products.{en,ru}.json
 * — suprapuneri (overlays) cheiate după id-ul produsului, folosite client de
 * ProductCatalog / ProductDetailView când limba activă nu e româna.
 *
 * Etape (repunibile, cu cache):
 *   1. extract  — adună stringurile afișabile, deduplicate  -> scrape/.i18n-pool.json
 *   2. translate — traduce pool-ul (batch + aliniere + fallback single) -> scrape/.i18n-cache.json
 *   3. build    — construiește overlay-urile per produs -> public/i18n/products.{lang}.json
 *
 * Rulează: node scripts/translate-products.mjs [--force]
 */
import { existsSync, mkdirSync, readFileSync, writeFileSync, renameSync } from "node:fs";
import path from "node:path";

const ROOT = path.resolve(import.meta.dirname, "..");
const SCRAPE = path.join(ROOT, "scrape");
const PUBLIC_I18N = path.join(ROOT, "public", "i18n");
const POOL_FILE = path.join(SCRAPE, ".i18n-pool.json");
const CACHE_FILE = path.join(SCRAPE, ".i18n-cache.json");
const TARGETS = ["en", "ru"];
const SOURCE = "ro";

const CHUNK_CHARS = 1700; // text brut per request (sub limită, encoded ~x3)
const CONCURRENCY = 5;
const RETRIES = 4;
const BACKOFF = [1000, 3000, 8000, 15000];

const log = (...a) => console.log(new Date().toISOString().slice(11, 19), ...a);

// --- 1. EXTRACT -------------------------------------------------------------

// Maslina must match productCatalog.server.ts exactly (ids + field selection).
const CATALOGS = [
  { file: "products.json", brandSlug: "brit" },
  { file: "carnilove_products.json", brandSlug: "carnilove" },
  { file: "natura_products.json", brandSlug: "natura" },
  { file: "econatura_products.json", brandSlug: "eco-natura" },
  { file: "farmavet_products.json", brandSlug: "farmavet" },
  { file: "ekoprom_products.json", brandSlug: null }, // per-product mapping below
];

const EKOPROM_BRANDS = {
  "neoterica-insektal": "neoterica-insektal",
  "neoterica-gelmintal": "neoterica-gelmintal",
  "neoterica-unitabs": "neoterica-unitabs",
  "neoterica-rolfclub-3d": "neoterica-rolfclub-3d",
  chistotel: "chistotel",
};

const hasLetters = (s) => /[\p{L}]/u.test(s);
const norm = (s) => (typeof s === "string" ? s.trim() : "");

function extractPool() {
  const pool = new Set();
  const products = [];

  const add = (s) => {
    const v = norm(s);
    if (v && hasLetters(v)) pool.add(v);
    return v;
  };

  for (const { file, brandSlug } of CATALOGS) {
    const filePath = path.join(SCRAPE, file);
    if (!existsSync(filePath)) throw new Error(`Lipsește ${filePath}`);
    const raw = JSON.parse(readFileSync(filePath, "utf8"));
    for (const p of raw.products ?? []) {
      const slug = norm(p.slug);
      const name = norm(p.name);
      if (!slug || !name || !norm(p.image)) continue; // server le filtrează la fel
      const bSlug = brandSlug ?? (EKOPROM_BRANDS[norm(p.brand_slug)] ?? "neoterica-inspector");
      const isBrit = bSlug === "brit";
      const id = `${bSlug}-${norm(p.id) || slug}`;

      const entry = { id, strings: {} };
      entry.strings.name = add(name);
      entry.strings.description = add(p.description || p.raw_text);

      const labels = Array.isArray(p.labels) ? p.labels.map(add) : [];
      if (labels.length) entry.strings.labels = labels;

      const sizes = (Array.isArray(isBrit ? p.variants : p.package_sizes) ? (isBrit ? p.variants : p.package_sizes) : []).map(add);
      if (sizes.length) entry.strings.packageSizes = sizes;

      entry.strings.productType = add(p.product_type);

      const features = (Array.isArray(isBrit ? p.benefits : p.features) ? (isBrit ? p.benefits : p.features) : []).map(add);
      if (features.length) entry.strings.features = features;

      const tags = Array.isArray(p.ingredient_tags) ? p.ingredient_tags.map(add) : [];
      if (tags.length) entry.strings.ingredientTags = tags;

      const sections = p.sections && typeof p.sections === "object" ? p.sections : {};
      const sectionList = Object.entries(sections).flatMap(([title, sec]) => {
        if (!sec || typeof sec !== "object") return [];
        const text = add(sec.text);
        const tables = Array.isArray(sec.tables)
          ? sec.tables.map((table) =>
              Array.isArray(table) ? table.map((row) => (Array.isArray(row) ? row.map(add) : [])) : [],
            )
          : [];
        if (!text && !tables.length) return [];
        return [{ title: add(title), text, tables }];
      });
      if (sectionList.length) entry.strings.sections = sectionList;
      // rawText afișat doar când nu există secțiuni (la fel ca în detail page)
      else entry.strings.rawText = add(p.raw_text);

      const fresh = Array.isArray(p.fresh_ingredients)
        ? p.fresh_ingredients
            .map((ing) => (ing && typeof ing === "object" ? { name: add(ing.name), description: add(ing.description) } : null))
            .filter((ing) => ing && (ing.name || ing.description))
        : [];
      if (fresh.length) entry.strings.freshIngredients = fresh;

      products.push(entry);
    }
  }

  return { strings: [...pool], products };
}

// --- 2. TRANSLATE -----------------------------------------------------------

async function fetchTranslate(text, targetLang) {
  const url =
    `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${SOURCE}&tl=${targetLang}&dt=t&q=` +
    encodeURIComponent(text);
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 20000);
  try {
    const res = await fetch(url, { signal: controller.signal });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const json = await res.json();
    const segs = (json?.[0] ?? []).map((t) => ({ trans: t?.[0] ?? "", orig: t?.[1] ?? "" }));
    if (!segs.length) throw new Error("empty response");
    return segs;
  } finally {
    clearTimeout(timer);
  }
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function translateWithRetry(text, targetLang) {
  let lastErr;
  for (let attempt = 0; attempt < RETRIES; attempt += 1) {
    try {
      return await fetchTranslate(text, targetLang);
    } catch (err) {
      lastErr = err;
      await sleep(BACKOFF[attempt] + Math.random() * 400);
    }
  }
  throw lastErr;
}

/**
 * Aliniază segmentele unui blob înapoi pe liniile trimise.
 * Google poate returna tot blob-ul ca un singur segment păstrând \n — îl spargem
 * în atomi line-wise. Intoarce string[] (cu null pentru liniile nemapate) sau null.
 */
function alignChunk(lines, segs) {
  const n = lines.length;
  if (!n) return [];

  // Caz fericit: un segment per linie, în ordine.
  if (segs.length === n && segs.every((s, i) => norm(s.orig) === lines[i])) {
    return segs.map((s) => s.trans.trim());
  }

  // Expand: fiecare segment cu \n în perechi (origPiece, transPiece).
  const atoms = [];
  for (const seg of segs) {
    if (!seg.orig) {
      if (seg.trans) atoms.push({ orig: "", trans: seg.trans.trim() });
      continue;
    }
    const partsOrig = seg.orig.split("\n");
    const partsTrans = (seg.trans ?? "").split("\n");
    if (partsOrig.length !== partsTrans.length) return null; // nedeterminist → singles
    partsOrig.forEach((piece, i) => atoms.push({ orig: piece.trim(), trans: partsTrans[i].trim() }));
  }

  const full = lines.join("\n");
  const starts = [];
  let pos = 0;
  for (const line of lines) {
    starts.push(pos);
    pos += line.length + 1;
  }
  const lineAt = (index) => {
    let lo = 0;
    let hi = starts.length - 1;
    while (lo < hi) {
      const mid = (lo + hi + 1) >> 1;
      if (starts[mid] <= index) lo = mid;
      else hi = mid - 1;
    }
    return lo;
  };

  const out = new Array(n).fill(null);
  let cursor = 0;
  for (const atom of atoms) {
    if (!atom.orig) {
      const li = Math.max(0, lineAt(Math.max(0, cursor - 1)));
      out[li] = out[li] ? out[li] + " " + atom.trans : atom.trans;
      continue;
    }
    const idx = full.indexOf(atom.orig, cursor);
    if (idx < 0) return null; // nu mai putem garanta alinierea
    const li = lineAt(idx);
    out[li] = out[li] ? out[li] + " " + atom.trans : atom.trans;
    cursor = idx + atom.orig.length;
    while (cursor < full.length && full[cursor] === "\n") cursor += 1;
  }
  return out; // null-urile rămase se rezolvă prin requests single
}

function chunkLines(lines) {
  const chunks = [];
  let current = [];
  let size = 0;
  for (const line of lines) {
    if (size + line.length + 1 > CHUNK_CHARS && current.length) {
      chunks.push(current);
      current = [];
      size = 0;
    }
    current.push(line);
    size += line.length + 1;
  }
  if (current.length) chunks.push(current);
  return chunks;
}

async function translatePool(pool, cache) {
  const stats = { requests: 0, singleFallbacks: 0, failures: 0 };

  for (const lang of TARGETS) {
    const map = (cache[lang] ??= {});
    const pending = pool.filter((s) => !(s in map));
    log(`[${lang}] de tradus: ${pending.length} stringuri unice (din ${pool.length})`);

    const queues = chunkLines(pending);
    let cursor = 0;
    let done = 0;

    const record = (line, trans) => {
      map[line] = trans && trans.trim() ? trans.trim() : line;
    };

    async function runChunk(chunk) {
      const blob = chunk.join("\n");
      let assigned = null;
      try {
        const segs = await translateWithRetry(blob, lang);
        stats.requests += 1;
        assigned = alignChunk(chunk, segs);
      } catch {
        assigned = null;
      }
      // fallback linie-cu-linie doar pentru ce nu s-a aliniat (sau n-a intrat în cache)
      for (let i = 0; i < chunk.length; i += 1) {
        const line = chunk[i];
        if (line in map) continue;
        const tr = assigned ? assigned[i] : null;
        if (tr) {
          record(line, tr);
          continue;
        }
        try {
          const segs = await translateWithRetry(line, lang);
          stats.requests += 1;
          stats.singleFallbacks += 1;
          record(line, segs.map((s) => s.trans).join(" "));
        } catch {
          stats.failures += 1;
          map[line] = line; // rămâne în română
        }
      }
    }

    const worker = async () => {
      while (cursor < queues.length) {
        const my = cursor;
        cursor += 1;
        await runChunk(queues[my]);
        done += 1;
        if (done % 100 === 0 || cursor >= queues.length) {
          log(`[${lang}] chunk ${done}/${queues.length} · cereri ${stats.requests} · fallback ${stats.singleFallbacks} · esecuri ${stats.failures}`);
          saveCache(cache);
        }
        if (CONCURRENCY > 1) await sleep(60 + Math.random() * 80);
      }
    };

    await Promise.all(Array.from({ length: CONCURRENCY }, worker));
    saveCache(cache);
    log(`[${lang}] gata: ${stats.requests} cereri, ${stats.singleFallbacks} singles, ${stats.failures} eșecuri`);
  }
  return stats;
}

function loadJson(file, fallback) {
  if (!existsSync(file)) return fallback;
  try {
    return JSON.parse(readFileSync(file, "utf8"));
  } catch {
    return fallback;
  }
}

function saveCache(cache) {
  const tmp = CACHE_FILE + ".tmp";
  writeFileSync(tmp, JSON.stringify(cache));
  renameSync(tmp, CACHE_FILE);
}

// --- 3. BUILD OVERLAYS ------------------------------------------------------

function buildOverlays(products, cache) {
  mkdirSync(PUBLIC_I18N, { recursive: true });
  for (const lang of TARGETS) {
    const map = cache[lang] ?? {};
    const tr = (s) => (typeof s === "string" && s ? (map[s] ?? s) : s);
    const overlay = {};
    for (const p of products) {
      const s = p.strings;
      const entry = {};
      if (s.name) entry.name = tr(s.name);
      if (s.description) entry.description = tr(s.description);
      if (s.labels) entry.labels = s.labels.map(tr);
      if (s.packageSizes) entry.packageSizes = s.packageSizes.map(tr);
      if (s.productType) entry.productType = tr(s.productType);
      if (s.features) entry.features = s.features.map(tr);
      if (s.ingredientTags) entry.ingredientTags = s.ingredientTags.map(tr);
      if (s.rawText) entry.rawText = tr(s.rawText);
      if (s.sections) {
        entry.sections = s.sections.map((sec) => ({
          title: tr(sec.title),
          text: tr(sec.text),
          tables: sec.tables.map((table) => table.map((row) => row.map(tr))),
        }));
      }
      if (s.freshIngredients) {
        entry.freshIngredients = s.freshIngredients.map((ing) => ({
          name: tr(ing.name),
          description: tr(ing.description),
        }));
      }
      if (Object.keys(entry).length) overlay[p.id] = entry;
    }
    const out = path.join(PUBLIC_I18N, `products.${lang}.json`);
    writeFileSync(out, JSON.stringify(overlay));
    log(`scris ${path.relative(ROOT, out)} (${(readFileSync(out).length / 1024 / 1024).toFixed(2)} MB, ${Object.keys(overlay).length} produse)`);
  }
}

// --- main -------------------------------------------------------------------

const force = process.argv.includes("--force");

let poolData = !force && existsSync(POOL_FILE) ? loadJson(POOL_FILE, null) : null;
if (!poolData) {
  log("extract: parcurg cataloagele...");
  poolData = extractPool();
  writeFileSync(POOL_FILE, JSON.stringify(poolData));
}
const unique = poolData.strings.length;
const totalChars = poolData.strings.reduce((n, s) => n + s.length, 0);
log(`pool: ${unique} stringuri unice, ~${(totalChars / 1000).toFixed(0)}k caractere × ${TARGETS.length} limbi`);

if (!existsSync(CACHE_FILE) || force) saveCache({});
const cache = loadJson(CACHE_FILE, {});

await translatePool(poolData.strings, cache);

// Audit: orice valoare care conține \n este semn de aliniere greșită — purge + re-traducere.
for (const lang of TARGETS) {
  const map = cache[lang] ?? {};
  const bad = Object.keys(map).filter((k) => map[k].includes("\n"));
  bad.forEach((k) => delete map[k]);
  if (bad.length) log(`audit [${lang}]: ${bad.length} intrări murdare eliminate — reapel traducerea`);
}
saveCache(cache);
await translatePool(poolData.strings, cache);

for (const lang of TARGETS) {
  const map = cache[lang] ?? {};
  const identical = poolData.strings.filter((s) => map[s] === s && /[\p{L}]/u.test(s) && s.length > 12).length;
  log(`audit final [${lang}]: ${identical} stringuri lungi rămase identice cu sursa`);
}

buildOverlays(poolData.products, cache);
log("DONE");
