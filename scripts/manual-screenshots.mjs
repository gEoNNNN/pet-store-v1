/**
 * Screenshoturi pentru Manualul de utilizare al panoului de administrare.
 *
 * Rulare (serverul `npm run dev` trebuie să fie pornit):
 *   node scripts/manual-screenshots.mjs
 *
 * Scriptul autentifică un administrator, parcurge toate ecranele panoului,
 * face un flux demonstrativ complet (adaugă un produs DEMO, îl modifică,
 * îl șterge — catalogul rămâne curat) și salvează PNG-urile în
 * docs/manual/img/.
 */

import { chromium } from "playwright-core";
import fs from "node:fs";
import path from "node:path";

const BASE = process.env.ADMIN_SCREENSHOT_BASE ?? "http://localhost:3000";
const PASSWORD = process.env.ADMIN_PASSWORD ?? "farmavet2026";
const OUT_DIR = path.resolve("docs", "manual", "img");
const DEMO_SLUG = "test-nisip-demo";

fs.mkdirSync(OUT_DIR, { recursive: true });

/** Caută un Chromium local (Edge sau Chrome). */
function resolveExecutable() {
  const candidates = [
    "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe",
    "C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe",
    "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
    "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe",
  ];
  return candidates.find((candidate) => fs.existsSync(candidate));
}

const exe = resolveExecutable();
if (!exe) {
  console.error("Nu am găsit Edge sau Chrome pe calculator.");
  process.exit(1);
}

const browser = await chromium.launch({
  executablePath: exe,
  headless: true,
  args: ["--no-first-run", "--disable-gpu"],
});
console.log("Lansăm browser headless:", exe);

/** Curăță resturile produsului demo din rulările anterioare ale scriptului. */
function cleanDemoLeftovers() {
  const catalogFile = path.resolve("scrape", "natura_products.json");
  const data = JSON.parse(fs.readFileSync(catalogFile, "utf8"));
  const kept = data.products.filter((p) => p.slug !== DEMO_SLUG);
  if (kept.length !== data.products.length) {
    data.products = kept;
    if (typeof data.product_count === "number") {
      data.product_count = kept.length;
    }
    fs.writeFileSync(catalogFile, `${JSON.stringify(data, null, 2)}\n`, "utf8");
    console.log("Resturi demo curățate înainte de rulare.");
  }
}
cleanDemoLeftovers();

const page = await browser.newPage({
  viewport: { width: 1440, height: 900 },
  deviceScaleFactor: 2,
});

page.on("dialog", (dialog) => dialog.accept());

/** Ascunde insigna de dezvoltare Next și așteaptă fonturile înainte de captură. */
async function shoot(name, keepScroll = false) {
  await page.addStyleTag({ content: "nextjs-portal{display:none!important}" });
  if (!keepScroll) {
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(120);
  }
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(250);
  await page.screenshot({ path: path.join(OUT_DIR, name), fullPage: false });
  console.log("✓", name);
}

async function goto(url, timeout = 90000) {
  await page.goto(url, { waitUntil: "load", timeout });
}

