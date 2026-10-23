import {
  Activity,
  Baby,
  Bandage,
  Bug,
  Crosshair,
  Droplets,
  Pill,
  ShieldCheck,
  Sparkles,
  Syringe,
  Wheat,
  type LucideIcon,
} from "lucide-react";

export interface VeterinaryCategoryItem {
  id: string;
  number: string;
  tag: string;
  title: string;
  description: string;
  href: string;
  icon: LucideIcon;
}

export const vetCategories: VeterinaryCategoryItem[] = [
  {
    id: "antibacteriene",
    number: "01",
    tag: "Tratamente",
    title: "Antibacteriene și antifungice",
    description: "Soluții antimicrobiene, antibiotice injectabile și suspensii pentru infecții bacteriene și micotice.",
    href: "/produse?cat=Antibacteriene+%C8%99i+antifungice",
    icon: Pill,
  },
  {
    id: "antiparazitare",
    number: "02",
    tag: "Prevenție",
    title: "Antiparazitare interne și externe",
    description: "Comprimate masticabile, soluții spot-on, pour-on și zgărzi de protecție împotriva puricilor și căpușelor.",
    href: "/produse?cat=Antiparazitare+interne+%C8%99i+externe",
    icon: Bug,
  },
  {
    id: "antiinflamatoare",
    number: "03",
    tag: "Terapie",
    title: "Antiinflamatoare și analgezice",
    description: "Antiinflamatorii nesteroidiene și analgezice rapide pentru recuperare și afecțiuni articulare.",
    href: "/produse?cat=Antiinflamatoare+%C8%99i+analgezice",
    icon: Activity,
  },
  {
    id: "antiseptice",
    number: "04",
    tag: "Chirurgie & Dermato",
    title: "Antiseptice și produse pentru rănilor",
    description: "Spray-uri cicatrizante, pudre antiseptice, unguente protectoare și dezinfectanți tisulari.",
    href: "/produse?cat=Antiseptice+%C8%99i+produse+pentru+%C3%AEngrijirea+r%C4%83nilor",
    icon: Bandage,
  },
  {
    id: "tonice",
    number: "05",
    tag: "Metabolism",
    title: "Tonice și rehidratare",
    description: "Soluții electrolitice, complexe energizante cu aminoacizi și hepatoprotectoare de refacere.",
    href: "/produse?cat=Tonice+%C8%99i+produse+pentru+rehidratare",
    icon: Droplets,
  },
  {
    id: "reproductie",
    number: "06",
    tag: "Zootehnie",
    title: "Reproducție și glandă mamară",
    description: "Tratamente intramamare de lactație și repaus, dezinfectanți pentru mameloane și reglatori.",
    href: "/produse?cat=Produse+pentru+reproduc%C8%9Bie+%C8%99i+s%C4%83n%C4%83tatea+glandei+mamare",
    icon: Baby,
  },
  {
    id: "vaccinuri",
    number: "07",
    tag: "Imunologie",
    title: "Vaccinuri și biologice",
    description: "Imunoprofilaxie avansată, seruri hiperimune și vaccinuri pentru fermă și animale de companie.",
    href: "/produse?cat=Vaccinuri+%C8%99i+alte+produse+biologice",
    icon: Syringe,
  },
  {
    id: "imunostimulatoare",
    number: "08",
    tag: "Profilaxie",
    title: "Imunostimulatoare",
    description: "Activatori biologici ai apărării naturale, probiotice și suport de rezistență la boli.",
    href: "/produse?cat=Imunostimulatoare",
    icon: ShieldCheck,
  },
  {
    id: "vitamine",
    number: "09",
    tag: "Nutriție & Furaje",
    title: "Vitamine, minerale și premixuri",
    description: "Complexe vitaminice hidrosolubile, calciu, magneziu, oligoelemente și premixuri furajere.",
    href: "/produse?cat=Vitamine%2C+minerale+%C8%99i+premixuri",
    icon: Wheat,
  },
  {
    id: "igiena",
    number: "10",
    tag: "Biosecuritate",
    title: "Curățare, igienă și dezinfecție",
    description: "Detergenți, degresanți, dezinfectanți și soluții profesionale de igienizare a spațiilor.",
    href: "/produse?cat=Cur%C4%83%C8%9Bare%2C+igien%C4%83+%C8%99i+dezinfec%C8%9Bie",
    icon: Sparkles,
  },
  {
    id: "dezinsectie",
    number: "11",
    tag: "Control Dăunători",
    title: "Dezinsecție și deratizare",
    description: "Insecticide profesionale, momeli raticide parafinate și soluții complete de protecție a efectivelor.",
    href: "/produse?cat=Dezinsec%C8%9Bie+%C8%99i+deratizare",
    icon: Crosshair,
  },
];
