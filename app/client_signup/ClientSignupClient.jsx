"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  AlertCircle,
  ArrowLeft,
  CheckCircle2,
  Copy,
  LoaderCircle,
  Smartphone,
} from "lucide-react";

import { getSupabaseBrowserClient, isSupabaseConfigured } from "../../src/lib/supabase-browser";

const copyByLocale = {
  pt: {
    back: "Voltar",
    badge: "Onboarding client",
    title: "Ativar conta cliente",
    subtitle:
      "Valida o codigo do convite e define a tua palavra-passe para ativar o acesso na app APEX COACH.",
    code: "Codigo de convite",
    email: "Email",
    password: "Palavra-passe",
    goals: "Objetivo principal (opcional)",
    validate: "Validar convite",
    create: "Criar conta e ativar convite",
    creating: "A ativar...",
    invalidCode: "Codigo de convite invalido ou expirado.",
    inviteOk: "Convite validado.",
    done: "Conta ativada com sucesso.",
    openApp: "Abrir app",
    download: "Download app (.apk)",
    copyCode: "Copiar codigo",
    copied: "Codigo copiado.",
    missingEnv: "Variaveis do Supabase em falta no projeto web.",
    confirmEmail:
      "Conta criada. Confirma o email e depois faz login na app para concluir a ativacao.",
    fallbackError: "Nao foi possivel concluir o registo.",
    coach: "Coach",
    client: "Cliente",
  },
  en: {
    back: "Back",
    badge: "Client onboarding",
    title: "Activate client account",
    subtitle:
      "Validate the invite code and set your password to activate access in APEX COACH app.",
    code: "Invite code",
    email: "Email",
    password: "Password",
    goals: "Primary goal (optional)",
    validate: "Validate invite",
    create: "Create account and activate invite",
    creating: "Activating...",
    invalidCode: "Invite code is invalid or expired.",
    inviteOk: "Invite validated.",
    done: "Account activated successfully.",
    openApp: "Open app",
    download: "Download app (.apk)",
    copyCode: "Copy code",
    copied: "Code copied.",
    missingEnv: "Supabase environment variables are missing in this web project.",
    confirmEmail:
      "Account created. Confirm your email and then login in the app to finish activation.",
    fallbackError: "Could not complete signup.",
    coach: "Coach",
    client: "Client",
  },
};

function detectLocale() {
  if (typeof navigator === "undefined") return "en";
  return navigator.language?.toLowerCase().startsWith("pt") ? "pt" : "en";
}

function describeError(error, locale = "en") {
  const t = copyByLocale[locale] ?? copyByLocale.en;
  const raw = String(error?.message ?? error ?? "").trim();
  const lower = raw.toLowerCase();
  if (lower.includes("invalid login credentials")) return t.fallbackError;
  if (lower.includes("already registered")) return t.fallbackError;
  if (lower.includes("email")) return t.confirmEmail;
  return raw || t.fallbackError;
}

