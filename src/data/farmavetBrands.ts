/**
 * Producătorul real extras din prospectul „SAIT FARMAVET 2026" (câmpul
 * `brand_slug` din scrape/farmavet_products.json). NU sunt mărci de filtrare:
 * în magazin produsele rămân marca „Farmavet", iar aici apar ca rândul
 * „Producător" în pagina produsului.
 */
export const farmavetManufacturers: Record<string, string> = {
  farmavet: "Farmavet",
  olkar: "O.L.KAR",
  "hebei-vezong": "Hebei Vezong",
  biofarm: "Biofarm",
  vetsintez: "Vetsintez",
  aveflor: "Aveflor",
  bavet: "BAVET",
  msd: "MSD Animal Health",
  vanellivet: "Vanellivet",
  ruvera: "RUVERA",
  "veyx-pharma": "Veyx-Pharma",
  "cid-lines": "CID Lines",
  "shandong-luxi": "Shandong Luxi",
  "icb-pharma": "ICB Pharma",
  "fgbu-stavropol": "FGBU Stavropol",
  "biofabrica-armavir": "Biofabrica Armavir",
  vniivvim: "VNIIVViM",
  "promark-trade": "Promark Trade",
  tecro: "Tecro",
  marel: "Marel",
  bioceval: "Bioceval",
  vitafor: "Vitafor",
};
