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
    image: "/cards/animale decomponie.jpeg",
    href: "/produse?cat=C%C3%A2ini",
  },
  {
    title: "Bovine",
    description: "Produse profesionale pentru sănătate și productivitate.",
    image: "/cards/bovine.jpeg",
    href: "/produse?cat=Bovine",
  },
  {
    title: "Ovine",
    description: "Soluții dedicate îngrijirii și bunăstării efectivelor.",
    image: "/cards/ovine.jpeg",
    href: "/produse?cat=Ovine",
  },
  {
    title: "Păsări",
    description: "Nutriție și prevenție pentru păsări sănătoase.",
    image: "/cards/pasari.jpeg",
    href: "/produse?cat=P%C4%83s%C4%83ri",
  },
  {
    title: "Porcine",
    description: "Îngrijire completă pentru fiecare etapă de creștere.",
    image: "/cards/porcine.jpeg",
    href: "/produse?cat=Porcine",
  },
];
