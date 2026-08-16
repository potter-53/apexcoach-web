import SignupClient from "./SignupClient";
import { redirect } from "next/navigation";

export const metadata = {
  title: "Registo de Coach | NLOCK",
  description: "Cria a tua conta de coach NLOCK e escolhe entre iniciar o trial grátis ou subscrever.",
};

export default async function SignupPage({ searchParams }) {
  const params = await searchParams;
  if (params?.payment === "success" && params?.session_id) {
    redirect(`/signup/success?session_id=${encodeURIComponent(params.session_id)}`);
  }
  return <SignupClient />;
}
