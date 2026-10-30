// Aplică cele 4 imagini WhatsApp identificate vizual (_condus manual, 2026-10-30):
//  - 43.jpeg     → eticheta „Premix pentru scroafe gestante -1%" (Tekro, 1000g)
//  - 43 (1).jpeg → eticheta „PREMIX prepeliță -2%" (Tekro, 1000 gr)
//  - 44.jpeg     → eticheta „Premix purcei prestarter -1%" purcei 0–2 luni (Tekro)
//  - 44 (1).jpeg → eticheta „Сірка/Сера 1 кг" (O.L.KAR) = Sulf Furajer
import { copyFileSync, existsSync, readFileSync, readdirSync, statSync, unlinkSync, writeFileSync } from "node:fs";
import path from "node:path";

const root = process.cwd();
const srcDir = path.join(root, "public", "products", "add");
const dstDir = path.join(root, "public", "products", "farmavet");
const catalogFile = path.join(root, "scrape", "farmavet_products.json");

const MAP = [
  { file: "WhatsApp Image 2026-10-30 at 14.37.21.jpeg", slug: "premix-purcei-1-2-4-luni" },
  { file: "WhatsApp Image 2026-10-30 at 14.37.22.jpeg", slug: "premix-purcei-1-peste-4-luni" },
  { file: "WhatsApp Image 2026-10-30 at 14.40.20.jpeg", slug: "killer-muh-500-insecticid-microencapsulat-contra-mustelor" },
];

const catalog = JSON.parse(readFileSync(catalogFile, "utf8"));
const bySlug = new Map(catalog.products.map((p) => [p.slug, p]));

for (const { file, slug } of MAP) {
  const src = path.join(srcDir, file);
  const buf = readFileSync(src);
  const isPng = buf[0] === 0x89 && buf[1] === 0x50;
  const ext = isPng ? ".png" : ".jpg";
  const name = `${slug}${ext}`;
  const product = bySlug.get(slug);
  if (!product) { console.log(`✗ ${slug}: nu e în catalog`); continue; }
  copyFileSync(src, path.join(dstDir, name));
  const old = product.image.split("/").pop();
  if (old && old !== name && existsSync(path.join(dstDir, old))) unlinkSync(path.join(dstDir, old));
  product.image = `/products/farmavet/${name}`;
  product.sourcePage = "manual";
  if (product.images?.length) product.images[0] = { url: product.image, alt: product.name, role: "main" };
  console.log(`✔ ${file} → ${product.name} (${name})`);
}

writeFileSync(catalogFile, JSON.stringify(catalog, null, 2) + "\n");

// curățare orfane din farmavet/ (fișiere nereferențiate)
const refs = new Set(JSON.parse(readFileSync(catalogFile, "utf8")).products.map((x) => x.image.split("/").pop()));
for (const f of readdirSync(dstDir)) {
  if (statSync(path.join(dstDir, f)).isFile() && !refs.has(f)) {
    unlinkSync(path.join(dstDir, f));
    console.log(`orfan șters: ${f}`);
  }
}
console.log(`reale: ${catalog.products.filter((p) => p.image.startsWith("/products/farmavet/")).length}/${catalog.products.length}`);
