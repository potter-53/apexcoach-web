"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { LEGAL_CONFIG } from "../lib/legal-config";
import { hasCookieConsentChoice, saveCookieConsent } from "../lib/cookie-consent";

const COPY = {
  title: "Cookies e privacidade",
  text: "Usamos apenas tecnologias necessárias à autenticação, segurança, preferências e interações que inicias. Não estão ativos cookies de analytics ou publicidade.",
  acknowledge: "Entendi",
  policy: "Política de Cookies",
  privacy: "Política de Privacidade",
  alwaysOn: "Essenciais sempre ativos.",
};

export default function CookieBanner() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(!hasCookieConsentChoice());

    function openSettings() {
      setOpen(true);
    }

    window.addEventListener("nlock:open-cookie-settings", openSettings);
    return () => window.removeEventListener("nlock:open-cookie-settings", openSettings);
  }, []);

  if (!open) return null;

  return (
    <div className="fixed bottom-3 left-3 right-3 z-[60] mx-auto max-w-5xl rounded-[20px] border border-[var(--border-strong)] bg-white p-3 shadow-[var(--shadow-panel)]">
      <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center">
        <div className="min-w-0">
          <p className="text-sm font-semibold text-[var(--text)]">{COPY.title}</p>
          <p className="mt-1 text-xs leading-5 text-[var(--text-muted)]">{COPY.text}</p>
          <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs">
            <span className="text-[var(--text-muted)]">{COPY.alwaysOn}</span>
            <Link href="/legal/cookies" className="text-[var(--accent-strong)] underline-offset-4 hover:underline">
              {COPY.policy}
            </Link>
            <Link href="/legal/privacy" className="text-[var(--accent-strong)] underline-offset-4 hover:underline">
              {COPY.privacy}
            </Link>
          </div>
        </div>

        <div className="flex flex-col gap-2 lg:items-end">
          <div className="flex flex-wrap items-center gap-2 lg:flex-nowrap">
            <button
              type="button"
              onClick={() => {
                saveCookieConsent({ analytics: false });
                setOpen(false);
              }}
              className="rounded-2xl bg-[var(--accent)] px-4 py-2 text-xs font-semibold text-[var(--accent-foreground)]"
            >
              {COPY.acknowledge}
            </button>
          </div>

          <p className="max-w-[320px] text-[10px] leading-4 text-[var(--text-muted)] lg:text-right">
            Configuração aplicável ao domínio {LEGAL_CONFIG.websiteUrl}. Podes alterar esta escolha a qualquer momento.
          </p>
        </div>
      </div>
    </div>
  );
}
