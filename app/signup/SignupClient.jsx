"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AlertCircle, ArrowLeft, ArrowRight, CheckCircle2, LoaderCircle, ShieldCheck, Smartphone, UserPlus, X } from "lucide-react";

import { trackEvent } from "../../src/lib/analytics";
import { applyCoachLocale, getInitialBrowserLocale } from "../../src/lib/coach-locale";
import { getSupabaseBrowserClient, isSupabaseConfigured } from "../../src/lib/supabase-browser";

const APK_DOWNLOAD_URL = "/download/apk";

const copy = {
  en: {
    highlights: [
      "Create one identity for both app and browser",
      "Start with a 14-day free trial from onboarding",
      "Keep clients, agenda, and operations in the same account",
    ],
    backToLanding: "Back to landing",
    haveAccount: "I already have an account",
    downloadNow: "Download APK",
    badge: "Create your coach account",
    title: "Create your account for APEX COACH.",
    text: "This is the single front door for the coach: same account, same logic, mobile app in the field and premium browser on desktop.",
    eyebrow: "Coach signup",
    heading: "Create account",
    missingVars: "`NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` still need to be configured.",
    coachName: "Coach name",
    email: "Email",
    password: "Password",
    passwordPlaceholder: "minimum 8 characters",
    acceptLegalPrefix: "I have read and accept the",
    acceptTerms: "Terms and Conditions",
    acceptLegalMiddle: "and the",
    acceptPrivacy: "Privacy Policy",
    acceptLegalSuffix: ".",
    acceptRequired: "You need to accept the Terms and Privacy Policy to create an account.",
    foundingProfileConsent: "I agree that my public Founding Coach profile (photo, name, location, testimonial and selected professional information) may be displayed by APEX Coach.",
    foundingProfileConsentHelp: "Optional. This preference can be edited later in your coach settings.",
    creating: "Creating account...",
    createContinue: "Create account and continue",
    identityTitle: "Single coach identity",
    identityText: "Create the account once and use the same identity for the field app and the premium browser workspace.",
    downloadHint: "Prefer to install the app first? Download the current Android APK and create your coach account afterwards.",
    alreadyHaveAccount: "Already have an account? Login",
    modalTitle: "Account created successfully.",
    modalText: "Start downloading the APK, confirm the email you just received, and then sign in with this account.",
    directDownload: "Direct download (.apk)",
    continueLogin: "Continue to login",
  },
  pt: {
    highlights: [
      "Cria uma identidade única para app e browser",
      "Começa com trial grátis de 14 dias desde o onboarding",
      "Mantém clientes, agenda e operação na mesma conta",
    ],
    backToLanding: "Voltar à landing",
    haveAccount: "Já tenho conta",
    downloadNow: "Download APK",
    badge: "Cria a tua conta coach",
    title: "Cria a tua conta para APEX COACH.",
    text: "Esta é a entrada única do coach: mesma conta, mesma lógica, app mobile no terreno e browser premium no desktop.",
    eyebrow: "Registo do coach",
    heading: "Criar conta",
    missingVars: "`NEXT_PUBLIC_SUPABASE_URL` e `NEXT_PUBLIC_SUPABASE_ANON_KEY` ainda precisam de ser configurados.",
    coachName: "Nome do coach",
    email: "Email",
    password: "Palavra-passe",
    passwordPlaceholder: "mínimo 8 caracteres",
    acceptLegalPrefix: "Li e aceito os",
    acceptTerms: "Termos e Condições",
    acceptLegalMiddle: "e a",
    acceptPrivacy: "Política de Privacidade",
    acceptLegalSuffix: ".",
    acceptRequired: "Tens de aceitar os Termos e a Política de Privacidade para criar conta.",
    foundingProfileConsent: "Aceito que o meu perfil público de Coach Fundador (foto, nome, localização, testemunho e informação profissional selecionada) possa ser apresentado pela APEX COACH.",
    foundingProfileConsentHelp: "Opcional. Esta preferência poderá ser editada mais tarde nas definições da tua conta coach.",
    creating: "A criar conta...",
    createContinue: "Criar conta e continuar",
    identityTitle: "Identidade única do coach",
    identityText: "Cria a conta uma vez e usa a mesma identidade na app de terreno e no workspace browser premium.",
    downloadHint: "Preferes instalar primeiro a app? Faz download da APK Android atual e cria a tua conta coach depois.",
    alreadyHaveAccount: "Já tens conta? Faz login",
    modalTitle: "Conta criada com sucesso.",
    modalText: "Inicia o download da APK, confirma o email que acabaste de receber e depois faz login com esta conta.",
    directDownload: "Download direto (.apk)",
    continueLogin: "Continuar para login",
  },
  es: {
    highlights: [
      "Crea una identidad única para app y navegador",
      "Empieza con la experiencia web premium desde el onboarding",
      "Mantén clientes, agenda y operación en la misma cuenta",
    ],
    backToLanding: "Volver a la landing",
    haveAccount: "Ya tengo cuenta",
    downloadNow: "Download APK",
    badge: "Crea tu cuenta coach",
    title: "Crea tu cuenta para APEX COACH.",
    text: "Esta es la entrada única del coach: misma cuenta, misma lógica, app móvil en el campo y navegador premium en escritorio.",
    eyebrow: "Registro del coach",
    heading: "Crear cuenta",
    missingVars: "`NEXT_PUBLIC_SUPABASE_URL` y `NEXT_PUBLIC_SUPABASE_ANON_KEY` todavía deben configurarse.",
    coachName: "Nombre del coach",
    email: "Email",
    password: "Contraseña",
    passwordPlaceholder: "mínimo 8 caracteres",
    acceptLegalPrefix: "He leído y acepto los",
    acceptTerms: "Términos y Condiciones",
    acceptLegalMiddle: "y la",
    acceptPrivacy: "Política de Privacidad",
    acceptLegalSuffix: ".",
    acceptRequired: "Debes aceptar los Términos y la Política de Privacidad para crear la cuenta.",
    foundingProfileConsent: "Acepto que mi perfil público de Founder Coach (foto, nombre, ubicación, testimonio e información profesional seleccionada) pueda ser mostrado por APEX COACH.",
    foundingProfileConsentHelp: "Opcional. Esta preferencia podrá editarse más tarde en la configuración de tu cuenta coach.",
    creating: "Creando cuenta...",
    createContinue: "Crear cuenta y continuar",
    identityTitle: "Identidad única del coach",
    identityText: "Crea la cuenta una vez y usa la misma identidad en la app de campo y en el workspace premium del navegador.",
    downloadHint: "¿Prefieres instalar primero la app? Descarga el APK Android actual y crea tu cuenta coach después.",
    alreadyHaveAccount: "¿Ya tienes cuenta? Login",
    modalTitle: "Cuenta creada con éxito.",
    modalText: "Inicia la descarga del APK, confirma el email que acabas de recibir y luego inicia sesión con esta cuenta.",
    directDownload: "Descarga directa (.apk)",
    continueLogin: "Continuar al login",
  },
  fr: {
    highlights: [
      "Crée une identité unique pour l'app et le navigateur",
      "Commence avec l'expérience web premium dès l'onboarding",
      "Garde clients, agenda et opérations dans le même compte",
    ],
    backToLanding: "Retour à la landing",
    haveAccount: "J'ai déjà un compte",
    downloadNow: "Download APK",
    badge: "Crée ton compte coach",
    title: "Crée ton compte pour APEX COACH.",
    text: "C'est l'entrée unique du coach : même compte, même logique, app mobile sur le terrain et navigateur premium sur desktop.",
    eyebrow: "Inscription coach",
    heading: "Créer un compte",
    missingVars: "`NEXT_PUBLIC_SUPABASE_URL` et `NEXT_PUBLIC_SUPABASE_ANON_KEY` doivent encore être configurés.",
    coachName: "Nom du coach",
    email: "Email",
    password: "Mot de passe",
    passwordPlaceholder: "minimum 8 caractères",
    acceptLegalPrefix: "J'ai lu et j'accepte les",
    acceptTerms: "Conditions Générales",
    acceptLegalMiddle: "et la",
    acceptPrivacy: "Politique de Confidentialité",
    acceptLegalSuffix: ".",
    acceptRequired: "Tu dois accepter les conditions et la politique de confidentialité pour créer le compte.",
    foundingProfileConsent: "J'accepte que mon profil public de Founder Coach (photo, nom, localisation, témoignage et informations professionnelles sélectionnées) puisse être affiché par APEX COACH.",
    foundingProfileConsentHelp: "Optionnel. Cette préférence pourra être modifiée plus tard dans les paramètres de ton compte coach.",
    creating: "Création du compte...",
    createContinue: "Créer le compte et continuer",
    identityTitle: "Identité coach unique",
    identityText: "Crée le compte une seule fois et utilise la même identité dans l'app terrain et dans le workspace navigateur premium.",
    downloadHint: "Tu préfères installer l'app d'abord ? Télécharge l'APK Android actuel puis crée ton compte coach.",
    alreadyHaveAccount: "Tu as déjà un compte ? Login",
    modalTitle: "Compte créé avec succès.",
    modalText: "Lance le téléchargement de l'APK, confirme l'email que tu viens de recevoir, puis connecte-toi avec ce compte.",
    directDownload: "Téléchargement direct (.apk)",
    continueLogin: "Continuer vers le login",
  },
};

