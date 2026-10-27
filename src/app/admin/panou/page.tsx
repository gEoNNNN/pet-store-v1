import Link from "next/link";
import { catalogOverview } from "@/lib/adminCatalog";
import styles from "../Admin.module.css";

export const metadata = {
  title: "Bilanț | Panou Farmavet",
  robots: { index: false, follow: false },
};

export default function AdminDashboardPage() {
  const overview = catalogOverview();
  const total = overview.reduce((sum, item) => sum + item.count, 0);

  return (
    <>
      <div className={styles.pageHeader}>
        <h1 className={styles.title}>Bilanț catalog</h1>
        <p className={styles.subtitle}>
          Prezentare generală a produselor administrate și acces rapid la
          acțiuni.
        </p>
      </div>

      <div className={styles.statGrid}>
        <div className={styles.statCard}>
          <div className={styles.statValue}>{total}</div>
          <div className={styles.statLabel}>Produse în total</div>
        </div>
        {overview.map((item) => (
          <div className={styles.statCard} key={item.brandSlug}>
            <div className={styles.statValue}>{item.count}</div>
            <div className={styles.statLabel}>{item.brand}</div>
          </div>
        ))}
      </div>

      <div style={{ display: "grid", gap: 18, gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))" }}>
        <section className={styles.panel}>
          <h2 className={styles.panelTitle}>Acțiuni rapide</h2>
          <div className={styles.actionsRow}>
            <Link
              href="/admin/panou/produse/adauga"
              className={styles.btnPrimary}
            >
              + Adaugă produs
            </Link>
            <Link href="/admin/panou/produse" className={styles.btnGhost}>
              Lista produselor
            </Link>
          </div>
        </section>

        <section className={styles.panel}>
          <h2 className={styles.panelTitle}>Bine de știut</h2>
          <ul className={styles.tipsList}>
            <li>
              Modificările scriu în fișierele <code>scrape/*.json</code> și apar
              imediat în catalogul public <code>/produse</code>.
            </li>
            <li>
              Parola se schimbă din variabila de mediu{" "}
              <code>ADMIN_PASSWORD</code> (fișierul <code>.env.local</code>).
            </li>
            <li>
              Sesiunea de administrare expiră după 12 ore; folosește{" "}
              <strong>Ieși din sesiune</strong> pe calculatoare împărtășite.
            </li>
          </ul>
        </section>
      </div>
    </>
  );
}
