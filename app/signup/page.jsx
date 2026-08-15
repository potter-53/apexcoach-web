import SignupClient from "./SignupClient";

export const metadata = {
  title: "Registo de Coach | NLOCK",
  description: "Cria a tua conta de coach NLOCK e escolhe entre iniciar o trial grátis ou subscrever.",
};

export default function SignupPage() {
  return <SignupClient />;
}
