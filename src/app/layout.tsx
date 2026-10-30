import type { Metadata } from "next";
import { Lato, Playfair_Display } from "next/font/google";
import { LanguageProvider } from "@/i18n/provider";
import "./globals.css";

const displayFont = Playfair_Display({
  variable: "--font-display",
  subsets: ["latin", "latin-ext", "cyrillic"],
  style: ["normal", "italic"],
});

// Lato nu are cyrillic pe Google Fonts; caracterele chirilice din body
// folosesc fallback-ul din font-family (stack-ul de sistem din globals.css).
const bodyFont = Lato({
  variable: "--font-body",
  subsets: ["latin", "latin-ext"],
  weight: ["400", "700", "900"],
});

export const metadata: Metadata = {
  title: "Farmavet — Produse veterinare și sănătate animală",
  description:
    "Farmavet oferă produse veterinare certificate, nutriție pentru animale, suplimente și consultanță profesională în Republica Moldova.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="ro" data-scroll-behavior="smooth" className={`${displayFont.variable} ${bodyFont.variable}`}>
      <body>
        <LanguageProvider>{children}</LanguageProvider>
      </body>
    </html>
  );
}
