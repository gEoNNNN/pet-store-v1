// Batch 2026-11-02 — imagini identificate vizual (etichete citite din fotografii):
//  - 11 aplicate produselor existente din catalog
//  - 4 creează produse noi (Vitaminar Plus, Amin Total, Fluralaner 1%, Neoverm)
// Folderul public/products/add rămâne neatins (sursele utilizatorului).
import { copyFileSync, existsSync, readFileSync, unlinkSync, writeFileSync } from "node:fs";
import path from "node:path";

const root = process.cwd();
const srcDir = path.join(root, "public", "products", "add");
const dstDir = path.join(root, "public", "products", "farmavet");
const catalogFile = path.join(root, "scrape", "farmavet_products.json");

/** fișier → slug produs existent */
const EXISTING = [
  { file: "WhatsApp Image 2026-11-02 at 10.49.01.jpeg", slug: "analghin-50-solutie-injectabila" },
  { file: "WhatsApp Image 2026-11-02 at 10.51.09.jpeg", slug: "bromodox-solutie-injectabila" },
  { file: "WhatsApp Image 2026-11-02 at 11.10.24.jpeg", slug: "colivetoprim-pulbere-hidrosolubila" },
  { file: "WhatsApp Image 2026-11-02 at 11.10.24 (1).jpeg", slug: "ceftiofur-suspensie-injectabila" },
  { file: "WhatsApp Image 2026-11-02 at 11.10.24 (2).jpeg", slug: "trimicozin-solutie-orala-pentru-pasari" },
  { file: "IMG_4483.PNG", slug: "calciu-vitaminizat-aromatizat-pulbere" },
  { file: "IMG_4484.PNG", slug: "faina-de-peste-vitaminizata" },
  { file: "IMG_4485.PNG", slug: "diazinon-60-insecto-acaricid-emulsionabil" },
  { file: "IMG_4488.PNG", slug: "rozaticid-momeala-rodenticida-pe-baza-de-griu" },
  { file: "IMG_4491.PNG", slug: "drojdie-furajera-46-proteina" },
  { file: "IMG_4492.PNG", slug: "biotan-concentrat-de-vitamine-si-minerale" },
];

/** 4 produse noi — descrieri bazate strict pe etichete (fără prospect în „SAIT FARMAVET 2026") */
const NEW = [
  {
    file: "IMG_4486.PNG",
    id: "400124",
    brand_slug: "lihua-pharma",
    name: "Vitaminar Plus — premix multivitaminic și mineral",
    slug: "vitaminar-plus-premix-multivitaminic",
    category: "Vitamine, minerale și premixuri",
    labels: ["Toate speciile"],
    description:
      "Premix multivitaminic și mineral LIHUA PHARMA, 15 g. Susține sănătatea generală și productivitatea animalelor prin acoperirea necesarului de vitamine și oligoelemente.\n\nMod de administrare: conform recomandării medicului veterinar sau a schemei indicate pe etichetă.",
  },
  {
    file: "IMG_4487.PNG",
    id: "400125",
    brand_slug: "lihua-pharma",
    name: "Amin Total — pulbere multivitaminică pentru păsări",
    slug: "amin-total-pulbere-multivitaminica-pasari",
    category: "Vitamine, minerale și premixuri",
    labels: ["Păsări"],
    description:
      "Pulbere multivitaminică LIHUA PHARMA, 100 g — vitamine, aminoacizi și oligoelemente pentru păsări.\n\nMod de administrare: conform recomandării medicului veterinar sau a schemei indicate pe etichetă.",
  },
  {
    file: "IMG_4489.PNG",
    id: "400126",
    brand_slug: "shandong-luxi",
    name: "Fluralaner 1% — soluție orală pentru păsări",
    slug: "fluralaner-solutie-orala-pentru-pasari",
    category: "Antiparazitare interne și externe",
    labels: ["Păsări"],
    description:
      "Soluție orală antiparazitară pentru păsări cu fluralaner 1% (10 mg/ml), Shandong Luxi.\n\nNotă: produs destinat păsărilor — nu se confundă cu variantele Bravecto pentru câini și pisici din același principiu activ. Administrare conform recomandării medicului veterinar.",
  },
  {
    file: "IMG_4490.PNG",
    id: "400127",
    brand_slug: "biofarm",
    name: "Neoverm — soluție pentru administrare orală",
    slug: "neoverm-solutie-orala",
    category: "Antiparazitare interne și externe",
    labels: ["Toate speciile"],
    description:
      "Soluție antiparazitară pentru administrare orală Biofarm, 10 fiole × 10 ml, pentru mai multe specii de animale.\n\nAdministrare conform recomandării medicului veterinar.",
  },
];

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

// 1. produse existente — doar înlocuirea imaginii
for (const { file, slug } of EXISTING) {
  const p = bySlug.get(slug);
  if (!p) { console.log(`✗ ${slug}: nu e în catalog`); continue; }
  const dst = install(file, slug);
  unlinkOld(p.image, dst);
  p.image = `/products/farmavet/${dst}`;
  p.sourcePage = "manual";
  if (p.images?.length) p.images[0] = { url: p.image, alt: p.name, role: "main" };
  console.log(`✔ ${file} → ${p.name} (${dst})`);
}

// 2. produse noi — adăugate direct în lista de produse
for (const n of NEW) {
  if (bySlug.has(n.slug)) { console.log(`· ${n.slug} există deja, se sare`); continue; }
  const dst = install(n.file, n.slug);
  const image = `/products/farmavet/${dst}`;
  const product = {
    id: n.id,
    brand_slug: n.brand_slug,
    name: n.name,
    slug: n.slug,
    category: n.category,
    description: n.description,
    image,
    labels: n.labels,
    features: [],
    benefits: [],
    package_sizes: [],
    variants: [],
    url: "",
    prospect: "",
    images: [{ url: image, alt: n.name, role: "main" }],
    breadcrumbs: [n.category, n.name],
    product_type: "",
    sourcePage: "manual",
  };
  catalog.products.push(product);
  bySlug.set(n.slug, product);
  console.log(`➕ produs nou: ${n.name} (${dst})`);
}

writeFileSync(catalogFile, JSON.stringify(catalog, null, 2) + "\n");

const real = catalog.products.filter((p) => p.image?.startsWith("/products/farmavet/")).length;
console.log(`total: ${catalog.products.length}, reale: ${real}/${catalog.products.length}`);
