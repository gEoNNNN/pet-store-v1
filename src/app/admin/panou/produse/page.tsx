import type { Metadata } from "next";
import Link from "next/link";
import {
  brandConfigs,
  listAllProducts,
} from "@/lib/adminCatalog";
import styles from "../../Admin.module.css";
import DeleteProductButton from "./DeleteProductButton";

export const metadata: Metadata = {
  title: "Produse | Panou Farmavet",
  robots: { index: false, follow: false },
};

const PAGE_SIZE = 20;

type ListProps = {
  searchParams?: Promise<{
    q?: string;
    brand?: string;
    page?: string;
    adaugat?: string;
    modificat?: string;
    sters?: string;
    eroare?: string;
  }>;
};

export default async function AdminProductsPage({ searchParams }: ListProps) {
  const params = (await searchParams) ?? {};
  const query = (params.q ?? "").trim().toLowerCase();
  const brand = params.brand ?? "";
  const page = Math.max(1, Number.parseInt(params.page ?? "1", 10) || 1);

  const all = listAllProducts();
  const filtered = all.filter((row) => {
    if (brand && row.brandSlug !== brand) return false;
    if (!query) return true;
    return (
      row.name.toLowerCase().includes(query) ||
      row.slug.toLowerCase().includes(query)
    );
  });

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const visible = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const banner = params.eroare
    ? { kind: "error" as const, text: params.eroare }
    : params.adaugat
      ? { kind: "success" as const, text: "Produsul a fost adăugat în catalog." }
      : params.modificat
        ? { kind: "success" as const, text: "Produsul a fost modificat." }
        : params.sters
          ? { kind: "success" as const, text: "Produsul a fost șters din catalog." }
          : null;

  return (
    <>
      <div className={styles.pageHeader}>
        <h1 className={styles.title}>Produse</h1>
        <p className={styles.subtitle}>
          {filtered.length} din {all.length} produse afișate. Caută, filtrează
          după marcă, modifică sau șterge.
        </p>
      </div>

      {banner ? (
        <div
          className={`${styles.rowBanner} ${
            banner.kind === "error" ? styles.bannerError : styles.bannerSuccess
          }`}
        >
          {banner.text}
        </div>
      ) : null}

      <div className={styles.toolbar}>
        <form method="GET" className={styles.toolbar} style={{ gap: 10, marginBottom: 0 }}>
          <input
            className={`${styles.input} ${styles.searchInput}`}
            name="q"
            key={`q-${query}`}
            defaultValue={query}
            placeholder="Caută după nume sau slug…"
          />
          <select
            className={`${styles.select} ${styles.brandSelect}`}
            name="brand"
            key={`brand-${brand}`}
            defaultValue={brand}
          >
            <option value="">Toate mărcile</option>
            {brandConfigs.map((config) => (
              <option value={config.brandSlug} key={config.brandSlug}>
                {config.brand}
              </option>
            ))}
          </select>
          <button className={styles.btnGhost} type="submit">
            Caută
          </button>
        </form>
        <Link href="/admin/panou/produse/adauga" className={styles.btnPrimary}>
          + Adaugă produs
        </Link>
      </div>

      <div className={styles.tableWrap}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th className={styles.thumbCell} aria-label="Imagine" />
              <th>Nume</th>
              <th>Marca</th>
              <th>Categorie</th>
              <th aria-label="Acțiuni" />
            </tr>
          </thead>
          <tbody>
            {visible.length === 0 ? (
              <tr>
                <td className={styles.emptyRow} colSpan={5}>
                  Niciun produs găsit. Încearcă alt termen de căutare sau altă
                  marcă.
                </td>
              </tr>
            ) : (
              visible.map((row) => (
                <tr key={`${row.brandSlug}-${row.slug}`}>
                  <td className={styles.thumbCell}>
                    <img
                      className={styles.thumb}
                      src={row.image || "/products/placeholder.webp"}
                      alt=""
                      loading="lazy"
                    />
                  </td>
                  <td>
                    <div className={styles.nameCell}>
                      <strong>{row.name}</strong>
                      <small>/produse/{row.brandSlug}/{row.slug}</small>
                    </div>
                  </td>
                  <td>
                    <span className={styles.pill}>{row.brand}</span>
                  </td>
                  <td>{row.category || "—"}</td>
                  <td className={styles.actionsCell}>
                    <Link
                      className={styles.editLink}
                      href={`/admin/panou/produse/${row.brandSlug}/${row.slug}/modifica`}
                    >
                      Modifică
                    </Link>
                    <DeleteProductButton brandSlug={row.brandSlug} slug={row.slug} />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className={styles.pagination}>
        <span>
          Pagina {Math.min(page, pageCount)} din {pageCount}
        </span>
        <div className={styles.pageButtons}>
          <PaginationLink
            page={page - 1}
            disabled={page <= 1}
            params={{ q: query, brand }}
            label="← Anterioara"
          />
          <PaginationLink
            page={page + 1}
            disabled={page >= pageCount}
            params={{ q: query, brand }}
            label="Următoarea →"
          />
        </div>
      </div>
    </>
  );
}

function PaginationLink({
  page,
  disabled,
  params,
  label,
}: {
  page: number;
  disabled: boolean;
  params: { q: string; brand: string };
  label: string;
}) {
  if (disabled) {
    return (
      <button className={styles.pageButton} disabled>
        {label}
      </button>
    );
  }
  const search = new URLSearchParams();
  if (params.q) search.set("q", params.q);
  if (params.brand) search.set("brand", params.brand);
  search.set("page", String(page));
  const href = search.toString()
    ? `/admin/panou/produse?${search.toString()}`
    : "/admin/panou/produse";
  return (
    <Link className={styles.pageButton} href={href}>
      {label}
    </Link>
  );
}
