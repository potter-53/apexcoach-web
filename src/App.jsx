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
    navFlow: "Operacao",
    navPilot: "Resultados",
    navPricing: "Planos",
    navFaq: "FAQ",
    badge: "Build your apex and elevate theirs. A aplicacao para coaches que exigem mais rigor, mais eficiencia e mais controlo operacional.",
    titleA: "A APEX COACH",
    titleB: "foi desenhada para",
    titleC: "elevar a tua operacao.",
    subtitle:
      "Desenvolvida para o contexto real de intervencao, a APEX COACH permite ao coach gerir sessoes, ajustar cargas, acompanhar alunos e registar informacao critica com muito menos friccao operacional. E a solucao certa para quem procura maior eficiencia, maior clareza e uma execucao mais profissional.",
    primaryCta: "Experimentar a app",
    secondaryCta: "Criar conta",
    trust1: "Clients ilimitados",
    trust2: "Periodizacao e protocolos",
    trust3: "Templates, tags e tracking",
    heroTag: "App no terreno",
    heroTitle: "Menos friccao operacional. Mais criterio tecnico. Mais tempo util.",
    heroText:
      "Tudo o que o coach necessita para intervir com qualidade no momento certo: consultar a sessao, ajustar o treino, rever historico, registar notas, acompanhar atividades externas e manter continuidade no acompanhamento sem perder foco.",
    sectionProduct: "Produto",
    productTitle: "Uma app criada para elevar a forma como o coach trabalha.",
    productText:
      "A APEX COACH nasce para dar ao coach uma experiencia mais limpa, mais rapida e mais profissional em contexto real. Foi pensada para reduzir passos desnecessarios e transformar o dia a dia numa operacao mais fluida, organizada e consistente.",
    featureTitle: "O que a app ja melhora no trabalho do coach",
    features: [
      "Clients ilimitados para acompanhar a tua operacao sem limites artificiais",
      "Registo simples de cargas, notas, contexto e atividades externas sem quebrar o ritmo",
      "Leitura mais clara do historico, progresso e evolucao de cada aluno",
      "Periodizacao semanal e organizacao por protocolos de treino",
      "Templates e tags para acelerar prescricao, repeticao e consistencia",
      "Uma imagem mais profissional e mais premium no trabalho diario",
    ],
    differentiatorTag: "Vantagens claras",
    differentiatorTitle: "Onde a APEX COACH cria uma vantagem operacional real no trabalho diario.",
    differentiatorText:
      "A diferenca nao esta em ter mais uma app. Esta em libertar tempo, reduzir ruido mental e dar ao coach mais controlo sobre tudo o que realmente importa no acompanhamento dos alunos.",
    differentiators: [
      {
        title: "Mais tempo livre",
        text: "Menos tarefas repetitivas, menos tempo perdido a procurar informacao e menos friccao operacional, para que o coach concentre mais energia na orientacao tecnica e na relacao com o aluno.",
      },
      {
        title: "Gestao de clients mais simples",
        text: "Cada aluno fica mais facil de entender, acompanhar e atualizar sem navegacao dispersa nem perda de contexto.",
      },
      {
        title: "Marcacoes e sessoes",
        text: "Agendar, consultar e acompanhar sessoes torna-se mais rapido, mais claro e mais facil de manter organizado.",
      },
      {
        title: "Tracking de metricas e avaliacoes",
        text: "Os dados deixam de estar dispersos. O coach consegue perceber com mais rapidez a evolucao, as mudancas e os proximos passos.",
      },
      {
        title: "Criacao de treinos e gestao de PSE",
        text: "Prescrever, ajustar e registar treino com continuidade tecnica, sem quebrar o ritmo do acompanhamento.",
      },
      {
        title: "Faturacao, avisos e automatismos",
        text: "Controlar pagamentos, receber alertas e automatizar partes do follow-up para gerir melhor a operacao e reduzir esquecimentos.",
      },
    ],
    scenarioTag: "Um dia com a app",
    scenarioTitle: "Como a *APEX COACH* encaixa no trabalho real do coach e sustenta o lema build your apex and elevate theirs.",
    scenarioCards: [
      {
        title: "Antes da sessao",
        text: "O coach reve a agenda, confirma o aluno, enquadra o contexto, consulta o protocolo ou a semana planeada e inicia a sessao seguinte com uma linha de acao clara.",
      },
      {
        title: "Durante a sessao",
        text: "Ajusta o treino, gere o PSE, regista notas, acompanha metricas e mantem o foco no aluno sem comprometer a qualidade da conducao da sessao.",
      },
      {
        title: "Depois da sessao",
        text: "Fica claro o que foi feito, o que mudou, o que precisa de seguimento e como continuar o acompanhamento com mais consistencia.",
      },
    ],
    systemTag: "Tudo no mesmo sistema",
    systemTitle: "Uma app que junta as pecas que normalmente andam espalhadas.",
    systemText:
      "Em vez de dispersar a operacao por notas soltas, mensagens, folhas externas e memoria, a *APEX COACH* integra agenda, clients, treinos, avaliacoes, PSE, faturacao e alertas numa experiencia muito mais clara e consistente para o coach.",
    systemItems: [
      "Base de dados de exercicios para preparar, adaptar e repetir treino com criterio",
      "Prescricao de sessoes com registo do que foi realmente feito",
      "Tracking global da evolucao do aluno ao longo do tempo",
      "Gestao de PSE, atividades externas e contexto da sessao no mesmo fluxo",
      "Periodizacao semanal e organizacao por protocolos de treino",
      "Templates, tags, packs, pagamentos, avisos e automatismos no mesmo sistema",
    ],
    capabilityTag: "Blocos essenciais",
    capabilityTitle: "O que torna a APEX COACH mais util para um coach exigente.",
    capabilityCards: [
      {
        title: "Clients ilimitados",
        text: "Acompanha a tua carteira de alunos sem limites artificiais e sem comprometer a organizacao da operacao.",
      },
      {
        title: "Atividades externas",
        text: "Regista o que o aluno faz fora da sessao e ganha contexto adicional para ajustar carga, volume e continuidade.",
      },
      {
        title: "Periodizacao e protocolos",
        text: "Organiza semanas, blocos e protocolos de treino para trabalhar com mais criterio e maior consistencia.",
      },
      {
        title: "Templates e tags",
        text: "Cria estruturas reutilizaveis, acelera a prescricao e melhora a forma como repetes e classificas o teu trabalho.",
      },
    ],
    detailTag: "O que muda na pratica",
    detailTitle: "Nao e apenas uma app para coaches. E uma estrutura de trabalho mais forte para todos os dias.",
    detailCards: [
      {
        title: "Agenda com contexto real",
        text: "Nao se trata apenas de consultar horarios. Trata-se de perceber rapidamente quem vem, o que esta pendente e como enquadrar a proxima sessao com maior preparacao.",
      },
      {
        title: "Clients com historico util",
        text: "Em vez de procurar informacao dispersa, o coach acede ao aluno e interpreta de forma imediata historico, progresso, notas e os ajustamentos que devem ser considerados.",
      },
      {
        title: "Trainings mais fluidos",
        text: "A app ajuda o coach a prescrever, consultar e ajustar sessoes com muito menos friccao no momento em que esta a trabalhar.",
      },
      {
        title: "Assessments com leitura mais clara",
        text: "Os indicadores ficam mais acessiveis, mais comparaveis e mais relevantes para suportar decisoes de continuidade e progressao com cada aluno.",
      },
    ],
    flowTag: "Fluxo do coach",
    flowTitle: "Pensada para acompanhar o coach desde a preparacao ate ao fecho da sessao.",
    flowCards: [
      { title: "Acesso imediato", text: "Chegar rapidamente a acao certa, sem navegacao excessiva nem etapas desnecessarias." },
      { title: "Registo em contexto", text: "Registar notas, ajustar cargas e conduzir a sessao sem comprometer o ritmo do treino." },
      { title: "Acompanhamento qualificado", text: "Interpretar com mais rapidez o que mudou em cada aluno e decidir com maior seguranca tecnica." },
    ],
    pilotTag: "Resultados para o coach",
    pilotTitle: "Onde a APEX COACH se traduz em valor concreto para o coach.",
    pilotText:
      "A diferenca nao esta em ter mais uma aplicacao. Esta em orientar melhor, decidir mais depressa e manter a operacao organizada sem acrescentar complexidade ao dia de trabalho.",
    pilotPoints: ["Download direto da APK", "Criacao de conta imediata", "Acesso rapido", "Uma experiencia mais clara e mais profissional"],
    proofTitle: "O que um coach deve sentir ao usar a app",
    proofItems: [
      "Menos tempo perdido a procurar informacao",
      "Mais seguranca na continuidade entre sessoes e protocolos",
      "Mais consistencia no acompanhamento dos alunos",
      "Mais controlo sobre o que foi feito, o que mudou e o que vem a seguir",
    ],
    pricingTag: "Planos",
    pricingTitle: "Uma subscricao. Duas modalidades de adesao. Uma vantagem relevante para os primeiros coaches.",
    pricingText:
      "A APEX COACH funciona com uma subscricao simples, disponivel em modalidade mensal ou anual. Os primeiros 50 lugares Foundation Coach garantem um valor preferencial enquanto a conta se mantiver ativa.",
    foundationLabel: "Foundation Coach",
    foundationTitle: "Oferta especial para os primeiros 50 coaches",
    foundationMonthly: "8,90 EUR/mes",
    foundationYearly: "89 EUR/ano",
    foundationNote: "Valor valido enquanto a conta se mantiver ativa.",
    regularLabel: "Subscricao regular",
    regularTitle: "Valor standard da APEX COACH",
    regularMonthly: "29,90 EUR/mes",
    regularYearly: "290 EUR/ano",
    pricingBullets: [
      "Uma unica subscricao para todo o ecossistema da app",
      "Modalidade mensal para uma adesao mais flexivel",
      "Opcao anual para quem procura maior compromisso e melhor valor",
      "Campanha Foundation Coach pensada para os primeiros 50 coaches",
    ],
    faqTag: "FAQ",
    faqTitle: "Preco e acesso",
    faqItems: [
      { title: "Que tipo de subscricao existe?", text: "Existe uma unica subscricao da APEX COACH, disponivel em plano mensal ou anual." },
      { title: "O que e o Foundation Coach?", text: "E a campanha especial para os primeiros 50 coaches, com valor reduzido e mantido enquanto a conta continuar ativa." },
      { title: "Para quem foi feita a APEX COACH?", text: "Para coaches que pretendem trabalhar com maior eficiencia, melhor organizacao e mais controlo no acompanhamento dos seus alunos." },
    ],
    closingTitle: "Se procuras uma operacao mais fluida, mais rigorosa e mais profissional, este e o momento certo para entrar.",
    closingText:
      "A APEX COACH esta a evoluir para se afirmar como uma ferramenta cada vez mais rapida, intuitiva e valiosa para o coach. Entra agora, experimenta no terreno e percebe como pode elevar a tua operacao.",
    closingPrimary: "Criar conta",
    closingSecondary: "Fazer download",
    modalTitle: "Quero comecar a usar a APEX COACH",
    modalText:
      "A APEX COACH foi criada para coaches que procuram maior fluidez operacional, maior rapidez de execucao e maior seguranca no acompanhamento diario. Cria a tua conta e entra na app.",
    modalPrimary: "Criar conta",
    modalSecondary: "Fazer login",
    closeLabel: "Fechar",
    login: "Login",
    signup: "Criar conta",
    backline: "Build your apex and elevate theirs. A experiencia web chegara depois. Neste momento, o foco esta numa aplicacao mais forte para o trabalho real do coach.",
    floatingSessionLabel: "Modo sessao",
    floatingSessionText: "Rapidez no momento certo",
    floatingPilotLabel: "Mais controlo",
    floatingPilotText: "Uma app desenhada para o dia real do coach",
  },
  en: {
    navProduct: "Product",
    navFlow: "Operation",
    navPilot: "Results",
    navPricing: "Pricing",
    navFaq: "FAQ",
    badge: "Build your apex and elevate theirs. The app for coaches who expect stronger standards, greater efficiency, and tighter operational control.",
    titleA: "APEX COACH",
    titleB: "was designed to",
    titleC: "elevate your operation.",
    subtitle:
      "Built for real coaching environments, APEX COACH allows coaches to manage sessions, adjust loads, follow clients, and record critical information with far less operational friction. It is the right solution for professionals seeking greater efficiency, clearer oversight, and a more elevated standard of work.",
    primaryCta: "Explore the app",
    secondaryCta: "Create account",
    trust1: "Unlimited clients",
    trust2: "Periodization and protocols",
    trust3: "Templates, tags, and tracking",
    heroTag: "Field app",
    heroTitle: "Less operational friction. Better judgement. More useful time.",
    heroText:
      "Everything a coach needs to intervene at the right moment: review the session, adjust training, analyze history, capture notes, track external activity, and preserve continuity without losing focus.",
    sectionProduct: "Product",
    productTitle: "An app built to upgrade the way coaches work.",
    productText:
      "APEX COACH is built to give coaches a cleaner, faster, and more professional experience in real working conditions. It is designed to remove unnecessary steps and turn daily work into something more fluid, organized, and dependable.",
    featureTitle: "What the app already improves in a coach's work",
    features: [
      "Unlimited clients to support your operation without artificial limits",
      "Simple logging of loads, notes, context, and external activity without breaking flow",
      "Clearer reading of each client's history, progress, and evolution",
      "Weekly periodization and structured training protocols",
      "Templates and tags to accelerate prescription, repetition, and consistency",
      "A more professional and premium day-to-day experience",
    ],
    differentiatorTag: "Clear advantages",
    differentiatorTitle: "Where APEX COACH creates a genuine operational advantage in daily work.",
    differentiatorText:
      "The difference is not adding one more app. It is freeing up time, reducing mental clutter, and giving the coach more control over what truly matters in client follow-up.",
    differentiators: [
      {
        title: "More free time",
        text: "Fewer repetitive steps, less time spent searching for information, and less operational friction, so the coach can invest more energy in technical guidance and client care.",
      },
      {
        title: "Simpler client management",
        text: "Each client becomes easier to understand, follow, and update without scattered navigation or lost context.",
      },
      {
        title: "Bookings and sessions",
        text: "Scheduling, reviewing, and managing sessions becomes faster, clearer, and easier to keep organized.",
      },
      {
        title: "Metrics and assessment tracking",
        text: "Data stops being scattered. The coach can interpret progress, changes, and next steps much faster.",
      },
      {
        title: "Training creation and RPE management",
        text: "Prescribe, adjust, and log training with stronger continuity, without breaking the rhythm of follow-up.",
      },
      {
        title: "Billing, alerts, and automations",
        text: "Track payments, receive reminders, and automate parts of follow-up to run the operation better and reduce missed actions.",
      },
    ],
    scenarioTag: "A day with the app",
    scenarioTitle: "How *APEX COACH* fits into the coach's real working day and supports the idea of build your apex and elevate theirs.",
    scenarioCards: [
      {
        title: "Before the session",
        text: "The coach reviews the agenda, confirms the client, frames the context, checks the protocol or planned week, and starts the next session with a clear operational direction.",
      },
      {
        title: "During the session",
        text: "Adjust training, manage RPE, capture notes, monitor metrics, and remain focused on the client without compromising session quality.",
      },
      {
        title: "After the session",
        text: "It becomes clear what was done, what changed, what needs follow-up, and how to continue the client journey more consistently.",
      },
    ],
    systemTag: "Everything in one system",
    systemTitle: "One app that brings together the pieces that are usually scattered.",
    systemText:
      "Instead of dispersing the workflow across loose notes, messages, external sheets, and memory, *APEX COACH* brings agenda, clients, training, assessments, RPE, billing, and alerts into one much clearer and more consistent coach workflow.",
    systemItems: [
      "Exercise database to prepare, adapt, and repeat training with stronger technical consistency",
      "Session prescription with a record of what was actually done",
      "Global progress tracking over time",
      "RPE, external activities, and session context in the same working flow",
      "Weekly periodization and structured training protocols",
      "Templates, tags, packs, payments, alerts, and automations in the same system",
    ],
    capabilityTag: "Core capabilities",
    capabilityTitle: "What makes APEX COACH more useful for a demanding coach.",
    capabilityCards: [
      {
        title: "Unlimited clients",
        text: "Follow your client base without artificial limits and without compromising the structure of your operation.",
      },
      {
        title: "External activities",
        text: "Log what the client does outside the session and gain stronger context to adjust load, volume, and continuity.",
      },
      {
        title: "Periodization and protocols",
        text: "Organize weeks, blocks, and training protocols to work with more structure and stronger consistency.",
      },
      {
        title: "Templates and tags",
        text: "Create reusable structures, accelerate prescription, and improve the way you repeat and classify your work.",
      },
    ],
    detailTag: "What changes in practice",
    detailTitle: "This is not just another app for coaches. It is a stronger operating structure for daily work.",
    detailCards: [
      {
        title: "Agenda with real context",
        text: "It is not simply about checking time slots. It is about understanding who is coming, what remains pending, and how to prepare the next session with greater readiness.",
      },
      {
        title: "Clients with useful history",
        text: "Instead of searching through scattered information, the coach accesses the client and immediately interprets history, progress, notes, and the adjustments that should be considered.",
      },
      {
        title: "Smoother training work",
        text: "The app helps the coach prescribe, review, and adjust sessions with far less friction while actual work is happening.",
      },
      {
        title: "Clearer assessments",
        text: "Indicators become easier to access, compare, and use when making continuity and progression decisions for each client.",
      },
    ],
    flowTag: "Coach flow",
    flowTitle: "Built to support the coach from preparation through session close.",
    flowCards: [
      { title: "Immediate access", text: "Reach the right action quickly, without excessive navigation or unnecessary steps." },
      { title: "Contextual logging", text: "Capture notes, adjust loads, and conduct the session without disrupting training rhythm." },
      { title: "Qualified follow-up", text: "Understand more quickly what changed in each client and make decisions with greater technical confidence." },
    ],
    pilotTag: "Results for the coach",
    pilotTitle: "Where APEX COACH translates into tangible value for the coach.",
    pilotText:
      "The difference is not simply having another app. It is about making better decisions, responding faster, and keeping operations organized without adding complexity to the working day.",
    pilotPoints: ["Direct APK download", "Immediate account creation", "Fast access", "A clearer and more professional experience"],
    proofTitle: "What a coach should feel while using the app",
    proofItems: [
      "Less time lost searching for information",
      "More confidence in continuity between sessions and protocols",
      "More consistency in client follow-up",
      "More control over what happened, what changed, and what comes next",
    ],
    pricingTag: "Pricing",
    pricingTitle: "One subscription. Two formats. One meaningful advantage for the first coaches.",
    pricingText:
      "APEX COACH runs on one simple subscription, available in monthly or yearly format. The first 50 Foundation Coaches secure a preferential price for as long as the account remains active.",
    foundationLabel: "Foundation Coach",
    foundationTitle: "Special offer for the first 50 coaches",
    foundationMonthly: "EUR 8.90/month",
    foundationYearly: "EUR 89/year",
    foundationNote: "Pricing remains valid while the account stays active.",
    regularLabel: "Regular subscription",
    regularTitle: "Standard APEX COACH pricing",
    regularMonthly: "EUR 29.90/month",
    regularYearly: "EUR 290/year",
    pricingBullets: [
      "One subscription for the full app ecosystem",
      "Monthly option for more flexible entry",
      "Yearly option for stronger commitment and better value",
      "Foundation Coach campaign designed for the first 50 coaches",
    ],
    faqTag: "FAQ",
    faqTitle: "Pricing and access",
    faqItems: [
      { title: "What subscription options are available?", text: "There is one APEX COACH subscription, available in monthly or yearly format." },
      { title: "What is Foundation Coach?", text: "It is the special launch offer for the first 50 coaches, with discounted pricing kept for as long as the account stays active." },
      { title: "Who is APEX COACH built for?", text: "For coaches who want to work with greater efficiency, stronger organization, and more control in the way they follow each client." },
    ],
    closingTitle: "If you are looking for a more fluid, more rigorous, and more professional operation, this is the right time to join.",
    closingText:
      "APEX COACH is evolving to establish itself as a faster, more intuitive, and more valuable tool for coaches. Join now, use it in the field, and see how it can elevate the way you operate.",
    closingPrimary: "Create account",
    closingSecondary: "Download now",
    modalTitle: "I want to start using APEX COACH",
    modalText:
      "APEX COACH was built for coaches seeking greater operational flow, faster execution, and more confidence in daily follow-up. Create your account and enter the app.",
    modalPrimary: "Create account",
    modalSecondary: "Login",
    closeLabel: "Close",
    login: "Login",
    signup: "Sign up",
    backline: "Build your apex and elevate theirs. The web experience comes later. Right now, the focus is a stronger mobile app for real coaching work.",
    floatingSessionLabel: "Session mode",
    floatingSessionText: "Speed when it matters",
    floatingPilotLabel: "More control",
    floatingPilotText: "An app built for the coach's real working day",
  },
};

