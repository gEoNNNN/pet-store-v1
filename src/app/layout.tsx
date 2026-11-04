import type { Metadata, Viewport } from "next";
import { Lato, Playfair_Display } from "next/font/google";
import { LanguageProvider } from "@/i18n/provider";
import JsonLd from "@/components/JsonLd";
import { siteGraph } from "@/lib/schema";
import { site } from "@/lib/site";
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
  weight: ["400", "700", "900"],
  subsets: ["latin", "latin-ext"],
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} — Produse veterinare și hrană pentru animale în Chișinău`,
    template: `%s | ${site.name}`,
  },
  description: site.description,
  keywords: [
    "produse veterinare",
    "medicamente veterinare Moldova",
    "hrană pentru câini",
    "hrană pentru pisici",
    "antiparazitare interne și externe",
    "vitamine și suplimente pentru animale",
    "vaccinuri veterinare",
    "Brit",
    "Carnilove",
    "Farmavet Chișinău",
  ],
  authors: [{ name: site.legalName, url: site.social.facebook }],
  creator: site.legalName,
  publisher: site.legalName,
  category: "products",
  applicationName: site.name,
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    siteName: site.name,
    locale: site.ogLocale,
    alternateLocale: [...site.ogLocales],
    url: `${site.url}/`,
    title: `${site.name} — Produse veterinare și sănătate animală`,
    description: site.description,
  },
  twitter: {
    card: "summary_large_image",
    title: `${site.name} — Produse veterinare și sănătate animală`,
    description: site.description,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  manifest: "/manifest.webmanifest",
  formatDetection: {
    // Păstrăm controlul asupra link-urilor tel:/email: din conținut.
    email: false,
    address: false,
    telephone: false,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: site.colors.primary,
  colorScheme: "light",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="ro" data-scroll-behavior="smooth" className={`${displayFont.variable} ${bodyFont.variable}`}>
      <body>
        <JsonLd data={siteGraph()} />
        <LanguageProvider>{children}</LanguageProvider>
      </body>
    </html>
  );
}
