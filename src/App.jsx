import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, BellRing, Check, Clock3, CreditCard, Menu, Smartphone, Sparkles, Target, Users, X } from "lucide-react";

import { trackEvent } from "./lib/analytics";
import { COACH_LANGUAGE_OPTIONS, applyCoachLocale, getInitialBrowserLocale } from "./lib/coach-locale";
import CookieSettingsButton from "./components/CookieSettingsButton";

const screenshots = ["/screenshot_1.jpeg", "/screenshot_2.jpeg", "/screenshot_3.jpeg"];

const copy = {
  pt: {
    navProduct: "Produto",
    navFlow: "Dia a dia",
    navPilot: "Resultados",
    navFaq: "FAQ",
    badge: "A app para coaches que querem trabalhar com mais ritmo, clareza e controlo.",
    titleA: "A APEX COACH",
    titleB: "ajuda-te a",
    titleC: "coaching melhor.",
    subtitle:
      "Feita para o trabalho real no terreno, a APEX COACH ajuda o coach a abrir sessao, ajustar cargas, acompanhar alunos e registar tudo com muito menos friccao. E a app certa para quem quer trabalhar com mais ritmo, mais clareza e mais profissionalismo.",
    primaryCta: "Quero testar a app",
    secondaryCta: "Criar conta",
    trust1: "Mais rapidez em sessao",
    trust2: "Mais clareza no dia a dia",
    trust3: "Mais controlo sobre cada aluno",
    heroTag: "App no terreno",
    heroTitle: "Menos friccao. Mais coaching. Mais tempo para o que importa.",
    heroText:
      "Tudo o que o coach precisa para agir no momento certo: abrir a sessao, ajustar treino, rever historico, registar notas e manter o trabalho a fluir sem perder foco.",
    sectionProduct: "Produto",
    productTitle: "Uma app criada para elevar a forma como o coach trabalha.",
    productText:
      "A APEX COACH nasce para dar ao coach uma experiencia mais limpa, mais rapida e mais profissional em contexto real. Foi pensada para cortar passos desnecessarios e transformar o dia a dia numa operacao mais fluida, mais organizada e mais forte.",
    featureTitle: "O que a app ja promete melhorar no trabalho do coach",
    features: [
      "Organizacao mais rapida das sessoes e do dia de trabalho",
      "Registo simples de cargas, notas e contexto sem quebrar o ritmo",
      "Leitura mais clara do historico e progresso de cada aluno",
      "Fluxo mais intuitivo entre clients, trainings e assessments",
      "Menos passos para as acoes que o coach mais repete",
      "Uma imagem mais profissional e mais premium no trabalho diario",
    ],
    differentiatorTag: "Vantagens claras",
    differentiatorTitle: "Onde a APEX COACH te dá uma vantagem real no trabalho diário.",
    differentiatorText:
      "A diferença não está em ter mais uma app. Está em libertar tempo, reduzir ruído mental e dar ao coach mais controlo sobre tudo o que realmente importa no acompanhamento dos alunos.",
    differentiators: [
      {
        title: "Mais tempo livre",
        text: "Menos passos repetidos, menos procura de informação e menos fricção operacional para o coach se focar mais em orientar e menos em apagar fogos.",
      },
      {
        title: "Gestão de clients mais simples",
        text: "Cada aluno fica mais fácil de entender, acompanhar e atualizar sem navegação dispersa ou perda de contexto.",
      },
      {
        title: "Marcações e sessões",
        text: "Agendar, consultar e acompanhar sessões torna-se mais rápido, mais claro e mais fácil de manter organizado.",
      },
      {
        title: "Tracking de métricas e avaliações",
        text: "Os dados deixam de estar perdidos. O coach consegue perceber mais depressa evolução, mudanças e próximos passos.",
      },
      {
        title: "Criação de treinos e gestão de PSE",
        text: "Prescrever, ajustar e registar treino com sensação de continuidade, sem quebrar o ritmo do acompanhamento.",
      },
      {
        title: "Faturação, avisos e automatismos",
        text: "Controlar pagamentos, receber alertas e automatizar partes do follow-up para gerir melhor a operação e reduzir esquecimentos.",
      },
    ],
    detailTag: "O que muda na pratica",
    detailTitle: "Nao e so uma app para coaches. E uma forma melhor de operar todos os dias.",
    detailCards: [
      {
        title: "Agenda com contexto real",
        text: "Nao e apenas ver horas. E perceber logo quem vem, o que ficou pendente, e como preparar a sessao seguinte sem perder tempo.",
      },
      {
        title: "Clients com historico util",
        text: "Em vez de procurar informacao dispersa, o coach entra no aluno e percebe rapidamente historico, progresso, notas e o que precisa de ajustar.",
      },
      {
        title: "Trainings mais fluidos",
        text: "A app ajuda o coach a prescrever, consultar e adaptar sessoes com muito menos friccao no momento em que esta a trabalhar.",
      },
      {
        title: "Assessments com leitura mais clara",
        text: "Os valores ficam mais acessiveis, mais comparaveis e mais uteis para decidir o que fazer a seguir com cada aluno.",
      },
    ],
    flowTag: "Fluxo do coach",
    flowTitle: "Pensada para acompanhar o coach do primeiro toque ao fim da sessao.",
    flowCards: [
      { title: "Entrar e agir", text: "Abrir a app e chegar ao que interessa em segundos, sem menus pesados nem passos a mais." },
      { title: "Registar no momento", text: "Tomar notas, ajustar cargas e acompanhar a sessao sem quebrar o ritmo do treino." },
      { title: "Acompanhar melhor", text: "Perceber mais depressa o que mudou em cada aluno e decidir com mais seguranca." },
    ],
    pilotTag: "Resultados para o coach",
    pilotTitle: "Onde a APEX COACH faz diferenca no teu trabalho.",
    pilotText:
      "A diferenca nao esta em ter mais uma app. Esta em conseguires orientar melhor, decidir mais depressa e manter o trabalho organizado sem carregar o dia com mais complexidade.",
    pilotPoints: ["Download direto da APK", "Criacao de conta simples", "Login imediato", "Uma experiencia mais clara e mais profissional"],
    proofTitle: "O que um coach deve sentir ao usar a app",
    proofItems: [
      "Menos tempo perdido a procurar informacao",
      "Mais seguranca na continuidade entre sessoes",
      "Mais consistencia no acompanhamento dos alunos",
      "Mais controlo sobre o que foi feito, o que mudou e o que vem a seguir",
    ],
    faqTag: "FAQ",
    faqTitle: "Perguntas que um coach vai querer esclarecer antes de entrar",
    faqItems: [
      { title: "Porque estamos a focar a app primeiro?", text: "Porque e na app que o coach vive o momento critico do trabalho. Queremos tornar essa experiencia realmente forte antes do segundo passo web." },
      { title: "A versao web vai existir?", text: "Sim. Mas primeiro queremos que o nucleo do produto esteja limpo, rapido e consistente com utilizacao real no terreno." },
      { title: "Para quem foi feita a APEX COACH?", text: "Para coaches que querem trabalhar com mais rapidez, mais organizacao e mais controlo no acompanhamento dos seus alunos." },
    ],
    closingTitle: "Se queres trabalhar com mais fluidez, esta e a altura certa para entrar.",
    closingText:
      "A APEX COACH esta a ser afinada com coaches reais para se tornar uma ferramenta cada vez mais rapida, intuitiva e valiosa. Entra agora, testa no terreno e ajuda-nos a construir algo realmente forte.",
    closingPrimary: "Criar conta",
    closingSecondary: "Fazer download",
    modalTitle: "Quero comecar a usar a APEX COACH",
    modalText:
      "A APEX COACH foi criada para coaches que querem trabalhar com mais fluidez, mais rapidez e mais seguranca no dia a dia. Cria a tua conta e entra na app.",
    modalPrimary: "Criar conta",
    modalSecondary: "Fazer login",
    closeLabel: "Fechar",
    login: "Login",
    signup: "Criar conta",
    backline: "A experiencia web chegara depois. Agora o foco e dar-te uma app melhor.",
    floatingSessionLabel: "Modo sessao",
    floatingSessionText: "Rapidez no momento certo",
    floatingPilotLabel: "Mais controlo",
    floatingPilotText: "Uma app desenhada para o dia real do coach",
  },
  en: {
    navProduct: "Product",
    navFlow: "Daily work",
    navPilot: "Results",
    navFaq: "FAQ",
    badge: "The app for coaches who want more speed, clarity, and control.",
    titleA: "APEX COACH",
    titleB: "helps you",
    titleC: "coach better.",
    subtitle:
      "Built for real work in the field, APEX COACH helps coaches open sessions, adjust loads, follow clients, and log everything with far less friction. It is the right app for coaches who want to work with more speed, clarity, and professionalism.",
    primaryCta: "Try the app",
    secondaryCta: "Create account",
    trust1: "More speed in session",
    trust2: "More clarity every day",
    trust3: "More control over every client",
    heroTag: "Field app",
    heroTitle: "Less friction. Better coaching. More time for what matters.",
    heroText:
      "Everything a coach needs to act at the right moment: open the session, adjust training, review history, capture notes, and keep the work flowing without losing focus.",
    sectionProduct: "Product",
    productTitle: "An app built to upgrade the way coaches work.",
    productText:
      "APEX COACH is built to give coaches a cleaner, faster, and more professional experience in real working conditions. It is designed to remove unnecessary steps and turn daily work into something more fluid, organized, and powerful.",
    featureTitle: "What the app is already designed to improve",
    features: [
      "Faster organization of sessions and daily work",
      "Simple logging of loads, notes, and context without breaking flow",
      "Clearer reading of each client's history and progress",
      "A more intuitive flow between clients, trainings, and assessments",
      "Fewer steps for the actions coaches repeat most",
      "A more professional and premium day-to-day experience",
    ],
    differentiatorTag: "Clear advantages",
    differentiatorTitle: "Where APEX COACH gives you a real edge in daily work.",
    differentiatorText:
      "The difference is not having one more app. It is freeing up time, reducing mental clutter, and giving the coach more control over what truly matters in client follow-up.",
    differentiators: [
      {
        title: "More free time",
        text: "Fewer repeated steps, less searching for information, and less operational friction so the coach can spend more time coaching and less time firefighting.",
      },
      {
        title: "Easier client management",
        text: "Each client becomes easier to understand, follow, and update without scattered navigation or lost context.",
      },
      {
        title: "Bookings and sessions",
        text: "Scheduling, checking, and managing sessions becomes faster, clearer, and easier to keep organized.",
      },
      {
        title: "Metrics and assessment tracking",
        text: "Data stops getting lost. The coach can understand progress, changes, and next steps much faster.",
      },
      {
        title: "Training creation and RPE management",
        text: "Prescribe, adjust, and log training with a sense of continuity, without breaking the rhythm of follow-up.",
      },
      {
        title: "Client billing, alerts, and automations",
        text: "Track payments, receive reminders, and automate parts of follow-up to run the operation better and reduce missed actions.",
      },
    ],
    detailTag: "What changes in practice",
    detailTitle: "This is not just another app for coaches. It is a better way to run the work every day.",
    detailCards: [
      {
        title: "Agenda with real context",
        text: "It is not only about seeing times. It is about understanding who is coming, what is pending, and how to prepare the next session faster.",
      },
      {
        title: "Clients with useful history",
        text: "Instead of hunting for scattered information, the coach opens the client and quickly understands history, progress, notes, and what needs adjusting.",
      },
      {
        title: "Smoother training work",
        text: "The app helps the coach prescribe, review, and adapt sessions with far less friction while actual work is happening.",
      },
      {
        title: "Clearer assessments",
        text: "The numbers become easier to access, easier to compare, and more useful when deciding what comes next for each client.",
      },
    ],
    flowTag: "Coach flow",
    flowTitle: "Built to support the coach from first tap to end of session.",
    flowCards: [
      { title: "Open and act", text: "Open the app and reach the right action in seconds, without heavy menus or extra steps." },
      { title: "Log in the moment", text: "Capture notes, adjust loads, and manage the session without breaking training rhythm." },
      { title: "Follow up better", text: "Understand faster what changed in each client and make decisions with more confidence." },
    ],
    pilotTag: "Results for the coach",
    pilotTitle: "Where APEX COACH makes a real difference in your work.",
    pilotText:
      "The difference is not having one more app. The difference is coaching better, deciding faster, and keeping the work organized without adding more complexity to the day.",
    pilotPoints: ["Direct APK download", "Simple account creation", "Immediate login", "A clearer and more professional experience"],
    proofTitle: "What a coach should feel while using the app",
    proofItems: [
      "Less time lost searching for information",
      "More confidence in continuity between sessions",
      "More consistency in client follow-up",
      "More control over what happened, what changed, and what comes next",
    ],
    faqTag: "FAQ",
    faqTitle: "Questions a coach will want answered before joining",
    faqItems: [
      { title: "Why are we focusing on the app first?", text: "Because the app is where the coach lives the most critical part of the job. We want that experience to be truly strong before the second web step." },
      { title: "Will the web version exist?", text: "Yes. But first we want the product core to feel clean, fast, and consistent in real field usage." },
      { title: "Who is APEX COACH built for?", text: "For coaches who want to work with more speed, better organization, and more control in the way they follow each client." },
    ],
    closingTitle: "If you want to work with more flow, this is the right time to join.",
    closingText:
      "APEX COACH is being refined with real coaches to become a faster, more intuitive, and more valuable tool. Join now, test it in the field, and help us build something genuinely strong.",
    closingPrimary: "Create account",
    closingSecondary: "Download now",
    modalTitle: "I want to start using APEX COACH",
    modalText:
      "APEX COACH was built for coaches who want to work with more flow, more speed, and more confidence every day. Create your account and get into the app.",
    modalPrimary: "Create account",
    modalSecondary: "Login",
    closeLabel: "Close",
    login: "Login",
    signup: "Sign up",
    backline: "The web experience comes later. Right now the focus is giving you a better app.",
    floatingSessionLabel: "Session mode",
    floatingSessionText: "Speed when it matters",
    floatingPilotLabel: "More control",
    floatingPilotText: "An app built for the coach's real working day",
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

function DetailCard({ title, text }) {
  return (
    <div className="rounded-[28px] border border-[var(--border)] bg-white p-5 shadow-[0_10px_28px_rgba(14,17,16,0.05)]">
      <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,var(--accent-soft),rgba(124,77,255,0.08))]">
        <Target size={18} className="text-[var(--accent-strong)]" />
      </div>
      <h3 className="text-xl font-semibold text-[var(--text)]">{title}</h3>
      <p className="mt-3 leading-7 text-[var(--text-muted)]">{text}</p>
    </div>
  );
}

