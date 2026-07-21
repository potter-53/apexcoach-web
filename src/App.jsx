import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, Check, ChevronDown, CircleDashed, Clock3, CreditCard, Menu, Smartphone, Sparkles, Target, Users, X } from "lucide-react";

import { trackEvent } from "./lib/analytics";
import { COACH_LANGUAGE_OPTIONS, applyCoachLocale, getInitialBrowserLocale } from "./lib/coach-locale";
import CookieSettingsButton from "./components/CookieSettingsButton";

const appPreviewScreens = [
  { src: "/screenshot_2.jpeg", alt: "APEX COACH client progress screen" },
  { src: "/screenshot_3.jpeg", alt: "APEX COACH client session history screen" },
  { src: "/screenshot_1.jpeg", alt: "APEX COACH sessions screen" },
];
const APK_DOWNLOAD_URL = "/download/apk";

const copy = {
  pt: {
    navProduct: "Produto",
    navFlow: "Operação",
    navPilot: "Resultados",
    navPricing: "Planos",
    navFaq: "FAQ",
    badge: "Build your apex and elevate theirs. A app de uso diário para coaches que trabalham no terreno.",
    titleA: "A APEX COACH",
    titleB: "foi desenhada para",
    titleC: "ter o teu trabalho na palma da mão.",
    subtitle:
      "A APEX COACH foi criada para acompanhar o coach durante o dia real de trabalho: no ginásio, na sessão, entre marcações e no contacto direto com o client. Não é um software de PC adaptado ao mobile. É uma app para gerir clients, sessões, treino, avaliações, PSE, pagamentos e alertas diretamente no smartphone.",
    primaryCta: "Trial grátis 14 dias",
    secondaryCta: "Criar conta",
    downloadCta: "Download APK",
    trust1: "Clients ilimitados",
    trust2: "Periodização e protocolos",
    trust3: "Templates, tags e tracking",
    heroOfferLabel: "50 vagas Coach Fundador",
    heroOfferPrice: "199 EUR",
    heroOfferPeriod: "/ano",
    heroOfferYearly: "equivale a 16,58 EUR/mês",
    heroOfferNote: "Exclusivo para subscrição anual. Válido enquanto a conta e a subscrição se mantiverem ativas.",
    heroStartLabel: "Começar é simples",
    heroStartTitle: "Cria conta, inicia o download da APK e valida o email.",
    heroStartSteps: ["Registo em apexcoach.pt", "Email automático", "Download da APK", "Email validado e login"],
    heroTag: "App de terreno",
    heroTitle: "O coach precisa de agir no momento. A app tem de estar no bolso.",
    heroText:
      "Consulta a próxima sessão, ajusta o treino, regista cargas e notas, acompanha atividades externas, gere PSE e mantém o histórico do client sempre disponível, sem depender de folhas soltas, mensagens ou computador.",
    sectionProduct: "Produto",
    productTitle: "Uma app criada para ser usada todos os dias, no local onde o coach trabalha.",
    productText:
      "A APEX COACH nasce para o contexto real de intervenção: smartphone na mão, sessão a decorrer, decisões rápidas e informação crítica acessível. Foi pensada para reduzir passos desnecessários, clarificar prioridades e transformar o dia a dia numa operação mais organizada, mensurável e consistente.",
    showcaseTag: "Experiência premium",
    showcaseTitle: "Uma app que abre rápido, orienta a sessão e mantém o coach no controlo.",
    showcaseText:
      "O valor está no uso diário: abrir a app, saber o que vem a seguir, tomar decisões com contexto e registar o essencial sem interromper a relação com o client. A experiência deve parecer premium porque ajuda o coach a trabalhar melhor no momento certo.",
    showcaseMoments: [
      {
        label: "01 / Dashboard",
        title: "Prioridades claras logo ao abrir.",
        text: "Agenda, sessões em falta, faturação, packs e avisos devem aparecer como ações, não como ruído.",
      },
      {
        label: "02 / Client",
        title: "Cada client com contexto completo.",
        text: "Detalhes, histórico, avaliações, pagamentos, plano ativo, protocolo e notas ficam ligados ao mesmo perfil.",
      },
      {
        label: "03 / Prescrição",
        title: "Treino criado para ser usado no terreno.",
        text: "Templates, tags, base de exercícios, PSE e tracking ajudam o coach a prescrever melhor sem perder ritmo.",
      },
      {
        label: "04 / Client app",
        title: "O client também sente o valor.",
        text: "O client acompanha o que foi feito, percebe a evolução e ganha uma experiência mais clara e premium.",
      },
    ],
    featureTitle: "O que a app melhora no trabalho diário e no terreno",
    features: [
      "Clients ilimitados sempre acessíveis no smartphone, sem limites artificiais",
      "Registo simples de cargas, notas, contexto e atividades externas durante a sessão",
      "Histórico, progresso e evolução de cada client disponíveis antes de decidir o próximo passo",
      "Periodização semanal e organização por protocolos de treino",
      "Templates, tags e base de exercícios para prescrever com menos fricção no dia a dia",
      "Packs, faturação, avisos e automatismos para reduzir esquecimentos entre sessões",
    ],
    differentiatorTag: "Vantagens claras",
    differentiatorTitle: "Onde a APEX COACH cria vantagem no trabalho real, não apenas no planeamento.",
    differentiatorText:
      "A diferença não está em ter mais um painel bonito para consultar no computador. Está em libertar tempo, reduzir ruído mental e dar ao coach uma ferramenta rápida, móvel e prática para usar antes, durante e depois de cada sessão.",
    differentiators: [
      {
        title: "Mais tempo livre",
        text: "Menos tarefas repetitivas, menos tempo perdido a procurar informação e menos fricção operacional, para que o coach concentre mais energia na orientação técnica e na relação com o client.",
      },
      {
        title: "Gestão de clients mais simples",
        text: "Cada client fica mais fácil de entender, acompanhar e atualizar sem navegação dispersa nem perda de contexto.",
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
        text: "O coach revê a agenda, confirma o client, enquadra o contexto, consulta o protocolo ou a semana planeada e inicia a sessão seguinte com uma linha de ação clara.",
      },
      {
        title: "Durante a sessão",
        text: "Ajusta o treino, gere o PSE, regista notas, acompanha métricas e mantém o foco no client sem comprometer a qualidade da condução da sessão.",
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
      "Tracking global da evolução do client ao longo do tempo",
      "Gestão de PSE, atividades externas e contexto da sessão no mesmo fluxo",
      "Periodização semanal e organização por protocolos de treino",
      "Templates, tags, packs, pagamentos, avisos e automatismos no mesmo sistema",
    ],
    capabilityTag: "Operação do coach",
    capabilityTitle: "O essencial para operar melhor, com mais critério e menos dispersão.",
    capabilityText:
      "Em vez de repetir a mesma promessa em várias secções, este é o núcleo da APEX COACH: organizar clients, conduzir sessões com mais contexto, prescrever melhor e manter o acompanhamento técnico e financeiro no mesmo sistema.",
    capabilityCards: [
      {
        title: "Clients, contexto e histórico",
        text: "Toda a informação crítica do client fica mais acessível: perfil, evolução, avaliações, notas, atividades externas e continuidade do acompanhamento.",
      },
      {
        title: "Treino, periodização e protocolos",
        text: "Prescreve, ajusta e estrutura o trabalho semanal com exercício, templates, tags, periodização e protocolos alinhados com a tua lógica de coaching.",
      },
      {
        title: "Sessões, PSE e execução real",
        text: "Acompanha a sessão no momento certo, regista o que foi feito, gere PSE e toma decisões com menos fricção durante o trabalho de campo.",
      },
      {
        title: "Packs, faturação e automatismos",
        text: "Controla pagamentos, packs, avisos e automatismos sem empurrar a operação para ferramentas soltas e menos integradas.",
      },
    ],
    clientValueTag: "Valor para o client",
    clientValueTitle: "O coach organiza melhor. O client percebe mais valor.",
    clientValueText:
      "A APEX COACH não melhora apenas a operação do coach. Também reforça a experiência do client, porque cria uma app onde pode concentrar o que foi feito, o que está planeado e como a sua evolução está a ser acompanhada.",
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
    onboardingTag: "Como começar",
    onboardingTitle: "O caminho simples do coach até ao primeiro login.",
    onboardingText:
      "Da primeira visita ao site até ao login, o processo foi pensado para ser claro: criar conta, receber o email automático, iniciar o download da APK, confirmar o email e entrar.",
    onboardingSteps: [
      {
        title: "Criar a tua conta",
        text: "A partir de apexcoach.pt, crias uma identidade única de coach e escolhes a modalidade que melhor se adapta ao teu momento.",
      },
      {
        title: "Iniciar download da APK",
        text: "Depois do registo, podes descarregar a APK enquanto confirmas o email automático enviado pela APEX COACH.",
      },
      {
        title: "Confirmar email e fazer login",
        text: "Com o email validado, fazes login e começas a organizar clients, sessões, treinos, assessments e histórico.",
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
        text: "Em vez de procurar informação dispersa, o coach acede ao client e interpreta de forma imediata histórico, progresso, notas e os ajustamentos que devem ser considerados.",
      },
      {
        title: "Trainings mais fluidos",
        text: "A app ajuda o coach a prescrever, consultar e ajustar sessões com muito menos fricção no momento em que está a trabalhar.",
      },
      {
        title: "Assessments com leitura mais clara",
        text: "Os indicadores ficam mais acessíveis, mais comparáveis e mais relevantes para suportar decisões de continuidade e progressão com cada client.",
      },
    ],
    flowTag: "Fluxo do coach",
    flowTitle: "Pensada para acompanhar o coach desde a preparação até ao fecho da sessão.",
    flowCards: [
      { title: "Acesso imediato", text: "Chegar rapidamente à ação certa, sem navegação excessiva nem etapas desnecessárias." },
      { title: "Registo em contexto", text: "Registar notas, ajustar cargas e conduzir a sessão sem comprometer o ritmo do treino." },
      { title: "Acompanhamento qualificado", text: "Interpretar com mais rapidez o que mudou em cada client e decidir com maior segurança técnica." },
    ],
    pilotTag: "Resultados para o coach",
    pilotTitle: "Onde a APEX COACH se traduz em valor concreto para o coach.",
    pilotText:
      "A diferença não está em ter mais uma aplicação. Está em orientar melhor, decidir mais depressa e estruturar a operação sem acrescentar complexidade ao dia de trabalho.",
    pilotPoints: ["Download direto da APK", "Criação de conta imediata", "Acesso rápido", "Uma experiência mais clara e mais profissional"],
    proofTitle: "O que um coach deve sentir ao usar a app",
    proofItems: [
      "Menos tempo perdido a procurar informação",
      "Mais segurança na continuidade entre sessões e protocolos",
      "Mais consistência no acompanhamento dos clients",
      "Mais controlo sobre o que foi feito, o que mudou e o que vem a seguir",
    ],
    pricingTag: "Planos",
    pricingTitle: "Duas modalidades. Um plano normal e uma oportunidade limitada para Coach Fundador.",
    pricingText:
      "O coach pode entrar pela subscrição normal ou garantir uma das 50 vagas Coach Fundador com subscrição anual. A diferença está no preço, no estatuto e no acesso antecipado ao crescimento da app.",
    foundationLabel: "Coach Fundador",
    foundationTitle: "50 vagas para coaches que querem entrar primeiro",
    founderSpotsBadge: "50 vagas",
    monthlyLabel: "Mensal",
    yearlyLabel: "Anual",
    equivalentLabel: "Equivalência",
    foundationMonthly: "16,58 EUR/mês",
    foundationYearly: "199 EUR/ano",
    foundationNote: "Requer subscrição anual. Conta válida enquanto a subscrição estiver ativa.",
    foundationBenefits: [
      "Badge exclusivo de Coach Fundador",
      "Acesso aos updates primeiro",
      "Acesso ao fórum de crescimento da app",
      "Referral code com trial de 21 dias para coaches convidados",
    ],
    regularLabel: "Coach",
    regularTitle: "Subscrição normal da APEX COACH",
    regularMonthly: "29,90 EUR/mês",
    regularYearly: "299 EUR/ano",
    regularNote: "Pode aderir a Coach Fundador com subscrição anual se ainda houver vagas disponíveis. Também pode desbloquear elegibilidade ao referir 5 coaches que adiram a qualquer plano.",
    regularBenefits: [
      "Acesso completo à app mobile",
      "Plano mensal ou anual",
      "Clients ilimitados e ferramentas de sessão",
      "Possibilidade de entrar como Fundador se cumprir os requisitos",
    ],
    pricingBullets: [
      "Coach Fundador: 50 vagas, subscrição anual e estatuto exclusivo",
      "Coach normal: 29,90 EUR/mês ou 299 EUR/ano",
      "Referral code de Fundador dá trial de 21 dias aos coaches convidados",
      "A conta mantém as condições enquanto a subscrição estiver ativa",
    ],
    faqTag: "FAQ",
    faqTitle: "Perguntas frequentes",
    faqItems: [
      { title: "Que modalidades existem?", text: "Existem duas modalidades em vigor: Coach e Coach Fundador. O plano Coach pode ser mensal ou anual. O Coach Fundador é limitado a 50 vagas, requer subscrição anual e inclui vantagens exclusivas associadas ao crescimento da APEX COACH." },
      { title: "O que é o Coach Fundador e como funciona?", text: "Coach Fundador é a modalidade limitada para os primeiros 50 coaches. Requer subscrição anual de 199 EUR, equivalente a 16,58 EUR por mês, e mantém as condições enquanto a conta e a subscrição estiverem ativas." },
      { title: "Que vantagens tem o Coach Fundador?", text: "O Coach Fundador recebe badge exclusivo, acesso aos updates primeiro, acesso ao fórum de crescimento da app e um referral code que oferece trial de 21 dias aos coaches convidados." },
      { title: "Um Coach normal pode tornar-se Coach Fundador?", text: "Sim, se aderir à subscrição anual e ainda existirem vagas disponíveis. Também pode desbloquear essa elegibilidade ao referir 5 coaches que adiram a qualquer um dos planos." },
      { title: "Para que perfil de coach foi pensada a APEX COACH?", text: "A app foi pensada para coaches que precisam de operar com mais critério técnico, mais velocidade de execução e maior consistência no acompanhamento dos seus clients, quer trabalhem com performance, saúde, recomposição corporal ou acompanhamento híbrido." },
      { title: "Posso trabalhar com clients ilimitados?", text: "Sim. A estrutura da app foi desenhada para acompanhar a operação do coach sem impor limites artificiais ao número de clients, permitindo crescer a carteira de acompanhamento sem perder organização nem contexto." },
      { title: "A app permite acompanhar atividades externas do client?", text: "Sim. O coach pode registar contexto adicional e atividades realizadas fora da sessão principal, o que melhora a leitura da carga global, da recuperação, do volume acumulado e da continuidade do processo." },
      { title: "É possível organizar periodização e protocolos de treino?", text: "Sim. A APEX COACH suporta uma lógica de organização por semanas, blocos e protocolos, permitindo estruturar a progressão do client com maior clareza e manter uma leitura mais consistente do plano em execução." },
      { title: "Posso criar templates e usar tags para acelerar a prescrição?", text: "Sim. A app permite criar templates reutilizáveis e aplicar tags para classificar melhor exercícios, sessões e estruturas de trabalho. Isto reduz repetição manual e ajuda a tornar a operação diária mais consistente." },
      { title: "A base de dados de exercícios serve apenas para consulta?", text: "Não. A base de dados de exercícios serve como suporte ativo à preparação, adaptação e repetição do treino. O objetivo não é apenas consultar exercícios, mas acelerar decisões de prescrição com mais consistência técnica." },
      { title: "A faturação dos clients pode ser acompanhada na app?", text: "Sim. A APEX COACH foi pensada para concentrar também a componente de packs, pagamentos, avisos e seguimento financeiro do client, reduzindo a necessidade de sistemas paralelos para controlo operacional." },
      { title: "O client consegue perceber o que foi feito e acompanhar a evolução?", text: "Sim. A estrutura da app foi desenhada para que o coach consiga registar o que foi prescrito, o que foi executado e o que mudou ao longo do tempo, criando uma visão mais clara da evolução global do client." },
    ],
    closingTitle: "Se procuras uma operação mais fluida, mais rigorosa e mais profissional, este é o momento certo para entrar.",
    closingText:
      "A APEX COACH está a evoluir para se afirmar como uma ferramenta cada vez mais rápida, intuitiva e valiosa para o coach. Entra agora, experimenta no terreno e percebe como podes gerir a tua operação com mais clareza, mais controlo e maior consistência.",
    closingPrimary: "Criar conta",
    closingSecondary: "Fazer download da APK",
    modalTitle: "Quero começar a usar a APEX COACH",
    modalText:
      "A APEX COACH foi criada para coaches que procuram maior fluidez operacional, maior rapidez de execução e maior segurança no acompanhamento diário. Cria a tua conta e entra na app.",
    modalPrimary: "Criar conta",
    modalSecondary: "Fazer login",
    closeLabel: "Fechar",
    login: "Login",
    signup: "Criar conta",
    backline: "Build your apex and elevate theirs. A experiência web está planeada para uma próxima fase. Neste momento, o foco é uma app mobile mais forte para o trabalho real do coach.",
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
    badge: "Build your apex and elevate theirs. The daily field app for coaches who work on the floor.",
    titleA: "APEX COACH",
    titleB: "was designed to",
    titleC: "keep your work in your hand.",
    subtitle:
      "APEX COACH was built to follow the coach through the real working day: in the gym, inside the session, between bookings, and in direct contact with the client. It is not desktop software squeezed into mobile. It is a smartphone app for managing clients, sessions, training, assessments, RPE, payments, and alerts in the palm of your hand.",
    primaryCta: "Start 14-day free trial",
    secondaryCta: "Create account",
    downloadCta: "Download APK",
    trust1: "Unlimited clients",
    trust2: "Periodization and protocols",
    trust3: "Templates, tags, and tracking",
    heroOfferLabel: "50 Founder Coach spots",
    heroOfferPrice: "EUR 199",
    heroOfferPeriod: "/year",
    heroOfferYearly: "equals EUR 16.58/month",
    heroOfferNote: "Annual subscription required. Valid while the account and subscription remain active.",
    heroStartLabel: "Simple to start",
    heroStartTitle: "Create your account, start the APK download, and verify your email.",
    heroStartSteps: ["Register at apexcoach.pt", "Automatic email", "APK download", "Verified email and login"],
    heroTag: "Field app",
    heroTitle: "Coaches need to act in the moment. The app has to be in the pocket.",
    heroText:
      "Open the next session, adjust training, log loads and notes, track external activity, manage RPE, and keep each client's history available without relying on scattered sheets, messages, or a computer.",
    sectionProduct: "Product",
    productTitle: "An app built to be used every day, exactly where coaches work.",
    productText:
      "APEX COACH is designed for real intervention: smartphone in hand, session in progress, quick decisions, and critical information instantly available. It reduces unnecessary steps, clarifies priorities, and turns daily work into a more organized, measurable, and consistent operation.",
    showcaseTag: "Premium experience",
    showcaseTitle: "An app that opens fast, guides the session, and keeps the coach in control.",
    showcaseText:
      "The value is in daily use: open the app, know what comes next, make decisions with context, and record the essentials without interrupting the relationship with the client. The experience feels premium because it helps the coach work better at the right moment.",
    showcaseMoments: [
      {
        label: "01 / Dashboard",
        title: "Clear priorities from the first open.",
        text: "Agenda, missing sessions, billing, expiring packs, and alerts should appear as actions, not noise.",
      },
      {
        label: "02 / Client",
        title: "Every client with complete context.",
        text: "Details, history, assessments, payments, active plan, protocol, and notes stay connected to the same profile.",
      },
      {
        label: "03 / Prescription",
        title: "Training built to be used in the field.",
        text: "Templates, tags, exercise database, RPE, and tracking help the coach prescribe better without losing rhythm.",
      },
      {
        label: "04 / Client app",
        title: "The client feels the value too.",
        text: "Clients can follow what was done, understand progress, and experience a clearer, more premium coaching service.",
      },
    ],
    featureTitle: "What the app improves in daily field work",
    features: [
      "Unlimited clients always accessible on the smartphone, without artificial limits",
      "Simple logging of loads, notes, context, and external activities during the session",
      "Client history, progress, and evolution available before the next decision",
      "Weekly periodization and structured training protocols",
      "Templates, tags, and exercise database to prescribe with less friction day to day",
      "Packs, billing, alerts, and automations to reduce missed follow-ups between sessions",
    ],
    differentiatorTag: "Clear advantages",
    differentiatorTitle: "Where APEX COACH creates advantage in real work, not just planning.",
    differentiatorText:
      "The difference is not having another nice dashboard to check on a computer. It is about freeing time, reducing mental noise, and giving coaches a fast, mobile, practical tool to use before, during, and after every session.",
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
    capabilityTag: "Coach operation",
    capabilityTitle: "What really matters when the goal is to run a stronger coaching operation.",
    capabilityText:
      "Instead of repeating the same promise across multiple sections, this is the core of APEX COACH: organize clients, run sessions with stronger context, prescribe more clearly, and keep technical and financial follow-up inside one system.",
    capabilityCards: [
      {
        title: "Clients, context, and history",
        text: "Critical client information becomes easier to access: profile, progress, assessments, notes, external activities, and continuity across follow-up.",
      },
      {
        title: "Training, periodization, and protocols",
        text: "Prescribe, adjust, and structure weekly work with exercises, templates, tags, periodization, and protocols aligned with your coaching logic.",
      },
      {
        title: "Sessions, RPE, and real execution",
        text: "Support the live session, log what actually happened, manage RPE, and make decisions with less friction while coaching in the field.",
      },
      {
        title: "Billing, packs, and automations",
        text: "Track payments, packages, alerts, and automations without pushing the operation into disconnected tools.",
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
    onboardingTag: "How to start",
    onboardingTitle: "The simple path from first visit to first login.",
    onboardingText:
      "From the first visit to the site through login, the process is clear: create an account, receive the automatic email, start the APK download, confirm your email, and enter.",
    onboardingSteps: [
      {
        title: "Create your account",
        text: "From apexcoach.pt, create a single coach identity and choose the modality that best fits your current stage.",
      },
      {
        title: "Start the APK download",
        text: "After registration, download the APK while confirming the automatic email sent by APEX COACH.",
      },
      {
        title: "Confirm email and sign in",
        text: "With your email verified, sign in and start organizing clients, sessions, training, assessments, and history.",
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
      "The difference is not simply having another app. It is about making better decisions, responding faster, and structuring the operation without adding complexity to the working day.",
    pilotPoints: ["Direct APK download", "Immediate account creation", "Fast access", "A clearer and more professional experience"],
    proofTitle: "What a coach should feel while using the app",
    proofItems: [
      "Less time lost searching for information",
      "More confidence in continuity between sessions and protocols",
      "More consistency in client follow-up",
      "More control over what happened, what changed, and what comes next",
    ],
    pricingTag: "Pricing",
    pricingTitle: "Two modalities. A regular Coach plan and a limited Founder Coach opportunity.",
    pricingText:
      "Coaches can enter through the regular subscription or secure one of 50 Founder Coach spots with an annual subscription. The difference is price, status, and early access to the app's growth.",
    foundationLabel: "Founder Coach",
    foundationTitle: "50 spots for coaches who want to join first",
    founderSpotsBadge: "50 spots",
    monthlyLabel: "Monthly",
    yearlyLabel: "Yearly",
    equivalentLabel: "Equivalent",
    foundationMonthly: "EUR 16.58/month",
    foundationYearly: "EUR 199/year",
    foundationNote: "Annual subscription required. Account remains valid while the subscription is active.",
    foundationBenefits: [
      "Exclusive Founder Coach badge",
      "Early access to updates",
      "Access to the app growth forum",
      "Referral code with a 21-day trial for invited coaches",
    ],
    regularLabel: "Coach",
    regularTitle: "Regular APEX COACH subscription",
    regularMonthly: "EUR 29.90/month",
    regularYearly: "EUR 299/year",
    regularNote: "Can join Founder Coach with an annual subscription if spots are still available. Coaches can also unlock eligibility by referring 5 coaches who subscribe to any plan.",
    regularBenefits: [
      "Full access to the mobile app",
      "Monthly or annual plan",
      "Unlimited clients and session tools",
      "Possibility to join Founder if requirements are met",
    ],
    pricingBullets: [
      "Founder Coach: 50 spots, annual subscription, and exclusive status",
      "Regular Coach: EUR 29.90/month or EUR 299/year",
      "Founder referral code gives invited coaches a 21-day trial",
      "Conditions remain active while the subscription is active",
    ],
    faqTag: "FAQ",
    faqTitle: "Frequently asked questions",
    faqItems: [
      { title: "Which modalities are available?", text: "There are two active modalities: Coach and Founder Coach. The Coach plan can be monthly or annual. Founder Coach is limited to 50 spots, requires an annual subscription, and includes exclusive benefits connected to the growth of APEX COACH." },
      { title: "What is Founder Coach and how does it work?", text: "Founder Coach is the limited modality for the first 50 coaches. It requires a EUR 199 annual subscription, equivalent to EUR 16.58 per month, and keeps its conditions while the account and subscription remain active." },
      { title: "What benefits does Founder Coach include?", text: "Founder Coach includes an exclusive badge, early access to updates, access to the app growth forum, and a referral code that gives invited coaches a 21-day trial." },
      { title: "Can a regular Coach become Founder Coach?", text: "Yes, by choosing the annual subscription if spots are still available. A coach can also unlock eligibility by referring 5 coaches who subscribe to any plan." },
      { title: "Who is APEX COACH built for?", text: "The app was built for coaches who need stronger technical structure, faster execution, and greater consistency in client follow-up, whether they work in performance, health, body composition, or hybrid coaching environments." },
      { title: "Can I work with unlimited clients?", text: "Yes. The app structure was designed to support the coach's operation without artificial limits on the number of clients, allowing the business to grow without losing clarity or control." },
      { title: "Can the app track external client activities?", text: "Yes. The coach can log relevant activity performed outside the main session, creating stronger context for load management, recovery interpretation, accumulated volume, and decision-making." },
      { title: "Does the app support periodization and structured protocols?", text: "Yes. APEX COACH supports organization by weeks, blocks, and training protocols, allowing the coach to manage progression with more structure and a clearer reading of the plan in execution." },
      { title: "Can I create templates and use tags?", text: "Yes. The app allows reusable templates and tagging logic to classify exercises, sessions, and work structures. This reduces manual repetition and helps make the daily operation more consistent." },
      { title: "Is the exercise database only for consultation?", text: "No. The exercise database is meant to actively support training preparation, adaptation, and repetition. The goal is not just to view exercises, but to accelerate prescription decisions with stronger technical consistency." },
      { title: "Can client billing be managed inside the app?", text: "Yes. APEX COACH was designed to concentrate packs, payments, alerts, and financial follow-up inside the same operational flow, reducing the need for parallel systems." },
      { title: "Can the client understand what was done and follow overall progress?", text: "Yes. The app structure helps the coach register what was prescribed, what was executed, and what changed over time, creating a clearer view of the client's overall evolution." },
    ],
    closingTitle: "If you are looking for a more fluid, more rigorous, and more professional operation, this is the right time to join.",
    closingText:
      "APEX COACH is evolving to establish itself as a faster, more intuitive, and more valuable tool for coaches. Join now, use it in the field, and see how you can run your operation with more clarity, more control, and stronger consistency.",
    closingPrimary: "Create account",
    closingSecondary: "Download APK",
    modalTitle: "I want to start using APEX COACH",
    modalText:
      "APEX COACH was built for coaches seeking greater operational flow, faster execution, and more confidence in daily follow-up. Create your account and enter the app.",
    modalPrimary: "Create account",
    modalSecondary: "Login",
    closeLabel: "Close",
    login: "Login",
    signup: "Sign up",
    backline: "Build your apex and elevate theirs. The web experience is planned for a future phase. Right now, the focus is a stronger mobile app for real coaching work.",
    floatingSessionLabel: "Session mode",
    floatingSessionText: "Speed when it matters",
    floatingPilotLabel: "More control",
    floatingPilotText: "An app built for the coach's real working day",
  },
};

function SectionLabel({ children }) {
  return <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--accent)] sm:text-xs sm:tracking-[0.28em]">{children}</p>;
}

function BrandLogoIcon({ className = "h-8 w-auto sm:h-10" }) {
  return (
    <img src="/main_logo_white.png" alt="" aria-hidden="true" className={className} />
  );
}

function BrandMark({ neutralClass = "text-[var(--text)]", sizeClass = "text-inherit", compact = false }) {
  return (
    <span className={`inline-flex items-baseline ${compact ? "gap-1.5" : "gap-2.5"} italic ${sizeClass}`}>
      <span className={`text-current ${neutralClass}`}>APEX</span>
      <span className="inline-block bg-[image:var(--brand-gradient)] bg-clip-text text-transparent">COACH</span>
    </span>
  );
}

function BrandLockup() {
  return (
    <span className="inline-flex h-10 items-center rounded-full border border-[var(--border)] bg-white px-2.5 shadow-[var(--shadow-soft)] sm:h-[52px] sm:px-4">
      <img src="/main_logo_white.png" alt="APEX COACH" className="h-7 w-auto max-w-[128px] object-contain sm:h-9 sm:max-w-[178px]" />
    </span>
  );
}

function renderBrandText(text) {
  if (typeof text !== "string") return text;
  const normalized = text.replace(/\*APEX COACH\*/g, "APEX COACH");
  const parts = normalized.split("APEX COACH");
  return parts.flatMap((part, index) => (index === parts.length - 1 ? [part] : [part, <BrandMark key={`brand-${index}`} compact sizeClass="text-inherit" />]));
}

function Chip({ children }) {
  return <div className="rounded-full border border-[var(--border)] bg-white px-3 py-1.5 text-xs text-[var(--text-muted)] sm:px-4 sm:py-2 sm:text-sm">{children}</div>;
}

function HeroConversionPanel({ t }) {
  return (
    <div className="mt-5 grid gap-3 sm:mt-10 lg:grid-cols-[0.86fr_1.14fr]">
      <div className="rounded-[18px] border border-[var(--accent)]/35 bg-[linear-gradient(135deg,var(--accent-soft),#ffffff_72%)] p-3.5 shadow-[var(--shadow-soft)] sm:p-4">
        <p className="text-[9px] font-semibold uppercase tracking-[0.16em] text-[var(--accent-strong)] sm:text-[10px] sm:tracking-[0.18em]">{t.heroOfferLabel}</p>
        <div className="mt-2.5 flex items-end gap-1.5 sm:mt-3">
          <span className="text-3xl font-semibold leading-none text-[var(--text)] sm:text-4xl">{t.heroOfferPrice}</span>
          <span className="pb-1 text-sm font-semibold text-[var(--text-muted)]">{t.heroOfferPeriod}</span>
        </div>
        <p className="mt-2 text-sm font-semibold text-[var(--accent-strong)]">{t.heroOfferYearly}</p>
        <p className="mt-2 text-[11px] leading-5 text-[var(--text-muted)] sm:mt-3 sm:text-xs">{t.heroOfferNote}</p>
      </div>

      <div className="rounded-[18px] border border-[var(--border)] bg-white p-3.5 shadow-[var(--shadow-soft)] sm:p-4">
        <p className="text-[9px] font-semibold uppercase tracking-[0.16em] text-[var(--text-muted)] sm:text-[10px] sm:tracking-[0.18em]">{t.heroStartLabel}</p>
        <h2 className="mt-2 text-lg font-semibold leading-tight text-[var(--text)]">{t.heroStartTitle}</h2>
        <div className="mt-3 grid gap-2 sm:mt-4">
          {t.heroStartSteps.map((step) => (
            <div key={step} className="flex items-center gap-2 rounded-[14px] border border-[var(--border)] bg-[var(--surface-muted)] px-3 py-2 text-[11px] font-medium text-[var(--text)] sm:text-sm">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[var(--accent)] text-[var(--accent-foreground)]">
                <Check size={14} strokeWidth={3} />
              </span>
              {step}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function FlowCard({ step, title, text }) {
  return (
    <div className="rounded-[16px] border border-[var(--border)] bg-[var(--surface-solid)] p-4 shadow-[var(--shadow-soft)] sm:p-5">
      <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-[14px] border border-[var(--accent)]/25 bg-[var(--accent-soft)] text-sm font-semibold text-[var(--accent-strong)] sm:mb-5 sm:h-11 sm:w-11">
        {step}
      </div>
      <h3 className="text-xl font-semibold text-[var(--text)] sm:text-2xl">{renderBrandText(title)}</h3>
      <p className="mt-3 text-sm leading-7 text-[var(--text-muted)] sm:mt-4 sm:text-base sm:leading-8">{renderBrandText(text)}</p>
    </div>
  );
}

function FeatureItem({ children }) {
  return (
    <div className="flex items-start gap-2.5 rounded-[14px] border border-[var(--border)] bg-[var(--surface-solid)] px-3 py-2.5 shadow-[0_8px_24px_rgba(14,17,16,0.04)] sm:gap-3 sm:rounded-2xl sm:px-4 sm:py-3">
      <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[var(--accent-soft)] sm:h-6 sm:w-6">
        <Check size={13} className="text-[var(--accent-strong)] sm:size-[14px]" />
      </div>
      <p className="text-sm leading-6 text-[var(--text-muted)] sm:text-base">{children}</p>
    </div>
  );
}

function DetailCard({ title, text }) {
  return (
    <div className="rounded-[16px] border border-[var(--border)] bg-white p-4 shadow-[var(--shadow-soft)] sm:p-5">
      <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-[14px] bg-[var(--accent-soft)]">
        <Target size={18} className="text-[var(--accent-strong)]" />
      </div>
      <h3 className="text-lg font-semibold text-[var(--text)] sm:text-xl">{renderBrandText(title)}</h3>
      <p className="mt-3 text-sm leading-7 text-[var(--text-muted)] sm:text-base">{renderBrandText(text)}</p>
    </div>
  );
}

function DifferentiatorCard({ title, text, icon: Icon }) {
  return (
    <div className="rounded-[16px] border border-[var(--border)] bg-[var(--surface-solid)] p-4 shadow-[var(--shadow-soft)] sm:p-5">
      <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-[14px] bg-[var(--accent-soft)]">
        <Icon size={18} className="text-[var(--accent-strong)]" />
      </div>
      <h3 className="text-lg font-semibold text-[var(--text)] sm:text-xl">{renderBrandText(title)}</h3>
      <p className="mt-3 text-sm leading-7 text-[var(--text-muted)] sm:text-base">{renderBrandText(text)}</p>
    </div>
  );
}

function ScenarioCard({ title, text }) {
  return (
    <div className="rounded-[16px] border border-[var(--border)] bg-white p-4 shadow-[var(--shadow-soft)] sm:p-5">
      <div className="mb-4 inline-flex rounded-full border border-[var(--border)] bg-[var(--surface-muted)] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--text-muted)]">
        {renderBrandText(title)}
      </div>
      <p className="text-sm leading-7 text-[var(--text-muted)] sm:text-base">{renderBrandText(text)}</p>
    </div>
  );
}

function CapabilityCard({ title, text }) {
  return (
    <div className="rounded-[16px] border border-[var(--border)] bg-white p-5 shadow-[var(--shadow-soft)]">
      <div className="mb-4 inline-flex rounded-full border border-[var(--accent)]/20 bg-[var(--accent-soft)] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--accent-strong)]">
        {renderBrandText(title)}
      </div>
      <p className="text-sm leading-7 text-[var(--text-muted)] sm:text-base">{renderBrandText(text)}</p>
    </div>
  );
}

function ClientValueCard({ title, text }) {
  return (
    <div className="rounded-[16px] border border-[var(--border)] bg-[var(--surface-solid)] p-4 shadow-[var(--shadow-soft)] sm:p-5">
      <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-[14px] bg-[var(--accent-soft)] sm:mb-4 sm:h-11 sm:w-11">
        <Sparkles size={17} className="text-[var(--accent-strong)] sm:size-[18px]" />
      </div>
      <h3 className="text-base font-semibold text-[var(--text)] sm:text-xl">{renderBrandText(title)}</h3>
      <p className="mt-2 text-sm leading-6 text-[var(--text-muted)] sm:mt-3 sm:text-base sm:leading-7">{renderBrandText(text)}</p>
    </div>
  );
}

function PricingCard({ label, title, monthly, yearly, note, benefits = [], monthlyLabel = "Monthly", yearlyLabel = "Yearly", equivalentLabel = "Equivalent", spotsBadge, accent = false }) {
  return (
    <div className={`rounded-[18px] border p-4 shadow-[var(--shadow-soft)] sm:p-6 ${accent ? "border-[var(--accent)] bg-[linear-gradient(135deg,var(--accent-soft),rgba(255,255,255,0.98))]" : "border-[var(--border)] bg-white"}`}>
      <div className="flex flex-wrap items-center gap-2">
        <div className={`inline-flex rounded-full border px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] sm:text-[11px] sm:tracking-[0.14em] ${accent ? "border-[var(--accent)]/30 bg-white text-[var(--accent-strong)]" : "border-[var(--border)] bg-white text-[var(--text-muted)]"}`}>
          {label}
        </div>
        {accent ? (
          <div className="inline-flex rounded-full border border-[var(--accent)]/25 bg-[var(--accent)] px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-[var(--accent-foreground)]">
            {spotsBadge}
          </div>
        ) : null}
      </div>
      <h3 className="mt-3 text-lg font-semibold text-[var(--text)] sm:mt-4 sm:text-2xl">{title}</h3>
      <div className="mt-4 grid gap-3 sm:mt-6 sm:grid-cols-2">
        <div className="rounded-[16px] border border-[var(--border)] bg-white px-3 py-3 sm:px-4 sm:py-4">
          <p className="text-[11px] uppercase tracking-[0.14em] text-[var(--text-muted)]">{accent ? equivalentLabel : monthlyLabel}</p>
          <p className="mt-1.5 text-2xl font-semibold text-[var(--text)] sm:mt-2 sm:text-3xl">{monthly}</p>
        </div>
        <div className="rounded-[16px] border border-[var(--border)] bg-white px-3 py-3 sm:px-4 sm:py-4">
          <p className="text-[11px] uppercase tracking-[0.14em] text-[var(--text-muted)]">{yearlyLabel}</p>
          <p className="mt-1.5 text-2xl font-semibold text-[var(--text)] sm:mt-2 sm:text-3xl">{yearly}</p>
        </div>
      </div>
      {note ? <p className="mt-3 text-xs leading-6 text-[var(--text-muted)] sm:mt-4 sm:text-sm sm:leading-7">{note}</p> : null}
      {benefits.length ? (
        <div className="mt-4 grid gap-2.5">
          {benefits.map((benefit) => (
            <div key={benefit} className="flex items-start gap-2.5 text-xs leading-5 text-[var(--text-muted)] sm:text-sm sm:leading-6">
              <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[var(--accent-soft)] text-[var(--accent-strong)]">
                <Check size={12} strokeWidth={3} />
              </span>
              <span>{benefit}</span>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}

function ProductMatrix({ lang = "en" }) {
  const isPt = lang === "pt";
  const headers = isPt
    ? ["Função", "Trainerize", "PT Distinction", "Everfit", "EliteTrainer", "APEX COACH [beta]", "APEX COACH [final]"]
    : ["Function", "Trainerize", "PT Distinction", "Everfit", "EliteTrainer", "APEX COACH [beta]", "APEX COACH [final]"];

  const rows = isPt
    ? [
        ["Preço base", "$9/mês", "$19,90/mês", "Grátis / $19/mês", "33 EUR/mês", "199 EUR/ano", "29,90 EUR/mês"],
        ["Registar clients", "yes", "yes", "yes", "yes", "yes", "yes"],
        ["Registar assessments", "partial", "yes", "partial", "yes", "yes", "yes"],
        ["Criar treinos", "yes", "yes", "yes", "yes", "yes", "yes"],
        ["Base de dados de exercícios", "yes", "partial", "yes", "partial", "yes", "yes"],
        ["Periodização semanal", "partial", "yes", "yes", "partial", "yes", "yes"],
        ["Protocolos de treino", "partial", "yes", "yes", "partial", "yes", "yes"],
        ["Templates e tags", "yes", "yes", "partial", "partial", "yes", "yes"],
        ["Atividades externas", "no", "yes", "partial", "partial", "yes", "yes"],
        ["Tracking global da evolução", "partial", "yes", "yes", "yes", "yes", "yes"],
        ["Gestão de PSE", "no", "partial", "partial", "no", "yes", "yes"],
        ["Faturação e packs", "yes", "yes", "yes", "yes", "yes", "yes"],
        ["App para o client", "yes", "yes", "yes", "yes", "yes", "yes"],
        ["Plataforma web", "yes", "yes", "yes", "yes", "no", "yes"],
        ["Health app connect", "yes", "partial", "partial", "no", "no", "yes"],
        ["Automatismos", "partial", "yes", "yes", "no", "partial", "yes"],
      ]
    : [
        ["Entry price", "$9/mo", "$19.90/mo", "Free / $19/mo", "€33/mo", "€199/year", "€29.90/mo"],
        ["Register clients", "yes", "yes", "yes", "yes", "yes", "yes"],
        ["Register assessments", "partial", "yes", "partial", "yes", "yes", "yes"],
        ["Create training", "yes", "yes", "yes", "yes", "yes", "yes"],
        ["Exercise database", "yes", "partial", "yes", "partial", "yes", "yes"],
        ["Weekly periodization", "partial", "yes", "yes", "partial", "yes", "yes"],
        ["Training protocols", "partial", "yes", "yes", "partial", "yes", "yes"],
        ["Templates and tags", "yes", "yes", "partial", "partial", "yes", "yes"],
        ["External activities", "no", "yes", "partial", "partial", "yes", "yes"],
        ["Global progress tracking", "partial", "yes", "yes", "yes", "yes", "yes"],
        ["RPE management", "no", "partial", "partial", "no", "yes", "yes"],
        ["Billing and packs", "yes", "yes", "yes", "yes", "yes", "yes"],
        ["Client app", "yes", "yes", "yes", "yes", "yes", "yes"],
        ["Web platform", "yes", "yes", "yes", "yes", "no", "yes"],
        ["Health app connect", "yes", "partial", "partial", "no", "no", "yes"],
        ["Automations", "partial", "yes", "yes", "no", "partial", "yes"],
      ];

  function renderStatus(value) {
    const status = String(value).toLowerCase();
    const config = {
      yes: {
        icon: <Check size={14} />,
        className: "border-emerald-200 bg-emerald-50 text-emerald-700",
        label: isPt ? "Disponível" : "Available",
      },
      no: {
        icon: <X size={14} />,
        className: "border-rose-200 bg-rose-50 text-rose-700",
        label: isPt ? "Não" : "No",
      },
      partial: {
        icon: <CircleDashed size={14} />,
        className: "border-amber-200 bg-amber-50 text-amber-700",
        label: isPt ? "Parcial" : "Partial",
      },
    }[status];

    if (!config) {
      return (
        <span className="inline-flex whitespace-nowrap rounded-full border border-[var(--border)] bg-[var(--surface-solid)] px-3 py-1.5 text-xs font-semibold text-[var(--text)]">
          {value}
        </span>
      );
    }

    return (
      <span className={`inline-flex h-8 w-8 items-center justify-center rounded-full border ${config.className}`} title={config.label} aria-label={config.label}>
        {config.icon}
      </span>
    );
  }

  return (
    <div className="w-full min-w-0 overflow-hidden rounded-[18px] border border-[var(--border-strong)] bg-white shadow-[var(--shadow-panel)]">
      <div className="border-b border-[var(--border)] bg-[var(--surface-muted)]/65 px-4 py-3 text-[11px] font-medium leading-6 text-[var(--text-muted)] sm:px-5">
        {isPt ? "Desliza lateralmente dentro da tabela para comparar todas as apps." : "Swipe horizontally inside the table to compare every app."}
      </div>
      <div className="max-w-full overflow-x-auto overscroll-x-contain [-webkit-overflow-scrolling:touch]">
        <table className="min-w-[980px] border-collapse text-left lg:min-w-[1040px]">
          <thead className="bg-[var(--accent-soft)]">
            <tr>
              {headers.map((header, index) => (
                <th
                  key={header}
                  className={`sticky top-0 px-2.5 py-3 text-[10px] font-semibold leading-4 text-[var(--text)] sm:px-4 sm:text-xs sm:leading-5 ${index === 0 ? "left-0 z-30 min-w-[136px] bg-[var(--accent-soft)]" : index === 5 ? "z-20 min-w-[112px] bg-[rgba(57,185,138,0.14)]" : "z-20 min-w-[112px] bg-[var(--accent-soft)]"}`}
                >
                  <span className="block whitespace-normal break-words">{header}</span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, rowIndex) => (
              <tr key={row[0]} className={rowIndex % 2 === 0 ? "bg-white" : "bg-[var(--surface-muted)]/55"}>
                <td className="border-t border-[var(--border)] p-0 align-top text-sm leading-7 text-[var(--text)]">
                  <span
                    className={`sticky left-0 z-10 block min-w-[136px] border-r border-[var(--border)] px-2.5 py-3 text-[10px] font-semibold leading-4 text-[var(--text)] sm:px-4 sm:text-xs sm:leading-5 ${rowIndex % 2 === 0 ? "bg-white" : "bg-[var(--surface-muted)]/55"}`}
                  >
                    {row[0]}
                  </span>
                </td>
                {row.slice(1).map((value, index) => (
                  <td
                    key={`${row[0]}-${index}`}
                    className={`border-t border-[var(--border)] px-2.5 py-3 align-top text-center text-[10px] leading-4 text-[var(--text-muted)] sm:px-4 sm:text-xs sm:leading-5 ${index === 4 ? "bg-[rgba(57,185,138,0.08)]" : ""}`}
                  >
                    <div className="flex justify-center">{renderStatus(value)}</div>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="border-t border-[var(--border)] bg-[var(--surface-muted)]/65 px-4 py-3 sm:px-5 sm:py-4">
        <div className="flex flex-wrap gap-2 text-[11px] font-medium text-[var(--text-muted)] sm:gap-3 sm:text-xs">
          {[
            { key: "yes", label: isPt ? "Disponível" : "Available" },
            { key: "partial", label: isPt ? "Parcial" : "Partial" },
            { key: "no", label: isPt ? "Não disponível" : "Not available" },
          ].map((item) => (
            <div key={item.key} className="inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-white px-2.5 py-1.5 sm:px-3 sm:py-2">
              {renderStatus(item.key)}
              <span>{item.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function PhoneMock({ screens = appPreviewScreens }) {
  return (
    <div className="phone-stage relative mx-auto w-[178px] rounded-[20px] border border-[var(--border-strong)] bg-[#111413] p-1.5 shadow-[var(--shadow-panel)] sm:w-[290px] sm:rounded-[28px] sm:p-2.5">
      <div className="relative overflow-hidden rounded-[18px] border border-white/10 bg-black sm:rounded-[22px]">
        <div className="absolute left-1/2 top-2 z-10 h-3.5 w-20 -translate-x-1/2 rounded-full bg-black sm:top-3 sm:h-5 sm:w-28" />
        <div className="relative h-[360px] w-full sm:h-[590px]">
          {screens.map((screen, index) => (
            <img
              key={screen.src}
              src={screen.src}
              alt={screen.alt}
              className={`app-preview-slide app-preview-slide-${index + 1} absolute inset-0 h-full w-full object-cover object-top`}
            />
          ))}
        </div>
        <div className="app-launch-overlay absolute inset-0 flex flex-col items-center justify-center bg-white px-8 text-center">
          <img src="/main_logo_white.png" alt="APEX COACH" className="h-auto w-44 object-contain" />
          <p className="mt-3 text-xs font-medium text-[var(--text-muted)]">Coach workspace ready</p>
          <div className="mt-7 h-1.5 w-28 overflow-hidden rounded-full bg-[var(--surface-muted)]">
            <div className="app-launch-progress h-full rounded-full bg-[var(--accent)]" />
          </div>
        </div>
      </div>
    </div>
  );
}

function ExperienceMomentCard({ moment, index, active = false, onActivate }) {
  return (
    <button
      type="button"
      onMouseEnter={onActivate}
      onFocus={onActivate}
      onClick={onActivate}
      className={`experience-card rounded-[18px] border p-4 text-left shadow-[var(--shadow-soft)] backdrop-blur transition sm:p-5 ${active ? "border-[var(--accent)] bg-white shadow-[0_18px_46px_rgba(57,185,138,0.16)]" : "border-[var(--border)] bg-white/86 hover:border-[var(--accent)]/45 hover:bg-white"}`}
      style={{ animationDelay: `${index * 130}ms` }}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="inline-flex rounded-full border border-[var(--accent)]/20 bg-[var(--accent-soft)] px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-[var(--accent-strong)]">
          {moment.label}
        </div>
        <div className={`h-2 w-2 rounded-full bg-[var(--accent)] shadow-[0_0_0_6px_rgba(57,185,138,0.10)] transition ${active ? "scale-125 opacity-100" : "opacity-55"}`} />
      </div>
      <h3 className="mt-4 text-lg font-semibold leading-tight text-[var(--text)] sm:text-xl">{renderBrandText(moment.title)}</h3>
      <p className="mt-3 text-sm leading-7 text-[var(--text-muted)]">{renderBrandText(moment.text)}</p>
    </button>
  );
}

function PremiumExperiencePanel({ moments = [] }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeMoment = moments[activeIndex] || moments[0];
  const activeScreen = appPreviewScreens[activeIndex % appPreviewScreens.length] || appPreviewScreens[0];

  return (
    <div className="relative overflow-hidden rounded-[24px] border border-[var(--border-strong)] bg-[linear-gradient(145deg,#ffffff_0%,#f7fbf9_55%,#eef7f4_100%)] p-4 shadow-[var(--shadow-panel)] sm:p-6 lg:p-8">
      <div className="relative grid gap-6 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
        <div className="premium-mini-phone mx-auto hidden w-full max-w-[300px] rounded-[26px] border border-black/10 bg-[#111413] p-2 shadow-[0_24px_70px_rgba(14,17,16,0.18)] sm:block">
          <div className="relative overflow-hidden rounded-[21px] bg-[#f7f8f7]">
            <div className="absolute left-1/2 top-3 h-4 w-24 -translate-x-1/2 rounded-full bg-black" />
            <div className="relative h-[610px]">
              <img
                key={activeScreen.src}
                src={activeScreen.src}
                alt={activeScreen.alt}
                className="h-full w-full object-cover object-top transition duration-300"
              />
              <div className="absolute inset-x-4 bottom-4 rounded-[18px] border border-white/20 bg-white/92 p-4 shadow-[0_16px_42px_rgba(14,17,16,0.16)] backdrop-blur">
                <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--accent-strong)]">{activeMoment?.label}</p>
                <p className="mt-2 text-sm font-semibold leading-tight text-[var(--text)]">{renderBrandText(activeMoment?.title)}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          {moments.map((moment, index) => (
            <ExperienceMomentCard key={moment.label} moment={moment} index={index} active={index === activeIndex} onActivate={() => setActiveIndex(index)} />
          ))}
        </div>
      </div>
    </div>
  );
}

function Modal({ open, onClose, title, text, copy }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[rgba(14,17,16,0.18)] p-4 backdrop-blur-md">
      <div className="relative w-full max-w-xl rounded-[20px] border border-[var(--border-strong)] bg-[var(--surface-solid)] p-8 text-[var(--text)] shadow-[var(--shadow-panel)]">
        <button onClick={onClose} className="absolute right-4 top-4 flex h-11 w-11 items-center justify-center rounded-full border border-[var(--border)] bg-[var(--surface-muted)] text-[var(--text-muted)] transition hover:bg-white hover:text-[var(--text)]" aria-label={copy.closeLabel}>
          <X size={18} />
        </button>
        <div className="mb-5 inline-flex rounded-full border border-[var(--accent)]/25 bg-[var(--accent-soft)] px-4 py-2 text-sm font-semibold text-[var(--accent-strong)]">
          <BrandMark />
        </div>
        <h3 className="max-w-lg text-3xl font-semibold leading-tight">{renderBrandText(title)}</h3>
        <p className="mt-5 text-lg leading-8 text-[var(--text-muted)]">{renderBrandText(text)}</p>
        <div className="mt-8 grid gap-3 sm:grid-cols-2">
          <Link href="/signup" onClick={() => trackEvent("landing_modal_signup_click")} className="rounded-[16px] bg-[var(--accent)] px-5 py-3.5 text-center font-semibold text-[var(--accent-foreground)] shadow-[0_12px_30px_rgba(57,185,138,0.2)]">
            {copy.modalPrimary}
          </Link>
          <Link href="/login" onClick={() => trackEvent("landing_modal_login_click")} className="rounded-[16px] border border-[var(--border)] bg-[var(--surface-muted)] px-5 py-3.5 text-center font-semibold text-[var(--text)]">
            {copy.modalSecondary}
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const [lang, setLang] = useState("en");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [openFaqIndex, setOpenFaqIndex] = useState(-1);

  const t = copy[lang] || copy.en;

  useEffect(() => {
    const nextLocale = getInitialBrowserLocale();
    const resolved = nextLocale in copy ? nextLocale : "en";
    setLang(resolved);
    applyCoachLocale(resolved);
    trackEvent("landing_view", { locale: resolved });

  }, []);

  const navItems = [
    { id: "product", label: t.navProduct },
    { id: "flow", label: t.navFlow },
    { id: "pilot", label: t.navPilot },
    { id: "pricing", label: t.navPricing },
    { id: "faq", label: t.navFaq },
  ];

  return (
    <div className="min-h-screen overflow-x-hidden bg-[var(--bg)] text-[var(--text)]">
      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={t.modalTitle} text={t.modalText} copy={t} />

      <div className="pointer-events-none fixed inset-0 -z-10 bg-[linear-gradient(180deg,#fbfbfb_0%,#f5f5f5_46%,#f2f4f3_100%)]" />

      <header className="fixed inset-x-0 top-0 z-50 border-b border-[rgba(216,223,218,0.58)] bg-[rgba(255,255,255,0.72)] shadow-[0_8px_26px_rgba(14,17,16,0.035)] backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-2.5 sm:px-5 sm:py-4 lg:px-8">
          <a href="#top" className="flex min-w-0 items-center gap-3 sm:gap-4">
            <BrandLockup />
          </a>

          <nav className="hidden items-center gap-2 lg:flex">
            {navItems.map((item) => (
              <a key={item.id} href={`#${item.id}`} className="rounded-full px-4 py-2 text-sm text-[var(--text-muted)] transition hover:bg-white hover:text-[var(--text)]">
                {item.label}
              </a>
            ))}
          </nav>

          <div className="flex shrink-0 items-center gap-2 sm:gap-3">
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
              <a
                href={APK_DOWNLOAD_URL}
                target="_blank"
                rel="noreferrer"
                onClick={() => trackEvent("landing_header_download_click", { locale: lang })}
                className="inline-flex items-center gap-2 whitespace-nowrap rounded-full border border-[var(--border)] bg-white px-4 py-3 text-sm font-semibold text-[var(--text)] transition hover:border-[var(--border-strong)] hover:bg-[var(--surface-solid)]"
              >
                <Smartphone size={15} />
                {t.downloadCta}
              </a>
              <Link href="/signup" onClick={() => trackEvent("landing_header_signup_click", { locale: lang })} className="whitespace-nowrap rounded-full bg-[var(--accent)] px-5 py-3 text-sm font-semibold text-[var(--accent-foreground)] shadow-[0_10px_24px_rgba(57,185,138,0.18)]">
                {lang === "pt" ? "Trial grátis 14 dias" : "14-day free trial"}
              </Link>
            </div>

            <button onClick={() => setMobileMenuOpen((current) => !current)} className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[var(--border)] bg-[var(--surface-muted)] text-[var(--text)] sm:h-11 sm:w-11 lg:hidden" aria-label="Toggle navigation">
              <Menu size={18} />
            </button>
          </div>
        </div>

        {mobileMenuOpen ? (
          <div className="border-t border-[var(--border)] px-5 py-4 lg:hidden">
            <div className="flex flex-col gap-2">
              {navItems.filter((item) => item.id === "product" || item.id === "pricing" || item.id === "faq").map((item) => (
                <a key={item.id} href={`#${item.id}`} onClick={() => setMobileMenuOpen(false)} className="rounded-2xl border border-[var(--border)] bg-[var(--surface-solid)] px-4 py-3 text-[var(--text-muted)]">
                  {item.label}
                </a>
              ))}
              <a
                href={APK_DOWNLOAD_URL}
                target="_blank"
                rel="noreferrer"
                onClick={() => {
                  trackEvent("landing_mobile_download_click", { locale: lang });
                  setMobileMenuOpen(false);
                }}
                className="rounded-2xl border border-[var(--border)] bg-white px-4 py-3 text-center text-sm font-semibold text-[var(--text)]"
              >
                {t.downloadCta}
              </a>
              <Link href="/signup" onClick={() => setMobileMenuOpen(false)} className="rounded-2xl bg-[var(--accent)] px-4 py-3 text-center text-sm font-semibold text-[var(--accent-foreground)]">
                {t.primaryCta}
              </Link>
            </div>
          </div>
        ) : null}
      </header>

      <main id="top" className="overflow-x-hidden pt-[62px] sm:pt-[84px]">
        <section className="mx-auto grid max-w-7xl gap-6 px-4 pb-8 pt-5 sm:gap-14 sm:px-5 sm:pb-20 sm:pt-16 lg:grid-cols-[1fr_1fr] lg:items-center lg:px-8 lg:pb-20 lg:pt-16">
          <div className="max-w-3xl">
            <div className="inline-flex max-w-full rounded-full border border-[var(--accent)]/20 bg-[var(--accent-soft)] px-3 py-2 text-[10px] font-semibold leading-5 text-[var(--accent-strong)] sm:px-4 sm:text-sm sm:leading-6">
              {renderBrandText(t.badge)}
            </div>
            <h1 className="mt-4 text-[2.35rem] font-semibold leading-[0.98] text-[var(--text)] min-[380px]:text-[2.62rem] sm:mt-8 sm:text-5xl xl:text-7xl">
              <span className="block">{renderBrandText(t.titleA)}</span>
              <span className="block text-[var(--text)]">{renderBrandText(t.titleB)}</span>
              <span className="block bg-[image:var(--brand-gradient)] bg-clip-text text-transparent">{renderBrandText(t.titleC)}</span>
            </h1>
            <p className="mt-4 max-w-xl text-sm leading-6 text-[var(--text-muted)] sm:hidden">
              {lang === "pt"
                ? "A app mobile para gerir clients, sessões, treino, assessments, PSE, pagamentos e alertas no momento em que o coach está a trabalhar."
                : "The mobile app for managing clients, sessions, training, assessments, RPE, payments, and alerts while the coach is working."}
            </p>
            <div className="relative -mt-1 flex justify-center lg:hidden">
              <div className="hero-phone-glow absolute inset-x-0 top-2 mx-auto h-[280px] max-w-[280px] rounded-full bg-[radial-gradient(circle,rgba(57,185,138,0.18),rgba(77,135,199,0.10)_42%,transparent_68%)] blur-2xl" />
              <PhoneMock />
            </div>
            <p className="mt-4 hidden max-w-2xl text-sm leading-6 text-[var(--text-muted)] sm:mt-7 sm:block sm:text-lg sm:leading-8 xl:text-xl">{renderBrandText(t.subtitle)}</p>

            <div className="mt-5 grid grid-cols-1 gap-3 min-[380px]:grid-cols-[1fr_auto] sm:mt-10 sm:flex sm:flex-row sm:gap-4">
              <Link href="/signup" onClick={() => trackEvent("landing_hero_signup_click", { locale: lang })} className="inline-flex items-center justify-center gap-2 rounded-[16px] bg-[var(--accent)] px-5 py-3.5 text-sm font-semibold text-[var(--accent-foreground)] shadow-[0_12px_30px_rgba(57,185,138,0.2)] sm:px-6 sm:py-4 sm:text-base">
                {t.primaryCta}
                <ArrowRight size={18} />
              </Link>
              <a
                href={APK_DOWNLOAD_URL}
                target="_blank"
                rel="noreferrer"
                onClick={() => trackEvent("landing_hero_download_click", { locale: lang })}
                className="inline-flex items-center justify-center gap-2 rounded-[16px] border border-[var(--border)] bg-white px-5 py-3.5 text-sm font-semibold text-[var(--text)] transition hover:border-[var(--border-strong)] hover:bg-[var(--surface-solid)] sm:px-6 sm:py-4 sm:text-base"
              >
                <Smartphone size={18} />
                {t.downloadCta}
              </a>
            </div>
            <div className="mt-6 hidden flex-wrap gap-2 sm:mt-8 sm:flex sm:gap-3">
              <Chip>{t.trust1}</Chip>
              <Chip>{t.trust2}</Chip>
              <Chip>{t.trust3}</Chip>
            </div>

            <HeroConversionPanel t={t} />
          </div>

          <div className="relative hidden items-center justify-center lg:flex lg:-translate-y-40 xl:-translate-y-52 2xl:-translate-y-56">
            <div className="hero-phone-glow absolute inset-x-0 top-0 mx-auto h-[360px] max-w-[360px] rounded-full bg-[radial-gradient(circle,rgba(57,185,138,0.18),rgba(77,135,199,0.10)_42%,transparent_68%)] blur-2xl sm:h-[520px] sm:max-w-[520px]" />
            <PhoneMock />
            <div className="floating-proof-card absolute left-0 top-4 z-20 hidden rounded-[16px] border border-[var(--border)] bg-[rgba(255,255,255,0.92)] px-4 py-3 shadow-[var(--shadow-soft)] backdrop-blur md:block lg:left-3 xl:left-8">
              <div className="flex items-center gap-3">
                <Clock3 size={16} className="text-[var(--accent-strong)]" />
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-[var(--text-muted)]">{t.floatingSessionLabel}</p>
                  <p className="text-sm font-medium text-[var(--text)]">{t.floatingSessionText}</p>
                </div>
              </div>
            </div>
            <div className="floating-proof-card absolute bottom-14 right-0 z-20 hidden rounded-[16px] border border-[var(--border)] bg-[rgba(255,255,255,0.92)] px-4 py-3 shadow-[var(--shadow-soft)] backdrop-blur md:block lg:right-3 xl:right-8">
              <div className="flex items-center gap-3">
                <Users size={16} className="text-[var(--accent-strong)]" />
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-[var(--text-muted)]">{t.floatingPilotLabel}</p>
                  <p className="text-sm font-medium text-[var(--text)]">{t.floatingPilotText}</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="pricing" className="mx-auto max-w-7xl px-4 py-8 sm:px-5 sm:py-20 lg:px-8">
          <SectionLabel>{t.pricingTag}</SectionLabel>
          <div className="mt-4 grid gap-6 sm:mt-5 sm:gap-8 lg:grid-cols-[0.9fr_1.1fr]">
            <div>
              <h2 className="max-w-3xl text-2xl font-semibold leading-tight text-[var(--text)] sm:text-4xl lg:text-5xl">{renderBrandText(t.pricingTitle)}</h2>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-[var(--text-muted)] sm:mt-6 sm:text-lg sm:leading-8">{renderBrandText(t.pricingText)}</p>
              <div className="mt-8 hidden gap-3 sm:grid">
                {t.pricingBullets.map((item) => (
                  <FeatureItem key={item}>{item}</FeatureItem>
                ))}
              </div>
              <div className="mt-6 hidden flex-col gap-3 sm:mt-8 sm:flex sm:flex-row">
                <Link href="/signup" className="inline-flex items-center justify-center gap-2 rounded-[16px] bg-[var(--accent)] px-5 py-3.5 text-sm font-semibold text-[var(--accent-foreground)] shadow-[0_12px_30px_rgba(57,185,138,0.2)] sm:px-6 sm:py-4 sm:text-base">
                  {t.primaryCta}
                  <ArrowRight size={18} />
                </Link>
                <a
                  href={APK_DOWNLOAD_URL}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-[16px] border border-[var(--border)] bg-white px-5 py-3.5 text-sm font-semibold text-[var(--text)] transition hover:border-[var(--border-strong)] hover:bg-[var(--surface-solid)] sm:px-6 sm:py-4 sm:text-base"
                >
                  <Smartphone size={18} />
                  {t.downloadCta}
                </a>
              </div>
            </div>
            <div className="grid gap-4">
              <PricingCard
                label={t.foundationLabel}
                title={t.foundationTitle}
                monthly={t.foundationMonthly}
                yearly={t.foundationYearly}
                monthlyLabel={t.monthlyLabel}
                yearlyLabel={t.yearlyLabel}
                equivalentLabel={t.equivalentLabel}
                note={t.foundationNote}
                benefits={t.foundationBenefits}
                spotsBadge={t.founderSpotsBadge}
                accent
              />
              <PricingCard
                label={t.regularLabel}
                title={t.regularTitle}
                monthly={t.regularMonthly}
                yearly={t.regularYearly}
                monthlyLabel={t.monthlyLabel}
                yearlyLabel={t.yearlyLabel}
                note={t.regularNote}
                benefits={t.regularBenefits}
              />
            </div>
          </div>
        </section>

        <section id="product" className="mx-auto max-w-7xl px-4 py-8 sm:px-5 sm:py-20 lg:px-8">
          <SectionLabel>{t.sectionProduct}</SectionLabel>
          <div className="mt-4 grid gap-6 sm:mt-5 sm:gap-8 lg:grid-cols-[0.92fr_1.08fr]">
            <div>
              <h2 className="max-w-2xl text-2xl font-semibold leading-tight text-[var(--text)] sm:text-4xl lg:text-5xl">{renderBrandText(t.productTitle)}</h2>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-[var(--text-muted)] sm:mt-6 sm:text-lg sm:leading-8">{renderBrandText(t.productText)}</p>
            </div>
            <div>
              <h3 className="mb-4 text-lg font-semibold text-[var(--text)] sm:text-xl">{t.featureTitle}</h3>
              <div className="grid gap-3 sm:grid-cols-2">
                {t.features.map((item) => (
                  <FeatureItem key={item}>{item}</FeatureItem>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-8 sm:px-5 sm:py-20 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-[0.88fr_1.12fr] lg:items-end">
            <div>
              <SectionLabel>{t.showcaseTag}</SectionLabel>
              <h2 className="mt-4 max-w-3xl text-2xl font-semibold leading-tight text-[var(--text)] sm:mt-5 sm:text-4xl lg:text-5xl">{renderBrandText(t.showcaseTitle)}</h2>
            </div>
            <p className="max-w-2xl text-sm leading-6 text-[var(--text-muted)] sm:text-lg sm:leading-8">{renderBrandText(t.showcaseText)}</p>
          </div>
          <div className="mt-5 sm:mt-10">
            <PremiumExperiencePanel moments={t.showcaseMoments} />
          </div>
        </section>

        <section id="day" className="mx-auto hidden max-w-7xl px-4 py-14 sm:px-5 sm:py-20 md:block lg:px-8">
          <SectionLabel>{t.detailTag}</SectionLabel>
          <h2 className="mt-5 max-w-4xl text-3xl font-semibold leading-tight text-[var(--text)] sm:text-4xl lg:text-5xl">{renderBrandText(t.detailTitle)}</h2>
          <div className="mt-10 grid gap-4 lg:grid-cols-2">
            {t.detailCards.map((card) => (
              <DetailCard key={card.title} title={card.title} text={card.text} />
            ))}
          </div>
        </section>

        <section id="pilot" className="mx-auto hidden max-w-7xl px-4 py-14 sm:px-5 sm:py-20 md:block lg:px-8">
          <SectionLabel>{t.differentiatorTag}</SectionLabel>
          <div className="mt-5 grid gap-8 lg:grid-cols-[0.88fr_1.12fr]">
            <div>
              <h2 className="max-w-3xl text-3xl font-semibold leading-tight text-[var(--text)] sm:text-4xl lg:text-5xl">{renderBrandText(t.differentiatorTitle)}</h2>
              <p className="mt-5 max-w-2xl text-base leading-7 text-[var(--text-muted)] sm:mt-6 sm:text-lg sm:leading-8">{renderBrandText(t.differentiatorText)}</p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {t.differentiators.map((item, index) => {
                const icons = [Clock3, Users, Smartphone, Target, Check, CreditCard];
                const Icon = icons[index] || CircleDashed;
                return <DifferentiatorCard key={item.title} title={item.title} text={item.text} icon={Icon} />;
              })}
            </div>
          </div>
        </section>

        <section className="mx-auto hidden max-w-7xl px-4 py-14 sm:px-5 sm:py-20 md:block lg:px-8">
          <SectionLabel>{t.scenarioTag}</SectionLabel>
          <h2 className="mt-5 max-w-4xl text-3xl font-semibold leading-tight text-[var(--text)] sm:text-4xl lg:text-5xl">{renderBrandText(t.scenarioTitle)}</h2>
          <div className="mt-10 grid gap-4 lg:grid-cols-3">
            {t.scenarioCards.map((card) => (
              <ScenarioCard key={card.title} title={card.title} text={card.text} />
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-8 sm:px-5 sm:py-20 lg:px-8">
          <SectionLabel>{t.clientValueTag}</SectionLabel>
          <div className="mt-4 grid gap-6 sm:mt-5 sm:gap-8 lg:grid-cols-[0.9fr_1.1fr]">
            <div>
              <h2 className="max-w-3xl text-2xl font-semibold leading-tight text-[var(--text)] sm:text-4xl lg:text-5xl">{renderBrandText(t.clientValueTitle)}</h2>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-[var(--text-muted)] sm:mt-6 sm:text-lg sm:leading-8">{renderBrandText(t.clientValueText)}</p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2 sm:gap-4">
              {t.clientValueCards.map((card) => (
                <ClientValueCard key={card.title} title={card.title} text={card.text} />
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto hidden max-w-7xl px-4 py-14 sm:px-5 sm:py-20 md:block lg:px-8">
          <SectionLabel>{t.onboardingTag}</SectionLabel>
          <div className="mt-5 grid gap-8 lg:grid-cols-[0.88fr_1.12fr]">
            <div>
              <h2 className="max-w-3xl text-3xl font-semibold leading-tight text-[var(--text)] sm:text-4xl lg:text-5xl">{renderBrandText(t.onboardingTitle)}</h2>
              <p className="mt-5 max-w-2xl text-base leading-7 text-[var(--text-muted)] sm:mt-6 sm:text-lg sm:leading-8">{renderBrandText(t.onboardingText)}</p>
            </div>
            <div className="grid gap-4 lg:grid-cols-3 lg:gap-5">
              {t.onboardingSteps.map((step, index) => (
                <FlowCard key={step.title} step={`0${index + 1}`} title={step.title} text={step.text} />
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-8 sm:px-5 sm:py-20 lg:px-8">
          <div className="min-w-0 rounded-[20px] border border-[var(--border-strong)] bg-[var(--surface-solid)] p-4 shadow-[var(--shadow-panel)] sm:p-8 lg:p-10">
            <SectionLabel>{t.systemTag}</SectionLabel>
            <div className="mt-4 grid min-w-0 gap-5 sm:mt-5 sm:gap-8">
              <div className="min-w-0">
                <h2 className="max-w-4xl text-2xl font-semibold leading-tight text-[var(--text)] sm:text-5xl">
                  {lang === "pt"
                    ? "O que a APEX COACH faz hoje na beta e como a versão final fecha o sistema."
                    : "What APEX COACH does today in beta and how the final version closes the system."}
                </h2>
                <p className="mt-3 max-w-3xl text-sm leading-6 text-[var(--text-muted)] sm:mt-6 sm:text-lg sm:leading-8">
                  {lang === "pt"
                    ? "Uma única matriz, sem ruído, para mostrar o que já está disponível na beta, onde a concorrência responde melhor ou pior, e como a visão completa da APEX COACH fica consolidada na versão final."
                    : "A single matrix, without extra noise, to show what is already available in beta, where competitors respond better or worse, and how the complete APEX COACH vision is consolidated in the final version."}
                </p>
                <p className="mt-3 hidden text-sm leading-7 text-[var(--text-muted)] sm:block">
                  {lang === "pt"
                    ? "Valores apresentados como referência comercial de entrada. A comparação funcional deve ser lida como orientação de posicionamento e pode evoluir com cada produto."
                    : "Prices are shown as entry-level commercial references. The feature comparison should be read as positioning guidance and may evolve as each product changes."}
                </p>
              </div>
              <div className="min-w-0">
                <ProductMatrix lang={lang} />
              </div>
            </div>
          </div>
        </section>

        <section id="flow" className="mx-auto hidden max-w-7xl px-4 py-14 sm:px-5 sm:py-20 md:block lg:px-8">
          <SectionLabel>{t.capabilityTag}</SectionLabel>
          <div className="mt-5 grid gap-8 lg:grid-cols-[0.92fr_1.08fr]">
            <div>
              <h2 className="max-w-3xl text-3xl font-semibold leading-tight text-[var(--text)] sm:text-4xl lg:text-5xl">{renderBrandText(t.capabilityTitle)}</h2>
              <p className="mt-5 max-w-2xl text-base leading-7 text-[var(--text-muted)] sm:mt-6 sm:text-lg sm:leading-8">{renderBrandText(t.capabilityText)}</p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {t.capabilityCards.map((card) => (
                <CapabilityCard key={card.title} title={card.title} text={card.text} />
              ))}
            </div>
          </div>
        </section>

        <section id="faq" className="mx-auto max-w-7xl px-4 py-8 sm:px-5 sm:py-20 lg:px-8">
          <SectionLabel>{t.faqTag}</SectionLabel>
          <h2 className="mt-4 max-w-3xl text-2xl font-semibold leading-tight text-[var(--text)] sm:mt-5 sm:text-4xl lg:text-5xl">{renderBrandText(t.faqTitle)}</h2>
          <div className="mt-6 grid gap-3 sm:mt-10 sm:gap-4">
            {t.faqItems.map((item, index) => (
              <div key={item.title} className="overflow-hidden rounded-[16px] border border-[var(--border)] bg-[var(--surface-solid)] shadow-[var(--shadow-soft)]">
                <button
                  type="button"
                  onClick={() => setOpenFaqIndex((current) => (current === index ? -1 : index))}
                  className="flex w-full items-center justify-between gap-4 px-4 py-4 text-left transition hover:bg-[var(--surface-muted)] sm:px-6 sm:py-5"
                >
                  <h3 className="text-base font-semibold text-[var(--text)] sm:text-xl">{item.title}</h3>
                  <ChevronDown
                    size={18}
                    className={`shrink-0 text-[var(--text-muted)] transition-transform ${openFaqIndex === index ? "rotate-180" : ""}`}
                  />
                </button>
                {openFaqIndex === index ? (
                  <div className="border-t border-[var(--border)] px-4 py-4 sm:px-6 sm:py-5">
                    <p className="max-w-4xl text-sm leading-7 text-[var(--text-muted)] sm:text-base sm:leading-8">{item.text}</p>
                  </div>
                ) : null}
              </div>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 pb-16 pt-4 sm:px-5 sm:pb-24 sm:pt-8 lg:px-8">
          <div className="rounded-[20px] border border-[var(--border-strong)] bg-[var(--surface-solid)] px-5 py-8 text-center shadow-[var(--shadow-panel)] sm:px-10 sm:py-14">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-[16px] bg-[var(--accent-soft)]">
              <Sparkles size={28} className="text-[var(--accent-strong)]" />
            </div>
            <h2 className="mt-5 text-2xl font-semibold tracking-tight text-[var(--text)] sm:mt-6 sm:text-4xl lg:text-5xl">{renderBrandText(t.closingTitle)}</h2>
            <p className="mx-auto mt-4 max-w-3xl text-sm leading-6 text-[var(--text-muted)] sm:mt-6 sm:text-lg sm:leading-8">{renderBrandText(t.closingText)}</p>
            <div className="mt-7 flex flex-col items-center justify-center gap-3 sm:mt-10 sm:flex-row sm:gap-4">
              <Link href="/signup" className="rounded-[16px] bg-[var(--accent)] px-6 py-4 font-semibold text-[var(--accent-foreground)] shadow-[0_12px_30px_rgba(57,185,138,0.2)]">
                {t.closingPrimary}
              </Link>
              <a
                href={APK_DOWNLOAD_URL}
                target="_blank"
                rel="noreferrer"
                className="rounded-[16px] border border-[var(--border)] bg-white px-6 py-4 font-semibold text-[var(--text)]"
              >
                {t.closingSecondary}
              </a>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-[var(--border)]">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 px-5 pb-24 pt-8 text-sm text-[var(--text-muted)] sm:pb-8 lg:flex-row lg:px-8">
          <BrandLockup />

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

      <div className="fixed inset-x-0 bottom-0 z-50 border-t border-[var(--border)] bg-white/94 px-4 py-3 shadow-[0_-12px_40px_rgba(14,17,16,0.08)] backdrop-blur md:hidden">
        <div className="mx-auto grid max-w-md grid-cols-[1fr_auto] gap-2">
          <Link href="/signup" onClick={() => trackEvent("landing_mobile_sticky_signup_click", { locale: lang })} className="inline-flex items-center justify-center rounded-[14px] bg-[var(--accent)] px-4 py-3 text-sm font-semibold text-[var(--accent-foreground)]">
            {lang === "pt" ? "Trial grátis 14 dias" : "14-day free trial"}
          </Link>
          <a
            href={APK_DOWNLOAD_URL}
            target="_blank"
            rel="noreferrer"
            onClick={() => trackEvent("landing_mobile_sticky_download_click", { locale: lang })}
            className="inline-flex h-12 w-12 items-center justify-center rounded-[14px] border border-[var(--border)] bg-white text-[var(--text)]"
            aria-label={t.downloadCta}
          >
            <Smartphone size={18} />
          </a>
        </div>
      </div>
    </div>
  );
}

