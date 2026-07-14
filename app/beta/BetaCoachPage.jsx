"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  Activity,
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  ClipboardCheck,
  Dumbbell,
  LoaderCircle,
  LockKeyhole,
  MailCheck,
  ShieldCheck,
  Smartphone,
  Sparkles,
  Users,
} from "lucide-react";

import CookieSettingsButton from "../../src/components/CookieSettingsButton";
import { trackEvent } from "../../src/lib/analytics";
import { applyCoachLocale, getInitialBrowserLocale } from "../../src/lib/coach-locale";
import { getSupabaseBrowserClient, isSupabaseConfigured } from "../../src/lib/supabase-browser";

const APK_DOWNLOAD_URL = "/download/apk";

const copy = {
  pt: {
    navLogin: "Login",
    navSignup: "Candidatar-me",
    badge: "Acesso antecipado para coaches",
    title: "Torna-te um dos primeiros coaches a operar com a APEX COACH.",
    subtitle:
      "Uma entrada mais limpa, mais premium e sem ruido: crias a tua identidade de coach, validas o email e começas a usar a APEX COACH no terreno.",
    primary: "Candidatar-me ao acesso",
    secondary: "Ver APK",
    proof: ["Acesso controlado", "Email validado antes do uso", "Conta unica para app e browser"],
    panelEyebrow: "Processo de acesso",
    panelTitle: "Como funciona",
    steps: [
      {
        title: "1. Cria a conta de coach",
        text: "Chegas a partir do anuncio, redes sociais ou recomendacao, e crias a conta em apexcoach.pt.",
      },
      {
        title: "2. Recebe email e inicia download",
        text: "Recebes o email automatico de confirmacao e podes iniciar o download da APK beta.",
      },
      {
        title: "3. Confirma email e faz login",
        text: "Depois de confirmares o email, entras com a mesma conta e comecas a usar a app.",
      },
    ],
    specsEyebrow: "Specs da app",
    specsTitle: "O que o coach consegue fazer na app",
    specsText:
      "A APEX COACH esta focada no trabalho real: criar clients, preparar sessoes, acompanhar agenda, registar avaliacao, gerir treino e manter contexto operacional num so sistema.",
    specs: [
      {
        title: "Clients e perfil",
        items: ["Base de clients", "Dados fisicos e objetivos", "Historico por client", "Cores e tags visuais"],
      },
      {
        title: "Agenda e sessoes",
        items: ["Marcacoes", "Tipos de sessao", "Recorrencias", "Estado da sessao"],
      },
      {
        title: "Treino e protocolos",
        items: ["Sessoes de treino", "Biblioteca de exercicios", "Protocolos", "Registo de cargas e notas"],
      },
      {
        title: "Assessments",
        items: ["Metricas fisicas", "Historico de avaliacoes", "Normas e benchmarks", "Leitura de progresso"],
      },
      {
        title: "Billing operacional",
        items: ["Packs", "Estado de pagamentos", "Perfis de faturacao", "Visao mensal/anual"],
      },
      {
        title: "Client app",
        items: ["Convite por codigo", "Conta de atleta", "Sessoes do client", "Tracking e perfil"],
      },
    ],
    betaStateTitle: "Estado atual do acesso",
    betaState: [
      "APK beta Android disponivel para teste direto.",
      "Workspace browser em evolucao para operacao desktop.",
      "Email de validacao obrigatorio antes do login.",
      "Google Play e App Store ainda em preparacao.",
    ],
    formTitle: "Candidatura de coach",
    formText:
      "Usa o email que queres associar a tua operacao de coach. Este email sera usado para validar a conta.",
    name: "Nome do coach",
    email: "Email profissional",
    password: "Password",
    focus: "Principal foco como coach",
    focusPlaceholder: "Ex: personal training, performance, saude, online coaching...",
    terms:
      "Aceito criar uma conta APEX COACH e receber comunicacoes relacionadas com o meu pedido de acesso.",
    submit: "Enviar candidatura e criar acesso",
    submitting: "A preparar acesso...",
    configuredError:
      "As variaveis NEXT_PUBLIC_SUPABASE_URL e NEXT_PUBLIC_SUPABASE_ANON_KEY precisam de estar configuradas.",
    termsError: "Tens de aceitar as condicoes de acesso para continuar.",
    success:
      "Conta criada. Enviamos o email de validacao APEX COACH. Podes iniciar o download da APK beta e confirmar o email antes de fazer login.",
    existing: "Este email ja esta registado. Faz login ou usa outro email.",
    genericError: "Nao foi possivel criar o pedido de acesso.",
    download: "Download APK beta",
    loginAfter: "Ja validaste o email? Fazer login",
  },
  en: {
    navLogin: "Login",
    navSignup: "Apply",
    badge: "Early access for coaches",
    title: "Become one of the first coaches to operate with APEX COACH.",
    subtitle:
      "A cleaner, more premium entry point: create your coach identity, verify your email, and start using APEX COACH in the field.",
    primary: "Apply for access",
    secondary: "View APK",
    proof: ["Controlled access", "Email verified before use", "One account for app and browser"],
    panelEyebrow: "Access process",
    panelTitle: "How it works",
    steps: [
      {
        title: "1. Create your coach account",
        text: "Arrive from an ad, social post, or referral, then create your account at apexcoach.pt.",
      },
      {
        title: "2. Receive email and start download",
        text: "You receive the automatic confirmation email and can start downloading the beta APK.",
      },
      {
        title: "3. Confirm email and sign in",
        text: "After confirming your email, sign in with the same account and start using the app.",
      },
    ],
    specsEyebrow: "App specs",
    specsTitle: "What the coach can do in the app",
    specsText:
      "APEX COACH focuses on real work: creating clients, preparing sessions, managing schedule, recording assessments, managing training, and keeping operational context in one system.",
    specs: [
      {
        title: "Clients and profile",
        items: ["Client database", "Physical data and goals", "Client history", "Visual colors and tags"],
      },
      {
        title: "Schedule and sessions",
        items: ["Bookings", "Session types", "Recurrences", "Session status"],
      },
      {
        title: "Training and protocols",
        items: ["Training sessions", "Exercise library", "Protocols", "Load and note logging"],
      },
      {
        title: "Assessments",
        items: ["Physical metrics", "Assessment history", "Norms and benchmarks", "Progress reading"],
      },
      {
        title: "Operational billing",
        items: ["Packs", "Payment status", "Billing profiles", "Monthly/yearly overview"],
      },
      {
        title: "Client app",
        items: ["Invite code", "Athlete account", "Client sessions", "Tracking and profile"],
      },
    ],
    betaStateTitle: "Current access state",
    betaState: [
      "Android beta APK available for direct testing.",
      "Browser workspace evolving for desktop operations.",
      "Email verification required before login.",
      "Google Play and App Store are still in preparation.",
    ],
    formTitle: "Coach application",
    formText:
      "Use the email you want linked to your coach operation. This email will be used to verify the account.",
    name: "Coach name",
    email: "Professional email",
    password: "Password",
    focus: "Main coaching focus",
    focusPlaceholder: "Ex: personal training, performance, health, online coaching...",
    terms:
      "I agree to create an APEX COACH account and receive communications related to my access request.",
    submit: "Submit application and create access",
    submitting: "Preparing access...",
    configuredError:
      "NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY must be configured.",
    termsError: "You need to accept the access conditions to continue.",
    success:
      "Account created. We sent the APEX COACH verification email. You can start downloading the beta APK and confirm your email before signing in.",
    existing: "This email is already registered. Sign in or use another email.",
    genericError: "Could not create the access request.",
    download: "Download beta APK",
    loginAfter: "Already verified your email? Sign in",
  },
};

