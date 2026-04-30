import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, Check, Clock3, Menu, Smartphone, Sparkles, Users, X } from "lucide-react";

import { trackEvent } from "./lib/analytics";
import { COACH_LANGUAGE_OPTIONS, applyCoachLocale, getInitialBrowserLocale } from "./lib/coach-locale";
import CookieSettingsButton from "./components/CookieSettingsButton";

const screenshots = ["/screenshot_1.jpeg", "/screenshot_2.jpeg", "/screenshot_3.jpeg"];

const copy = {
  pt: {
    navProduct: "Produto",
    navFlow: "Fluxo",
    navPilot: "Piloto",
    navFaq: "FAQ",
    badge: "App mobile para coaches em fase piloto.",
    titleA: "A APEX COACH",
    titleB: "esta focada",
    titleC: "na app.",
    subtitle:
      "Nesta fase queremos uma entrada simples e forte para os coaches piloto. A prioridade e usar a app no terreno, limpar a logica do software e recolher o feedback certo para evoluir a experiencia.",
    primaryCta: "Download APK",
    secondaryCta: "Aceder ao piloto",
    trust1: "Feita para o terreno",
    trust2: "Feedback real de coaches",
    trust3: "Melhorias antes da fase web",
    heroTag: "App no terreno",
    heroTitle: "Rapidez para orientar, registar e decidir no momento.",
    heroText:
      "Abrir a sessao, ajustar cargas, rever historico, registar notas e continuar o treino sem perder ritmo.",
    sectionProduct: "Produto",
    productTitle: "Uma app pensada para o contexto real do coach.",
    productText:
      "A fase atual da APEX COACH e totalmente dedicada a melhorar a experiencia mobile. O objetivo e reduzir friccao, acelerar o trabalho diario e preparar a proxima evolucao com base em uso real.",
    featureTitle: "O que ja queremos validar com os coaches piloto",
    features: [
      "Agenda e organizacao das sessoes no terreno",
      "Registo rapido de cargas, notas e contexto",
      "Leitura mais clara do historico de cada aluno",
      "Fluxo mais intuitivo entre clients, trainings e assessments",
      "Menos passos para as acoes mais repetidas do dia a dia",
      "Mais consistencia geral antes do segundo passo web",
    ],
    flowTag: "Fluxo do coach",
    flowTitle: "O piloto serve para limpar a logica do software.",
    flowCards: [
      { title: "Entrar e agir", text: "Queremos que o coach abra a app e chegue ao que precisa em segundos." },
      { title: "Registar no momento", text: "As acoes de sessao devem ser rapidas, naturais e sem campos a mais." },
      { title: "Ajustar com feedback real", text: "Cada coach piloto ajuda-nos a perceber o que cortar, o que simplificar e o que reforcar." },
    ],
    pilotTag: "Programa piloto",
    pilotTitle: "Partilha esta landing com coaches piloto.",
    pilotText:
      "A mensagem nesta fase deve ser direta: entrar, testar a app, usar no terreno e dizer-nos onde a experiencia ainda esta pesada, confusa ou lenta.",
    pilotPoints: ["Download direto da APK", "Criacao de conta simples", "Login para coaches piloto", "Canal claro para recolher melhorias necessarias"],
    faqTag: "FAQ",
    faqTitle: "O que estamos a fazer agora",
    faqItems: [
      { title: "Porque estamos a focar a app primeiro?", text: "Porque o objetivo imediato e estabilizar a logica principal do produto com utilizacao real no terreno." },
      { title: "A versao web vai existir?", text: "Sim, mas num segundo passo. Primeiro queremos garantir que a experiencia core esta limpa e funcional." },
      { title: "Quem deve usar esta fase piloto?", text: "Coaches que ja estao dispostos a usar a app no dia a dia e a dar feedback pratico e objetivo." },
    ],
    closingTitle: "Vamos usar esta fase para melhorar a app a serio.",
    closingText:
      "Partilha com os coaches piloto certos, recolhe feedback util e ajuda-nos a preparar as melhorias mais importantes antes do proximo salto do produto.",
    closingPrimary: "Entrar no piloto",
    closingSecondary: "Download da app",
    modalTitle: "Convite para coach piloto",
    modalText:
      "Nesta fase queremos coaches que usem a app com regularidade e nos digam, sem filtro, onde a experiencia ainda precisa de ser simplificada.",
    modalPrimary: "Criar conta",
    modalSecondary: "Fazer login",
    closeLabel: "Fechar",
    login: "Login",
    signup: "Criar conta",
    backline: "A experiencia web ficara para um segundo passo.",
  },
  en: {
    navProduct: "Product",
    navFlow: "Flow",
    navPilot: "Pilot",
    navFaq: "FAQ",
    badge: "Mobile app for coaches in pilot phase.",
    titleA: "APEX COACH",
    titleB: "is focused",
    titleC: "on the app.",
    subtitle:
      "At this stage we want a simple and strong front door for pilot coaches. The priority is using the app in the field, cleaning the software logic, and gathering the right feedback to improve the experience.",
    primaryCta: "Download APK",
    secondaryCta: "Join the pilot",
    trust1: "Built for the field",
    trust2: "Real coach feedback",
    trust3: "Improvements before web phase",
    heroTag: "Field app",
    heroTitle: "Speed to coach, log, and decide in the moment.",
    heroText:
      "Open the session, adjust loads, review history, capture notes, and keep the training moving without losing momentum.",
    sectionProduct: "Product",
    productTitle: "An app built for the coach's real working context.",
    productText:
      "The current APEX COACH phase is fully dedicated to improving the mobile experience. The goal is to reduce friction, speed up daily work, and prepare the next evolution based on real usage.",
    featureTitle: "What we want to validate with pilot coaches",
    features: [
      "Agenda and session organization in the field",
      "Fast logging of loads, notes, and context",
      "Clearer reading of each client's history",
      "More intuitive flow between clients, trainings, and assessments",
      "Fewer steps for the most repeated daily actions",
      "Better overall consistency before the second web step",
    ],
    flowTag: "Coach flow",
    flowTitle: "The pilot exists to clean up the software logic.",
    flowCards: [
      { title: "Open and act", text: "We want the coach to open the app and reach the right action in seconds." },
      { title: "Log in the moment", text: "Session actions should feel fast, natural, and free from unnecessary fields." },
      { title: "Improve with real feedback", text: "Each pilot coach helps us understand what to remove, simplify, and strengthen." },
    ],
    pilotTag: "Pilot program",
    pilotTitle: "Share this landing with pilot coaches.",
    pilotText:
      "The message at this stage should be direct: enter, test the app, use it in the field, and tell us where the experience is still heavy, confusing, or slow.",
    pilotPoints: ["Direct APK download", "Simple account creation", "Login for pilot coaches", "A clear path for necessary improvements"],
    faqTag: "FAQ",
    faqTitle: "What we are doing right now",
    faqItems: [
      { title: "Why are we focusing on the app first?", text: "Because the immediate goal is to stabilize the core product logic through real field usage." },
      { title: "Will the web version exist?", text: "Yes, but in a second step. First we want the core experience to feel clean and functional." },
      { title: "Who should use this pilot phase?", text: "Coaches willing to use the app in daily work and give practical, direct feedback." },
    ],
    closingTitle: "We are using this phase to improve the app for real.",
    closingText:
      "Share it with the right pilot coaches, collect useful feedback, and help us prepare the most important improvements before the next product step.",
    closingPrimary: "Join the pilot",
    closingSecondary: "Download the app",
    modalTitle: "Pilot coach invite",
    modalText:
      "At this stage we want coaches who will use the app regularly and tell us, directly, where the experience still needs simplification.",
    modalPrimary: "Create account",
    modalSecondary: "Login",
    closeLabel: "Close",
    login: "Login",
    signup: "Sign up",
    backline: "The web experience will come in a second step.",
  },
};

