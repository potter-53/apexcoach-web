import "../src/index.css";
import CookieBanner from "../src/components/CookieBanner";

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
    <html lang="en">
      <body>
        {children}
        <CookieBanner />
      </body>
    </html>
  );
}
