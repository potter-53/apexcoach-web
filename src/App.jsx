import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Check,
  Clock3,
  Laptop2,
  LayoutDashboard,
  Menu,
  MonitorPlay,
  Smartphone,
  Sparkles,
  X,
} from "lucide-react";

const screenshots = [
  "/screenshot_1.jpeg",
  "/screenshot_2.jpeg",
  "/screenshot_3.jpeg",
];

const copy = {
  pt: {
    navPlatform: "Plataforma",
    navFlow: "Fluxo",
    navBrowser: "Browser",
    navPlans: "Planos",
    navCta: "Pedir acesso",
    badge: "Mobile-first no terreno. Complemento web premium para o coach.",
    titleA: "A app nasceu para o terreno.",
    titleB: "Agora ganha",
    titleC: "um complemento web premium.",
    subtitle:
      "A APEX COACH continua focada na rapidez da .apk durante o trabalho no terreno. O novo browser entra como extensão premium para o coach organizar melhor a operação, visualizar mais informação e trabalhar com mais conforto num ecrã grande.",
    primaryCta: "Quero lançar apexcoach.pt",
    secondaryCta: "Ver experiência",
    trust1: "Mesma conta",
    trust2: "Mesmo workflow",
    trust3: "App + complemento web",
    heroMobileTag: "No telemóvel",
    heroMobileTitle: "Pronto para orientar em segundos",
    heroMobileText:
      "Abrir a sessão, ajustar carga, registar notas e seguir para o próximo atleta sem perder ritmo.",
    heroBrowserTag: "No browser",
    heroBrowserTitle: "Mais espaço para decidir melhor",
    heroBrowserText:
      "Agenda, planeamento, avaliações, reports e gestão de clientes lado a lado para trabalhar com mais visão.",
    sectionPlatform: "Porque isto faz sentido",
    platformTitle: "A base continua a ser a app. O browser eleva a experiência.",
    platformText:
      "O produto começou mobile-first para responder ao contexto real de sessão. O complemento web entra para dar mais profundidade, mais organização e uma perceção ainda mais premium ao trabalho do coach.",
    phoneCardTitle: "APK para ação imediata",
    phoneCardText:
      "Ideal para sessões presenciais, ajustes rápidos, consulta de histórico e registo live.",
    browserCardTitle: "Browser para profundidade",
    browserCardText:
      "Ideal para blocos de treino, análise de progresso, organização da semana e gestão com mais informação visível.",
    flowTag: "Fluxo do coach",
    flowTitle: "Uma experiência pensada para o dia real.",
    flowCards: [
      {
        title: "Antes da sessão",
        text: "No browser, o coach organiza a semana, revê a agenda, prepara o treino e confirma prioridades.",
      },
      {
        title: "Durante a sessão",
        text: "Na .apk, entra direto no essencial: sessão, notas, cargas, PSE e decisões rápidas no momento.",
      },
      {
        title: "Depois da sessão",
        text: "No formato que for mais prático, fecha registos, acompanha progresso e mantém o follow-up sem fricção.",
      },
    ],
    browserTag: "Modo browser",
    browserTitle: "O web não substitui a app. Valoriza-a.",
    browserText:
      "A homepage de apexcoach.pt deve mostrar que o browser é o complemento premium da experiência mobile. A app resolve o momento da sessão. O web resolve planeamento, gestão e leitura mais ampla da operação.",
    browserPoints: [
      "Mais informação visível por cliente",
      "Planeamento e análise lado a lado",
      "Melhor experiência para ecrãs grandes",
      "Continuidade total com a conta da app",
    ],
    featureTag: "O que o coach ganha",
    featureTitle: "Rapidez no terreno. Mais estatuto e controlo fora dele.",
    features: [
      "Abrir e trabalhar na app em contexto de sessão",
      "Continuar no browser sem reaprender nada",
      "Centralizar clientes, avaliações, treino e reports",
      "Reduzir trabalho manual e follow-up disperso",
      "Escalar a operação sem perder simplicidade",
      "Passar uma imagem mais premium e mais profissional",
    ],
    plansTag: "Posicionamento",
    plansTitle: "A mensagem certa para apexcoach.pt",
    plansText:
      "A promessa da marca deve ser simples: a app continua a ser a ferramenta rápida do terreno, e o browser é o upgrade premium para gerir melhor, ver mais e trabalhar com mais clareza.",
    closingTitle: "Sim, conseguimos.",
    closingText:
      "E faz todo o sentido. A próxima etapa é posicionar a app como núcleo do produto e apresentar o web como o complemento premium que eleva a experiência do coach.",
    closingPrimary: "Continuar a construção",
    closingSecondary: "Ajustar copy e oferta",
    modalTitle: "Próximo passo recomendado",
    modalText:
      "Fechar a homepage de apexcoach.pt primeiro, depois ligar os CTAs ao trial, login web e download da app para criar uma entrada única e clara no produto.",
  },
  en: {
    navPlatform: "Platform",
    navFlow: "Flow",
    navBrowser: "Browser",
    navPlans: "Positioning",
    navCta: "Request access",
    badge: "Mobile-first in the field. Premium web companion for the coach.",
    titleA: "The app was born for the field.",
    titleB: "Now it gains",
    titleC: "a premium web companion.",
    subtitle:
      "APEX COACH stays focused on speed inside the .apk while coaching in the field. The browser now enters as a premium extension for organizing the operation, seeing more information, and working more comfortably on a larger screen.",
    primaryCta: "Launch apexcoach.pt",
    secondaryCta: "See the experience",
    trust1: "Same account",
    trust2: "Same workflow",
    trust3: "App + web companion",
    heroMobileTag: "On mobile",
    heroMobileTitle: "Ready to coach in seconds",
    heroMobileText:
      "Open the session, adjust load, register notes, and move to the next athlete without losing momentum.",
    heroBrowserTag: "In browser",
    heroBrowserTitle: "More space to make better decisions",
    heroBrowserText:
      "Agenda, planning, assessments, reports, and client management side by side for a clearer way to work.",
    sectionPlatform: "Why this works",
    platformTitle: "The app remains the core. The browser elevates the experience.",
    platformText:
      "The product started mobile-first to serve the real session environment. The web companion adds depth, organization, and a more premium perception to the coach workflow.",
    phoneCardTitle: "APK for immediate action",
    phoneCardText:
      "Perfect for live sessions, quick edits, history lookup, and real-time coaching decisions.",
    browserCardTitle: "Browser for deeper work",
    browserCardText:
      "Perfect for training blocks, progress analysis, weekly organization, and management with more visible information.",
    flowTag: "Coach flow",
    flowTitle: "An experience built for the real working day.",
    flowCards: [
      {
        title: "Before the session",
        text: "In the browser, the coach organizes the week, reviews the agenda, prepares training, and confirms priorities.",
      },
      {
        title: "During the session",
        text: "In the .apk, the coach goes straight to what matters: session data, notes, loads, RPE, and fast decisions.",
      },
      {
        title: "After the session",
        text: "In whichever format feels best, wrap up logs, review progress, and keep follow-up moving without friction.",
      },
    ],
    browserTag: "Browser mode",
    browserTitle: "The web does not replace the app. It upgrades it.",
    browserText:
      "The apexcoach.pt homepage should show the browser as the premium companion to the mobile experience. The app handles the live session. The web handles planning, management, and wider operational visibility.",
    browserPoints: [
      "More client information visible at once",
      "Planning and analysis side by side",
      "A better experience for larger screens",
      "Full continuity with the app account",
    ],
    featureTag: "What the coach gets",
    featureTitle: "Speed in the field. More status and control outside it.",
    features: [
      "Open and work in the app during sessions",
      "Continue in the browser without relearning anything",
      "Centralize clients, assessments, training, and reports",
      "Reduce manual work and scattered follow-up",
      "Scale the operation without losing simplicity",
      "Deliver a more premium and professional experience",
    ],
    plansTag: "Positioning",
    plansTitle: "The right message for apexcoach.pt",
    plansText:
      "The promise should be simple: the app remains the fast field tool, while the browser becomes the premium upgrade for better management, better visibility, and clearer work.",
    closingTitle: "Yes, we can build this.",
    closingText:
      "And it makes real sense. The next step is positioning the app as the core product and presenting the web as the premium companion that elevates the coach experience.",
    closingPrimary: "Continue building",
    closingSecondary: "Refine copy and offer",
    modalTitle: "Recommended next step",
    modalText:
      "Lock the apexcoach.pt homepage first, then connect CTAs to the trial, web login, and app download so the product has one clear front door.",
  },
};

