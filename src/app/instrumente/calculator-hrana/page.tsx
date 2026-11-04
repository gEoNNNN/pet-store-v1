import type { Metadata } from "next";
import FoodCalculator from "@/components/FoodCalculator";
import JsonLd from "@/components/JsonLd";
import ToolPageShell from "@/components/ToolPageShell";
import { toolBreadcrumbs } from "@/lib/schema";

export const metadata: Metadata = {
  title: "Calculator de hrană pentru câini și pisici",
  description:
    "Estimează necesarul zilnic de calorii și cantitatea orientativă de hrană pentru câinele sau pisica ta, în funcție de greutate, vârstă și nivel de activitate.",
  alternates: { canonical: "/instrumente/calculator-hrana" },
};

export default function FoodCalculatorPage() {
  return (
    <>
      <JsonLd data={toolBreadcrumbs("Calculator de hrană", "/instrumente/calculator-hrana")} />
      <ToolPageShell k="toolPages.food">
        <FoodCalculator />
      </ToolPageShell>
    </>
  );
}