function describeSignupError(error, locale = "en") {
  const raw = String(error?.message ?? error ?? "").trim();
  const localized =
    locale === "pt"
      ? {
          exists: "Este email já está registado.",
          password: "A palavra-passe tem de cumprir os requisitos mínimos do Supabase.",
          fallback: "Não foi possível criar a conta.",
        }
      : locale === "es"
        ? {
            exists: "Este email ya está registrado.",
            password: "La contraseña debe cumplir los requisitos mínimos de Supabase.",
            fallback: "No se pudo crear la cuenta.",
          }
        : locale === "fr"
          ? {
              exists: "Cet email est déjà enregistré.",
              password: "Le mot de passe doit respecter les exigences minimales de Supabase.",
              fallback: "Impossible de créer le compte.",
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
  const [acceptedLegal, setAcceptedLegal] = useState(false);
  const [foundingProfileConsent, setFoundingProfileConsent] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [downloadModalOpen, setDownloadModalOpen] = useState(false);
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

    if (!acceptedLegal) {
      setErrorMessage(t.acceptRequired);
      trackEvent("landing_signup_blocked", { reason: "legal_not_accepted", locale });
      return;
    }

    setSubmitting(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      const supabase = getSupabaseBrowserClient();
      const normalizedEmail = email.trim().toLowerCase();
      const submittedAt = new Date().toISOString();
      const { data, error } = await supabase.auth.signUp({
        email: normalizedEmail,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/login?verified=1`,
          data: {
            full_name: fullName.trim(),
            role: "coach",
            beta_access_requested: true,
            beta_requested_at: submittedAt,
            founder_access_requested: true,
            access_tier: "founder",
            subscription_category: "apex_coach_founder",
            billing_campaign_key: "apex_coach_founder",
            accepted_terms_at: submittedAt,
            accepted_privacy_at: submittedAt,
            accepted_legal_version: "2026-04",
            founding_public_profile_consent: foundingProfileConsent,
            founding_public_profile_consent_at: foundingProfileConsent ? submittedAt : null,
          },
        },
      });

      if (error) throw error;

      try {
        await fetch("/api/coach-applications", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            fullName: fullName.trim(),
            email: normalizedEmail,
            focus: "",
            locale,
            source: "apexcoach-signup-page",
            accessTier: "founder",
            subscriptionCategory: "apex_coach_founder",
            foundingPublicProfileConsent: foundingProfileConsent,
            foundingPublicProfileConsentAt: foundingProfileConsent ? submittedAt : null,
            userId: data?.user?.id || "",
          }),
        });
      } catch {}

      trackEvent("landing_signup_success", { locale });

      setSuccessMessage(
        locale === "pt"
          ? "Conta criada. Enviámos um email de validação APEX COACH. Podes iniciar o download da APK e confirmar o email antes de iniciar sessão."
          : locale === "es"
            ? "Cuenta creada. Enviamos un email de validación APEX COACH. Confirma tu email antes de iniciar sesión."
            : locale === "fr"
              ? "Compte créé. Nous avons envoyé un email de validation APEX COACH. Confirme ton email avant de te connecter."
              : "Account created. We sent an APEX COACH verification email. You can start downloading the APK and confirm your email before signing in.",
      );
      setDownloadModalOpen(true);
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
      {downloadModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/45 px-4 py-6 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-[28px] border border-[var(--border-strong)] bg-white p-6 shadow-[var(--shadow-panel)]">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.18em] text-[var(--accent)]">APEX COACH</p>
                <h3 className="mt-2 text-2xl font-semibold text-[var(--text)]">
                  {t.modalTitle}
                </h3>
                <p className="mt-3 text-sm leading-7 text-[var(--text-muted)]">
                  {t.modalText}
                </p>
              </div>
              <button
                onClick={() => setDownloadModalOpen(false)}
                className="rounded-full border border-[var(--border)] p-2 text-[var(--text-muted)] hover:bg-[var(--surface-muted)]"
                aria-label="Close"
              >
                <X size={16} />
              </button>
            </div>

            <div className="mt-5 grid gap-3">
              <a
                href={APK_DOWNLOAD_URL}
                target="_blank"
                rel="noreferrer"
                onClick={() => {
                  trackEvent("landing_signup_download_apk_click", { locale });
                }}
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[var(--accent)] px-4 py-3 text-sm font-semibold text-[var(--accent-foreground)]"
              >
                <Smartphone size={16} />
                {t.directDownload}
              </a>
              <button
                type="button"
                onClick={() => trackEvent("landing_signup_play_store_coming_soon_click", { locale })}
                className="inline-flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-100 px-4 py-3 text-sm font-semibold text-slate-500"
              >
                <span className="inline-flex items-center gap-2">
                  <Smartphone size={16} />
                  Google Play
                </span>
                <span className="text-xs uppercase tracking-[0.12em]">Coming soon</span>
              </button>
              <button
                type="button"
                onClick={() => trackEvent("landing_signup_app_store_coming_soon_click", { locale })}
                className="inline-flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-100 px-4 py-3 text-sm font-semibold text-slate-500"
              >
                <span className="inline-flex items-center gap-2">
                  <Smartphone size={16} />
                  App Store
                </span>
                <span className="text-xs uppercase tracking-[0.12em]">Coming soon</span>
              </button>
            </div>

            <div className="mt-4 flex justify-end">
              <button
                onClick={() => {
                  trackEvent("landing_signup_continue_to_login_click", { locale });
                  router.push("/login");
                }}
                className="rounded-2xl border border-[var(--border)] bg-[var(--surface-solid)] px-4 py-2 text-sm font-semibold text-[var(--text)]"
              >
                {t.continueLogin}
              </button>
            </div>
          </div>
        </div>
      )}
      <div className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,rgba(42,208,125,0.16),transparent_28%),radial-gradient(circle_at_bottom_right,rgba(124,77,255,0.08),transparent_22%),linear-gradient(180deg,#fbfbfb_0%,#f5f5f5_52%,#f2f4f3_100%)]" />

      <div className="mx-auto flex min-h-screen max-w-7xl flex-col px-5 py-8 lg:px-8">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <Link
            href="/"
            onClick={() => trackEvent("landing_signup_back_click", { locale })}
            className="inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--surface-solid)] px-4 py-2 text-sm text-[var(--text-muted)] transition hover:bg-white hover:text-[var(--text)]"
          >
            <ArrowLeft size={16} />
            {t.backToLanding}
          </Link>

          <div className="flex flex-wrap items-center gap-3">
            <a
              href={APK_DOWNLOAD_URL}
              target="_blank"
              rel="noreferrer"
              onClick={() => trackEvent("landing_signup_top_download_click", { locale })}
              className="inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-white px-4 py-2 text-sm font-semibold text-[var(--text)] transition hover:border-[var(--border-strong)] hover:bg-[var(--surface-solid)]"
            >
              <Smartphone size={16} />
              {t.downloadNow}
            </a>
            <Link
              href="/login"
              onClick={() => trackEvent("landing_signup_to_login_click", { locale })}
              className="inline-flex items-center gap-2 rounded-full bg-[var(--accent)] px-4 py-2 text-sm font-semibold text-[var(--accent-foreground)]"
            >
              {t.haveAccount}
              <ArrowRight size={16} />
            </Link>
          </div>
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

            <div className="mt-8 rounded-[24px] border border-[var(--border)] bg-white p-5 shadow-[var(--shadow-soft)]">
              <div className="flex items-start gap-3">
                <div className="rounded-2xl border border-[var(--accent)]/20 bg-[linear-gradient(135deg,var(--accent-soft),rgba(124,77,255,0.08))] p-3 text-[var(--accent-strong)]">
                  <Smartphone size={18} />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-[var(--text)]">{t.downloadNow}</h3>
                  <p className="mt-2 text-sm leading-7 text-[var(--text-muted)]">{t.downloadHint}</p>
                  <div className="mt-4 flex flex-wrap items-center gap-3">
                    <a
                      href={APK_DOWNLOAD_URL}
                      target="_blank"
                      rel="noreferrer"
                      onClick={() => trackEvent("landing_signup_side_download_click", { locale })}
                      className="inline-flex items-center gap-2 rounded-2xl border border-[var(--border)] bg-[var(--surface-solid)] px-4 py-3 text-sm font-semibold text-[var(--text)] transition hover:border-[var(--border-strong)] hover:bg-white"
                    >
                      <Smartphone size={16} />
                      {t.downloadNow}
                    </a>
                    <Link
                      href="/login"
                      onClick={() => trackEvent("landing_signup_side_login_click", { locale })}
                      className="text-sm font-semibold text-[var(--text-muted)] transition hover:text-[var(--text)]"
                    >
                      {t.alreadyHaveAccount}
                    </Link>
                  </div>
                </div>
              </div>
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
                    placeholder={locale === "pt" ? "Nome" : locale === "es" ? "Nombre" : locale === "fr" ? "Nom" : "Name"}
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
                    placeholder={t.passwordPlaceholder}
                    className="rounded-2xl border border-[var(--border)] bg-[var(--surface-muted)] px-4 py-3.5 text-[var(--text)] outline-none transition placeholder:text-[var(--text-muted)] focus:border-[var(--accent)]/40 focus:bg-white"
                    autoComplete="new-password"
                    required
                  />
                </label>

                <label className="rounded-[20px] border border-[var(--border)] bg-[var(--surface-muted)] p-4">
                  <div className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      checked={acceptedLegal}
                      onChange={(event) => {
                        setAcceptedLegal(event.target.checked);
                        if (event.target.checked) setErrorMessage("");
                      }}
                      className="mt-1 h-4 w-4 shrink-0 accent-[var(--accent)]"
                      required
                    />
                    <p className="text-sm leading-6 text-[var(--text-muted)]">
                      {t.acceptLegalPrefix}{" "}
                      <Link href="/legal/terms" target="_blank" className="font-medium text-[var(--accent-strong)] underline underline-offset-4">
                        {t.acceptTerms}
                      </Link>{" "}
                      {t.acceptLegalMiddle}{" "}
                      <Link href="/legal/privacy" target="_blank" className="font-medium text-[var(--accent-strong)] underline underline-offset-4">
                        {t.acceptPrivacy}
                      </Link>
                      {t.acceptLegalSuffix}
                    </p>
                  </div>
                </label>

                <label className="rounded-[20px] border border-[var(--border)] bg-white p-4">
                  <div className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      checked={foundingProfileConsent}
                      onChange={(event) => setFoundingProfileConsent(event.target.checked)}
                      className="mt-1 h-4 w-4 shrink-0 accent-[var(--accent)]"
                    />
                    <div>
                      <p className="text-sm leading-6 text-[var(--text-muted)]">{t.foundingProfileConsent}</p>
                      <p className="mt-1 text-xs leading-5 text-[var(--text-muted)]">{t.foundingProfileConsentHelp}</p>
                    </div>
                  </div>
                </label>

                <button
                  type="submit"
                  disabled={submitting || !configured || !acceptedLegal}
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
