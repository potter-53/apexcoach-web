export const COACH_LANGUAGE_OPTIONS = [
  { value: "en", label: "English", short: "EN", flag: "\uD83C\uDDEC\uD83C\uDDE7" },
  { value: "pt", label: "Português", short: "PT", flag: "\uD83C\uDDF5\uD83C\uDDF9" },
  { value: "es", label: "Español", short: "ES", flag: "\uD83C\uDDEA\uD83C\uDDF8" },
  { value: "fr", label: "Français", short: "FR", flag: "\uD83C\uDDEB\uD83C\uDDF7" },
];

export function normalizeCoachLocale(value) {
  const normalized = String(value ?? "").trim().toLowerCase();

  if (normalized === "pt") return "pt";
  if (normalized === "es") return "es";
  if (normalized === "fr") return "fr";
  return "en";
}

export function getStoredCoachLocale(user) {
  const raw =
    user?.user_metadata?.app_locale_code ??
    user?.user_metadata?.locale_code ??
    user?.app_metadata?.app_locale_code ??
    user?.app_metadata?.locale_code;

  if (raw == null || String(raw).trim() === "") {
    return null;
  }

  return normalizeCoachLocale(raw);
}

export function getCoachLocaleFromUser(user) {
  return normalizeCoachLocale(getStoredCoachLocale(user));
}

export function guessCoachLocale() {
  try {
    const browserLocale =
      typeof navigator !== "undefined"
        ? navigator.languages?.[0] || navigator.language
        : Intl.DateTimeFormat().resolvedOptions().locale;

    const normalized = String(browserLocale ?? "").toLowerCase();

    if (normalized.includes("-pt") || normalized.startsWith("pt")) return "pt";
    if (normalized.includes("-es") || normalized.startsWith("es")) return "es";
    if (normalized.includes("-fr") || normalized.startsWith("fr")) return "fr";
  } catch {}

  return "en";
}

export function getBrowserStoredLocale() {
  try {
    if (typeof window === "undefined") return null;
    const stored = window.localStorage.getItem("apexcoach-locale");
    if (!stored) return null;
    return normalizeCoachLocale(stored);
  } catch {
    return null;
  }
}

export function getInitialBrowserLocale() {
  return getBrowserStoredLocale() || guessCoachLocale();
}

export function applyCoachLocale(locale) {
  const normalized = normalizeCoachLocale(locale);

  try {
    if (typeof document !== "undefined") {
      document.documentElement.lang = normalized;
    }
  } catch {}

  try {
    if (typeof window !== "undefined") {
      window.localStorage.setItem("apexcoach-locale", normalized);
    }
  } catch {}

  return normalized;
}
