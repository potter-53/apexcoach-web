"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import {
  AlertCircle,
  ArrowLeft,
  CheckCircle2,
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
    email: "Email",
    password: "Palavra-passe",
    confirmPassword: "Confirmar palavra-passe",
    goals: "Objetivo principal",
    validate: "A validar convite...",
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
    doneApex:
      "Bem-vindo(a) a APEX COACH. A tua conta está ativa e pronta para elevar o teu processo.",
    successPopupTitle: "Conta ativa",
    successPopupText: "Queres fazer download da APK agora ou voltar à landing page?",
    goLandingNow: "Voltar à landing",
    autoRedirectIn: "Redirecionamento automático em",
    popupPendingEmail: "Conta criada. Confirma o email e depois abre a app.",
    coach: "Coach",
    client: "Cliente",
  },
  en: {
    back: "Back",
    badge: "Client onboarding",
    title: "Activate client account",
    subtitle:
      "Validate the invite code and set your password to activate access in APEX COACH app.",
    email: "Email",
    password: "Password",
    confirmPassword: "Confirm password",
    goals: "Primary goal",
    validate: "Validating invite...",
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
    doneApex:
      "Welcome to APEX COACH. Your account is now active and ready to elevate your journey.",
    successPopupTitle: "Account active",
    successPopupText: "Do you want to download the APK now or go back to the landing page?",
    goLandingNow: "Back to landing",
    autoRedirectIn: "Auto redirect in",
    popupPendingEmail: "Account created. Confirm your email and then open the app.",
    coach: "Coach",
    client: "Client",
  },
};