function SectionLabel({ children }) {
  return <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[var(--accent)]">{children}</p>;
}

function Chip({ children }) {
  return <div className="rounded-full border border-[var(--border)] bg-white px-4 py-2 text-sm text-[var(--text-muted)]">{children}</div>;
}

function FlowCard({ step, title, text }) {
  return (
    <div className="rounded-[28px] border border-[var(--border)] bg-[var(--surface-solid)] p-6 shadow-[var(--shadow-soft)]">
      <div className="mb-5 inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-[var(--accent)]/25 bg-[var(--accent-soft)] text-sm font-semibold text-[var(--accent-strong)]">
        {step}
      </div>
      <h3 className="text-2xl font-semibold text-[var(--text)]">{title}</h3>
      <p className="mt-4 text-base leading-8 text-[var(--text-muted)]">{text}</p>
    </div>
  );
}

function FeatureItem({ children }) {
  return (
    <div className="flex items-start gap-3 rounded-2xl border border-[var(--border)] bg-[var(--surface-solid)] px-4 py-3 shadow-[0_8px_24px_rgba(14,17,16,0.04)]">
      <div className="mt-0.5 flex h-6 w-6 items-center justify-center rounded-full bg-[var(--accent-soft)]">
        <Check size={14} className="text-[var(--accent-strong)]" />
      </div>
      <p className="text-[var(--text-muted)]">{children}</p>
    </div>
  );
}

