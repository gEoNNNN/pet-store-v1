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
  title: "NovaVet — Produse Veterinare & Îngrijire pentru Animale",
  description:
    "NovaVet este o farmacie veterinară modernă ce oferă produse veterinare certificate, nutriție pentru animale, suplimente și produse profesionale de îngrijire.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="ro" className={`${displayFont.variable} ${bodyFont.variable}`}>
      <body>{children}</body>
    </html>
  );
}
