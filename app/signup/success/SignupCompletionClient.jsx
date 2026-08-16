"use client";

import { useEffect, useRef, useState } from "react";
import { CheckCircle2, LoaderCircle } from "lucide-react";

import { getSupabaseBrowserClient } from "../../../src/lib/supabase-browser";

export default function SignupCompletionClient({ sessionId, email, checkoutMetadata }) {
  const started = useRef(false);
  const [state, setState] = useState("creating");
  const [message, setMessage] = useState("A criar a tua conta NLOCK…");

  useEffect(() => {
    if (started.current) return;
    started.current = true;

    async function completeSignup() {
      try {
        const pending = JSON.parse(window.sessionStorage.getItem("nlock_pending_signup") || "null");
        if (!pending?.password || pending?.email !== email) {
          setState("needs_password");
          setMessage("O pagamento está confirmado. Volta ao registo neste dispositivo para definires a palavra-passe da conta.");
          return;
        }

        const supabase = getSupabaseBrowserClient();
        let userId = pending.userId || "";
        const { data, error } = userId ? { data: null, error: null } : await supabase.auth.signUp({
          email,
          password: pending.password,
          options: {
            emailRedirectTo: `${window.location.origin}/?email_verified=1`,
            data: {
              full_name: pending.fullName || checkoutMetadata.full_name || "Coach",
              role: "coach",
              founder_access_requested: pending.founderIntent === true,
              founder_profile_onboarding_required: pending.founderIntent === true,
              trial_requested: false,
              selected_plan: pending.founderIntent ? "founder" : pending.selectedPlan,
              registration_mode: "subscription",
              access_tier: pending.accessTier || checkoutMetadata.access_tier || "coach",
              subscription_category: pending.subscriptionCategory || checkoutMetadata.subscription_category,
              billing_campaign_key: pending.subscriptionCategory || checkoutMetadata.subscription_category,
              accepted_terms_at: pending.submittedAt,
              accepted_privacy_at: pending.submittedAt,
              accepted_legal_version: "2026-04",
            },
          },
        });
        if (error) throw error;
        if (!userId && (!data?.user?.id || (Array.isArray(data.user.identities) && data.user.identities.length === 0))) {
          throw new Error("Este email já tem uma conta NLOCK.");
        }
        userId = userId || data.user.id;
        window.sessionStorage.setItem("nlock_pending_signup", JSON.stringify({ ...pending, userId }));

        const claimResponse = await fetch("/api/billing/claim", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ sessionId, userId }),
        });
        if (!claimResponse.ok) throw new Error("O pagamento foi confirmado, mas a subscrição ainda está a sincronizar.");

        window.sessionStorage.removeItem("nlock_pending_signup");
        setState("complete");
        setMessage("Conta criada. Enviámos o email de confirmação.");
      } catch (error) {
        setState("error");
        setMessage(error?.message || "Não foi possível concluir a criação da conta.");
      }
    }

    completeSignup();
  }, [checkoutMetadata, email, sessionId]);

  return (
    <div className="mb-4 flex items-center gap-3 rounded-2xl border border-[var(--border)] bg-[var(--surface-solid)] px-4 py-4">
      {state === "creating" ? (
        <LoaderCircle className="shrink-0 animate-spin text-[var(--accent-strong)]" size={22} />
      ) : (
        <CheckCircle2 className={`shrink-0 ${state === "complete" ? "text-[var(--accent-strong)]" : "text-amber-500"}`} size={22} />
      )}
      <div>
        <p className="text-sm font-semibold text-[var(--text)]">{state === "complete" ? "Conta NLOCK pronta" : "Conclusão do registo"}</p>
        <p className="mt-1 text-sm text-[var(--text-muted)]">{message}</p>
      </div>
    </div>
  );
}
