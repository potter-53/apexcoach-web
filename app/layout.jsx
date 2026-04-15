import "../src/index.css";

export const metadata = {
  title: "APEX COACH | App + Browser para coaches",
  description:
    "APEX COACH é a plataforma para coaches que querem rapidez na app e um complemento web premium para trabalhar com mais profundidade.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt">
      <body>{children}</body>
    </html>
  );
}