function SectionLabel({ children }) {
  return (
    <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[var(--accent)]">
      {children}
    </p>
  );
}

function Chip({ children }) {
  return (
    <div className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/72">
      {children}
    </div>
  );
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

function PhoneMock({ src, alt }) {
  return (
    <div className="mx-auto w-[280px] rounded-[38px] border border-[var(--border-strong)] bg-[#111413] p-2.5 shadow-[var(--shadow-panel)]">
      <div className="relative overflow-hidden rounded-[30px] border border-white/10 bg-black">
        <div className="absolute left-1/2 top-3 z-10 h-5 w-28 -translate-x-1/2 rounded-full bg-black" />
        <img src={src} alt={alt} className="h-[570px] w-full object-cover object-top" />
      </div>
    </div>
  );
}

function BrowserMock({ src, title }) {
  return (
    <div className="overflow-hidden rounded-[30px] border border-[var(--border-strong)] bg-[var(--surface-solid)] shadow-[var(--shadow-panel)]">
      <div className="flex items-center gap-2 border-b border-[var(--border)] bg-[var(--surface-muted)] px-5 py-4">
        <span className="h-3 w-3 rounded-full bg-[#ff7a68]" />
        <span className="h-3 w-3 rounded-full bg-[#f6c250]" />
        <span className="h-3 w-3 rounded-full bg-[#54d27a]" />
        <div className="ml-3 rounded-full border border-[var(--border)] bg-white px-4 py-1 text-xs text-[var(--text-muted)]">
          {title}
        </div>
      </div>

      <div className="grid gap-0 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="border-b border-[var(--border)] lg:border-b-0 lg:border-r">
          <img src={src} alt={title} className="h-[340px] w-full object-cover object-top" />
        </div>
        <div className="flex flex-col gap-4 bg-[linear-gradient(180deg,rgba(255,255,255,0.92),rgba(245,245,245,0.92))] p-5">
          <div className="rounded-2xl border border-[var(--border)] bg-white p-4">
            <p className="text-xs uppercase tracking-[0.2em] text-[var(--text-muted)]">Workspace</p>
            <p className="mt-2 text-lg font-semibold text-[var(--text)]">Today&apos;s coaching board</p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-[var(--border)] bg-white p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-[var(--text-muted)]">Clients</p>
              <p className="mt-2 text-3xl font-semibold text-[var(--text)]">24</p>
            </div>
            <div className="rounded-2xl border border-[var(--border)] bg-white p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-[var(--text-muted)]">Sessions</p>
              <p className="mt-2 text-3xl font-semibold text-[var(--text)]">11</p>
            </div>
          </div>
          <div className="rounded-2xl border border-[var(--accent)]/20 bg-[linear-gradient(135deg,var(--accent-soft),rgba(124,77,255,0.08))] p-4">
            <p className="text-sm text-[var(--text-muted)]">
              Browser layout focused on planning, visibility, and faster admin work.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Modal({ open, onClose, title, text }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[rgba(14,17,16,0.18)] p-4 backdrop-blur-md">
      <div className="relative w-full max-w-xl rounded-[32px] border border-[var(--border-strong)] bg-[var(--surface-solid)] p-8 text-[var(--text)] shadow-[var(--shadow-panel)]">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 flex h-11 w-11 items-center justify-center rounded-full border border-[var(--border)] bg-[var(--surface-muted)] text-[var(--text-muted)] transition hover:bg-white hover:text-[var(--text)]"
          aria-label="Close"
        >
          <X size={18} />
        </button>
        <div className="mb-5 inline-flex rounded-full border border-[var(--accent)]/25 bg-[var(--accent-soft)] px-4 py-2 text-sm font-semibold text-[var(--accent-strong)]">
          APEX COACH
        </div>
        <h3 className="max-w-lg text-3xl font-semibold leading-tight">{title}</h3>
        <p className="mt-5 text-lg leading-8 text-[var(--text-muted)]">{text}</p>
        <div className="mt-8 grid gap-3 sm:grid-cols-2">
          <Link
            href="/login"
            className="rounded-2xl bg-[var(--accent)] px-5 py-3.5 text-center font-semibold text-[var(--accent-foreground)] shadow-[0_18px_40px_rgba(42,208,125,0.24)]"
          >
            Trial + login web
          </Link>
          <Link
            href="/app"
            className="rounded-2xl border border-[var(--border)] bg-[var(--surface-muted)] px-5 py-3.5 text-center font-semibold text-[var(--text)]"
          >
            Ver dashboard demo
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

  const t = copy[lang];
  const loginLabel = "Login";
  const signupLabel = lang === "pt" ? "Criar conta" : "Sign up";

  useEffect(() => {
    const storedLocale =
      typeof window !== "undefined" ? window.localStorage.getItem("apexcoach-locale") : null;

    if (storedLocale === "pt" || storedLocale === "es" || storedLocale === "fr" || storedLocale === "en") {
      setLang(storedLocale);
    }

    const interval = window.setInterval(() => {
      setActiveShot((current) => (current + 1) % screenshots.length);
    }, 3200);

    return () => window.clearInterval(interval);
  }, []);

  const navItems = [
    { id: "platform", label: t.navPlatform },
    { id: "flow", label: t.navFlow },
    { id: "browser", label: t.navBrowser },
    { id: "plans", label: t.navPlans },
  ];

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text)]">
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={t.modalTitle}
        text={t.modalText}
      />

      <div className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,rgba(42,208,125,0.16),transparent_28%),radial-gradient(circle_at_top_right,rgba(124,77,255,0.08),transparent_20%),linear-gradient(180deg,#fbfbfb_0%,#f5f5f5_48%,#f2f4f3_100%)]" />
      <div className="pointer-events-none fixed inset-x-0 top-0 -z-10 h-[420px] bg-[linear-gradient(180deg,rgba(255,255,255,0.65),transparent)]" />

      <header className="sticky top-0 z-50 border-b border-[var(--border)] bg-[rgba(255,255,255,0.78)] backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 lg:px-8">
          <a href="#top" className="flex items-center gap-4">
            <img src="/logo.png" alt="APEX COACH" className="h-10 w-auto rounded-xl" />
            <div>
              <p className="text-sm font-semibold tracking-[0.18em] text-[var(--text)]">APEX COACH</p>
              <p className="text-xs uppercase tracking-[0.22em] text-[var(--text-muted)]">apexcoach.pt</p>
            </div>
          </a>

          <nav className="hidden items-center gap-2 lg:flex">
            {navItems.map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                className="rounded-full px-4 py-2 text-sm text-[var(--text-muted)] transition hover:bg-white hover:text-[var(--text)]"
              >
                {item.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <div className="hidden rounded-full border border-[var(--border)] bg-[var(--surface-muted)] p-1 sm:flex">
              <button
                onClick={() => setLang("pt")}
                className={`rounded-full px-3 py-1.5 text-xs font-semibold transition ${
                  lang === "pt" ? "bg-[var(--accent)] text-[var(--accent-foreground)]" : "text-[var(--text-muted)]"
                }`}
              >
                PT
              </button>
              <button
                onClick={() => setLang("en")}
                className={`rounded-full px-3 py-1.5 text-xs font-semibold transition ${
                  lang === "en" ? "bg-[var(--accent)] text-[var(--accent-foreground)]" : "text-[var(--text-muted)]"
                }`}
              >
                EN
              </button>
            </div>

            <div className="hidden items-center gap-3 lg:flex">
              <Link
                href="/login"
                className="rounded-full border border-[var(--border)] bg-[var(--surface-solid)] px-5 py-3 text-sm font-semibold text-[var(--text)]"
              >
                {loginLabel}
              </Link>
              <Link
                href="/signup"
                className="rounded-full bg-[var(--accent)] px-5 py-3 text-sm font-semibold text-[var(--accent-foreground)] shadow-[0_12px_40px_rgba(42,208,125,0.24)]"
              >
                {signupLabel}
              </Link>
            </div>

            <button
              onClick={() => setMobileMenuOpen((current) => !current)}
              className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-[var(--border)] bg-[var(--surface-muted)] text-[var(--text)] lg:hidden"
              aria-label="Toggle navigation"
            >
              <Menu size={18} />
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="border-t border-[var(--border)] px-5 py-4 lg:hidden">
            <div className="flex flex-col gap-2">
              {navItems.map((item) => (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  onClick={() => setMobileMenuOpen(false)}
                  className="rounded-2xl border border-[var(--border)] bg-[var(--surface-solid)] px-4 py-3 text-[var(--text-muted)]"
                >
                  {item.label}
                </a>
              ))}
              <Link
                href="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="rounded-2xl border border-[var(--border)] bg-[var(--surface-solid)] px-4 py-3 text-center text-sm font-semibold text-[var(--text)]"
              >
                {loginLabel}
              </Link>
              <Link
                href="/signup"
                onClick={() => setMobileMenuOpen(false)}
                className="rounded-2xl bg-[var(--accent)] px-4 py-3 text-center text-sm font-semibold text-[var(--accent-foreground)]"
              >
                {signupLabel}
              </Link>
            </div>
          </div>
        )}
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

            <p className="mt-7 max-w-2xl text-lg leading-8 text-[var(--text-muted)] sm:text-xl">
              {t.subtitle}
            </p>

            <div className="mt-10 flex flex-col gap-4 sm:flex-row">
              <Link
                href="/signup"
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[var(--accent)] px-6 py-4 text-base font-semibold text-[var(--accent-foreground)] shadow-[0_18px_60px_rgba(42,208,125,0.24)]"
              >
                {signupLabel}
                <ArrowRight size={18} />
              </Link>
              <Link
                href="/login"
                className="inline-flex items-center justify-center rounded-2xl border border-[var(--border)] bg-[var(--surface-solid)] px-6 py-4 text-base font-semibold text-[var(--text)]"
              >
                {loginLabel}
              </Link>
              <a
                href="#browser"
                className="inline-flex items-center justify-center rounded-2xl border border-[var(--border)] bg-white px-6 py-4 text-base font-semibold text-[var(--text)]"
              >
                {t.secondaryCta}
              </a>
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              <Chip>{t.trust1}</Chip>
              <Chip>{t.trust2}</Chip>
              <Chip>{t.trust3}</Chip>
            </div>

            <div className="mt-12 grid gap-5 sm:grid-cols-2">
              <div className="rounded-[28px] border border-[var(--border)] bg-[var(--surface-solid)] p-5 shadow-[var(--shadow-soft)]">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,var(--accent-soft),rgba(124,77,255,0.08))]">
                  <Smartphone size={22} className="text-[var(--accent-strong)]" />
                </div>
                <p className="text-sm uppercase tracking-[0.2em] text-[var(--text-muted)]">{t.heroMobileTag}</p>
                <h2 className="mt-2 text-xl font-semibold text-[var(--text)]">{t.heroMobileTitle}</h2>
                <p className="mt-3 leading-7 text-[var(--text-muted)]">{t.heroMobileText}</p>
              </div>

              <div className="rounded-[28px] border border-[var(--border)] bg-[var(--surface-solid)] p-5 shadow-[var(--shadow-soft)]">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,var(--accent-soft),rgba(124,77,255,0.08))]">
                  <Laptop2 size={22} className="text-[var(--accent-strong)]" />
                </div>
                <p className="text-sm uppercase tracking-[0.2em] text-[var(--text-muted)]">{t.heroBrowserTag}</p>
                <h2 className="mt-2 text-xl font-semibold text-[var(--text)]">{t.heroBrowserTitle}</h2>
                <p className="mt-3 leading-7 text-[var(--text-muted)]">{t.heroBrowserText}</p>
              </div>
            </div>
          </div>

          <div className="relative flex items-center justify-center">
            <div className="absolute left-[10%] top-[5%] h-32 w-32 rounded-full bg-[var(--accent)]/20 blur-3xl" />
            <div className="absolute bottom-[12%] right-[8%] h-40 w-40 rounded-full bg-sky-400/15 blur-3xl" />

            <div className="relative w-full max-w-2xl">
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
                  <LayoutDashboard size={16} className="text-[var(--electric)]" />
                  <div>
                    <p className="text-xs uppercase tracking-[0.2em] text-[var(--text-muted)]">Desktop view</p>
                    <p className="text-sm font-medium text-[var(--text)]">Planning with full visibility</p>
                  </div>
                </div>
              </div>

              <div className="grid items-center gap-6 lg:grid-cols-[0.55fr_1fr]">
                <PhoneMock src={screenshots[activeShot]} alt="APEX COACH mobile preview" />
                <BrowserMock
                  src={screenshots[(activeShot + 1) % screenshots.length]}
                  title="apexcoach.pt/app"
                />
              </div>

              <div className="mt-5 flex justify-center gap-2">
                {screenshots.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveShot(index)}
                    className={`h-2.5 rounded-full transition ${
                      activeShot === index ? "w-8 bg-[var(--accent)]" : "w-2.5 bg-white/25"
                    }`}
                    aria-label={`Select screenshot ${index + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </section>

        <section id="platform" className="border-y border-[var(--border)] bg-[rgba(255,255,255,0.45)]">
          <div className="mx-auto max-w-7xl px-5 py-20 lg:px-8">
            <div className="max-w-3xl">
              <SectionLabel>{t.sectionPlatform}</SectionLabel>
              <h2 className="mt-4 text-4xl font-semibold tracking-tight text-[var(--text)] sm:text-5xl">
                {t.platformTitle}
              </h2>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-[var(--text-muted)]">{t.platformText}</p>
            </div>

            <div className="mt-12 grid gap-6 lg:grid-cols-2">
              <div className="rounded-[32px] border border-[var(--border)] bg-[var(--surface-solid)] p-7 shadow-[var(--shadow-soft)]">
                <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-[20px] bg-[linear-gradient(135deg,var(--accent-soft),rgba(124,77,255,0.08))]">
                  <MonitorPlay size={26} className="text-[var(--accent-strong)]" />
                </div>
                <h3 className="text-2xl font-semibold text-[var(--text)]">{t.phoneCardTitle}</h3>
                <p className="mt-4 max-w-xl leading-8 text-[var(--text-muted)]">{t.phoneCardText}</p>
              </div>

              <div className="rounded-[32px] border border-[var(--border)] bg-[var(--surface-solid)] p-7 shadow-[var(--shadow-soft)]">
                <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-[20px] bg-[linear-gradient(135deg,var(--accent-soft),rgba(124,77,255,0.08))]">
                  <Laptop2 size={26} className="text-[var(--electric)]" />
                </div>
                <h3 className="text-2xl font-semibold text-[var(--text)]">{t.browserCardTitle}</h3>
                <p className="mt-4 max-w-xl leading-8 text-[var(--text-muted)]">{t.browserCardText}</p>
              </div>
            </div>
          </div>
        </section>

        <section id="flow" className="mx-auto max-w-7xl px-5 py-20 lg:px-8">
          <div className="max-w-3xl">
            <SectionLabel>{t.flowTag}</SectionLabel>
            <h2 className="mt-4 text-4xl font-semibold tracking-tight text-[var(--text)] sm:text-5xl">
              {t.flowTitle}
            </h2>
          </div>

          <div className="mt-12 grid gap-6 lg:grid-cols-3">
            {t.flowCards.map((card, index) => (
              <FlowCard
                key={card.title}
                step={`0${index + 1}`}
                title={card.title}
                text={card.text}
              />
            ))}
          </div>
        </section>

        <section id="browser" className="border-y border-[var(--border)] bg-[rgba(255,255,255,0.45)]">
          <div className="mx-auto grid max-w-7xl gap-10 px-5 py-20 lg:grid-cols-[0.95fr_1.05fr] lg:px-8">
            <div>
              <SectionLabel>{t.browserTag}</SectionLabel>
              <h2 className="mt-4 text-4xl font-semibold tracking-tight text-[var(--text)] sm:text-5xl">
                {t.browserTitle}
              </h2>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-[var(--text-muted)]">{t.browserText}</p>

              <div className="mt-8 grid gap-3">
                {t.browserPoints.map((point) => (
                  <FeatureItem key={point}>{point}</FeatureItem>
                ))}
              </div>
            </div>

            <div className="lg:pl-6">
              <BrowserMock
                src={screenshots[(activeShot + 2) % screenshots.length]}
                title="coach workspace / browser"
              />
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-5 py-20 lg:px-8">
          <div className="max-w-3xl">
            <SectionLabel>{t.featureTag}</SectionLabel>
            <h2 className="mt-4 text-4xl font-semibold tracking-tight text-[var(--text)] sm:text-5xl">
              {t.featureTitle}
            </h2>
          </div>

          <div className="mt-12 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {t.features.map((feature) => (
              <FeatureItem key={feature}>{feature}</FeatureItem>
            ))}
          </div>
        </section>

        <section id="plans" className="border-y border-[var(--border)] bg-[rgba(255,255,255,0.45)]">
          <div className="mx-auto max-w-7xl px-5 py-20 lg:px-8">
            <div className="grid gap-10 lg:grid-cols-[0.95fr_1.05fr]">
              <div>
                <SectionLabel>{t.plansTag}</SectionLabel>
                <h2 className="mt-4 text-4xl font-semibold tracking-tight text-[var(--text)] sm:text-5xl">
                  {t.plansTitle}
                </h2>
                <p className="mt-6 max-w-2xl text-lg leading-8 text-[var(--text-muted)]">{t.plansText}</p>
              </div>

              <div className="rounded-[32px] border border-[var(--border-strong)] bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(226,250,237,0.88))] p-8 shadow-[var(--shadow-panel)]">
                <div className="mb-5 inline-flex rounded-full border border-[var(--border)] bg-white px-4 py-2 text-sm text-[var(--text-muted)]">
                  apexcoach.pt
                </div>
                <div className="grid gap-4">
                  <div className="rounded-2xl border border-[var(--border)] bg-white p-5">
                    <p className="text-sm uppercase tracking-[0.2em] text-[var(--text-muted)]">Primary promise</p>
                    <p className="mt-2 text-xl font-semibold text-[var(--text)]">
                      The app stays at the core. The web adds premium clarity and control.
                    </p>
                  </div>
                  <div className="rounded-2xl border border-[var(--border)] bg-white p-5">
                    <p className="text-sm uppercase tracking-[0.2em] text-[var(--text-muted)]">CTA direction</p>
                    <p className="mt-2 text-[var(--text-muted)]">
                      Trial, login web, and app download should live in the same conversion path.
                    </p>
                  </div>
                  <div className="rounded-2xl border border-[var(--border)] bg-white p-5">
                    <p className="text-sm uppercase tracking-[0.2em] text-[var(--text-muted)]">Perception shift</p>
                    <p className="mt-2 text-[var(--text-muted)]">
                      Not just an APK. A complete coaching operating system.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-5xl px-5 py-20 text-center lg:px-8">
          <div className="rounded-[36px] border border-[var(--border-strong)] bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(245,245,245,0.96))] px-6 py-12 shadow-[var(--shadow-panel)] sm:px-10">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-[24px] bg-[linear-gradient(135deg,var(--accent-soft),rgba(124,77,255,0.1))]">
              <Sparkles size={28} className="text-[var(--electric)]" />
            </div>
            <h2 className="mt-6 text-4xl font-semibold tracking-tight text-[var(--text)] sm:text-5xl">
              {t.closingTitle}
            </h2>
            <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-[var(--text-muted)]">{t.closingText}</p>

            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link
                href="/login"
                className="rounded-2xl bg-[var(--accent)] px-6 py-4 font-semibold text-[var(--accent-foreground)] shadow-[0_18px_40px_rgba(42,208,125,0.24)]"
              >
                {t.closingPrimary}
              </Link>
              <Link
                href="/app"
                className="rounded-2xl border border-[var(--border)] bg-white px-6 py-4 font-semibold text-[var(--text)]"
              >
                {t.closingSecondary}
              </Link>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-[var(--border)]">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-5 py-8 text-sm text-[var(--text-muted)] lg:flex-row lg:px-8">
          <div className="flex items-center gap-3">
            <img src="/logo.png" alt="APEX COACH" className="h-8 w-auto rounded-lg" />
            <div>
              <p className="font-medium text-[var(--text)]">APEX COACH</p>
              <p className="text-xs uppercase tracking-[0.18em] text-[var(--text-muted)]">apexcoach.pt</p>
            </div>
          </div>

          <p className="text-center text-xs uppercase tracking-[0.18em] text-[var(--text-muted)]">
            One coach system. Fast in the app. Premium in the web companion.
          </p>
        </div>
      </footer>
    </div>
  );
}
