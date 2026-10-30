/**
 * Pasul 7: imagini verificate manual din rezultatele Bing (batch 1-3).
 * Fiecare slug are o singură poză confirmată ca produsul nostru (ambalaj/corect).
 * Produsele cu rezultate ambiguale (premixuri alte branduri, Analgin generic etc.)
 * rămân cu poza de specie, ca să nu afișăm ambalaje greșite.
 *
 * Rulare:  node scripts/farmavet-images7.mjs
 */
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";

const root = process.cwd();
const catalogFile = path.join(root, "scrape/farmavet_products.json");
const imagesDir = path.join(root, "public", "products", "farmavet");
mkdirSync(imagesDir, { recursive: true });

const UA = { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0", "Accept-Language": "en" };
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const MAN = {
  "colivetoprim-pulbere-hidrosolubila": "https://vet.md/img/products/1595-colivetroprim.jpg",
  "metronidazol-25-pulbere": "https://images.prom.ua/4928933033_w640_h640_metronidazol-olkar-25.jpg",
  "bromodox-solutie-injectabila": "https://vetsintez.com/image/cache/catalog/product/antibiotic/bromodox/bromodox%28en%29-500x500.jpg",
  "aloegel-gel-cu-aloe-vera-si-castan": "https://pakavs.lv/Uploads/2020/06/23/21/aloegel-nauji-lt-500x500.1.jpg",
  "adtab-tablete-antiparazitare-pentru-pisici": "https://static.miscota.com/media/1/photos/products/510691/adtab-gato-all-2-png-6467dedbea7d4.jpg",
  "ba-tick-solutie-ectoparaziticida-pour-on": "https://www.bavet.com.tr/en/wp-content/uploads/2023/05/Ba-tick-Dokme-Cozelti-1024x1024.jpg",
  "bravecto-tablete-masticabile-pentru-ciini": "https://gomagcdn.ro/domains2/cleos-vet.ro/files/product/large/bravecto-tablete-masticabile-pentru-caini-10-20-kg-500-mg-157087.webp",
  "bravecto-suspensie-injectabila-pentru-ciini": "https://www.msd-animal-health-hub.co.uk/sites/default/files/styles/colorbox_large/public/content/image/pack_shot_bravecto_injectable_angle_300dpi_1004x.jpg?itok=29pnjNVh",
  "bravecto-solutie-spot-on-pentru-pisici": "https://www.bravecto.nz/wp-content/uploads/sites/140/2023/08/Bravecto-cat-spot-on-medium-500.png",
  "fenbendazol-granulat": "https://vet.md/img/products/123-Fenbendazol%2022%2C2%20granule%2050gr.JPG",
  "killer-muh-500-insecticid-microencapsulat-contra-mustelor": "https://images.prom.ua/2827866719_w640_h640_killer-muh-10g.jpg",
  "asd-fractia-2-solutie-imunostimulanta": "https://ir.ozone.ru/s3/multimedia-8/c1000/6818509880.jpg",
  "diazinon-60-insecto-acaricid-emulsionabil": "https://mypetneeds-eg.com/wp-content/uploads/2026/02/1770999117747-600x822.png",
  "xeralxon-pulbere-antimicrobiana-de-uz-extern": "https://www.zoofarm.md/image/cache/catalog/Xeralxon-pulbere-80gr-600x650-270x270.jpg",
  "kenocox-solutie-contra-coccidiozei-si-cryptosporidiozei": "https://www.multivern.com/cdn/shop/files/KenoCox-10-liter-desinfeksjonsmiddel.png?v=1748513907",
  "dm-cid-s-solutie-spumanta-alcalina-de-curatare-si-dezinfectie": "https://www.groveko.nl/media/catalog/product/cache/87ab2bcc435a01936ffd4ecf8bc334bd/f/o/fo655_dm_cid-s.jpg",
  "tormax-s-solutie-acida-spumogena-de-curatare": "https://promvetservis.by/wp-content/uploads/2022/01/tornax-s_packshot_24kg-1.jpg",
  "virocid-dezinfectant-concentrat-cu-spectru-larg": "https://agrex.co.uk/wp-content/uploads/2022/02/virocid-400x489-2.jpg",
  "keno-pure-dezinfectant-pentru-mameloane": "https://prd.assets.hycommerce.schippers.cloud/public/product/2809891/cid-lines-kenopure-10-l/df81f576-8b6c-43b7-9cf6-96d99ea53451.jpg",
  "vita-biotic-liquid-probiotic-pentru-pasari": "https://www.vitafor.com/admin/uploads/1744882387_VITA-BIOTIC-LIQUID-1L-%26-5L---CFS.jpg",
  "vita-phoscal-complex-polimineral": "https://www.vitafor.com/admin/uploads/1744882238_VITA-phoscal-1L-%26-5L---CFS-Vitafor.jpg",
  "borogluconat-de-calciu-solutie-injectabila": "https://activmed.ro/2470-large_default/borogluconat-de-calciu-38-x-500ml-fmv.jpg",
  "canvac-r-vaccin-antirabic-pentru-ciini": "https://theveterinarymedicine.com/wp-content/uploads/2021/10/canvac-r-anti-rabies-vaccine-for-dogs-cats-1.jpg",
  "canvac-8-dhppil-vaccin-polivalent-pentru-ciini": "https://dyntec.cz/wp-content/uploads/2022/09/canvac05057.jpeg",
  "vaccin-hemoragic-viral-rhd-pentru-iepuri": "https://www.vetlek.ru/img/shop/items/fs_00001141.jpg",
  "vaccin-ltf-130-contra-tricofitozei-la-bovine": "https://www.vetlek.ru/img/shop/items/fs_00003730.jpg",
  "vaccin-vr-2-contra-rujetului-la-porcine": "https://www.vetlek.ru/img/shop/items/fs_00008731.jpg",
  "calciu-vitaminizat-aromatizat-pulbere": "https://c.cdnmp.net/398989047/p/l/2/calciu-furajer-vitaminizat-6kg~3412.jpg",
  "ferrum-b12-solutie-injectabila": "https://zooexpress.by/pics/items/20230526230557727_ferrum-v12-600x782.jpg",
  "faina-de-peste-vitaminizata": "https://univet-macin.ro/assets/faina-peste-nOHrnNCs.jpg",
  "ecomint-unguent-antiinflamator": "https://suns.lv/wp-content/uploads/2025/04/ecomint-250-g.spm_.47511-h1-700x700.jpeg",
};

function extFor(buf, url) {
  if (buf.length >= 12) {
    if (buf[0] === 0xff && buf[1] === 0xd8) return ".jpg";
    if (buf[0] === 0x89 && buf[1] === 0x50) return ".png";
    if (buf[0] === 0x47 && buf[1] === 0x49) return ".gif";
    if (buf.slice(0, 4).toString() === "RIFF" && buf.slice(8, 12).toString() === "WEBP") return ".webp";
  }
  const m = url.match(/\.(jpe?g|png|webp|gif)(?:$|[?&])/i);
  return m ? `.${m[1].toLowerCase().replace("jpeg", "jpg")}` : ".jpg";
}

const catalog = JSON.parse(readFileSync(catalogFile, "utf8"));
const bySlug = new Map(catalog.products.map((p) => [p.slug, p]));
let done = 0;
const failed = [];
for (const [slug, url] of Object.entries(MAN)) {
  const product = bySlug.get(slug);
  if (!product) { failed.push(`${slug} (nu e în catalog)`); continue; }
  if (!product.image.startsWith("/cards/") && !product.image.startsWith("/hero/") && !product.image.startsWith("/magazin")) { done++; continue; }
  try {
    const res = await fetch(url, { headers: UA, redirect: "follow", signal: AbortSignal.timeout(20000) });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const buf = Buffer.from(await res.arrayBuffer());
    if (buf.length < 6 * 1024 || buf.length > 6 * 1024 * 1024) throw new Error(`dimensiune ${buf.length}`);
    const ext = extFor(buf, url);
    const file = `${slug}${ext}`;
    writeFileSync(path.join(imagesDir, file), buf);
    product.image = `/products/farmavet/${file}`;
    product.sourcePage = product.sourcePage || url;
    if (product.images?.length) product.images[0] = { url: product.image, alt: product.name, role: "main" };
    done++;
    console.log(`✔ ${product.name}`);
  } catch (e) {
    failed.push(`${slug}: ${e.message}`);
    console.log(`✘ ${slug} — ${e.message}`);
  }
  await sleep(250);
}
writeFileSync(catalogFile, JSON.stringify(catalog, null, 2) + "\n");
const real = catalog.products.filter((p) => p.image.startsWith("/products/farmavet/")).length;
console.log(`\nPas 7: ${done} imagini verificate. Total reale: ${real}/${catalog.products.length}`);
if (failed.length) console.log("Eșuate:\n  " + failed.join("\n  "));
