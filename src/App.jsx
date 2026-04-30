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
    navFlow: "Operação",
    navPilot: "Resultados",
    navPricing: "Planos",
    navFaq: "FAQ",
    badge: "Build your apex and elevate theirs. A aplicação para coaches que exigem mais rigor, mais eficiência e mais controlo operacional.",
    titleA: "A APEX COACH",
    titleB: "foi desenhada para",
    titleC: "elevar a tua operação.",
    subtitle:
      "Desenvolvida para o contexto real de intervenção, a APEX COACH permite ao coach gerir sessões, ajustar cargas, acompanhar alunos e registar informação crítica com muito menos fricção operacional. É a solução certa para quem procura maior eficiência, maior clareza e uma execução mais profissional.",
    primaryCta: "Experimentar a app",
    secondaryCta: "Criar conta",
    trust1: "Clients ilimitados",
    trust2: "Periodização e protocolos",
    trust3: "Templates, tags e tracking",
    heroTag: "App no terreno",
    heroTitle: "Menos fricção operacional. Mais critério técnico. Mais tempo útil.",
    heroText:
      "Tudo o que o coach necessita para intervir com qualidade no momento certo: consultar a sessão, ajustar o treino, rever histórico, registar notas, acompanhar atividades externas e manter continuidade no acompanhamento sem perder foco.",
    sectionProduct: "Produto",
    productTitle: "Uma app criada para elevar a forma como o coach trabalha.",
    productText:
      "A APEX COACH nasce para dar ao coach uma experiência mais limpa, mais rápida e mais profissional em contexto real. Foi pensada para reduzir passos desnecessários, elevar a tua operação e transformar o dia a dia numa estrutura mais fluida, organizada e consistente.",
    featureTitle: "O que a app já melhora no trabalho do coach",
    features: [
      "Clients ilimitados para acompanhar a tua operação sem limites artificiais",
      "Registo simples de cargas, notas, contexto e atividades externas sem quebrar o ritmo",
      "Leitura mais clara do histórico, progresso e evolução de cada aluno",
      "Periodização semanal e organização por protocolos de treino",
      "Templates e tags para acelerar prescrição, repetição e consistência",
      "Uma imagem mais profissional e mais premium no trabalho diário",
    ],
    differentiatorTag: "Vantagens claras",
    differentiatorTitle: "Onde a APEX COACH cria uma vantagem operacional real no trabalho diário.",
    differentiatorText:
      "A diferença não está em ter mais uma app. Está em libertar tempo, reduzir ruído mental e dar ao coach mais controlo sobre tudo o que realmente importa para elevar a tua operação e o acompanhamento dos alunos.",
    differentiators: [
      {
        title: "Mais tempo livre",
        text: "Menos tarefas repetitivas, menos tempo perdido a procurar informação e menos fricção operacional, para que o coach concentre mais energia na orientação técnica e na relação com o aluno.",
      },
      {
        title: "Gestão de clients mais simples",
        text: "Cada aluno fica mais fácil de entender, acompanhar e atualizar sem navegação dispersa nem perda de contexto.",
      },
      {
        title: "Marcações e sessões",
        text: "Agendar, consultar e acompanhar sessões torna-se mais rápido, mais claro e mais fácil de manter organizado.",
      },
      {
        title: "Tracking de métricas e avaliações",
        text: "Os dados deixam de estar dispersos. O coach consegue perceber com mais rapidez a evolução, as mudanças e os próximos passos.",
      },
      {
        title: "Criação de treinos e gestão de PSE",
        text: "Prescrever, ajustar e registar treino com continuidade técnica, sem quebrar o ritmo do acompanhamento.",
      },
      {
        title: "Faturação, avisos e automatismos",
        text: "Controlar pagamentos, receber alertas e automatizar partes do follow-up para gerir melhor a operação e reduzir esquecimentos.",
      },
    ],
    scenarioTag: "Um dia com a app",
    scenarioTitle: "Como a APEX COACH encaixa no trabalho real do coach e sustenta o lema build your apex and elevate theirs.",
    scenarioCards: [
      {
        title: "Antes da sessão",
        text: "O coach revê a agenda, confirma o aluno, enquadra o contexto, consulta o protocolo ou a semana planeada e inicia a sessão seguinte com uma linha de ação clara.",
      },
      {
        title: "Durante a sessão",
        text: "Ajusta o treino, gere o PSE, regista notas, acompanha métricas e mantém o foco no aluno sem comprometer a qualidade da condução da sessão.",
      },
      {
        title: "Depois da sessão",
        text: "Fica claro o que foi feito, o que mudou, o que precisa de seguimento e como continuar o acompanhamento com mais consistência.",
      },
    ],
    systemTag: "Tudo no mesmo sistema",
    systemTitle: "Uma app que junta as peças que normalmente andam espalhadas.",
    systemText:
      "Em vez de dispersar a operação por notas soltas, mensagens, folhas externas e memória, a APEX COACH integra agenda, clients, treinos, avaliações, PSE, faturação e alertas numa experiência muito mais clara e consistente para o coach.",
    systemItems: [
      "Base de dados de exercícios para preparar, adaptar e repetir treino com critério",
      "Prescrição de sessões com registo do que foi realmente feito",
      "Tracking global da evolução do aluno ao longo do tempo",
      "Gestão de PSE, atividades externas e contexto da sessão no mesmo fluxo",
      "Periodização semanal e organização por protocolos de treino",
      "Templates, tags, packs, pagamentos, avisos e automatismos no mesmo sistema",
    ],
    capabilityTag: "Blocos essenciais",
    capabilityTitle: "O que torna a APEX COACH mais útil para um coach exigente.",
    capabilityCards: [
      {
        title: "Clients ilimitados",
        text: "Acompanha a tua carteira de alunos sem limites artificiais e sem comprometer a organização da operação.",
      },
      {
        title: "Atividades externas",
        text: "Regista o que o aluno faz fora da sessao e ganha contexto adicional para ajustar carga, volume e continuidade.",
      },
      {
        title: "Periodização e protocolos",
        text: "Organiza semanas, blocos e protocolos de treino para trabalhar com mais critério e maior consistência.",
      },
      {
        title: "Templates e tags",
        text: "Cria estruturas reutilizáveis, acelera a prescrição e melhora a forma como repetes e classificas o teu trabalho.",
      },
    ],
    clientValueTag: "Valor para o client",
    clientValueTitle: "O coach organiza melhor. O client percebe mais valor.",
    clientValueText:
      "A APEX COACH não melhora apenas a operação do coach. Também reforça a experiência do client, porque cria uma app onde o aluno pode concentrar o que foi feito, o que está planeado e como a sua evolução está a ser acompanhada.",
    clientValueCards: [
      {
        title: "Tudo num só lugar",
        text: "O client deixa de depender de mensagens dispersas, notas soltas e memória. Passa a ter uma estrutura mais clara daquilo que está a fazer e do que vem a seguir.",
      },
      {
        title: "Treino com mais clareza",
        text: "Quando o coach prescreve, ajusta e regista o que foi executado, o client percebe melhor o processo e valoriza mais a qualidade do acompanhamento.",
      },
      {
        title: "Evolução visível",
        text: "Métricas, avaliações, contexto e histórico deixam de estar desconectados. O client sente maior progressão porque consegue perceber melhor o caminho que está a fazer.",
      },
      {
        title: "Mais confiança no acompanhamento",
        text: "Uma experiência mais organizada, mais profissional e mais consistente aumenta a perceção de valor do serviço e reforça a relação entre coach e client.",
      },
    ],
    detailTag: "O que muda na prática",
    detailTitle: "Não é apenas uma app para coaches. É uma estrutura de trabalho mais forte para todos os dias.",
    detailCards: [
      {
        title: "Agenda com contexto real",
        text: "Não se trata apenas de consultar horários. Trata-se de perceber rapidamente quem vem, o que está pendente e como enquadrar a próxima sessão com maior preparação.",
      },
      {
        title: "Clients com histórico útil",
        text: "Em vez de procurar informação dispersa, o coach acede ao aluno e interpreta de forma imediata histórico, progresso, notas e os ajustamentos que devem ser considerados.",
      },
      {
        title: "Trainings mais fluidos",
        text: "A app ajuda o coach a prescrever, consultar e ajustar sessões com muito menos fricção no momento em que está a trabalhar.",
      },
      {
        title: "Assessments com leitura mais clara",
        text: "Os indicadores ficam mais acessíveis, mais comparáveis e mais relevantes para suportar decisões de continuidade e progressão com cada aluno.",
      },
    ],
    flowTag: "Fluxo do coach",
    flowTitle: "Pensada para acompanhar o coach desde a preparação até ao fecho da sessão.",
    flowCards: [
      { title: "Acesso imediato", text: "Chegar rapidamente à ação certa, sem navegação excessiva nem etapas desnecessárias." },
      { title: "Registo em contexto", text: "Registar notas, ajustar cargas e conduzir a sessão sem comprometer o ritmo do treino." },
      { title: "Acompanhamento qualificado", text: "Interpretar com mais rapidez o que mudou em cada aluno e decidir com maior segurança técnica." },
    ],
    pilotTag: "Resultados para o coach",
    pilotTitle: "Onde a APEX COACH se traduz em valor concreto para o coach.",
    pilotText:
      "A diferença não está em ter mais uma aplicação. Está em orientar melhor, decidir mais depressa e elevar a tua operação sem acrescentar complexidade ao dia de trabalho.",
    pilotPoints: ["Download direto da APK", "Criacao de conta imediata", "Acesso rapido", "Uma experiencia mais clara e mais profissional"],
    proofTitle: "O que um coach deve sentir ao usar a app",
    proofItems: [
      "Menos tempo perdido a procurar informação",
      "Mais segurança na continuidade entre sessões e protocolos",
      "Mais consistência no acompanhamento dos alunos",
      "Mais controlo sobre o que foi feito, o que mudou e o que vem a seguir",
    ],
    pricingTag: "Planos",
    pricingTitle: "Uma subscrição. Duas modalidades de adesão. Uma vantagem relevante para os primeiros coaches.",
    pricingText:
      "A APEX COACH funciona com uma subscrição simples, disponível em modalidade mensal ou anual. Os primeiros 50 lugares Foundation Coach garantem um valor preferencial enquanto a conta se mantiver ativa.",
    foundationLabel: "Foundation Coach",
    foundationTitle: "Oferta especial para os primeiros 50 coaches",
    foundationMonthly: "8,90 EUR/mês",
    foundationYearly: "89 EUR/ano",
    foundationNote: "Valor válido enquanto a conta se mantiver ativa.",
    regularLabel: "Subscrição regular",
    regularTitle: "Valor standard da APEX COACH",
    regularMonthly: "29,90 EUR/mês",
    regularYearly: "290 EUR/ano",
    pricingBullets: [
      "Uma única subscrição para todo o ecossistema da app",
      "Modalidade mensal para uma adesão mais flexível",
      "Opção anual para quem procura maior compromisso e melhor valor",
      "Campanha Foundation Coach pensada para os primeiros 50 coaches",
    ],
    faqTag: "FAQ",
    faqTitle: "Perguntas frequentes",
    faqItems: [
      { title: "Que modelo de subscrição existe?", text: "A APEX COACH funciona com uma subscrição única, disponível em modalidade mensal ou anual. A lógica comercial é simples: um único produto, duas formas de adesão e a mesma estrutura funcional da app." },
      { title: "O que é o Foundation Coach e como funciona?", text: "Foundation Coach é a campanha de entrada para os primeiros 50 coaches. Enquanto a conta se mantiver ativa, o coach preserva o valor preferencial associado a essa adesão inicial, sem migração automática para o preço standard." },
      { title: "Para que perfil de coach foi pensada a APEX COACH?", text: "A app foi pensada para coaches que precisam de operar com mais critério técnico, mais velocidade de execução e maior consistência no acompanhamento dos seus alunos, quer trabalhem com performance, saúde, recomposição corporal ou acompanhamento híbrido." },
      { title: "Posso trabalhar com clients ilimitados?", text: "Sim. A estrutura da app foi desenhada para acompanhar a operação do coach sem impor limites artificiais ao número de clients, permitindo crescer a carteira de acompanhamento sem perder organização nem contexto." },
      { title: "A app permite acompanhar atividades externas do aluno?", text: "Sim. O coach pode registar contexto adicional e atividades realizadas fora da sessão principal, o que melhora a leitura da carga global, da recuperação, do volume acumulado e da continuidade do processo." },
      { title: "É possível organizar periodização e protocolos de treino?", text: "Sim. A APEX COACH suporta uma lógica de organização por semanas, blocos e protocolos, permitindo estruturar a progressão do aluno com maior clareza e manter uma leitura mais consistente do plano em execução." },
      { title: "Posso criar templates e usar tags para acelerar a prescrição?", text: "Sim. A app permite criar templates reutilizáveis e aplicar tags para classificar melhor exercícios, sessões e estruturas de trabalho. Isto reduz repetição manual e ajuda a elevar a tua operação diária." },
      { title: "A base de dados de exercícios serve apenas para consulta?", text: "Não. A base de dados de exercícios serve como suporte ativo à preparação, adaptação e repetição do treino. O objetivo não é apenas consultar exercícios, mas acelerar decisões de prescrição com mais consistência técnica." },
      { title: "A faturação dos clients pode ser acompanhada na app?", text: "Sim. A APEX COACH foi pensada para concentrar também a componente de packs, pagamentos, avisos e seguimento financeiro do aluno, reduzindo a necessidade de sistemas paralelos para controlo operacional." },
      { title: "O aluno consegue perceber o que foi feito e acompanhar a evolução?", text: "Sim. A estrutura da app foi desenhada para que o coach consiga registar o que foi prescrito, o que foi executado e o que mudou ao longo do tempo, criando uma visão mais clara da evolução global do aluno." },
    ],
    closingTitle: "Se procuras uma operação mais fluida, mais rigorosa e mais profissional, este é o momento certo para entrar.",
    closingText:
      "A APEX COACH está a evoluir para se afirmar como uma ferramenta cada vez mais rápida, intuitiva e valiosa para o coach. Entra agora, experimenta no terreno e percebe como pode elevar a tua operação com mais clareza, mais controlo e maior consistência.",
    closingPrimary: "Criar conta",
    closingSecondary: "Fazer download",
    modalTitle: "Quero comecar a usar a APEX COACH",
    modalText:
      "A APEX COACH foi criada para coaches que procuram maior fluidez operacional, maior rapidez de execução e maior segurança no acompanhamento diário. Cria a tua conta e entra na app.",
    modalPrimary: "Criar conta",
    modalSecondary: "Fazer login",
    closeLabel: "Fechar",
    login: "Login",
    signup: "Criar conta",
    backline: "Build your apex and elevate theirs. A experiência web chegará depois. Neste momento, o foco está numa aplicação mais forte para o trabalho real do coach.",
    floatingSessionLabel: "Modo sessão",
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
      "APEX COACH is built to give coaches a cleaner, faster, and more professional experience in real working conditions. It is designed to remove unnecessary steps, elevate your operation, and turn daily work into something more fluid, organized, and dependable.",
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
      "The difference is not adding one more app. It is about freeing up time, reducing mental clutter, and giving the coach more control over what truly matters in order to elevate the operation behind every client.",
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
    scenarioTitle: "How APEX COACH fits into the coach's real working day and supports the idea of build your apex and elevate theirs.",
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
      "Instead of dispersing the workflow across loose notes, messages, external sheets, and memory, APEX COACH brings agenda, clients, training, assessments, RPE, billing, and alerts into one much clearer and more consistent coach workflow.",
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
    clientValueTag: "Value for the client",
    clientValueTitle: "The coach works with more structure. The client feels more value.",
    clientValueText:
      "APEX COACH does not only improve the coach's operation. It also strengthens the client experience by giving the client an app where completed work, planned work, and overall progress can live in one clearer structure.",
    clientValueCards: [
      {
        title: "Everything in one place",
        text: "The client no longer depends on scattered messages, loose notes, and memory. Instead, there is a clearer structure of what is being done and what comes next.",
      },
      {
        title: "Clearer training delivery",
        text: "When the coach prescribes, adjusts, and logs what was executed, the client understands the process better and perceives more value in the quality of follow-up.",
      },
      {
        title: "Visible progress",
        text: "Metrics, assessments, context, and history stop feeling disconnected. The client experiences more progress because the journey becomes easier to understand.",
      },
      {
        title: "More confidence in the service",
        text: "A more organized, more professional, and more consistent experience increases the perceived value of the coaching service and strengthens the coach-client relationship.",
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
      "The difference is not simply having another app. It is about making better decisions, responding faster, and elevating the operation without adding complexity to the working day.",
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
    faqTitle: "Frequently asked questions",
    faqItems: [
      { title: "What subscription model is available?", text: "APEX COACH runs on a single subscription model, available in monthly or yearly format. The commercial structure is simple: one product, two billing options, and the same core app experience." },
      { title: "What is Foundation Coach and how does it work?", text: "Foundation Coach is the entry campaign for the first 50 coaches. As long as the account remains active, the coach keeps the preferential pricing associated with that initial subscription." },
      { title: "Who is APEX COACH built for?", text: "The app was built for coaches who need stronger technical structure, faster execution, and greater consistency in client follow-up, whether they work in performance, health, body composition, or hybrid coaching environments." },
      { title: "Can I work with unlimited clients?", text: "Yes. The app structure was designed to support the coach's operation without artificial limits on the number of clients, allowing the business to grow without losing clarity or control." },
      { title: "Can the app track external client activities?", text: "Yes. The coach can log relevant activity performed outside the main session, creating stronger context for load management, recovery interpretation, accumulated volume, and decision-making." },
      { title: "Does the app support periodization and structured protocols?", text: "Yes. APEX COACH supports organization by weeks, blocks, and training protocols, allowing the coach to manage progression with more structure and a clearer reading of the plan in execution." },
      { title: "Can I create templates and use tags?", text: "Yes. The app allows reusable templates and tagging logic to classify exercises, sessions, and work structures. This reduces manual repetition and helps elevate the daily operation." },
      { title: "Is the exercise database only for consultation?", text: "No. The exercise database is meant to actively support training preparation, adaptation, and repetition. The goal is not just to view exercises, but to accelerate prescription decisions with stronger technical consistency." },
      { title: "Can client billing be managed inside the app?", text: "Yes. APEX COACH was designed to concentrate packs, payments, alerts, and financial follow-up inside the same operational flow, reducing the need for parallel systems." },
      { title: "Can the client understand what was done and follow overall progress?", text: "Yes. The app structure helps the coach register what was prescribed, what was executed, and what changed over time, creating a clearer view of the client's overall evolution." },
    ],
    closingTitle: "If you are looking for a more fluid, more rigorous, and more professional operation, this is the right time to join.",
    closingText:
      "APEX COACH is evolving to establish itself as a faster, more intuitive, and more valuable tool for coaches. Join now, use it in the field, and see how it can elevate the way you operate with more clarity, more control, and stronger consistency.",
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
  return <span className="bg-[linear-gradient(90deg,var(--accent-strong),var(--electric))] bg-clip-text italic text-transparent">APEX COACH</span>;
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

function ClientValueCard({ title, text }) {
  return (
    <div className="rounded-[28px] border border-[var(--border)] bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(246,248,247,0.98))] p-6 shadow-[0_10px_28px_rgba(14,17,16,0.05)]">
      <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,var(--accent-soft),rgba(124,77,255,0.08))]">
        <Sparkles size={18} className="text-[var(--accent-strong)]" />
      </div>
      <h3 className="text-xl font-semibold text-[var(--text)]">{renderBrandText(title)}</h3>
      <p className="mt-3 leading-7 text-[var(--text-muted)]">{renderBrandText(text)}</p>
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
          <SectionLabel>{t.clientValueTag}</SectionLabel>
          <div className="mt-5 grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
            <div>
              <h2 className="max-w-3xl text-4xl font-semibold leading-tight text-[var(--text)] sm:text-5xl">{renderBrandText(t.clientValueTitle)}</h2>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-[var(--text-muted)]">{renderBrandText(t.clientValueText)}</p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {t.clientValueCards.map((card) => (
                <ClientValueCard key={card.title} title={card.title} text={card.text} />
              ))}
            </div>
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
