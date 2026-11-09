/**
 * Captură reală a site-ului pentru previzualizarea linkului (Open Graph).
 * Ieșire: src/app/opengraph-image.png (1200x630).
 *
 * Rulare (serverul trebuie să fie pornit):
 *   node scripts/og-screenshot.mjs
 */
import { chromium } from "playwright-core";
import fs from "node:fs";

const BASE = process.env.OG_SCREENSHOT_BASE ?? "http://localhost:3000";

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

const browser = await chromium.launch({ executablePath: exe, headless: true, args: ["--no-first-run", "--disable-gpu"] });

try {
  const page = await browser.newPage({
    viewport: { width: 1200, height: 630 },
    deviceScaleFactor: 1,
  });

  await page.goto(`${BASE}/`, { waitUntil: "load", timeout: 90000 });
  await page.evaluate(() => document.fonts.ready);
  // Lăsăm animațiile de intrare și prima imagine din hero să se stabilizeze.
  await page.waitForTimeout(1500);

  await page.screenshot({ path: "src/app/opengraph-image.png", fullPage: false });
  console.log("✓ src/app/opengraph-image.png (1200x630, captură reală a site-ului)");
} finally {
  await browser.close();
}
