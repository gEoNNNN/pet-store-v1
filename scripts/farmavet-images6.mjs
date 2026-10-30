/**
 * Pasul 6: imagini rămase prin DuckDuckGo Images, cu pazuri stricte:
 *  - titlul rezultatului trebuie să conțină token-ul distinctiv al produsului;
 *  - conflict de formă (pulbere vs injectabil etc.) → respins;
 *  - bonus pentru domenii oficiale (vet.md, agroolkar, vanellivet, vitafor,
 *    tecro, bioceval, ruvera, aveflor, braveecto, dynabio, drugs.com).
 * Interogările sunt în română + alias în rusă/ucrainiană (așa sunt indexate
 * site-le OLKAR/CID/Tecro).
 *
 * Rulare:  node scripts/farmavet-images6.mjs [--dry]
 */
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";

const root = process.cwd();
const dry = process.argv.includes("--dry");
const catalogFile = path.join(root, "scrape", "farmavet_products.json");
const imagesDir = path.join(root, "public", "products", "farmavet");
mkdirSync(imagesDir, { recursive: true });

const UA = {
  "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36",
  "Accept-Language": "ro,en;q=0.8,ru;q=0.6",
};
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
async function get(url, as = "text") {
  const res = await fetch(url, { headers: UA, redirect: "follow", signal: AbortSignal.timeout(20000) });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return as === "buffer" ? Buffer.from(await res.arrayBuffer()) : res.text();
}

function norm(v) {
  return v.toLowerCase()
    .replace(/[șş]/g, "s").replace(/[țţ]/g, "t").replace(/ă/g, "a").replace(/â/g, "i").replace(/î/g, "i")
    .replace(/ё/g, "е").replace(/[^a-z0-9а-я]+/g, " ").trim();
}

const FORM_WORDS = ["pulbere", "tablete", "comprimate", "suspensie", "emulsie", "gel", "unguent", "spray", "picaturi", "zgarda", "injectabil", "injectabila", "injectabile", "orala", "sol", "solutie", "granulat", "momeala", "tableta"];
const FORM_RU = { pulbere: "порошок", tablete: "таблет", comprimate: "таблет", injectabil: "раствор", injectabila: "раствор", injectabile: "раствор", solutie: "раствор", suspensie: "суспен", emulsie: "эмуль", gel: "гель", unguent: "маз", spray: "спрей", granulat: "гранул", momeala: "приманк", orala: "орал" };

