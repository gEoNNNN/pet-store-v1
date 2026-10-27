"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { isAuthenticated, signIn, signOut } from "@/lib/adminAuth";
import { deleteProduct, parseProductForm, upsertProduct } from "@/lib/adminCatalog";
import { invalidateProductCache } from "@/data/productCatalog.server";

export type ActionState = { error: string } | null;

/** Invalidează cache-ul tuturor paginilor care afișează produse. */
function revalidateStore(slug?: string, brandSlug?: string) {
  invalidateProductCache();
  revalidatePath("/");
  revalidatePath("/produse");
  revalidatePath("/admin/panou");
  revalidatePath("/admin/panou/produse");
  if (slug && brandSlug) {
    revalidatePath(`/produse/${brandSlug}/${slug}`);
  }
}

export async function loginAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const password = String(formData.get("password") ?? "");
  const ok = await signIn(password);
  if (!ok) return { error: "Parolă incorectă. Încearcă din nou." };
  redirect("/admin/panou");
}

export async function logoutAction(): Promise<void> {
  await signOut();
  redirect("/admin");
}

export async function saveProductAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  if (!(await isAuthenticated())) redirect("/admin");
  const data = parseProductForm(formData);
  const isEdit = String(formData.get("mode") ?? "") === "edit";
  const slug = data.slug.trim();
  const brandSlug = data.brandSlug.trim();
  const error = upsertProduct({ ...data, slug, brandSlug }, isEdit);
  if (error) return { error };
  revalidateStore(slug, brandSlug);
  const banner = isEdit ? "modificat" : "adaugat";
  redirect(`/admin/panou/produse?brand=${encodeURIComponent(brandSlug)}&${banner}=1`);
}

export async function deleteProductAction(formData: FormData): Promise<void> {
  if (!(await isAuthenticated())) redirect("/admin");
  const brandSlug = String(formData.get("brandSlug") ?? "");
  const slug = String(formData.get("slug") ?? "");
  const error = deleteProduct(brandSlug, slug);
  if (error) {
    redirect(
      `/admin/panou/produse?eroare=${encodeURIComponent(error)}`,
    );
  }
  revalidateStore();
  redirect("/admin/panou/produse?sters=1");
}
