import type { Metadata } from "next";
import FoodCalculator from "@/components/FoodCalculator";
import ToolPageShell from "@/components/ToolPageShell";

export const metadata: Metadata = {
  title: "Calculator de hrană pentru câini și pisici | Farmavet",
  description: "Estimează necesarul zilnic de calorii și cantitatea orientativă de hrană pentru câinele sau pisica ta.",
};

export default function FoodCalculatorPage() {
  return (
    <ToolPageShell
      eyebrow="Calculator de hrană"
      title="Câtă hrană îi trebuie zilnic?"
      description="Introdu greutatea, vârsta, activitatea și energia hranei pentru a obține un punct de plecare adaptat animalului tău."
    >
      <FoodCalculator />
    </ToolPageShell>
  );
}
