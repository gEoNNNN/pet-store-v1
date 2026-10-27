import "server-only";

import { existsSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { veterinaryCategoryNames } from "@/data/products";
import type { ProductBrand, ProductBrandSlug } from "@/data/products";
import { slugifyName } from "@/lib/slugify";

type JsonObject = Record<string, unknown>;

/**
 * Panoul de administrare citește și scrie direct fișierele JSON din folderul
 * scrape — aceleași fișiere citite de productCatalog.server.ts la randarea
 * paginilor publice.
 */

export type AdminProductRow = {
  brandSlug: ProductBrandSlug;
  brand: ProductBrand;
  id: string;
  slug: string;
  name: string;
  category: string;
  image: string;
  description: string;
};

export type BrandConfig = {
  brandSlug: ProductBrandSlug;
  brand: ProductBrand;
  fileName: string;
  /** necesar când un fișier JSON servește mai multe mărci (ekoprom) */
  subBrandSlug?: string;
};

const EKOPROM_FILE = "ekoprom_products.json";

/** Marca -> fișierul JSON din care provin produsele. */
export const brandConfigs: BrandConfig[] = [
  { brandSlug: "brit", brand: "Brit", fileName: "products.json" },
  { brandSlug: "carnilove", brand: "Carnilove", fileName: "carnilove_products.json" },
  { brandSlug: "natura", brand: "Natura", fileName: "natura_products.json" },
  { brandSlug: "eco-natura", brand: "Eco Natura Pet", fileName: "econatura_products.json" },
  {
    brandSlug: "neoterica-inspector",
    brand: "Neoterica Inspector",
    fileName: EKOPROM_FILE,
    subBrandSlug: "",
  },
  {
    brandSlug: "neoterica-insektal",
    brand: "Neoterica Insektal",
    fileName: EKOPROM_FILE,
    subBrandSlug: "neoterica-insektal",
  },
  {
    brandSlug: "neoterica-gelmintal",
    brand: "Neoterica Gelmintal",
    fileName: EKOPROM_FILE,
    subBrandSlug: "neoterica-gelmintal",
  },
  {
    brandSlug: "neoterica-unitabs",
    brand: "Neoterica Unitabs",
    fileName: EKOPROM_FILE,
    subBrandSlug: "neoterica-unitabs",
  },
  {
    brandSlug: "neoterica-rolfclub-3d",
    brand: "Neoterica RolfClub 3D",
    fileName: EKOPROM_FILE,
    subBrandSlug: "neoterica-rolfclub-3d",
  },
  {
    brandSlug: "chistotel",
    brand: "Chistotel",
    fileName: EKOPROM_FILE,
    subBrandSlug: "chistotel",
  },
];

const brandConfigBySlug = new Map(brandConfigs.map((config) => [config.brandSlug, config]));

/** Categoriile oferite în formulare (animale + categorii veterinare). */
export function categoryOptions(): string[] {
  return [
    "Câini",
    "Pisici",
    "Rozătoare",
    "Păsări",
    ...veterinaryCategoryNames,
  ];
}

function isRecord(value: unknown): value is JsonObject {
  return typeof value === "object" && value !== null;
}

function getScrapeDirectory(): string {
  const candidates = [
    path.resolve(process.cwd(), "scrape"),
    path.resolve(process.cwd(), "..", "scrape"),
  ];
  const found = candidates.find((candidate) =>
    existsSync(path.join(candidate, "products.json")),
  );
  if (!found) {
    throw new Error("Folderul scrape cu cataloagele JSON nu a fost găsit.");
  }
  return found;
}

function readRawCatalog(fileName: string): {
  file: string;
  data: JsonObject;
  products: JsonObject[];
} {
  const file = path.join(getScrapeDirectory(), fileName);
  const parsed: unknown = JSON.parse(readFileSync(file, "utf8"));
  if (!isRecord(parsed) || !Array.isArray(parsed.products)) {
    throw new Error(`Format invalid pentru ${fileName}`);
  }
  const data = parsed;
  const products = (data.products as unknown[]).filter(isRecord);
  return { file, data, products };
}

function matchesBrand(config: BrandConfig, raw: JsonObject): boolean {
  if (config.fileName !== EKOPROM_FILE) return true;
  if (!config.subBrandSlug) return !raw.brand_slug;
  return raw.brand_slug === config.subBrandSlug;
}

function nextId(products: JsonObject[]): string {
  let max = 100000;
  for (const product of products) {
    const numeric = Number.parseInt(String(product.id ?? "").replace(/\D/g, ""), 10);
    if (Number.isFinite(numeric) && numeric > max) max = numeric;
  }
  return String(max + Math.floor(Math.random() * 900) + 100);
}

/** Numărul de produse pe fiecare marcă, pentru dashboard. */
export function catalogOverview(): Array<{
  brandSlug: ProductBrandSlug;
  brand: ProductBrand;
  count: number;
  fileName: string;
}> {
  return brandConfigs.map((config) => {
    const { products } = readRawCatalog(config.fileName);
    const count = products.filter((product) => matchesBrand(config, product)).length;
    return { brandSlug: config.brandSlug, brand: config.brand, count, fileName: config.fileName };
  });
}

/** Toate produsele din toate cataloagele, pentru tabela din administrare. */
export function listAllProducts(): AdminProductRow[] {
  const rows: AdminProductRow[] = [];
  for (const config of brandConfigs) {
    const { products } = readRawCatalog(config.fileName);
    for (const product of products) {
      if (!matchesBrand(config, product)) continue;
      const slug = String(product.slug ?? "").trim();
      const name = String(product.name ?? "").trim();
      if (!slug || !name) continue;
      rows.push({
        brandSlug: config.brandSlug,
        brand: config.brand,
        id: String(product.id ?? slug),
        slug,
        name,
        category: String(product.category ?? "").trim(),
        image: String(product.image ?? "").trim(),
        description: String(product.description ?? "").trim(),
      });
    }
  }
  return rows.sort((a, b) => a.name.localeCompare(b.name, "ro"));
}

/** Detaliile unui produs, pentru formularul de editare. */
export function findProduct(
  brandSlug: string,
  slug: string,
): { config: BrandConfig; raw: JsonObject; file: string } | null {
  const config = brandConfigBySlug.get(brandSlug as ProductBrandSlug);
  if (!config) return null;
  const { file, products } = readRawCatalog(config.fileName);
  const raw = products.find(
    (product) => String(product.slug ?? "") === slug && matchesBrand(config, product),
  );
  if (!raw) return null;
  return { config, raw, file };
}

export type ProductInput = {
  brandSlug: string;
  id?: string;
  name: string;
  slug: string;
  category: string;
  description: string;
  image: string;
  labels: string[];
  packageSizes: string[];
  sourceUrl: string;
};

function toList(raw: FormDataEntryValue | null): string[] {
  return String(raw ?? "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

/**
 * Adaugă sau modifică un produs în catalogul mărcii selectate.
 * Întoarce un mesaj de eroare sau null dacă operația a reușit.
 */
export function upsertProduct(input: ProductInput, isEdit: boolean): string | null {
  const config = brandConfigBySlug.get(input.brandSlug as ProductBrandSlug);
  if (!config) return "Marca selectată nu este suportată.";
  const name = input.name.trim();
  const slug = input.slug.trim();
  const image = input.image.trim();
  const category = input.category.trim();
  if (!name) return "Numele produsului este obligatoriu.";
  if (!slug) return "Slug-ul produsului este obligatoriu.";
  if (!image) return "Imaginea produsului este obligatorie.";
  if (!category) return "Alege categoria produsului.";

  const { file, data, products } = readRawCatalog(config.fileName);

  if (isEdit) {
    const index = products.findIndex(
      (product) => String(product.slug ?? "") === slug && matchesBrand(config, product),
    );
    if (index < 0) return "Produsul căutat nu mai există în catalog.";
    const existing = products[index];
    existing.name = name;
    existing.category = category;
    existing.description = input.description.trim();
    existing.image = image;
    existing.labels = input.labels;
    existing.package_sizes = input.packageSizes;
    existing.variants = input.packageSizes;
    existing.url = input.sourceUrl;
  } else {
    if (products.some((product) => String(product.slug ?? "") === slug)) {
      return "Există deja un produs cu acest slug. Alege altul.";
    }
    const fresh: JsonObject = {
      id: input.id?.trim() || nextId(products),
      name,
      slug,
      category,
      description: input.description.trim(),
      image,
      labels: input.labels,
      features: [],
      benefits: [],
      package_sizes: input.packageSizes,
      variants: input.packageSizes,
      url: input.sourceUrl,
      images: [{ url: image, alt: name, role: "main" }],
      breadcrumbs: [category, name],
      product_type: "",
    };
    if (config.fileName === EKOPROM_FILE) {
      fresh.brand_slug = config.subBrandSlug ?? "";
    }
    products.push(fresh);
  }

  data.products = products;
  if (typeof data.product_count === "number") {
    data.product_count = products.length;
  }

  writeFileSync(file, `${JSON.stringify(data, null, 2)}\n`, "utf8");
  return null;
}

/** Șterge un produs din catalogul mărcii. Întoarce mesaj de eroare sau null. */
export function deleteProduct(brandSlug: string, slug: string): string | null {
  const config = brandConfigBySlug.get(brandSlug as ProductBrandSlug);
  if (!config) return "Marca nu este suportată.";
  const { file, data, products } = readRawCatalog(config.fileName);
  const next = products.filter(
    (product) => !(String(product.slug ?? "") === slug && matchesBrand(config, product)),
  );
  if (next.length === products.length) return "Produsul nu a fost găsit în catalog.";
  data.products = next;
  if (typeof data.product_count === "number") {
    data.product_count = next.length;
  }
  writeFileSync(file, `${JSON.stringify(data, null, 2)}\n`, "utf8");
  return null;
}

/** Citește datele unui formular și le validează strctural înainte de salvare. */
export function parseProductForm(formData: FormData): ProductInput {
  return {
    brandSlug: String(formData.get("brandSlug") ?? "").trim(),
    id: String(formData.get("id") ?? "").trim() || undefined,
    name: String(formData.get("name") ?? ""),
    slug: String(formData.get("slug") ?? "").trim(),
    category: String(formData.get("category") ?? "").trim(),
    description: String(formData.get("description") ?? ""),
    image: String(formData.get("image") ?? ""),
    labels: toList(formData.get("labels")),
    packageSizes: toList(formData.get("packageSizes")),
    sourceUrl: String(formData.get("sourceUrl") ?? "").trim(),
  };
}
