import NlockLogin from "./NlockLogin";

export const metadata = {
  title: "Entrar | NLOCK",
  description: "Entra no teu workspace NLOCK.",
  robots: { index: false, follow: false },
};

export default function NlockLoginPage() {
  return <NlockLogin />;
}
