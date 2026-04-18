export function normalizeCoachLocale(value) {
  const normalized = String(value ?? "").trim().toLowerCase();

  if (normalized === "pt") return "pt";
  if (normalized === "es") return "es";
  if (normalized === "fr") return "fr";
  return "en";
}

export function getCoachLocaleFromUser(user) {
  return normalizeCoachLocale(
    user?.user_metadata?.app_locale_code ??
      user?.user_metadata?.locale_code ??
      user?.app_metadata?.app_locale_code ??
      user?.app_metadata?.locale_code,
  );
}

export function applyCoachLocale(locale) {
  const normalized = normalizeCoachLocale(locale);

  if (typeof document !== "undefined") {
    document.documentElement.lang = normalized;
  }

  if (typeof window !== "undefined") {
    window.localStorage.setItem("apexcoach-locale", normalized);
  }

  return normalized;
}
