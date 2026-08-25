import TestLanding from "./test/TestLanding";

export const metadata = {
  title: "NLOCK — NLOCK your full potential",
  description:
    "A NLOCK acompanha o coach antes, durante e depois de cada sessão — agenda, treino, avaliações e operação num só lugar.",
  alternates: { canonical: "https://nlock.pt/" },
  robots: { index: true, follow: true },
  openGraph: {
    title: "NLOCK — NLOCK your full potential",
    description:
      "Agenda, treino, avaliações e operação num só lugar para coaches.",
    url: "https://nlock.pt/",
    siteName: "NLOCK",
    type: "website",
  },
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
    apple: "/favicon.svg",
  },
};

export default function HomePage() {
  return <TestLanding />;
}