function PhoneMock({ src }) {
  return (
    <div className="mx-auto w-[290px] rounded-[38px] border border-[var(--border-strong)] bg-[#111413] p-2.5 shadow-[var(--shadow-panel)]">
      <div className="relative overflow-hidden rounded-[30px] border border-white/10 bg-black">
        <div className="absolute left-1/2 top-3 z-10 h-5 w-28 -translate-x-1/2 rounded-full bg-black" />
        <img src={src} alt="APEX COACH app preview" className="h-[590px] w-full object-cover object-top" />
      </div>
    </div>
  );
}

function Modal({ open, onClose, title, text, copy }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[rgba(14,17,16,0.18)] p-4 backdrop-blur-md">
      <div className="relative w-full max-w-xl rounded-[32px] border border-[var(--border-strong)] bg-[var(--surface-solid)] p-8 text-[var(--text)] shadow-[var(--shadow-panel)]">
        <button onClick={onClose} className="absolute right-4 top-4 flex h-11 w-11 items-center justify-center rounded-full border border-[var(--border)] bg-[var(--surface-muted)] text-[var(--text-muted)] transition hover:bg-white hover:text-[var(--text)]" aria-label={copy.closeLabel}>
          <X size={18} />
        </button>
        <div className="mb-5 inline-flex rounded-full border border-[var(--accent)]/25 bg-[var(--accent-soft)] px-4 py-2 text-sm font-semibold text-[var(--accent-strong)]">
          APEX COACH
        </div>
        <h3 className="max-w-lg text-3xl font-semibold leading-tight">{title}</h3>
        <p className="mt-5 text-lg leading-8 text-[var(--text-muted)]">{text}</p>
        <div className="mt-8 grid gap-3 sm:grid-cols-2">
          <Link href="/signup" onClick={() => trackEvent("landing_modal_signup_click")} className="rounded-2xl bg-[var(--accent)] px-5 py-3.5 text-center font-semibold text-[var(--accent-foreground)] shadow-[0_18px_40px_rgba(42,208,125,0.24)]">
            {copy.modalPrimary}
          </Link>
          <Link href="/login" onClick={() => trackEvent("landing_modal_login_click")} className="rounded-2xl border border-[var(--border)] bg-[var(--surface-muted)] px-5 py-3.5 text-center font-semibold text-[var(--text)]">
            {copy.modalSecondary}
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const [lang, setLang] = useState("en");
  const [activeShot, setActiveShot] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  const t = copy[lang] || copy.en;

  useEffect(() => {
    const nextLocale = getInitialBrowserLocale();
    const resolved = nextLocale in copy ? nextLocale : "en";
    setLang(resolved);
    applyCoachLocale(resolved);
    trackEvent("landing_view", { locale: resolved });

    const interval = window.setInterval(() => {
      setActiveShot((current) => (current + 1) % screenshots.length);
    }, 3200);

    return () => window.clearInterval(interval);
  }, []);

  const navItems = [
    { id: "product", label: t.navProduct },
    { id: "flow", label: t.navFlow },
    { id: "pilot", label: t.navPilot },
    { id: "faq", label: t.navFaq },
  ];

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text)]">
      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={t.modalTitle} text={t.modalText} copy={t} />

      <div className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,rgba(42,208,125,0.16),transparent_28%),radial-gradient(circle_at_top_right,rgba(124,77,255,0.08),transparent_20%),linear-gradient(180deg,#fbfbfb_0%,#f5f5f5_48%,#f2f4f3_100%)]" />
      <div className="pointer-events-none fixed inset-x-0 top-0 -z-10 h-[420px] bg-[linear-gradient(180deg,rgba(255,255,255,0.65),transparent)]" />

      <header className="sticky top-0 z-50 border-b border-[var(--border)] bg-[rgba(255,255,255,0.78)] backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 lg:px-8">
          <a href="#top" className="flex items-center gap-4">
            <img src="/logo.png" alt="APEX COACH" className="h-10 w-auto rounded-xl" />
            <div>
              <p className="text-sm font-semibold tracking-[0.18em] text-[var(--text)]">APEX COACH</p>
              <p className="text-xs uppercase tracking-[0.22em] text-[var(--text-muted)]">pilot app</p>
            </div>
          </a>

          <nav className="hidden items-center gap-2 lg:flex">
            {navItems.map((item) => (
              <a key={item.id} href={`#${item.id}`} className="rounded-full px-4 py-2 text-sm text-[var(--text-muted)] transition hover:bg-white hover:text-[var(--text)]">
                {item.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <div className="hidden rounded-full border border-[var(--border)] bg-[var(--surface-muted)] p-1 sm:flex">
              {COACH_LANGUAGE_OPTIONS.filter((option) => option.value === "en" || option.value === "pt").map((option) => (
                <button
                  key={option.value}
                  onClick={() => {
                    setLang(option.value);
                    applyCoachLocale(option.value);
                  }}
                  className={`rounded-full px-3 py-1.5 text-xs font-semibold transition ${lang === option.value ? "bg-[var(--accent)] text-[var(--accent-foreground)]" : "text-[var(--text-muted)]"}`}
                >
                  {option.short}
                </button>
              ))}
            </div>

            <div className="hidden items-center gap-3 lg:flex">
              <Link href="/login" onClick={() => trackEvent("landing_header_login_click", { locale: lang })} className="rounded-full border border-[var(--border)] bg-[var(--surface-solid)] px-5 py-3 text-sm font-semibold text-[var(--text)]">
                {t.login}
              </Link>
              <a href="/download/apk" onClick={() => trackEvent("landing_header_apk_click", { locale: lang })} className="rounded-full bg-[var(--accent)] px-5 py-3 text-sm font-semibold text-[var(--accent-foreground)] shadow-[0_12px_40px_rgba(42,208,125,0.24)]">
                {t.primaryCta}
              </a>
            </div>

            <button onClick={() => setMobileMenuOpen((current) => !current)} className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-[var(--border)] bg-[var(--surface-muted)] text-[var(--text)] lg:hidden" aria-label="Toggle navigation">
              <Menu size={18} />
            </button>
          </div>
        </div>

        {mobileMenuOpen ? (
          <div className="border-t border-[var(--border)] px-5 py-4 lg:hidden">
            <div className="flex flex-col gap-2">
              {navItems.map((item) => (
                <a key={item.id} href={`#${item.id}`} onClick={() => setMobileMenuOpen(false)} className="rounded-2xl border border-[var(--border)] bg-[var(--surface-solid)] px-4 py-3 text-[var(--text-muted)]">
                  {item.label}
                </a>
              ))}
              <Link href="/login" onClick={() => setMobileMenuOpen(false)} className="rounded-2xl border border-[var(--border)] bg-[var(--surface-solid)] px-4 py-3 text-center text-sm font-semibold text-[var(--text)]">
                {t.login}
              </Link>
              <a href="/download/apk" onClick={() => setMobileMenuOpen(false)} className="rounded-2xl bg-[var(--accent)] px-4 py-3 text-center text-sm font-semibold text-[var(--accent-foreground)]">
                {t.primaryCta}
              </a>
            </div>
          </div>
        ) : null}
      </header>

      <main id="top">
        <section className="mx-auto grid max-w-7xl gap-14 px-5 pb-20 pt-16 lg:grid-cols-[1.05fr_0.95fr] lg:px-8 lg:pb-28 lg:pt-24">
          <div className="max-w-3xl">
            <div className="inline-flex rounded-full border border-[var(--accent)]/20 bg-[linear-gradient(135deg,var(--accent-soft),rgba(124,77,255,0.08))] px-4 py-2 text-sm font-medium text-[var(--accent-strong)]">
              {t.badge}
            </div>
            <h1 className="mt-8 text-5xl font-semibold leading-[1.02] text-[var(--text)] sm:text-6xl xl:text-7xl">
              <span className="block">{t.titleA}</span>
              <span className="block text-[var(--text)]">{t.titleB}</span>
              <span className="block bg-[linear-gradient(90deg,var(--accent-strong),var(--electric))] bg-clip-text text-transparent">{t.titleC}</span>
            </h1>
            <p className="mt-7 max-w-2xl text-lg leading-8 text-[var(--text-muted)] sm:text-xl">{t.subtitle}</p>

            <div className="mt-10 flex flex-col gap-4 sm:flex-row">
              <a href="/download/apk" onClick={() => trackEvent("landing_hero_apk_click", { locale: lang })} className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[var(--accent)] px-6 py-4 text-base font-semibold text-[var(--accent-foreground)] shadow-[0_18px_60px_rgba(42,208,125,0.24)]">
                {t.primaryCta}
                <ArrowRight size={18} />
              </a>
              <button onClick={() => setModalOpen(true)} className="inline-flex items-center justify-center rounded-2xl border border-[var(--border)] bg-[var(--surface-solid)] px-6 py-4 text-base font-semibold text-[var(--text)]">
                {t.secondaryCta}
              </button>
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              <Chip>{t.trust1}</Chip>
              <Chip>{t.trust2}</Chip>
              <Chip>{t.trust3}</Chip>
            </div>

            <div className="mt-12 rounded-[28px] border border-[var(--border)] bg-[var(--surface-solid)] p-5 shadow-[var(--shadow-soft)]">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,var(--accent-soft),rgba(124,77,255,0.08))]">
                <Smartphone size={22} className="text-[var(--accent-strong)]" />
              </div>
              <p className="text-sm uppercase tracking-[0.2em] text-[var(--text-muted)]">{t.heroTag}</p>
              <h2 className="mt-2 text-xl font-semibold text-[var(--text)]">{t.heroTitle}</h2>
              <p className="mt-3 leading-7 text-[var(--text-muted)]">{t.heroText}</p>
              <p className="mt-4 text-sm font-medium text-[var(--accent-strong)]">{t.backline}</p>
            </div>
          </div>

          <div className="relative flex items-center justify-center">
            <div className="absolute left-[10%] top-[5%] h-32 w-32 rounded-full bg-[var(--accent)]/20 blur-3xl" />
            <div className="absolute bottom-[12%] right-[8%] h-40 w-40 rounded-full bg-sky-400/15 blur-3xl" />
            <PhoneMock src={screenshots[activeShot]} />
            <div className="absolute -left-2 top-8 z-20 hidden rounded-3xl border border-[var(--border)] bg-[rgba(255,255,255,0.88)] px-4 py-3 shadow-[var(--shadow-soft)] md:block">
              <div className="flex items-center gap-3">
                <Clock3 size={16} className="text-[var(--accent-strong)]" />
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-[var(--text-muted)]">Session mode</p>
                  <p className="text-sm font-medium text-[var(--text)]">Fast changes, zero friction</p>
                </div>
              </div>
            </div>
            <div className="absolute -right-2 bottom-10 z-20 hidden rounded-3xl border border-[var(--border)] bg-[rgba(255,255,255,0.88)] px-4 py-3 shadow-[var(--shadow-soft)] md:block">
              <div className="flex items-center gap-3">
                <Users size={16} className="text-[var(--electric)]" />
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-[var(--text-muted)]">Pilot feedback</p>
                  <p className="text-sm font-medium text-[var(--text)]">Improve the core logic first</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="product" className="mx-auto max-w-7xl px-5 py-20 lg:px-8">
          <SectionLabel>{t.sectionProduct}</SectionLabel>
          <div className="mt-5 grid gap-8 lg:grid-cols-[0.92fr_1.08fr]">
            <div>
              <h2 className="max-w-2xl text-4xl font-semibold leading-tight text-[var(--text)] sm:text-5xl">{t.productTitle}</h2>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-[var(--text-muted)]">{t.productText}</p>
            </div>
            <div>
              <h3 className="mb-4 text-xl font-semibold text-[var(--text)]">{t.featureTitle}</h3>
              <div className="grid gap-3 sm:grid-cols-2">
                {t.features.map((item) => (
                  <FeatureItem key={item}>{item}</FeatureItem>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section id="flow" className="mx-auto max-w-7xl px-5 py-20 lg:px-8">
          <SectionLabel>{t.flowTag}</SectionLabel>
          <h2 className="mt-5 max-w-3xl text-4xl font-semibold leading-tight text-[var(--text)] sm:text-5xl">{t.flowTitle}</h2>
          <div className="mt-10 grid gap-5 lg:grid-cols-3">
            {t.flowCards.map((card, index) => (
              <FlowCard key={card.title} step={`0${index + 1}`} title={card.title} text={card.text} />
            ))}
          </div>
        </section>

        <section id="pilot" className="mx-auto max-w-7xl px-5 py-20 lg:px-8">
          <div className="rounded-[36px] border border-[var(--border-strong)] bg-[linear-gradient(135deg,rgba(42,208,125,0.10),rgba(124,77,255,0.05),rgba(255,255,255,0.95))] p-8 shadow-[var(--shadow-panel)] lg:p-12">
            <SectionLabel>{t.pilotTag}</SectionLabel>
            <div className="mt-5 grid gap-8 lg:grid-cols-[1fr_0.9fr]">
              <div>
                <h2 className="text-4xl font-semibold leading-tight text-[var(--text)] sm:text-5xl">{t.pilotTitle}</h2>
                <p className="mt-6 max-w-2xl text-lg leading-8 text-[var(--text-muted)]">{t.pilotText}</p>
                <div className="mt-8 flex flex-col gap-4 sm:flex-row">
                  <a href="/download/apk" className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[var(--accent)] px-6 py-4 font-semibold text-[var(--accent-foreground)]">
                    {t.primaryCta}
                    <ArrowRight size={18} />
                  </a>
                  <Link href="/signup" className="inline-flex items-center justify-center rounded-2xl border border-[var(--border)] bg-white px-6 py-4 font-semibold text-[var(--text)]">
                    {t.signup}
                  </Link>
                </div>
              </div>

              <div className="grid gap-3">
                {t.pilotPoints.map((item) => (
                  <FeatureItem key={item}>{item}</FeatureItem>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section id="faq" className="mx-auto max-w-7xl px-5 py-20 lg:px-8">
          <SectionLabel>{t.faqTag}</SectionLabel>
          <h2 className="mt-5 max-w-3xl text-4xl font-semibold leading-tight text-[var(--text)] sm:text-5xl">{t.faqTitle}</h2>
          <div className="mt-10 grid gap-4">
            {t.faqItems.map((item) => (
              <div key={item.title} className="rounded-[28px] border border-[var(--border)] bg-[var(--surface-solid)] p-6 shadow-[var(--shadow-soft)]">
                <h3 className="text-xl font-semibold text-[var(--text)]">{item.title}</h3>
                <p className="mt-3 max-w-4xl text-base leading-8 text-[var(--text-muted)]">{item.text}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-5 pb-24 pt-8 lg:px-8">
          <div className="rounded-[40px] border border-[var(--border-strong)] bg-[linear-gradient(180deg,rgba(255,255,255,0.96),rgba(245,245,245,0.92))] px-6 py-14 text-center shadow-[var(--shadow-panel)] sm:px-10">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-[24px] bg-[linear-gradient(135deg,var(--accent-soft),rgba(124,77,255,0.1))]">
              <Sparkles size={28} className="text-[var(--electric)]" />
            </div>
            <h2 className="mt-6 text-4xl font-semibold tracking-tight text-[var(--text)] sm:text-5xl">{t.closingTitle}</h2>
            <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-[var(--text-muted)]">{t.closingText}</p>
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link href="/signup" className="rounded-2xl bg-[var(--accent)] px-6 py-4 font-semibold text-[var(--accent-foreground)] shadow-[0_18px_40px_rgba(42,208,125,0.24)]">
                {t.closingPrimary}
              </Link>
              <a href="/download/apk" className="rounded-2xl border border-[var(--border)] bg-white px-6 py-4 font-semibold text-[var(--text)]">
                {t.closingSecondary}
              </a>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-[var(--border)]">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 px-5 py-8 text-sm text-[var(--text-muted)] lg:flex-row lg:px-8">
          <div className="flex items-center gap-3">
            <img src="/logo.png" alt="APEX COACH" className="h-8 w-auto rounded-lg" />
            <div>
              <p className="font-medium text-[var(--text)]">APEX COACH</p>
              <p className="text-xs uppercase tracking-[0.18em] text-[var(--text-muted)]">pilot app landing</p>
            </div>
          </div>

          <p className="text-center text-xs uppercase tracking-[0.18em] text-[var(--text-muted)]">App first. Pilot feedback now. Web later.</p>

          <div className="flex flex-wrap items-center justify-center gap-4 text-sm">
            <Link href="/legal/privacy" className="hover:text-[var(--text)]">Privacy</Link>
            <Link href="/legal/cookies" className="hover:text-[var(--text)]">Cookies</Link>
            <Link href="/legal/terms" className="hover:text-[var(--text)]">Terms</Link>
            <Link href="/legal/consumer" className="hover:text-[var(--text)]">Consumer info</Link>
            <CookieSettingsButton className="hover:text-[var(--text)]">Cookie settings</CookieSettingsButton>
          </div>
        </div>
      </footer>
    </div>
  );
}
