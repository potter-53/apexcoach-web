"use client";

import { useEffect, useState } from "react";
import { CheckCircle2, Clock3, MailCheck, Smartphone } from "lucide-react";
import { getSupabaseBrowserClient, isSupabaseConfigured } from "../../../src/lib/supabase-browser";

function StatusBadge({ validated }) {
  return (
    <span
      className={`ml-auto inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] ${
        validated
          ? "bg-[var(--accent-soft)] text-[var(--accent-strong)]"
          : "bg-amber-500/12 text-amber-500"
      }`}
    >
      {validated ? <CheckCircle2 size={13} /> : <Clock3 size={13} />}
      {validated ? "Validado" : "Pendente"}
    </span>
  );
}

function StepCard({ step, validated, icon: Icon, title, pendingCopy, validatedCopy }) {
  return (
    <article
      className={`rounded-[22px] border p-5 transition-colors ${
        validated
          ? "border-[var(--accent-strong)] bg-[var(--accent-soft)]"
          : "border-[var(--border)] bg-[var(--surface-solid)]"
      }`}
    >
      <div className="flex items-center gap-3">
        <span
          className={`flex h-10 w-10 items-center justify-center rounded-full ${
            validated
              ? "bg-[var(--accent-soft)] text-[var(--accent-strong)]"
              : "bg-amber-500/12 text-amber-500"
          }`}
        >
          {validated ? <Icon size={20} /> : <Clock3 size={20} />}
        </span>
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--accent-strong)]">
          Passo {step}
        </p>
        <StatusBadge validated={validated} />
      </div>
      <h2 className="mt-5 text-xl font-semibold tracking-[-0.025em]">{title}</h2>
      <p className="mt-2 text-sm leading-6 text-[var(--text-muted)]">
        {validated ? validatedCopy : pendingCopy}
      </p>
    </article>
  );
}

export default function SignupStepsStatus({ sessionId, emailVerified = false, trialSignup = false }) {
  const [status, setStatus] = useState({
    emailValidated: emailVerified,
    appValidated: false,
  });

  useEffect(() => {
    let cancelled = false;
    let timer;
    let authSubscription;

    async function refresh() {
      try {
        let url = `/api/signup/status?session_id=${encodeURIComponent(sessionId)}`;
        const headers = {};

        if (trialSignup) {
          url = "/api/signup/status";
          const queryToken = new URLSearchParams(window.location.search).get("status_token");
          if (queryToken) {
            window.sessionStorage.setItem("nlock_signup_status_token", queryToken);
            const cleanUrl = new URL(window.location.href);
            cleanUrl.searchParams.delete("status_token");
            window.history.replaceState({}, "", cleanUrl);
          }
          const statusToken = queryToken || window.sessionStorage.getItem("nlock_signup_status_token");
          if (statusToken) {
            headers["X-Signup-Status-Token"] = statusToken;
          } else {
            if (!isSupabaseConfigured()) return;
            const supabase = getSupabaseBrowserClient();
            const { data } = await supabase.auth.getSession();
            const accessToken = data.session?.access_token;
            if (!accessToken) return;
            headers.Authorization = `Bearer ${accessToken}`;
          }
        } else if (!sessionId) {
          return;
        }

        const response = await fetch(
          url,
          { cache: "no-store", headers },
        );
        if (!response.ok) return;
        const next = await response.json();
        if (cancelled || !next.ok) return;
        setStatus({
          emailValidated: Boolean(next.emailValidated),
          appValidated: Boolean(next.appValidated),
        });
        if (next.emailValidated && next.appValidated) clearInterval(timer);
      } catch {
        // Mantemos o último estado conhecido e tentamos novamente.
      }
    }

    refresh();
    timer = window.setInterval(refresh, 5000);

    if (trialSignup && isSupabaseConfigured()) {
      const supabase = getSupabaseBrowserClient();
      const { data } = supabase.auth.onAuthStateChange(() => {
        window.setTimeout(refresh, 0);
      });
      authSubscription = data.subscription;
    }

    return () => {
      cancelled = true;
      clearInterval(timer);
      authSubscription?.unsubscribe();
    };
  }, [sessionId, trialSignup]);

  return (
    <div className="grid gap-4">
      {status.emailValidated && status.appValidated ? (
        <div className="flex items-start gap-4 rounded-[22px] border border-[var(--accent-strong)] bg-[var(--accent-soft)] p-5 text-[var(--text)]">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full [background:var(--brand-gradient)] text-[#03130e]">
            <CheckCircle2 size={23} />
          </span>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--accent-strong)]">Tudo pronto</p>
            <h2 className="mt-1 text-xl font-semibold tracking-[-0.025em]">Bem-vindo à NLOCK!</h2>
            <p className="mt-1 text-sm leading-6 text-[var(--text-muted)]">Email confirmado e primeiro login concluído. A tua conta coach está ativa.</p>
          </div>
        </div>
      ) : null}

      <div className="grid gap-4 sm:grid-cols-2">
        <StepCard
          step="1"
          validated={status.emailValidated}
          icon={MailCheck}
          title={status.emailValidated ? "Email validado" : "Valida o teu email"}
          pendingCopy="Enviámos uma mensagem para o email usado no registo. Abre-a e confirma a tua conta NLOCK."
          validatedCopy="Confirmação concluída. O teu email NLOCK está validado."
        />
        <StepCard
          step="2"
          validated={status.appValidated}
          icon={Smartphone}
          title={status.appValidated ? "App validada" : "Entra na app"}
          pendingCopy="Faz download da app NLOCK e inicia sessão com o mesmo email e palavra-passe. Esta página atualiza automaticamente."
          validatedCopy="Primeiro login concluído. A tua app NLOCK está ativa."
        />
      </div>
    </div>
  );
}
