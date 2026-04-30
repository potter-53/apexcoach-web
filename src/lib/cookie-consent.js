const STORAGE_KEY = "apexcoach_cookie_preferences_v1";

export const DEFAULT_COOKIE_CONSENT = {
  essential: true,
  analytics: false,
  updatedAt: null,
};

export function readCookieConsent() {
  if (typeof window === "undefined") return DEFAULT_COOKIE_CONSENT;

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_COOKIE_CONSENT;
    const parsed = JSON.parse(raw);
    return {
      essential: true,
      analytics: Boolean(parsed?.analytics),
      updatedAt: parsed?.updatedAt || null,
    };
  } catch {
    return DEFAULT_COOKIE_CONSENT;
  }
}

export function saveCookieConsent(preferences) {
  if (typeof window === "undefined") return DEFAULT_COOKIE_CONSENT;

  const nextValue = {
    essential: true,
    analytics: Boolean(preferences?.analytics),
    updatedAt: new Date().toISOString(),
  };

  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(nextValue));
  } catch {}

  try {
    window.dispatchEvent(new CustomEvent("apexcoach:cookie-consent-changed", { detail: nextValue }));
  } catch {}

  return nextValue;
}

export function hasCookieConsentChoice() {
  if (typeof window === "undefined") return false;

  try {
    return Boolean(window.localStorage.getItem(STORAGE_KEY));
  } catch {
    return false;
  }
}

export function canTrackAnalytics() {
  return Boolean(readCookieConsent().analytics);
}
