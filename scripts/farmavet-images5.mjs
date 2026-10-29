/**
 * Pasul 5 (final): ultimele potriviri manuale verificate (ruvera.lt,
 * vetexpert.ro, drugs.com/vet pentru produse CID Lines).
 * Rulare: node scripts/farmavet-images5.mjs
 */
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";

const root = process.cwd();
const catalogFile = path.join(root, "scrape", "farmavet_products.json");
const imagesDir = path.join(root, "public", "products", "farmavet");
mkdirSync(imagesDir, { recursive: true });

const UA = {
  "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36",
  "Accept-Language": "ro,en;q=0.8,lt;q=0.5",
};
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function get(url, as = "text") {
  const res = await fetch(url, { headers: UA, redirect: "follow", signal: AbortSignal.timeout(20000) });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return as === "buffer" ? Buffer.from(await res.arrayBuffer()) : res.text();
}

const MAN = {
  "neem-plus-unguent-protector-pentru-uger": [
    "https://ruvera.lt/produktai/neem-plus-tepalas-gyvunu-odos-prieziurai-200g-400g-900g/",
    "https://ruvera.lt/produktai/gyvuliams/neem-plus-tepalas-gyvunu-odos-prieziurai-200g-400g-900g/",
  ],
  "green-plus-liniment-pentru-articulatii": [
    "https://ruvera.lt/produktai/zalias-plius-linimentas-180ml-500ml-1l/",
    "https://ruvera.lt/produktai/gyvuliams/zalias-plius-linimentas-180ml-500ml-1l/",
  ],
  "ecomint-unguent-antiinflamator": [
    "https://www.vetexpert.ro/medicamente-veterinare/antiinflamatorii-uz-extern/antiinflamatorii-uz-extern-c133/ecomint-p1098.html",
  ],
  "kenosan-detergent-spumant-alcalin-zootehnic": ["https://www.drugs.com/vet/kenosan.html"],
  "virocid-dezinfectant-concentrat-cu-spectru-larg": ["https://www.drugs.com/vet/virocid.html"],
  "pho-cid-solutie-acida-pentru-instalatii-de-lapte": ["https://www.drugs.com/vet/pho-cid.html"],
};

function extractImage(html, base) {
  const og =
    html.match(/<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/i)?.[1] ||
    html.match(/<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:image["']/i)?.[1];
  const cands = [];
  if (og) cands.push(og);
  for (const m of html.matchAll(/<img[^>]+(?:src|data-src)=["']([^"']+\.(?:jpe?g|png|webp)[^"']*)["']/gi)) cands.push(m[1]);
  for (const c of cands) {
    let u;
    try { u = new URL(c.replace(/&amp;/g, "&"), base).href; } catch { continue; }
    if (/logo|banner|icon|sprite|opengraph|placeholder|noimage|payment|social|flag|ddc-/i.test(u)) continue;
    return u;
  }
  return null;
}

function extFor(url, buf) {
  if (buf && buf.length >= 12) {
    if (buf[0] === 0xff && buf[1] === 0xd8) return ".jpg";
    if (buf[0] === 0x89 && buf[1] === 0x50) return ".png";
    if (buf.slice(0, 4).toString() === "RIFF" && buf.slice(8, 12).toString() === "WEBP") return ".webp";
  }
  const m = url.match(/\.(jpe?g|png|webp)(?:$|[?&])/i);
  return m ? `.${m[1].toLowerCase().replace("jpeg", "jpg")}` : ".jpg";
}

async function download(url, base) {
  const buf = await get(url, "buffer");
  if (buf.length < 8 * 1024 || buf.length > 6 * 1024 * 1024) throw new Error(`dimensiune ${buf.length}`);
  const file = `${base}${extFor(url, buf)}`;
  writeFileSync(path.join(imagesDir, file), buf);
  return file;
}

const catalog = JSON.parse(readFileSync(catalogFile, "utf8"));
let done = 0;
for (const product of catalog.products) {
  const pages = MAN[product.slug];
  const stillPlaceholder = product.image.startsWith("/cards/") || product.image.startsWith("/hero/") || product.image.startsWith("/magazin");
  if (!pages || !stillPlaceholder) continue;
  for (const page of pages) {
    try {
      const html = await get(page);
      const img = extractImage(html, page);
      if (!img) { console.log(`  · fără imagine: ${page}`); continue; }
      const file = await download(img, product.slug);
      product.image = `/products/farmavet/${file}`;
      product.sourcePage = page;
      if (product.images?.length) product.images[0] = { url: product.image, alt: product.name, role: "main" };
      console.log(`✔ ${product.name} → ${file}`);
      done++;
      break;
    } catch (e) { console.log(`  · sărit ${page}: ${e.message}`); }
    await sleep(250);
  }
}
writeFileSync(catalogFile, JSON.stringify(catalog, null, 2) + "\n");

const real = catalog.products.filter((p) => p.image.startsWith("/products/farmavet/")).length;
console.log(`\nPas 5: ${done} imagini. Total produse cu poză reală: ${real}/${catalog.products.length}`);
