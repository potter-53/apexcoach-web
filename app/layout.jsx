import "../src/index.css";
import CookieBanner from "../src/components/CookieBanner";

export const metadata = {
  title: "APEX COACH | App + Browser para coaches",
  description:
    "APEX COACH é a plataforma para coaches que querem rapidez na app e um complemento web premium para trabalhar com mais profundidade.",
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
