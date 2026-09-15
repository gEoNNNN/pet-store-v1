import { CategoryList, type Category } from "./ui/category-list";

const tools: Category[] = [
  {
    id: "food",
    title: "Calculator de hrană",
    subtitle: "Estimează necesarul zilnic de energie și cantitatea orientativă de hrană pentru câine sau pisică.",
    href: "/instrumente/calculator-hrana",
    icon: "bowl",
    featured: true,
  },
  {
    id: "health",
    title: "Nivel de sănătate",
    subtitle: "Evaluează condiția corporală, greutatea ideală și nivelul general de sănătate al animalului tău.",
    href: "/instrumente/nivel-sanatate",
    icon: "heart",
  },
  {
    id: "finder",
    title: "Găsește produsul potrivit",
    subtitle: "Răspunde la trei întrebări și descoperă produse reale din catalog potrivite nevoilor animalului.",
    href: "/instrumente/recomandare-produse",
    icon: "compass",
  },
];

export default function ToolsSection({ headingLevel = "home" }: { headingLevel?: "home" | "page" }) {
  return (
    <CategoryList
      title="Alegeri mai simple"
      subtitle="pentru îngrijirea animalului tău"
      categories={tools}
      headingLevel={headingLevel === "page" ? "h1" : "h2"}
      isPage={headingLevel === "page"}
    />
  );
}
