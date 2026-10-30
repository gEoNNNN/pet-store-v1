/**
 * Pasul 8: ultimele 20 produse fără poză reală — candidați culașați prin
 * Bing Images din browser, verificați manual (nume + formă + producător).
 * Rulare:  node scripts/farmavet-images8.mjs
 */
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";

const root = process.cwd();
const catalogFile = path.join(root, "scrape/farmavet_products.json");
const imagesDir = path.join(root, "public", "products", "farmavet");
mkdirSync(imagesDir, { recursive: true });

const UA = { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0", "Accept-Language": "ro,en,ru;q=0.7" };
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// slug → candidați în ordinea preferinței
const PICKS = {
  "tilozina-20-pulbere": [
    "https://labfarma.by/assets/images/catalog/brands/product/tilozin-lf-20.jpg",
    "https://www.zoosite.com.ua/img/drags/1510/f2_1510.jpg",
    "https://images.prom.ua/5868511858_w640_h640_tilokson-poroshok-1kg.jpg",
  ],
  "ceftiofur-suspensie-injectabila": [
    "https://ir.ozone.ru/s3/multimedia-1-8/6990648128.jpg",
    "https://zooexpress.by/pics/items/20241102121146580_czeftibel-100-1.jpg",
    "https://images.prom.ua/6777736373_w640_h640_tseftifur-50-100-ml.jpg",
  ],
  "enrofloxacina-10-solutie-injectabila": [
    "https://5.imimg.com/data5/SELLER/Default/2022/6/ED/NB/PJ/154824436/whatsapp-image-2022-06-23-at-12-20-11-pm-1000x1000.jpeg",
    "https://onlinevetpharmacy.com/wp-content/uploads/2023-08-20230807_185412-scaled.jpg",
    "https://5.imimg.com/data5/SELLER/Default/2025/7/523610745/XM/YG/QX/191859257/enrofloxacin-10-100ml-injection-500x500.jpg",
  ],
  "norflox-10-solutie-orala": [
    "https://web-api.vemedim.vn/vmd-web-mediafile/file/4d4c97e9-9933-4b70-96cb-8261b413bb36?size=720",
    "https://down-ph.img.susercontent.com/file/427ac7d31af1db61b0b5ba8b12bdd8cd",
    "https://mtairaq.com/wp-content/uploads/2024/10/G-norflox-1024x1004.png",
  ],
  "trimicozin-solutie-orala-pentru-pasari": [
    "https://vetmarket.biz.ua/upload/iblock/58e/827_trimikozin_10_ml_biofarm.jpg",
    "https://vetsobakasmith.store/content/images/39/1800x1800l80br40/trymikozyn-r-n-or.-10ml-10-18989670144828.jpg",
  ],
  "bromodox-solutie-injectabila": [
    "https://vetmarket.biz.ua/upload/iblock/b66/389_bromodoks_rastvor_dlya_inektsiy_100_ml_vetsintez.jpg",
    "https://images.prom.ua/7427538545_w640_h640_rastvor-dlya-inektsij.jpg",
    "https://www.vettorg.net/img/pharmacy/fs/fs_1751.jpg",
  ],
  "analghin-50-solutie-injectabila": [
    "https://belvet.ua/images/23/69851786105169_small6.jpg",
    "https://oxymed.uz/storage/resize_cache/500_500_no_crop___/product_images_v2/39_1.png",
    "https://imgs.asna.ru/iblock/5d6/5d60001872fe6a7124413072d1160372/18105e559fe26a4ef15220c7cbc847d2.jpg",
  ],
  "prantal-comprimate-antihelmintice": [
    "https://vet.md/img/products/1624-prantal.jpg",
  ],
  "cypermethrin-10-ec-insecticid-pentru-suprafete": [
    "https://content1.rozetka.com.ua/goods/images/big/665372258.jpg",
    "https://www.sigmaprovadia.com/wp-content/uploads/2020/11/ciper-1024x1024.jpg",
    "https://planimal.ru/wa-data/public/shop/products/33/84/48433/images/48494/48494.970.jpg",
  ],
  "profimast-unguent-igienic-pentru-uger": [
    "https://agroolkar.com.ua/wp-content/uploads/2017-08-14915.jpg",
    "https://pharmavetperu.com/wp-content/uploads/2021/09/b1.png",
  ],
  "bromenghil-solutie-orala-pentru-pasari": [
    "https://vetapteka-litarova.com.ua/wp-content/uploads/2023-10-0000010465.jpeg",
    "https://rooyandarou.com/wp-content/uploads/2019/02/Bromenthol-1.jpg",
  ],
  "biotan-concentrat-de-vitamine-si-minerale": [
    "https://24vet.com.ua/media/thumb/0d/bb/product-Flunidzhekt-in-iektsiyniy-protizapalniy-preparat-100-ml_0dbbbe9e70a8d4e1ca57e65366349b7c.ipthumb800xprop.jpg",
    "https://images.prom.ua/6746954664_w640_h640_6746954664.jpg",
  ],
  "vita-multi-stress-vitamine-aminoacizi": [
    "https://omega-sa.com/wp-content/uploads/2024/02/5.webp",
  ],
  "premix-pui-crestere-1-faza-ii-peste-30-zile": [
    "https://content2.rozetka.com.ua/goods/images/big/637463485.jpg",
    "https://cdn.27.ua/sc--media--prod/default/ad/90/8e/ad908ee1-6115-41c7-9cd9-c7c8b7cba4f7.jpg",
  ],
  "premix-rate-1": [
    "https://s3.timeweb.cloud/152bb5ae-8808470f-2a87-40d5-8ade-f943cb12602b/pvc-6b1c4979-97d9-41e7-a1ef-3db8e1002515/29d2be109fc4b4fccc23a4b91f51cb1054.png",
    "https://ir.ozone.ru/s3/multimedia-1-i/7399219158.jpg",
  ],
  "premix-giste-1": [
    "https://ir.ozone.ru/s3/multimedia-1-i/7399219158.jpg",
    "https://s3.timeweb.cloud/152bb5ae-8808470f-2a87-40d5-8ade-f943cb12602b/pvc-6b1c4979-97d9-41e7-a1ef-3db8e1002515/29d2be109fc4b4fccc23a4b91f51cb1054.png",
  ],
  "premix-prepelite-2": [
    "https://images.prom.ua/6508867936_w640_h640_premiks-dlya-perepelov.jpg",
    "https://dokormy.com.ua/wp-content/uploads/2025/03/premiks-dlya-perepeliv-.png",
  ],
  "premix-purcei-1-0-2-luni": [
    "https://images.prom.ua/5284230029_w640_h640_premiks-porosyata-1.jpg",
    "https://negoreloe.by/images/stories/virtuemart/product/pig1.png",
  ],
  "premix-purcei-1-peste-4-luni": [
    "https://ir-3.ozone.ru/s3/multimedia-d/c1000/6881559889.jpg",
    "https://cdn1.ozone.ru/s3/multimedia-3/c600/6630765519.jpg",
  ],
  "premix-scroafe-gestante": [
    "https://www.techkorm.ru/wp-content/uploads/2024/08/premiks_svinomatki__suporosnye_25.jpg",
    "https://cdn1.ozone.ru/s3/multimedia-6/c600/6870789942.jpg",
  ],
};

function extFor(buf, url) {
  if (buf.length >= 12) {
    if (buf[0] === 0xff && buf[1] === 0xd8) return ".jpg";
    if (buf[0] === 0x89 && buf[1] === 0x50) return ".png";
    if (buf[0] === 0x47 && buf[1] === 0x49) return ".gif";
    if (buf.slice(0, 4).toString() === "RIFF" && buf.slice(8, 12).toString() === "WEBP") return ".webp";
  }
  return ".jpg";
}

const catalog = JSON.parse(readFileSync(catalogFile, "utf8"));
const bySlug = new Map(catalog.products.map((p) => [p.slug, p]));
let done = 0;
const failed = [];

for (const [slug, urls] of Object.entries(PICKS)) {
  const product = bySlug.get(slug);
  if (!product) continue;
  const stillPlaceholder = product.image.startsWith("/cards/") || product.image.startsWith("/hero/") || product.image.startsWith("/magazin");
  if (!stillPlaceholder) { done++; continue; }
  let ok = false;
  for (const url of urls) {
    try {
      const res = await fetch(url, { headers: UA, redirect: "follow", signal: AbortSignal.timeout(20000) });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const buf = Buffer.from(await res.arrayBuffer());
      if (buf.length < 6 * 1024 || buf.length > 6 * 1024 * 1024) throw new Error(`mărime ${buf.length}`);
      const file = `${slug}${extFor(buf, url)}`;
      writeFileSync(path.join(imagesDir, file), buf);
      product.image = `/products/farmavet/${file}`;
      product.sourcePage = url;
      if (product.images?.length) product.images[0] = { url: product.image, alt: product.name, role: "main" };
      done++;
      ok = true;
      console.log(`✔ ${product.name} ← ${url.slice(0, 60)}…`);
      break;
    } catch (e) {
      console.log(`  · sărit ${url.slice(0, 70)}: ${e.message}`);
    }
    await sleep(400);
  }
  if (!ok) failed.push(product.name);
  await sleep(300);
}

writeFileSync(catalogFile, JSON.stringify(catalog, null, 2) + "\n");
const real = catalog.products.filter((p) => p.image.startsWith("/products/farmavet/")).length;
console.log(`\nPas 8: ${done} produse actualizate. Total poze reale: ${real}/${catalog.products.length}`);
if (failed.length) console.log("Încă fără poză reală:\n  " + failed.join("\n  "));
