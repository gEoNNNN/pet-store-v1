/**
 * Sumarizează textul unui produs pentru locurile unde nu încape descrierea
 * completă (carduri din catalog, antetul paginii de produs). Descrierea
 * integrală rămâne vizibilă în secțiunea „Informații despre produs".
 */
export function summarizeText(text: string, maxChars = 140): string {
  const firstParagraph = (text.split(/\n+/).map((s) => s.trim()).filter(Boolean)[0] ?? "")
    .replace(/\s+/g, " ");
  if (firstParagraph.length <= maxChars) return firstParagraph;
  const window = firstParagraph.slice(0, maxChars + 1);
  const lastSentence = Math.max(
    window.lastIndexOf(". "),
    window.lastIndexOf("! "),
    window.lastIndexOf("? "),
  );
  if (lastSentence >= Math.floor(maxChars * 0.4)) return window.slice(0, lastSentence + 1);
  const lastSpace = window.lastIndexOf(" ");
  return `${window.slice(0, lastSpace > 40 ? lastSpace : maxChars).replace(/[,;:.]$/, "")}…`;
}
