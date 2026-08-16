import "../src/styles/nlock-tokens.css";
import "../src/index.css";
import CookieBanner from "../src/components/CookieBanner";

const themeBootstrapScript = `
  (() => {
    try {
      const stored = localStorage.getItem("nlock-theme");
      const theme = stored === "light" || stored === "dark"
        ? stored
        : (matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
      document.documentElement.dataset.theme = theme;
      document.documentElement.style.colorScheme = theme;
    } catch (_) {}
  })();
`;

export const metadata = {
  metadataBase: new URL("https://nlock.pt"),
  title: "NLOCK | App para coaches",
  description:
    "NLOCK é a app para coaches que querem sessões mais rápidas, acompanhamento mais claro e uma operação profissional.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "NLOCK | App para coaches",
    description:
      "Experimenta a NLOCK e gere clientes, sessões, treino e avaliações num único sistema.",
    url: "https://nlock.pt",
    siteName: "NLOCK",
    type: "website",
  },
  icons: {
    icon: "/favicon-logo.png",
    shortcut: "/favicon-logo.png",
    apple: "/favicon-logo.png",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeBootstrapScript }} />
      </head>
      <body>
        {children}
        <CookieBanner />
      </body>
    </html>
  );
}
