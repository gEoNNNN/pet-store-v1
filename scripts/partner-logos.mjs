/**
 * Normalizează logo-urile de parteneri din public/logos (fișierele urcate de
 * mână, cu nume de tipul „logo 5.png”, formate mixte png/webp/svg și
 * dimensiuni foarte diferite) în PNG-uri egale, în public/logos/partners.
 *
 * Ce face pentru fiecare logo:
 *  - taie marginile transparente;
 *  - dacă fundalul e alb, îl face transparent (doar zona legată de margine, ca
 *    să nu dispară spațiile albe din interiorul literelor);
 *  - pune sigla pe un canvas cu aceleași dimensiuni pentru toți partenerii,
 *    deci în carousel toate cardurile au exact aceeași mărime vizuală.
 *
 * Logo-ul Biopharm e livrat pentru fundal închis (text alb + gri deschis), de
 * aceea culorile textului sunt înlocuite cu un gri închis și gri mediu, altfel
 * ar fi invizibil pe cardurile deschise.
 *
 * Rulare:  node scripts/partner-logos.mjs
 * Apoi actualizează lista `partnerLogos` din src/components/Partners.tsx dacă
 * se schimbă partenerii.
 */
import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import path from "node:path";
import sharp from "sharp";

const root = process.cwd();
const sourceDir = path.join(root, "public", "logos");
const targetDir = path.join(root, "public", "logos", "partners");
const workDir = path.join(root, ".cache", "partner-logos");

/** canvas comun; raportul 2.1 este și raportul 118x56 al cardului din carousel */
const CANVAS = { width: 462, height: 220 };
/** spațiul maxim rezervat siglei în canvas (restul = aer în jur) */
const INNER = { width: 420, height: 176 };

/**
 * Siglele marcate cu `mare: true` primesc un canvas strâns pe propria formă, cu
 * doar 3% aer în jur, în loc de canvasul lat comun. Așa folosesc toată cutia
 * de 113x56 a cardului (până acum perdeau aer în stânga-dreapta sau sus-jos).
 * Cardul în sine nu se atinge: rămâne pătrat, cu aceeași lățime și padding.
 */
const MARE_LATURA_MAX = 460;
const MARE_AER = 0.03;
/** nu mărim prea mult siglele mici, altfel devin neclare */
const MAX_UPSCALE = 3;
/** dimensiunea maximă la care decodificăm (Natura vine la 5817x2943) */
const MAX_SIDE = 1400;

/** fișierul urcat → slug-ul folosit pentru numele de fișier (`mare` = siglă mărită) */
const MANIFEST = [
  { file: "logo 0.svg", slug: "biopharm", mare: true },
  { file: "logo 1.png", slug: "brit" },
  { file: "logo 2.png", slug: "ol-kar", mare: true },
  { file: "logo 4.webp", slug: "versele-laga", mare: true },
  { file: "logo 5.png", slug: "partener-verde" },
  { file: "logo 6.png", slug: "vetsintez" },
  { file: "logo7.png", slug: "carnilove" },
  { file: "logo 8.png", slug: "antibiotice" },
  { file: "logo 9.png", slug: "promvetservis" },
  { file: "logo 10.png", slug: "cargill" },
  { file: "logo 11.png", slug: "dyntec" },
  { file: "logo 12.webp", slug: "purina", mare: true },
  { file: "logo 13.png", slug: "tekro", mare: true },
  { file: "logo 14.png", slug: "natura", mare: true },
  { file: "logo 15.png", slug: "vanelli", mare: true },
  { file: "logo 16.png", slug: "icb-pharma" },
  { file: "logo 17.png", slug: "cfs-vitafor", mare: true },
];

/** SVG-urile care trebuie recolorite înainte de rasterizare: fill vechi → nou */
const SVG_RECOLOR = {
  biopharm: { white: "#33404d", "#CFCFCA": "#6b7280" },
};

const isNearWhite = (r, g, b) => r >= 228 && g >= 228 && b >= 228;