export default function ClientSignupClient() {
  const searchParams = useSearchParams();
  const configured = useMemo(() => isSupabaseConfigured(), []);
  const [locale, setLocale] = useState("en");
  const t = copyByLocale[locale] ?? copyByLocale.en;

  const [inviteCode, setInviteCode] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [goals, setGoals] = useState("");
  const [loadingPreview, setLoadingPreview] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [invitePreview, setInvitePreview] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    setLocale(detectLocale());
    const codeFromQuery =
      (searchParams.get("signup_code") ?? searchParams.get("code") ?? "").trim();
    if (codeFromQuery) setInviteCode(codeFromQuery);
  }, [searchParams]);

  const appDeepLink = useMemo(() => {
    const code = encodeURIComponent(inviteCode.trim());
    return `apexcoach://client-signup?signup_code=${code}`;
  }, [inviteCode]);

  async function validateInvite() {
    if (!configured) {
      setErrorMessage(t.missingEnv);
      return;
    }
    if (!inviteCode.trim()) {
      setErrorMessage(t.invalidCode);
      return;
    }
    setLoadingPreview(true);
    setErrorMessage("");
    setSuccessMessage("");
    try {
      const supabase = getSupabaseBrowserClient();
      const { data, error } = await supabase.rpc("get_client_invite_preview", {
        p_invite_token: inviteCode.trim(),
      });
      if (error) throw error;

      const row = Array.isArray(data) ? data[0] : data;
      if (!row) throw new Error(t.invalidCode);

      setInvitePreview(row);
      if (!email.trim() && row.email) setEmail(String(row.email));
      setSuccessMessage(t.inviteOk);
    } catch (error) {
      setInvitePreview(null);
      setErrorMessage(describeError(error, locale) || t.invalidCode);
    } finally {
      setLoadingPreview(false);
    }
  }

  async function handleSubmit(event) {
    event.preventDefault();
    if (!configured) {
      setErrorMessage(t.missingEnv);
      return;
    }
    if (!invitePreview) {
      setErrorMessage(t.invalidCode);
      return;
    }
    setSubmitting(true);
    setErrorMessage("");
    setSuccessMessage("");
    try {
      const supabase = getSupabaseBrowserClient();
      const normalizedEmail = email.trim().toLowerCase();
      const cleanCode = inviteCode.trim();

      let signedIn = false;
      try {
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email: normalizedEmail,
          password,
        });
        if (!signInError) signedIn = true;
      } catch {}

      if (!signedIn) {
        const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
          email: normalizedEmail,
          password,
          options: { data: { role: "athlete" } },
        });
        if (signUpError) throw signUpError;
        if (!signUpData.session) {
          setSuccessMessage(t.confirmEmail);
          return;
        }
      }

      const { error: acceptError } = await supabase.rpc("accept_client_invite", {
        p_invite_token: cleanCode,
        p_client_goals: goals.trim(),
      });
      if (acceptError) throw acceptError;
      setSuccessMessage(t.done);
    } catch (error) {
      setErrorMessage(describeError(error, locale));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="min-h-screen bg-[var(--bg)] text-[var(--text)]">
      <div className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,rgba(42,208,125,0.16),transparent_28%),radial-gradient(circle_at_bottom_right,rgba(124,77,255,0.08),transparent_22%),linear-gradient(180deg,#fbfbfb_0%,#f5f5f5_52%,#f2f4f3_100%)]" />
      <div className="mx-auto flex min-h-screen max-w-3xl flex-col px-5 py-8 lg:px-8">
        <Link
          href="/"
          className="inline-flex w-fit items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--surface-solid)] px-4 py-2 text-sm text-[var(--text-muted)]"
        >
          <ArrowLeft size={16} />
          {t.back}
        </Link>

        <section className="mt-8 rounded-[32px] border border-[var(--border-strong)] bg-[var(--surface-solid)] p-6 shadow-[var(--shadow-panel)] sm:p-8">
          <div className="inline-flex rounded-full border border-[var(--accent)]/20 bg-[linear-gradient(135deg,var(--accent-soft),rgba(124,77,255,0.08))] px-4 py-2 text-sm font-medium text-[var(--accent-strong)]">
            {t.badge}
          </div>
          <h1 className="mt-4 text-4xl font-semibold leading-tight">{t.title}</h1>
          <p className="mt-3 text-[var(--text-muted)]">{t.subtitle}</p>

          {!!errorMessage && (
            <div className="mt-5 flex items-start gap-3 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-rose-700">
              <AlertCircle size={18} className="mt-0.5 shrink-0" />
              <p className="text-sm">{errorMessage}</p>
            </div>
          )}

          {!!successMessage && (
            <div className="mt-5 flex items-start gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-emerald-700">
              <CheckCircle2 size={18} className="mt-0.5 shrink-0" />
              <p className="text-sm">{successMessage}</p>
            </div>
          )}

          <form className="mt-6 grid gap-4" onSubmit={handleSubmit}>
            <label className="grid gap-2">
              <span className="text-sm text-[var(--text-muted)]">{t.code}</span>
              <div className="flex gap-2">
                <input
                  value={inviteCode}
                  onChange={(event) => setInviteCode(event.target.value)}
                  className="w-full rounded-2xl border border-[var(--border)] bg-[var(--surface-muted)] px-4 py-3 text-[var(--text)] outline-none focus:border-[var(--accent)]/40 focus:bg-white"
                  required
                />
                <button
                  type="button"
                  onClick={async () => {
                    await navigator.clipboard.writeText(inviteCode.trim());
                    setSuccessMessage(t.copied);
                  }}
                  className="rounded-2xl border border-[var(--border)] bg-[var(--surface-solid)] px-3"
                  title={t.copyCode}
                >
                  <Copy size={16} />
                </button>
              </div>
            </label>

            <button
              type="button"
              onClick={validateInvite}
              disabled={loadingPreview}
              className="inline-flex items-center justify-center gap-2 rounded-2xl border border-[var(--border)] bg-[var(--surface-solid)] px-4 py-3 text-sm font-semibold"
            >
              {loadingPreview ? <LoaderCircle size={16} className="animate-spin" /> : null}
              {t.validate}
            </button>

            {invitePreview ? (
              <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface-muted)] px-4 py-3 text-sm">
                <p>
                  <strong>{t.client}:</strong> {String(invitePreview.client_name ?? "-")}
                </p>
                <p>
                  <strong>{t.coach}:</strong> {String(invitePreview.coach_name ?? "-")}
                </p>
              </div>
            ) : null}

            <label className="grid gap-2">
              <span className="text-sm text-[var(--text-muted)]">{t.email}</span>
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="rounded-2xl border border-[var(--border)] bg-[var(--surface-muted)] px-4 py-3 text-[var(--text)] outline-none focus:border-[var(--accent)]/40 focus:bg-white"
                required
              />
            </label>

            <label className="grid gap-2">
              <span className="text-sm text-[var(--text-muted)]">{t.password}</span>
              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="rounded-2xl border border-[var(--border)] bg-[var(--surface-muted)] px-4 py-3 text-[var(--text)] outline-none focus:border-[var(--accent)]/40 focus:bg-white"
                minLength={8}
                required
              />
            </label>

            <label className="grid gap-2">
              <span className="text-sm text-[var(--text-muted)]">{t.goals}</span>
              <textarea
                value={goals}
                onChange={(event) => setGoals(event.target.value)}
                rows={3}
                className="rounded-2xl border border-[var(--border)] bg-[var(--surface-muted)] px-4 py-3 text-[var(--text)] outline-none focus:border-[var(--accent)]/40 focus:bg-white"
              />
            </label>

            <button
              type="submit"
              disabled={submitting || !invitePreview}
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[var(--accent)] px-4 py-3 text-sm font-semibold text-[var(--accent-foreground)] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting ? <LoaderCircle size={16} className="animate-spin" /> : null}
              {submitting ? t.creating : t.create}
            </button>
          </form>

          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <a
              href={appDeepLink}
              className="inline-flex items-center justify-center gap-2 rounded-2xl border border-[var(--border)] bg-[var(--surface-solid)] px-4 py-3 text-sm font-semibold"
            >
              <Smartphone size={16} />
              {t.openApp}
            </a>
            <a
              href="/download/apk"
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[var(--accent)] px-4 py-3 text-sm font-semibold text-[var(--accent-foreground)]"
            >
              <Smartphone size={16} />
              {t.download}
            </a>
          </div>
        </section>
      </div>
    </main>
  );
}

