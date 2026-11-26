"use server";

import { revalidatePath, updateTag } from "next/cache";
import { redirect } from "next/navigation";
import { isAuthenticated, signIn, signOut } from "@/lib/adminAuth";
import { deleteProduct, parseProductForm, upsertProduct } from "@/lib/adminCatalog";
import { CATALOG_TAG, blobEnabled } from "@/lib/catalogStore";
import { storeUpload } from "@/lib/uploads";
import { slugifyName } from "@/lib/slugify";

export type ActionState = { error: string } | null;

/**
 * Pe Vercel scrierile merg doar prin Vercel Blob; fără token, disc-ul e
 * read-only și salvarea ar eșua cu o eroare greu de înțeles.
 */
function storageError(): string | null {
  if (process.env.VERCEL && !blobEnabled()) {
    return "Vercel Blob nu este configurat (BLOB_READ_WRITE_TOKEN), deci modificările nu pot fi salvate.";
  }
  return null;
}

/** Invalidează cache-ul tuturor paginilor care afișează produse. */
function revalidateStore(slug?: string, brandSlug?: string) {
  // Textul cataloagelor stă în cache-ul de date Next (fetch cu tag); updateTag
  // îl expiră imediat, ca panoul și site-ul să vadă modificarea pe loc.
  updateTag(CATALOG_TAG);
  revalidatePath("/");
  revalidatePath("/produse");
  revalidatePath("/sitemap.xml");
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
  const blocked = storageError();
  if (blocked) return { error: blocked };
  const data = parseProductForm(formData);
  const isEdit = String(formData.get("mode") ?? "") === "edit";
  const slug = data.slug.trim();
  const brandSlug = data.brandSlug.trim();

  // Dacă a fost aleasă o poză, ea înlocuiește calea/linkul din câmpul text.
  const file = formData.get("imageFile");
  if (file instanceof File && file.size > 0) {
    const uploaded = await storeUpload(file, slug || slugifyName(data.name));
    if ("error" in uploaded) return { error: uploaded.error };
    data.image = uploaded.url;
  }

  const error = await upsertProduct({ ...data, slug, brandSlug }, isEdit);
  if (error) return { error };
  revalidateStore(slug, brandSlug);
  const banner = isEdit ? "modificat" : "adaugat";
  redirect(`/admin/panou/produse?brand=${encodeURIComponent(brandSlug)}&${banner}=1`);
}

export async function deleteProductAction(formData: FormData): Promise<void> {
  if (!(await isAuthenticated())) redirect("/admin");
  const blocked = storageError();
  if (blocked) redirect(`/admin/panou/produse?eroare=${encodeURIComponent(blocked)}`);
  const brandSlug = String(formData.get("brandSlug") ?? "");
  const slug = String(formData.get("slug") ?? "");
  const error = await deleteProduct(brandSlug, slug);
  if (error) {
    redirect(
      `/admin/panou/produse?eroare=${encodeURIComponent(error)}`,
    );
  }
  revalidateStore(slug, brandSlug);
  redirect("/admin/panou/produse?sters=1");
}
