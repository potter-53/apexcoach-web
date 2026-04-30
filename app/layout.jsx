import "../src/index.css";
import CookieBanner from "../src/components/CookieBanner";

export const metadata = {
  title: "APEX COACH | Pilot app for coaches",
  description:
    "APEX COACH is the pilot mobile app for coaches who want faster session work, cleaner software logic, and real field feedback before the next product step.",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
    apple: "/logo.png",
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
