// Batch 2026-11-02 (2) — gama VetAria+ (Antibiotice Iași, distribuită prin S.A. FARMAVET):
// 11 produse noi create din „Vetaria_poze_si_descrieri_RO.pdf" + 13 imagini
// identificate vizual în public/products/add (2 duplicate → galerie).
import { copyFileSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";

const root = process.cwd();
const srcDir = path.join(root, "public", "products", "add");
const dstDir = path.join(root, "public", "products", "farmavet");
const catalogFile = path.join(root, "scrape", "farmavet_products.json");

const NOTE =
  "Supliment nutritiv veterinar. Nu înlocuiește alimentația echilibrată sau tratamentul prescris. Nu se administrează în caz de hipersensibilitate la ingrediente. Administrare orală, conform instrucțiunilor de pe ambalaj și recomandării medicului veterinar.";

const W = (file) => path.join(srcDir, file);
const P = "WhatsApp Image 2026-11-02 at ";

const NEW = [
  {
    file: `${P}15.39.35 (2).jpeg`,
    id: "400128",
    brand_slug: "antibiotice",
    name: "VetAria+ Cardio — suspensie orală pentru câini și pisici",
    slug: "vetaria-cardio",
    category: "Tonice și produse pentru rehidratare",
    packageSizes: ["45 ml"],
    labels: ["Câini", "Pisici"],
    description:
      "Supliment nutritiv veterinar pentru susținerea funcției cardiace și a metabolismului energetic al inimii. Formula reunește nutrienți și extracte vegetale cu rol antioxidant, pentru sprijinul nutrițional al câinilor și pisicilor cu nevoi cardiovasculare.\n\nPrezentare: 45 ml; suspensie orală palatabilă cu aromă de pui, cu seringă dozatoare de 5 ml.\n\nIngrediente principale: ulei de pește (EPA și DHA), taurină, carnitină, extract de păducel și vitamina C.",
  },
  {
    file: `${P}15.39.35 (1).jpeg`,
    id: "400129",
    brand_slug: "antibiotice",
    name: "VetAria+ Urinary Support — gel oral pentru pisici",
    slug: "vetaria-urinary-support-pisici",
    category: "Vitamine, minerale și premixuri",
    packageSizes: ["30 ml"],
    labels: ["Pisici"],
    description:
      "Supliment nutritiv veterinar destinat confortului urinar al pisicilor. Susține funcționarea normală a tractului urinar și integritatea stratului protector al vezicii. Include ingrediente care contribuie la gestionarea stresului la pisicile predispuse la tulburări urinare.\n\nPrezentare: 30 ml; gel oral palatabil cu aromă de pui, cu seringă dozatoare de 5 ml.\n\nIngrediente principale: DL-metionină, N-acetil-D-glucozamină, acid hialuronic, L-triptofan, extracte de valeriană, merișor și Camellia sinensis, vitamina B6.",
  },
  {
    file: `${P}15.39.35.jpeg`,
    id: "400130",
    brand_slug: "antibiotice",
    name: "VetAria+ Renal Plus — pastă pentru câini",
    slug: "vetaria-renal-plus-caini",
    category: "Vitamine, minerale și premixuri",
    packageSizes: ["60 ml"],
    labels: ["Câini"],
    description:
      "Supliment nutritiv veterinar pentru susținerea funcției renale la câini. Formula oferă sprijin nutrițional rinichilor, contribuie la menținerea diurezei normale și asigură suport antioxidant. Poate completa îngrijirea câinilor cu afectare renală, la recomandarea medicului veterinar.\n\nPrezentare: 60 ml; pastă palatabilă cu aromă de pește, în seringă preumplută.\n\nIngrediente principale: chitosan, carbonat de calciu, Lespedeza capitata, extract de silimarină, vitaminele E și D3.",
  },
  {
    file: `${P}15.39.34 (6).jpeg`,
    id: "400131",
    brand_slug: "antibiotice",
    name: "VetAria+ Probiotic — capsule pentru câini și pisici",
    slug: "vetaria-probiotic",
    category: "Vitamine, minerale și premixuri",
    packageSizes: ["30 capsule"],
    labels: ["Câini", "Pisici"],
    description:
      "Supliment nutritiv veterinar care sprijină echilibrul florei intestinale și confortul digestiv. Poate fi utilizat pentru susținerea refacerii microbiotei după administrarea de antibiotice sau antiparazitare, conform recomandării medicului veterinar. Combină microorganisme benefice, prebiotice și nutrienți pentru tractul digestiv.\n\nPrezentare: 30 capsule twist-off palatabile, cu aromă de pui.\n\nIngrediente principale: Enterococcus faecium, Lactobacillus helveticus, Lacticaseibacillus paracasei, FOS, produse cu drojdie (beta-glucani și MOS), pectină, glutamină și electroliți.",
  },
  {
    file: `${P}15.39.34 (5).jpeg`,
    id: "400132",
    brand_slug: "antibiotice",
    name: "VetAria+ Articulații — capsule pentru câini și pisici",
    slug: "vetaria-articulatii",
    category: "Vitamine, minerale și premixuri",
    packageSizes: ["30 capsule"],
    labels: ["Câini", "Pisici"],
    description:
      "Supliment nutritiv veterinar pentru susținerea cartilajelor și a mobilității articulare. Formula asociază nutrienți structurali cu ingrediente care sprijină confortul în mișcare. Potrivit ca suport nutrițional în planul de îngrijire a articulațiilor, stabilit împreună cu medicul veterinar.\n\nPrezentare: 30 capsule twist-off palatabile, cu aromă de pui.\n\nIngrediente principale: glucozamină, MSM, sulfat de condroitină, colagen nativ tip II, vitamina C și extract de gheara-diavolului.",
  },
  {
    file: `${P}15.39.34 (4).jpeg`,
    id: "400133",
    brand_slug: "antibiotice",
    name: "VetAria+ Imunitate — capsule pentru câini și pisici",
    slug: "vetaria-imunitate",
    category: "Imunostimulatoare",
    packageSizes: ["30 capsule"],
    labels: ["Câini", "Pisici"],
    description:
      "Supliment nutritiv veterinar destinat susținerii mecanismelor naturale de apărare ale organismului. Combină beta-glucani, ciuperci cu rol nutritiv, componente microbiene și propolis. Oferă sprijin nutrițional sistemului imunitar al câinilor și pisicilor.\n\nPrezentare: 30 capsule twist-off palatabile, cu aromă de pui.\n\nIngrediente principale: beta-glucani, Grifola frondosa, Lentinula edodes, Lactobacillus helveticus, Lacticaseibacillus paracasei și propolis.",
  },
  {
    file: `${P}15.39.34 (3).jpeg`,
    id: "400134",
    brand_slug: "antibiotice",
    name: "VetAria+ Piele și Blană — capsule pentru câini și pisici",
    slug: "vetaria-piele-si-blana",
    category: "Vitamine, minerale și premixuri",
    packageSizes: ["60 capsule"],
    labels: ["Câini", "Pisici"],
    description:
      "Supliment nutritiv veterinar pentru îngrijirea pielii și menținerea unei blăni sănătoase. Formula combină uleiuri nutritive, vitamine și zinc, oferind nutrienți importanți pentru bariera cutanată și aspectul blănii. Poate completa îngrijirea dermatologică recomandată de medicul veterinar.\n\nPrezentare: 60 capsule twist-off palatabile, cu aromă de pește.\n\nIngrediente principale: ulei de limba-mielului, ulei de pește, ulei de floarea-soarelui, vitaminele A, D3, C, E, B1, B2, B5, B6 și biotină, zinc.",
  },
  {
    file: `${P}15.39.34 (1).jpeg`,
    extraFile: `${P}15.39.34 (2).jpeg`,
    id: "400135",
    brand_slug: "antibiotice",
    name: "VetAria+ Renal — capsule pentru câini și pisici",
    slug: "vetaria-renal",
    category: "Vitamine, minerale și premixuri",
    packageSizes: ["30 capsule"],
    labels: ["Câini", "Pisici"],
    description:
      "Supliment nutritiv veterinar pentru susținerea funcției renale la câini și pisici. Reunește chitosan, extract vegetal, săruri minerale și vitamine din grupul B. Este destinat suportului nutrițional al animalelor cu nevoi renale și poate completa planul de îngrijire recomandat de medicul veterinar.\n\nPrezentare: 30 capsule twist-off palatabile, cu aromă de pui.\n\nIngrediente principale: chitosan, păducel, carbonat de calciu, carbonat de magneziu, vitaminele B6, B9 și B12.",
  },
  {
    file: `${P}15.39.34.jpeg`,
    id: "400136",
    brand_slug: "antibiotice",
    name: "VetAria+ Hepatic — capsule pentru câini de talie medie și mare",
    slug: "vetaria-hepatic-talie-medie-mare",
    category: "Vitamine, minerale și premixuri",
    packageSizes: ["30 capsule"],
    labels: ["Câini"],
    description:
      "Supliment nutritiv veterinar formulat pentru sprijinirea funcției hepatice la câinii de talie medie și mare. Aportul de nutrienți și antioxidanți susține protecția celulelor hepatice. Se utilizează ca suport nutrițional, inclusiv alături de tratamentul prescris pentru afecțiunile hepatice.\n\nPrezentare: 30 capsule twist-off palatabile, cu aromă de pui.\n\nIngrediente principale: Saccharomyces cerevisiae, complex de silibină și fosfolipide din armurariu, metionină, taurină, vitaminele E și C, zinc și seleniu.",
  },
  {
    file: `${P}15.39.33.jpeg`,
    extraFile: `${P}15.39.33 (2).jpeg`,
    id: "400137",
    brand_slug: "antibiotice",
    name: "VetAria+ Hepatic — capsule pentru câini de talie mică și pisici",
    slug: "vetaria-hepatic-talie-mica-pisici",
    category: "Vitamine, minerale și premixuri",
    packageSizes: ["30 capsule"],
    labels: ["Câini", "Pisici"],
    description:
      "Supliment nutritiv veterinar pentru susținerea funcției hepatice la pisici și câini de talie mică. Formula furnizează nutrienți cu rol antioxidant și hepatoprotector. Poate fi inclus ca adjuvant în planul de îngrijire hepatică recomandat de medicul veterinar.\n\nPrezentare: 30 capsule twist-off palatabile, cu aromă de pui.\n\nIngrediente principale: metionină, complex de silibină și fosfolipide, taurină, vitaminele E și C, zinc și seleniu.",
  },
  {
    file: `${P}15.39.33 (1).jpeg`,
    id: "400138",
    brand_slug: "antibiotice",
    name: "VetAria+ Urinar — capsule pentru câini și pisici",
    slug: "vetaria-urinar",
    category: "Vitamine, minerale și premixuri",
    packageSizes: ["30 capsule"],
    labels: ["Câini", "Pisici"],
    description:
      "Supliment nutritiv veterinar pentru susținerea sănătății tractului urinar la câini și pisici. Formula cu merișor, N-acetil-D-glucozamină și ulei de pește contribuie la protejarea mucoasei urinare și la confortul urinar. Poate completa îngrijirea recomandată pentru animalele cu sensibilitate urinară.\n\nPrezentare: 30 capsule twist-off palatabile.\n\nIngrediente principale: extract de merișor (Vaccinium macrocarpon), ulei de pește și N-acetil-D-glucozamină.",
  },
];

const catalog = JSON.parse(readFileSync(catalogFile, "utf8"));
const bySlug = new Map(catalog.products.map((p) => [p.slug, p]));

for (const n of NEW) {
  if (bySlug.has(n.slug)) { console.log(`· ${n.slug} există deja, se sare`); continue; }
  const image = `${n.slug}.jpg`;
  copyFileSync(W(n.file), path.join(dstDir, image));
  const url = `/products/farmavet/${image}`;
  const images = [{ url, alt: n.name, role: "main" }];
  if (n.extraFile) {
    copyFileSync(W(n.extraFile), path.join(dstDir, `${n.slug}-2.jpg`));
    images.push({ url: `/products/farmavet/${n.slug}-2.jpg`, alt: n.name, role: "gallery" });
  }
  const product = {
    id: n.id,
    brand_slug: n.brand_slug,
    name: n.name,
    slug: n.slug,
    category: n.category,
    description: `${n.description}\n\n${NOTE}`,
    image: url,
    labels: n.labels,
    features: [],
    benefits: [],
    package_sizes: n.packageSizes,
    variants: [],
    url: "",
    prospect: "",
    images,
    breadcrumbs: [n.category, n.name],
    product_type: "",
    sourcePage: "manual",
  };
  catalog.products.push(product);
  bySlug.set(n.slug, product);
  console.log(`➕ ${n.name}`);
}

writeFileSync(catalogFile, JSON.stringify(catalog, null, 2) + "\n");
const real = catalog.products.filter((p) => p.image?.startsWith("/products/farmavet/")).length;
console.log(`total: ${catalog.products.length}, reale: ${real}/${catalog.products.length}`);
