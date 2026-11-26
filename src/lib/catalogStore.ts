import "server-only";

import { existsSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { BlobNotFoundError, head, put } from "@vercel/blob";

/**
 * Sursa de adevăr pentru cataloagele JSON: Vercel Blob când există token
 * (BLOB_READ_WRITE_TOKEN, injectat automat de Vercel când e conectat un store),
 * altfel fișierele locale din scrape/ — la fel ca înainte, pentru dezvoltare.
 */

/** Tag de cache Next pentru fișierele de catalog; invalidat după fiecare salvare. */
export const CATALOG_TAG = "catalog";

const BLOB_PREFIX = "catalog/";

/**
 * Blob e disponibil dacă există token read-write (local / proiecte vechi) sau
 * acreditările OIDC pe care Vercel le injectează când conectezi un store:
 * BLOB_STORE_ID + VERCEL_OIDC_TOKEN. SDK-ul le citește singur.
 */
export function blobEnabled(): boolean {
  return Boolean(
    process.env.BLOB_READ_WRITE_TOKEN ||
      (process.env.BLOB_STORE_ID && process.env.VERCEL_OIDC_TOKEN),
  );
}

/** Folderul local cu JSON-urile de catalog (fallback fără Blob). */
export function catalogLocalPath(fileName: string): string {
  const candidates = [
    path.resolve(process.cwd(), "scrape"),
    path.resolve(process.cwd(), "..", "scrape"),
    path.resolve(process.cwd(), "public", "scrape"),
  ];
  const directory = candidates.find((candidate) =>
    existsSync(path.join(candidate, "products.json")),
  );
  if (!directory) {
    throw new Error("Nu am găsit folderul scrape cu fișierele JSON ale produselor.");
  }
  return path.join(directory, fileName);
}

/** Citește un catalog ca text JSON. */
export async function readCatalogText(fileName: string): Promise<string> {
  if (blobEnabled()) {
    const meta = await head(BLOB_PREFIX + fileName).catch((error: unknown) => {
      // Primul deploy: blob-ul nu există încă, pornim de la fișierul din repo.
      if (error instanceof BlobNotFoundError) return null;
      throw error;
    });
    if (meta) {
      const response = await fetch(`${meta.url}?v=${new Date(meta.uploadedAt).getTime()}`, {
        cache: "force-cache",
        next: { tags: [CATALOG_TAG] },
      });
      if (!response.ok) {
        throw new Error(`Nu am putut citi ${fileName} din Vercel Blob (${response.status}).`);
      }
      return response.text();
    }
  }
  return readFileSync(catalogLocalPath(fileName), "utf8");
}

/** Scrie un catalog (Blob în producție, fișier local în dezvoltare). */
export async function writeCatalogText(fileName: string, text: string): Promise<void> {
  if (blobEnabled()) {
    // Compact, fără indentare: cache-ul de date Next nu păstrează răspunsuri
    // peste 2 MB, iar carnilove depășește limita dacă e scris indentat.
    await put(BLOB_PREFIX + fileName, JSON.stringify(JSON.parse(text)), {
      access: "public",
      addRandomSuffix: false,
      allowOverwrite: true,
      contentType: "application/json",
    });
    return;
  }
  writeFileSync(catalogLocalPath(fileName), text, "utf8");
}
