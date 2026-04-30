"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { LEGAL_CONFIG } from "../lib/legal-config";
import { hasCookieConsentChoice, readCookieConsent, saveCookieConsent } from "../lib/cookie-consent";

const COPY = {
  title: "Cookies e privacidade",
  text: "Usamos cookies essenciais para o funcionamento do site e, se concordares, analytics para medição.",
  essential: "Estritamente necessários",
  analytics: "Medição e analytics",
  acceptSelected: "Guardar",
  acceptAll: "Aceitar",
  essentialOnly: "Só essenciais",
  policy: "Política de Cookies",
  privacy: "Política de Privacidade",
};

export default function CookieBanner() {
  const [open, setOpen] = useState(false);
  const [analytics, setAnalytics] = useState(false);

  useEffect(() => {
    const existing = readCookieConsent();
    setAnalytics(Boolean(existing.analytics));
    setOpen(!hasCookieConsentChoice());

    function openSettings() {
      const current = readCookieConsent();
      setAnalytics(Boolean(current.analytics));
      setOpen(true);
    }

    window.addEventListener("apexcoach:open-cookie-settings", openSettings);
    return () => window.removeEventListener("apexcoach:open-cookie-settings", openSettings);
  }, []);

  if (!open) return null;

  return (
    <div className="fixed bottom-3 left-3 right-3 z-[60] mx-auto max-w-3xl rounded-[20px] border border-[var(--border-strong)] bg-white p-3 shadow-[var(--shadow-panel)]">
      <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_280px] lg:items-end">
        <div>
          <p className="text-sm font-semibold text-[var(--text)]">{COPY.title}</p>
          <p className="mt-1.5 text-xs leading-5 text-[var(--text-muted)]">{COPY.text}</p>
          <div className="mt-2 flex flex-wrap gap-3 text-xs">
            <Link href="/legal/cookies" className="text-[var(--accent-strong)] underline-offset-4 hover:underline">
              {COPY.policy}
            </Link>
            <Link href="/legal/privacy" className="text-[var(--accent-strong)] underline-offset-4 hover:underline">
              {COPY.privacy}
            </Link>
          </div>
        </div>

        <div className="grid gap-2.5">
          <div className="rounded-[16px] border border-[var(--border)] bg-[var(--surface-muted)] p-2.5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-medium text-[var(--text)]">{COPY.essential}</p>
                <p className="mt-0.5 text-[11px] leading-4 text-[var(--text-muted)]">Sessão, autenticação, idioma e segurança.</p>
              </div>
              <span className="rounded-full bg-[var(--accent-soft)] px-2 py-1 text-[10px] font-semibold text-[var(--accent-strong)]">Ativo</span>
            </div>
          </div>

          <label className="rounded-[16px] border border-[var(--border)] bg-[var(--surface-muted)] p-2.5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-medium text-[var(--text)]">{COPY.analytics}</p>
                <p className="mt-0.5 text-[11px] leading-4 text-[var(--text-muted)]">Só ativado com o teu consentimento.</p>
              </div>
              <input
                type="checkbox"
                checked={analytics}
                onChange={(event) => setAnalytics(event.target.checked)}
                className="mt-1 h-4 w-4 accent-[var(--accent)]"
              />
            </div>
          </label>

          <div className="grid gap-2 sm:grid-cols-3">
            <button
              type="button"
              onClick={() => {
                saveCookieConsent({ analytics: false });
                setAnalytics(false);
                setOpen(false);
              }}
              className="rounded-2xl border border-[var(--border)] bg-white px-3 py-2 text-xs font-medium text-[var(--text-muted)]"
            >
              {COPY.essentialOnly}
            </button>
            <button
              type="button"
              onClick={() => {
                saveCookieConsent({ analytics });
                setOpen(false);
              }}
              className="rounded-2xl border border-[var(--border)] bg-white px-3 py-2 text-xs font-medium text-[var(--text)]"
            >
              {COPY.acceptSelected}
            </button>
            <button
              type="button"
              onClick={() => {
                saveCookieConsent({ analytics: true });
                setAnalytics(true);
                setOpen(false);
              }}
              className="rounded-2xl bg-[var(--accent)] px-3 py-2 text-xs font-semibold text-[var(--accent-foreground)]"
            >
              {COPY.acceptAll}
            </button>
          </div>

          <p className="text-[10px] leading-4 text-[var(--text-muted)]">
            Configuração aplicável ao domínio {LEGAL_CONFIG.websiteUrl}. Podes alterar esta escolha a qualquer momento.
          </p>
        </div>
      </div>
    </div>
  );
}
