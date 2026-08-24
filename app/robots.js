export default function robots() {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/workspace", "/workspace/", "/app", "/app/", "/api/", "/signup/success", "/test"],
    },
    sitemap: "https://nlock.pt/sitemap.xml",
    host: "https://nlock.pt",
  };
}
