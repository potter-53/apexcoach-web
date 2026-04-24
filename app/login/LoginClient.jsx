"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  LoaderCircle,
  LockKeyhole,
  ShieldCheck,
} from "lucide-react";

import { trackEvent } from "../../src/lib/analytics";
import { applyCoachLocale, getCoachLocaleFromUser, getInitialBrowserLocale } from "../../src/lib/coach-locale";
import { getSupabaseBrowserClient, isSupabaseConfigured } from "../../src/lib/supabase-browser";

const copy = {
  en: {
    highlights: [
      "Direct continuity with the mobile app logic",
      "More context for managing clients, agenda, and reports",
      "Premium desktop experience built for the coach",
    ],
    backToLanding: "Back to landing",
    viewDemo: "View browser demo",
    badge: "Browser access for coaches",
    title: "Enter the APEX COACH browser workspace.",
    text: "The web is the premium companion to the app: more space to think, more visible information, and a stronger workflow for the coach day to day.",
    eyebrow: "Coach login",
    welcome: "Welcome back",
    missingVars: "`NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` still need to be configured in the project and on Vercel.",
    email: "Email",
    password: "Password",
    keepSignedIn: "Keep me signed in",
    recoverAccess: "Recover access",
    signingIn: "Signing in...",
    enterWorkspace: "Enter browser workspace",
    createAccount: "Create coach account",
    identityTitle: "Single coach identity",
    identityText: "The same identity works for the field app and the premium browser workspace.",
  },
  pt: {
    highlights: [
      "Continuidade direta com a logica da app mobile",
      "Mais contexto para gerir clientes, agenda e reports",
      "Experiencia desktop premium pensada para o coach",
    ],
    backToLanding: "Voltar a landing",
    viewDemo: "Ver demo web",
    badge: "Acesso browser para coaches",
    title: "Entrar no workspace browser da APEX COACH.",
    text: "O web e o complemento premium da app: mais espaco para pensar, mais informacao visivel e um workflow mais forte para o dia a dia do coach.",
    eyebrow: "Login do coach",
    welcome: "Bem-vindo de volta",
    missingVars: "`NEXT_PUBLIC_SUPABASE_URL` e `NEXT_PUBLIC_SUPABASE_ANON_KEY` ainda precisam de ser configurados no projeto e na Vercel.",
    email: "Email",
    password: "Palavra-passe",
    keepSignedIn: "Manter sessao iniciada",
    recoverAccess: "Recuperar acesso",
    signingIn: "A entrar...",
    enterWorkspace: "Entrar no workspace browser",
    createAccount: "Criar conta coach",
    identityTitle: "Identidade unica do coach",
    identityText: "A mesma identidade funciona na app de terreno e no workspace browser premium.",
  },
  es: {
    highlights: [
      "Continuidad directa con la logica de la app movil",
      "Mas contexto para gestionar clientes, agenda e informes",
      "Experiencia desktop premium pensada para el coach",
    ],
    backToLanding: "Volver a la landing",
    viewDemo: "Ver demo web",
    badge: "Acceso browser para coaches",
    title: "Entrar en el workspace browser de APEX COACH.",
    text: "La web es el complemento premium de la app: mas espacio para pensar, mas informacion visible y un flujo de trabajo mas fuerte para el coach.",
    eyebrow: "Login del coach",
    welcome: "Bienvenido de nuevo",
    missingVars: "`NEXT_PUBLIC_SUPABASE_URL` y `NEXT_PUBLIC_SUPABASE_ANON_KEY` todavia deben configurarse en el proyecto y en Vercel.",
    email: "Email",
    password: "Contrasena",
    keepSignedIn: "Mantener sesion iniciada",
    recoverAccess: "Recuperar acceso",
    signingIn: "Entrando...",
    enterWorkspace: "Entrar en el workspace browser",
    createAccount: "Crear cuenta coach",
    identityTitle: "Identidad unica del coach",
    identityText: "La misma identidad funciona en la app de campo y en el workspace browser premium.",
  },
  fr: {
    highlights: [
      "Continute directe avec la logique de l'app mobile",
      "Plus de contexte pour gerer clients, agenda et rapports",
      "Experience desktop premium pensee pour le coach",
    ],
    backToLanding: "Retour a la landing",
    viewDemo: "Voir la demo web",
    badge: "Acces navigateur pour les coachs",
    title: "Entrer dans le workspace navigateur APEX COACH.",
    text: "Le web est le complement premium de l'app : plus d'espace pour reflechir, plus d'informations visibles et un workflow plus solide pour le coach.",
    eyebrow: "Connexion coach",
    welcome: "Bon retour",
    missingVars: "`NEXT_PUBLIC_SUPABASE_URL` et `NEXT_PUBLIC_SUPABASE_ANON_KEY` doivent encore etre configures dans le projet et sur Vercel.",
    email: "Email",
    password: "Mot de passe",
    keepSignedIn: "Rester connecte",
    recoverAccess: "Recuperer l'acces",
    signingIn: "Connexion...",
    enterWorkspace: "Entrer dans le workspace navigateur",
    createAccount: "Creer un compte coach",
    identityTitle: "Identite coach unique",
    identityText: "La meme identite fonctionne pour l'app terrain et le workspace navigateur premium.",
  },
};

