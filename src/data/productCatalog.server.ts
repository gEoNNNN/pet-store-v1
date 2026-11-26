import "server-only";

import { cache } from "react";
import { readCatalogText } from "@/lib/catalogStore";
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

function isObject(value: unknown): value is JsonObject {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function toStringValue(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function toStringArray(value: unknown) {
  return Array.isArray(value) ? value.map(toStringValue).filter(Boolean) : [];
}

async function readCatalog(filename: string) {
  const catalog: unknown = JSON.parse(await readCatalogText(filename));
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

/**
 * Tot catalogul normalizat. `cache` de la React dedublează citirea în
 * interiorul aceleiași randări; cache-ul de date Next (tag `CATALOG_TAG`) ține
 * textul JSON între cereri, deci nu se re-descarcă la fiecare pagină.
 */
export const getProducts = cache(async (): Promise<Product[]> => {
  const [
    britRaw,
    carniloveRaw,
    naturaRaw,
    ecoNaturaRaw,
    farmavetRaw,
    ekopromRaw,
  ] = await Promise.all([
    readCatalog("products.json"),
    readCatalog("carnilove_products.json"),
    readCatalog("natura_products.json"),
    readCatalog("econatura_products.json"),
    readCatalog("farmavet_products.json"),
    readCatalog("ekoprom_products.json"),
  ]);

  const ekopromBrands: Record<string, [ProductBrand, ProductBrandSlug]> = {
    "neoterica-insektal": ["Neoterica Insektal", "neoterica-insektal"],
    "neoterica-gelmintal": ["Neoterica Gelmintal", "neoterica-gelmintal"],
    "neoterica-unitabs": ["Neoterica Unitabs", "neoterica-unitabs"],
    "neoterica-rolfclub-3d": ["Neoterica RolfClub 3D", "neoterica-rolfclub-3d"],
    "chistotel": ["Chistotel", "chistotel"],
  };

  return [
    ...britRaw.map((product) => normalizeProduct(product, "Brit", "brit")),
    ...carniloveRaw.map((product) => normalizeProduct(product, "Carnilove", "carnilove")),
    ...ekopromRaw.map((product) => {
      const [brand, slug] = ekopromBrands[toStringValue(product.brand_slug)] ?? [
        "Neoterica Inspector",
        "neoterica-inspector",
      ] as [ProductBrand, ProductBrandSlug];
      return normalizeProduct(product, brand, slug);
    }),
    ...naturaRaw.map((product) => normalizeProduct(product, "Natura", "natura")),
    ...ecoNaturaRaw.map((product) =>
      normalizeProduct(product, "Eco Natura Pet", "eco-natura"),
    ),
    ...farmavetRaw.map((product) =>
      normalizeProduct(
        product,
        "Farmavet",
        "farmavet",
        farmavetManufacturers[toStringValue(product.brand_slug)] ?? "Farmavet",
      ),
    ),
  ].filter((product) => product.slug && product.name && product.image);
});

export async function getProductSummaries(): Promise<ProductSummary[]> {
  return (await getProducts()).map((product) => ({
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
    manufacturer: product.manufacturer,
    prospect: product.prospect,
  }));
}

export async function getProduct(brandSlug: string, slug: string) {
  return (await getProducts()).find(
    (product) => product.brandSlug === brandSlug && product.slug === slug,
  );
}
