/**
 * Generează iconițele site-ului (tab + apple-touch) din logoul companiei
 * din navbar (src/img/logo.png — monograma FV cu șarpe).
 *
 * Rulare: node scripts/site-icons.mjs
 */
import sharp from "sharp";
import fs from "node:fs";

const LOGO = "src/img/logo.png";

// Tab: decupăm marginea albă, păstrăm ovalul pe fundal transparent.
const trimmedLogo = sharp(LOGO).trim({ threshold: 10 });

await trimmedLogo
  .clone()
  .resize(512, 512, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
  .png()
  .toFile("src/app/icon.png");
console.log("✓ src/app/icon.png (512x512, din logoul FV)");

// Copie publică pentru manifest.webmanifest (URL static fără hash).
await trimmedLogo
  .clone()
  .resize(512, 512, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
  .png()
  .toFile("public/icon-512.png");
console.log("✓ public/icon-512.png (pentru manifest)");

// Apple touch: fundal alb (iOS aplică singur masca rotunjită).
await trimmedLogo
  .clone()
  .resize(180, 180, { fit: "contain", background: { r: 255, g: 255, b: 255, alpha: 1 } })
  .png()
  .toFile("src/app/apple-icon.png");
console.log("✓ src/app/apple-icon.png (180x180, din logoul FV)");

// Ștergem favicon.ico vechi (implicit din create-next-app), ca browserul
// să folosească exclusiv icon.png al companiei.
if (fs.existsSync("src/app/favicon.ico")) {
  fs.unlinkSync("src/app/favicon.ico");
  console.log("✓ src/app/favicon.ico șters");
}
