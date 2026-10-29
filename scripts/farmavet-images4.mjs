/**
 * Pasul final imagini: hartă MANUALĂ verificată (produs → pagina oficială a
 * producătorului/magazinului) pentru produsele care nu s-au găsit prin
 * indexările automate. Se descarcă og:image (sau prima imagine de produs).
 *
 * Rulare:  node scripts/farmavet-images4.mjs [--dry]
 */
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";

const root = process.cwd();
const dry = process.argv.includes("--dry");
const catalogFile = path.join(root, "scrape", "farmavet_products.json");
const imagesDir = path.join(root, "public", "products", "farmavet");
mkdirSync(imagesDir, { recursive: true });

const UA = {
  "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36",
  "Accept-Language": "ro,en;q=0.8,lt;q=0.5,ru;q=0.4",
};
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function get(url, as = "text") {
  const res = await fetch(url, { headers: UA, redirect: "follow", signal: AbortSignal.timeout(20000) });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return as === "buffer" ? Buffer.from(await res.arrayBuffer()) : res.text();
}

// slug produs → candidați de pagini oficiale (în ordinea încercării)
const MAN = {
  "unguent-ihtiol-10": ["https://agroolkar.com.ua/ru/production/maz-ihtiolova-10/"],
  "clorura-de-sodiu-0-9-solutie-injectabila": ["https://agroolkar.com.ua/ru/production/sodium-chloride-0-9/"],
  "profiverm-1-solutie-injectabila": ["https://agroolkar.com.ua/ru/production/profiverm-1-o-l-kar-inektsionnyj/"],
  "veyxat-gel-gel-contra-durerilor": ["https://vet.md/medicamente/unguent-veyxat-gel-100g.html"],
  "rozaticid-momeala-rodenticida-pe-baza-de-griu": ["https://vet.md/medicamente/momeala--pe-baza-de-cereale-.html"],
  "premix-gaini-ouatoare": ["https://vet.md/medicamente/premix-g-ini-ou-toare-1000gr.html"],
  "cubatol-pix-spray-pentru-plagi": ["https://www.arpalit.cz/en/product/kubatol-pix-spray"],
  "arpalit-neo-spray-ectoparazitar": ["https://www.arpalit.cz/en/product/arpalit-neo-spray", "https://www.arpalit.cz/produkt/arpalit-neo-sprej"],
  "corsar-insecticid-lichid-emulsionabil": ["https://vanellivet.info/products/corsar"],
  "fenbendazol-pentru-pasari-gaini": ["https://vanellivet.info/products/vanbendazol"],
  "adtab-tablete-antiparazitare-pentru-ciini": ["https://www.happypets.ro/cumpara/adtab-caine-1-tableta-antiparazitara-2018"],
  "adtab-tablete-antiparazitare-pentru-pisici": ["https://www.petissimo.ro/pisici/antiparazitare-externa-si-interna/tablete-prafuri/adtab-tablete-antiparazitare-pisici.html/ro"],
  "ba-tick-solutie-ectoparaziticida-pour-on": ["https://www.batikpet.com/"],
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
    if (/logo|banner|icon|sprite|bg|placeholder|noimage|payment|social|flag/i.test(u)) continue;
    if (/\.(svg|ico)($|[?&])/i.test(u)) continue;
    return u;
  }
  return null;
}

function extFor(url, buf) {
  if (buf && buf.length >= 12) {
    if (buf[0] === 0xff && buf[1] === 0xd8) return ".jpg";
    if (buf[0] === 0x89 && buf[1] === 0x50) return ".png";
    if (buf[0] === 0x47 && buf[1] === 0x49) return ".gif";
    if (buf.slice(0, 4).toString() === "RIFF" && buf.slice(8, 12).toString() === "WEBP") return ".webp";
  }
  return ".jpg";
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
  let ok = false;
  for (const page of pages) {
    try {
      const html = await get(page);
      const img = extractImage(html, page);
      if (!img) { console.log(`✘ ${product.name} — fără imagine: ${page}`); continue; }
      const file = await download(img, product.slug);
      if (!dry) {
        product.image = `/products/farmavet/${file}`;
        product.sourcePage = page;
        if (product.images?.length) product.images[0] = { url: product.image, alt: product.name, role: "main" };
      }
      console.log(`✔ ${product.name} → ${file} (${page})`);
      done++;
      ok = true;
      break;
    } catch (e) {
      console.log(`  · sărit ${page}: ${e.message}`);
    }
    await sleep(300);
  }
  if (!ok) console.log(`✘ ${product.name} — niciun candidat bun`);
  await sleep(200);
}

if (!dry && done) writeFileSync(catalogFile, JSON.stringify(catalog, null, 2) + "\n");
console.log(`\nPas 4: ${done} imagini manuale salvate.`);
