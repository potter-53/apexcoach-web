export function trackEvent(name, properties = {}) {
  if (typeof window === "undefined") return;

  const event = {
    name,
    properties,
    timestamp: new Date().toISOString(),
  };

  try {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push(event);
  } catch {}

  try {
    if (typeof window.gtag === "function") {
      window.gtag("event", name, properties);
    }
  } catch {}

  try {
    if (typeof window.plausible === "function") {
      window.plausible(name, { props: properties });
    }
  } catch {}

  if (process.env.NODE_ENV !== "production") {
    // Debug visibility in local development.
    console.info("[analytics]", event);
  }
}
