import "server-only";

import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import type {
  FreshIngredient,
  Product,
  ProductBrand,
  ProductBrandSlug,
  ProductCategory,
  ProductImage,
  ProductSection,
  ProductSummary,
} from "./products";

type JsonObject = Record<string, unknown>;

let productCache: Product[] | undefined;

function isObject(value: unknown): value is JsonObject {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function toStringValue(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function toStringArray(value: unknown) {
  return Array.isArray(value) ? value.map(toStringValue).filter(Boolean) : [];
}

function getScrapeDirectory() {
  const candidates = [
    path.resolve(process.cwd(), "..", "scrape"),
    path.resolve(process.cwd(), "scrape"),
  ];
  const directory = candidates.find((candidate) => existsSync(path.join(candidate, "products.json")));
  if (!directory) {
    throw new Error("Nu am găsit folderul scrape cu fișierele JSON ale produselor.");
  }
  return directory;
}

function readCatalog(filename: string) {
  const filePath = path.join(getScrapeDirectory(), filename);
  if (!existsSync(filePath)) {
    throw new Error(`Fișierul de produse lipsește: ${filePath}`);
  }
  const catalog: unknown = JSON.parse(readFileSync(filePath, "utf8"));
  if (!isObject(catalog) || !Array.isArray(catalog.products)) {
    throw new Error(`Format invalid pentru catalogul ${filename}`);
  }
  return catalog.products.filter(isObject);
}

function normalizeCategory(value: unknown, name: string): ProductCategory {
  const category = toStringValue(value).toLowerCase();
  if (category === "cats") return "Pisici";
  if (category === "rodents") return "Rozătoare";
  if (category === "dogs") return "Câini";
  return /\b(cat|kitten|pisic)/i.test(name) ? "Pisici" : "Câini";
}

function normalizeImages(value: unknown): ProductImage[] {
  if (!Array.isArray(value)) return [];
  return value.filter(isObject).flatMap((image) => {
    const url = toStringValue(image.url);
    if (!url) return [];
    return [{ url, alt: toStringValue(image.alt), role: toStringValue(image.role) || "gallery" }];
  });
}

function normalizeTables(value: unknown): string[][][] {
  if (!Array.isArray(value)) return [];
  return value.flatMap((table) => {
    if (!Array.isArray(table)) return [];
    const rows = table.flatMap((row) => {
      if (!Array.isArray(row)) return [];
      const cells = row.map(toStringValue);
      return cells.length ? [cells] : [];
    });
    return rows.length ? [rows] : [];
  });
}

function normalizeSections(value: unknown): ProductSection[] {
  if (!isObject(value)) return [];
  return Object.entries(value).flatMap(([title, section]) => {
    if (!isObject(section)) return [];
    const text = toStringValue(section.text);
    const tables = normalizeTables(section.tables);
    if (!text && !tables.length) return [];
    return [{ title: translateSectionTitle(title), text: translateText(text), tables }];
  });
}

const sectionTitleMap: Record<string, string> = {
  Composition: "Compoziție",
  "Analytical ingredients": "Ingrediente analitice",
  "Nutritional composition": "Compoziție nutrițională",
  "Feeding table": "Ghid de hrănire",
  "Feeding guide": "Ghid de hrănire",
  Ingredients: "Ingrediente",
  Description: "Descriere",
  Benefits: "Beneficii",
  Features: "Caracteristici",
  Overview: "Prezentare generală",
  "Product details": "Detalii produs",
  "Additional information": "Informații suplimentare",
};

function translateSectionTitle(title: string): string {
  return sectionTitleMap[title] || title;
}

function translateText(text: string): string {
  if (!text) return text;
  let result = text;
  // Curăță caracterele corupte din scraping
  result = result.replace(/\uFFFD\?[\u2013\u2014-]/g, "•");
  result = result.replace(/\uFFFD/g, "");
  result = result.replace(/A's/g, "'");
  result = result.replace(/\s+/g, " ").trim();
  const replacements: [RegExp, string][] = [
    [/\bComplete feed for\b/gi, "Hrană completă pentru"],
    [/\bpregnant or lactating cats\b/gi, "pisici gestante sau în perioada de alăptare"],
    [/\bpregnant or lactating dogs\b/gi, "cățele gestante sau în perioada de alăptare"],
    [/\bkittens?\b/gi, "pisoi"],
    [/\bpuppies?\b/gi, "pui de câine"],
    [/\badult cats\b/gi, "pisici adulte"],
    [/\badult dogs\b/gi, "câini adulți"],
    [/\bgrain-free\b/gi, "fără cereale"],
    [/\bgrain free\b/gi, "fără cereale"],
    [/\bhigh-protein\b/gi, "bogat în proteine"],
    [/\bhigh protein\b/gi, "bogat în proteine"],
    [/\bprobiotics\b/gi, "probioticele"],
    [/\bprebiotics\b/gi, "prebioticele"],
    [/\bcolostrum\b/gi, "colastrul"],
    [/\bomega-3\b/gi, "omega-3"],
    [/\bomega-6\b/gi, "omega-6"],
    [/\bfresh salmon\b/gi, "somon proaspăt"],
    [/\bfresh chicken\b/gi, "pui proaspăt"],
    [/\bfresh lamb\b/gi, "miel proaspăt"],
    [/\bdehydrated\b/gi, "deshidratat"],
    [/\bcrude protein\b/gi, "proteină brută"],
    [/\bcrude fat\b/gi, "grăsime brută"],
    [/\bcrude fibre\b/gi, "fibră brută"],
    [/\bcrude ash\b/gi, "cenușă brută"],
    [/\bmoisture\b/gi, "umiditate"],
    [/\bcalcium\b/gi, "calciu"],
    [/\bphosphorus\b/gi, "fosfor"],
    [/\bsodium\b/gi, "sodiu"],
    [/\bmagnesium\b/gi, "magneziu"],
    [/\bvitamin A\b/gi, "vitamina A"],
    [/\bvitamin D3\b/gi, "vitamina D3"],
    [/\bvitamin E\b/gi, "vitamina E"],
    [/\bvitamin C\b/gi, "vitamina C"],
    [/\bvitamin B1\b/gi, "vitamina B1"],
    [/\bvitamin B2\b/gi, "vitamina B2"],
    [/\bvitamin B6\b/gi, "vitamina B6"],
    [/\bvitamin B12\b/gi, "vitamina B12"],
    [/\bfolic acid\b/gi, "acid folic"],
    [/\bniacinamide\b/gi, "niacinamidă"],
    [/\bbiotin\b/gi, "biotină"],
    [/\bcholine chloride\b/gi, "clorură de colină"],
    [/\btaurine\b/gi, "taurină"],
    [/\bL-carnitine\b/gi, "L-carnitină"],
    [/\bL-methionine\b/gi, "L-metionină"],
    [/\bzinc\b/gi, "zinc"],
    [/\biron\b/gi, "fier"],
    [/\bmanganese\b/gi, "mangan"],
    [/\biodide\b/gi, "iod"],
    [/\bcopper\b/gi, "cupru"],
    [/\bselenium\b/gi, "seleniu"],
    [/\bfatty acids\b/gi, "acizi grași"],
    [/\bServe the food dry\b/gi, "Servește hrana uscată"],
    [/\bmoistened with lukewarm water\b/gi, "sau umectată cu apă călduță"],
    [/\bEnsure your cat has access to fresh drinking water\b/gi, "Asigură-te că pisica are acces la apă potabilă proaspătă"],
    [/\bEnsure your dog has access to fresh drinking water\b/gi, "Asigură-te că câinele are acces la apă potabilă proaspătă"],
    [/\bat all times\b/gi, "în orice moment"],
    [/\bFood should be freely available\b/gi, "Hrana trebuie să fie disponibilă liber"],
    [/\bduring the day\b/gi, "pe parcursul zilei"],
    [/\bWhen introducing for the first time\b/gi, "La introducerea pentru prima dată"],
    [/\bmix with previous food\b/gi, "amestecă cu hrana anterioară"],
    [/\bto ease transition\b/gi, "pentru a facilita tranziția"],
    [/\bKeep in a dry and cool place\b/gi, "Păstrează într-un loc uscat și răcoros"],
    [/\bavoid direct sunlight\b/gi, "evită expunerea directă la soare"],
    [/\breseal after opening\b/gi, "și închide ermetic după deschidere"],
    [/\bpoultry fat\b/gi, "grăsime de pasăre"],
    [/\bpreserved with tocopherols\b/gi, "conservată cu tocoferoli"],
    [/\bsalmon oil\b/gi, "ulei de somon"],
    [/\bhydrolyzed chicken liver\b/gi, "ficat de pui hidrolizat"],
    [/\blinseed\b/gi, "semințe de in"],
    [/\bdried apples\b/gi, "mere uscate"],
    [/\bpea flour\b/gi, "făină de mazăre"],
    [/\bbrewer's yeast\b/gi, "drojdie de bere"],
    [/\bdried chamomile\b/gi, "mușețel uscat"],
    [/\balgae oil\b/gi, "ulei de alge"],
    [/\bdried sea buckthorn\b/gi, "cătină uscată"],
    [/\bdried cranberries\b/gi, "afine uscate"],
    [/\bMojave yucca\b/gi, "Yucca Mojave"],
    [/\bhelp maintain gastrointestinal tract\b/gi, "ajută la menținerea sănătății tractului gastrointestinal"],
    [/\bimmune system health\b/gi, "sistemului imunitar"],
    [/\bcontains immunoglobulins\b/gi, "conține imunoglobuline"],
    [/\bantibodies that help\b/gi, "anticorpi care ajută"],
    [/\bbuild strong immunity\b/gi, "să construiască o imunitate puternică"],
    [/\bfosters brain and eye development\b/gi, "favorizează dezvoltarea creierului și a ochilor"],
    [/\bhelp boost cognitive development\b/gi, "ajută la stimularea dezvoltării cognitive"],
    [/\bis rich in omega-3\b/gi, "este bogat în omega-3"],
    [/\bhelp support skin and coat vitality\b/gi, "ajută la menținerea vitalității pielii și blănii"],
    [/\bNO colorants\b/gi, "FĂRĂ coloranți"],
    [/\bNO preservatives\b/gi, "FĂRĂ conservanți"],
    [/\bNO GMO\b/gi, "FĂRĂ OMG"],
    [/\bNO soy\b/gi, "FĂRĂ soia"],
    [/\bhighly digestible formula\b/gi, "formulă ușor digerabilă"],
    [/\brich in essential nutrients\b/gi, "bogat în nutrienți esențiali"],
    [/\bsatisfy the energy demands\b/gi, "satisfacă cerințele energetice"],
    [/\bsupport proper fetal development\b/gi, "sprijină dezvoltarea fetală corectă"],
    [/\bbalanced content\b/gi, "conținut echilibrat"],
    [/\bcomplex of vitamins\b/gi, "complex de vitamine"],
    [/\bminerals\b/gi, "minerale"],
    [/\bessential fatty acids\b/gi, "acizi grași esențiali"],
    [/\bensures delivery of healthy kittens\b/gi, "asigură nașterea unor pisoi sănătoși"],
    [/\bensures delivery of healthy puppies\b/gi, "asigură nașterea unor pui sănătoși"],
    [/\bhelps prevent rickets\b/gi, "ajută la prevenirea rahitismului"],
    [/\bHYPOALLERGENIC\b/gi, "HIPOALERGENIC"],
    [/\bFRESH SALMON FORMULA\b/gi, "FORMULĂ CU SOMON PROASPĂT"],
    [/\bFRESH CHICKEN FORMULA\b/gi, "FORMULĂ CU PUI PROASPĂT"],
    [/\bFRESH LAMB FORMULA\b/gi, "FORMULĂ CU MIEL PROASPĂT"],
    [/\bGENTLE DIGESTION\b/gi, "DIGESTIE UȘOARĂ"],
    [/\bSTRONG IMMUNITY\b/gi, "IMUNITATE PUTERNICĂ"],
    [/\band\b/gi, "și"],
    [/\bfor\b/gi, "pentru"],
    [/\bwith\b/gi, "cu"],
    [/\bmonths\b/gi, "luni"],
    [/\bhelps?\b/gi, "ajută"],
    [/\bhelp\b/gi, "ajută"],
    [/\bsupport\b/gi, "sprijină"],
  ];
  for (const [pattern, replacement] of replacements) {
    result = result.replace(pattern, replacement);
  }
  return result;
}

function normalizeFreshIngredients(value: unknown): FreshIngredient[] {
  if (!Array.isArray(value)) return [];
  return value.filter(isObject).flatMap((ingredient) => {
    const description = toStringValue(ingredient.description);
    const name = toStringValue(ingredient.name) || null;
    if (!name && !description) return [];
    return [{ name, description, image: toStringValue(ingredient.image) || null }];
  });
}

function normalizeProduct(raw: JsonObject, brand: ProductBrand, brandSlug: ProductBrandSlug): Product {
  const slug = toStringValue(raw.slug);
  const name = toStringValue(raw.name);
  const rawId = toStringValue(raw.id) || slug;
  const image = toStringValue(raw.image);
  const description = translateText(toStringValue(raw.description) || toStringValue(raw.raw_text));
  const isBrit = brandSlug === "brit";
  return {
    id: `${brandSlug}-${rawId}`,
    brand,
    brandSlug,
    slug,
    href: `/produse/${brandSlug}/${slug}`,
    name,
    category: normalizeCategory(raw.category, name),
    description,
    image,
    labels: toStringArray(raw.labels),
    packageSizes: toStringArray(isBrit ? raw.variants : raw.package_sizes),
    sourceUrl: toStringValue(raw.url),
    productType: toStringValue(raw.product_type) || null,
    breadcrumbs: toStringArray(raw.breadcrumbs),
    features: toStringArray(isBrit ? raw.benefits : raw.features).map(translateText),
    ingredientTags: toStringArray(raw.ingredient_tags).map(translateText),
    images: normalizeImages(raw.images),
    videos: toStringArray(raw.videos),
    sections: normalizeSections(raw.sections),
    freshIngredients: normalizeFreshIngredients(raw.fresh_ingredients).map((ingredient) => ({
      ...ingredient,
      description: translateText(ingredient.description),
      name: ingredient.name ? translateText(ingredient.name) : null,
    })),
    metabolizableEnergy: toStringValue(raw.metabolizable_energy) || null,
    rawText: translateText(toStringValue(raw.raw_text)),
  };
}

export function getProducts(): Product[] {
  if (!productCache) {
    const britProducts = readCatalog("products.json").map((product) =>
      normalizeProduct(product, "Brit", "brit"),
    );
    const carniloveProducts = readCatalog("carnilove_products.json").map((product) =>
      normalizeProduct(product, "Carnilove", "carnilove"),
    );
    productCache = [...britProducts, ...carniloveProducts].filter(
      (product) => product.slug && product.name && product.image,
    );
  }
  return productCache;
}

export function getProductSummaries(): ProductSummary[] {
  return getProducts().map((product) => ({
    id: product.id,
    brand: product.brand,
    brandSlug: product.brandSlug,
    slug: product.slug,
    href: product.href,
    name: product.name,
    category: product.category,
    description: product.description,
    image: product.image,
    labels: product.labels,
    packageSizes: product.packageSizes,
  }));
}

export function getProduct(brandSlug: string, slug: string) {
  return getProducts().find((product) => product.brandSlug === brandSlug && product.slug === slug);
}