function SectionLabel({ children }) {
  return <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[var(--accent)]">{children}</p>;
}

function BrandMark() {
  return <span className="italic text-[var(--accent-strong)]">APEX COACH</span>;
}

function renderBrandText(text) {
  if (typeof text !== "string") return text;
  const normalized = text.replace(/\*APEX COACH\*/g, "APEX COACH");
  const parts = normalized.split("APEX COACH");
  return parts.flatMap((part, index) => (index === parts.length - 1 ? [part] : [part, <BrandMark key={`brand-${index}`} />]));
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
      <h3 className="text-2xl font-semibold text-[var(--text)]">{renderBrandText(title)}</h3>
      <p className="mt-4 text-base leading-8 text-[var(--text-muted)]">{renderBrandText(text)}</p>
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
      <h3 className="text-xl font-semibold text-[var(--text)]">{renderBrandText(title)}</h3>
      <p className="mt-3 leading-7 text-[var(--text-muted)]">{renderBrandText(text)}</p>
    </div>
  );
}

function DifferentiatorCard({ title, text, icon: Icon }) {
  return (
    <div className="rounded-[28px] border border-[var(--border)] bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(246,248,247,0.98))] p-5 shadow-[0_12px_32px_rgba(14,17,16,0.05)]">
      <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,var(--accent-soft),rgba(124,77,255,0.08))]">
        <Icon size={18} className="text-[var(--accent-strong)]" />
      </div>
      <h3 className="text-xl font-semibold text-[var(--text)]">{renderBrandText(title)}</h3>
      <p className="mt-3 leading-7 text-[var(--text-muted)]">{renderBrandText(text)}</p>
    </div>
  );
}

