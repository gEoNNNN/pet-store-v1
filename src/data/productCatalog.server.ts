import "server-only";

import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { farmavetManufacturers } from "./farmavetBrands";
import { veterinaryCategoryNames } from "./products";
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
    path.resolve(process.cwd(), "scrape"),
    path.resolve(process.cwd(), "..", "scrape"),
    path.resolve(__dirname, "..", "..", "..", "scrape"),
    path.resolve(__dirname, "..", "..", "..", "..", "scrape"),
    path.resolve(process.cwd(), "public", "scrape"),
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
  const vetCategory = veterinaryCategoryNames.find(
    (item) => item.toLowerCase() === category,
  );
  if (vetCategory) return vetCategory;
  if (category === "cats" || category === "pisici") return "Pisici";
  if (category === "rodents" || category === "rozătoare") return "Rozătoare";
  if (category === "poultry" || category === "păsări") return "Păsări";
  if (category === "dogs" || category === "câini") return "Câini";
  if (category === "bovine") return "Bovine";
  if (category === "ovine") return "Ovine";
  if (category === "porcine") return "Porcine";
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
    return [{ title, text, tables }];
  });
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

function normalizeProduct(
  raw: JsonObject,
  brand: ProductBrand,
  brandSlug: ProductBrandSlug,
  manufacturer?: string | null,
): Product {
  const slug = toStringValue(raw.slug);
  const name = toStringValue(raw.name);
  const rawId = toStringValue(raw.id) || slug;
  const image = toStringValue(raw.image);
  const description = toStringValue(raw.description) || toStringValue(raw.raw_text);
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
    manufacturer: manufacturer ?? null,
    breadcrumbs: toStringArray(raw.breadcrumbs),
    features: toStringArray(isBrit ? raw.benefits : raw.features),
    ingredientTags: toStringArray(raw.ingredient_tags),
    images: normalizeImages(raw.images),
    videos: toStringArray(raw.videos),
    sections: normalizeSections(raw.sections),
    freshIngredients: normalizeFreshIngredients(raw.fresh_ingredients),
    metabolizableEnergy: toStringValue(raw.metabolizable_energy) || null,
    rawText: toStringValue(raw.raw_text),
    prospect: toStringValue(raw.prospect) || null,
  };
}

export function getProducts(): Product[] {
  if (!productCache) {
    const britProducts = readCatalog("products.json").map((product) =>
      normalizeProduct(product, "Brit", "brit"),
    );    const carniloveProducts = readCatalog("carnilove_products.json").map((product) =>
      normalizeProduct(product, "Carnilove", "carnilove"),
    );
    const ekopromBrands: Record<string, [ProductBrand, ProductBrandSlug]> = {
      "neoterica-insektal": ["Neoterica Insektal", "neoterica-insektal"],
      "neoterica-gelmintal": ["Neoterica Gelmintal", "neoterica-gelmintal"],
      "neoterica-unitabs": ["Neoterica Unitabs", "neoterica-unitabs"],
      "neoterica-rolfclub-3d": ["Neoterica RolfClub 3D", "neoterica-rolfclub-3d"],
      "chistotel": ["Chistotel", "chistotel"],
    };
    const naturaProducts = readCatalog("natura_products.json").map((product) =>
      normalizeProduct(product, "Natura", "natura"),
    );
    const ecoNaturaProducts = readCatalog("econatura_products.json").map((product) =>
      normalizeProduct(product, "Eco Natura Pet", "eco-natura"),
    );
    const farmavetProducts = readCatalog("farmavet_products.json").map((product) =>
      normalizeProduct(
        product,
        "Farmavet",
        "farmavet",
        farmavetManufacturers[toStringValue(product.brand_slug)] ?? "Farmavet",
      ),
    );
    const ekopromProducts = readCatalog("ekoprom_products.json").map((product) => {
      const [brand, slug] = ekopromBrands[toStringValue(product.brand_slug)] ?? [
        "Neoterica Inspector",
        "neoterica-inspector",
      ] as [ProductBrand, ProductBrandSlug];
      return normalizeProduct(product, brand, slug);
    });
    productCache = [
      ...britProducts,
      ...carniloveProducts,
      ...ekopromProducts,
      ...naturaProducts,
      ...ecoNaturaProducts,
      ...farmavetProducts,
    ].filter(
      (product) => product.slug && product.name && product.image,
    );
  }
  return productCache;
}

/**
 * Resetează cache-ul de module al catalogului, ca scrierile din panoul de
 * administrare să ajungă imediat în paginile publice.
 */
export function invalidateProductCache(): void {
  productCache = undefined;
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
    productType: product.productType,
    prospect: product.prospect,
  }));
}

export function getProduct(brandSlug: string, slug: string) {
  return getProducts().find((product) => product.brandSlug === brandSlug && product.slug === slug);
}