try {
  // 1. Pagina de autentificare
  await goto(`${BASE}/admin`);
  await page.locator("input[name=password]").waitFor({ timeout: 60000 });
  await shoot("01-autentificare.png");

  // Autentificare cu o parolă greșită, pentru captura de eroare
  await page.locator("input[name=password]").fill("parola-gresita");
  await page.locator('button[type=submit]').click();
  await page.locator('[role=alert]').waitFor({ timeout: 30000 });
  await shoot("02-autentificare-eroare.png");

  // Autentificare corectă → bilanț
  await page.locator("input[name=password]").fill(PASSWORD);
  await page.locator('button[type=submit]').click();
  await page.waitForURL("**/admin/panou**", { timeout: 60000 });
  await shoot("03-bilant.png");

  // 2. Lista produselor
  await goto(`${BASE}/admin/panou/produse`);
  await page.locator("input[name=q]").waitFor({ timeout: 60000 });
  await shoot("04-produse-lista.png");

  // Căutare filtrată (formular GET, se execută prin adresa directă)
  await goto(`${BASE}/admin/panou/produse?q=Natura`);
  await page.locator("input[name=q]").waitFor({ timeout: 60000 });
  await shoot("05-produse-cautare.png");

  // 3. Formularul de adăugare (gol și completat)
  await goto(`${BASE}/admin/panou/produse/adauga`);
  await page.locator("#pf-brand").waitFor({ timeout: 60000 });
  await shoot("06-adaugare-gol.png");

  await page.locator("#pf-brand").selectOption("natura");
  await page.locator("#pf-name").fill("Test Nisip Demo Natural");
  await page.locator("#pf-slug").fill(DEMO_SLUG);
  await page.locator("#pf-category").selectOption("Pisici");
  await page
    .locator("#pf-image")
    .fill("/products/econatura/eco-natura-pet-cat-litter-box.webp");
  await page.locator("#pf-labels").fill("Demo, Nisip, Pisici");
  await page.locator("#pf-sizes").fill("10 litri, 5 litri");
  await page.locator("#pf-description").fill("Produs de demonstrație folosit pentru manualul de utilizare, se șterge automat la finalul scriptului.");
  await shoot("07-adaugare-completat.png");

  // Salvare → banner de succes în listă (cu produsul demo filtrat, ca să fie vizibil)
  await page.locator('button:has-text("Adaugă în catalog")').click();
  await page.waitForURL("**/admin/panou/produse**adaugat=1**", { timeout: 60000 });
  await goto(`${BASE}/admin/panou/produse?brand=natura&adaugat=1&q=test-nisip-demo`);
  await page.locator('a[href$="/natura/test-nisip-demo/modifica"]').first().waitFor({ state: "attached", timeout: 60000 });
  await shoot("08-adaugare-succes.png");

  // 4. Pagina publică afișează produsul nou (cardul e primul rezultat al căutării)
  await goto(`${BASE}/produse?cat=Pisici&brand=Natura&q=test%20nisip`);
  const publicCard = page.locator('a[href$="test-nisip-demo"]').first();
  await publicCard.waitFor({ state: "attached", timeout: 60000 });
  await publicCard.evaluate((el) => el.scrollIntoView({ block: "center" }));
  await page.waitForTimeout(900);
  await shoot("09-site-public.png", true);

  // 5. Formularul de editare
  await goto(`${BASE}/admin/panou/produse/natura/${DEMO_SLUG}/modifica`);
  await page.locator("#pf-name").waitFor({ timeout: 60000 });
  await shoot("10-editare.png");

  // Salvare → banner modificare (cu rândul demo filtrat)
  await page.locator('button:has-text("Salvează modificările")').click();
  await page.waitForURL("**/admin/panou/produse**modificat=1**", { timeout: 60000 });
  await goto(`${BASE}/admin/panou/produse?brand=natura&modificat=1&q=test-nisip-demo`);
  await page.locator('a[href$="/natura/test-nisip-demo/modifica"]').first().waitFor({ state: "attached", timeout: 60000 });
  await shoot("11-modificare-succes.png");

  // 6. Ștergerea produsului demo (dialog confirm se acceptă automat)
  const deleteButton = page.locator(
    `tr:has-text("${DEMO_SLUG}") button:has-text("Șterge")`,
  );
  await deleteButton.waitFor({ state: "attached", timeout: 30000 });
  await deleteButton.click();
  await page.waitForURL("**/admin/panou/produse**sters=1**", { timeout: 60000 });
  // Listă consecventă: filtru Natura + banner de ștergere
  await goto(`${BASE}/admin/panou/produse?brand=natura&sters=1`);
  await page.locator("input[name=q]").waitFor({ timeout: 60000 });
  await shoot("12-stergere-succes.png");
} finally {
  await browser.close();
}

// Verifică dacă produsul demo a rămas în catalog (ex: script întrerupt)
const catalogFile = path.resolve("scrape", "natura_products.json");
const data = JSON.parse(fs.readFileSync(catalogFile, "utf8"));
const leftovers = data.products.filter((p) => p.slug === DEMO_SLUG);
if (leftovers.length) {
  const nextProducts = data.products.filter((p) => p.slug !== DEMO_SLUG);
  data.products = nextProducts;
  if (typeof data.product_count === "number") {
    data.product_count = nextProducts.length;
  }
  fs.writeFileSync(catalogFile, `${JSON.stringify(data, null, 2)}\n`, "utf8");
  console.log("Produsul demo a fost curățat din catalog.");
} else {
  console.log("Catalogul e curat — produsul demo a fost șters prin panou.");
}
console.log("Screenshoturi salvate în:", OUT_DIR);