function describeAuthError(error, locale = "en") {
  const raw = String(error?.message ?? error ?? "").trim();
  const localized =
    locale === "pt"
      ? {
          invalid: "Email ou palavra-passe incorretos.",
          confirm: "Confirma o teu email antes de entrar no workspace browser.",
          env: "As variaveis de ambiente do Supabase estao em falta no projeto web.",
          fallback: "Nao foi possivel entrar no workspace browser. Tenta novamente.",
        }
      : locale === "es"
        ? {
            invalid: "Email o contrasena incorrectos.",
            confirm: "Confirma tu email antes de entrar en el workspace browser.",
            env: "Faltan variables de entorno de Supabase en el proyecto web.",
            fallback: "No se pudo entrar en el workspace browser. Intentalo de nuevo.",
          }
        : locale === "fr"
          ? {
              invalid: "Email ou mot de passe incorrect.",
              confirm: "Confirme ton email avant d'entrer dans le workspace navigateur.",
              env: "Les variables d'environnement Supabase manquent dans le projet web.",
              fallback: "Impossible d'entrer dans le workspace navigateur. Reessaie.",
            }
          : {
              invalid: "Incorrect email or password.",
              confirm: "Confirm your email before entering the browser workspace.",
              env: "Supabase environment variables are missing in the web project.",
              fallback: "Could not sign into the browser workspace. Try again.",
            };

  if (raw.toLowerCase().includes("invalid login credentials")) {
    return localized.invalid;
  }

  if (raw.toLowerCase().includes("email not confirmed")) {
    return localized.confirm;
  }

  if (raw.toLowerCase().includes("supabase env vars are missing")) {
    return localized.env;
  }

  return raw || localized.fallback;
}

