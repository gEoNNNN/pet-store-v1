export type ProductCategory = {
  title: string;
  image: string;
  href: string;
};

export const productCategories: ProductCategory[] = [
  {
    title: "Animale de companie",
    image: "/cards/animale-de-companie.jpeg",
    href: "/produse",
  },
  {
    title: "Bovine",
    image: "/cards/bovine.jpeg",
    href: "/produse",
  },
  {
    title: "Ovine",
    image: "/cards/ovine.jpg",
    href: "/produse",
  },
  {
    title: "Pasari",
    image: "/cards/pasari.jpeg",
    href: "/produse",
  },
  {
    title: "Porcine",
    image: "/cards/porcine.jpg",
    href: "/produse",
  },
];
