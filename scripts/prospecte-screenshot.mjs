/**
 * Verificare + screenshot pentru funcția „Descarcă prospect (Word)".
 *
 * Rulare (serverul `npm run dev` trebuie să fie pornit):
 *   node scripts/prospecte-screenshot.mjs
 *
 * Verifică: fișierul /prospecte/… se servește HTTP 200; butonul apare pe
 * pagina produsului și NU apare pe produse fără prospect; salvează
 * docs/manual/img/13-prospect-download.png.
 */
import { chromium } from "playwright-core";
import fs from "node:fs";
import path from "node:path";

const BASE = process.env.PROSPECTE_SCREENSHOT_BASE ?? "http://localhost:3000";
const OUT_DIR = path.resolve("docs", "manual", "img");
const PROSPECT_FILE = `${BASE}/prospecte/prospect-insektal.docx`;
const PAGE_WITH_PROSPECT = `${BASE}/produse/neoterica-insektal/insektal-zgarda-caini-65cm`;

function resolveExecutable() {
  const candidates = [
    "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe",
    "C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe",
    "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
    "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe",
  ];
  return candidates.find((candidate) => fs.existsSync(candidate));
}

const response = await fetch(PROSPECT_FILE, { method: "HEAD" });
if (response.status !== 200) {
  console.error(`✗ ${PROSPECT_FILE} răspunde HTTP ${response.status}`);
  process.exit(1);
}
console.log(`✓ fișier servit: ${PROSPECT_FILE} (${response.headers.get("content-type")})`);

const browser = await chromium.launch({
  executablePath: resolveExecutable(),
  headless: true,
  args: ["--no-first-run", "--disable-gpu"],
});

try {
  const page = await browser.newPage({ viewport: { width: 1600, height: 1200 } });
  await page.goto(PAGE_WITH_PROSPECT, { waitUntil: "networkidle" });

  const button = page.getByRole("link", { name: /Descarcă prospect/i });
  if ((await button.count()) === 0) {
    console.error(`✗ butonul „Descarcă prospect" lipsește pe ${PAGE_WITH_PROSPECT}`);
    process.exit(1);
  }
  const href = await button.first().getAttribute("href");
  const download = await button.first().getAttribute("download");
  console.log(`✓ buton prezent; href=${href}, download=${download}`);

  // produse fără prospect → butonul nu trebuie să apară
  const withoutUrl = `${BASE}/produse/brit/707837-brit-care-dog-hair-and-skin-insectandfish`;
  await page.goto(withoutUrl, { waitUntil: "networkidle" });
  const absent = await page.getByRole("link", { name: /Descarcă prospect/i }).count();
  if (absent !== 0) {
    console.error(`✗ butonul apare greșit și pe un produs fără prospect: ${withoutUrl}`);
    process.exit(1);
  }
  console.log("✓ produsul fără prospect nu afișează butonul");

  // screenshot pentru manual
  await page.goto(PAGE_WITH_PROSPECT, { waitUntil: "networkidle" });
  await page.evaluate(() => window.scrollTo(0, 0));
  fs.mkdirSync(OUT_DIR, { recursive: true });
  await page.screenshot({ path: path.join(OUT_DIR, "13-prospect-download.png") });
  console.log(`✓ screenshot: docs/manual/img/13-prospect-download.png`);
} finally {
  await browser.close();
}