/**
 * Culoarea dominantă a marginii, calculată doar pe pixeli opachi: așa distingem
 * un fundal alb (de eliminat) de o siglă care chiar este un pătrat colorat.
 */
function borderColor(data, width, height) {
  const counts = new Map();
  let total = 0;
  const step = Math.max(1, Math.floor((2 * width + 2 * height) / 2000));
  const add = (x, y) => {
    const i = (y * width + x) * 4;
    if (data[i + 3] < 200) return;
    total++;
    const key = `${data[i] >> 4},${data[i + 1] >> 4},${data[i + 2] >> 4}`;
    counts.set(key, (counts.get(key) ?? 0) + 1);
  };
  for (let x = 0; x < width; x += step) { add(x, 0); add(x, height - 1); }
  for (let y = 0; y < height; y += step) { add(0, y); add(width - 1, y); }
  const top = [...counts.entries()].sort((a, b) => b[1] - a[1])[0];
  if (!top || !total) return null;
  const [r, g, b] = top[0].split(",").map((value) => Number(value) * 16 + 8);
  return { r, g, b, share: top[1] / total };
}

/** decodifică în RGBA, dimensionat rezonabil (SVG-urile la 600 dpi) */
async function decode(source) {
  const svg = /\.svg$/i.test(source);
  const probe = sharp(source, svg ? { density: 600 } : { animated: false });
  const meta = await probe.metadata();
  let img = probe;
  if (Math.max(meta.width, meta.height) > MAX_SIDE) {
    img = img.resize({ fit: "inside", width: MAX_SIDE, height: MAX_SIDE });
  }
  const { data, info } = await img.ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  return { data, width: info.width, height: info.height };
}

/** limitele pixelilor vizibili (alpha peste prag) */
function alphaBox(data, width, height, threshold = 16) {
  let minX = width, minY = height, maxX = -1, maxY = -1;
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      if (data[(y * width + x) * 4 + 3] < threshold) continue;
      if (x < minX) minX = x;
      if (y < minY) minY = y;
      if (x > maxX) maxX = x;
      if (y > maxY) maxY = y;
    }
  }
  if (maxX < 0) return null;
  return { left: minX, top: minY, width: maxX - minX + 1, height: maxY - minY + 1 };
}

function crop(data, width, box) {
  const out = Buffer.alloc(box.width * box.height * 4);
  for (let y = 0; y < box.height; y++) {
    const from = (box.top + y) * width * 4 + box.left * 4;
    data.copy(out, y * box.width * 4, from, from + box.width * 4);
  }
  return { data: out, width: box.width, height: box.height };
}

/**
 * Pornește de la margini și transformă în transparent tot albul continuu.
 * Albul închis în interior (câinele din sigla O.L.KAR. sau spațiile literelor)
 * rămâne neatins.
 */
function clearWhiteBackground(data, width, height) {
  const seen = new Uint8Array(width * height);
  const queue = new Int32Array(width * height);
  let head = 0, tail = 0;
  const push = (index) => {
    if (seen[index]) return;
    const i = index * 4;
    if (data[i + 3] < 16 || !isNearWhite(data[i], data[i + 1], data[i + 2])) return;
    seen[index] = 1;
    queue[tail++] = index;
  };
  for (let x = 0; x < width; x++) { push(x); push((height - 1) * width + x); }
  for (let y = 0; y < height; y++) { push(y * width); push(y * width + width - 1); }
  while (head < tail) {
    const index = queue[head++];
    const x = index % width, y = (index / width) | 0;
    data[index * 4 + 3] = 0;
    if (x > 0) push(index - 1);
    if (x < width - 1) push(index + 1);
    if (y > 0) push(index - width);
    if (y < height - 1) push(index + width);
  }
}

