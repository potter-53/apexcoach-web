"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AlertCircle, ArrowLeft, ArrowRight, CheckCircle2, CreditCard, LoaderCircle, MapPinned, ShieldCheck, Smartphone, UserPlus, X } from "lucide-react";

import { trackEvent } from "../../src/lib/analytics";
import { applyCoachLocale, getInitialBrowserLocale } from "../../src/lib/coach-locale";
import { getSupabaseBrowserClient, isSupabaseConfigured } from "../../src/lib/supabase-browser";
import ThemeToggle from "../../src/components/ThemeToggle";

const APK_DOWNLOAD_URL = "/download/apk";

const copy = {
  en: {
    highlights: [
      "Create one identity for both app and browser",
      "Start with a 30-day free trial from onboarding",
      "Keep clients, agenda, and operations in the same account",
    ],
    backToLanding: "Back to landing",
    haveAccount: "I already have an account",
    downloadNow: "Download APK",
    badge: "Create your coach account",
    title: "Create your NLOCK coach account.",
    text: "This is the single front door for the coach: same account, same logic, mobile app in the field and premium browser on desktop.",
    eyebrow: "Coach signup",
    heading: "Create account",
    missingVars: "`NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` still need to be configured.",
    coachName: "Coach name",
    workplace: "Where do you coach?",
    workplacePlaceholder: "Gym, studio, club or online",
    city: "City",
    country: "Country",
    specialty: "Main specialty",
    professionalLink: "Professional link (optional)",
    email: "Email",
    password: "Password",
    passwordPlaceholder: "minimum 8 characters",
    acceptLegalPrefix: "I have read and accept the",
    acceptTerms: "Terms and Conditions",
    acceptLegalMiddle: "and the",
    acceptPrivacy: "Privacy Policy",
    acceptLegalSuffix: ".",
    acceptRequired: "You need to accept the Terms and Privacy Policy to create an account.",
    foundingProfileConsent: "I agree that my public Founding Coach profile (photo, name, location, bio and selected professional information) may be displayed by NLOCK.",
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
      "Começa com trial grátis de 30 dias desde o onboarding",
      "Mantém clientes, agenda e operação na mesma conta",
    ],
    backToLanding: "Voltar à landing",
    haveAccount: "Já tenho conta",
    downloadNow: "Download APK",
    badge: "Cria a tua conta coach",
    title: "Cria a tua conta de coach NLOCK.",
    text: "Esta é a entrada única do coach: mesma conta, mesma lógica, app mobile no terreno e browser premium no desktop.",
    eyebrow: "Registo do coach",
    heading: "Criar conta",
    missingVars: "`NEXT_PUBLIC_SUPABASE_URL` e `NEXT_PUBLIC_SUPABASE_ANON_KEY` ainda precisam de ser configurados.",
    coachName: "Nome do coach",
    workplace: "Onde trabalhas?",
    workplacePlaceholder: "Ginásio, estúdio, clube ou online",
    city: "Cidade",
    country: "País",
    specialty: "Especialidade principal",
    professionalLink: "Link profissional (opcional)",
    email: "Email",
    password: "Palavra-passe",
    passwordPlaceholder: "mínimo 8 caracteres",
    acceptLegalPrefix: "Li e aceito os",
    acceptTerms: "Termos e Condições",
    acceptLegalMiddle: "e a",
    acceptPrivacy: "Política de Privacidade",
    acceptLegalSuffix: ".",
    acceptRequired: "Tens de aceitar os Termos e a Política de Privacidade para criar conta.",
    foundingProfileConsent: "Aceito que o meu perfil público de Coach Fundador (foto, nome, localização, testemunho e informação profissional selecionada) possa ser apresentado pela NLOCK.",
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
    title: "Crea tu cuenta coach NLOCK.",
    text: "Esta es la entrada única del coach: misma cuenta, misma lógica, app móvil en el campo y navegador premium en escritorio.",
    eyebrow: "Registro del coach",
    heading: "Crear cuenta",
    missingVars: "`NEXT_PUBLIC_SUPABASE_URL` y `NEXT_PUBLIC_SUPABASE_ANON_KEY` todavía deben configurarse.",
    coachName: "Nombre del coach",
    workplace: "¿Dónde trabajas?",
    workplacePlaceholder: "Gimnasio, estudio, club u online",
    city: "Ciudad",
    country: "País",
    specialty: "Especialidad principal",
    professionalLink: "Enlace profesional (opcional)",
    email: "Email",
    password: "Contraseña",
    passwordPlaceholder: "mínimo 8 caracteres",
    acceptLegalPrefix: "He leído y acepto los",
    acceptTerms: "Términos y Condiciones",
    acceptLegalMiddle: "y la",
    acceptPrivacy: "Política de Privacidad",
    acceptLegalSuffix: ".",
    acceptRequired: "Debes aceptar los Términos y la Política de Privacidad para crear la cuenta.",
    foundingProfileConsent: "Acepto que mi perfil público de Founder Coach (foto, nombre, ubicación, bio e información profesional seleccionada) pueda ser mostrado por NLOCK.",
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
    title: "Crée ton compte coach NLOCK.",
    text: "C'est l'entrée unique du coach : même compte, même logique, app mobile sur le terrain et navigateur premium sur desktop.",
    eyebrow: "Inscription coach",
    heading: "Créer un compte",
    missingVars: "`NEXT_PUBLIC_SUPABASE_URL` et `NEXT_PUBLIC_SUPABASE_ANON_KEY` doivent encore être configurés.",
    coachName: "Nom du coach",
    workplace: "Où exerces-tu ?",
    workplacePlaceholder: "Salle, studio, club ou en ligne",
    city: "Ville",
    country: "Pays",
    specialty: "Spécialité principale",
    professionalLink: "Lien professionnel (optionnel)",
    email: "Email",
    password: "Mot de passe",
    passwordPlaceholder: "minimum 8 caractères",
    acceptLegalPrefix: "J'ai lu et j'accepte les",
    acceptTerms: "Conditions Générales",
    acceptLegalMiddle: "et la",
    acceptPrivacy: "Politique de Confidentialité",
    acceptLegalSuffix: ".",
    acceptRequired: "Tu dois accepter les conditions et la politique de confidentialité pour créer le compte.",
    foundingProfileConsent: "J'accepte que mon profil public de Founder Coach (photo, nom, localisation, bio et informations professionnelles sélectionnées) puisse être affiché par NLOCK.",
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
  const [workplace, setWorkplace] = useState("");
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");
  const [specialty, setSpecialty] = useState("");
  const [professionalLink, setProfessionalLink] = useState("");
  const [publicBio, setPublicBio] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [acceptedLegal, setAcceptedLegal] = useState(false);
  const [foundingProfileConsent, setFoundingProfileConsent] = useState(false);
  const [registrationMode, setRegistrationMode] = useState("trial");
  const [founderIntent, setFounderIntent] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState("annual");
  const [emailChecking, setEmailChecking] = useState(false);
  const [emailAvailable, setEmailAvailable] = useState(null);
  const [onboardingStep, setOnboardingStep] = useState(1);
  const [createdAccount, setCreatedAccount] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [downloadModalOpen, setDownloadModalOpen] = useState(false);
  const t = copy[locale] || copy.en;

  useEffect(() => {
    const nextLocale = getInitialBrowserLocale();
    const params = new URLSearchParams(window.location.search);
    const requestedFounder = params.get("founder") === "1";
    setRegistrationMode(params.get("mode") === "subscription" || requestedFounder ? "subscription" : "trial");
    setFounderIntent(requestedFounder);
    setLocale(nextLocale);
    applyCoachLocale(nextLocale);
    trackEvent("landing_signup_opened", { locale: nextLocale });
  }, []);

  async function checkEmailAvailability(value = email) {
    const normalizedEmail = value.trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
      setEmailAvailable(null);
      return false;
    }

    setEmailChecking(true);
    try {
      const response = await fetch("/api/auth/check-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: normalizedEmail }),
      });
      const result = await response.json().catch(() => ({}));
      if (response.status === 503 && result.error === "email_check_unavailable") {
        setEmailAvailable(null);
        return true;
      }
      if (!response.ok || !result.ok) throw new Error("email_check_failed");
      setEmailAvailable(!result.exists);
      if (result.exists) {
        setErrorMessage(locale === "pt" ? "Este email já tem uma conta NLOCK. Faz login ou recupera a palavra-passe." : "This email already has a NLOCK account. Sign in or recover your password.");
        return false;
      }
      setErrorMessage("");
      return true;
    } catch {
      setEmailAvailable(null);
      setErrorMessage(locale === "pt" ? "Não foi possível validar o email agora. Tenta novamente." : "We could not validate this email right now. Try again.");
      return false;
    } finally {
      setEmailChecking(false);
    }
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (!configured) {
      setErrorMessage(t.missingVars);
      trackEvent("landing_signup_blocked", { reason: "missing_supabase_env", locale });
      return;
    }

    if (onboardingStep === 1 && !acceptedLegal) {
      setErrorMessage(t.acceptRequired);
      trackEvent("landing_signup_blocked", { reason: "legal_not_accepted", locale });
      return;
    }

    setSubmitting(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      const normalizedEmail = email.trim().toLowerCase();
      if (onboardingStep === 1) {
        const available = await checkEmailAvailability(normalizedEmail);
        if (!available) return;
      }

      if (onboardingStep === 1 && registrationMode === "subscription" && !founderIntent) {
        const checkoutStatus = await fetch("/api/billing/checkout", { cache: "no-store" });
        const checkoutConfig = await checkoutStatus.json().catch(() => ({}));
        if (!checkoutConfig.configured) {
          throw new Error(locale === "pt" ? "O pagamento online está a ser configurado. A tua conta ainda não foi criada; tenta novamente em breve." : "Online payment is being configured. Your account has not been created yet; try again shortly.");
        }
      }
      const submittedAt = createdAccount?.submittedAt || new Date().toISOString();
      const accessTier = founderIntent ? "founder" : "coach";
      const subscriptionCategory = founderIntent
        ? "nlock_founder_annual"
        : registrationMode === "subscription"
          ? selectedPlan === "annual" ? "nlock_coach_annual" : "nlock_coach_monthly"
          : "nlock_coach_trial";
      let userId = createdAccount?.userId || "";

      if (onboardingStep === 1) {
        const supabase = getSupabaseBrowserClient();
        const { data, error } = await supabase.auth.signUp({
          email: normalizedEmail,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/login?verified=1`,
            data: {
              full_name: fullName.trim(),
              role: "coach",
              founder_access_requested: founderIntent,
              trial_requested: registrationMode === "trial",
              selected_plan: registrationMode === "subscription" && !founderIntent ? selectedPlan : null,
              registration_mode: registrationMode,
              access_tier: accessTier,
              subscription_category: subscriptionCategory,
              billing_campaign_key: subscriptionCategory,
              accepted_terms_at: submittedAt,
              accepted_privacy_at: submittedAt,
              accepted_legal_version: "2026-04",
            },
          },
        });
        if (error) throw error;
        if (Array.isArray(data?.user?.identities) && data.user.identities.length === 0) {
          setEmailAvailable(false);
          throw new Error(locale === "pt" ? "Este email já tem uma conta NLOCK. Faz login ou recupera a palavra-passe." : "This email already has a NLOCK account. Sign in or recover your password.");
        }
        userId = data?.user?.id || "";

        if (founderIntent) {
          setCreatedAccount({ userId, submittedAt });
          setOnboardingStep(2);
          setSuccessMessage(locale === "pt" ? "Conta criada. Completa agora o perfil público da tua candidatura Founder." : "Account created. Now complete your public Founder profile.");
          trackEvent("landing_signup_account_created", { locale, accessTier });
          return;
        }
      }

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
            source: "nlock-signup-page",
            accessTier,
            registrationMode,
            subscriptionCategory,
            foundingPublicProfileConsent: foundingProfileConsent,
            foundingPublicProfileConsentAt: foundingProfileConsent ? submittedAt : null,
            workplace: workplace.trim(),
            city: city.trim(),
            country: country.trim(),
            specialty: specialty.trim(),
            professionalLink: professionalLink.trim(),
            publicBio: publicBio.trim(),
            selectedPlan,
            userId,
          }),
        });
      } catch {}

      trackEvent("landing_signup_success", { locale, accessTier, registrationMode });

      if (registrationMode === "subscription" && !founderIntent) {
        const checkoutResponse = await fetch("/api/billing/checkout", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ plan: selectedPlan, email: normalizedEmail, userId }),
        });
        const checkout = await checkoutResponse.json().catch(() => ({}));
        if (!checkoutResponse.ok || !checkout.url) throw new Error(locale === "pt" ? "A conta foi criada, mas não foi possível abrir o pagamento. Contacta a equipa NLOCK." : "The account was created, but payment could not be opened. Contact NLOCK.");
        window.location.assign(checkout.url);
        return;
      }

      setSuccessMessage(
        locale === "pt"
          ? "Conta NLOCK criada. Enviámos um email de validação. Confirma o email antes de iniciares sessão."
          : locale === "es"
            ? "Cuenta NLOCK creada. Enviamos un email de validación. Confirma tu email antes de iniciar sesión."
            : locale === "fr"
              ? "Compte NLOCK créé. Nous avons envoyé un email de validation. Confirme ton email avant de te connecter."
              : "NLOCK account created. We sent a verification email. Confirm it before signing in.",
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
    <main className="min-h-screen bg-[var(--page-gradient)] text-[var(--text)]">
      {downloadModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/45 px-4 py-6 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-[28px] border border-[var(--border-strong)] bg-[var(--surface-solid)] p-6 shadow-[var(--shadow-panel)]">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.18em] text-[var(--accent)]">NLOCK</p>
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
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_12%_5%,rgba(8,185,197,0.11),transparent_26%),radial-gradient(circle_at_92%_90%,rgba(185,237,40,0.08),transparent_25%)]" />

      <div className="relative mx-auto flex min-h-screen max-w-[1440px] flex-col px-4 pb-6 pt-4 sm:px-6 sm:pb-8 sm:pt-6 lg:px-8">
        <header className="flex items-center justify-between gap-3 rounded-full border border-[var(--border)] bg-[var(--header-bg)] p-1.5 pl-2 shadow-[var(--shadow-soft)] backdrop-blur-xl sm:pl-3">
          <Link
            href="/"
            onClick={() => trackEvent("landing_signup_back_click", { locale })}
            className="inline-flex h-10 items-center gap-2 rounded-full px-2 text-sm font-semibold text-[var(--text)] transition hover:bg-[var(--surface-muted)] sm:px-3"
          >
            <ArrowLeft size={16} />
            <span className="hidden sm:inline">{t.backToLanding}</span>
            <span className="sm:hidden">NLOCK</span>
          </Link>

          <div className="flex items-center gap-1.5 sm:gap-2">
            <ThemeToggle language={locale} className="shrink-0" />
            <Link
              href="/login"
              onClick={() => trackEvent("landing_signup_to_login_click", { locale })}
              className="inline-flex h-10 items-center gap-2 rounded-full bg-[var(--accent)] px-3 text-sm font-semibold text-[var(--accent-foreground)] sm:px-4"
            >
              {t.haveAccount}
              <ArrowRight size={15} className="hidden sm:block" />
            </Link>
          </div>
        </header>

        <div className="grid flex-1 items-start gap-5 py-5 sm:py-8 lg:grid-cols-[minmax(0,0.9fr)_minmax(520px,0.75fr)] lg:items-stretch lg:gap-6">
          <section className="relative hidden min-h-[720px] overflow-hidden rounded-[36px] border border-white/10 bg-[#071019] p-10 text-white shadow-[var(--shadow-panel)] lg:flex lg:flex-col xl:p-14">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_12%,rgba(8,185,197,0.26),transparent_30%),radial-gradient(circle_at_90%_90%,rgba(185,237,40,0.15),transparent_30%)]" />
            <div className="relative inline-flex w-fit rounded-full border border-white/15 bg-white/5 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#53e4cb]">
              {t.badge}
            </div>

            <h1 className="relative mt-10 max-w-2xl text-5xl font-semibold leading-[0.98] tracking-[-0.045em] text-white xl:text-6xl">
              {t.title}
            </h1>

            <p className="relative mt-6 max-w-xl text-lg leading-8 text-white/60">
              {t.text}
            </p>

            <div className="relative mt-auto grid gap-3 pt-12">
              {t.highlights.map((item) => (
                <div
                  key={item}
                  className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/[0.045] px-4 py-4"
                >
                  <CheckCircle2 size={18} className="mt-0.5 shrink-0 text-[#53e4cb]" />
                  <p className="text-sm leading-6 text-white/70">{item}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-[28px] border border-[var(--border)] bg-[var(--surface)] p-4 shadow-[var(--shadow-panel)] backdrop-blur-xl sm:rounded-[34px] sm:p-7 lg:p-8">
            <div className="mx-auto max-w-xl">
              <div className="mb-6 flex items-start justify-between gap-4 sm:mb-8">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--accent-strong)]">{t.eyebrow}</p>
                  <h2 className="mt-2 text-[2rem] font-semibold leading-tight tracking-[-0.035em] text-[var(--text)] sm:text-4xl">{onboardingStep === 2 ? "Completar perfil Founder" : t.heading}</h2>
                  <p className="mt-2 text-xs font-medium text-[var(--text-muted)] sm:text-sm">
                    {onboardingStep === 1 ? founderIntent ? "Passo 1 de 2 · Conta NLOCK" : "Conta NLOCK" : "Passo 2 de 2 · Perfil Coach Fundador"}
                  </p>
                </div>
                <div className="shrink-0 rounded-2xl border border-[var(--accent)]/20 bg-[var(--accent-soft)] p-3 text-[var(--accent-strong)]">
                  <UserPlus size={22} />
                </div>
              </div>

              {founderIntent && (
                <div className="mb-6 flex gap-2" aria-label="Progresso do registo">
                  <span className="h-1.5 flex-1 rounded-full bg-[var(--accent)]" />
                  <span className={`h-1.5 flex-1 rounded-full ${onboardingStep === 2 ? "bg-[var(--accent)]" : "bg-[var(--border)]"}`} />
                </div>
              )}

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
                {onboardingStep === 1 ? <>
                <fieldset className="mb-2 grid gap-3">
                  <legend className="mb-2 text-sm font-semibold text-[var(--text)]">
                    {locale === "pt" ? "Como queres começar?" : "How do you want to start?"}
                  </legend>
                  <div className="grid gap-2 sm:grid-cols-3 sm:gap-3">
                    <button
                      type="button"
                      onClick={() => { setRegistrationMode("trial"); setFounderIntent(false); setErrorMessage(""); }}
                      className={`min-h-[104px] rounded-[18px] border p-3 text-left transition sm:rounded-[20px] sm:p-4 ${registrationMode === "trial" ? "border-[var(--accent)] bg-[var(--accent-soft)] shadow-[var(--shadow-soft)]" : "border-[var(--border)] bg-[var(--surface-solid)]"}`}
                    >
                      <span className="block font-semibold text-[var(--text)]">{locale === "pt" ? "Iniciar trial" : "Start trial"}</span>
                      <span className="mt-2 block text-xs leading-5 text-[var(--text-muted)]">{locale === "pt" ? "30 dias grátis. Sem compromisso." : "30 days free. No commitment."}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => { setRegistrationMode("subscription"); setFounderIntent(false); setErrorMessage(""); }}
                      className={`min-h-[104px] rounded-[18px] border p-3 text-left transition sm:rounded-[20px] sm:p-4 ${registrationMode === "subscription" && !founderIntent ? "border-[var(--accent)] bg-[var(--accent-soft)] shadow-[var(--shadow-soft)]" : "border-[var(--border)] bg-[var(--surface-solid)]"}`}
                    >
                      <span className="block font-semibold text-[var(--text)]">{locale === "pt" ? "Subscrever NLOCK" : "Subscribe to NLOCK"}</span>
                      <span className="mt-2 block text-xs leading-5 text-[var(--text-muted)]">{locale === "pt" ? "Escolhe mensal ou anual e segue para pagamento." : "Choose monthly or annual and continue to payment."}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => { setRegistrationMode("subscription"); setFounderIntent(true); setSelectedPlan("annual"); setErrorMessage(""); }}
                      className={`min-h-[104px] rounded-[18px] border p-3 text-left transition sm:rounded-[20px] sm:p-4 ${founderIntent ? "border-[var(--accent)] bg-[var(--accent-soft)] shadow-[var(--shadow-soft)]" : "border-[var(--border)] bg-[var(--surface-solid)]"}`}
                    >
                      <span className="block font-semibold text-[var(--text)]">Coach Fundador</span>
                      <span className="mt-2 block text-xs leading-5 text-[var(--text-muted)]">{locale === "pt" ? "Candidata-te a uma das 50 vagas Founder." : "Apply for one of 50 Founder places."}</span>
                    </button>
                  </div>
                </fieldset>

                {registrationMode === "subscription" && !founderIntent ? (
                  <div className="mb-2 rounded-[22px] border border-[var(--border)] bg-[var(--surface-muted)] p-4 sm:p-5">
                    <div className="flex items-start gap-3">
                      <CreditCard size={20} className="mt-0.5 shrink-0 text-[var(--accent-strong)]" />
                      <div>
                        <p className="font-semibold text-[var(--text)]">{locale === "pt" ? "Escolhe a tua subscrição" : "Choose your subscription"}</p>
                        <p className="mt-1 text-xs leading-5 text-[var(--text-muted)]">{locale === "pt" ? "Depois de criares a conta, continuas para o pagamento seguro." : "After creating the account, you continue to secure payment."}</p>
                      </div>
                    </div>
                    <div className="mt-4 grid grid-cols-2 gap-2">
                      <button type="button" onClick={() => setSelectedPlan("monthly")} className={`rounded-2xl border p-3 text-left ${selectedPlan === "monthly" ? "border-[var(--accent)] bg-[var(--accent-soft)]" : "border-[var(--border)] bg-[var(--surface-solid)]"}`}>
                        <span className="block text-sm font-semibold text-[var(--text)]">Mensal</span>
                        <span className="mt-1 block text-lg font-semibold text-[var(--text)]">29,90 €<small className="text-xs font-normal text-[var(--text-muted)]">/mês</small></span>
                      </button>
                      <button type="button" onClick={() => setSelectedPlan("annual")} className={`relative rounded-2xl border p-3 text-left ${selectedPlan === "annual" ? "border-[var(--accent)] bg-[var(--accent-soft)]" : "border-[var(--border)] bg-[var(--surface-solid)]"}`}>
                        <span className="block text-sm font-semibold text-[var(--text)]">Anual</span>
                        <span className="mt-1 block text-lg font-semibold text-[var(--text)]">299,90 €<small className="text-xs font-normal text-[var(--text-muted)]">/ano</small></span>
                        <span className="mt-1 block text-[10px] font-semibold uppercase tracking-[0.12em] text-[var(--accent-strong)]">2 meses incluídos</span>
                      </button>
                    </div>
                  </div>
                ) : null}

                {founderIntent && onboardingStep === 1 ? (
                  <div className="mb-2 rounded-[22px] border border-[var(--accent)] bg-[linear-gradient(135deg,var(--accent-soft),transparent)] p-4 sm:p-5">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--accent-strong)]">Coach Fundador · 50 vagas</p>
                        <p className="mt-2 text-3xl font-semibold tracking-[-0.04em] text-[var(--text)]">199,90 €<small className="ml-1 text-sm font-normal tracking-normal text-[var(--text-muted)]">/ano</small></p>
                      </div>
                      <CheckCircle2 size={22} className="mt-1 shrink-0 text-[var(--accent-strong)]" />
                    </div>
                    <p className="mt-3 text-sm leading-6 text-[var(--text-muted)]">Preço Founder exclusivo, equivalente a cerca de 16,66 €/mês. Manténs este preço e o estatuto Coach Fundador enquanto a subscrição anual permanecer ativa.</p>
                  </div>
                ) : null}

                <label className="grid gap-2">
                  <span className="text-sm text-[var(--text-muted)]">{t.coachName}</span>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(event) => setFullName(event.target.value)}
                    placeholder={locale === "pt" ? "Nome" : locale === "es" ? "Nombre" : locale === "fr" ? "Nom" : "Name"}
                    className="min-h-[52px] rounded-2xl border border-[var(--border)] bg-[var(--surface-muted)] px-4 py-3.5 text-base text-[var(--text)] outline-none transition placeholder:text-[var(--text-muted)] focus:border-[var(--accent)] focus:bg-[var(--surface-solid)]"
                    autoComplete="name"
                    required
                  />
                </label>
                </> : null}

                {onboardingStep === 2 ? <div className="rounded-[24px] border border-[var(--accent)]/35 bg-[var(--surface-muted)] p-4 sm:p-5">
                  <div className="mb-5 flex items-start gap-3 border-b border-[var(--border)] pb-5">
                    <MapPinned size={21} className="mt-0.5 shrink-0 text-[var(--accent-strong)]" />
                    <div>
                      <p className="font-semibold text-[var(--text)]">Dados para o teu perfil Founder</p>
                      <p className="mt-2 text-sm leading-6 text-[var(--text-muted)]">Pedimos estes dados para te apresentar no Mural a potenciais clients: a localização coloca o teu perfil no mapa e o local de trabalho, especialidade, bio e link ajudam a perceber onde trabalhas e como contactar-te.</p>
                      <p className="mt-2 text-xs leading-5 text-[var(--text-muted)]">A fotografia será a associada ao teu perfil NLOCK. Nada será publicado antes da aprovação da candidatura e sem o teu consentimento.</p>
                    </div>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                  <label className="grid gap-2 sm:col-span-2">
                    <span className="text-sm text-[var(--text-muted)]">{t.workplace}</span>
                    <input
                      type="text"
                      value={workplace}
                      onChange={(event) => setWorkplace(event.target.value)}
                      placeholder={t.workplacePlaceholder}
                      className="rounded-2xl border border-[var(--border)] bg-[var(--surface-muted)] px-4 py-3.5 text-base text-[var(--text)] outline-none transition placeholder:text-[var(--text-muted)] focus:border-[var(--accent)] focus:bg-[var(--surface-solid)]"
                      autoComplete="organization"
                    />
                  </label>

                  <label className="grid gap-2">
                    <span className="text-sm text-[var(--text-muted)]">{t.city}</span>
                    <input
                      type="text"
                      value={city}
                      onChange={(event) => setCity(event.target.value)}
                      placeholder={locale === "pt" ? "Lisboa" : "City"}
                      className="rounded-2xl border border-[var(--border)] bg-[var(--surface-muted)] px-4 py-3.5 text-base text-[var(--text)] outline-none transition placeholder:text-[var(--text-muted)] focus:border-[var(--accent)] focus:bg-[var(--surface-solid)]"
                      autoComplete="address-level2"
                      required
                    />
                  </label>

                  <label className="grid gap-2">
                    <span className="text-sm text-[var(--text-muted)]">{t.country}</span>
                    <input
                      type="text"
                      value={country}
                      onChange={(event) => setCountry(event.target.value)}
                      placeholder={locale === "pt" ? "Portugal" : "Country"}
                      className="rounded-2xl border border-[var(--border)] bg-[var(--surface-muted)] px-4 py-3.5 text-base text-[var(--text)] outline-none transition placeholder:text-[var(--text-muted)] focus:border-[var(--accent)] focus:bg-[var(--surface-solid)]"
                      autoComplete="country-name"
                      required
                    />
                  </label>

                  <label className="grid gap-2 sm:col-span-2">
                    <span className="text-sm text-[var(--text-muted)]">{t.specialty}</span>
                    <input
                      type="text"
                      value={specialty}
                      onChange={(event) => setSpecialty(event.target.value)}
                      placeholder={locale === "pt" ? "Força, perda de peso, reabilitação…" : "Strength, weight loss, rehabilitation…"}
                      className="rounded-2xl border border-[var(--border)] bg-[var(--surface-muted)] px-4 py-3.5 text-base text-[var(--text)] outline-none transition placeholder:text-[var(--text-muted)] focus:border-[var(--accent)] focus:bg-[var(--surface-solid)]"
                      required
                    />
                  </label>

                  <label className="grid gap-2 sm:col-span-2">
                    <span className="text-sm text-[var(--text-muted)]">{t.professionalLink}</span>
                    <input
                      type="url"
                      value={professionalLink}
                      onChange={(event) => setProfessionalLink(event.target.value)}
                      placeholder="https://instagram.com/coach ou https://meusite.pt"
                      className="rounded-2xl border border-[var(--border)] bg-[var(--surface-muted)] px-4 py-3.5 text-base text-[var(--text)] outline-none transition placeholder:text-[var(--text-muted)] focus:border-[var(--accent)] focus:bg-[var(--surface-solid)]"
                      autoComplete="url"
                    />
                  </label>

                  <label className="grid gap-2 sm:col-span-2">
                    <span className="text-sm text-[var(--text-muted)]">Bio profissional</span>
                    <textarea
                      value={publicBio}
                      onChange={(event) => setPublicBio(event.target.value)}
                      placeholder="Conta em poucas linhas quem ajudas, como trabalhas e o que distingue o teu acompanhamento."
                      rows={4}
                      maxLength={600}
                      className="resize-none rounded-2xl border border-[var(--border)] bg-[var(--surface-muted)] px-4 py-3.5 text-base text-[var(--text)] outline-none transition placeholder:text-[var(--text-muted)] focus:border-[var(--accent)] focus:bg-[var(--surface-solid)]"
                      required
                    />
                  </label>
                  </div>
                </div> : null}

                {onboardingStep === 1 ? <>
                <label className="grid gap-2">
                  <span className="text-sm text-[var(--text-muted)]">{t.email}</span>
                  <input
                    type="email"
                    value={email}
                    onChange={(event) => { setEmail(event.target.value); setEmailAvailable(null); setErrorMessage(""); }}
                    onBlur={(event) => checkEmailAvailability(event.target.value)}
                    placeholder="coach@nlock.pt"
                    className="rounded-2xl border border-[var(--border)] bg-[var(--surface-muted)] px-4 py-3.5 text-base text-[var(--text)] outline-none transition placeholder:text-[var(--text-muted)] focus:border-[var(--accent)] focus:bg-[var(--surface-solid)]"
                    autoComplete="email"
                    required
                  />
                  {emailChecking ? <span className="text-xs text-[var(--text-muted)]">A verificar o email…</span> : emailAvailable === true ? <span className="inline-flex items-center gap-1 text-xs font-medium text-[var(--success)]"><CheckCircle2 size={13} /> Email disponível</span> : null}
                </label>

                <label className="grid gap-2">
                  <span className="text-sm text-[var(--text-muted)]">{t.password}</span>
                  <input
                    type="password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    placeholder={t.passwordPlaceholder}
                    className="rounded-2xl border border-[var(--border)] bg-[var(--surface-muted)] px-4 py-3.5 text-base text-[var(--text)] outline-none transition placeholder:text-[var(--text-muted)] focus:border-[var(--accent)] focus:bg-[var(--surface-solid)]"
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
                </> : null}

                {founderIntent && onboardingStep === 2 ? <label className="rounded-[20px] border border-[var(--accent)]/30 bg-[var(--surface-solid)] p-4">
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
                </label> : null}

                <button
                  type="submit"
                  disabled={submitting || !configured || (onboardingStep === 1 && !acceptedLegal)}
                  className="mt-2 inline-flex min-h-[54px] items-center justify-center gap-2 rounded-2xl [background:var(--brand-gradient)] px-5 py-4 font-semibold text-[#03130e] shadow-[var(--shadow-accent)] transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
                >
                  {submitting ? (
                    <>
                      <LoaderCircle size={18} className="animate-spin" />
                      {t.creating}
                    </>
                  ) : (
                    <>
                      {onboardingStep === 1 && founderIntent
                        ? "Criar conta e continuar"
                        : onboardingStep === 1 && registrationMode === "subscription"
                          ? "Criar conta e ir para pagamento"
                        : onboardingStep === 2
                          ? "Guardar perfil e enviar candidatura"
                          : t.createContinue}
                      <ArrowRight size={18} />
                    </>
                  )}
                </button>
              </form>

              <div className="mt-6 hidden gap-3 rounded-[24px] border border-[var(--border)] bg-[var(--surface-muted)] p-4 sm:grid">
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
