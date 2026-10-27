"use client";

import { useActionState, useState } from "react";
import { saveProductAction } from "@/app/admin/actions";
import type { ActionState } from "@/app/admin/actions";
import { slugifyName } from "@/lib/slugify";
import styles from "./Admin.module.css";

const PLACEHOLDER = "/products/placeholder.webp";

export type ProductFormInitial = {
  brandSlug: string;
  id: string;
  name: string;
  slug: string;
  category: string;
  description: string;
  image: string;
  labels: string;
  packageSizes: string;
  sourceUrl: string;
};

export const emptyProduct: ProductFormInitial = {
  brandSlug: "",
  id: "",
  name: "",
  slug: "",
  category: "",
  description: "",
  image: "",
  labels: "",
  packageSizes: "",
  sourceUrl: "",
};

export default function ProductForm({
  mode,
  brands,
  categories,
  initial,
}: {
  mode: "create" | "edit";
  brands: Array<{ slug: string; label: string }>;
  categories: string[];
  initial: ProductFormInitial;
}) {
  const [state, formAction, pending] = useActionState<ActionState, FormData>(
    saveProductAction,
    null,
  );
  const [name, setName] = useState(initial.name);
  const [slug, setSlug] = useState(initial.slug);
  const [slugLocked, setSlugLocked] = useState(mode === "edit");
  const [image, setImage] = useState(initial.image);
  const [imageBroken, setImageBroken] = useState(false);
  const isEdit = mode === "edit";

  const previewSrc = imageBroken || !image ? PLACEHOLDER : image;

  return (
    <div className={styles.formCard}>
      <h2 className={styles.formCardTitle}>
        {isEdit ? "Modifică produsul" : "Produs nou"}
      </h2>

      <form action={formAction}>
        <input type="hidden" name="mode" value={mode} />
        {isEdit ? <input type="hidden" name="brandSlug" value={initial.brandSlug} /> : null}
        {isEdit ? <input type="hidden" name="slug" value={initial.slug} /> : null}

        {state?.error ? (
          <div className={styles.errorBox} role="alert">
            {state.error}
          </div>
        ) : null}

        <div className={styles.formGrid}>
          <div className={styles.field}>
            <label className={styles.label} htmlFor="pf-brand">
              Marca *
            </label>
            {isEdit ? (
              <>
                <input type="hidden" name="brandSlug" value={initial.brandSlug} />
                <select className={styles.select} id="pf-brand" value={initial.brandSlug} disabled>
                  <option value={initial.brandSlug}>
                    {brands.find((brand) => brand.slug === initial.brandSlug)?.label ??
                      initial.brandSlug}
                  </option>
                </select>
                <p className={styles.helper}>
                  Marca și slug-ul rămân neschimbate — ele identifică pagina publică.
                </p>
              </>
            ) : (
              <>
                <select
                  className={styles.select}
                  id="pf-brand"
                  name="brandSlug"
                  defaultValue=""
                  required
                >
                  <option value="" disabled>
                    Alege marca…
                  </option>
                  {brands.map((brand) => (
                    <option value={brand.slug} key={brand.slug}>
                      {brand.label}
                    </option>
                  ))}
                </select>
                <p className={styles.helper}>
                  Marca decide fișierul în care se salvează produsul și se alege o
                  singură dată.
                </p>
              </>
            )}
          </div>

          <div className={styles.field}>
            <label className={styles.label} htmlFor="pf-category">
              Categoria
            </label>
            <select
              className={styles.select}
              id="pf-category"
              name="category"
              defaultValue={initial.category}
              required
            >
              <option value="" disabled>
                Alege categoria…
              </option>
              {categories.map((category) => (
                <option value={category} key={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          <div className={styles.field}>
            <label className={styles.label} htmlFor="pf-name">
              Numele produsului *
            </label>
            <input
              className={styles.input}
              id="pf-name"
              name="name"
              value={name}
              required
              onChange={(event) => {
                setName(event.target.value);
                if (!slugLocked && !isEdit) {
                  setSlug(slugifyName(event.target.value));
                }
              }}
              placeholder="ex. Brit Care Dog Adult Lamb"
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label} htmlFor="pf-slug">
              Slug-ul paginii *
            </label>
            <input
              className={`${styles.input} ${isEdit ? "" : ""}`}
              id="pf-slug"
              name={isEdit ? undefined : "slug"}
              value={isEdit ? initial.slug : slug}
              disabled={isEdit}
              onChange={(event) => {
                setSlug(event.target.value);
                setSlugLocked(true);
              }}
              placeholder="ex. brit-care-dog-adult-lamb"
            />
            <p className={styles.helper}>
              {isEdit
                ? "Slug-ul și marca rămân neschimbate — ele identifică pagina publică."
                : "Se generează automat din nume; apasă în câmp ca să-l scrii manual."}
            </p>
          </div>

          <div className={styles.field} style={{ position: "relative" }}>
            <label className={styles.label} htmlFor="pf-id">
              ID (opțional)
            </label>
            <input
              className={styles.input}
              id="pf-id"
              name="id"
              defaultValue={initial.id}
              placeholder="ex. 707837"
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label} htmlFor="pf-image">
              Calea imaginii *
            </label>
            <input
              className={styles.input}
              id="pf-image"
              name="image"
              value={image}
              required
              onChange={(event) => {
                setImage(event.target.value);
                setImageBroken(false);
              }}
              placeholder="/products/brit/poza-mea.webp sau https://…"
            />
            <p className={styles.helper}>
              Așază fișierul în <code>public/</code> și folosește calea începând
              cu <code>/products/…</code> sau un link extern https.
            </p>
          </div>

          <div className={styles.imagePreviewRow}>
            <img
              className={styles.imagePreview}
              src={previewSrc}
              alt="Previzualizare imagine produs"
              onError={() => setImageBroken(true)}
            />
            <p className={styles.helper}>
              {imageBroken && image
                ? "Imaginea nu s-a putut încărca — verifică calea (fișierul trebuie să existe în public/)."
                : "Previzualizarea arată exact imaginea salvată."}
            </p>
          </div>

          <div className={styles.field}>
            <label className={styles.label} htmlFor="pf-labels">
              Etichete (separate prin virgulă)
            </label>
            <input
              className={styles.input}
              id="pf-labels"
              name="labels"
              defaultValue={initial.labels}
              placeholder="Câini, Adulți, Hipoalergenic"
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label} htmlFor="pf-sizes">
              Ambalaje (separate prin virgulă)
            </label>
            <input
              className={styles.input}
              id="pf-sizes"
              name="packageSizes"
              defaultValue={initial.packageSizes}
              placeholder="1 kg, 3 kg, 12 kg"
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label} htmlFor="pf-url">
              Sursa externă (opțional)
            </label>
            <input
              className={styles.input}
              id="pf-url"
              name="sourceUrl"
              defaultValue={initial.sourceUrl}
              placeholder="https://brit-petfood.com/…"
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label} htmlFor="pf-description">
              Descrierea scurtă
            </label>
            <textarea
              className={styles.textarea}
              id="pf-description"
              name="description"
              defaultValue={initial.description}
              placeholder="Descrierea afișată în listă și pe pagina produsului…"
            />
          </div>
        </div>

        <div className={styles.actionsRow}>
          <button className={styles.btnPrimary} type="submit" disabled={pending}>
            {pending
              ? "Se salvează…"
              : isEdit
                ? "Salvează modificările"
                : "Adaugă în catalog"}
          </button>
          <a href="/admin/panou/produse" className={styles.btnGhost}>
            Anulează
          </a>
        </div>
      </form>
    </div>
  );
}
