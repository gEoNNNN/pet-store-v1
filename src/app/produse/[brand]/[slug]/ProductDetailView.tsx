"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRightIcon, CheckCircleIcon, ChevronRightIcon, DownloadIcon } from "@/components/icons";
import type { Product } from "@/data/products";
import { applyOverlay } from "@/i18n/catalog";
import { useI18n } from "@/i18n/provider";
import styles from "./ProductDetail.module.css";

// Titlurile secțiunilor pot fi traduse — recunoaștem „hrănire/feeding/корм…”
// și „nutriție/analitic/nutrition/analytical/аналит…” în toate cele 3 limbi.
const FEEDING_RE = /hrănire|feeding|корм|норм/i;
const NUTRITION_RE = /nutri|analitic|analytic|nutrițional|витамин|минерал|добавк|аналит|пищев|питат/i;

function displayCategory(tOr: (path: readonly string[], fallback: string) => string, value: string) {
  const fromSpecies = tOr(["filters", "species", value], "");
  if (fromSpecies) return fromSpecies;
  return tOr(["filters", "vetCategory", value], value);
}

function ProductSectionText({
  title,
  text,
  productFallbackLabel,
}: {
  title: string;
  text: string;
  productFallbackLabel: (index: number) => string;
}) {
  const chunks = text.split(/(?=CARNILOVE\b)/g).map((chunk) => chunk.trim()).filter(Boolean);
  if (chunks.length < 2) return <p className={styles.sectionText}>{text}</p>;

  const isNutrition = NUTRITION_RE.test(title);

  return (
    <div className={styles.productTextGroups}>
      {chunks.map((chunk, index) => {
        const headingMatch = chunk.match(/^(.+?\d+(?:[.,]\d+)?\s*(?:kg|g)\b)\s*/i);
        const heading = headingMatch?.[1] || productFallbackLabel(index + 1);
        const content = headingMatch ? chunk.slice(headingMatch[0].length).trim() : chunk;
        const items = isNutrition
          ? content.split(/,\s+(?=[A-Za-zĂÂÎȘȚăâîșțА-Яа-яЁё])/).map((item) => item.trim()).filter(Boolean)
          : [];

        return (
          <section className={styles.productTextGroup} key={`${heading}-${index}`}>
            <h4>{heading}</h4>
            {items.length > 1 ? (
              <ul className={styles.nutritionGrid}>
                {items.map((item, itemIndex) => (
                  <li key={`${item}-${itemIndex}`}>{item}</li>
                ))}
              </ul>
            ) : (
              <p>{content}</p>
            )}
          </section>
        );
      })}
    </div>
  );
}

