export type SectionOverlay = {
  title?: string;
  text?: string;
  tables?: string[][][];
};

export type ProductOverlay = {
  name?: string;
  description?: string;
  labels?: string[];
  packageSizes?: string[];
  productType?: string;
  features?: string[];
  ingredientTags?: string[];
  rawText?: string;
  sections?: SectionOverlay[];
  freshIngredients?: Array<{ name?: string; description?: string }>;
};

export type CatalogOverlay = Record<string, ProductOverlay>;

const loaderCache = new Map<string, Promise<CatalogOverlay>>();

/** Încarcă (și memorează) suprapunerea tradusă pentru o limbă. */
export function loadCatalog(locale: string): Promise<CatalogOverlay> {
  let promise = loaderCache.get(locale);
  if (!promise) {
    promise = fetch(`/i18n/products.${locale}.json`)
      .then((response) => {
        if (!response.ok) throw new Error(`Catalog ${locale}: HTTP ${response.status}`);
        return response.json() as Promise<CatalogOverlay>;
      })
      .catch((error) => {
        loaderCache.delete(locale);
        throw error;
      });
    loaderCache.set(locale, promise);
  }
  return promise;
}

type Overlayable = {
  id: string;
  name: string;
  description: string;
  labels: string[];
  packageSizes: string[];
  productType: string | null;
  // câmpuri prezente doar pe Product (detail)
  features?: string[];
  ingredientTags?: string[];
  rawText?: string;
  sections?: Array<{ title: string; text: string; tables: string[][][] }>;
  freshIngredients?: Array<{ name: string | null; description: string; image: string | null }>;
};

const sameLength = (base: unknown[], tr: unknown): tr is string[] =>
  Array.isArray(tr) && tr.length === base.length;

/**
 * Aplică traducerea peste produsul original (român). Campurile care nu pot fi
 * aliniate sigur (lista cu altă lungime) rămân în română — nu stric niciodată
 * datele, doar le îmbunătățesc.
 */
export function applyOverlay<T extends Overlayable>(product: T, overlay?: ProductOverlay): T {
  if (!overlay) return product;
  const merged: T = { ...product };

  if (overlay.name) merged.name = overlay.name;
  if (overlay.description) merged.description = overlay.description;
  if (overlay.productType) merged.productType = overlay.productType;
  if (overlay.rawText && typeof merged.rawText === "string") merged.rawText = overlay.rawText;
  if (sameLength(merged.labels, overlay.labels)) merged.labels = overlay.labels;
  if (sameLength(merged.packageSizes, overlay.packageSizes)) merged.packageSizes = overlay.packageSizes;

  if (merged.features && sameLength(merged.features, overlay.features)) merged.features = overlay.features;
  if (merged.ingredientTags && sameLength(merged.ingredientTags, overlay.ingredientTags)) {
    merged.ingredientTags = overlay.ingredientTags;
  }

  if (merged.sections && Array.isArray(overlay.sections) && overlay.sections.length === merged.sections.length) {
    merged.sections = merged.sections.map((section, index) => {
      const tr = overlay.sections?.[index] ?? {};
      return {
        title: tr.title || section.title,
        text: tr.text || section.text,
        tables:
          Array.isArray(tr.tables) && tr.tables.length === section.tables.length
            ? tr.tables.map((table, ti) =>
                Array.isArray(table) && table.length === (section.tables[ti]?.length ?? 0)
                  ? table
                  : section.tables[ti],
              )
            : section.tables,
      };
    });
  }

  if (
    merged.freshIngredients &&
    Array.isArray(overlay.freshIngredients) &&
    overlay.freshIngredients.length === merged.freshIngredients.length
  ) {
    merged.freshIngredients = merged.freshIngredients.map((ingredient, index) => {
      const tr = overlay.freshIngredients?.[index] ?? {};
      return {
        ...ingredient,
        name: tr.name ? tr.name : ingredient.name,
        description: tr.description || ingredient.description,
      };
    });
  }

  return merged;
}
