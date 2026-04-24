"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AlertCircle, ArrowLeft, ArrowRight, CheckCircle2, LoaderCircle, ShieldCheck, UserPlus } from "lucide-react";

import { trackEvent } from "../../src/lib/analytics";
import { applyCoachLocale, getInitialBrowserLocale } from "../../src/lib/coach-locale";
import { getSupabaseBrowserClient, isSupabaseConfigured } from "../../src/lib/supabase-browser";

const copy = {
  en: {
    highlights: [
      "Create one identity for both app and browser",
      "Start with the premium web experience from onboarding",
      "Keep clients, agenda, and operations in the same account",
    ],
    backToLanding: "Back to landing",
    haveAccount: "I already have an account",
    badge: "Create your coach account",
    title: "Create your account for APEX COACH.",
    text: "This is the single front door for the coach: same account, same logic, mobile app in the field and premium browser on desktop.",
    eyebrow: "Coach signup",
    heading: "Create account",
    missingVars: "`NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` still need to be configured.",
    coachName: "Coach name",
    email: "Email",
    password: "Password",
    creating: "Creating account...",
    createContinue: "Create account and continue",
    identityTitle: "Single coach identity",
    identityText: "Create the account once and use the same identity for the field app and the premium browser workspace.",
  },
  pt: {
    highlights: [
      "Cria uma identidade unica para app e browser",
      "Comeca com a experiencia web premium desde o onboarding",
      "Mantem clientes, agenda e operacao na mesma conta",
    ],
    backToLanding: "Voltar a landing",
    haveAccount: "Ja tenho conta",
    badge: "Cria a tua conta coach",
    title: "Cria a tua conta para APEX COACH.",
    text: "Esta e a entrada unica do coach: mesma conta, mesma logica, app mobile no terreno e browser premium no desktop.",
    eyebrow: "Registo do coach",
    heading: "Criar conta",
    missingVars: "`NEXT_PUBLIC_SUPABASE_URL` e `NEXT_PUBLIC_SUPABASE_ANON_KEY` ainda precisam de ser configurados.",
    coachName: "Nome do coach",
    email: "Email",
    password: "Palavra-passe",
    creating: "A criar conta...",
    createContinue: "Criar conta e continuar",
    identityTitle: "Identidade unica do coach",
    identityText: "Cria a conta uma vez e usa a mesma identidade na app de terreno e no workspace browser premium.",
  },
  es: {
    highlights: [
      "Crea una identidad unica para app y browser",
      "Empieza con la experiencia web premium desde el onboarding",
      "Manten clientes, agenda y operacion en la misma cuenta",
    ],
    backToLanding: "Volver a la landing",
    haveAccount: "Ya tengo cuenta",
    badge: "Crea tu cuenta coach",
    title: "Crea tu cuenta para APEX COACH.",
    text: "Esta es la entrada unica del coach: misma cuenta, misma logica, app movil en el campo y browser premium en escritorio.",
    eyebrow: "Registro del coach",
    heading: "Crear cuenta",
    missingVars: "`NEXT_PUBLIC_SUPABASE_URL` y `NEXT_PUBLIC_SUPABASE_ANON_KEY` todavia deben configurarse.",
    coachName: "Nombre del coach",
    email: "Email",
    password: "Contrasena",
    creating: "Creando cuenta...",
    createContinue: "Crear cuenta y continuar",
    identityTitle: "Identidad unica del coach",
    identityText: "Crea la cuenta una vez y usa la misma identidad en la app de campo y en el workspace browser premium.",
  },
  fr: {
    highlights: [
      "Cree une identite unique pour l'app et le navigateur",
      "Commence avec l'experience web premium des l'onboarding",
      "Garde clients, agenda et operations dans le meme compte",
    ],
    backToLanding: "Retour a la landing",
    haveAccount: "J'ai deja un compte",
    badge: "Cree ton compte coach",
    title: "Cree ton compte pour APEX COACH.",
    text: "C'est l'entree unique du coach : meme compte, meme logique, app mobile sur le terrain et navigateur premium sur desktop.",
    eyebrow: "Inscription coach",
    heading: "Creer un compte",
    missingVars: "`NEXT_PUBLIC_SUPABASE_URL` et `NEXT_PUBLIC_SUPABASE_ANON_KEY` doivent encore etre configures.",
    coachName: "Nom du coach",
    email: "Email",
    password: "Mot de passe",
    creating: "Creation du compte...",
    createContinue: "Creer le compte et continuer",
    identityTitle: "Identite coach unique",
    identityText: "Cree le compte une seule fois et utilise la meme identite dans l'app terrain et dans le workspace navigateur premium.",
  },
};

function describeSignupError(error, locale = "en") {
  const raw = String(error?.message ?? error ?? "").trim();
  const localized =
    locale === "pt"
      ? {
          exists: "Este email ja esta registado.",
          password: "A palavra-passe tem de cumprir os requisitos minimos do Supabase.",
          fallback: "Nao foi possivel criar a conta.",
        }
      : locale === "es"
        ? {
            exists: "Este email ya esta registrado.",
            password: "La contrasena debe cumplir los requisitos minimos de Supabase.",
            fallback: "No se pudo crear la cuenta.",
          }
        : locale === "fr"
          ? {
              exists: "Cet email est deja enregistre.",
              password: "Le mot de passe doit respecter les exigences minimales de Supabase.",
              fallback: "Impossible de creer le compte.",
            }
          : {
              exists: "This email is already registered.",
              password: "The password must meet the minimum Supabase requirements.",
              fallback: "Could not create the account.",
            };

  if (raw.toLowerCase().includes("user already registered")) return localized.exists;
  if (raw.toLowerCase().includes("password")) return localized.password;
  return raw || localized.fallback;
}

