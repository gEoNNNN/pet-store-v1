// Îmbogățește descrierile celor 4 produse noi cu date verificate pe net:
//  - Neoverm: prospect oficial Biofarm (biopharm.vet) — ivermectină 10 mg/ml
//  - Fluralaner 1%: studii/Monografie Exzolt (10 mg/ml, apa de băut, acarieni)
//  - Amin Total: postul oficial de prezentare Hebei Lihua Pharmaceutical
//  - Vitaminar Plus: linia „Multivitamin + Mineral Premix" Lihua Pharma
import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";

const catalogFile = path.join(process.cwd(), "scrape", "farmavet_products.json");
const catalog = JSON.parse(readFileSync(catalogFile, "utf8"));

const UPDATES = {
  "vitaminar-plus-premix-multivitaminic": {
    labels: ["Toate speciile"],
    description:
      "Premix multivitaminic și mineral LIHUA PHARMA (Hebei Lihua Pharmaceutical, China), 15 g. Combină vitaminele esențiale cu minerale și oligoelemente, acoperind necesarul zilnic al animalelor.\n\nIndicații: prevenirea și corectarea carențelor de vitamine și minerale, în perioadele de stres (transport, schimbări de hrană sau climatice, vaccinare), în perioadele de producție intensivă (creștere, ouătit) și în convalescență — pentru menținerea sănătății generale și a productivității.\n\nMod de administrare: amestecat în hrană, conform schemei indicate pe etichetă sau recomandării medicului veterinar.",
  },
  "amin-total-pulbere-multivitaminica-pasari": {
    labels: ["Păsări"],
    description:
      "Pulbere multivitaminică cu aminoacizi și oligoelemente LIHUA PHARMA (Hebei Lihua Pharmaceutical, China), 100 g, pentru păsări.\n\nIndicații: carențe de performanță, stres (transport, schimbări de hrană sau climatice, vaccinare), perioadele de producție intensivă (ouătit, creștere) și convalescența după boli sau tratamente.\n\nMod de administrare: conform recomandării medicului veterinar sau a schemei indicate pe etichetă.",
  },
  "fluralaner-solutie-orala-pentru-pasari": {
    labels: ["Păsări"],
    description:
      "Soluție orală antiparazitară pentru păsări cu fluralaner 1% (10 mg/ml), Shandong Luxi (China).\n\nFluralanerul aparține clasei isoxazolinelor și este eficace contra acarienilor care afectează păsările, inclusiv acarianul roșu de la găini (Dermanyssus gallinae) și acarianul nordic de la găini (Ornithonyssus sylviarum), contribuind la controlul de lungă durată al populației de acarieni din adăpost.\n\nMod de administrare: prin apa de băut. Schema de dozare tipică pentru soluția orală de fluralaner la găini constă în două administrări de 0,5 mg/kg greutate corporală, la interval de 7 zile — se respectă prospectul etichetei.\n\nNotă: produs destinat păsărilor — nu se confundă cu variantele Bravecto pentru câini și pisici din același principiu activ.",
  },
  "neoverm-solutie-orala": {
    labels: ["Bovine", "Ovine", "Caprine", "Porcine", "Păsări"],
    description:
      "Soluție orală cu ivermectină 10 mg/ml (Biofarm, Ucraina), 10 fiole de 10 ml.\n\nIndicații: dehelmintizarea animalelor și controlul insectelor și acarienilor la bovine, ovine, caprine, porcine și păsări (găini, curci) — nematode gastrointestinale și pulmonare (Haemonchus, Ostertagia, Trichostrongylus, Cooperia, Dictyocaulus, Ascaris, Oesophagostomum etc.), larve de muște (Hypoderma, Oestrus, Gastrophilus), acarieni (Sarcoptes, Psoroptes, Chorioptes, Demodex) și păduchi.\n\nDozare (prin apa de băut): bovine, ovine și caprine — 0,2 ml/10 kg greutate corporală, o singură dată; porcine (inclusiv purcei) — 0,25 ml/10 kg, de două ori la interval de 24 de ore.\n\nContraindicat la animalele slăbite sau cu boli infecțioase, la femelele gravide în ultima lună înainte de fătare și la vacile lactate.\n\nTimp de așteptare pentru carne: bovine 24 zile, ovine/caprine 14 zile, porcine 12 zile, păsări 8 zile.",
  },
};

let updated = 0;
for (const p of catalog.products) {
  const u = UPDATES[p.slug];
  if (!u) continue;
  p.description = u.description;
  p.labels = u.labels;
  updated++;
  console.log(`✔ actualizat: ${p.name}`);
}

writeFileSync(catalogFile, JSON.stringify(catalog, null, 2) + "\n");
console.log(`total actualizate: ${updated}/${Object.keys(UPDATES).length}`);
