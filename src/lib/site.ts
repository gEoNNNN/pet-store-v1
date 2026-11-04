/**
 * Configurația centrală a site-ului Farmavet.
 * Folosită de metadata (layout, sitemap, robots, manifest) și de generatoarele JSON-LD.
 */

/** URL-ul de producție. Poate fi suprascris cu NEXT_PUBLIC_SITE_URL în mediul de build. */
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.farmavet.md";

export const site = {
  name: "Farmavet",
  legalName: "S.A. Farmavet",
  tagline: "Produse veterinare și sănătate animală",
  description:
    "Farmavet oferă produse veterinare, hrană pentru câini, pisici și animale de fermă, antiparazitare, vitamine și consultanță profesională în Chișinău, Moldova.",
  url: SITE_URL.replace(/\/$/, ""),
  // Localizare pentru Open Graph: limba română în Republica Moldova.
  ogLocale: "ro_MD",
  ogLocales: ["ro_RO", "ru_RU", "en_US"],
  inLanguage: ["ro", "ru", "en"],
  contact: {
    streetAddress: "Strada Petricani 198",
    addressLocality: "Chișinău",
    addressCountry: "MD",
    phone: "+37379536508",
    email: "farmavet.mariana@yahoo.com",
    // Luni – Sâmbătă: 9:00 – 19:00 (conform dicționarului i18n și Google Maps).
    openingHours: "Mo-Sa 09:00-19:00",
  },
  social: {
    facebook: "https://www.facebook.com/farmavet.md/",
    instagram: "https://www.instagram.com/farmavet_moldova/",
    googleMaps: "https://maps.app.goo.gl/zbrmi44MwjviSwvc6",
  },
  colors: {
    primary: "#0b3563",
    primaryDark: "#07284b",
    secondary: "#1d67a5",
    accent: "#2f8b61",
    beige: "#d9e5de",
  },
} as const;

/** Construiește un URL absolut pornind de la o cale relativă de pe site. */
export function absoluteUrl(path: string): string {
  return new URL(path, `${site.url}/`).href;
}
