import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { isAuthenticated, isConfigured } from "@/lib/adminAuth";
import LoginForm from "./LoginForm";
import styles from "./Admin.module.css";

export const metadata: Metadata = {
  title: "Login administrare | Farmavet",
  description: "Autentificare în panoul de administrare al magazinului Farmavet.",
  robots: { index: false, follow: false },
};

export default async function AdminLoginPage() {
  if (await isAuthenticated()) {
    redirect("/admin/panou");
  }

  return (
    <main className={styles.authPage}>
      <div className={styles.authCard}>
        <div className={styles.brandRow}>
          <div>
            <div className={styles.brandName}>Farmavet</div>
            <div className={styles.brandTag}>Panou de administrare</div>
          </div>
        </div>

        {isConfigured() ? (
          <>
            <LoginForm />
            <p className={styles.authHint}>
              Introdu parola setată în variabila <code>ADMIN_PASSWORD</code>.{" "}
              Sesiunea expiră automat după 12 ore.
            </p>
          </>
        ) : (
          <p className={styles.authHint}>
            Panoul nu este configurat. Adaug în fișierul <code>.env.local</code>{" "}
            din folderul proiectului linia: <code>ADMIN_PASSWORD=parola_ta</code>, apoi
            repornește serverul. Vezi manualul de utilizare pentru detalii.
          </p>
        )}
      </div>
      <Link href="/" className={styles.brandTag} style={{ textDecoration: "underline" }}>
        ← Înapoi la magazin
      </Link>
    </main>
  );
}
