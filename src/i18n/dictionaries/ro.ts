// Dicționarul românesc — sursa de adevăr. Structura: noduri frunză (șiruri)
// accesate prin `t("cale.către.cheie")`; lipsurile din en/ru cad în ro.

const ro = {
  common: {
    skipToContent: "Sari la conținut",
    starsAria: "5 din 5 stele",
    speciesNav: "Categorii de animale",
    address: "Petricani 198, Chișinău, Moldova",
  },
  logo: {
    tagline: "Sănătate animală",
  },
  nav: {
    home: "Acasa",
    about: "Despre noi",
    products: "Produse",
    tools: "Instrumente",
    categoriesLabel: "Categorii de produse",
    viewAllProducts: "Vezi toate produsele",
    contact: "Contactează-ne",
    brandAria: "Farmavet — pagina principală",
    mainNav: "Navigare principală",
    mobileNav: "Navigare mobilă",
    closeMenu: "Închide meniul",
    openMenu: "Deschide meniul",
    languageLabel: "Schimbă limba",
  },
  hero: {
    overline: "Farmacie & Nutriție Veterinară",
    titleTop: "Excelență în",
    titleEm: "sănătatea animalelor.",
    lede:
      "Catalog online cu produse veterinare certificate și nutriție echilibrată — pentru animalele de fermă și companionii de acasă. Răsfoiește portofoliul complet de branduri internaționale, cu informații detaliate pentru fiecare produs.",
    cta: "Descoperă portofoliul",
    about: "Despre Farmavet",
    altDogCat: "Câine și pisică - animale de companie",
    altCattle: "Viței - bovine",
    altRabbit: "Iepure - rozătoare",
    altSheep: "Oaie - ovine",
  },
  partners: {
    kicker: "Partenerii noștri",
    title: "Branduri de încredere, alături de noi",
    loopAria: "Branduri partenere Farmavet",
    altPartner: "Partener Farmavet",
  },
  vetGrid: {
    titleTop: "11 categorii esențiale",
    titleEm: "pentru sănătatea animalelor",
    sub:
      "Gama completă de produse veterinare autorizate, tratamente profilactice și soluții profesionale de igienă — structurate compact și accesibile direct în catalog.",
    ctaConsult: "Consultanță veterinară",
    cardCta: "Vezi gama",
    featured: {
      tag: "Suport Specializat",
      title: "Consultanță și rețete",
      desc:
        "Ai nevoie de o schemă terapeutică sau verificarea unui stoc? Medicii noștri îți oferă asistență directă.",
      cta: "Discută cu un medic",
    },
  },
  vetCard: {
    antibacteriene: {
      tag: "Tratamente",
      title: "Antibacteriene și antifungice",
      desc:
        "Soluții antimicrobiene, antibiotice injectabile și suspensii pentru infecții bacteriene și micotice.",
    },
    antiparazitare: {
      tag: "Prevenție",
      title: "Antiparazitare interne și externe",
      desc:
        "Comprimate masticabile, soluții spot-on, pour-on și zgărzi de protecție împotriva puricilor și căpușelor.",
    },
    antiinflamatoare: {
      tag: "Terapie",
      title: "Antiinflamatoare și analgezice",
      desc:
        "Antiinflamatorii nesteroidiene și analgezice rapide pentru recuperare și afecțiuni articulare.",
    },
    antiseptice: {
      tag: "Chirurgie & Dermato",
      title: "Antiseptice și produse pentru rănilor",
      desc:
        "Spray-uri cicatrizante, pudre antiseptice, unguente protectoare și dezinfectanți tisulari.",
    },
    tonice: {
      tag: "Metabolism",
      title: "Tonice și rehidratare",
      desc:
        "Soluții electrolitice, complexe energizante cu aminoacizi și hepatoprotectoare de refacere.",
    },
    reproductie: {
      tag: "Zootehnie",
      title: "Reproducție și glandă mamară",
      desc:
        "Tratamente intramamare de lactație și repaus, dezinfectanți pentru mameloane și reglatori.",
    },
    vaccinuri: {
      tag: "Imunologie",
      title: "Vaccinuri și biologice",
      desc:
        "Imunoprofilaxie avansată, seruri hiperimune și vaccinuri pentru fermă și animale de companie.",
    },
    imunostimulatoare: {
      tag: "Profilaxie",
      title: "Imunostimulatoare",
      desc:
        "Activatori biologici ai apărării naturale, probiotice și suport de rezistență la boli.",
    },
    vitamine: {
      tag: "Nutriție & Furaje",
      title: "Vitamine, minerale și premixuri",
      desc:
        "Complexe vitaminice hidrosolubile, calciu, magneziu, oligoelemente și premixuri furajere.",
    },
    igiena: {
      tag: "Biosecuritate",
      title: "Curățare, igienă și dezinfecție",
      desc:
        "Detergenți, degresanți, dezinfectanți și soluții profesionale de igienizare a spațiilor.",
    },
    dezinsectie: {
      tag: "Control Dăunători",
      title: "Dezinsecție și deratizare",
      desc:
        "Insecticide profesionale, momeli raticide parafinate și soluții complete de protecție a efectivelor.",
    },
  },
  cats: {
    titleTop: "Soluții veterinare",
    titleEm: "pentru fiecare specie",
    sub:
      "Explorează categoriile disponibile și descoperă informațiile complete pentru produsele din catalogul Farmavet.",
  },
  species: {
    "Animale de companie": {
      title: "Animale de companie",
      desc: "Nutriție, suplimente și îngrijire pentru câini și pisici.",
    },
    Bovine: {
      title: "Bovine",
      desc: "Produse profesionale pentru sănătate și productivitate.",
    },
    Ovine: {
      title: "Ovine",
      desc: "Soluții dedicate îngrijirii și bunăstării efectivelor.",
    },
    Păsări: {
      title: "Păsări",
      desc: "Nutriție și prevenție pentru păsări sănătoase.",
    },
    Porcine: {
      title: "Porcine",
      desc: "Îngrijire completă pentru fiecare etapă de creștere.",
    },
  },
  why: {
    titleTop: "Încredere construită prin",
    titleEm: "grijă și profesionalism",
    visualLabel: "Grijă expertă, la fiecare pas.",
    imgAlt: "Magazin Farmavet",
    lede:
      "Farmavet pune la dispoziția ta un catalog online cu produse veterinare certificate — tu răsfoiești și alegi cu încredere, noi îți oferim informațiile de care ai nevoie pentru fiecare produs în parte.",
    assurance1Title: "Produse verificate",
    assurance1Text:
      "Colaborăm cu furnizori de încredere și branduri internaționale.",
    assurance2Title: "Informații complete",
    assurance2Text:
      "Ingrediente, valori nutriționale, gramaje și ghiduri de hrănire pentru fiecare produs.",
    cta: "Discută cu echipa noastră",
  },
  testimonials: {
    titleTop: "Ce spun oamenii despre",
    titleEm: "Farmavet",
    ratingLabel: "Notă generală pe Google",
    intro: "Experiențe împărtășite de clienții care ne-au vizitat magazinul.",
    mapLink: "Vezi locația pe Google Maps",
    reviews: [
      {
        role: "Local Guide · 27 de recenzii · 153 de fotografii",
        date: "acum 4 ani",
        text:
          "Totul pentru animale. Pentru animale de companie este o gamă largă de mâncăruri la cel mai ieftin preț din țară.",
      },
      {
        role: "Local Guide · 34 de recenzii · 189 de fotografii",
        date: "acum 5 ani",
        text: "Produse calitative la preț accesibil și deservire rapidă.",
      },
      {
        role: "Local Guide · 49 de recenzii · 54 de fotografii",
        date: "acum 6 ani",
        text:
          "Un loc unde găsești o gamă variată de medicamente de uz veterinar.",
      },
      {
        role: "Local Guide · 154 de recenzii · 408 fotografii",
        date: "acum o lună",
        text:
          "Cele mai mici prețuri la hrana pentru câini din Chișinău, printre magazinele de unde am cumpărat sau verificat prețurile anterior. Întotdeauna există un loc de parcare!",
      },
      {
        role: "9 recenzii · O fotografie",
        date: "acum 6 ani",
        text:
          "Puteți găsi aici tot felul de medicamente la prețuri bune. Clădirea este frumoasă, personalul este prietenos și explică totul clar. Recomand!",
      },
      {
        role: "Local Guide · 126 de recenzii · 798 de fotografii",
        date: "acum 6 ani",
        text:
          "Cumpărăm doar mâncare, vitamine și dulciuri de acolo. Cele mai bune prețuri, servicii excelente, mereu mulțumiți! Recomand cu căldură!",
      },
      {
        role: "Local Guide · 6 recenzii · 132 de fotografii",
        date: "acum 7 ani",
        text:
          "Mulțumesc pentru sfaturi și ajutor. Ieftin și de înaltă calitate!",
      },
      {
        role: "Local Guide · 21 de recenzii · 2 fotografii",
        date: "acum 6 ani",
        text:
          "Mulțumim angajaților pentru profesionalism și efortul depus pentru deservirea clienților.",
      },
    ],
  },
  contact: {
    titleTop: "Discută cu echipa",
    titleEm: "Farmavet",
    sub:
      "Ai întrebări despre un produs sau dieta potrivită pentru animalul tău? Echipa noastră îți stă la dispoziție cu informații și recomandări.",
    labelAddress: "Adresă",
    labelPhone: "Telefon",
    labelEmail: "Email",
    labelProgram: "Program",
    program: "Luni – Sâmbătă: 9:00 – 19:00",
    mapsTitle: "Locația Farmavet pe Google Maps",
    socialFacebook: "Farmavet pe Facebook",
    socialInstagram: "Farmavet pe Instagram",
  },
  form: {
    aria: "Formular de contact",
    name: "Nume",
    namePlaceholder: "Maria Popescu",
    email: "Email",
    emailPlaceholder: "maria@exemplu.com",
    phone: "Telefon",
    phonePlaceholder: "+373 79 000 000",
    subject: "Subiect",
    subjectPlaceholder: "Întrebare despre un produs",
    message: "Mesaj",
    messagePlaceholder: "Cum te putem ajuta pe tine și animalul tău?",
    sending: "Se trimite…",
    submit: "Trimite mesajul",
    success: "Îți mulțumim! Îți vom răspunde în cel mult o zi lucrătoare.",
  },
  footer: {
    blurb:
      "Produse veterinare certificate, consultanță profesională și servicii construite în jurul sănătății animalelor.",
    colProducts: "Produse",
    productLinks: [
      "Produse veterinare",
      "Nutriție animală",
      "Suplimente",
      "Îngrijire și prevenție",
    ],
    colSpecies: "Specii animale",
    speciesLinks: [
      "Animale de companie",
      "Bovine",
      "Ovine",
      "Păsări",
      "Porcine",
    ],
    colInfo: "Informații",
    infoAbout: "Despre noi",
    infoBrands: "Branduri",
    infoTools: "Instrumente",
    infoContact: "Contact",
    colContact: "Contact",
    copyright: "© 2026 Farmavet. Toate drepturile rezervate.",
    privacy: "Politica de confidențialitate",
    terms: "Termeni și condiții",
  },
  tools: {
    sectionTitle: "Alegeri mai simple",
    sectionEm: "pentru îngrijirea animalului tău",
    list: {
      food: {
        title: "Calculator de hrană",
        subtitle:
          "Estimează necesarul zilnic de energie și cantitatea orientativă de hrană pentru câine sau pisică.",
      },
      health: {
        title: "Nivel de sănătate",
        subtitle:
          "Evaluează condiția corporală, greutatea ideală și nivelul general de sănătate al animalului tău.",
      },
      finder: {
        title: "Găsește produsul potrivit",
        subtitle:
          "Răspunde la trei întrebări și descoperă produse reale din catalog potrivite nevoilor animalului.",
      },
    },
  },
  toolsHero: {
    titleTop: "Instrumente",
    titleEm: "pentru sănătate",
    sub:
      "Am creat o suită de instrumente inteligente pentru a vă ajuta să monitorizați și să optimizați starea de bine a animalului dumneavoastră de companie.",
    cta: "Descopera instrumentele",
    secondary: "Află mai multe",
    imgAlt: "Îngrijire și evaluare veterinară pentru animale de companie",
  },
  instrumente: {
    food: {
      kicker: "Calculator nutrițional",
      title: "Calculator de hrană",
      description:
        "Introdu greutatea, vârsta, nivelul de activitate și conținutul caloric al hranei pentru a estima porția optimă zilnică.",
    },
    health: {
      kicker: "Evaluare corporală",
      title: "Nivel de sănătate (Scor BCS)",
      description:
        "Evaluează condiția corporală actuală a animalului tău, greutatea recomandată și primește sfaturi orientative de nutriție.",
    },
    finder: {
      kicker: "Ghid de recomandare",
      title: "Găsește produsul potrivit",
      description:
        "Răspunde la trei întrebări simple pentru a descoperi recomandări personalizate din catalogul real Farmavet.",
    },
  },
  toolPages: {
    food: {
      eyebrow: "Calculator de hrană",
      title: "Câtă hrană îi trebuie zilnic?",
      description:
        "Introdu greutatea, vârsta, activitatea și energia hranei pentru a obține un punct de plecare adaptat animalului tău.",
    },
    health: {
      eyebrow: "Nivel de sănătate",
      title: "Ce nivel de sănătate are animalul tău?",
      description:
        "Introdu greutatea actuală și scorul corporal BCS pentru a afla nivelul de sănătate, greutatea ideală și recomandările orientative.",
    },
    finder: {
      eyebrow: "Recomandare produse",
      title: "Găsește produsul potrivit",
      description:
        "Selectează animalul, scopul și etapa de viață. Recomandările sunt alese din produsele reale disponibile în catalog.",
    },
    home: "Acasa",
    tools: "Instrumente",
    breadcrumbsAria: "Navigare contextuală",
  },
  foodTool: {
    panelTitle: "Datele animalului",
    animal: "Animal",
    dog: "Câine",
    cat: "Pisică",
    weight: "Greutate (kg)",
    age: "Vârstă (ani)",
    ageHint: "Ex: 0,5 ani pentru 6 luni",
    activity: "Nivel de activitate",
    low: "Scăzută",
    normal: "Normală",
    high: "Ridicată",
    energy: "Energia hranei (kcal/100 g)",
    energyHint:
      "Valoarea se găsește pe ambalaj. Am completat orientativ 380 kcal/100 g.",
    resultLabel: "Necesar zilnic estimat",
    gramsPerDay: "grame/zi",
    energyShort: "Energie",
    kcalPerDay: "kcal/zi",
    portioning: "Porționare",
    mealsX: "{meals} mese × {grams} g",
    disclaimer:
      "Estimarea pornește de la formula RER = 70 × kg⁰·⁷⁵ și este un punct de plecare. Necesarul real poate varia considerabil în funcție de sterilizare, rasă, stare corporală și sănătate. Ajustează porția împreună cu medicul veterinar.",
    sourceRer: "Sursa formulei RER",
    sourceWsava: "Ghidurile WSAVA",
  },
  bcsTool: {
    weightNow: "Greutate actuală (kg)",
    bcsLegend: "Scor corporal BCS (1–9)",
    bcsHint:
      "La 4–5/9 coastele se simt ușor, talia este vizibilă de sus, iar abdomenul este ridicat lateral.",
    evalDog: "Evaluare câine",
    evalCat: "Evaluare pisică",
    underweight: "Subponderal",
    ideal: "Ideal",
    overweight: "Supraponderal",
    idealWeight: "Greutate ideală",
    recommendedRange: "Interval recomandat",
    difference: "Diferență estimată",
    toLose: "de redus",
    toGain: "de câștigat",
    toMaintain: "de menținut",
    bcsScore: "Scor BCS",
    disclaimer:
      "Aceasta nu este o diagnoză. Estimarea folosește scorul corporal BCS, unde fiecare punct față de 5/9 reprezintă aproximativ 10%. Confirmă evaluarea prin examinare veterinară, mai ales la pui, animale gestante sau cu afecțiuni.",
    sourceScale: "Scala BCS WSAVA",
    sourceExpl: "Explicația BCS",
    levels: {
      "1": {
        label: "Risc ridicat — subponderal sever",
        advice:
          "Animalul necesită suplimentare nutritivă și evaluare veterinară urgentă.",
      },
      "2": {
        label: "Risc ridicat — subponderal",
        advice:
          "Animalul necesită un plan de câștig ponderal supravegheat.",
      },
      "3": {
        label: "Atenție — subponderal",
        advice:
          "Crește ușor porția și monitorizează greutatea săptămânal.",
      },
      "4": {
        label: "Aproape de ideal",
        advice:
          "Menține rutina actuală și verifică periodic condiția corporală.",
      },
      "5": {
        label: "Nivel de sănătate optim",
        advice:
          "Condiție corporală ideală. Continuă cu rutina și exercițiul actual.",
      },
      "6": {
        label: "Aproape de ideal — ușor peste",
        advice: "Reduce ușor porția și crește activitatea fizică.",
      },
      "7": {
        label: "Atenție — supraponderal",
        advice:
          "Implementează un plan de reducere ponderală treptată.",
      },
      "8": {
        label: "Risc ridicat — obezitate",
        advice:
          "Necesită plan nutrițional structurat și evaluare veterinară.",
      },
      "9": {
        label: "Risc ridicat — obezitate severă",
        advice:
          "Consultă medicul veterinar pentru un plan de slăbire supervizat.",
      },
    },
  },
  finder: {
    q1: "Pentru ce animal?",
    bovine: "Bovine",
    q2: "Care este scopul?",
    daily: "Hrană zilnică",
    growth: "Creștere",
    energy: "Energie",
    health: "Sănătate",
    q3: "Ce vârstă are?",
    junior: "Junior",
    adult: "Adult",
    senior: "Senior",
    resultsTitle: "Produse recomandate",
    resultsHint:
      "Potrivire orientativă după denumirea și descrierea produselor.",
    empty:
      "Nu am găsit produse potrivite în catalog pentru această selecție. Gama veterinară completă pentru bovine este disponibilă în filtrele „Farmacie veterinară\" de pe pagina de produse, sau contactează echipa Farmavet pentru informații despre stoc.",
  },
  catalog: {
    titleTop: "Nutriție premium,",
    titleEm: "pentru câini și pisici",
    intro:
      "Descoperă gamele complete Brit și Carnilove, cu ingrediente, valori nutriționale, gramaje și ghiduri de hrănire pentru fiecare produs în parte.",
    searchAria: "Caută produse",
    searchPlaceholder: "Caută după nume, ingredient, gramaj...",
    clearSearch: "Șterge căutarea",
    sortLabel: "Sortează",
    sortNameAsc: "Nume: A–Z",
    sortNameDesc: "Nume: Z–A",
    sortBrand: "După brand",
    filtersTitle: "Filtre",
    reset: "Reseteaza",
    groupSpecies: "Specie",
    groupPharmacy: "Farmacie veterinară",
    groupBrand: "Brand",
    allBrands: "Toate brandurile",
    kickerVet: "Farmacie Veterinară",
    kickerCatalog: "Catalog complet",
    resultsAll: "Toate produsele",
    forSpecies: {
      "Câini": "Produse pentru câini",
      "Pisici": "Produse pentru pisici",
      "Rozătoare": "Produse pentru rozătoare",
      "Păsări": "Produse pentru păsări",
      "Bovine": "Produse pentru bovine",
      "Ovine": "Produse pentru ovine",
      "Porcine": "Produse pentru porcine",
    },
    count: {
      one: "{n} produs găsit",
      many: "{n} produse găsite",
    },
    loadMore: "Încarcă mai multe produse",
    loadMoreShown: "Ai văzut {seen} din {total}",
    emptyTitle: "Nu am găsit produse",
    emptyText: "Încearcă un alt termen de căutare sau elimină filtrele active.",
    emptyReset: "Resetează filtrele",
    viewProduct: "Vezi produsul",
    viewProductAria: "Vezi {name}",
    fullDetails: "Detalii complete",
    vetBadge: "Farmacie Veterinară Farmavet",
    vetNoticeText:
      "Gama completă de medicamente, tratamente și produse autorizate pentru {category} este disponibilă direct în farmacia fizică Farmavet din Chișinău (str. Petricani 198). Pentru comenzi, verificarea stocurilor sau recomandarea unui medic veterinar, contactați-ne telefonic sau lăsați-ne un mesaj.",
    vetCall: "Comandă telefonic: 0795 36 508",
    vetStock: "Solicită informații stoc",
  },
  filters: {
    "Toate": "Toate",
    species: {
      "Câini": "Câini",
      "Pisici": "Pisici",
      "Rozătoare": "Rozătoare",
      "Păsări": "Păsări",
      "Bovine": "Bovine",
      "Ovine": "Ovine",
      "Porcine": "Porcine",
    },
    group: {
      "Hrană & Recompense": "Hrană & Recompense",
      "Accesorii & Plimbare": "Accesorii & Plimbare",
      "Igienă & Îngrijire": "Igienă & Îngrijire",
    },
    productType: {
      "Hrană uscată câini": "Hrană uscată câini",
      "Hrană uscată pisici": "Hrană uscată pisici",
      "Plicuri câini": "Plicuri câini",
      "Plicuri pisici": "Plicuri pisici",
      "Conserve câini": "Conserve câini",
      "Conserve pisici": "Conserve pisici",
      "Recompense câini": "Recompense câini",
      "Recompense pisici": "Recompense pisici",
      "Zgărzi pentru câini": "Zgărzi pentru câini",
      "Zgărzi pentru pisici": "Zgărzi pentru pisici",
      "Hamuri pentru câini": "Hamuri pentru câini",
      "Hamuri pentru pisici": "Hamuri pentru pisici",
      "Lese pentru câini": "Lese pentru câini",
      "Paturi și culușuri": "Paturi și culușuri",
      "Castroane și boluri": "Castroane și boluri",
      "Accesorii din plastic": "Accesorii din plastic",
      "Jucării pentru pisici": "Jucării pentru pisici",
      "Cuști de transport": "Cuști de transport",
      "Târcuri și parcuri de joacă": "Târcuri și parcuri de joacă",
      "Așternut pentru rozătoare": "Așternut pentru rozătoare",
      "Perii, piepteni și îngrijirea blănii":
        "Perii, piepteni și îngrijirea blănii",
      "Cosmetice și îngrijire": "Cosmetice și îngrijire",
      "Nisip pentru pisici": "Nisip pentru pisici",
      "Litieră și accesorii": "Litieră și accesorii",
      "Îngrijire și igienă": "Îngrijire și igienă",
    },
    vetCategory: {
      "Antibacteriene și antifungice":
        "Antibacteriene și antifungice",
      "Antiparazitare interne și externe":
        "Antiparazitare interne și externe",
      "Antiinflamatoare și analgezice":
        "Antiinflamatoare și analgezice",
      "Antiseptice și produse pentru îngrijirea rănilor":
        "Antiseptice și produse pentru îngrijirea rănilor",
      "Tonice și produse pentru rehidratare":
        "Tonice și produse pentru rehidratare",
      "Produse pentru reproducție și sănătatea glandei mamare":
        "Produse pentru reproducție și sănătatea glandei mamare",
      "Vaccinuri și alte produse biologice":
        "Vaccinuri și alte produse biologice",
      "Imunostimulatoare": "Imunostimulatoare",
      "Vitamine, minerale și premixuri":
        "Vitamine, minerale și premixuri",
      "Curățare, igienă și dezinfecție":
        "Curățare, igienă și dezinfecție",
      "Dezinsecție și deratizare": "Dezinsecție și deratizare",
    },
  },
  detail: {
    breadcrumbsAria: "Fir de navigare",
    home: "Acasa",
    products: "Produse",
    brand: "Brand",
    manufacturer: "Producător",
    category: "Categorie",
    variants: "Variante",
    metabolizableEnergy: "Energie metabolizabilă",
    labelsAria: "Etichete produs",
    btnManufacturer: "Vezi produsul la producător",
    btnProspect: "Descarcă prospect (Word)",
    kickerFeatures: "Caracteristici",
    benefitsTitle: "Beneficiile produsului",
    kickerFull: "Fișa completă",
    infoTitle: "Informații despre produs",
    infoSub:
      "Datele de mai jos sunt preluate din catalogul oficial al producătorului.",
    feedingIntro:
      "Cantitățile sunt orientative. Ajustați porția în funcție de vârstă, greutate și nivelul de activitate și asigurați permanent apă proaspătă.",
    kickerIngredients: "Ingrediente atent alese",
    ingredientsTitle: "Ingrediente principale",
    ingredientFallback: "Ingredient",
    kickerGallery: "Galerie",
    galleryTitle: "Imagini produs",
    imageAlt: "{name} – imagine {index}",
    back: "Înapoi la toate produsele",
    productFallback: "Produs {index}",
  },
};

export type DictNode = string | DictNode[] | { [key: string]: DictNode };
export type RoDict = typeof ro;
export default ro;
