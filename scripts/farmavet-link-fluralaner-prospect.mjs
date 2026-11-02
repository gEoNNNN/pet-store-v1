// Leagă prospectul oficial ANSA (PDF scanat, certificat de înregistrare 260030,
// revizuit 06/2026) de produsul Fluralaner 1% pentru păsări și rescu descrierea
// cu datele din prospect.
// Sursa PDF: „260030-Fluralaner  Pr.pdf" (Downloads) → public/prospecte.
import { copyFileSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";

const root = process.cwd();
const src = "C:\\Users\\Eugen Ostafi\\Downloads\\260030-Fluralaner  Pr.pdf";
const dstName = "prospect-fluralaner-pasari.pdf";
const dst = path.join(root, "public", "prospecte", dstName);
copyFileSync(src, dst);
console.log(`copiat: ${src} → public/prospecte/${dstName}`);

const catalogFile = path.join(root, "scrape", "farmavet_products.json");
const catalog = JSON.parse(readFileSync(catalogFile, "utf8"));
const p = catalog.products.find((x) => x.slug === "fluralaner-solutie-orala-pentru-pasari");
if (!p) { console.log("✗ produs lipsă"); process.exit(1); }

p.prospect = `/prospecte/${dstName}`;
p.description =
  "Fluralaner 1%, soluție orală — Shandong Luxi Animal Medicine (China). Medicament de uz veterinar înregistrat la ANSA Moldova (certificat nr. 260030, prospect revizuit 06/2026); se eliberează cu prescripție.\n\n" +
  "Compoziție: 1 ml conține fluralaner 10 mg; excipienți: polisorbat-80, apă purificată.\n\n" +
  "Specii țintă: păsări (pui, găini de curte, găini ouătoare, găini pentru reproducție).\n\n" +
  "Indicații: pentru tratamentul infestațiilor cu acarienii roșii la pui, găinile de curte, găinile ouătoare și găinile de reproducție.\n\n" +
  "Dozare (administrare în apa de băut): 0,05 ml per 1 kg greutate corporală (echivalent cu 0,5 mg fluralaner per 1 kg greutate corporală), administrată o dată la 7 zile, de 2 ori. Doza zilnică (ml/zi) = greutatea corporală totală a puilor tratați (kg) × 0,05 ml/kg; de exemplu, 1 litru de produs este suficient pentru pui cu greutate corporală totală de 20 000 kg. Intervalul dintre două cure de tratament trebuie să fie de cel puțin 3 luni; apa medicamentată se prepară proaspăt în fiecare zi de tratament.\n\n" +
  "Perioade de așteptare: carne și organe — 14 zile; ouă — 0 zile. Produsul poate fi utilizat în timpul perioadei de ouat.\n\n" +
  "Contraindicații: nu există. Evenimente adverse: nu se cunosc. Depozitare: 0–30 °C, la loc uscat și întunecat; termen de valabilitate 24 de luni.\n\n" +
  "Ambalaje: recipiente de 100 ml, 200 ml, 1 L sau 5 L.\n\n" +
  "Notă: produs destinat păsărilor — nu se confundă cu variantele Bravecto pentru câini și pisici din același principiu activ (cod ATC vet: QP53BE02).";
p.labels = ["Păsări"];

const idx = catalog.products.indexOf(p);
console.log(`✔ descriere + prospect actualizate (produsul #${idx})`);
writeFileSync(catalogFile, JSON.stringify(catalog, null, 2) + "\n");
console.log(`total produse: ${catalog.products.length}`);
