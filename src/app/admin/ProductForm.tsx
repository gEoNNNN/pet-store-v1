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
  prospect: string;
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
  prospect: "",
};

export default function ProductForm({
  mode,
  brands,
  categories,
  prospects,
  initial,
}: {
  mode: "create" | "edit";
  brands: Array<{ slug: string; label: string }>;
  categories: string[];
  prospects: Array<{ value: string; label: string }>;
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
  const [preview, setPreview] = useState<string | null>(null);
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
            <label className={styles.label} htmlFor="pf-image-file">
              Încarcă o imagine de pe calculator
            </label>
            <input
              className={styles.input}
              id="pf-image-file"
              name="imageFile"
              type="file"
              accept="image/jpeg,image/png,image/webp,image/avif,image/gif"
              onChange={(event) => {
                const file = event.target.files?.[0];
                if (preview) URL.revokeObjectURL(preview);
                setPreview(file ? URL.createObjectURL(file) : null);
                setImageBroken(false);
              }}
            />
            <p className={styles.helper}>
              Poza aleasă aici înlocuiește calea/linkul de mai jos la salvare. Maxim 8 MB,
              JPG / PNG / WEBP / AVIF / GIF.
            </p>
          </div>

          <div className={styles.field}>
            <label className={styles.label} htmlFor="pf-image">
              Calea imaginii sau link extern
            </label>
            <input
              className={styles.input}
              id="pf-image"
              name="image"
              value={image}
              onChange={(event) => {
                setImage(event.target.value);
                setImageBroken(false);
              }}
              placeholder="/products/brit/poza-mea.webp sau https://…"
            />
            <p className={styles.helper}>
              Dacă nu încarci un fișier, poți scrie o cale din <code>public/</code> (ex.{" "}
              <code>/products/…</code>) sau un link extern https.
            </p>
          </div>

          <div className={styles.imagePreviewRow}>
            <img
              className={styles.imagePreview}
              src={preview ?? previewSrc}
              alt="Previzualizare imagine produs"
              onError={() => setImageBroken(true)}
            />
            <p className={styles.helper}>
              {preview
                ? "Previzualizare locală — poza se salvează odată cu produsul."
                : imageBroken && image
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
            <label className={styles.label} htmlFor="pf-prospect">
              Prospect (opțional)
            </label>
            <select
              className={styles.select}
              id="pf-prospect"
              name="prospect"
              defaultValue={initial.prospect}
            >
              <option value="">— fără prospect —</option>
              {/* Valoarea salvată poate lipsi din listă (pe Vercel, public/prospecte nu e
                  citibil din funcție); o păstrăm ca opțiune ca să nu se piardă la salvare. */}
              {initial.prospect && !prospects.some((prospect) => prospect.value === initial.prospect) ? (
                <option value={initial.prospect}>{initial.prospect}</option>
              ) : null}
              {prospects.map((prospect) => (
                <option value={prospect.value} key={prospect.value}>
                  {prospect.label}
                </option>
              ))}
            </select>
            <p className={styles.helper}>
              Documentul Word pe care îl poate descărca clientul de pe pagina
              produsului. Fișierele provin din folderul „SAIT FARMAVET 2026”
              prin script <code>scripts/prospecte.mjs</code>.
            </p>
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
