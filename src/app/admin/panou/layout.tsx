import Link from "next/link";
import { redirect } from "next/navigation";
import { isAuthenticated } from "@/lib/adminAuth";
import { logoutAction } from "../actions";
import styles from "../Admin.module.css";
import AdminNav from "./AdminNav";

export default async function AdminPanouLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  if (!(await isAuthenticated())) {
    redirect("/admin");
  }

  return (
    <>
      <header className={styles.topbar}>
        <div className={styles.topbarInner}>
          <Link href="/admin/panou" className={styles.brandSign}>
            <strong>Farmavet</strong>
            <span>Panou de administrare</span>
          </Link>
          <nav className={styles.navLinks}>
            <AdminNav />
          </nav>
          <Link href="/produse" className={styles.logoutBtn} style={{ marginRight: 8 }}>
            Vezi site-ul
          </Link>
          <form action={logoutAction}>
            <button className={styles.logoutBtn} type="submit">
              Ieși din sesiune
            </button>
          </form>
        </div>
      </header>
      <div className={styles.content}>{children}</div>
    </>
  );
}
