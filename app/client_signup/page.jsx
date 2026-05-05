import { Suspense } from "react";
import ClientSignupClient from "./ClientSignupClient";

export const metadata = {
  title: "Client Signup | APEX COACH",
  description: "Client onboarding page to activate the APEX COACH client account.",
};

export default function ClientSignupPage() {
  return (
    <Suspense fallback={null}>
      <ClientSignupClient />
    </Suspense>
  );
}
