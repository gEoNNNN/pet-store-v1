import "server-only";

import { existsSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { head, put } from "@vercel/blob";

/**
 * Sursa de adevăr pentru cataloagele JSON: Vercel Blob când store-ul e conectat
 * (sau există token read-write), altfel fișierele locale din scrape/.
 */

/** Tag de cache Next pentru fișierele de catalog; invalidat după fiecare salvare. */
export const CATALOG_TAG = "catalog";

const BLOB_PREFIX = "catalog/";

/**
 * Blob e disponibil dacă există token read-write (local / proiecte vechi) sau
 * un store conectat prin OIDC: Vercel injectează BLOB_STORE_ID și tokenul
 * VERCEL_OIDC_TOKEN, pe care SDK-ul le citește singur.
 */
export function blobEnabled(): boolean {
  return Boolean(process.env.BLOB_READ_WRITE_TOKEN || process.env.BLOB_STORE_ID);
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
    try {
      const meta = await head(BLOB_PREFIX + fileName);
      const response = await fetch(`${meta.url}?v=${new Date(meta.uploadedAt).getTime()}`, {
        cache: "force-cache",
        next: { tags: [CATALOG_TAG] },
      });
      if (response.ok) return await response.text();
      console.error(`[blob] ${fileName}: răspuns ${response.status}, folosesc copia locală.`);
    } catch (error) {
      // Primul deploy (blob-ul nu există încă) sau acreditări indisponibile:
      // site-ul continuă cu fișierul din repo; salvările semnalează eroarea.
      console.error(`[blob] ${fileName}:`, error);
    }
  }
  return readFileSync(catalogLocalPath(fileName), "utf8");
}

/** Scrie un catalog (Blob în producție, fișier local în dezvoltare). */
export async function writeCatalogText(fileName: string, text: string): Promise<void> {
  if (blobEnabled()) {
    // Compact, fără indentare: cache-ul de date Next nu păstrează răspunsuri
    // peste 2 MB, iar carnilove depășește limita dacă e scris indentat.
    try {
      await put(BLOB_PREFIX + fileName, JSON.stringify(JSON.parse(text)), {
        access: "public",
        addRandomSuffix: false,
        allowOverwrite: true,
        contentType: "application/json",
      });
    } catch (error) {
      throw new Error(
        `Scrierea în Vercel Blob a eșuat: ${error instanceof Error ? error.message : String(error)}`,
      );
    }
    return;
  }
  writeFileSync(catalogLocalPath(fileName), text, "utf8");
}
