import "server-only";

import crypto from "node:crypto";
import { cookies } from "next/headers";

/** Numele cookie-ului de sesiune pentru panoul de administrare. */
export const ADMIN_COOKIE_NAME = "farmavet_admin";

/** Dureaza sesiunea: 12 ore. */
const SESSION_MAX_AGE_SECONDS = 12 * 60 * 60;

/**
 * Intoarce parola administratorului setata prin variabila de mediu
 * ADMIN_PASSWORD, sau null daca variabila nu este configurata.
 */
function getAdminPassword(): string | null {
  const value = process.env.ADMIN_PASSWORD;
  if (!value || !value.trim()) return null;
  return value.trim();
}

/** Spune daca panoul este configurat (există ADMIN_PASSWORD). */
export function isConfigured(): boolean {
  return getAdminPassword() !== null;
}

/** Semnatura HMAC a sesiunii, derivata din parola si din secretele proiectului. */
function expectedToken(): string {
  const password = getAdminPassword() ?? "";
  const secret = process.env.ADMIN_SECRET || "farmavet-admin-local-dev-secret";
  return crypto
    .createHmac("sha256", secret)
    .update(`farmavet-admin:${password}`)
    .digest("hex");
}

function sameToken(a: string, b: string): boolean {
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  return bufA.length === bufB.length && crypto.timingSafeEqual(bufA, bufB);
}

/** Verifica daca vizitatorul curent este autentificat ca administrator. */
export async function isAuthenticated(): Promise<boolean> {
  if (!isConfigured()) return false;
  const cookieStore = await cookies();
  const value = cookieStore.get(ADMIN_COOKIE_NAME)?.value;
  if (!value) return false;
  return sameToken(value, expectedToken());
}

/** Incearca autentificarea cu parola data si creeaza sesiunea. */
export async function signIn(password: string): Promise<boolean> {
  const expected = getAdminPassword();
  if (!expected) return false;
  const isCorrect = sameToken(
    crypto.createHash("sha256").update(password.trim()).digest("hex"),
    crypto.createHash("sha256").update(expected).digest("hex"),
  );
  if (!isCorrect) return false;

  const cookieStore = await cookies();
  cookieStore.set(ADMIN_COOKIE_NAME, expectedToken(), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_MAX_AGE_SECONDS,
  });
  return true;
}

/** Sterge sesiunea de administrator. */
export async function signOut(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(ADMIN_COOKIE_NAME);
}
