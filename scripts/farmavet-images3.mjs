/**
 * Pasul 2 (v2): imagini prin index de la site-urile oficiale.
 *  - vet.md (magazinul Farmavet, slug-uri în română) — sitemap complet
 *  - agroolkar.com.ua (producător O.L.KAR) — slug-uri din sitemap
 * Fiecare produs fără imagine reală este potrivit fuzzy după tokeni; pagina
 * găsită se fetch-uiește și se descarcă og:image / prima imagine de produs.
 *
 * Rulare:  node scripts/farmavet-images3.mjs [--dry] [--verbose]
 */
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";

const root = process.cwd();
const dry = process.argv.includes("--dry");
const verbose = process.argv.includes("--verbose");
const catalogFile = path.join(root, "scrape", "farmavet_products.json");
const imagesDir = path.join(root, "public", "products", "farmavet");
mkdirSync(imagesDir, { recursive: true });

const UA = {
  "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36",
  "Accept-Language": "ro,en;q=0.8,ru;q=0.6",
};
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function get(url, as = "text") {
  const res = await fetch(url, { headers: UA, redirect: "follow", signal: AbortSignal.timeout(20000) });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return as === "buffer" ? Buffer.from(await res.arrayBuffer()) : res.text();
}

function norm(v) {
  return v.toLowerCase()
    .replace(/[șş]/g, "s").replace(/[țţ]/g, "t").replace(/ă/g, "a").replace(/â/g, "i").replace(/î/g, "i")
    .replace(/[^a-z0-9]+/g, " ").trim();
}
function stem(w) {
  return w.replace(/(ilor|elor|urile|urile|uri|ul|a|e|i|u)$/, (m) => (m.length >= w.length - 2 ? "" : m)) // păstrează rădăcina minimă
    .replace(/(in|in|il|ul|u|a|e)$/i, "");
}
function tokens(v) { return norm(v).split(" ").filter(Boolean); }
function stems(v) { return tokens(v).map(stem); }

const GENERIC = new Set(["solu", "solutie", "injectabil", "injectabila", "injectabile", "oral", "orala", "tablete", "tableta", "comprimate", "pulbere", "spray", "gel", "unguent", "picaturi", "spot", "pour", "zgarda", "faza", "pentru", "contra", "cu", "si", "de", "la", "in", "probiotic", "complex", "concentrat", "aditiv", "amestec", "apa", "baut", "hrana", "caini", "pisici", "catel", "catei", "pisoi", "vaci", "bovine", "ovine", "porcine", "pasari", "iepuri", "caprine", "cabaline", "suine", "adulte", "solu", "gel", "crema", "liniment", "seringi", "intramamar", "intramamare", "tablete"]);

function coreStems(name) {
  return stems(name).filter((t) => t.length >= 3 && !GENERIC.has(t) && !/^\d+$/.test(t));
}

// alias transliterare rusă→latină pentru slug-urile OLKAR
function latinizeSlug(s) {
  return s
    .replace(/ch|ck/g, "c").replace(/ts|cz/g, "c").replace(/sh/g, "s").replace(/zh/g, "j")
    .replace(/y(?!u)/g, "i").replace(/ii/g, "i").replace(/aja/g, "a").replace(/ya/g, "a")
    .replace(/ks/g, "x").replace(/ph/g, "f").replace(/w/g, "v");
}

