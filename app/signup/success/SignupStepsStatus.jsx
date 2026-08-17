"use client";

import { useEffect, useState } from "react";
import { CheckCircle2, Clock3, MailCheck, Smartphone } from "lucide-react";

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

export default function SignupStepsStatus({ sessionId, emailVerified = false }) {
  const [status, setStatus] = useState({
    emailValidated: emailVerified,
    appValidated: false,
  });

  useEffect(() => {
    let cancelled = false;
    let timer;

    async function refresh() {
      try {
        const response = await fetch(
          `/api/signup/status?session_id=${encodeURIComponent(sessionId)}`,
          { cache: "no-store" },
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
    return () => {
      cancelled = true;
      clearInterval(timer);
    };
  }, [sessionId]);

  return (
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
        pendingCopy="Faz download da app NLOCK e inicia sessão com o mesmo email e palavra-passe."
        validatedCopy="Primeiro login concluído. A tua app NLOCK está ativa."
      />
    </div>
  );
}
