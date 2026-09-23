export const petCategoryNames = ["Toate", "Câini", "Pisici", "Rozătoare"] as const;

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

export const productBrandNames = ["Toate", "Brit", "Carnilove"] as const;

export type ProductCategoryName = (typeof productCategoryNames)[number];
export type ProductBrandName = (typeof productBrandNames)[number];
export type ProductCategory = Exclude<ProductCategoryName, "Toate">;
export type ProductBrand = Exclude<ProductBrandName, "Toate">;
export type ProductBrandSlug = "brit" | "carnilove";

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
