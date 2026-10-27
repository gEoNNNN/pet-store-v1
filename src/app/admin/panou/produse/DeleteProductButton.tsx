"use client";

import { deleteProductAction } from "@/app/admin/actions";
import styles from "../../Admin.module.css";

export default function DeleteProductButton({
  brandSlug,
  slug,
}: {
  brandSlug: string;
  slug: string;
}) {
  return (
    <form
      action={deleteProductAction}
      onSubmit={(event) => {
        if (!window.confirm("Ești sigur? Produsul se șterge definitiv din catalog.")) {
          event.preventDefault();
        }
      }}
    >
      <input type="hidden" name="brandSlug" value={brandSlug} />
      <input type="hidden" name="slug" value={slug} />
      <button className={styles.btnDanger} type="submit">
        Șterge
      </button>
    </form>
  );
}
