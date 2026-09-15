import type { Metadata } from "next";
import HealthLevelCalculator from "@/components/HealthLevelCalculator";
import ToolPageShell from "@/components/ToolPageShell";

export const metadata: Metadata = {
  title: "Calculator nivel de sănătate pentru animale | Farmavet",
  description: "Evaluează nivelul de sănătate, condiția corporală și greutatea ideală a câinelui sau pisicii folosind scorul BCS.",
};

export default function HealthLevelPage() {
  return (
    <ToolPageShell
      eyebrow="Nivel de sănătate"
      title="Ce nivel de sănătate are animalul tău?"
      description="Introdu greutatea actuală și scorul corporal BCS pentru a afla nivelul de sănătate, greutatea ideală și recomandările orientative."
    >
      <HealthLevelCalculator />
    </ToolPageShell>
  );
}
