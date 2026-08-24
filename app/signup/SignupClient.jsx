"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AlertCircle, ArrowLeft, ArrowRight, CheckCircle2, CreditCard, LoaderCircle, ShieldCheck, UserPlus } from "lucide-react";

import { trackEvent } from "../../src/lib/analytics";
import { applyCoachLocale, getInitialBrowserLocale } from "../../src/lib/coach-locale";
import { getSupabaseBrowserClient, isSupabaseConfigured } from "../../src/lib/supabase-browser";
import ThemeToggle from "../../src/components/ThemeToggle";

function normalizeReferralCode(value) {
  return String(value || "")
    .trim()
    .toUpperCase()
    .replace(/[^A-Z0-9_-]/g, "")
    .slice(0, 32);
}

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
    modalText: "Download the APK, confirm the email you just received, and then open the NLOCK app.",
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
    modalText: "Inicia o download da APK, confirma o email que acabaste de receber e depois abre a app NLOCK.",
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
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [acceptedLegal, setAcceptedLegal] = useState(false);
  const [registrationMode, setRegistrationMode] = useState("trial");
  const [founderIntent, setFounderIntent] = useState(false);
  const [founderRemaining, setFounderRemaining] = useState(null);
  const [selectedPlan, setSelectedPlan] = useState("annual");
  const [referralCode, setReferralCode] = useState("");
  const [referralFromLink, setReferralFromLink] = useState(false);
  const [referralChecking, setReferralChecking] = useState(false);
  const [referralValid, setReferralValid] = useState(null);
  const [onboardingStep, setOnboardingStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const t = copy[locale] || copy.en;

  useEffect(() => {
    const nextLocale = getInitialBrowserLocale();
    const params = new URLSearchParams(window.location.search);
    const requestedFounder = params.get("founder") === "1";
    const requestedReferral = normalizeReferralCode(params.get("ref") || params.get("referral"));
    setRegistrationMode(params.get("mode") === "subscription" || requestedFounder ? "subscription" : "trial");
    setFounderIntent(requestedFounder);
    setReferralCode(requestedReferral);
    setReferralFromLink(Boolean(requestedReferral));
    setLocale(nextLocale);
    applyCoachLocale(nextLocale);
    trackEvent("landing_signup_opened", { locale: nextLocale });
  }, []);

  useEffect(() => {
    let active = true;
    const loadAvailability = () => {
      fetch("/api/billing/checkout?plan=founder", { cache: "no-store" })
        .then((response) => response.json())
        .then((payload) => {
          if (active && Number.isInteger(payload?.remaining)) setFounderRemaining(payload.remaining);
        })
        .catch(() => {});
    };
    loadAvailability();
    const timer = window.setInterval(loadAvailability, 30_000);
    return () => { active = false; window.clearInterval(timer); };
  }, []);

  const validateReferralCode = useCallback(async (value = referralCode) => {
    const normalized = normalizeReferralCode(value);
    if (!normalized) {
      setReferralValid(null);
      return true;
    }
    setReferralChecking(true);
    try {
      const supabase = getSupabaseBrowserClient();
      const { data, error } = await supabase.rpc("validate_coach_referral_code", { p_code: normalized });
      if (error) throw error;
      const valid = data === true;
      setReferralValid(valid);
      return valid;
    } catch {
      setReferralValid(null);
      return false;
    } finally {
      setReferralChecking(false);
    }
  }, [referralCode]);

  useEffect(() => {
    if (!referralCode || !configured) {
      setReferralValid(null);
      return undefined;
    }
    const timer = window.setTimeout(() => validateReferralCode(referralCode), 350);
    return () => window.clearTimeout(timer);
  }, [configured, referralCode, validateReferralCode]);

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

    try {
      const normalizedEmail = email.trim().toLowerCase();
      if (referralCode) {
        const validReferral = await validateReferralCode(referralCode);
        if (!validReferral) {
          setErrorMessage(locale === "pt" ? "O código de referral não é válido. Confirma o código ou deixa o campo vazio." : "The referral code is not valid. Check the code or leave the field empty.");
          return;
        }
      }
      if (onboardingStep === 1 && registrationMode === "subscription") {
        const checkoutPlan = founderIntent ? "founder" : selectedPlan;
        const checkoutStatus = await fetch(`/api/billing/checkout?plan=${checkoutPlan}`, { cache: "no-store" });
        const checkoutConfig = await checkoutStatus.json().catch(() => ({}));
        if (checkoutConfig.error === "founder_sold_out" || checkoutConfig.available === false && checkoutPlan === "founder") {
          throw new Error(locale === "pt" ? "As 50 vagas de Coach Fundador já foram preenchidas. Podes continuar com o plano Coach anual." : "All 50 Founder Coach places have been filled. You can continue with the annual Coach plan.");
        }
        if (!checkoutConfig.configured) {
          throw new Error(locale === "pt" ? "O pagamento online está a ser configurado. A tua conta ainda não foi criada; tenta novamente em breve." : "Online payment is being configured. Your account has not been created yet; try again shortly.");
        }
        setOnboardingStep(2);
        trackEvent("landing_signup_payment_step_opened", { locale, founderIntent, plan: checkoutPlan });
        return;
      }

      const submittedAt = new Date().toISOString();
      const accessTier = founderIntent ? "founder" : "coach";
      const subscriptionCategory = founderIntent
        ? "nlock_founder_annual"
        : registrationMode === "subscription"
          ? selectedPlan === "annual" ? "nlock_coach_annual" : "nlock_coach_monthly"
          : "nlock_coach_trial";
      const supabase = getSupabaseBrowserClient();

      if (registrationMode === "subscription") {
        const checkoutPlan = founderIntent ? "founder" : selectedPlan;
        const pendingSignup = {
          email: normalizedEmail,
          password,
          fullName: fullName.trim(),
          founderIntent,
          selectedPlan,
          registrationMode,
          accessTier,
          subscriptionCategory,
          referralCode: normalizeReferralCode(referralCode),
          submittedAt,
        };
        window.sessionStorage.setItem("nlock_pending_signup", JSON.stringify(pendingSignup));
        const checkoutResponse = await fetch("/api/billing/checkout", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ plan: checkoutPlan, email: normalizedEmail, fullName: fullName.trim(), referralCode: normalizeReferralCode(referralCode) }),
        });
        const checkout = await checkoutResponse.json().catch(() => ({}));
        if (checkout.error === "founder_sold_out") {
          throw new Error(locale === "pt" ? "As 50 vagas de Coach Fundador já foram preenchidas. Nenhum pagamento foi iniciado." : "All 50 Founder Coach places have been filled. No payment was started.");
        }
        if (checkout.error === "invalid_referral_code") {
          throw new Error(locale === "pt" ? "O código de referral deixou de estar disponível. Confirma o código antes de continuar." : "The referral code is no longer available. Check the code before continuing.");
        }
        if (!checkoutResponse.ok || !checkout.url || !checkout.claimToken) throw new Error(locale === "pt" ? "Não foi possível abrir o pagamento. A tua conta não foi criada; tenta novamente." : "Payment could not be opened. Your account was not created; try again.");
        window.sessionStorage.setItem("nlock_pending_signup", JSON.stringify({ ...pendingSignup, claimToken: checkout.claimToken }));
        window.location.assign(checkout.url);
        return;
      }

      const { data, error } = await supabase.auth.signUp({
        email: normalizedEmail,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/signup/success?mode=trial&email_verified=1`,
          data: {
            full_name: fullName.trim(),
            role: "coach",
            founder_access_requested: founderIntent,
            founder_profile_onboarding_required: founderIntent,
            trial_requested: registrationMode === "trial",
            selected_plan: registrationMode === "subscription" ? founderIntent ? "founder" : selectedPlan : null,
            registration_mode: registrationMode,
            access_tier: accessTier,
            subscription_category: subscriptionCategory,
            billing_campaign_key: subscriptionCategory,
            referral_code: normalizeReferralCode(referralCode) || null,
            accepted_terms_at: submittedAt,
            accepted_privacy_at: submittedAt,
            accepted_legal_version: "2026-04",
          },
        },
      });
      if (error) throw error;
      if (Array.isArray(data?.user?.identities) && data.user.identities.length === 0) {
        throw new Error(locale === "pt" ? "Este email já tem uma conta NLOCK. Faz login ou recupera a palavra-passe." : "This email already has a NLOCK account. Sign in or recover your password.");
      }
      trackEvent("landing_signup_success", { locale, accessTier, registrationMode });
      if (data.user?.id) {
        try {
          const statusResponse = await fetch("/api/signup/status", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userId: data.user.id, email: normalizedEmail }),
          });
          const statusPayload = await statusResponse.json().catch(() => ({}));
          if (statusResponse.ok && statusPayload.statusToken) {
            window.sessionStorage.setItem("nlock_signup_status_token", statusPayload.statusToken);
          }
        } catch {
          // O registo continua válido; a sessão autenticada serve de fallback para o estado.
        }
      }
      router.replace("/signup/success?mode=trial");
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
                  <h2 className="mt-2 text-[2rem] font-semibold leading-tight tracking-[-0.035em] text-[var(--text)] sm:text-4xl">{onboardingStep === 2 ? "Pagamento" : t.heading}</h2>
                  <p className="mt-2 text-xs font-medium text-[var(--text-muted)] sm:text-sm">
                    {onboardingStep === 1 ? registrationMode === "subscription" ? "Passo 1 de 2 · Registo e modalidade" : "Conta NLOCK" : "Passo 2 de 2 · Confirmar e pagar"}
                  </p>
                </div>
                <div className="shrink-0 rounded-2xl border border-[var(--accent)]/20 bg-[var(--accent-soft)] p-3 text-[var(--accent-strong)]">
                  <UserPlus size={22} />
                </div>
              </div>

              {registrationMode === "subscription" && (
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
                      disabled={founderRemaining === 0}
                      onClick={() => { setRegistrationMode("subscription"); setFounderIntent(true); setSelectedPlan("annual"); setErrorMessage(""); }}
                      className={`min-h-[104px] rounded-[18px] border p-3 text-left transition disabled:cursor-not-allowed disabled:opacity-55 sm:rounded-[20px] sm:p-4 ${founderIntent ? "border-[var(--accent)] bg-[var(--accent-soft)] shadow-[var(--shadow-soft)]" : "border-[var(--border)] bg-[var(--surface-solid)]"}`}
                    >
                      <span className="block font-semibold text-[var(--text)]">Coach Fundador</span>
                      <span className="mt-2 block text-xs leading-5 text-[var(--text-muted)]">{founderRemaining === 0 ? (locale === "pt" ? "As vagas Founder estão esgotadas." : "Founder places are sold out.") : founderRemaining !== null && founderRemaining <= 10 ? (locale === "pt" ? `Restam ${founderRemaining} ${founderRemaining === 1 ? "vaga" : "vagas"}.` : `${founderRemaining} ${founderRemaining === 1 ? "place remains" : "places remain"}.`) : (locale === "pt" ? "Ativa o plano anual e garante uma das primeiras 50 vagas." : "Activate the annual plan and secure one of the first 50 places.")}</span>
                    </button>
                  </div>
                </fieldset>

                {registrationMode === "subscription" && !founderIntent ? (
                  <div className="mb-2 rounded-[22px] border border-[var(--border)] bg-[var(--surface-muted)] p-4 sm:p-5">
                    <div className="flex items-start gap-3">
                      <CreditCard size={20} className="mt-0.5 shrink-0 text-[var(--accent-strong)]" />
                      <div>
                        <p className="font-semibold text-[var(--text)]">{locale === "pt" ? "Escolhe a tua subscrição" : "Choose your subscription"}</p>
                        <p className="mt-1 text-xs leading-5 text-[var(--text-muted)]">{locale === "pt" ? "A conta só é criada depois de o pagamento ficar confirmado." : "Your account is only created after payment is confirmed."}</p>
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
                        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--accent-strong)]">Coach Fundador · {founderRemaining !== null && founderRemaining <= 10 ? `${founderRemaining} ${founderRemaining === 1 ? "vaga restante" : "vagas restantes"}` : "50 vagas"}</p>
                        <p className="mt-2 text-3xl font-semibold tracking-[-0.04em] text-[var(--text)]">199,90 €<small className="ml-1 text-sm font-normal tracking-normal text-[var(--text-muted)]">/ano</small></p>
                      </div>
                      <CheckCircle2 size={22} className="mt-1 shrink-0 text-[var(--accent-strong)]" />
                    </div>
                    <p className="mt-3 text-sm leading-6 text-[var(--text-muted)]">Preço Founder exclusivo, equivalente a cerca de 16,66 €/mês. Manténs este preço e o estatuto Coach Fundador enquanto a subscrição anual permanecer ativa.</p>
                    <p className="mt-2 text-xs leading-5 text-[var(--text-muted)]">No primeiro login na app completas o perfil do Mural: fotografia, localização, especialidade, bio e contacto profissional.</p>
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

                <label className="grid gap-2">
                  <span className="flex items-center justify-between gap-3 text-sm text-[var(--text-muted)]">
                    <span>{locale === "pt" ? "Código de referral (opcional)" : "Referral code (optional)"}</span>
                    {referralFromLink && referralCode ? <span className="font-semibold text-[var(--accent-strong)]">{locale === "pt" ? "Aplicado pelo link" : "Applied from link"}</span> : null}
                  </span>
                  <input
                    type="text"
                    value={referralCode}
                    onChange={(event) => { setReferralCode(normalizeReferralCode(event.target.value)); setReferralFromLink(false); setReferralValid(null); setErrorMessage(""); }}
                    onBlur={(event) => validateReferralCode(event.target.value)}
                    placeholder={locale === "pt" ? "Ex.: ABCDE" : "E.g. ABCDE"}
                    className="min-h-[52px] rounded-2xl border border-[var(--border)] bg-[var(--surface-muted)] px-4 py-3.5 font-mono text-base uppercase tracking-[0.08em] text-[var(--text)] outline-none transition placeholder:font-sans placeholder:normal-case placeholder:tracking-normal placeholder:text-[var(--text-muted)] focus:border-[var(--accent)] focus:bg-[var(--surface-solid)]"
                    autoComplete="off"
                    maxLength={32}
                  />
                  <span className="text-xs leading-5 text-[var(--text-muted)]">{locale === "pt" ? "Se recebeste um link de um coach, o código aparece aqui automaticamente." : "If a coach shared a link with you, the code appears here automatically."}</span>
                  {referralChecking ? <span className="text-xs text-[var(--text-muted)]">{locale === "pt" ? "A validar o código…" : "Validating code…"}</span> : referralValid === true ? <span className="inline-flex items-center gap-1 text-xs font-medium text-[var(--success)]"><CheckCircle2 size={13} /> {locale === "pt" ? "Código válido" : "Valid code"}</span> : referralValid === false ? <span className="inline-flex items-center gap-1 text-xs font-medium text-rose-600"><AlertCircle size={13} /> {locale === "pt" ? "Código não reconhecido" : "Code not recognized"}</span> : null}
                </label>
                </> : null}

                {onboardingStep === 2 ? (
                  <div className="rounded-[24px] border border-[var(--accent)]/35 bg-[var(--surface-muted)] p-5 sm:p-6">
                    <div className="flex items-start gap-3 border-b border-[var(--border)] pb-5">
                      <CreditCard size={22} className="mt-0.5 shrink-0 text-[var(--accent-strong)]" />
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--accent-strong)]">Resumo da subscrição</p>
                        <h3 className="mt-2 text-2xl font-semibold text-[var(--text)]">{founderIntent ? "Coach Fundador" : selectedPlan === "annual" ? "NLOCK anual" : "NLOCK mensal"}</h3>
                        <p className="mt-2 text-sm leading-6 text-[var(--text-muted)]">Confirma os dados e segue para o checkout seguro. A conta NLOCK só é criada após a confirmação do pagamento.</p>
                      </div>
                    </div>
                    <div className="mt-5 flex items-end justify-between gap-4 rounded-2xl border border-[var(--border)] bg-[var(--surface-solid)] p-4">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--text-muted)]">Total</p>
                        <p className="mt-2 text-3xl font-semibold tracking-[-0.04em] text-[var(--text)]">{founderIntent ? "199,90 €" : selectedPlan === "annual" ? "299,90 €" : "29,90 €"}</p>
                      </div>
                      <p className="pb-1 text-sm text-[var(--text-muted)]">/{founderIntent || selectedPlan === "annual" ? "ano" : "mês"}</p>
                    </div>
                    {founderIntent ? <p className="mt-4 text-sm leading-6 text-[var(--text-muted)]">Se a tua subscrição estiver entre as primeiras 50, o estatuto de Coach Fundador é ativado automaticamente e mantém-se enquanto o plano anual permanecer ativo.</p> : null}
                    <button type="button" onClick={() => { setOnboardingStep(1); setErrorMessage(""); }} className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-[var(--text-muted)] transition hover:text-[var(--text)]">
                      <ArrowLeft size={15} /> Alterar dados ou modalidade
                    </button>
                  </div>
                ) : null}

                {onboardingStep === 1 ? <>
                <label className="grid gap-2">
                  <span className="text-sm text-[var(--text-muted)]">{t.email}</span>
                  <input
                    type="email"
                    value={email}
                    onChange={(event) => { setEmail(event.target.value); setErrorMessage(""); }}
                    placeholder="coach@nlock.pt"
                    className="rounded-2xl border border-[var(--border)] bg-[var(--surface-muted)] px-4 py-3.5 text-base text-[var(--text)] outline-none transition placeholder:text-[var(--text-muted)] focus:border-[var(--accent)] focus:bg-[var(--surface-solid)]"
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
                      {onboardingStep === 1 && registrationMode === "subscription"
                        ? "Continuar para pagamento"
                        : onboardingStep === 2
                          ? founderIntent ? "Criar conta e ativar plano anual" : "Criar conta e pagar subscrição"
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