export default function SignupClient() {
  const router = useRouter();
  const configured = useMemo(() => isSupabaseConfigured(), []);
  const [locale, setLocale] = useState("en");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const t = copy[locale] || copy.en;

  useEffect(() => {
    const nextLocale = getInitialBrowserLocale();
    setLocale(nextLocale);
    applyCoachLocale(nextLocale);
    trackEvent("landing_signup_opened", { locale: nextLocale });
  }, []);

  async function handleSubmit(event) {
    event.preventDefault();

    if (!configured) {
      setErrorMessage(t.missingVars);
      trackEvent("landing_signup_blocked", { reason: "missing_supabase_env", locale });
      return;
    }

    setSubmitting(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      const supabase = getSupabaseBrowserClient();
      const normalizedEmail = email.trim().toLowerCase();
      const { error } = await supabase.auth.signUp({
        email: normalizedEmail,
        password,
        options: {
          data: {
            full_name: fullName.trim(),
            role: "coach",
          },
        },
      });

      if (error) throw error;
      trackEvent("landing_signup_success", { locale });

      setSuccessMessage(
        locale === "pt"
          ? "Conta criada. Se o Supabase exigir confirmacao de email, confirma o email antes de iniciar sessao."
          : locale === "es"
            ? "Cuenta creada. Si Supabase exige confirmacion de email, confirma tu email antes de iniciar sesion."
            : locale === "fr"
              ? "Compte cree. Si Supabase exige une confirmation d'email, confirme ton email avant de te connecter."
              : "Account created. If Supabase requires email confirmation, confirm your email before signing in.",
      );

      window.setTimeout(() => {
        router.push("/login");
      }, 900);
    } catch (error) {
      const message = describeSignupError(error, locale);
      setErrorMessage(message);
      trackEvent("landing_signup_error", { locale, message });
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
            onClick={() => trackEvent("landing_signup_back_click", { locale })}
            className="inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--surface-solid)] px-4 py-2 text-sm text-[var(--text-muted)] transition hover:bg-white hover:text-[var(--text)]"
          >
            <ArrowLeft size={16} />
            {t.backToLanding}
          </Link>

          <Link
            href="/login"
            onClick={() => trackEvent("landing_signup_to_login_click", { locale })}
            className="inline-flex items-center gap-2 rounded-full bg-[var(--accent)] px-4 py-2 text-sm font-semibold text-[var(--accent-foreground)]"
          >
            {t.haveAccount}
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
                  <h2 className="mt-3 text-3xl font-semibold text-[var(--text)]">{t.heading}</h2>
                </div>
                <div className="rounded-2xl border border-[var(--accent)]/20 bg-[linear-gradient(135deg,var(--accent-soft),rgba(124,77,255,0.1))] p-3 text-[var(--electric)]">
                  <UserPlus size={22} />
                </div>
              </div>

              {!configured && (
                <div className="mb-5 flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-4 text-amber-700">
                  <AlertCircle size={18} className="mt-0.5 shrink-0" />
                  <p className="text-sm leading-7">{t.missingVars}</p>
                </div>
              )}

              {errorMessage && (
                <div className="mb-5 flex items-start gap-3 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-4 text-rose-700">
                  <AlertCircle size={18} className="mt-0.5 shrink-0" />
                  <p className="text-sm leading-7">{errorMessage}</p>
                </div>
              )}

              {successMessage && (
                <div className="mb-5 flex items-start gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-4 text-emerald-700">
                  <CheckCircle2 size={18} className="mt-0.5 shrink-0" />
                  <p className="text-sm leading-7">{successMessage}</p>
                </div>
              )}

              <form className="grid gap-4" onSubmit={handleSubmit}>
                <label className="grid gap-2">
                  <span className="text-sm text-[var(--text-muted)]">{t.coachName}</span>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(event) => setFullName(event.target.value)}
                    placeholder="Gabriel Coach"
                    className="rounded-2xl border border-[var(--border)] bg-[var(--surface-muted)] px-4 py-3.5 text-[var(--text)] outline-none transition placeholder:text-[var(--text-muted)] focus:border-[var(--accent)]/40 focus:bg-white"
                    autoComplete="name"
                    required
                  />
                </label>

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
                    placeholder="minimum 8 characters"
                    className="rounded-2xl border border-[var(--border)] bg-[var(--surface-muted)] px-4 py-3.5 text-[var(--text)] outline-none transition placeholder:text-[var(--text-muted)] focus:border-[var(--accent)]/40 focus:bg-white"
                    autoComplete="new-password"
                    required
                  />
                </label>

                <button
                  type="submit"
                  disabled={submitting || !configured}
                  className="mt-4 inline-flex items-center justify-center gap-2 rounded-2xl bg-[var(--accent)] px-5 py-4 font-semibold text-[var(--accent-foreground)] shadow-[0_18px_60px_rgba(42,208,125,0.22)] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {submitting ? (
                    <>
                      <LoaderCircle size={18} className="animate-spin" />
                      {t.creating}
                    </>
                  ) : (
                    <>
                      {t.createContinue}
                      <ArrowRight size={18} />
                    </>
                  )}
                </button>
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
