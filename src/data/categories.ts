export type ProductCategory = {
  title: string;
  description: string;
  image: string;
  href: string;
};

export const productCategories: ProductCategory[] = [
  {
    title: "Animale de companie",
    description: "Nutriție, suplimente și îngrijire pentru câini și pisici.",
    image: "/cards/animale-de-companie.jpeg",
    href: "/produse",
  },
  {
    title: "Bovine",
    description: "Produse profesionale pentru sănătate și productivitate.",
    image: "/cards/bovine.jpeg",
    href: "/produse",
  },
  {
    title: "Ovine",
    description: "Soluții dedicate îngrijirii și bunăstării efectivelor.",
    image: "/cards/ovine.jpg",
    href: "/produse",
  },
  {
    title: "Păsări",
    description: "Nutriție și prevenție pentru păsări sănătoase.",
    image: "/cards/pasari.jpeg",
    href: "/produse",
  },
  {
    title: "Porcine",
    description: "Îngrijire completă pentru fiecare etapă de creștere.",
    image: "/cards/porcine.jpg",
    href: "/produse",
  },
];
