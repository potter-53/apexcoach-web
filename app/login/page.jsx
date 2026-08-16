import { redirect } from "next/navigation";

export const metadata = {
  title: "NLOCK",
  description: "A plataforma NLOCK está disponível na app.",
};

export default function LoginPage() {
  redirect("/");
}
