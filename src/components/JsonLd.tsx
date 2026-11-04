/**
 * Randomizează JSON-LD ca <script type="application/ld+json"> în HTML-ul
 * server-side (recomandarea Next 16 pentru date structurate: randare nativă
 * în HTML, nu prin next/script).
 *
 * Sanitizăm `<` pentru a preveni evadarea din script (XSS) în payload-uri
 * generate din date de catalog.
 */
export default function JsonLd({ data }: { data: object | object[] }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}
