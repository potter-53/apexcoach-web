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
  metadataBase: new URL("https://apexcoach.pt"),
  title: "APEX COACH | App for coaches",
  description:
    "APEX COACH is the mobile app for coaches who want faster sessions, clearer client follow-up, and a more professional day-to-day workflow.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "APEX COACH | App for coaches",
    description:
      "Apply for APEX COACH access and test a premium operating system for coaches.",
    url: "https://apexcoach.pt",
    siteName: "APEX COACH",
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
