import type { Metadata } from "next";
import { Lato, Playfair_Display } from "next/font/google";
import "./globals.css";

const displayFont = Playfair_Display({
  variable: "--font-display",
  subsets: ["latin", "latin-ext"],
  style: ["normal", "italic"],
});

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
      <body>{children}</body>
    </html>
  );
}
