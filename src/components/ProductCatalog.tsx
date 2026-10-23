"use client";

import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  petCategoryNames,
  productBrandNames,
  productTypeFilterGroups,
  veterinaryCategoryNames,
  type ProductSummary,
} from "@/data/products";
import {
  ArrowRightIcon,
  CloseIcon,
  PhoneIcon,
  SearchIcon,
} from "./icons";

function ChevronIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}
import styles from "./ProductCatalog.module.css";

const INITIAL_VISIBLE_PRODUCTS = 12;
const LOAD_MORE_COUNT = 12;
function normalizeText(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLocaleLowerCase("ro-RO");
}

// Afisare fara diacritice in filtre (fontul nu le reda bine), filtrarea ramane pe valorile originale
function displayLabel(value: string) {
  return value.normalize("NFD").replace(/[̀-ͯ]/g, "");
}

// Reduce cuvintele la radacina: „caini/caine/cainilor” → „cain”, „pisici/pisica” → „pisic”, „puppies” → „puppy”
function stemWord(word: string) {
  if (word.length <= 3) return word;
  if (word.endsWith("ies")) return `${word.slice(0, -3)}y`;
  let stem = word.replace(/(ilor|elor|urilor)$/, "");
  if (stem.length > 4 && /[ieaău]$/.test(stem)) stem = stem.slice(0, -1);
  if (stem.length > 4 && stem.endsWith("s")) stem = stem.slice(0, -1);
  return stem;
}

// Distanta de editare <= 1: „catel” se potriveste cu „catei”, „somon” cu „salmon” etc.
function isCloseMatch(token: string, word: string) {
  if (Math.abs(token.length - word.length) > 1) return false;
  let i = 0;
  let j = 0;
  let edits = 0;
  while (i < token.length && j < word.length) {
    if (token[i] === word[j]) {
      i += 1;
      j += 1;
    } else {
      edits += 1;
      if (edits > 1) return false;
      if (token.length > word.length) i += 1;
      else if (word.length > token.length) j += 1;
      else {
        i += 1;
        j += 1;
      }
    }
  }
  return edits + (token.length - i) + (word.length - j) <= 1;
}

// Sinonime RO <-> EN: numele produselor Brit sunt in engleza, descrierile in romana
const searchSynonymGroups = [
  ["caine", "caini", "dog", "dogs"],
  ["catel", "catei", "puppy", "puppies", "junior", "young", "puiut"],
  ["pisica", "pisici", "cat", "cats"],
  ["pisoi", "kitten", "kittens"],
  ["pui", "chicken"],
  ["miel", "lamb"],
  ["vita", "beef", "veal"],
  ["curcan", "turkey"],
  ["rata", "duck"],
  ["peste", "fish"],
  ["somon", "salmon"],
  ["tona", "tuna"],
  ["hering", "herring"],
  ["iepure", "rabbit"],
  ["porc", "pork"],
  ["vanat", "venison", "game"],
  ["insecte", "insect", "insects"],
  ["orez", "rice"],
  ["cereale", "grain", "grains"],
  ["blana", "hair", "coat", "fur"],
  ["piele", "skin"],
  ["dinti", "dental", "teeth"],
  ["articulatii", "joint", "joints", "mobility"],
  ["greutate", "weight"],
  ["senior", "batran"],
  ["sterilizat", "sterilised", "sterilized", "castrat"],
  ["hipoalergenic", "hypoallergenic"],
  ["sensibil", "sensitiv", "sensitive"],
  ["mare", "large", "maxi", "giant"],
  ["mic", "small", "mini"],
  ["medie", "medium"],
  ["talie", "size", "breed"],
  ["hrana", "food", "feed"],
  ["uscata", "dry"],
  ["umeda", "wet", "conserve"],
  ["recompensa", "snack", "treat", "treats", "cracker", "crackers"],
  ["adult", "adulti", "matur"],
  ["imunitate", "immune", "immunity"],
  ["energie", "energy", "active"],
  ["urechi", "ureche", "auricular", "auriculare", "ear", "ears"],
  ["picaturi", "picatura", "drops"],
  ["otita", "otite", "otitis"],
  ["raie", "otodectoza"],
  ["paraziti", "parazit", "parasite", "flea", "ticks", "capuse"],
  ["zgarda", "zgazi", "collar", "collars"],
  ["pipeta", "pipete", "spoton", "spot"],
  ["purici", "purice", "fleas"],
  ["viermi", "helminti", "worms", "deparazitare", "anthelmintic"],
  ["vitamine", "vitamina", "vitamin", "vitamins", "minerale", "supliment", "suplimente", "supplement"],
  ["sampon", "sapun", "shampoo", "spalare"],
  ["spray", "aerosol", "solutie"],
  ["lotiune", "lotion", "ochi", "eyes"],
  ["pasta", "paste", "malte"],
  ["articulatii", "articulatie", "joints", "cartilaj"],
  ["blana", "par", "coat", "piele", "skin"],
  ["iepuri", "iepure", "rabbit", "rabbits", "rozatoare", "pasari"],
  ["catei", "pui", "junior", "puppies", "pisoi", "kitten", "kittens"],
  ["nisip", "litiera", "litter", "bentonit"],
  ["jucarie", "jucarii", "toy", "toys", "undita"],
  ["ham", "hamuri", "harness", "lesa", "lese", "leash", "plimbare"],
  ["reflectorizant", "reflectorizanta", "reflective", "vizibilitate", "noapte"],
  ["negru", "neagra", "black"],
  ["rosu", "rosie", "red"],
  ["albastru", "albastra", "blue"],
  ["roz", "pink"],
  ["mov", "violet", "purple"],
  ["galben", "yellow"],
  ["verde", "green"],
  ["portocaliu", "orange"],
];

