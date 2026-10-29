import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { ArrowRightIcon, CheckCircleIcon, ChevronRightIcon, DownloadIcon } from "@/components/icons";
import { getProduct, getProducts } from "@/data/productCatalog.server";
import styles from "./ProductDetail.module.css";

type ProductPageProps = {
  params: Promise<{ brand: string; slug: string }>;
};

function ProductSectionText({ title, text }: { title: string; text: string }) {
  const chunks = text.split(/(?=CARNILOVE\b)/g).map((chunk) => chunk.trim()).filter(Boolean);
  if (chunks.length < 2) return <p className={styles.sectionText}>{text}</p>;

  const isNutrition = /nutri|analitic/i.test(title);

  return (
    <div className={styles.productTextGroups}>
      {chunks.map((chunk, index) => {
        const headingMatch = chunk.match(/^(.+?\d+(?:[.,]\d+)?\s*(?:kg|g)\b)\s*/i);
        const heading = headingMatch?.[1] || `Produs ${index + 1}`;
        const content = headingMatch ? chunk.slice(headingMatch[0].length).trim() : chunk;
        const items = isNutrition
          ? content.split(/,\s+(?=[A-Za-zĂÂÎȘȚăâîșț])/).map((item) => item.trim()).filter(Boolean)
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

export function generateStaticParams() {
  return getProducts().map((product) => ({ brand: product.brandSlug, slug: product.slug }));
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { brand, slug } = await params;
  const product = getProduct(brand, slug);
  if (!product) return {};
  return {
    title: `${product.name} | ${product.brand} | Farmavet`,
    description: product.description.slice(0, 160),
    openGraph: {
      title: product.name,
      description: product.description.slice(0, 200),
      images: [{ url: product.image }],
    },
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { brand, slug } = await params;
  const product = getProduct(brand, slug);
  if (!product) notFound();

  const galleryImages = product.images.filter((image) => image.url !== product.image);

  return (
    <>
      <Navbar activeItem="products" />
      <main id="main" className={styles.page}>
        <div className={styles.pageContainer}>
          <nav className={styles.breadcrumbs} aria-label="Fir de navigare">
            <Link href="/">Acasa</Link>
            <ChevronRightIcon className={styles.breadcrumbIcon} />
            <Link href="/produse">Produse</Link>
            <ChevronRightIcon className={styles.breadcrumbIcon} />
            <span>{product.name}</span>
          </nav>

          <section className={styles.hero}>
            <div className={styles.imagePanel}>
              <div className={styles.mainImage}>
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  priority
                  sizes="(max-width: 900px) 100vw, 48vw"
                />
              </div>
              <span className={styles.imageBrand}>{product.brand}</span>
            </div>

            <div className={styles.heroContent}>
              <div className={styles.tags}>
                <span className={styles.brandTag}>{product.brand}</span>
                <span>{product.category}</span>
                {product.productType && <span>{product.productType}</span>}
              </div>
              <h1>{product.name}</h1>
              <div className={styles.description}>
                {product.description.split(/\n+/).filter(Boolean).map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
                ))}
              </div>

              {product.labels.length > 0 && (
                <div className={styles.labelList} aria-label="Etichete produs">
                  {product.labels.map((label) => (
                    <span key={label}>{label}</span>
                  ))}
                </div>
              )}

              <dl className={styles.facts}>
                <div>
                  <dt>Brand</dt>
                  <dd>{product.brand}</dd>
                </div>
                <div>
                  <dt>Categorie</dt>
                  <dd>{product.category}</dd>
                </div>
                {product.packageSizes.length > 0 && (
                  <div>
                    <dt>Variante</dt>
                    <dd>{product.packageSizes.join(" · ")}</dd>
                  </div>
                )}
                {product.metabolizableEnergy && (
                  <div>
                    <dt>Energie metabolizabilă</dt>
                    <dd>{product.metabolizableEnergy}</dd>
                  </div>
                )}
              </dl>

              <div className={styles.heroActions}>
                {product.sourceUrl && (
                  <a
                    href={product.sourceUrl}
                    target="_blank"
                    rel="noreferrer"
                    className={styles.sourceButton}
                  >
                    Vezi produsul la producător
                    <ArrowRightIcon className={styles.buttonIcon} />
                  </a>
                )}
                {product.prospect && (
                  <a
                    href={product.prospect}
                    download
                    className={styles.prospectButton}
                  >
                    Descarcă prospect (Word)
                    <DownloadIcon className={styles.buttonIcon} />
                  </a>
                )}
              </div>
            </div>
          </section>

          {(product.features.length > 0 || product.ingredientTags.length > 0) && (
            <section className={styles.highlights} aria-labelledby="highlights-title">
              <div>
                <p className={styles.kicker}>Caracteristici</p>
                <h2 id="highlights-title">Beneficiile produsului</h2>
              </div>
              <ul>
                {[...product.features, ...product.ingredientTags].map((feature, index) => (
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
              <p className={styles.kicker}>Fișa completă</p>
              <h2 id="information-title">Informații despre produs</h2>
              <p>Datele de mai jos sunt preluate din catalogul oficial al producătorului.</p>
            </div>

            {product.sections.length > 0 ? (
              <div className={styles.sectionList}>
                {product.sections.map((section, sectionIndex) => (
                  <article className={styles.infoCard} key={`${section.title}-${sectionIndex}`}>
                    <h3>{section.title}</h3>
                    {section.text && !(/hrănire/i.test(section.title) && section.tables.length > 0) && (
                      <ProductSectionText title={section.title} text={section.text} />
                    )}
                    {/hrănire/i.test(section.title) && section.tables.length > 0 && (
                      <p className={styles.feedingIntro}>
                        Cantitățile sunt orientative. Ajustați porția în funcție de vârstă, greutate și nivelul de activitate și asigurați permanent apă proaspătă.
                      </p>
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
                <p>{product.rawText}</p>
              </div>
            )}
          </section>

          {product.freshIngredients.length > 0 && (
            <section className={styles.ingredients} aria-labelledby="ingredients-title">
              <div className={styles.sectionHeading}>
                <p className={styles.kicker}>Ingrediente atent alese</p>
                <h2 id="ingredients-title">Ingrediente principale</h2>
              </div>
              <div className={styles.ingredientGrid}>
                {product.freshIngredients.map((ingredient, index) => (
                  <article className={styles.ingredientCard} key={`${ingredient.name}-${index}`}>
                    {ingredient.image && (
                      <div className={styles.ingredientImage}>
                        <Image
                          src={ingredient.image}
                          alt={ingredient.name || "Ingredient"}
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
                <p className={styles.kicker}>Galerie</p>
                <h2 id="gallery-title">Imagini produs</h2>
              </div>
              <div className={styles.galleryGrid}>
                {galleryImages.map((image, index) => (
                  <div className={styles.galleryImage} key={`${image.url}-${index}`}>
                    <Image
                      src={image.url}
                      alt={image.alt || `${product.name} – imagine ${index + 2}`}
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
              Înapoi la toate produsele
              <ArrowRightIcon className={styles.buttonIcon} />
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
