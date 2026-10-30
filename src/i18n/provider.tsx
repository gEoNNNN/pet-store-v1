"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  DEFAULT_LOCALE,
  readLocaleCookie,
  writeLocaleCookie,
  type Locale,
} from "./config";
import { loadCatalog, type CatalogOverlay } from "./catalog";
import ro, { type DictNode } from "./dictionaries/ro";
import en from "./dictionaries/en";
import ru from "./dictionaries/ru";

const dictionaries: Record<Locale, Record<string, DictNode>> = {
  ro: ro as unknown as Record<string, DictNode>,
  en: en as unknown as Record<string, DictNode>,
  ru: ru as unknown as Record<string, DictNode>,
};

export type TranslateParams = Record<string, string | number>;

type I18nContextValue = {
  locale: Locale;
  /** Traducă text după „cale.dot.atare” sau segmente; fallback pe ro, apoi pe cheie. */
  t: (path: string | readonly string[], params?: TranslateParams) => string;
  /** Ca t(), dar folosește `fallback` dacă traducerea lipsește (pentru chei dinamice). */
  tOr: (path: string | readonly string[], fallback: string, params?: TranslateParams) => string;
  /** Node brut din dicționar (tablouri de șiruri) pentru conținut structurat. */
  list: (path: string | readonly string[]) => readonly string[];
  /** Suprapunerea tradusă pentru produse (null pe română sau până se încarcă). */
  catalog: CatalogOverlay | null;
  /** Alege forma de plural pentru localele active: one / few / many. */
  plural: (n: number) => "one" | "few" | "many";
  setLocale: (locale: Locale) => void;
};

const I18nContext = createContext<I18nContextValue | null>(null);

function lookup(node: DictNode | undefined, segments: readonly string[]): DictNode | undefined {
  return segments.reduce<DictNode | undefined>((current, segment) => {
    if (current === undefined) return undefined;
    if (Array.isArray(current)) {
      const index = Number(segment);
      return Number.isInteger(index) && index >= 0 && index < current.length
        ? current[index]
        : undefined;
    }
    if (typeof current === "object") {
      return (current as Record<string, DictNode>)[segment];
    }
    return undefined;
  }, node);
}

function interpolate(value: string, params?: TranslateParams): string {
  if (!params) return value;
  return value.replace(/\{(\w+)\}/g, (match, token: string) =>
    token in params ? String(params[token]) : match,
  );
}

export function pluralForm(locale: Locale, n: number): "one" | "few" | "many" {
  if (locale === "ru") {
    const mod10 = n % 10;
    const mod100 = n % 100;
    if (mod10 === 1 && mod100 !== 11) return "one";
    if (mod10 >= 2 && mod10 <= 4 && !(mod100 >= 12 && mod100 <= 14)) return "few";
    return "many";
  }
  return n === 1 ? "one" : "many";
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(DEFAULT_LOCALE);
  const [catalog, setCatalog] = useState<CatalogOverlay | null>(null);

  // La prima montare, restabilim limba salvată în cookie (fără mismatch de hydration).
  useEffect(() => {
    const saved = readLocaleCookie();
    if (saved && saved !== DEFAULT_LOCALE) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- cookie-ul e o sursă externă, citită post-montare
      setLocaleState(saved);
    }
  }, []);

  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  // Pe en/ru încărcăm suprapunerea tradusă a produselor (memorată în catalog.ts).
  useEffect(() => {
    if (locale === DEFAULT_LOCALE) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- resetare sincronă la limba română
      setCatalog(null);
      return;
    }
    let active = true;
    loadCatalog(locale)
      .then((data) => {
        if (active) setCatalog(data);
      })
      .catch(() => {
        // Fără traducere disponibilă — rămânem pe textul românesc.
        if (active) setCatalog(null);
      });
    return () => {
      active = false;
    };
  }, [locale]);

  const setLocale = useCallback((next: Locale) => {
    setLocaleState(next);
    writeLocaleCookie(next);
  }, []);

  const value = useMemo<I18nContextValue>(() => {
    const resolve = (segments: readonly string[]): DictNode | undefined => {
      const found = lookup(dictionaries[locale], segments);
      if (found !== undefined) return found;
      return lookup(dictionaries.ro, segments);
    };

    const translate = (segments: readonly string[], params?: TranslateParams): string | null => {
      const node = resolve(segments);
      if (typeof node === "string") return interpolate(node, params);
      return null;
    };

    return {
      locale,
      setLocale,
      catalog,
      t: (path, params) => {
        const segments = Array.isArray(path) ? path : String(path).split(".");
        return translate(segments, params) ?? segments.join(".");
      },
      tOr: (path, fallback, params) => {
        const segments = Array.isArray(path) ? path : String(path).split(".");
        return translate(segments, params) ?? fallback;
      },
      list: (path) => {
        const segments = Array.isArray(path) ? path : String(path).split(".");
        const node = resolve(segments);
        return Array.isArray(node) ? (node as readonly string[]) : [];
      },
      plural: (n) => pluralForm(locale, n),
    };
  }, [locale, setLocale, catalog]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n(): I18nContextValue {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error("useI18n trebuie folosit în interiorul <LanguageProvider>");
  }
  return context;
}