const searchSynonyms = new Map<string, string[]>();
for (const group of searchSynonymGroups) {
  for (const word of group) {
    searchSynonyms.set(word, group.filter((item) => item !== word));
  }
}

type SearchEntry = {
  blob: string;
  compact: string;
  words: string[];
  stems: Set<string>;
  nameBlob: string;
  nameStems: Set<string>;
};

function buildSearchEntry(product: ProductSummary): SearchEntry {
  const blob = normalizeText(
    `${product.name} ${product.brand} ${product.category} ${product.description} ${product.labels.join(" ")} ${product.packageSizes.join(" ")}`,
  );
  const words = Array.from(new Set(blob.split(/[^a-z0-9]+/g).filter(Boolean)));
  const nameBlob = normalizeText(product.name);
  const nameWords = nameBlob.split(/[^a-z0-9]+/g).filter(Boolean);
  return {
    blob,
    compact: blob.replace(/\s+/g, ""),
    words,
    stems: new Set(words.map(stemWord)),
    nameBlob,
    nameStems: new Set(nameWords.map(stemWord)),
  };
}

function matchesSingleToken(entry: SearchEntry, token: string) {
  if (entry.blob.includes(token) || entry.compact.includes(token)) return true;
  if (entry.stems.has(stemWord(token))) return true;
  if (token.length >= 3 && entry.words.some((word) => word.startsWith(token))) return true;
  return token.length >= 5 && entry.words.some((word) => isCloseMatch(token, word));
}

function matchesSearchToken(entry: SearchEntry, token: string) {
  const variants = [token, ...(searchSynonyms.get(token) || [])];
  return variants.some((variant) => matchesSingleToken(entry, variant));
}

// Scor de relevanta: potrivirile din numele produsului conteaza cel mai mult
function scoreSearchEntry(entry: SearchEntry, token: string) {
  const variants = [token, ...(searchSynonyms.get(token) || [])];
  let score = 0;
  for (const variant of variants) {
    if (entry.nameBlob.includes(variant)) {
      score = Math.max(score, 3);
    } else if (variant.length >= 3 && entry.nameStems.has(stemWord(variant))) {
      score = Math.max(score, 2);
    }
  }
  return score;
}

type ProductCatalogProps = {
  products: ProductSummary[];
  initialCategory?: string;
  initialBrand?: string;
};

