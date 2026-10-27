/** Creează un slug sigur dintr-un nume de produs (asci, minuscul, cu liniuțe). */
export function slugifyName(input: string): string {
  return input
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}
