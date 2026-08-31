"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { products, productCategoryNames, type ProductCategoryName } from "@/data/products";
import {
  CheckCircleIcon,
  CloseIcon,
  SearchIcon,
  ShieldCheckIcon,
  ShoppingBagIcon,
  StarIcon,
  StethoscopeIcon,
  TruckIcon,
} from "./icons";
import styles from "./ProductCatalog.module.css";

const INITIAL_VISIBLE_PRODUCTS = 8;
const LOAD_MORE_COUNT = 4;

const priceFormatter = new Intl.NumberFormat("ro-RO", {
  style: "currency",
  currency: "RON",
  minimumFractionDigits: 2,
});

function normalizeText(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLocaleLowerCase("ro-RO");
}

export default function ProductCatalog() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<ProductCategoryName>("Toate");
  const [sortBy, setSortBy] = useState("popular");
  const [visibleCount, setVisibleCount] = useState(INITIAL_VISIBLE_PRODUCTS);
  const [addedProducts, setAddedProducts] = useState<Set<number>>(new Set());

  const filteredProducts = useMemo(() => {
    const normalizedQuery = normalizeText(query.trim());
    const matchingProducts = products.filter((product) => {
      const matchesCategory = category === "Toate" || product.category === category;
      const searchableText = normalizeText(
        `${product.name} ${product.category} ${product.description}`,
      );
      return matchesCategory && (!normalizedQuery || searchableText.includes(normalizedQuery));
    });

    return [...matchingProducts].sort((a, b) => {
      if (sortBy === "price-asc") return a.price - b.price;
      if (sortBy === "price-desc") return b.price - a.price;
      if (sortBy === "newest") return Date.parse(b.createdAt) - Date.parse(a.createdAt);
      return b.popularity - a.popularity;
    });
  }, [category, query, sortBy]);

  const visibleProducts = filteredProducts.slice(0, visibleCount);
  const hasMore = visibleCount < filteredProducts.length;

  const selectCategory = (nextCategory: ProductCategoryName) => {
    setCategory(nextCategory);
    setVisibleCount(INITIAL_VISIBLE_PRODUCTS);
  };

  const updateQuery = (nextQuery: string) => {
    setQuery(nextQuery);
    setVisibleCount(INITIAL_VISIBLE_PRODUCTS);
  };

  const clearFilters = () => {
    setQuery("");
    setCategory("Toate");
    setSortBy("popular");
    setVisibleCount(INITIAL_VISIBLE_PRODUCTS);
  };

  const addToCart = (productId: number) => {
    setAddedProducts((current) => {
      const next = new Set(current);
      next.add(productId);
      return next;
    });
  };

  return (
    <div className={styles.catalog}>
      <header className={styles.hero}>
        <div className={`container ${styles.heroInner}`}>
          <div className={styles.heroCopy}>
            <p className={styles.eyebrow}>Farmavet · Magazin online</p>
            <h1 className={styles.title}>
              Produse alese cu grijă,
              <br />
              <em>pentru fiecare animal</em>
            </h1>
            <p className={styles.intro}>
              Descoperă soluții veterinare certificate, hrană și suplimente atent selecționate
              de specialiști pentru sănătatea animalelor tale.
            </p>
          </div>

          <div className={styles.heroCard} aria-label="Beneficiile magazinului">
            <div className={styles.heroCardTop}>
              <span className={styles.heroCardNumber}>{products.length}</span>
              <span>produse selectate</span>
            </div>
            <ul className={styles.benefits}>
              <li>
                <ShieldCheckIcon className={styles.benefitIcon} />
                Produse certificate
              </li>
              <li>
                <TruckIcon className={styles.benefitIcon} />
                Livrare în 24–48h
              </li>
              <li>
                <StethoscopeIcon className={styles.benefitIcon} />
                Recomandări specializate
              </li>
            </ul>
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
                onChange={(event) => updateQuery(event.target.value)}
                placeholder="Caută după nume, categorie..."
              />
              {query && (
                <button
                  type="button"
                  className={styles.clearSearch}
                  onClick={() => updateQuery("")}
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
                  setVisibleCount(INITIAL_VISIBLE_PRODUCTS);
                }}
              >
                <option value="popular">Cele mai populare</option>
                <option value="newest">Cele mai noi</option>
                <option value="price-asc">Preț: crescător</option>
                <option value="price-desc">Preț: descrescător</option>
              </select>
            </label>

            <div className={styles.cartSummary} aria-live="polite">
              <span className={styles.cartIconWrap}>
                <ShoppingBagIcon className={styles.cartIcon} />
                {addedProducts.size > 0 && (
                  <span className={styles.cartCount}>{addedProducts.size}</span>
                )}
              </span>
              <span>
                <strong>Coșul tău</strong>
                {addedProducts.size === 0
                  ? "Niciun produs"
                  : `${addedProducts.size} ${addedProducts.size === 1 ? "produs" : "produse"}`}
              </span>
            </div>
          </div>

          <div className={styles.categoryFilter} aria-label="Filtrează după categorie">
            {productCategoryNames.map((item) => (
              <button
                key={item}
                type="button"
                className={`${styles.categoryButton} ${category === item ? styles.categoryButtonActive : ""}`}
                onClick={() => selectCategory(item)}
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

          <div className={styles.resultsHeader}>
            <div>
              <p className={styles.resultsKicker}>Selecția Farmavet</p>
              <h2 className={styles.resultsTitle} id="catalog-heading">
                {category === "Toate" ? "Toate produsele" : category}
              </h2>
            </div>
            <p className={styles.resultsCount}>
              {filteredProducts.length} {filteredProducts.length === 1 ? "produs găsit" : "produse găsite"}
            </p>
          </div>

          {visibleProducts.length > 0 ? (
            <>
              <div className={styles.productGrid}>
                {visibleProducts.map((product) => {
                  const isAdded = addedProducts.has(product.id);
                  return (
                    <article className={styles.productCard} key={product.id}>
                      <div className={styles.imageWrap}>
                        <Image
                          src={product.image}
                          alt={product.name}
                          fill
                          sizes="(max-width: 560px) 100vw, (max-width: 900px) 50vw, (max-width: 1180px) 33vw, 25vw"
                          className={styles.productImage}
                        />
                        {product.badge && <span className={styles.badge}>{product.badge}</span>}
                        <span className={styles.quickCategory}>{product.category}</span>
                      </div>

                      <div className={styles.cardBody}>
                        <div className={styles.rating} aria-label={`${product.rating} din 5 stele`}>
                          <StarIcon className={styles.starIcon} />
                          <strong>{product.rating}</strong>
                          <span>({product.reviews})</span>
                        </div>
                        <h3 className={styles.productName}>{product.name}</h3>
                        <p className={styles.productDescription}>{product.description}</p>

                        <div className={styles.cardFooter}>
                          <div className={styles.priceBlock}>
                            <span className={styles.price}>{priceFormatter.format(product.price)}</span>
                            {product.oldPrice && (
                              <span className={styles.oldPrice}>{priceFormatter.format(product.oldPrice)}</span>
                            )}
                          </div>
                          <button
                            type="button"
                            className={`${styles.addButton} ${isAdded ? styles.addButtonSuccess : ""}`}
                            onClick={() => addToCart(product.id)}
                            disabled={isAdded}
                          >
                            {isAdded ? (
                              <CheckCircleIcon className={styles.addButtonIcon} />
                            ) : (
                              <ShoppingBagIcon className={styles.addButtonIcon} />
                            )}
                            {isAdded ? "Adăugat" : "Adaugă"}
                          </button>
                        </div>
                      </div>
                    </article>
                  );
                })}
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
