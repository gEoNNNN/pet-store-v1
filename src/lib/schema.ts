import { absoluteUrl, site } from "./site";
import type { Product } from "@/data/products";

type SchemaObject = Record<string, unknown>;

/**
 * Graful principal de entități, injectat în <html> din layout:
 * farmacia veterinară (LocalBusiness/VeterinaryCare) + WebSite cu SearchAction,
 * legate între ele prin @id pentru consolidarea entității în Google și motoarele AI.
 */
export function siteGraph(): SchemaObject {
  const businessId = `${site.url}/#veterinarycare`;
  const websiteId = `${site.url}/#website`;

  const veterinaryCare: SchemaObject = {
    "@type": "VeterinaryCare",
    "@id": businessId,
    name: site.legalName,
    alternateName: site.name,
    description: site.description,
    url: `${site.url}/`,
    telephone: site.contact.phones.pharmacy.tel,
    email: site.contact.email,
    address: {
      "@type": "PostalAddress",
      streetAddress: site.contact.streetAddress,
      addressLocality: site.contact.addressLocality,
      addressCountry: site.contact.addressCountry,
    },
    openingHoursSpecification: {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
      opens: "09:00",
      closes: "19:00",
    },
    hasMap: site.social.googleMaps,
    sameAs: [site.social.facebook, site.social.instagram],
    areaServed: { "@type": "Country", name: "Moldova" },
    contactPoint: [
      {
        "@type": "ContactPoint",
        telephone: site.contact.phones.pharmacy.tel,
        email: site.contact.email,
        contactType: "customer service",
        availableLanguage: ["Romanian", "Russian", "English"],
      },
      {
        "@type": "ContactPoint",
        telephone: site.contact.phones.warehouse.tel,
        contactType: "sales",
        availableLanguage: ["Romanian", "Russian", "English"],
      },
    ],
    knowsLanguage: site.inLanguage,
  };

  const website: SchemaObject = {
    "@type": "WebSite",
    "@id": websiteId,
    url: `${site.url}/`,
    name: site.name,
    description: site.description,
    inLanguage: site.inLanguage,
    publisher: { "@id": businessId },
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${site.url}/produse?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };

  return {
    "@context": "https://schema.org",
    "@graph": [veterinaryCare, website],
  };
}

/** BreadcrumbList pentru ierarhia Home → Produse → brand → produs. */
export function productBreadcrumbs(product: Product): SchemaObject {
  const items: SchemaObject[] = [
    { "@type": "ListItem", position: 1, name: "Acasă", item: `${site.url}/` },
    { "@type": "ListItem", position: 2, name: "Produse", item: `${site.url}/produse` },
    // Nu există pagină separată per brand (brandul e doar filtru pe /produse),
    // deci nu creăm nivel interimar cu URL inexistent în structură.
  ];
  items.push({
    "@type": "ListItem",
    position: items.length + 1,
    name: product.name,
    item: absoluteUrl(product.href),
  });

  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items,
  };
}

/**
 * Schema Product pentru paginile din catalog.
 * Site-ul este de prezentare (catalog, fără prețuri), deci nu inventăm `offers`:
 * un Product fără preț este valid și util pentru Google Shopping/Merchant
 * doar dacă există oferte reale — aici marcăm explicit statusul catalog.
 */
export function productSchema(product: Product): SchemaObject {
  const images = Array.from(
    new Set([product.image, ...product.images.map((image) => image.url)].filter(Boolean)),
  ).map((image) => absoluteUrl(image));

  const schema: SchemaObject = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description.slice(0, 500),
    image: images.length > 0 ? images : undefined,
    url: absoluteUrl(product.href),
    category: product.category,
    brand: {
      "@type": "Brand",
      name: product.brand,
    },
    sku: product.slug,
  };

  if (product.manufacturer && product.manufacturer !== product.brand) {
    schema.manufacturer = { "@type": "Organization", name: product.manufacturer };
  }

  return schema;
}

/** BreadcrumbList generic dintr-un traseu (Acasă → secțiuni → pagină curentă). */
export function breadcrumbSchema(trail: { name: string; url: string }[]): SchemaObject {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: trail.map((crumb, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: crumb.name,
      item: crumb.url,
    })),
  };
}

/** Pagina de catalog /produse: CollectionPage legată de WebSite + BreadcrumbList. */
export function collectionSchema(products: { href: string; name: string }[]): SchemaObject {
  const collectionUrl = `${site.url}/produse`;
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        "@id": `${collectionUrl}#collection`,
        url: collectionUrl,
        name: "Catalog produse veterinare și hrană pentru animale",
        description:
          "Catalog complet: medicamente veterinare, antiparazitare, vitamine, suplimente, hrană Brit și Carnilove, accesorii pentru câini, pisici și animale de fermă.",
        isPartOf: { "@id": `${site.url}/#website` },
        breadcrumb: { "@id": `${collectionUrl}#breadcrumb` },
      },
      {
        ...breadcrumbSchema([
          { name: "Acasă", url: `${site.url}/` },
          { name: "Produse", url: collectionUrl },
        ]),
        "@id": `${collectionUrl}#breadcrumb`,
      },
      {
        "@type": "ItemList",
        "@id": `${collectionUrl}#list`,
        numberOfItems: products.length,
        itemListElement: products.map((product, index) => ({
          "@type": "ListItem",
          position: index + 1,
          url: absoluteUrl(product.href),
          name: product.name,
        })),
      },
    ],
  };
}

/** BreadcrumbList pentru paginile de instrumente. */
export function toolBreadcrumbs(title: string, path: string): SchemaObject {
  return breadcrumbSchema([
    { name: "Acasă", url: `${site.url}/` },
    { name: "Instrumente", url: `${site.url}/instrumente` },
    { name: title, url: absoluteUrl(path) },
  ]);
}
