import "server-only";

import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { put } from "@vercel/blob";
import { blobEnabled } from "@/lib/catalogStore";

/**
 * Imaginile urcate din panou: pe Vercel ajung în Vercel Blob (URL public), local
 * se salvează în data/uploads și sunt servite de ruta /uploads/[file].
 * Nu le punem în public/ pentru că Next.js listează public/ doar la pornire,
 * deci fișierele adăugate după build nu ar fi servite.
 */

/**
 * 4 MB: peste limita de 4,5 MB pe care Vercel o impune corpului cererii către
 * o funcție (server action). Pentru poze mai mari ar trebui upload direct din
 * browser în Blob.
 */
export const MAX_UPLOAD_BYTES = 4 * 1024 * 1024;

const TYPES: Record<string, string> = {
  "image/jpeg": ".jpg",
  "image/png": ".png",
  "image/webp": ".webp",
  "image/avif": ".avif",
  "image/gif": ".gif",
};

const NAME_RE = /^[a-z0-9-]+\.(jpg|png|webp|avif|gif)$/i;

function uploadDirectory(): string {
  const dir = path.join(process.cwd(), "data", "uploads");
  mkdirSync(dir, { recursive: true });
  return dir;
}

/** Salvează fișierul încărcat și întoarce URL-ul imaginii. */
export async function storeUpload(
  file: File,
  slug: string,
): Promise<{ url: string } | { error: string }> {
  const ext = TYPES[file.type];
  if (!ext) return { error: "Format acceptat: JPG, PNG, WEBP, AVIF sau GIF." };
  if (file.size === 0) return { error: "Fișierul ales este gol." };
  if (file.size > MAX_UPLOAD_BYTES) return { error: "Imaginea depășește 4 MB." };

  const base = slug.replace(/[^a-z0-9-]/gi, "").slice(0, 60) || "produs";
  const name = `${base}-${Date.now()}${ext}`;

  if (blobEnabled()) {
    try {
      const blob = await put(`uploads/${name}`, file, {
        access: "public",
        addRandomSuffix: true,
        contentType: file.type,
      });
      return { url: blob.url };
    } catch (error) {
      return {
        error: `Încărcarea în Vercel Blob a eșuat: ${error instanceof Error ? error.message : String(error)}`,
      };
    }
  }

  writeFileSync(path.join(uploadDirectory(), name), Buffer.from(await file.arrayBuffer()));
  return { url: `/uploads/${name}` };
}

/** Citește un fișier urcat local; null dacă numele nu e valid sau lipsește. */
export function readUpload(name: string): { body: Buffer; type: string } | null {
  if (!NAME_RE.test(name)) return null;
  const file = path.join(uploadDirectory(), name);
  if (!existsSync(file)) return null;
  const type = Object.entries(TYPES).find(([, ext]) => name.toLowerCase().endsWith(ext))?.[0];
  return { body: readFileSync(file), type: type ?? "application/octet-stream" };
}
