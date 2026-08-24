const routes = ["", "/signup", "/affiliate", "/afiliado", "/apply", "/beta", "/legal/privacy", "/legal/terms", "/legal/cookies", "/legal/consumer"];

export default function sitemap() {
  const lastModified = new Date();
  return routes.map((route) => ({
    url: `https://nlock.pt${route || "/"}`,
    lastModified,
    changeFrequency: route === "" ? "weekly" : "monthly",
    priority: route === "" ? 1 : route === "/signup" ? 0.9 : 0.6,
  }));
}