/** aplică înlocuirile de culoare declarate pentru SVG, într-un fișier temporar */
function prepareSource(entry, source) {
  const recolor = SVG_RECOLOR[entry.slug];
  if (!recolor || !/\.svg$/i.test(source)) return source;
  mkdirSync(workDir, { recursive: true });
  const patched = path.join(workDir, `${entry.slug}.svg`);
  let svg = readFileSync(source, "utf8");
  for (const [from, to] of Object.entries(recolor)) {
    svg = svg.split(`fill="${from}"`).join(`fill="${to}"`);
  }
  writeFileSync(patched, svg, "utf8");
  return patched;
}

/** scalează sigla și o lipește centrată pe canvasul comun (sau strâns, dacă `mare`) */
async function toCanvas(image, destination, { mare = false } = {}) {
  const canvas = mare
    ? tightCanvas(image.width, image.height)
    : { width: CANVAS.width, height: CANVAS.height };
  const inner = mare ? canvas : INNER;

  const fit = Math.min(inner.width / image.width, inner.height / image.height);
  const scale = Math.min(fit, MAX_UPSCALE);
  const drawnWidth = Math.max(1, Math.round(image.width * scale));
  const drawnHeight = Math.max(1, Math.round(image.height * scale));

  const resized = await sharp(image.data, { raw: { width: image.width, height: image.height, channels: 4 } })
    .resize({ width: drawnWidth, height: drawnHeight, fit: "fill", kernel: scale < 1 ? "lanczos3" : "cubic" })
    .png()
    .toBuffer();

  await sharp({
    create: { width: canvas.width, height: canvas.height, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 0 } },
  })
    .composite([{ input: resized, gravity: "centre" }])
    .png()
    .toFile(destination);

  return { canvas: `${canvas.width}x${canvas.height}`, drawn: `${drawnWidth}x${drawnHeight}`, scale: +scale.toFixed(2) };
}

/** PNG-ul „mare” este chiar sigla, plus 3% aer: cardul rămâne pătrat, sigla îl umple */
function tightCanvas(width, height) {
  const scale = MARE_LATURA_MAX * (1 - 2 * MARE_AER) / Math.max(width, height);
  return {
    width: Math.round(width * scale / (1 - 2 * MARE_AER)),
    height: Math.round(height * scale / (1 - 2 * MARE_AER)),
  };
}

rmSync(targetDir, { recursive: true, force: true });
mkdirSync(targetDir, { recursive: true });
rmSync(workDir, { recursive: true, force: true });

const rows = [];
for (const entry of MANIFEST) {
  const source = path.join(sourceDir, entry.file);
  if (!existsSync(source)) {
    rows.push({ fisier: entry.file, sigla: "—", status: "LIPSEȘTE din public/logos" });
    continue;
  }

  const decoded = await decode(prepareSource(entry, source));
  const full = { left: 0, top: 0, width: decoded.width, height: decoded.height };
  // prag 128: ignoră umbrele semi-transparente de la scanări/exportări când
  // calculăm limitele siglei
  let image = crop(decoded.data, decoded.width, alphaBox(decoded.data, decoded.width, decoded.height, 128) ?? full);

  const border = borderColor(image.data, image.width, image.height);
  const whiteBackground = Boolean(border && border.share >= 0.2 && isNearWhite(border.r, border.g, border.b));
  if (whiteBackground) {
    clearWhiteBackground(image.data, image.width, image.height);
    const box = alphaBox(image.data, image.width, image.height, 40);
    if (box) image = crop(image.data, image.width, box);
  }

  const { canvas, drawn, scale } = await toCanvas(image, path.join(targetDir, `${entry.slug}.png`), {
    mare: Boolean(entry.mare),
  });
  rows.push({
    fisier: entry.file,
    sigla: `${image.width}x${image.height}`,
    canvas,
    desen: drawn,
    fundal: whiteBackground ? "alb îndepărtat" : "păstrat",
    scale,
    iesire: `partners/${entry.slug}.png`,
  });
}

console.table(rows);
console.log(
  `\n${rows.filter((row) => row.iesire).length} logo-uri normalizate în public/logos/partners/` +
    ` (canvas comun ${CANVAS.width}x${CANVAS.height}, iar cele „mare” pe canvas strâns pe siglă).`,
);
