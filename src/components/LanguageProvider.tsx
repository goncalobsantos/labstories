"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";
import {
  translations,
  type Locale,
  type Translations,
} from "@/lib/translations";

const STORAGE_KEY = "labstories-lang";

interface LanguageContextValue {
  locale: Locale;
  t: Translations;
  toggle: () => void;
}

const LanguageContext = createContext<LanguageContextValue>({
  locale: "en",
  t: translations.en,
  toggle: () => {},
});

function detectLocale(): Locale {
  // Check localStorage first
  if (typeof window !== "undefined") {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === "en" || stored === "pt") return stored;
  }

  // Auto-detect from browser language
  if (typeof navigator !== "undefined") {
    const lang = navigator.language || (navigator as { userLanguage?: string }).userLanguage || "";
    // Match pt-PT, pt-BR, or just pt — but we only default to PT for Portugal
    if (lang.toLowerCase().startsWith("pt-pt") || lang.toLowerCase() === "pt") {
      return "pt";
    }
  }

  return "en";
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [locale, setLocale] = useState<Locale>("en");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setLocale(detectLocale());
    setMounted(true);
  }, []);

  const toggle = useCallback(() => {
    setLocale((prev) => {
      const next = prev === "en" ? "pt" : "en";
      localStorage.setItem(STORAGE_KEY, next);
      return next;
    });
  }, []);

  // Avoid hydration mismatch — render with "en" on server, correct locale after mount
  const t = translations[mounted ? locale : "en"];

  return (
    <LanguageContext.Provider value={{ locale: mounted ? locale : "en", t, toggle }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