export default function ProductCatalog({
  products,
  initialCategory = "Toate",
  initialBrand = "Toate",
}: ProductCatalogProps) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<string>(initialCategory);
  const [brand, setBrand] = useState<string>(initialBrand);
  const [sortBy, setSortBy] = useState("name-asc");
  const [visibleCount, setVisibleCount] = useState(INITIAL_VISIBLE_PRODUCTS);

  // Navigarea /produse?cat=... / ?brand=... pastreaza componenta montata si
  // scroll-ul la fel — sincronizam filtrele din URL si urcam la inceput.
  const searchParams = useSearchParams();
  const lastAppliedParams = useRef(searchParams.toString());
  useEffect(() => {
    const current = searchParams.toString();
    if (current === lastAppliedParams.current) return;
    lastAppliedParams.current = current;
    setCategory(searchParams.get("cat") ?? "Toate");
    setBrand(searchParams.get("brand") ?? "Toate");
    setVisibleCount(INITIAL_VISIBLE_PRODUCTS);
    window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
  }, [searchParams]);

  const isVetCategory = (veterinaryCategoryNames as readonly string[]).includes(category);

  const searchIndex = useMemo(() => products.map(buildSearchEntry), [products]);

  const matchesFilterValue = (product: ProductSummary, value: string) =>
    product.category === value ||
    product.labels.includes(value) ||
    product.productType === value;

  const filterCounts = useMemo(() => {
    const counts = new Map<string, number>();
    const countFor = (value: string) =>
      products.filter(
        (product) =>
          (brand === "Toate" || product.brand === brand) &&
          matchesFilterValue(product, value),
      ).length;
    for (const item of petCategoryNames) {
      if (item !== "Toate") counts.set(item, countFor(item));
    }
    for (const item of veterinaryCategoryNames) counts.set(item, countFor(item));
    for (const group of productTypeFilterGroups) {
      for (const item of group.items) counts.set(item, countFor(item));
    }
    return counts;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [products, brand]);

  const brandCounts = useMemo(() => {
    const counts = new Map<string, number>();
    for (const b of productBrandNames) {
      if (b === "Toate") continue;
      counts.set(
        b,
        products.filter(
          (product) =>
            product.brand === b &&
            (category === "Toate" || matchesFilterValue(product, category)),
        ).length,
      );
    }
    return counts;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [products, category]);

  const filteredProducts = useMemo(() => {
    const queryTokens = normalizeText(query.trim()).split(/\s+/).filter(Boolean);
    const matchingProducts = products.flatMap((product, index) => {
      const entry = searchIndex[index];

      const matchesCategory =
        category === "Toate" ? true : matchesFilterValue(product, category);

      const matchesBrand = brand === "Toate" || product.brand === brand;
      const matchesQuery = queryTokens.every((token) => matchesSearchToken(entry, token));
      return matchesCategory && matchesBrand && matchesQuery ? [{ product, entry }] : [];
    });

    return matchingProducts
      .map((item) => ({
        ...item,
        score: queryTokens.reduce((total, token) => total + scoreSearchEntry(item.entry, token), 0),
      }))
      .sort((first, second) => {
        if (queryTokens.length && second.score !== first.score) return second.score - first.score;
        if (sortBy === "name-desc") return second.product.name.localeCompare(first.product.name, "ro");
        if (sortBy === "brand") {
          return (
            first.product.brand.localeCompare(second.product.brand, "ro") ||
            first.product.name.localeCompare(second.product.name, "ro")
          );
        }
        return first.product.name.localeCompare(second.product.name, "ro");
      })
      .map((item) => item.product);
  }, [brand, category, isVetCategory, products, query, searchIndex, sortBy]);

  const visibleProducts = filteredProducts.slice(0, visibleCount);
  const hasMore = visibleCount < filteredProducts.length;

  const resetVisibleProducts = () => setVisibleCount(INITIAL_VISIBLE_PRODUCTS);

  const clearFilters = () => {
    setQuery("");
    setCategory("Toate");
    setBrand("Toate");
    setSortBy("name-asc");
    resetVisibleProducts();
  };

  return (
    <div className={styles.catalog}>
      <header className={styles.hero}>
        <div className={`container ${styles.heroInner}`}>
          <div className={styles.heroCopy}>
            <h1 className={styles.title}>
              Nutriție premium,
              <br />
              <em>pentru câini și pisici</em>
            </h1>
            <p className={styles.intro}>
              Descoperă gamele complete Brit și Carnilove, cu ingrediente, valori nutriționale,
              gramaje și ghiduri de hrănire pentru fiecare produs în parte.
            </p>
          </div>
        </div>
      </header>

      <section className={styles.productsSection} aria-labelledby="catalog-heading">
        <div className={styles.catalogContainer}>
          <div className={styles.controls}>
            <label className={styles.searchField}>
              <span className={styles.visuallyHidden}>Caută produse</span>
              <SearchIcon className={styles.searchIcon} />
              <input
                type="search"
                value={query}
                onChange={(event) => {
                  setQuery(event.target.value);
                  resetVisibleProducts();
                }}
                placeholder="Caută după nume, ingredient, gramaj..."
              />
              {query && (
                <button
                  type="button"
                  className={styles.clearSearch}
                  onClick={() => {
                    setQuery("");
                    resetVisibleProducts();
                  }}
                  aria-label="Șterge căutarea"
                >
                  <CloseIcon className={styles.clearIcon} />
                </button>
              )}
            </label>

            <label className={styles.sortField}>
              <span>Sortează</span>
              <select
                value={sortBy}
                onChange={(event) => {
                  setSortBy(event.target.value);
                  resetVisibleProducts();
                }}
              >
                <option value="name-asc">Nume: A–Z</option>
                <option value="name-desc">Nume: Z–A</option>
                <option value="brand">După brand</option>
              </select>
            </label>
          </div>

          <div className={styles.catalogLayout}>
            <aside className={styles.sidebar} aria-label="Filtre produse">
              <div className={styles.sidebarHeader}>
                <span className={styles.sidebarTitle}>Filtre</span>
                {(category !== "Toate" || brand !== "Toate" || query) && (
                  <button
                    type="button"
                    className={styles.clearAll}
                    onClick={clearFilters}
                  >
                    Reseteaza
                  </button>
                )}
              </div>

              <FilterGroup
                title="Specie"
                items={petCategoryNames.filter((item) => item !== "Toate")}
                value={category}
                counts={filterCounts}
                defaultOpen
                onSelect={(item) => {
                  setCategory(item);
                  resetVisibleProducts();
                }}
              />

              {productTypeFilterGroups.map((group) => (
                <FilterGroup
                  key={group.title}
                  title={group.title}
                  items={group.items}
                  value={category}
                  counts={filterCounts}
                  defaultOpen={group.items.includes(category as never)}
                  onSelect={(item) => {
                    setCategory(item);
                    resetVisibleProducts();
                  }}
                />
              ))}

              <FilterGroup
                title="Farmacie veterinară"
                items={veterinaryCategoryNames}
                value={category}
                counts={filterCounts}
                defaultOpen={veterinaryCategoryNames.includes(
                  category as never,
                )}
                onSelect={(item) => {
                  setCategory(item);
                  resetVisibleProducts();
                }}
              />

              <details className={styles.filterGroup} open>
                <summary className={styles.filterGroupSummary}>
                  Brand
                  <ChevronIcon className={styles.filterChevron} />
                </summary>
                <div className={styles.filterOptions}>
                  {productBrandNames.map((item) => {
                    const active = brand === item;
                    const count =
                      item === "Toate"
                        ? products.length
                        : (brandCounts.get(item) ?? 0);
                    return (
                      <button
                        key={item}
                        type="button"
                        className={`${styles.filterOption} ${active ? styles.filterOptionActive : ""}`}
                        onClick={() => {
                          setBrand(item);
                          resetVisibleProducts();
                        }}
                        aria-pressed={active}
                      >
                        <span className={styles.filterOptionLabel}>
                          {item === "Toate" ? "Toate brandurile" : displayLabel(item)}
                        </span>
                        <span className={styles.filterCount}>{count}</span>
                      </button>
                    );
                  })}
                </div>
              </details>
            </aside>

            <div className={styles.catalogMain}>
          <div className={styles.resultsHeader}>
            <div>
              <p className={styles.resultsKicker}>
                {isVetCategory
                  ? "Farmacie Veterinară"
                  : brand === "Toate"
                  ? "Catalog complet"
                  : brand}
              </p>
              <h2 className={styles.resultsTitle} id="catalog-heading">
                {category === "Toate"
                  ? "Toate produsele"
                  : isVetCategory
                  ? category
                  : (petCategoryNames as readonly string[]).includes(category)
                  ? `Produse pentru ${category.toLowerCase()}`
                  : category}
              </h2>
            </div>
            <p className={styles.resultsCount}>
              {filteredProducts.length} {filteredProducts.length === 1 ? "produs găsit" : "produse găsite"}
            </p>
          </div>

          {isVetCategory && (
            <div className={styles.vetNoticeCard}>
              <span className={styles.vetNoticeBadge}>Farmacie Veterinară Farmavet</span>
              <h3 className={styles.vetNoticeTitle}>{category}</h3>
              <p className={styles.vetNoticeText}>
                Gama completă de medicamente, tratamente și produse autorizate pentru <strong>{category}</strong> este disponibilă direct în farmacia fizică Farmavet din Chișinău (str. Petricani 198). Pentru comenzi, verificarea stocurilor sau recomandarea unui medic veterinar, contactați-ne telefonic sau lăsați-ne un mesaj.
              </p>
              <div className={styles.vetNoticeActions}>
                <a href="tel:+37379536508" className={styles.vetNoticeCall}>
                  <PhoneIcon className={styles.vetNoticeIcon} />
                  Comandă telefonic: 0795 36 508
                </a>
                <Link href="/#contact" className={styles.vetNoticeContact}>
                  Solicită informații stoc
                </Link>
              </div>
            </div>
          )}

          {visibleProducts.length > 0 ? (
            <>
              <div className={styles.productGrid}>
                {visibleProducts.map((product) => (
                  <article className={styles.productCard} key={product.id}>
                    <Link href={product.href} className={styles.imageWrap} aria-label={`Vezi ${product.name}`}>
                      <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        sizes="(max-width: 860px) 50vw, (max-width: 1120px) 30vw, 21vw"
                        className={styles.productImage}
                      />
                      <span className={styles.badge}>{product.brand}</span>
                      <span className={styles.quickCategory}>{product.category}</span>
                    </Link>

                    <div className={styles.cardBody}>
                      <p className={styles.cardMeta}>
                        <span>{product.brand}</span>
                        <span aria-hidden="true">·</span>
                        <span>{product.category}</span>
                      </p>
                      <h3 className={styles.productName}>
                        <Link href={product.href}>{product.name}</Link>
                      </h3>
                      <p className={styles.productDescription}>{product.description}</p>

                      <div className={styles.cardFooter}>
                        <span className={styles.sizeInfo}>
                          {product.packageSizes.length
                            ? product.packageSizes.slice(0, 2).join(" · ")
                            : "Detalii complete"}
                        </span>
                        <Link href={product.href} className={styles.detailsButton}>
                          Vezi produsul
                          <ArrowRightIcon className={styles.addButtonIcon} />
                        </Link>
                      </div>
                    </div>
                  </article>
                ))}
              </div>

              {hasMore && (
                <div className={styles.loadMoreWrap}>
                  <button
                    type="button"
                    className={styles.loadMore}
                    onClick={() => setVisibleCount((count) => count + LOAD_MORE_COUNT)}
                  >
                    Încarcă mai multe produse
                  </button>
                  <span>
                    Ai văzut {visibleProducts.length} din {filteredProducts.length}
                  </span>
                </div>
              )}
            </>
          ) : (
            <div className={styles.emptyState}>
              <SearchIcon className={styles.emptyIcon} />
              <h2>Nu am găsit produse</h2>
              <p>Încearcă un alt termen de căutare sau elimină filtrele active.</p>
              <button type="button" onClick={clearFilters}>
                Resetează filtrele
              </button>
            </div>
          )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

type FilterGroupProps = {
  title: string;
  items: readonly string[];
  value: string;
  counts: Map<string, number>;
  defaultOpen?: boolean;
  onSelect: (item: string) => void;
};

function FilterGroup({
  title,
  items,
  value,
  counts,
  defaultOpen = false,
  onSelect,
}: FilterGroupProps) {
  return (
    <details className={styles.filterGroup} open={defaultOpen}>
      <summary className={styles.filterGroupSummary}>
        {displayLabel(title)}
        <ChevronIcon className={styles.filterChevron} />
      </summary>
      <div className={styles.filterOptions}>
        {items.map((item) => {
          const active = value === item;
          const count = counts.get(item) ?? 0;
          return (
            <button
              key={item}
              type="button"
              className={`${styles.filterOption} ${active ? styles.filterOptionActive : ""}`}
              onClick={() => onSelect(item)}
              aria-pressed={active}
            >
              <span className={styles.filterOptionLabel}>{displayLabel(item)}</span>
              <span className={styles.filterCount}>{count}</span>
            </button>
          );
        })}
      </div>
    </details>
  );
}