// alias de căutare (rusă sau engleză) pentru produsele indexate pe site-le est-europene
const QUERY = {
  "tilozina-20-pulbere": ["Тилозин 20% порошок О.Л.К", "Тилозин 20 ОЛКАР"],
  "ceftiofur-suspensie-injectabila": ["Цефтиофур 5% ветеринарный", "ceftiofur injection veterinary Farmavet"],
  "colivetoprim-pulbere-hidrosolubila": ["Коливетоприм порошок", "Colivetoprim"],
  "enrofloxacina-10-solutie-injectabila": ["Энрофлоксацин 10% раствор инъекционный ветеринарный"],
  "metronidazol-25-pulbere": ["Метронидазол 25% порошок ветеринарный"],
  "norflox-10-solutie-orala": ["Норфлокс 10% раствор для птиц ветеринарный"],
  "trimicozin-solutie-orala-pentru-pasari": ["Тримикозин раствор", "Biofarm Trimicozin"],
  "bromodox-solutie-injectabila": ["Бромодокс Ветсинтез", "bromhexine doxycycline injection veterinary"],
  "analghin-50-solutie-injectabila": ["Анальгин 50% раствор ветеринарный"],
  "adtab-tablete-antiparazitare-pentru-pisici": ["AdTab cat tableta"],
  "adtab-tablete-antiparazitare-pentru-ciini": ["AdTab dog tableta"],
  "ba-tick-solutie-ectoparaziticida-pour-on": ["Батик pour-on BAVET", "Ba-Tick ectoparasiticide"],
  "bravecto-tablete-masticabile-pentru-ciini": ["Bravecto tablete cani MSD"],
  "bravecto-suspensie-injectabila-pentru-ciini": ["Bravecto injectie hond"],
  "bravecto-solutie-spot-on-pentru-pisici": ["Bravecto spot-on cats MSD"],
  "prantal-comprimate-antihelmintice": ["Прантал таблетки ветеринарный", "Prantal farmavet"],
  "diazinon-60-insecto-acaricid-emulsionabil": ["Диазинон 60% ЭК ветеринарный"],
  "xeralxon-pulbere-antimicrobiana-de-uz-extern": ["Ксералксон", "Xeralxon powder"],
  "kenocox-solutie-contra-coccidiozei-si-cryptosporidiozei": ["CID LINES Kenocox"],
  "dm-cid-s-solutie-spumanta-alcalina-de-curatare-si-dezinfectie": ["CID LINES DM CID S"],
  "keno-pure-dezinfectant-pentru-mameloane": ["CID LINES Keno Pure teat"],
  "tormax-s-solutie-acida-spumogena-de-curatare": ["CID LINES Tormax S", "Tormax-S CID"],
  "virocid-dezinfectant-concentrat-cu-spectru-larg": ["CID LINES Virocid", "Virocid disinfectant"],
  "cypermethrin-10-ec-insecticid-pentru-suprafete": ["Циперметрин 10% ЭК ветеринарный"],
  "killer-muh-500-insecticid-microencapsulat-contra-mustelor": ["Киллер мух 500", "Killer Muh insecticide"],
  "asd-fractia-2-solutie-imunostimulanta": ["АСД фракция 2 ветеринарный"],
  "canvac-r-vaccin-antirabic-pentru-ciini": ["Canvac R rabies vaccine dog"],
  "canvac-8-dhppil-vaccin-polivalent-pentru-ciini": ["Canvac 8 DHPPiL"],
  "vaccin-hemoragic-viral-rhd-pentru-iepuri": ["Вакцина ВГБК кроликов"],
  "vaccin-ltf-130-contra-tricofitozei-la-bovine": ["Вакцина ЛТФ-130 трихофития крупный рогатый"],
  "vaccin-vr-2-contra-rujetului-la-porcine": ["Вакцина ВР-2 рожа свиней"],
  "calciu-vitaminizat-aromatizat-pulbere": ["кальций витаминизированный мел кормовой"],
  "ferrum-b12-solutie-injectabila": ["Феррум В12 ветеринарный раствор"],
  "faina-de-peste-vitaminizata": ["Bioceval fish meal"],
  "ulei-de-peste-omega-3-vitamine-a-si-d": ["Bioceval fish oil"],
  "biotan-concentrat-de-vitamine-si-minerale": ["Biotan premixTecro", "Биотан Тикро"],
  "drojdie-furajera-46-proteina": ["дрожжи кормовые 46% Меллер"],
  "vita-acid-acidifiant-pentru-hrana-animalelor": ["Vitafor Vita-Acid site:vitafor.be"],
  "vita-micotox-plus-binder-de-micotoxine": ["Vitafor Micotox site:vitafor.be"],
  "vita-multi-stress-vitamine-aminoacizi": ["Vitafor Multi Stress site:vitafor.be"],
  "vita-phoscal-complex-polimineral": ["Vitafor Phoscal site:vitafor.be"],
  "vita-biotic-liquid-probiotic-pentru-pasari": ["Vitafor Biotic liquid site:vitafor.be"],
  "premix-pui-crestere-1-faza-ii-peste-30-zili": ["премікс для бройлерів ТЕКРО фаза 2", "premix for broilers phase 2 site:tecro.cz"],
  "premix-rate-1": ["премикс для уток Текро", "premix for ducks site:tecro.cz"],
  "premix-giste-1": ["премикс для гусей Текро", "premix for geese site:tecro.cz"],
  "premix-prepelite-2": ["премикс для перепелов Текро", "premix for quails site:tecro.cz"],
  "premix-purcei-1-0-2-luni": ["премикс для поросят Текро 0-2", "premix for piglets site:tecro.cz"],
  "premix-purcei-1-peste-4-luni": ["премикс для свиней Текро", "premix for pigs site:tecro.cz"],
  "premix-scroafe-gestante": ["премикс для супоросных свиноматок Текро", "premix for sows site:tecro.cz"],
  "bromenghil-solutie-orala-pentru-pasari": ["Бромгегил ветеринарный", "bromhexine veterinary solution poultry"],
  "borogluconat-de-calciu-solutie-injectabila": ["Борглюконат кальция ветеринарный"],
  "aloegel-gel-cu-aloe-vera-si-castan": ["RUVERA AloeGel vet", "aloe gelVeterinar RUVERA"],
  "therma-vet-cream-crema-de-masaj": ["RUVERA Therma vet cream"],
  "profimast-unguent-igienic-pentru-uger": ["RUVERA Profimast", "Profimast udder ointment"],
};

const BRAND_DOMAINS = {
  olkar: /agroolkar/, farmavet: /vet\.md/, vanellivet: /vanellivet/, "cid-lines": /cidlines|ecolab/,
  vitafor: /vitafor/, tecro: /tecro/, bioceval: /bioceval/, ruvera: /ruvera/, aveflor: /aveflor|arpalit/,
  msd: /bravecto|msd/, vetintez: /vetsintez/, biofarm: /biofarm/, dynabio: /dynabio/,
};

function headToken(name) {
  const toks = norm(name).split(" ").filter((t) => t.length >= 4 && !FORM_WORDS.includes(t) && !/^\d+$/.test(t));
  return toks[0] || norm(name).split(" ")[0];
}

async function vqd() {
  const html = await get("https://duckduckgo.com/?q=x&iax=images&ia=images");
  return html.match(/vqd=([\d-]+)&/)?.[1] || null;
}
async function ddgImages(query, token) {
  const j = JSON.parse(await get(`https://duckduckgo.com/i.js?l=ro-ro&o=json&q=${encodeURIComponent(query)}&vqd=${token}&pn=1`));
  return (j.results || []).filter((r) => r.image && /\.(jpe?g|png|webp)/i.test(r.image));
}