export default function LoginClient() {
  const router = useRouter();
  const configured = useMemo(() => isSupabaseConfigured(), []);
  const [locale, setLocale] = useState("en");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const t = copy[locale] || copy.en;

  useEffect(() => {
    const nextLocale = getInitialBrowserLocale();
    setLocale(nextLocale);
    applyCoachLocale(nextLocale);
    trackEvent("landing_login_opened", { locale: nextLocale });
  }, []);

  async function handleSubmit(event) {
    event.preventDefault();

    if (!configured) {
      setErrorMessage(t.missingVars);
      trackEvent("landing_login_blocked", { reason: "missing_supabase_env", locale });
      return;
    }

    setSubmitting(true);
    setErrorMessage("");

    try {
      const supabase = getSupabaseBrowserClient();
      const normalizedEmail = email.trim().toLowerCase();

      const { data, error } = await supabase.auth.signInWithPassword({
        email: normalizedEmail,
        password,
      });

      if (error) throw error;
      applyCoachLocale(getCoachLocaleFromUser(data?.user));

      try {
        if (!rememberMe) {
          window.sessionStorage.setItem("apexcoach-session-mode", "session");
        } else {
          window.localStorage.setItem("apexcoach-session-mode", "remember");
        }
      } catch {}

      trackEvent("landing_login_success", { locale, rememberMe });
      router.push("/app");
      router.refresh();
    } catch (error) {
      const message = describeAuthError(error, locale);
      setErrorMessage(message);
      trackEvent("landing_login_error", { locale, message });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="min-h-screen bg-[var(--bg)] text-[var(--text)]">
      <div className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,rgba(42,208,125,0.16),transparent_28%),radial-gradient(circle_at_bottom_right,rgba(124,77,255,0.08),transparent_22%),linear-gradient(180deg,#fbfbfb_0%,#f5f5f5_52%,#f2f4f3_100%)]" />

      <div className="mx-auto flex min-h-screen max-w-7xl flex-col px-5 py-8 lg:px-8">
        <div className="flex items-center justify-between">
          <Link
            href="/"
            onClick={() => trackEvent("landing_login_back_click", { locale })}
            className="inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--surface-solid)] px-4 py-2 text-sm text-[var(--text-muted)] transition hover:bg-white hover:text-[var(--text)]"
          >
            <ArrowLeft size={16} />
            {t.backToLanding}
          </Link>

          <Link
            href="/app"
            onClick={() => trackEvent("landing_login_demo_click", { locale })}
            className="inline-flex items-center gap-2 rounded-full bg-[var(--accent)] px-4 py-2 text-sm font-semibold text-[var(--accent-foreground)]"
          >
            {t.viewDemo}
            <ArrowRight size={16} />
          </Link>
        </div>

        <div className="grid flex-1 items-center gap-10 py-10 lg:grid-cols-[0.95fr_1.05fr]">
          <section className="max-w-xl">
            <div className="inline-flex rounded-full border border-[var(--accent)]/20 bg-[linear-gradient(135deg,var(--accent-soft),rgba(124,77,255,0.08))] px-4 py-2 text-sm font-medium text-[var(--accent-strong)]">
              {t.badge}
            </div>

            <h1 className="mt-8 text-5xl font-semibold leading-[1.02] text-[var(--text)] sm:text-6xl">
              {t.title}
            </h1>

            <p className="mt-6 text-lg leading-8 text-[var(--text-muted)]">
              {t.text}
            </p>

            <div className="mt-10 grid gap-4">
              {t.highlights.map((item) => (
                <div
                  key={item}
                  className="flex items-start gap-3 rounded-2xl border border-[var(--border)] bg-[var(--surface-solid)] px-4 py-4 shadow-[var(--shadow-soft)]"
                >
                  <CheckCircle2 size={18} className="mt-0.5 text-[var(--accent-strong)]" />
                  <p className="text-[var(--text-muted)]">{item}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-[36px] border border-[var(--border-strong)] bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(245,245,245,0.95))] p-6 shadow-[var(--shadow-panel)] sm:p-8">
            <div className="rounded-[28px] border border-[var(--border)] bg-[var(--surface-solid)] p-6 sm:p-8">
              <div className="mb-8 flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm uppercase tracking-[0.22em] text-[var(--text-muted)]">{t.eyebrow}</p>
                  <h2 className="mt-3 text-3xl font-semibold text-[var(--text)]">{t.welcome}</h2>
                </div>
                <div className="rounded-2xl border border-[var(--accent)]/20 bg-[linear-gradient(135deg,var(--accent-soft),rgba(124,77,255,0.1))] p-3 text-[var(--electric)]">
                  <LockKeyhole size={22} />
                </div>
              </div>

              {!configured && (
                <div className="mb-5 flex items-start gap-3 rounded-2xl border border-amber-400/20 bg-amber-400/10 px-4 py-4 text-amber-100">
                  <AlertCircle size={18} className="mt-0.5 shrink-0" />
                  <p className="text-sm leading-7">
                    {t.missingVars}
                  </p>
                </div>
              )}

              {errorMessage && (
                <div className="mb-5 flex items-start gap-3 rounded-2xl border border-rose-400/20 bg-rose-400/10 px-4 py-4 text-rose-100">
                  <AlertCircle size={18} className="mt-0.5 shrink-0" />
                  <p className="text-sm leading-7">{errorMessage}</p>
                </div>
              )}

              <form className="grid gap-4" onSubmit={handleSubmit}>
                <label className="grid gap-2">
                  <span className="text-sm text-[var(--text-muted)]">{t.email}</span>
                  <input
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder="coach@apexcoach.pt"
                    className="rounded-2xl border border-[var(--border)] bg-[var(--surface-muted)] px-4 py-3.5 text-[var(--text)] outline-none transition placeholder:text-[var(--text-muted)] focus:border-[var(--accent)]/40 focus:bg-white"
                    autoComplete="email"
                    required
                  />
                </label>

                <label className="grid gap-2">
                  <span className="text-sm text-[var(--text-muted)]">{t.password}</span>
                  <input
                    type="password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    placeholder="**********"
                    className="rounded-2xl border border-[var(--border)] bg-[var(--surface-muted)] px-4 py-3.5 text-[var(--text)] outline-none transition placeholder:text-[var(--text-muted)] focus:border-[var(--accent)]/40 focus:bg-white"
                    autoComplete="current-password"
                    required
                  />
                </label>

                <div className="mt-2 flex items-center justify-between gap-4 text-sm text-[var(--text-muted)]">
                  <label className="inline-flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(event) => setRememberMe(event.target.checked)}
                      className="h-4 w-4 rounded border-white/20 bg-transparent"
                    />
                    {t.keepSignedIn}
                  </label>
                  <button type="button" className="text-[var(--accent-strong)]">
                    {t.recoverAccess}
                  </button>
                </div>

                <button
                  type="submit"
                  disabled={submitting || !configured}
                  className="mt-4 inline-flex items-center justify-center gap-2 rounded-2xl bg-[var(--accent)] px-5 py-4 font-semibold text-[var(--accent-foreground)] shadow-[0_18px_60px_rgba(42,208,125,0.22)] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {submitting ? (
                    <>
                      <LoaderCircle size={18} className="animate-spin" />
                      {t.signingIn}
                    </>
                  ) : (
                    <>
                      {t.enterWorkspace}
                      <ArrowRight size={18} />
                    </>
                  )}
                </button>

                <Link
                  href="/signup"
                  onClick={() => trackEvent("landing_login_to_signup_click", { locale })}
                  className="rounded-2xl border border-[var(--border)] bg-[var(--surface-muted)] px-5 py-4 text-center font-semibold text-[var(--text)]"
                >
                  {t.createAccount}
                </Link>
              </form>

              <div className="mt-8 grid gap-3 rounded-[24px] border border-[var(--border)] bg-[var(--surface-muted)] p-4">
                <div className="flex items-center gap-3">
                  <ShieldCheck size={18} className="text-[var(--accent-strong)]" />
                  <p className="font-medium text-[var(--text)]">{t.identityTitle}</p>
                </div>
                <p className="text-sm leading-7 text-[var(--text-muted)]">
                  {t.identityText}
                </p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
