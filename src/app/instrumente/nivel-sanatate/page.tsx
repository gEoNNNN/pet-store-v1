import type { Metadata } from "next";
import HealthLevelCalculator from "@/components/HealthLevelCalculator";
import JsonLd from "@/components/JsonLd";
import ToolPageShell from "@/components/ToolPageShell";
import { toolBreadcrumbs } from "@/lib/schema";

export const metadata: Metadata = {
  title: "Calculator nivel de sănătate pentru animale",
  description:
    "Evaluează nivelul de sănătate, condiția corporală și greutatea ideală a câinelui sau pisicii folosind scorul BCS, cu recomandări de îngrijire.",
  alternates: { canonical: "/instrumente/nivel-sanatate" },
};

export default function HealthLevelPage() {
  return (
    <>
      <JsonLd data={toolBreadcrumbs("Nivel de sănătate", "/instrumente/nivel-sanatate")} />
      <ToolPageShell k="toolPages.health">
        <HealthLevelCalculator />
      </ToolPageShell>
    </>
  );
}