function score(product, r) {
  const head = headToken(product.name);
  const title = norm(r.title || "");
  const page = (r.url || "").toLowerCase();
  const img = (r.image || "").toLowerCase();
  const hay = title + " " + page + " " + img;
  if (!hay.includes(head)) return -99;
  let s = 6;
  // conflic de formă (ex. noi avem „pulbere", rezultatul e „раствор")
  const ourForms = FORM_WORDS.filter((f) => norm(product.name).includes(f));
  const foreignForms = Object.values(FORM_RU).filter((f) => title.includes(f) || page.includes(f) || img.includes(f));
  for (const f of ourForms) {
    const ru = FORM_RU[f];
    const hasForm = title.includes(f) || (ru ? (title.includes(ru) || img.includes(ru)) : false);
    if (!hasForm) {
      const conflict = FORM_WORDS.some((x) => x !== f && (title.includes(x) || foreignForms.includes(x))) ||
        foreignForms.some((x) => x !== ru && !ourForms.includes(Object.keys(FORM_RU).find((k) => FORM_RU[k] === x) || ""));
      if (conflict) s -= 4;
    }
  }
  const bd = BRAND_DOMAINS[product.brand_slug];
  if (bd && (bd.test(img) || bd.test(page))) s += 6;
  if (/vet\.md|agroolkar|vanellivet|ruvera|arpalit|vitafor|tecro|bioceval|drugs\.com|bravecto/.test(img)) s += 4;
  if (/logo|banner|icon|sprite|hero|frame|background/.test(img)) s -= 15;
  return s;
}

function extFor(url, buf) {
  if (buf && buf.length >= 12) {
    if (buf[0] === 0xff && buf[1] === 0xd8) return ".jpg";
    if (buf[0] === 0x89 && buf[1] === 0x50) return ".png";
    if (buf.slice(0, 4).toString() === "RIFF" && buf.slice(8, 12).toString() === "WEBP") return ".webp";
  }
  const m = url.match(/\.(jpe?g|png|webp)(?:$|[?&])/i);
  return m ? `.${m[1].toLowerCase().replace("jpeg", "jpg")}` : ".jpg";
}
async function download(url, base) {
  const buf = await get(url, "buffer");
  if (buf.length < 8 * 1024 || buf.length > 6 * 1024 * 1024) throw new Error(`${buf.length}B`);
  const file = `${base}${extFor(url, buf)}`;
  writeFileSync(path.join(imagesDir, file), buf);
  return file;
}

const catalog = JSON.parse(readFileSync(catalogFile, "utf8"));
async function vqdRetry(max = 8) {
  for (let i = 0; i < max; i++) {
    try {
      const t = await vqd();
      if (t) return t;
    } catch { /* reîncercă */ }
    await sleep(15000);
  }
  return null;
}
let token = await vqdRetry();
if (!token) { console.error("DDG nu răspunde — amână rularea"); process.exit(2); }
let done = 0;
const log = [];
for (const product of catalog.products) {
  const stillPlaceholder = product.image.startsWith("/cards/") || product.image.startsWith("/hero/") || product.image.startsWith("/magazin");
  if (!stillPlaceholder) continue;
  const queries = QUERY[product.slug] || [product.name.split("—")[0].trim()];
  const baseQueries = queries.concat(product.name.split("—")[0].trim());
  let picked = null;
  for (const q of baseQueries) {
    try {
      const results = await ddgImages(q, token);
      const scored = results.map((r) => ({ r, s: score(product, r) })).filter((x) => x.s >= 10).sort((a, b) => b.s - a.s);
      for (const cand of scored) {
        try {
          const file = await download(cand.r.image, product.slug);
          picked = { file, url: cand.r.image, page: cand.r.url, q, s: cand.s };
          break;
        } catch { /* însearcă următorul candidat */ }
      }
    } catch { await sleep(1500); const t2 = await vqd().catch(() => null); if (t2) token = t2; }
    if (picked) break;
    await sleep(900);
  }
  if (picked) {
    if (!dry) {
      product.image = `/products/farmavet/${picked.file}`;
      product.sourcePage = picked.page;
      if (product.images?.length) product.images[0] = { url: product.image, alt: product.name, role: "main" };
    }
    done++;
    log.push(`✔ ${product.name} ← ${picked.page}`);
    console.log(`✔ ${product.name}`);
  } else {
    console.log(`✘ ${product.name}`);
  }
  await sleep(1200);
}
if (!dry && done) writeFileSync(catalogFile, JSON.stringify(catalog, null, 2) + "\n");
const real = catalog.products.filter((p) => p.image.startsWith("/products/farmavet/")).length;
console.log(`\nPas 6: ${done} imagini noi. Total reale: ${real}/${catalog.products.length}`);
if (done && !dry) console.log(log.join("\n"));