function ScenarioCard({ title, text }) {
  return (
    <div className="rounded-[28px] border border-[var(--border)] bg-white p-5 shadow-[0_10px_28px_rgba(14,17,16,0.05)]">
      <div className="mb-4 inline-flex rounded-full border border-[var(--border)] bg-[var(--surface-muted)] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--text-muted)]">
        {renderBrandText(title)}
      </div>
      <p className="leading-7 text-[var(--text-muted)]">{renderBrandText(text)}</p>
    </div>
  );
}

function CapabilityCard({ title, text }) {
  return (
    <div className="rounded-[28px] border border-[var(--border)] bg-white p-6 shadow-[0_10px_28px_rgba(14,17,16,0.05)]">
      <div className="mb-4 inline-flex rounded-full border border-[var(--accent)]/20 bg-[var(--accent-soft)] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--accent-strong)]">
        {renderBrandText(title)}
      </div>
      <p className="leading-7 text-[var(--text-muted)]">{renderBrandText(text)}</p>
    </div>
  );
}

function PricingCard({ label, title, monthly, yearly, note, accent = false }) {
  return (
    <div className={`rounded-[30px] border p-6 shadow-[0_12px_32px_rgba(14,17,16,0.05)] ${accent ? "border-[var(--accent)] bg-[linear-gradient(135deg,var(--accent-soft),rgba(124,77,255,0.06),rgba(255,255,255,0.98))]" : "border-[var(--border)] bg-white"}`}>
      <div className="inline-flex rounded-full border border-[var(--border)] bg-white px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--text-muted)]">
        {label}
      </div>
      <h3 className="mt-4 text-2xl font-semibold text-[var(--text)]">{title}</h3>
      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        <div className="rounded-[20px] border border-[var(--border)] bg-white px-4 py-4">
          <p className="text-[11px] uppercase tracking-[0.14em] text-[var(--text-muted)]">Monthly</p>
          <p className="mt-2 text-3xl font-semibold text-[var(--text)]">{monthly}</p>
        </div>
        <div className="rounded-[20px] border border-[var(--border)] bg-white px-4 py-4">
          <p className="text-[11px] uppercase tracking-[0.14em] text-[var(--text-muted)]">Yearly</p>
          <p className="mt-2 text-3xl font-semibold text-[var(--text)]">{yearly}</p>
        </div>
      </div>
      {note ? <p className="mt-4 text-sm leading-7 text-[var(--text-muted)]">{note}</p> : null}
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
          <BrandMark />
        </div>
        <h3 className="max-w-lg text-3xl font-semibold leading-tight">{renderBrandText(title)}</h3>
        <p className="mt-5 text-lg leading-8 text-[var(--text-muted)]">{renderBrandText(text)}</p>
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
    { id: "pricing", label: t.navPricing },
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
              <p className="text-sm font-semibold tracking-[0.18em] text-[var(--text)]"><BrandMark /></p>
              <p className="text-xs uppercase tracking-[0.22em] text-[var(--text-muted)]">professional coaching app</p>
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
              {renderBrandText(t.badge)}
            </div>
            <h1 className="mt-8 text-5xl font-semibold leading-[1.02] text-[var(--text)] sm:text-6xl xl:text-7xl">
              <span className="block">{renderBrandText(t.titleA)}</span>
              <span className="block text-[var(--text)]">{renderBrandText(t.titleB)}</span>
              <span className="block bg-[linear-gradient(90deg,var(--accent-strong),var(--electric))] bg-clip-text text-transparent">{renderBrandText(t.titleC)}</span>
            </h1>
            <p className="mt-7 max-w-2xl text-lg leading-8 text-[var(--text-muted)] sm:text-xl">{renderBrandText(t.subtitle)}</p>

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
              <h2 className="mt-2 text-xl font-semibold text-[var(--text)]">{renderBrandText(t.heroTitle)}</h2>
              <p className="mt-3 leading-7 text-[var(--text-muted)]">{renderBrandText(t.heroText)}</p>
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
              <h2 className="max-w-2xl text-4xl font-semibold leading-tight text-[var(--text)] sm:text-5xl">{renderBrandText(t.productTitle)}</h2>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-[var(--text-muted)]">{renderBrandText(t.productText)}</p>
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

        <section id="day" className="mx-auto max-w-7xl px-5 py-20 lg:px-8">
          <SectionLabel>{t.detailTag}</SectionLabel>
          <h2 className="mt-5 max-w-4xl text-4xl font-semibold leading-tight text-[var(--text)] sm:text-5xl">{renderBrandText(t.detailTitle)}</h2>
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
              <h2 className="max-w-3xl text-4xl font-semibold leading-tight text-[var(--text)] sm:text-5xl">{renderBrandText(t.differentiatorTitle)}</h2>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-[var(--text-muted)]">{renderBrandText(t.differentiatorText)}</p>
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

        <section className="mx-auto max-w-7xl px-5 py-20 lg:px-8">
          <SectionLabel>{t.scenarioTag}</SectionLabel>
          <h2 className="mt-5 max-w-4xl text-4xl font-semibold leading-tight text-[var(--text)] sm:text-5xl">{renderBrandText(t.scenarioTitle)}</h2>
          <div className="mt-10 grid gap-4 lg:grid-cols-3">
            {t.scenarioCards.map((card) => (
              <ScenarioCard key={card.title} title={card.title} text={card.text} />
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-5 py-20 lg:px-8">
          <SectionLabel>{t.capabilityTag}</SectionLabel>
          <h2 className="mt-5 max-w-4xl text-4xl font-semibold leading-tight text-[var(--text)] sm:text-5xl">{renderBrandText(t.capabilityTitle)}</h2>
          <div className="mt-10 grid gap-4 lg:grid-cols-2 xl:grid-cols-4">
            {t.capabilityCards.map((card) => (
              <CapabilityCard key={card.title} title={card.title} text={card.text} />
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-5 py-20 lg:px-8">
          <div className="rounded-[36px] border border-[var(--border-strong)] bg-[linear-gradient(135deg,rgba(255,255,255,0.98),rgba(246,248,247,0.96),rgba(124,77,255,0.04))] p-8 shadow-[var(--shadow-panel)] lg:p-12">
            <SectionLabel>{t.systemTag}</SectionLabel>
            <div className="mt-5 grid gap-8 lg:grid-cols-[0.95fr_1.05fr]">
              <div>
                <h2 className="max-w-3xl text-4xl font-semibold leading-tight text-[var(--text)] sm:text-5xl">{renderBrandText(t.systemTitle)}</h2>
                <p className="mt-6 max-w-2xl text-lg leading-8 text-[var(--text-muted)]">{renderBrandText(t.systemText)}</p>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                {t.systemItems.map((item) => (
                  <FeatureItem key={item}>{item}</FeatureItem>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section id="flow" className="mx-auto max-w-7xl px-5 py-20 lg:px-8">
          <SectionLabel>{t.flowTag}</SectionLabel>
          <h2 className="mt-5 max-w-3xl text-4xl font-semibold leading-tight text-[var(--text)] sm:text-5xl">{renderBrandText(t.flowTitle)}</h2>
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
                <h2 className="text-4xl font-semibold leading-tight text-[var(--text)] sm:text-5xl">{renderBrandText(t.pilotTitle)}</h2>
                <p className="mt-6 max-w-2xl text-lg leading-8 text-[var(--text-muted)]">{renderBrandText(t.pilotText)}</p>
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

        <section id="pricing" className="mx-auto max-w-7xl px-5 py-20 lg:px-8">
          <SectionLabel>{t.pricingTag}</SectionLabel>
          <div className="mt-5 grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
            <div>
              <h2 className="max-w-3xl text-4xl font-semibold leading-tight text-[var(--text)] sm:text-5xl">{renderBrandText(t.pricingTitle)}</h2>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-[var(--text-muted)]">{renderBrandText(t.pricingText)}</p>
              <div className="mt-8 grid gap-3">
                {t.pricingBullets.map((item) => (
                  <FeatureItem key={item}>{item}</FeatureItem>
                ))}
              </div>
            </div>
            <div className="grid gap-4">
              <PricingCard
                label={t.foundationLabel}
                title={t.foundationTitle}
                monthly={t.foundationMonthly}
                yearly={t.foundationYearly}
                note={t.foundationNote}
                accent
              />
              <PricingCard
                label={t.regularLabel}
                title={t.regularTitle}
                monthly={t.regularMonthly}
                yearly={t.regularYearly}
              />
            </div>
          </div>
        </section>

        <section id="faq" className="mx-auto max-w-7xl px-5 py-20 lg:px-8">
          <SectionLabel>{t.faqTag}</SectionLabel>
          <h2 className="mt-5 max-w-3xl text-4xl font-semibold leading-tight text-[var(--text)] sm:text-5xl">{renderBrandText(t.faqTitle)}</h2>
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
            <h2 className="mt-6 text-4xl font-semibold tracking-tight text-[var(--text)] sm:text-5xl">{renderBrandText(t.closingTitle)}</h2>
            <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-[var(--text-muted)]">{renderBrandText(t.closingText)}</p>
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
              <p className="font-medium text-[var(--text)]"><BrandMark /></p>
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