function DifferentiatorCard({ title, text, icon: Icon }) {
  return (
    <div className="rounded-[28px] border border-[var(--border)] bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(246,248,247,0.98))] p-5 shadow-[0_12px_32px_rgba(14,17,16,0.05)]">
      <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,var(--accent-soft),rgba(124,77,255,0.08))]">
        <Icon size={18} className="text-[var(--accent-strong)]" />
      </div>
      <h3 className="text-xl font-semibold text-[var(--text)]">{title}</h3>
      <p className="mt-3 leading-7 text-[var(--text-muted)]">{text}</p>
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
              <p className="text-xs uppercase tracking-[0.22em] text-[var(--text-muted)]">coach performance app</p>
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
                  <p className="text-xs uppercase tracking-[0.2em] text-[var(--text-muted)]">{t.floatingSessionLabel}</p>
                  <p className="text-sm font-medium text-[var(--text)]">{t.floatingSessionText}</p>
                </div>
              </div>
            </div>
            <div className="absolute -right-2 bottom-10 z-20 hidden rounded-3xl border border-[var(--border)] bg-[rgba(255,255,255,0.88)] px-4 py-3 shadow-[var(--shadow-soft)] md:block">
              <div className="flex items-center gap-3">
                <Users size={16} className="text-[var(--electric)]" />
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-[var(--text-muted)]">{t.floatingPilotLabel}</p>
                  <p className="text-sm font-medium text-[var(--text)]">{t.floatingPilotText}</p>
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
          <SectionLabel>{t.detailTag}</SectionLabel>
          <h2 className="mt-5 max-w-4xl text-4xl font-semibold leading-tight text-[var(--text)] sm:text-5xl">{t.detailTitle}</h2>
          <div className="mt-10 grid gap-4 lg:grid-cols-2">
            {t.detailCards.map((card) => (
              <DetailCard key={card.title} title={card.title} text={card.text} />
            ))}
          </div>
        </section>

        <section id="pilot" className="mx-auto max-w-7xl px-5 py-20 lg:px-8">
          <SectionLabel>{t.differentiatorTag}</SectionLabel>
          <div className="mt-5 grid gap-8 lg:grid-cols-[0.88fr_1.12fr]">
            <div>
              <h2 className="max-w-3xl text-4xl font-semibold leading-tight text-[var(--text)] sm:text-5xl">{t.differentiatorTitle}</h2>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-[var(--text-muted)]">{t.differentiatorText}</p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {t.differentiators.map((item, index) => {
                const icons = [Clock3, Users, Smartphone, Target, Check, CreditCard];
                const Icon = icons[index] || BellRing;
                return <DifferentiatorCard key={item.title} title={item.title} text={item.text} icon={Icon} />;
              })}
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

        <section className="mx-auto max-w-7xl px-5 py-20 lg:px-8">
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

            <div className="mt-10 rounded-[28px] border border-[var(--border)] bg-white p-6 shadow-[0_12px_28px_rgba(14,17,16,0.04)]">
              <h3 className="text-2xl font-semibold text-[var(--text)]">{t.proofTitle}</h3>
              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                {t.proofItems.map((item) => (
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
              <p className="text-xs uppercase tracking-[0.18em] text-[var(--text-muted)]">mobile coaching app</p>
            </div>
          </div>

          <p className="text-center text-xs uppercase tracking-[0.18em] text-[var(--text-muted)]">Faster sessions. Clearer coaching. Better work every day.</p>

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
