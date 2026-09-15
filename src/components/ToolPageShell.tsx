import Link from "next/link";
import type { ReactNode } from "react";
import { ChevronRightIcon } from "./icons";
import styles from "./ToolPageShell.module.css";

type ToolPageShellProps = {
  eyebrow: string;
  title: string;
  description: string;
  children: ReactNode;
};

export default function ToolPageShell({ eyebrow, title, description, children }: ToolPageShellProps) {
  return (
    <main className={styles.main} id="main">
      <header className={styles.hero}>
        <div className="container">
          <nav className={styles.breadcrumbs} aria-label="Navigare contextuală">
            <Link href="/">Acasa</Link><ChevronRightIcon />
            <Link href="/instrumente">Instrumente</Link><ChevronRightIcon />
            <span>{eyebrow}</span>
          </nav>
          <p className={styles.eyebrow}>{eyebrow}</p>
          <h1>{title}</h1>
          <p className={styles.description}>{description}</p>
        </div>
      </header>
      <section className={styles.workspace}>
        <div className="container">{children}</div>
      </section>
    </main>
  );
}