async function fetchSitemapLocs(sitemapUrl) {
  const xml = await get(sitemapUrl);
  return [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
}

/* ------------------------------------------------- index: vet.md + agroolkar */

const indexCacheFile = path.join(root, "scrape", "farmavet_pages_index.json");
console.log("Construiesc/încarc index-uri de pagini de produs...");
const vetmdIndex = new Map(); // token-stems → url
const agroIndex = new Map();
if (existsSync(indexCacheFile)) {
  const cached = JSON.parse(readFileSync(indexCacheFile, "utf8"));
  for (const [k, v] of cached.vetmd) vetmdIndex.set(k, v);
  for (const [k, v] of cached.agro) agroIndex.set(k, v);
} else {
  const vetmdUrls = (await fetchSitemapLocs("https://vet.md/sitemap.xml"))
    .filter((u) => /vet\.md\/(medicamente|dezinfectanti|ecologie|produse|accesorii|antiparazitare|vitamine)/i.test(u) && /\.html$/i.test(u));
  for (const u of vetmdUrls) {
    const slug = decodeURIComponent(u.split("/").pop().replace(/\.html$/i, ""));
    vetmdIndex.set(stems(slug), u);
  }

  // agroolkar: indexate din sub-sitemapuri (Yoast: sitemap_index.xml cu child per tip)
  let agroIdxLocs = [];
  for (const idx of ["https://agroolkar.com.ua/sitemap_index.xml", "https://agroolkar.com.ua/wp-sitemap.xml"]) {
    try { agroIdxLocs.push(...(await fetchSitemapLocs(idx))); } catch {}
  }
  agroIdxLocs = [...new Set(agroIdxLocs)];
  let agroUrls = [];
  for (const sm of agroIdxLocs) {
    try { agroUrls.push(...(await fetchSitemapLocs(sm))); await sleep(120); } catch {}
  }
  agroUrls = [...new Set(agroUrls.filter((u) => /\/production\//.test(u)))];
  for (const u of agroUrls) {
    const slug = u.split("/").filter(Boolean).pop();
    if (!/^[a-z0-9\-]+$/.test(slug)) continue;
    agroIndex.set(stems(slug), u);
  }
  writeFileSync(indexCacheFile, JSON.stringify({
    vetmd: [...vetmdIndex.entries()],
    agro: [...agroIndex.entries()],
  }), "utf8");
}
console.log(`index: vet.md ${vetmdIndex.size} pagini | agroolkar ${agroIndex.size} pagini`);

function bestMatch(product, index, latinize = false) {
  const want = coreStems(product.name);
  if (!want.length) return null;
  const canon = latinizeSlug;
  // cuvântul distinctiv (prima token-cheie) trebuie regăsit exact sau prin
  // incluziune de prefix (≥5 litere) — altfel am primi imagini greșite
  const heads = [...new Set([want[0], canon(want[0])])];
  const checkHead = (st) => {
    const haySet = new Set(st.flatMap((h) => [h, canon(h)]));
    for (const hd of heads) {
      if (haySet.has(hd)) return haySet;
      if (hd.length >= 5) {
        for (const t of haySet) {
          if (t.length >= 5 && (t.startsWith(hd) || hd.startsWith(t))) return haySet;
        }
      }
    }
    return null;
  };
  let best = null;
  let bestScore = 0;
  for (const [st, url] of index) {
    const haySet = checkHead(st);
    if (!haySet) continue;
    let score = 0;
    let covered = 0;
    for (const w of want) {
      const wc = canon(w);
      if (haySet.has(w) || haySet.has(wc)) { score += 2; covered++; continue; }
      for (const h of st) {
        const hc = canon(h);
        if (w.length >= 5 && (hc.startsWith(w.slice(0, 5)) || w.startsWith(hc.slice(0, 5)))) { score += 0.4; break; }
      }
    }
    score += covered * 0.8;
    if (score > bestScore) { bestScore = score; best = url; }
  }
  return bestScore >= 2.7 ? { url: best, score: bestScore } : null;
}

function extractImage(html, pageUrl, product) {
  const base = pageUrl;
  const og =
    html.match(/<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/i)?.[1] ||
    html.match(/<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:image["']/i)?.[1];
  const candidates = [];
  if (og) candidates.push(og);
  for (const m of html.matchAll(/<img[^>]+(?:src|data-src)=["']([^"']+\.(?:jpe?g|png|webp)[^"']*)["']/gi)) {
    candidates.push(m[1]);
  }
  const words = coreStems(product.name).slice(0, 2);
  let best = null;
  let bestScore = -1;
  for (const c of candidates) {
    let u;
    try { u = new URL(c, base).href; } catch { continue; }
    if (/logo|banner|sprite|icon|bg|background|flag|social|payment|cart|placeholder|noimage|no-image/i.test(u)) continue;
    let s = /\.(jpe?g|png|webp)/i.test(u) ? 1 : 0;
    if (words.some((w) => u.toLowerCase().includes(w.slice(0, 5)))) s += 4;
    if (/products?|produse|uploads|media|catalog/i.test(u)) s += 2;
    if (s > bestScore) { bestScore = s; best = u; }
  }
  return best;
}

function extFor(url, buf) {
  if (buf && buf.length >= 12) {
    if (buf[0] === 0xff && buf[1] === 0xd8) return ".jpg";
    if (buf[0] === 0x89 && buf[1] === 0x50) return ".png";
    if (buf[0] === 0x47 && buf[1] === 0x49) return ".gif";
    if (buf.slice(0, 4).toString() === "RIFF" && buf.slice(8, 12).toString() === "WEBP") return ".webp";
  }
  const m = url.match(/\.(jpe?g|png|webp|gif)(?:$|[?&])/i);
  return m ? `.${m[1].toLowerCase().replace("jpeg", "jpg")}` : ".jpg";
}

async function download(url, base) {
  const buf = await get(url, "buffer");
  if (buf.length < 8 * 1024 || buf.length > 6 * 1024 * 1024) throw new Error(`dimensiune ${buf.length}`);
  const ext = extFor(url, buf);
  const file = `${base}${ext}`;
  writeFileSync(path.join(imagesDir, file), buf);
  return { file, url };
}

/* ------------------------------------------------------------------ rulează */
const catalog = JSON.parse(readFileSync(catalogFile, "utf8"));
const sources = JSON.parse(readFileSync("scrape/farmavet_sources.json", "utf8"));
// URL-urile din prospectele .doc (extrase din binar, nu au intrat în sources map)
Object.assign(sources, {
  "prospect-pranatan-pisici": "https://agroolkar.com.ua/en/production/pranatan-suspenziya-dlya-koshek/",
  "prospect-noredon-c": "https://vanellivet.info/products/noredon-c-comprimate",
  "prospect-killer-komarov-300": "https://agroolkar.com.ua/en/production/russkyj-kyller-komarov/",
  "prospect-muhostop": "https://agroolkar.com.ua/en/production/muhostop/",
});
let done = 0;
const failures = [];
const results = [];

for (const product of catalog.products) {
  const isPlaceholder = product.image.startsWith("/cards/") || product.image.startsWith("/hero/") || product.image.startsWith("/magazin");
  if (!isPlaceholder) continue;

  // sursa din prospect are prioritate (URL oficial în document)
  const prospectKey = (product.prospect || "").replace("/prospecte/", "").replace(/\.[a-z]+$/i, "");
  let pageUrl = sources[prospectKey] || null;

  if (!pageUrl && !process.env.SKIP_INDEX) {
    const inVet = product.brand_slug === "farmavet" || product.brand_slug === "ruvera" || true;
    const mVet = inVet ? bestMatch(product, vetmdIndex) : null;
    const mAgro = bestMatch(product, agroIndex, true);
    const pick = mVet && (!mAgro || mVet.score >= mAgro.score) ? mVet : mAgro;
    pageUrl = pick ? pick.url : null;
    if (verbose && pick) console.log(`  match ${product.name} -> ${pick.url} (sc ${pick.score})`);
  }

  if (!pageUrl) { failures.push(product.name); continue; }

  try {
    const html = await get(pageUrl);
    const img = extractImage(html, pageUrl, product);
    if (!img) throw new Error("fără imagine în pagină");
    const { file } = await download(img, product.slug);
    if (!dry) {
      product.image = `/products/farmavet/${file}`;
      product.sourcePage = pageUrl;
      if (product.images?.length) product.images[0] = { url: product.image, alt: product.name, role: "main" };
    }
    done++;
    results.push([product.name, pageUrl, file]);
    console.log(`✔ ${product.name} → ${file}`);
  } catch (e) {
    failures.push(`${product.name} (${pageUrl}: ${e.message})`);
    console.log(`✘ ${product.name} — ${e.message}`);
  }
  await sleep(350);
}

if (!dry && done > 0) {
  writeFileSync(catalogFile, `${JSON.stringify(catalog, null, 2)}\n`, "utf8");
}
console.log(`\nPas 3: ${done} imagini noi. Fără imagine: ${failures.length}`);
for (const f of failures) console.log(`   - ${f}`);
