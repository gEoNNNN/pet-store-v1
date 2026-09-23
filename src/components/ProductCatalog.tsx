"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import {
  petCategoryNames,
  productBrandNames,
  productCategoryNames,
  veterinaryCategoryNames,
  type ProductBrandName,
  type ProductCategoryName,
  type ProductSummary,
} from "@/data/products";
import {
  ArrowRightIcon,
  CloseIcon,
  PhoneIcon,
  SearchIcon,
} from "./icons";
import styles from "./ProductCatalog.module.css";

const INITIAL_VISIBLE_PRODUCTS = 12;
const LOAD_MORE_COUNT = 12;

const veterinaryCategoryKeywords: Record<string, string[]> = {
  "Antibacteriene și antifungice": ["antibacterian", "antifungic", "sensitiv", "piele", "digestiv", "hypoallergenic"],
  "Antiparazitare interne și externe": ["antiparazitar", "parazit", "blana", "skin", "coat", "protectie", "flea"],
  "Antiinflamatoare și analgezice": ["antiinflamator", "analgezic", "articulatii", "joint", "mobility", "durere"],
  "Antiseptice și produse pentru îngrijirea rănilor": ["antiseptic", "rana", "cicatrizant", "piele", "sensitiv", "skin"],
  "Tonice și produse pentru rehidratare": ["tonic", "rehidratare", "energie", "energy", "active", "performance", "vitality"],
  "Produse pentru reproducție și sănătatea glandei mamare": ["reproductie", "lactatie", "matern", "puppy", "kitten", "mother"],
  "Vaccinuri și alte produse biologice": ["vaccin", "biologic", "imun", "imunologie", "preventie"],
  "Imunostimulatoare": ["imunostimulator", "imun", "immunity", "probiotic", "aparare", "rezistenta"],
  "Vitamine, minerale și premixuri": ["vitamina", "mineral", "premix", "supliment", "snack", "calciu"],
  "Curățare, igienă și dezinfecție": ["curatare", "igiena", "dezinfectie", "dental", "clean", "care", "dinti"],
  "Dezinsecție și deratizare": ["dezinsectie", "deratizare", "daunatori", "biosecuritate", "protectie"],
};

function normalizeText(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLocaleLowerCase("ro-RO");
}

type ProductCatalogProps = {
  products: ProductSummary[];
};

export default function ProductCatalog({ products }: ProductCatalogProps) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<ProductCategoryName>("Toate");
  const [brand, setBrand] = useState<ProductBrandName>("Toate");
  const [sortBy, setSortBy] = useState("name-asc");
  const [visibleCount, setVisibleCount] = useState(INITIAL_VISIBLE_PRODUCTS);

  const isVetCategory = (veterinaryCategoryNames as readonly string[]).includes(category);

  const getVetMatchCount = (vetCat: string) => {
    const kws = veterinaryCategoryKeywords[vetCat] || [];
    return products.filter((p) => {
      const text = normalizeText(`${p.name} ${p.brand} ${p.description} ${p.labels.join(" ")}`);
      return kws.some((kw) => text.includes(kw));
    }).length;
  };

  const filteredProducts = useMemo(() => {
    const normalizedQuery = normalizeText(query.trim());
    const matchingProducts = products.filter((product) => {
      const searchableText = normalizeText(
        `${product.name} ${product.brand} ${product.category} ${product.description} ${product.labels.join(" ")} ${product.packageSizes.join(" ")}`,
      );

      const matchesCategory =
        category === "Toate"
          ? true
          : isVetCategory
          ? veterinaryCategoryKeywords[category]?.some((kw) =>
              searchableText.includes(kw)
            ) || false
          : product.category === category;

      const matchesBrand = brand === "Toate" || product.brand === brand;
      return matchesCategory && matchesBrand && (!normalizedQuery || searchableText.includes(normalizedQuery));
    });

    return [...matchingProducts].sort((first, second) => {
      if (sortBy === "name-desc") return second.name.localeCompare(first.name, "ro");
      if (sortBy === "brand") {
        return first.brand.localeCompare(second.brand, "ro") || first.name.localeCompare(second.name, "ro");
      }
      return first.name.localeCompare(second.name, "ro");
    });
  }, [brand, category, isVetCategory, products, query, sortBy]);

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
        <div className="container">
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
              <span>Brand</span>
              <select
                value={brand}
                onChange={(event) => {
                  setBrand(event.target.value as ProductBrandName);
                  resetVisibleProducts();
                }}
              >
                {productBrandNames.map((brandName) => (
                  <option value={brandName} key={brandName}>
                    {brandName === "Toate" ? "Toate brandurile" : brandName}
                  </option>
                ))}
              </select>
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

          <div className={styles.categoryFilterSection}>
            <div className={styles.categoryGroupTitle}>Specii & Nutriție</div>
            <div className={styles.categoryFilter} aria-label="Filtrează după specie">
              {petCategoryNames.map((item) => (
                <button
                  key={item}
                  type="button"
                  className={`${styles.categoryButton} ${category === item ? styles.categoryButtonActive : ""}`}
                  onClick={() => {
                    setCategory(item);
                    resetVisibleProducts();
                  }}
                  aria-pressed={category === item}
                >
                  {item}
                  <span>
                    {item === "Toate"
                      ? products.length
                      : products.filter((product) => product.category === item).length}
                  </span>
                </button>
              ))}
            </div>

            <div className={styles.categoryGroupTitle} style={{ marginTop: "14px" }}>
              Farmacie & Tratamente Veterinare (11 categorii)
            </div>
            <div className={styles.categoryFilter} aria-label="Filtrează după categorie veterinară">
              {veterinaryCategoryNames.map((item) => {
                const count = getVetMatchCount(item);
                return (
                  <button
                    key={item}
                    type="button"
                    className={`${styles.categoryButton} ${category === item ? styles.categoryButtonActive : ""}`}
                    onClick={() => {
                      setCategory(item);
                      resetVisibleProducts();
                    }}
                    aria-pressed={category === item}
                  >
                    {item}
                    {count > 0 && <span>{count}</span>}
                  </button>
                );
              })}
            </div>
          </div>

          <div className={styles.resultsHeader}>
            <div>
              <p className={styles.resultsKicker}>
                {isVetCategory ? "Farmacie Veterinară" : brand === "Toate" ? "Brit + Carnilove" : brand}
              </p>
              <h2 className={styles.resultsTitle} id="catalog-heading">
                {category === "Toate"
                  ? "Toate produsele"
                  : isVetCategory
                  ? category
                  : `Produse pentru ${category.toLowerCase()}`}
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
                        sizes="(max-width: 560px) 100vw, (max-width: 900px) 50vw, (max-width: 1180px) 33vw, 25vw"
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
      </section>
    </div>
  );
}
