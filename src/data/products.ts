export const petCategoryNames = ["Toate", "Câini", "Pisici", "Rozătoare", "Păsări"] as const;

export const veterinaryCategoryNames = [
  "Antibacteriene și antifungice",
  "Antiparazitare interne și externe",
  "Antiinflamatoare și analgezice",
  "Antiseptice și produse pentru îngrijirea rănilor",
  "Tonice și produse pentru rehidratare",
  "Produse pentru reproducție și sănătatea glandei mamare",
  "Vaccinuri și alte produse biologice",
  "Imunostimulatoare",
  "Vitamine, minerale și premixuri",
  "Curățare, igienă și dezinfecție",
  "Dezinsecție și deratizare",
] as const;

export const productCategoryNames = [
  ...petCategoryNames,
  ...veterinaryCategoryNames,
] as const;

// Grupe de filtre dupa tipul produsului (product_type / labels din cataloage)
export const productTypeFilterGroups = [
  {
    title: "Hrană & Recompense",
    items: [
      "Hrană uscată câini",
      "Hrană uscată pisici",
      "Plicuri câini",
      "Plicuri pisici",
      "Conserve câini",
      "Conserve pisici",
      "Recompense câini",
      "Recompense pisici",
    ],
  },
  {
    title: "Accesorii & Plimbare",
    items: [
      "Zgărzi pentru câini",
      "Zgărzi pentru pisici",
      "Hamuri pentru câini",
      "Hamuri pentru pisici",
      "Lese pentru câini",
      "Paturi și culușuri",
      "Castroane și boluri",
      "Accesorii din plastic",
      "Jucării pentru pisici",
      "Cuști de transport",
      "Târcuri și parcuri de joacă",
      "Așternut pentru rozătoare",
    ],
  },
  {
    title: "Igienă & Îngrijire",
    items: [
      "Perii, piepteni și îngrijirea blănii",
      "Cosmetice și îngrijire",
      "Nisip pentru pisici",
      "Litieră și accesorii",
      "Îngrijire și igienă",
    ],
  },
] as const;

export const productBrandNames = [
  "Toate",
  "Brit",
  "Carnilove",
  "Neoterica Inspector",
  "Neoterica Insektal",
  "Neoterica Gelmintal",
  "Neoterica Unitabs",
  "Neoterica RolfClub 3D",
  "Chistotel",
  "Natura",
  "Eco Natura Pet",
] as const;

export type ProductCategoryName = (typeof productCategoryNames)[number];
export type ProductBrandName = (typeof productBrandNames)[number];
export type ProductCategory = Exclude<ProductCategoryName, "Toate">;
export type ProductBrand = Exclude<ProductBrandName, "Toate">;
export type ProductBrandSlug =
  | "brit"
  | "carnilove"
  | "neoterica-inspector"
  | "neoterica-insektal"
  | "neoterica-gelmintal"
  | "neoterica-unitabs"
  | "neoterica-rolfclub-3d"
  | "chistotel"
  | "natura"
  | "eco-natura";

export type ProductImage = {
  url: string;
  alt: string;
  role: string;
};

export type ProductSection = {
  title: string;
  text: string;
  tables: string[][][];
};

export type FreshIngredient = {
  name: string | null;
  description: string;
  image: string | null;
};

export type ProductSummary = {
  id: string;
  brand: ProductBrand;
  brandSlug: ProductBrandSlug;
  slug: string;
  href: string;
  name: string;
  category: ProductCategory;
  description: string;
  image: string;
  labels: string[];
  packageSizes: string[];
  productType: string | null;
  /** documentul Word descărcabil (ex. /prospecte/prospect-insektal.docx) */
  prospect: string | null;
};

export type Product = ProductSummary & {
  sourceUrl: string;
  productType: string | null;
  breadcrumbs: string[];
  features: string[];
  ingredientTags: string[];
  images: ProductImage[];
  videos: string[];
  sections: ProductSection[];
  freshIngredients: FreshIngredient[];
  metabolizableEnergy: string | null;
  rawText: string;
};