function detectLocale(searchParams) {
  const queryLang = (searchParams?.get("lang") ?? "").toLowerCase().trim();
  if (queryLang === "pt" || queryLang === "en") return queryLang;
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
  const uiVersion = "signup-v2026-05-06-3";
  const router = useRouter();
  const searchParams = useSearchParams();
  const configured = useMemo(() => isSupabaseConfigured(), []);
  const [locale, setLocale] = useState("en");
  const t = copyByLocale[locale] ?? copyByLocale.en;

  const [inviteCode, setInviteCode] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [goals, setGoals] = useState("");
  const [loadingPreview, setLoadingPreview] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [invitePreview, setInvitePreview] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [redirectCountdown, setRedirectCountdown] = useState(20);
  const [popupText, setPopupText] = useState("");
  const [signupCompleted, setSignupCompleted] = useState(false);

  useEffect(() => {
    setLocale(detectLocale(searchParams));
    const codeFromQuery =
      (searchParams.get("signup_code") ?? searchParams.get("code") ?? "").trim();
    if (codeFromQuery) setInviteCode(codeFromQuery);
  }, [searchParams]);

  useEffect(() => {
    if (!inviteCode.trim() || invitePreview || loadingPreview) return;
    validateInvite();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inviteCode]);

  useEffect(() => {
    if (!showSuccessPopup) return;
    setRedirectCountdown(20);
    const intervalId = window.setInterval(() => {
      setRedirectCountdown((prev) => (prev > 1 ? prev - 1 : 0));
    }, 1000);
    const timeoutId = window.setTimeout(() => {
      router.push("/");
    }, 20000);
    return () => {
      window.clearInterval(intervalId);
      window.clearTimeout(timeoutId);
    };
  }, [showSuccessPopup, router]);

  useEffect(() => {
    if (!signupCompleted) return;
    setShowSuccessPopup(true);
  }, [signupCompleted]);

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
      if (row.email) setEmail(String(row.email));
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
    if (password !== confirmPassword) {
      setErrorMessage(locale === "pt" ? "As palavras-passe nao coincidem." : "Passwords do not match.");
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
          setPopupText(t.popupPendingEmail ?? t.confirmEmail);
          setSignupCompleted(true);
          return;
        }
      }

      const { data: acceptData, error: acceptError } = await supabase.rpc("accept_client_invite", {
        p_invite_token: cleanCode,
        p_client_goals: goals.trim(),
      });
      if (acceptError) throw acceptError;

      // Fallback persistence in case RPC path does not propagate goals in some envs.
      const normalizedGoals = goals.trim();
      if (normalizedGoals.length > 0) {
        const acceptedRow = Array.isArray(acceptData) ? acceptData[0] : acceptData;
        const studentId = String(invitePreview?.student_id ?? acceptedRow?.student_id ?? "").trim();
        if (studentId) {
          await supabase
            .from("students")
            .update({
              client_goals: normalizedGoals,
              main_goal: normalizedGoals,
            })
            .eq("id", studentId);
        }
      }
      setSuccessMessage(t.doneApex ?? t.done);
      setPopupText(t.doneApex ?? t.done);
      setSignupCompleted(true);
    } catch (error) {
      setErrorMessage(describeError(error, locale));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="h-[100dvh] overflow-hidden bg-[var(--bg)] text-[var(--text)]">
      <div className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,rgba(42,208,125,0.16),transparent_28%),radial-gradient(circle_at_bottom_right,rgba(124,77,255,0.08),transparent_22%),linear-gradient(180deg,#fbfbfb_0%,#f5f5f5_52%,#f2f4f3_100%)]" />
      <div className="mx-auto flex h-[100dvh] max-w-2xl flex-col px-3 py-2 lg:px-5">
        <Link
          href="/"
          className="inline-flex w-fit items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--surface-solid)] px-4 py-2 text-sm text-[var(--text-muted)]"
        >
          <ArrowLeft size={16} />
          {t.back}
        </Link>

        <section className="mt-2 flex-1 overflow-hidden rounded-[24px] border border-[var(--border-strong)] bg-[var(--surface-solid)] p-3 shadow-[var(--shadow-panel)] sm:p-4">
          <div className="mb-1 text-right text-[10px] font-semibold uppercase tracking-wide text-[var(--text-muted)]">
            {uiVersion}
          </div>
          <div className="inline-flex rounded-full border border-[var(--accent)]/20 bg-[linear-gradient(135deg,var(--accent-soft),rgba(124,77,255,0.08))] px-3 py-1.5 text-xs font-semibold text-[var(--accent-strong)]">
            {t.badge}
          </div>
          <h1 className="mt-2 text-[2rem] font-semibold leading-tight sm:text-[2.2rem]">{t.title}</h1>
          <p className="mt-1.5 text-[13px] text-[var(--text-muted)]">{t.subtitle}</p>

          {!inviteCode.trim() && (
            <div className="mt-4 flex items-start gap-2 rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-amber-700">
              <AlertCircle size={18} className="mt-0.5 shrink-0" />
              <p className="text-sm">
                {locale === "pt"
                  ? "Este link nao tem signup_code. Pede ao coach para reenviar o convite."
                  : "This link has no signup_code. Ask your coach to resend the invite."}
              </p>
            </div>
          )}

          {!!errorMessage && (
            <div className="mt-4 flex items-start gap-2 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-rose-700">
              <AlertCircle size={18} className="mt-0.5 shrink-0" />
              <p className="text-sm">{errorMessage}</p>
            </div>
          )}

          {!!successMessage && (
            <div className="mt-4 flex items-start gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-emerald-700">
              <CheckCircle2 size={18} className="mt-0.5 shrink-0" />
              <p className="text-sm">{successMessage}</p>
            </div>
          )}

          {signupCompleted ? (
            <div className="mt-3 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-emerald-800">
              <div className="flex items-center justify-between gap-2 text-sm font-semibold">
                <span>{t.successPopupTitle}</span>
                <span className="text-xs font-medium text-emerald-700">
                  {t.autoRedirectIn} {redirectCountdown}s
                </span>
              </div>
              <p className="mt-1 text-sm">{popupText || t.successPopupText}</p>
              <div className="mt-2 grid gap-2 sm:grid-cols-2">
                <a
                  href="/download/apk"
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-[var(--accent)] px-4 py-2 text-sm font-semibold text-[var(--accent-foreground)]"
                >
                  <Smartphone size={16} />
                  {t.download}
                </a>
                <button
                  type="button"
                  onClick={() => router.push("/")}
                  className="inline-flex items-center justify-center rounded-xl border border-[var(--border)] bg-[var(--surface-solid)] px-4 py-2 text-sm font-semibold"
                >
                  {t.goLandingNow}
                </button>
              </div>
            </div>
          ) : null}

          <form className="mt-3 grid gap-2 overflow-hidden" onSubmit={handleSubmit}>
            {invitePreview ? (
              <div className="rounded-xl border border-[var(--border)] bg-[var(--surface-muted)] px-3 py-2 text-sm">
                <p>
                  <strong>{t.client}:</strong> {String(invitePreview.client_name ?? "-")}
                </p>
                <p>
                  <strong>{t.coach}:</strong> {String(invitePreview.coach_name ?? "-")}
                </p>
              </div>
            ) : null}

            <div className="rounded-xl border border-[var(--border)] bg-[var(--surface-muted)] px-3 py-2 text-sm text-[var(--text-muted)]">
              <div className="flex items-center justify-between gap-2">
                <span className="truncate">{inviteCode || "-"}</span>
                {loadingPreview ? (
                  <span className="inline-flex items-center gap-2 text-xs">
                    <LoaderCircle size={14} className="animate-spin" />
                    {t.validate}
                  </span>
                ) : null}
              </div>
            </div>

            <label className="grid gap-1">
              <span className="text-sm text-[var(--text-muted)]">{t.email}</span>
              <input
                type="email"
                value={email}
                readOnly
                className="rounded-xl border border-[var(--border)] bg-[var(--surface-muted)] px-3 py-1.5 text-[var(--text)] outline-none focus:border-[var(--accent)]/40 focus:bg-white"
                required
              />
            </label>

            <div className="grid gap-3 sm:grid-cols-2">
            <label className="grid gap-1">
              <span className="text-sm text-[var(--text-muted)]">{t.password}</span>
              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="rounded-xl border border-[var(--border)] bg-[var(--surface-muted)] px-3 py-1.5 text-[var(--text)] outline-none focus:border-[var(--accent)]/40 focus:bg-white"
                minLength={8}
                required
              />
            </label>

            <label className="grid gap-1">
              <span className="text-sm text-[var(--text-muted)]">{t.confirmPassword}</span>
              <input
                type="password"
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
                className="rounded-xl border border-[var(--border)] bg-[var(--surface-muted)] px-3 py-1.5 text-[var(--text)] outline-none focus:border-[var(--accent)]/40 focus:bg-white"
                minLength={8}
                required
              />
            </label>
            </div>

            <label className="grid gap-1">
              <span className="text-sm text-[var(--text-muted)]">{t.goals}</span>
              <textarea
                value={goals}
                onChange={(event) => setGoals(event.target.value)}
                rows={1}
                className="rounded-xl border border-[var(--border)] bg-[var(--surface-muted)] px-3 py-1.5 text-[var(--text)] outline-none focus:border-[var(--accent)]/40 focus:bg-white"
              />
            </label>

            <button
              type="submit"
              disabled={submitting || !invitePreview || !inviteCode.trim()}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-[var(--accent)] px-4 py-2 text-sm font-semibold text-[var(--accent-foreground)] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting ? <LoaderCircle size={16} className="animate-spin" /> : null}
              {submitting ? t.creating : t.create}
            </button>
          </form>

          <div className="mt-2 grid gap-2 sm:grid-cols-2">
            <a
              href={appDeepLink}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--surface-solid)] px-4 py-2 text-sm font-semibold"
            >
              <Smartphone size={16} />
              {t.openApp}
            </a>
            <a
              href="/download/apk"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-[var(--accent)] px-4 py-2 text-sm font-semibold text-[var(--accent-foreground)]"
            >
              <Smartphone size={16} />
              {t.download}
            </a>
          </div>
        </section>
      </div>
      {showSuccessPopup ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 px-4">
          <div className="w-full max-w-md rounded-2xl border border-[var(--border-strong)] bg-[var(--surface-solid)] p-5 shadow-[var(--shadow-panel)]">
            <h2 className="text-xl font-semibold">{t.successPopupTitle}</h2>
            <p className="mt-2 text-sm text-[var(--text-muted)]">{popupText || t.successPopupText}</p>
            <p className="mt-2 text-xs text-[var(--text-muted)]">
              {t.autoRedirectIn} {redirectCountdown}s
            </p>
            <div className="mt-4 grid gap-2 sm:grid-cols-2">
              <a
                href="/download/apk"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-[var(--accent)] px-4 py-2.5 text-sm font-semibold text-[var(--accent-foreground)]"
              >
                <Smartphone size={16} />
                {t.download}
              </a>
              <button
                type="button"
                onClick={() => router.push("/")}
                className="inline-flex items-center justify-center rounded-xl border border-[var(--border)] bg-[var(--surface-solid)] px-4 py-2.5 text-sm font-semibold"
              >
                {t.goLandingNow}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </main>
  );
}
