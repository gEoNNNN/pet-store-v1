// Asociază imaginile din public/products/add cu produsele din catalog
// după numele din titlul fișierului. Cu --apply le și copiază + actualizează catalogul.
import { copyFileSync, existsSync, mkdirSync, readFileSync, readdirSync, statSync, unlinkSync, writeFileSync } from "node:fs";
import path from "node:path";

const root = process.cwd();
const apply = process.argv.includes("--apply");
const srcDir = path.join(root, "public", "products", "add");
const dstDir = path.join(root, "public", "products", "farmavet");
const catalogFile = path.join(root, "scrape", "farmavet_products.json");

const norm = (v) => v.toLowerCase()
  .replace(/[șş]/g, "s").replace(/[țţ]/g, "t").replace(/ă/g, "a").replace(/â/g, "i").replace(/î/g, "i")
  .replace(/[^a-z0-9]+/g, " ").trim();
// cifrele RĂMÂN (2000, 500, 10%) — sunt distinctive între produse similare
const toks = (v) => norm(v).split(" ").filter((t) => t.length > 2);

function detectExt(buf) {
  if (buf.length >= 12) {
    if (buf[0] === 0xff && buf[1] === 0xd8) return ".jpg";
    if (buf[0] === 0x89 && buf[1] === 0x50) return ".png";
    if (buf[0] === 0x47 && buf[1] === 0x49) return ".gif";
    if (buf.slice(0, 4).toString() === "RIFF" && buf.slice(8, 12).toString() === "WEBP") return ".webp";
    if (buf.slice(4, 8).toString() === "ftyp" && /avif/i.test(buf.slice(8, 12).toString())) return ".avif";
  }
  return null;
}

const catalog = JSON.parse(readFileSync(catalogFile, "utf8"));
const files = readdirSync(srcDir).filter((f) => statSync(path.join(srcDir, f)).isFile() && /\.(jpe?g|jfif|png|webp|avif|gif)$/i.test(f));
const rows = [];
for (const file of files) {
  const base = file.replace(/\.[^.]+$/, "");
  const want = toks(base);
  let best = null;
  let bestScore = 0;
  for (const p of catalog.products) {
    const hay = new Set(toks(p.name));
    let score = 0;
    let hit = 0;
    for (const w of want) {
      if (hay.has(w)) { score += 2; hit++; }
      else for (const h of hay) {
        if (w.length >= 5 && (h.startsWith(w.slice(0, 5)) || w.startsWith(h.slice(0, 5)))) { score += 0.5; break; }
      }
    }
    score += hit * 0.7;
    if (score > bestScore) { bestScore = score; best = p; }
  }
  rows.push({ file, product: best, score: Number(bestScore.toFixed(1)) });
}

let updated = 0;
const report = [];
for (const r of rows.sort((a, b) => b.score - a.score)) {
  const p = r.product;
  if (!p) { report.push(`✗ ${r.file} → NICIUN MATCH`); continue; }
  const src = path.join(srcDir, r.file);
  const buf = readFileSync(src);
  const real = detectExt(buf);
  if (!real) { report.push(`✗ ${r.file} → format nerecunoscut`); continue; }
  if (buf.length < 4 * 1024) { report.push(`✗ ${r.file} → prea mică (${buf.length}B)`); continue; }
  const newFile = `${p.slug}${real}`;
  if (apply) {
    mkdirSync(dstDir, { recursive: true });
    copyFileSync(src, path.join(dstDir, newFile));
    // știe fișierul vechi al aceluiași produs cu altă extensie
    const oldBase = p.image.split("/").pop();
    if (oldBase && oldBase !== newFile) {
      const old = path.join(dstDir, oldBase);
      if (existsSync(old)) unlinkSync(old);
    }
    p.image = `/products/farmavet/${newFile}`;
    p.sourcePage = "manual";
    if (p.images?.length) p.images[0] = { url: p.image, alt: p.name, role: "main" };
  }
  updated++;
  report.push(`${apply ? "✔" : "="} ${r.file}  →  ${p.name} (${p.slug}${real})${buf.length < 9000 ? " ⚠ mică" : ""}`);
}

if (apply) {
  writeFileSync(catalogFile, JSON.stringify(catalog, null, 2) + "\n");
  // curățare orfane: fișiere din farmavet/ nealimentate de catalog
  const cat = JSON.parse(readFileSync(catalogFile, "utf8"));
  const refs = new Set(cat.products.map((x) => x.image.split("/").pop()));
  for (const f of readdirSync(dstDir)) if (!refs.has(f)) { unlinkSync(path.join(dstDir, f)); report.push(`curățat orfan: ${f}`); }
}
console.log(report.join("\n"));
console.log(`\n${apply ? "Aplicate" : "Proposal"}: ${updated}/${rows.length} imagini. reale: ${
  JSON.parse(readFileSync(catalogFile, "utf8")).products.filter((x) => x.image.startsWith("/products/farmavet/")).length
}/124`);
