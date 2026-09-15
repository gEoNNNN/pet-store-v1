import type { Metadata } from "next";
import ToolsSection from "@/components/ToolsSection";

export const metadata: Metadata = {
  title: "Instrumente pentru îngrijirea animalelor | Farmavet",
  description: "Calculatoare orientative de hrană și greutate corporală, plus recomandări de produse din catalogul Farmavet.",
};

export default function ToolsPage() {
  return (
    <main id="main">
      <ToolsSection headingLevel="page" />
    </main>
  );
}
