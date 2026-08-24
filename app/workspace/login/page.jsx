import NlockLogin from "../../app/login/NlockLogin";

export const metadata = {
  title: "Entrar no Workspace | NLOCK",
  description: "Entra no teu workspace NLOCK.",
  robots: { index: false, follow: false },
};

export default function WorkspaceLoginPage() {
  return <NlockLogin />;
}