function betaErrorMessage(error, t) {
  const raw = String(error?.message ?? error ?? "").toLowerCase();
  if (raw.includes("already registered") || raw.includes("already exists")) {
    return t.existing;
  }
  return t.genericError;
}

function ApexLockup() {
  return (
    <span className="inline-flex h-11 items-center rounded-full border border-[var(--border)] bg-white px-3 shadow-[var(--shadow-soft)] sm:h-[52px] sm:px-4">
      <img src="/main_logo_white.png" alt="APEX COACH" className="h-8 w-auto max-w-[142px] object-contain sm:h-9 sm:max-w-[178px]" />
    </span>
  );
}

function BetaProductMockup({ locale }) {
  const labels =
    locale === "pt"
      ? {
          title: "Hoje na operacao",
          week: "Semana ativa",
          clients: "Clients",
          sessions: "Sessoes",
          assessments: "Assessments",
          next: "Proxima sessao",
          billing: "Billing em dia",
          phone: "APK beta",
        }
      : {
          title: "Today in operations",
          week: "Active week",
          clients: "Clients",
          sessions: "Sessions",
          assessments: "Assessments",
          next: "Next session",
          billing: "Billing on track",
          phone: "Beta APK",
        };

  const stats = [
    { label: labels.clients, value: "18", icon: <Users size={16} className="text-[var(--accent-strong)]" /> },
    { label: labels.sessions, value: "7", icon: <CalendarDays size={16} className="text-[var(--accent-strong)]" /> },
    { label: labels.assessments, value: "4", icon: <Activity size={16} className="text-[var(--accent-strong)]" /> },
  ];

  return (
    <div className="relative overflow-hidden rounded-[32px] border border-[var(--border-strong)] bg-[#080a09] p-4 shadow-[0_28px_80px_rgba(14,17,16,0.24)] sm:p-6">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(57,185,138,0.22),transparent_36%),radial-gradient(circle_at_bottom_right,rgba(77,135,199,0.18),transparent_32%)]" />
      <div className="relative grid gap-4">
        <div className="flex items-center justify-between gap-3">
          <ApexLockup />
          <span className="rounded-full border border-white/10 bg-white/10 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-white/80">
            {labels.phone}
          </span>
        </div>

        <div className="grid gap-4 lg:grid-cols-[1fr_0.72fr]">
          <div className="rounded-[24px] border border-white/10 bg-white/95 p-4">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--accent-strong)]">{labels.week}</p>
                <h3 className="mt-2 text-2xl font-semibold text-[var(--text)]">{labels.title}</h3>
              </div>
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[var(--accent-soft)] text-[var(--accent-strong)]">
                <Dumbbell size={20} />
              </div>
            </div>

            <div className="mt-5 grid grid-cols-3 gap-2">
              {stats.map(({ label, value, icon }) => (
                <div key={label} className="rounded-2xl border border-[var(--border)] bg-[var(--surface-muted)] p-3">
                  {icon}
                  <p className="mt-3 text-2xl font-semibold text-[var(--text)]">{value}</p>
                  <p className="mt-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-[var(--text-muted)]">{label}</p>
                </div>
              ))}
            </div>

            <div className="mt-4 grid gap-3">
              <div className="rounded-2xl border border-[var(--border)] bg-white p-3">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--text-muted)]">{labels.next}</p>
                    <p className="mt-1 font-semibold text-[var(--text)]">Lower body strength</p>
                  </div>
                  <span className="rounded-full bg-[var(--accent-soft)] px-3 py-1 text-sm font-semibold text-[var(--accent-strong)]">18:30</span>
                </div>
              </div>
              <div className="rounded-2xl border border-[var(--border)] bg-white p-3">
                <div className="flex items-center justify-between gap-4">
                  <p className="font-semibold text-[var(--text)]">{labels.billing}</p>
                  <span className="h-2.5 w-24 overflow-hidden rounded-full bg-slate-100">
                    <span className="block h-full w-4/5 rounded-full bg-[var(--accent)]" />
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-[230px] rounded-[28px] border border-white/15 bg-black p-2 shadow-[0_24px_58px_rgba(0,0,0,0.32)]">
            <div className="overflow-hidden rounded-[22px] bg-white">
              <img src="/screenshot_2.jpeg" alt="APEX COACH app screen" className="h-[390px] w-full object-cover object-top" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function BetaCoachPage() {
  const configured = useMemo(() => isSupabaseConfigured(), []);
  const [locale, setLocale] = useState("pt");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [focus, setFocus] = useState("");
  const [accepted, setAccepted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const t = copy[locale] || copy.pt;

  useEffect(() => {
    const nextLocale = getInitialBrowserLocale();
    setLocale(nextLocale === "pt" ? "pt" : "en");
    applyCoachLocale(nextLocale);
    trackEvent("beta_landing_opened", { locale: nextLocale });
  }, []);

  async function handleSubmit(event) {
    event.preventDefault();
    setMessage("");
    setError("");

    if (!configured) {
      setError(t.configuredError);
      trackEvent("beta_signup_blocked", { reason: "missing_supabase_env", locale });
      return;
    }

    if (!accepted) {
      setError(t.termsError);
      trackEvent("beta_signup_blocked", { reason: "terms_not_accepted", locale });
      return;
    }

    setSubmitting(true);
    try {
      const normalizedEmail = email.trim().toLowerCase();
      const supabase = getSupabaseBrowserClient();
      const { data, error: signUpError } = await supabase.auth.signUp({
        email: normalizedEmail,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/login?verified=1`,
          data: {
            full_name: fullName.trim(),
            role: "coach",
            beta_access_requested: true,
            beta_requested_at: new Date().toISOString(),
            founder_access_requested: true,
            access_tier: "founder",
            subscription_category: "apex_coach_founder",
            billing_campaign_key: "apex_coach_founder",
            coaching_focus: focus.trim(),
            accepted_beta_terms_at: new Date().toISOString(),
            accepted_legal_version: "2026-07-beta",
          },
        },
      });

      if (signUpError) throw signUpError;

      try {
        const applicationResponse = await fetch("/api/coach-applications", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            fullName: fullName.trim(),
            email: normalizedEmail,
            focus: focus.trim(),
            locale,
            source: "apexcoach-application-page",
            accessTier: "founder",
            subscriptionCategory: "apex_coach_founder",
            userId: data?.user?.id || "",
          }),
        });
        if (!applicationResponse.ok) {
          throw new Error("Application notification failed.");
        }
        trackEvent("coach_application_notification_success", { locale });
      } catch (notificationError) {
        trackEvent("coach_application_notification_error", {
          locale,
          message: String(notificationError?.message || notificationError),
        });
      }

      setMessage(t.success);
      trackEvent("beta_signup_success", { locale });
    } catch (signupError) {
      const nextError = betaErrorMessage(signupError, t);
      setError(nextError);
      trackEvent("beta_signup_error", { locale, message: nextError });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="min-h-screen bg-[var(--bg)] text-[var(--text)]">
      <header className="mx-auto flex max-w-7xl items-center justify-between px-5 py-5 lg:px-8">
        <Link href="/" className="flex items-center gap-3">
          <ApexLockup />
        </Link>
        <div className="flex items-center gap-2">
          <Link href="/login" className="rounded-full border border-[var(--border)] bg-white px-4 py-2 text-sm font-semibold text-[var(--text)]">
            {t.navLogin}
          </Link>
          <a href="#beta-form" className="hidden rounded-full bg-[var(--accent)] px-4 py-2 text-sm font-semibold text-[var(--accent-foreground)] sm:inline-flex">
            {t.navSignup}
          </a>
        </div>
      </header>

      <section className="mx-auto grid max-w-7xl gap-10 px-5 pb-14 pt-6 lg:grid-cols-[1fr_0.82fr] lg:items-center lg:px-8 lg:pb-24 lg:pt-14">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-[var(--accent)]/25 bg-[var(--accent-soft)] px-4 py-2 text-sm font-semibold text-[var(--accent-strong)]">
            <Sparkles size={16} />
            {t.badge}
          </div>

          <h1 className="mt-7 max-w-4xl text-4xl font-semibold leading-[1.03] text-[var(--text)] sm:text-6xl lg:text-7xl">
            {t.title}
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-7 text-[var(--text-muted)] sm:text-xl sm:leading-9">
            {t.subtitle}
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <a href="#beta-form" className="inline-flex items-center justify-center gap-2 rounded-[16px] bg-[var(--accent)] px-5 py-4 font-semibold text-[var(--accent-foreground)] shadow-[0_14px_34px_rgba(57,185,138,0.22)]">
              {t.primary}
              <ArrowRight size={18} />
            </a>
            <a href={APK_DOWNLOAD_URL} target="_blank" rel="noreferrer" className="inline-flex items-center justify-center gap-2 rounded-[16px] border border-[var(--border)] bg-white px-5 py-4 font-semibold text-[var(--text)]">
              <Smartphone size={18} />
              {t.secondary}
            </a>
          </div>

          <div className="mt-8 grid gap-3 sm:grid-cols-3">
            {t.proof.map((item) => (
              <div key={item} className="flex items-center gap-2 rounded-[16px] border border-[var(--border)] bg-white px-4 py-3 text-sm font-semibold text-[var(--text-muted)] shadow-[var(--shadow-soft)]">
                <CheckCircle2 size={16} className="text-[var(--accent-strong)]" />
                {item}
              </div>
            ))}
          </div>
        </div>

        <div className="grid gap-4">
          <BetaProductMockup locale={locale} />
          <div className="rounded-[28px] border border-[var(--border-strong)] bg-white p-5 shadow-[var(--shadow-panel)] sm:p-7">
            <div className="rounded-[22px] border border-[var(--border)] bg-[linear-gradient(180deg,#ffffff_0%,#f7fbf9_100%)] p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--accent-strong)]">{t.panelEyebrow}</p>
            <h2 className="mt-3 text-3xl font-semibold text-[var(--text)]">{t.panelTitle}</h2>
            <div className="mt-6 grid gap-4">
              {t.steps.map((step, index) => {
                const icons = [ClipboardCheck, MailCheck, LockKeyhole];
                const Icon = icons[index] || ShieldCheck;
                return (
                  <div key={step.title} className="flex gap-4 rounded-[18px] border border-[var(--border)] bg-white p-4">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[14px] bg-[var(--accent-soft)] text-[var(--accent-strong)]">
                      <Icon size={20} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-[var(--text)]">{step.title}</h3>
                      <p className="mt-1 text-sm leading-6 text-[var(--text-muted)]">{step.text}</p>
                    </div>
                  </div>
                );
              })}
            </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-8 px-5 pb-14 lg:grid-cols-[0.78fr_1fr] lg:px-8 lg:pb-20">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--accent-strong)]">{t.specsEyebrow}</p>
          <h2 className="mt-4 text-3xl font-semibold leading-tight text-[var(--text)] sm:text-5xl">{t.specsTitle}</h2>
          <p className="mt-5 max-w-xl text-base leading-8 text-[var(--text-muted)]">{t.specsText}</p>

          <div className="mt-7 rounded-[22px] border border-[var(--border-strong)] bg-white p-5 shadow-[var(--shadow-soft)]">
            <div className="flex items-center gap-3">
              <ShieldCheck size={20} className="text-[var(--accent-strong)]" />
              <h3 className="font-semibold text-[var(--text)]">{t.betaStateTitle}</h3>
            </div>
            <div className="mt-4 grid gap-3">
              {t.betaState.map((item) => (
                <div key={item} className="flex items-start gap-3 text-sm leading-6 text-[var(--text-muted)]">
                  <CheckCircle2 size={16} className="mt-1 shrink-0 text-[var(--accent-strong)]" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {t.specs.map((spec) => (
            <div key={spec.title} className="rounded-[22px] border border-[var(--border)] bg-white p-5 shadow-[var(--shadow-soft)]">
              <h3 className="text-lg font-semibold text-[var(--text)]">{spec.title}</h3>
              <div className="mt-4 grid gap-2">
                {spec.items.map((item) => (
                  <div key={item} className="flex items-start gap-2 text-sm leading-6 text-[var(--text-muted)]">
                    <CheckCircle2 size={15} className="mt-1 shrink-0 text-[var(--accent-strong)]" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section id="beta-form" className="border-y border-[var(--border)] bg-white">
        <div className="mx-auto grid max-w-7xl gap-8 px-5 py-14 lg:grid-cols-[0.8fr_1fr] lg:px-8 lg:py-20">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--accent-strong)]">APEX COACH</p>
            <h2 className="mt-4 text-3xl font-semibold text-[var(--text)] sm:text-5xl">{t.formTitle}</h2>
            <p className="mt-5 max-w-xl text-base leading-8 text-[var(--text-muted)]">{t.formText}</p>
            <div className="mt-7 rounded-[20px] border border-[var(--border)] bg-[var(--surface-muted)] p-5">
              <div className="flex items-start gap-3">
                <MailCheck size={20} className="mt-1 text-[var(--accent-strong)]" />
                <p className="text-sm leading-7 text-[var(--text-muted)]">
                  {locale === "pt"
                    ? "O email de validacao e parte da experiencia: curto, claro e com linguagem premium para o coach perceber que entrou num processo cuidado."
                    : "The verification email is part of the experience: short, clear, and premium, so the coach feels the access flow is intentional."}
                </p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="grid gap-4 rounded-[28px] border border-[var(--border-strong)] bg-[var(--surface-solid)] p-5 shadow-[var(--shadow-panel)] sm:p-7">
            {error ? <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</div> : null}
            {message ? <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">{message}</div> : null}

            <label className="grid gap-2">
              <span className="text-sm font-medium text-[var(--text-muted)]">{t.name}</span>
              <input required value={fullName} onChange={(event) => setFullName(event.target.value)} className="rounded-2xl border border-[var(--border)] bg-[var(--surface-muted)] px-4 py-3.5 outline-none focus:border-[var(--accent)]" />
            </label>

            <label className="grid gap-2">
              <span className="text-sm font-medium text-[var(--text-muted)]">{t.email}</span>
              <input required type="email" value={email} onChange={(event) => setEmail(event.target.value)} className="rounded-2xl border border-[var(--border)] bg-[var(--surface-muted)] px-4 py-3.5 outline-none focus:border-[var(--accent)]" />
            </label>

            <label className="grid gap-2">
              <span className="text-sm font-medium text-[var(--text-muted)]">{t.password}</span>
              <input required type="password" minLength={8} value={password} onChange={(event) => setPassword(event.target.value)} className="rounded-2xl border border-[var(--border)] bg-[var(--surface-muted)] px-4 py-3.5 outline-none focus:border-[var(--accent)]" />
            </label>

            <label className="grid gap-2">
              <span className="text-sm font-medium text-[var(--text-muted)]">{t.focus}</span>
              <textarea value={focus} onChange={(event) => setFocus(event.target.value)} placeholder={t.focusPlaceholder} rows={3} className="resize-none rounded-2xl border border-[var(--border)] bg-[var(--surface-muted)] px-4 py-3.5 outline-none focus:border-[var(--accent)]" />
            </label>

            <label className="flex gap-3 rounded-2xl border border-[var(--border)] bg-[var(--surface-muted)] p-4 text-sm leading-6 text-[var(--text-muted)]">
              <input type="checkbox" checked={accepted} onChange={(event) => setAccepted(event.target.checked)} className="mt-1 h-4 w-4 shrink-0 accent-[var(--accent)]" />
              {t.terms}
            </label>

            <button disabled={submitting || !configured} className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[var(--accent)] px-5 py-4 font-semibold text-[var(--accent-foreground)] disabled:cursor-not-allowed disabled:opacity-60">
              {submitting ? (
                <>
                  <LoaderCircle size={18} className="animate-spin" />
                  {t.submitting}
                </>
              ) : (
                <>
                  {t.submit}
                  <ArrowRight size={18} />
                </>
              )}
            </button>

            <div className="flex flex-col gap-3 pt-2 sm:flex-row">
              <a href={APK_DOWNLOAD_URL} target="_blank" rel="noreferrer" className="inline-flex items-center justify-center gap-2 rounded-2xl border border-[var(--border)] bg-white px-4 py-3 text-sm font-semibold">
                <Smartphone size={16} />
                {t.download}
              </a>
              <Link href="/login" className="inline-flex items-center justify-center rounded-2xl border border-[var(--border)] bg-white px-4 py-3 text-sm font-semibold">
                {t.loginAfter}
              </Link>
            </div>
          </form>
        </div>
      </section>

      <footer className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-5 py-8 text-sm text-[var(--text-muted)] lg:flex-row lg:px-8">
        <p>APEX COACH coach access</p>
        <div className="flex flex-wrap items-center justify-center gap-4">
          <Link href="/legal/privacy">Privacy</Link>
          <Link href="/legal/terms">Terms</Link>
          <CookieSettingsButton>Cookie settings</CookieSettingsButton>
        </div>
      </footer>
    </main>
  );
}
