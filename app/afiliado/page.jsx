import AffiliateProgrammePage from "../affiliate/AffiliateProgrammePage";

export const metadata = {
  title: "Coach Fundador NLOCK | As primeiras 50 vagas",
  description: "Descobre as vantagens exclusivas dos primeiros 50 Coaches Fundadores que ajudam a validar, melhorar e fazer crescer a NLOCK.",
  alternates: { canonical: "/afiliado" },
  openGraph: {
    title: "Coach Fundador NLOCK | As primeiras 50 vagas",
    description: "Desbloqueia o teu potencial completo como um dos primeiros 50 Coaches Fundadores NLOCK.",
    url: "https://nlock.pt/afiliado",
    siteName: "NLOCK",
    type: "website",
  },
};

export default function Page() {
  return <AffiliateProgrammePage />;
}