export default function ProductDetailView({ product }: { product: Product }) {
  const { t, tOr, catalog } = useI18n();
  // Textul produsului se traduce din suprapunerea EN/RU (când e încărcată);
  // id-ul, href-ul, brandul și valorile de filtrare rămân cele originale.
  const view = applyOverlay(product, catalog ? catalog[product.id] : undefined);
  const galleryImages = view.images.filter((image) => image.url !== view.image);

  return (
    <main id="main" className={styles.page}>
      <div className={styles.pageContainer}>
        <nav className={styles.breadcrumbs} aria-label={t("detail.breadcrumbsAria")}>
          <Link href="/">{t("detail.home")}</Link>
          <ChevronRightIcon className={styles.breadcrumbIcon} />
          <Link href="/produse">{t("detail.products")}</Link>
          <ChevronRightIcon className={styles.breadcrumbIcon} />
          <span>{view.name}</span>
        </nav>

        <section className={styles.hero}>
          <div className={styles.imagePanel}>
            <div className={styles.mainImage}>
              <Image
                src={view.image}
                alt={view.name}
                fill
                priority
                sizes="(max-width: 900px) 100vw, 48vw"
              />
            </div>
            <span className={styles.imageBrand}>{view.brand}</span>
          </div>

          <div className={styles.heroContent}>
            <div className={styles.tags}>
              <span className={styles.brandTag}>{view.brand}</span>
              <span>{displayCategory(tOr, product.category)}</span>
              {view.productType && (
                <span>{tOr(["filters", "productType", product.productType ?? ""], view.productType)}</span>
              )}
            </div>
            <h1>{view.name}</h1>
            <div className={styles.description}>
              {view.description.split(/\n+/).filter(Boolean).map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>

            {view.labels.length > 0 && (
              <div className={styles.labelList} aria-label={t("detail.labelsAria")}>
                {view.labels.map((label) => (
                  <span key={label}>{label}</span>
                ))}
              </div>
            )}

            <dl className={styles.facts}>
              <div>
                <dt>{t("detail.brand")}</dt>
                <dd>{view.brand}</dd>
              </div>
              {view.manufacturer && view.manufacturer !== view.brand && (
                <div>
                  <dt>{t("detail.manufacturer")}</dt>
                  <dd>{view.manufacturer}</dd>
                </div>
              )}
              <div>
                <dt>{t("detail.category")}</dt>
                <dd>{displayCategory(tOr, product.category)}</dd>
              </div>
              {view.packageSizes.length > 0 && (
                <div>
                  <dt>{t("detail.variants")}</dt>
                  <dd>{view.packageSizes.join(" · ")}</dd>
                </div>
              )}
              {view.metabolizableEnergy && (
                <div>
                  <dt>{t("detail.metabolizableEnergy")}</dt>
                  <dd>{view.metabolizableEnergy}</dd>
                </div>
              )}
            </dl>

            <div className={styles.heroActions}>
              {view.sourceUrl && (
                <a
                  href={view.sourceUrl}
                  target="_blank"
                  rel="noreferrer"
                  className={styles.sourceButton}
                >
                  {t("detail.btnManufacturer")}
                  <ArrowRightIcon className={styles.buttonIcon} />
                </a>
              )}
              {view.prospect && (
                <a
                  href={view.prospect}
                  download
                  className={styles.prospectButton}
                >
                  {t("detail.btnProspect")}
                  <DownloadIcon className={styles.buttonIcon} />
                </a>
              )}
            </div>
          </div>
        </section>

        {(view.features.length > 0 || view.ingredientTags.length > 0) && (
          <section className={styles.highlights} aria-labelledby="highlights-title">
            <div>
              <p className={styles.kicker}>{t("detail.kickerFeatures")}</p>
              <h2 id="highlights-title">{t("detail.benefitsTitle")}</h2>
            </div>
            <ul>
              {[...view.features, ...view.ingredientTags].map((feature, index) => (
                <li key={`${feature}-${index}`}>
                  <CheckCircleIcon className={styles.checkIcon} />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </section>
        )}

        <section className={styles.information} aria-labelledby="information-title">
          <div className={styles.sectionHeading}>
            <p className={styles.kicker}>{t("detail.kickerFull")}</p>
            <h2 id="information-title">{t("detail.infoTitle")}</h2>
            <p>{t("detail.infoSub")}</p>
          </div>

          {view.sections.length > 0 ? (
            <div className={styles.sectionList}>
              {view.sections.map((section, sectionIndex) => (
                <article className={styles.infoCard} key={`${section.title}-${sectionIndex}`}>
                  <h3>{section.title}</h3>
                  {section.text && !(FEEDING_RE.test(section.title) && section.tables.length > 0) && (
                    <ProductSectionText
                      title={section.title}
                      text={section.text}
                      productFallbackLabel={(index) => t("detail.productFallback", { index })}
                    />
                  )}
                  {FEEDING_RE.test(section.title) && section.tables.length > 0 && (
                    <p className={styles.feedingIntro}>{t("detail.feedingIntro")}</p>
                  )}
                  {section.tables.map((table, tableIndex) => (
                    <div className={styles.tableWrap} key={`${section.title}-table-${tableIndex}`}>
                      <table>
                        <thead>
                          <tr>
                            {table[0]?.map((cell, cellIndex) => (
                              <th key={`${cell}-${cellIndex}`}>{cell}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {table.slice(1).map((row, rowIndex) => (
                            <tr key={`${section.title}-row-${rowIndex}`}>
                              {row.map((cell, cellIndex) => (
                                <td key={`${cell}-${cellIndex}`}>{cell}</td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ))}
                </article>
              ))}
            </div>
          ) : (
            <div className={styles.infoCard}>
              <p>{view.rawText}</p>
            </div>
          )}
        </section>

        {view.freshIngredients.length > 0 && (
          <section className={styles.ingredients} aria-labelledby="ingredients-title">
            <div className={styles.sectionHeading}>
              <p className={styles.kicker}>{t("detail.kickerIngredients")}</p>
              <h2 id="ingredients-title">{t("detail.ingredientsTitle")}</h2>
            </div>
            <div className={styles.ingredientGrid}>
              {view.freshIngredients.map((ingredient, index) => (
                <article className={styles.ingredientCard} key={`${index}-${ingredient.name ?? ""}`}>
                  {ingredient.image && (
                    <div className={styles.ingredientImage}>
                      <Image
                        src={ingredient.image}
                        alt={ingredient.name || t("detail.ingredientFallback")}
                        fill
                        sizes="(max-width: 620px) 100vw, (max-width: 980px) 50vw, 33vw"
                      />
                    </div>
                  )}
                  <div>
                    {ingredient.name && <h3>{ingredient.name}</h3>}
                    <p>{ingredient.description}</p>
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}

        {galleryImages.length > 0 && (
          <section className={styles.gallery} aria-labelledby="gallery-title">
            <div className={styles.sectionHeading}>
              <p className={styles.kicker}>{t("detail.kickerGallery")}</p>
              <h2 id="gallery-title">{t("detail.galleryTitle")}</h2>
            </div>
            <div className={styles.galleryGrid}>
              {galleryImages.map((image, index) => (
                <div className={styles.galleryImage} key={`${image.url}-${index}`}>
                  <Image
                    src={image.url}
                    alt={image.alt || t("detail.imageAlt", { name: view.name, index: index + 2 })}
                    fill
                    sizes="(max-width: 620px) 50vw, (max-width: 980px) 33vw, 25vw"
                  />
                </div>
              ))}
            </div>
          </section>
        )}

        <div className={styles.backLinkWrap}>
          <Link href="/produse" className={styles.backLink}>
            {t("detail.back")}
            <ArrowRightIcon className={styles.buttonIcon} />
          </Link>
        </div>
      </div>
    </main>
  );
}
