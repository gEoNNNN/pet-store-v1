"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "../Admin.module.css";

const items = [
  { href: "/admin/panou", label: "Bilanț" },
  { href: "/admin/panou/produse", label: "Produse" },
];

export default function AdminNav() {
  const pathname = usePathname();

  return (
    <>
      {items.map((item) => {
        const isActive =
          item.href === "/admin/panou"
            ? pathname === "/admin/panou"
            : pathname.startsWith(item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`${styles.navLink} ${isActive ? styles.navLinkActive : ""}`}
          >
            {item.label}
          </Link>
        );
      })}
    </>
  );
}
