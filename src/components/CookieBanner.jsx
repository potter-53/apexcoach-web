"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { LEGAL_CONFIG } from "../lib/legal-config";
import { hasCookieConsentChoice, readCookieConsent, saveCookieConsent } from "../lib/cookie-consent";

const COPY = {
  title: "Cookies e privacidade",
  text: "Usamos cookies essenciais para o funcionamento do site e, se concordares, analytics para medição.",
  analytics: "Permitir analytics",
  reject: "Recusar opcionais",
  accept: "Aceitar",
  save: "Guardar escolha",
  policy: "Política de Cookies",
  privacy: "Política de Privacidade",
  alwaysOn: "Essenciais sempre ativos.",
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
          <label className="inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--surface-muted)] px-3 py-2 text-xs text-[var(--text)]">
            <input
              type="checkbox"
              checked={analytics}
              onChange={(event) => setAnalytics(event.target.checked)}
              className="h-4 w-4 accent-[var(--accent)]"
            />
            <span className="font-medium">{COPY.analytics}</span>
          </label>

          <div className="flex flex-wrap items-center gap-2 lg:flex-nowrap">
            <button
              type="button"
              onClick={() => {
                saveCookieConsent({ analytics: false });
                setAnalytics(false);
                setOpen(false);
              }}
              className="rounded-2xl border border-[var(--border)] bg-white px-3.5 py-2 text-xs font-medium text-[var(--text-muted)]"
            >
              {COPY.reject}
            </button>
            <button
              type="button"
              onClick={() => {
                saveCookieConsent({ analytics });
                setOpen(false);
              }}
              className="rounded-2xl border border-[var(--border)] bg-white px-3.5 py-2 text-xs font-medium text-[var(--text)]"
            >
              {COPY.save}
            </button>
            <button
              type="button"
              onClick={() => {
                saveCookieConsent({ analytics: true });
                setAnalytics(true);
                setOpen(false);
              }}
              className="rounded-2xl bg-[var(--accent)] px-4 py-2 text-xs font-semibold text-[var(--accent-foreground)]"
            >
              {COPY.accept}
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
