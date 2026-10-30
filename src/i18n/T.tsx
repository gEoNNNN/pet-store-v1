"use client";

import { useI18n, type TranslateParams } from "./provider";

/**
 * Text localizat pentru componente server: primește doar cheia dicționarului,
 * deci rămâne compatibil cu randarea statică. `fallback` se folosește pentru
 * chei dinamice (ex. valori de filtre) care pot să nu fie traduse.
 */
export default function T({
  k,
  params,
  fallback,
}: {
  k: string;
  params?: TranslateParams;
  fallback?: string;
}) {
  const { t, tOr } = useI18n();
  return <>{fallback === undefined ? t(k, params) : tOr(k, fallback, params)}</>;
}
