import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, BellRing, Check, ChevronDown, Clock3, CreditCard, Menu, Smartphone, Sparkles, Target, Users, X } from "lucide-react";

import { trackEvent } from "./lib/analytics";
import { COACH_LANGUAGE_OPTIONS, applyCoachLocale, getInitialBrowserLocale } from "./lib/coach-locale";
import CookieSettingsButton from "./components/CookieSettingsButton";

const screenshots = ["/screenshot_1.jpeg", "/screenshot_2.jpeg", "/screenshot_3.jpeg"];

const copy = {
  pt: {
    navProduct: "Produto",
    navFlow: "OperaÃ§Ã£o",
    navPilot: "Resultados",
    navPricing: "Planos",
    navFaq: "FAQ",
    badge: "Build your apex and elevate theirs. A aplicaÃ§Ã£o para coaches que exigem mais rigor, mais eficiÃªncia e mais controlo operacional.",
    titleA: "A APEX COACH",
    titleB: "foi desenhada para",
    titleC: "organizar melhor a tua operaÃ§Ã£o.",
    subtitle:
      "Desenvolvida para o contexto real de intervenÃ§Ã£o, a APEX COACH permite ao coach gerir sessÃµes, ajustar cargas, acompanhar alunos e registar informaÃ§Ã£o crÃ­tica com muito menos fricÃ§Ã£o operacional. Ã‰ a soluÃ§Ã£o certa para quem procura maior eficiÃªncia, maior clareza e uma execuÃ§Ã£o mais profissional.",
    primaryCta: "ComeÃ§ar trial grÃ¡tis 14 dias",
    secondaryCta: "Criar conta",
    downloadCta: "Download APK",
    trust1: "Clients ilimitados",
    trust2: "PeriodizaÃ§Ã£o e protocolos",
    trust3: "Templates, tags e tracking",
    heroTag: "App no terreno",
    heroTitle: "Menos fricÃ§Ã£o operacional. Mais critÃ©rio tÃ©cnico. Mais tempo Ãºtil.",
    heroText:
      "Tudo o que o coach necessita para intervir com qualidade no momento certo: consultar a sessÃ£o, ajustar o treino, rever histÃ³rico, registar notas, acompanhar atividades externas e manter continuidade no acompanhamento sem perder foco.",
    sectionProduct: "Produto",
    productTitle: "Uma app criada para reforÃ§ar a forma como o coach trabalha.",
    productText:
      "A APEX COACH nasce para dar ao coach uma experiÃªncia mais limpa, mais rÃ¡pida e mais profissional em contexto real. Foi pensada para reduzir passos desnecessÃ¡rios, clarificar a operaÃ§Ã£o e transformar o dia a dia numa estrutura mais fluida, organizada e consistente.",
    featureTitle: "O que a app jÃ¡ melhora no trabalho do coach",
    features: [
      "Clients ilimitados para acompanhar a tua operaÃ§Ã£o sem limites artificiais",
      "Registo simples de cargas, notas, contexto e atividades externas sem quebrar o ritmo",
      "Leitura mais clara do histÃ³rico, progresso e evoluÃ§Ã£o de cada aluno",
      "PeriodizaÃ§Ã£o semanal e organizaÃ§Ã£o por protocolos de treino",
      "Templates e tags para acelerar prescriÃ§Ã£o, repetiÃ§Ã£o e consistÃªncia",
      "Uma imagem mais profissional e mais premium no trabalho diÃ¡rio",
    ],
    differentiatorTag: "Vantagens claras",
    differentiatorTitle: "Onde a APEX COACH cria uma vantagem operacional real no trabalho diÃ¡rio.",
    differentiatorText:
      "A diferenÃ§a nÃ£o estÃ¡ em ter mais uma app. EstÃ¡ em libertar tempo, reduzir ruÃ­do mental e dar ao coach mais controlo sobre tudo o que realmente importa para melhorar a operaÃ§Ã£o e o acompanhamento dos alunos.",
    differentiators: [
      {
        title: "Mais tempo livre",
        text: "Menos tarefas repetitivas, menos tempo perdido a procurar informaÃ§Ã£o e menos fricÃ§Ã£o operacional, para que o coach concentre mais energia na orientaÃ§Ã£o tÃ©cnica e na relaÃ§Ã£o com o aluno.",
      },
      {
        title: "GestÃ£o de clients mais simples",
        text: "Cada aluno fica mais fÃ¡cil de entender, acompanhar e atualizar sem navegaÃ§Ã£o dispersa nem perda de contexto.",
      },
      {
        title: "MarcaÃ§Ãµes e sessÃµes",
        text: "Agendar, consultar e acompanhar sessÃµes torna-se mais rÃ¡pido, mais claro e mais fÃ¡cil de manter organizado.",
      },
      {
        title: "Tracking de mÃ©tricas e avaliaÃ§Ãµes",
        text: "Os dados deixam de estar dispersos. O coach consegue perceber com mais rapidez a evoluÃ§Ã£o, as mudanÃ§as e os prÃ³ximos passos.",
      },
      {
        title: "CriaÃ§Ã£o de treinos e gestÃ£o de PSE",
        text: "Prescrever, ajustar e registar treino com continuidade tÃ©cnica, sem quebrar o ritmo do acompanhamento.",
      },
      {
        title: "FaturaÃ§Ã£o, avisos e automatismos",
        text: "Controlar pagamentos, receber alertas e automatizar partes do follow-up para gerir melhor a operaÃ§Ã£o e reduzir esquecimentos.",
      },
    ],
    scenarioTag: "Um dia com a app",
    scenarioTitle: "Como a APEX COACH encaixa no trabalho real do coach e sustenta o lema build your apex and elevate theirs.",
    scenarioCards: [
      {
        title: "Antes da sessÃ£o",
        text: "O coach revÃª a agenda, confirma o aluno, enquadra o contexto, consulta o protocolo ou a semana planeada e inicia a sessÃ£o seguinte com uma linha de aÃ§Ã£o clara.",
      },
      {
        title: "Durante a sessÃ£o",
        text: "Ajusta o treino, gere o PSE, regista notas, acompanha mÃ©tricas e mantÃ©m o foco no aluno sem comprometer a qualidade da conduÃ§Ã£o da sessÃ£o.",
      },
      {
        title: "Depois da sessÃ£o",
        text: "Fica claro o que foi feito, o que mudou, o que precisa de seguimento e como continuar o acompanhamento com mais consistÃªncia.",
      },
    ],
    systemTag: "Tudo no mesmo sistema",
    systemTitle: "Uma app que junta as peÃ§as que normalmente andam espalhadas.",
    systemText:
      "Em vez de dispersar a operaÃ§Ã£o por notas soltas, mensagens, folhas externas e memÃ³ria, a APEX COACH integra agenda, clients, treinos, avaliaÃ§Ãµes, PSE, faturaÃ§Ã£o e alertas numa experiÃªncia muito mais clara e consistente para o coach.",
    systemItems: [
      "Base de dados de exercÃ­cios para preparar, adaptar e repetir treino com critÃ©rio",
      "PrescriÃ§Ã£o de sessÃµes com registo do que foi realmente feito",
      "Tracking global da evoluÃ§Ã£o do aluno ao longo do tempo",
      "GestÃ£o de PSE, atividades externas e contexto da sessÃ£o no mesmo fluxo",
      "PeriodizaÃ§Ã£o semanal e organizaÃ§Ã£o por protocolos de treino",
      "Templates, tags, packs, pagamentos, avisos e automatismos no mesmo sistema",
    ],
    capabilityTag: "Blocos essenciais",
    capabilityTitle: "O que torna a APEX COACH mais Ãºtil para um coach exigente.",
    capabilityCards: [
      {
        title: "Clients ilimitados",
        text: "Acompanha a tua carteira de alunos sem limites artificiais e sem comprometer a organizaÃ§Ã£o da operaÃ§Ã£o.",
      },
      {
        title: "Atividades externas",
        text: "Regista o que o aluno faz fora da sessao e ganha contexto adicional para ajustar carga, volume e continuidade.",
      },
      {
        title: "PeriodizaÃ§Ã£o e protocolos",
        text: "Organiza semanas, blocos e protocolos de treino para trabalhar com mais critÃ©rio e maior consistÃªncia.",
      },
      {
        title: "Templates e tags",
        text: "Cria estruturas reutilizÃ¡veis, acelera a prescriÃ§Ã£o e melhora a forma como repetes e classificas o teu trabalho.",
      },
    ],
    clientValueTag: "Valor para o client",
    clientValueTitle: "O coach organiza melhor. O client percebe mais valor.",
    clientValueText:
      "A APEX COACH nÃ£o melhora apenas a operaÃ§Ã£o do coach. TambÃ©m reforÃ§a a experiÃªncia do client, porque cria uma app onde o aluno pode concentrar o que foi feito, o que estÃ¡ planeado e como a sua evoluÃ§Ã£o estÃ¡ a ser acompanhada.",
    clientValueCards: [
      {
        title: "Tudo num sÃ³ lugar",
        text: "O client deixa de depender de mensagens dispersas, notas soltas e memÃ³ria. Passa a ter uma estrutura mais clara daquilo que estÃ¡ a fazer e do que vem a seguir.",
      },
      {
        title: "Treino com mais clareza",
        text: "Quando o coach prescreve, ajusta e regista o que foi executado, o client percebe melhor o processo e valoriza mais a qualidade do acompanhamento.",
      },
      {
        title: "EvoluÃ§Ã£o visÃ­vel",
        text: "MÃ©tricas, avaliaÃ§Ãµes, contexto e histÃ³rico deixam de estar desconectados. O client sente maior progressÃ£o porque consegue perceber melhor o caminho que estÃ¡ a fazer.",
      },
      {
        title: "Mais confianÃ§a no acompanhamento",
        text: "Uma experiÃªncia mais organizada, mais profissional e mais consistente aumenta a perceÃ§Ã£o de valor do serviÃ§o e reforÃ§a a relaÃ§Ã£o entre coach e client.",
      },
    ],
    detailTag: "O que muda na prÃ¡tica",
    detailTitle: "NÃ£o Ã© apenas uma app para coaches. Ã‰ uma estrutura de trabalho mais forte para todos os dias.",
    detailCards: [
      {
        title: "Agenda com contexto real",
        text: "NÃ£o se trata apenas de consultar horÃ¡rios. Trata-se de perceber rapidamente quem vem, o que estÃ¡ pendente e como enquadrar a prÃ³xima sessÃ£o com maior preparaÃ§Ã£o.",
      },
      {
        title: "Clients com histÃ³rico Ãºtil",
        text: "Em vez de procurar informaÃ§Ã£o dispersa, o coach acede ao aluno e interpreta de forma imediata histÃ³rico, progresso, notas e os ajustamentos que devem ser considerados.",
      },
      {
        title: "Trainings mais fluidos",
        text: "A app ajuda o coach a prescrever, consultar e ajustar sessÃµes com muito menos fricÃ§Ã£o no momento em que estÃ¡ a trabalhar.",
      },
      {
        title: "Assessments com leitura mais clara",
        text: "Os indicadores ficam mais acessÃ­veis, mais comparÃ¡veis e mais relevantes para suportar decisÃµes de continuidade e progressÃ£o com cada aluno.",
      },
    ],
    flowTag: "Fluxo do coach",
    flowTitle: "Pensada para acompanhar o coach desde a preparaÃ§Ã£o atÃ© ao fecho da sessÃ£o.",
    flowCards: [
      { title: "Acesso imediato", text: "Chegar rapidamente Ã  aÃ§Ã£o certa, sem navegaÃ§Ã£o excessiva nem etapas desnecessÃ¡rias." },
      { title: "Registo em contexto", text: "Registar notas, ajustar cargas e conduzir a sessÃ£o sem comprometer o ritmo do treino." },
      { title: "Acompanhamento qualificado", text: "Interpretar com mais rapidez o que mudou em cada aluno e decidir com maior seguranÃ§a tÃ©cnica." },
    ],
    pilotTag: "Resultados para o coach",
    pilotTitle: "Onde a APEX COACH se traduz em valor concreto para o coach.",
    pilotText:
      "A diferenÃ§a nÃ£o estÃ¡ em ter mais uma aplicaÃ§Ã£o. EstÃ¡ em orientar melhor, decidir mais depressa e estruturar a operaÃ§Ã£o sem acrescentar complexidade ao dia de trabalho.",
    pilotPoints: ["Download direto da APK", "Criacao de conta imediata", "Acesso rapido", "Uma experiencia mais clara e mais profissional"],
    proofTitle: "O que um coach deve sentir ao usar a app",
    proofItems: [
      "Menos tempo perdido a procurar informaÃ§Ã£o",
      "Mais seguranÃ§a na continuidade entre sessÃµes e protocolos",
      "Mais consistÃªncia no acompanhamento dos alunos",
      "Mais controlo sobre o que foi feito, o que mudou e o que vem a seguir",
    ],
    pricingTag: "Planos",
    pricingTitle: "Uma subscriÃ§Ã£o. Duas modalidades de adesÃ£o. Uma vantagem relevante para os primeiros coaches.",
    pricingText:
      "A APEX COACH funciona com uma subscriÃ§Ã£o simples, disponÃ­vel em modalidade mensal ou anual. Os primeiros 50 lugares Foundation Coach garantem um valor preferencial enquanto a conta se mantiver ativa.",
    foundationLabel: "Foundation Coach",
    foundationTitle: "Oferta especial para os primeiros 50 coaches",
    foundationMonthly: "8,90 EUR/mÃªs",
    foundationYearly: "89 EUR/ano",
    foundationNote: "Valor vÃ¡lido enquanto a conta se mantiver ativa.",
    regularLabel: "SubscriÃ§Ã£o regular",
    regularTitle: "Valor standard da APEX COACH",
    regularMonthly: "29,90 EUR/mÃªs",
    regularYearly: "290 EUR/ano",
    pricingBullets: [
      "Uma Ãºnica subscriÃ§Ã£o para todo o ecossistema da app",
      "Modalidade mensal para uma adesÃ£o mais flexÃ­vel",
      "OpÃ§Ã£o anual para quem procura maior compromisso e melhor valor",
      "Campanha Foundation Coach pensada para os primeiros 50 coaches",
    ],
    faqTag: "FAQ",
    faqTitle: "Perguntas frequentes",
    faqItems: [
      { title: "Que modelo de subscriÃ§Ã£o existe?", text: "A APEX COACH funciona com uma subscriÃ§Ã£o Ãºnica, disponÃ­vel em modalidade mensal ou anual. A lÃ³gica comercial Ã© simples: um Ãºnico produto, duas formas de adesÃ£o e a mesma estrutura funcional da app." },
      { title: "O que Ã© o Foundation Coach e como funciona?", text: "Foundation Coach Ã© a campanha de entrada para os primeiros 50 coaches. Enquanto a conta se mantiver ativa, o coach preserva o valor preferencial associado a essa adesÃ£o inicial, sem migraÃ§Ã£o automÃ¡tica para o preÃ§o standard." },
      { title: "Para que perfil de coach foi pensada a APEX COACH?", text: "A app foi pensada para coaches que precisam de operar com mais critÃ©rio tÃ©cnico, mais velocidade de execuÃ§Ã£o e maior consistÃªncia no acompanhamento dos seus alunos, quer trabalhem com performance, saÃºde, recomposiÃ§Ã£o corporal ou acompanhamento hÃ­brido." },
      { title: "Posso trabalhar com clients ilimitados?", text: "Sim. A estrutura da app foi desenhada para acompanhar a operaÃ§Ã£o do coach sem impor limites artificiais ao nÃºmero de clients, permitindo crescer a carteira de acompanhamento sem perder organizaÃ§Ã£o nem contexto." },
      { title: "A app permite acompanhar atividades externas do aluno?", text: "Sim. O coach pode registar contexto adicional e atividades realizadas fora da sessÃ£o principal, o que melhora a leitura da carga global, da recuperaÃ§Ã£o, do volume acumulado e da continuidade do processo." },
      { title: "Ã‰ possÃ­vel organizar periodizaÃ§Ã£o e protocolos de treino?", text: "Sim. A APEX COACH suporta uma lÃ³gica de organizaÃ§Ã£o por semanas, blocos e protocolos, permitindo estruturar a progressÃ£o do aluno com maior clareza e manter uma leitura mais consistente do plano em execuÃ§Ã£o." },
      { title: "Posso criar templates e usar tags para acelerar a prescriÃ§Ã£o?", text: "Sim. A app permite criar templates reutilizÃ¡veis e aplicar tags para classificar melhor exercÃ­cios, sessÃµes e estruturas de trabalho. Isto reduz repetiÃ§Ã£o manual e ajuda a tornar a operaÃ§Ã£o diÃ¡ria mais consistente." },
      { title: "A base de dados de exercÃ­cios serve apenas para consulta?", text: "NÃ£o. A base de dados de exercÃ­cios serve como suporte ativo Ã  preparaÃ§Ã£o, adaptaÃ§Ã£o e repetiÃ§Ã£o do treino. O objetivo nÃ£o Ã© apenas consultar exercÃ­cios, mas acelerar decisÃµes de prescriÃ§Ã£o com mais consistÃªncia tÃ©cnica." },
      { title: "A faturaÃ§Ã£o dos clients pode ser acompanhada na app?", text: "Sim. A APEX COACH foi pensada para concentrar tambÃ©m a componente de packs, pagamentos, avisos e seguimento financeiro do aluno, reduzindo a necessidade de sistemas paralelos para controlo operacional." },
      { title: "O aluno consegue perceber o que foi feito e acompanhar a evoluÃ§Ã£o?", text: "Sim. A estrutura da app foi desenhada para que o coach consiga registar o que foi prescrito, o que foi executado e o que mudou ao longo do tempo, criando uma visÃ£o mais clara da evoluÃ§Ã£o global do aluno." },
    ],
    closingTitle: "Se procuras uma operaÃ§Ã£o mais fluida, mais rigorosa e mais profissional, este Ã© o momento certo para entrar.",
    closingText:
      "A APEX COACH estÃ¡ a evoluir para se afirmar como uma ferramenta cada vez mais rÃ¡pida, intuitiva e valiosa para o coach. Entra agora, experimenta no terreno e percebe como pode gerir a tua operaÃ§Ã£o com mais clareza, mais controlo e maior consistÃªncia.",
    closingPrimary: "Criar conta",
    closingSecondary: "Fazer download da APK",
    modalTitle: "Quero comecar a usar a APEX COACH",
    modalText:
      "A APEX COACH foi criada para coaches que procuram maior fluidez operacional, maior rapidez de execuÃ§Ã£o e maior seguranÃ§a no acompanhamento diÃ¡rio. Cria a tua conta e entra na app.",
    modalPrimary: "Criar conta",
    modalSecondary: "Fazer login",
    closeLabel: "Fechar",
    login: "Login",
    signup: "Criar conta",
    backline: "Build your apex and elevate theirs. A experiÃªncia web chegarÃ¡ depois. Neste momento, o foco estÃ¡ numa aplicaÃ§Ã£o mais forte para o trabalho real do coach.",
    floatingSessionLabel: "Modo sessÃ£o",
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
    titleC: "organize your operation better.",
    subtitle:
      "Built for real coaching environments, APEX COACH allows coaches to manage sessions, adjust loads, follow clients, and record critical information with far less operational friction. It is the right solution for professionals seeking greater efficiency, clearer oversight, and a more elevated standard of work.",
    primaryCta: "Start 14-day free trial",
    secondaryCta: "Create account",
    downloadCta: "Download APK",
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
      "APEX COACH is built to give coaches a cleaner, faster, and more professional experience in real working conditions. It is designed to remove unnecessary steps, clarify the operation, and turn daily work into something more fluid, organized, and dependable.",
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
      "The difference is not adding one more app. It is about freeing up time, reducing mental clutter, and giving the coach more control over what truly matters in order to improve the operation behind every client.",
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
      { title: "Can I create templates and use tags?", text: "Yes. The app allows reusable templates and tagging logic to classify exercises, sessions, and work structures. This reduces manual repetition and helps make the daily operation more consistent." },
      { title: "Is the exercise database only for consultation?", text: "No. The exercise database is meant to actively support training preparation, adaptation, and repetition. The goal is not just to view exercises, but to accelerate prescription decisions with stronger technical consistency." },
      { title: "Can client billing be managed inside the app?", text: "Yes. APEX COACH was designed to concentrate packs, payments, alerts, and financial follow-up inside the same operational flow, reducing the need for parallel systems." },
      { title: "Can the client understand what was done and follow overall progress?", text: "Yes. The app structure helps the coach register what was prescribed, what was executed, and what changed over time, creating a clearer view of the client's overall evolution." },
    ],
    closingTitle: "If you are looking for a more fluid, more rigorous, and more professional operation, this is the right time to join.",
    closingText:
      "APEX COACH is evolving to establish itself as a faster, more intuitive, and more valuable tool for coaches. Join now, use it in the field, and see how it can help you run your operation with more clarity, more control, and stronger consistency.",
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

function BrandLogoIcon({ className = "h-10 w-10" }) {
  return (
    <svg viewBox="0 0 48 48" aria-hidden="true" className={className}>
      <defs>
        <linearGradient id="apex-logo-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="var(--accent-strong)" />
          <stop offset="52%" stopColor="var(--brand-mid)" />
          <stop offset="100%" stopColor="var(--brand-soft-blue)" />
        </linearGradient>
      </defs>
      <path d="M7 34.5 18.5 30V41H7v-6.5Z" fill="url(#apex-logo-gradient)" />
      <path d="M19.75 24.5 31 18.5V41H19.75V24.5Z" fill="url(#apex-logo-gradient)" opacity="0.92" />
      <path d="M32.25 11.75 41 7v34h-8.75V11.75Z" fill="url(#apex-logo-gradient)" opacity="0.84" />
      <path d="M6.25 41 23.5 22.25l4.25 3.25L42 9.75V41H6.25Z" fill="rgba(14,17,16,0.12)" />
      <path d="M31.75 41h9.5" stroke="var(--text)" strokeWidth="2.2" strokeLinecap="round" />
    </svg>
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
    <>
      <BrandLogoIcon className="h-10 w-10 shrink-0" />
      <div>
        <p className="text-sm font-semibold tracking-[0.18em] text-[var(--text)]">
          <BrandMark compact />
        </p>
        <p className="text-xs uppercase tracking-[0.22em] text-[var(--text-muted)]">professional coaching app</p>
      </div>
    </>
  );
}

function renderBrandText(text) {
  if (typeof text !== "string") return text;
  const normalized = text.replace(/\*APEX COACH\*/g, "APEX COACH");
  const parts = normalized.split("APEX COACH");
  return parts.flatMap((part, index) => (index === parts.length - 1 ? [part] : [part, <BrandMark key={`brand-${index}`} compact sizeClass="text-inherit" />]));
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

function ProductMatrix({ lang = "en" }) {
  const isPt = lang === "pt";
  const headers = isPt
    ? ["Função", "Trainerize", "PT Distinction", "Everfit", "APEX COACH [v1]", "APEX COACH [v2]"]
    : ["Function", "Trainerize", "PT Distinction", "Everfit", "APEX COACH [v1]", "APEX COACH [v2]"];

  const rows = isPt
    ? [
        ["Registar clients", "yes", "yes", "yes", "yes", "soon"],
        ["Registar assessments", "partial", "yes", "partial", "yes", "soon"],
        ["Criar treinos", "yes", "yes", "yes", "yes", "soon"],
        ["Periodização semanal", "partial", "yes", "partial", "yes", "soon"],
        ["Protocolos de treino", "partial", "yes", "partial", "yes", "soon"],
        ["Templates e tags", "partial", "yes", "yes", "yes", "soon"],
        ["Atividades externas", "no", "yes", "partial", "yes", "soon"],
        ["Tracking global da evolução", "partial", "yes", "yes", "yes", "soon"],
        ["Faturação e packs", "no", "partial", "yes", "yes", "soon"],
        ["Plataforma web", "yes", "yes", "yes", "no", "soon"],
        ["Health app connect", "partial", "partial", "partial", "no", "soon"],
        ["Automatismos", "partial", "partial", "partial", "partial", "soon"],
      ]
    : [
        ["Register clients", "yes", "yes", "yes", "yes", "soon"],
        ["Register assessments", "partial", "yes", "partial", "yes", "soon"],
        ["Create training", "yes", "yes", "yes", "yes", "soon"],
        ["Weekly periodization", "partial", "yes", "partial", "yes", "soon"],
        ["Training protocols", "partial", "yes", "partial", "yes", "soon"],
        ["Templates and tags", "partial", "yes", "yes", "yes", "soon"],
        ["External activities", "no", "yes", "partial", "yes", "soon"],
        ["Global progress tracking", "partial", "yes", "yes", "yes", "soon"],
        ["Billing and packs", "no", "partial", "yes", "yes", "soon"],
        ["Web platform", "yes", "yes", "yes", "no", "soon"],
        ["Health app connect", "partial", "partial", "partial", "no", "soon"],
        ["Automations", "partial", "partial", "partial", "partial", "soon"],
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
        icon: <BellRing size={14} />,
        className: "border-amber-200 bg-amber-50 text-amber-700",
        label: isPt ? "Parcial" : "Partial",
      },
      soon: {
        icon: <Clock3 size={14} />,
        className: "border-sky-200 bg-sky-50 text-sky-700",
        label: isPt ? "Coming soon" : "Coming soon",
      },
    }[status];

    return (
      <span className={`inline-flex h-8 w-8 items-center justify-center rounded-full border ${config.className}`} title={config.label} aria-label={config.label}>
        {config.icon}
      </span>
    );
  }

  return (
    <div className="overflow-hidden rounded-[32px] border border-[var(--border-strong)] bg-white shadow-[var(--shadow-panel)]">
      <div className="overflow-x-auto">
        <table className="min-w-[920px] border-collapse text-left">
          <thead className="bg-[linear-gradient(135deg,var(--accent-soft),rgba(124,77,255,0.06))]">
            <tr>
              {headers.map((header) => (
                <th key={header} className="px-5 py-4 text-sm font-semibold text-[var(--text)]">
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, rowIndex) => (
              <tr key={row[0]} className={rowIndex % 2 === 0 ? "bg-white" : "bg-[var(--surface-muted)]/55"}>
                <td className="border-t border-[var(--border)] px-5 py-4 align-top text-sm leading-7 text-[var(--text)]">
                  <span className="font-semibold">{row[0]}</span>
                </td>
                {row.slice(1).map((value, index) => (
                  <td key={`${row[0]}-${index}`} className="border-t border-[var(--border)] px-5 py-4 align-top text-center text-sm leading-7 text-[var(--text-muted)]">
                    <div className="flex justify-center">{renderStatus(value)}</div>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="border-t border-[var(--border)] bg-[var(--surface-muted)]/65 px-5 py-4">
        <div className="flex flex-wrap gap-3 text-xs font-medium text-[var(--text-muted)]">
          {[
            { key: "yes", label: isPt ? "Disponível" : "Available" },
            { key: "partial", label: isPt ? "Parcial" : "Partial" },
            { key: "no", label: isPt ? "Não disponível" : "Not available" },
            { key: "soon", label: isPt ? "Planeado para v2" : "Planned for v2" },
          ].map((item) => (
            <div key={item.key} className="inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-white px-3 py-2">
              {renderStatus(item.key)}
              <span>{item.label}</span>
            </div>
          ))}
        </div>
      </div>
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
  const [openFaqIndex, setOpenFaqIndex] = useState(0);

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
            <BrandLockup />
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
              <a
                href="/download/apk"
                onClick={() => trackEvent("landing_header_download_click", { locale: lang })}
                className="inline-flex items-center gap-2 whitespace-nowrap rounded-full border border-[var(--border)] bg-white px-4 py-3 text-sm font-semibold text-[var(--text)] transition hover:border-[var(--border-strong)] hover:bg-[var(--surface-solid)]"
              >
                <Smartphone size={15} />
                {t.downloadCta}
              </a>
              <Link href="/signup" onClick={() => trackEvent("landing_header_signup_click", { locale: lang })} className="whitespace-nowrap rounded-full bg-[var(--accent)] px-5 py-3 text-sm font-semibold text-[var(--accent-foreground)] shadow-[0_12px_40px_rgba(42,208,125,0.24)]">
                {lang === "pt" ? "Trial grÃƒÂ¡tis 14 dias" : "14-day free trial"}
              </Link>
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
              <a
                href="/download/apk"
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

      <main id="top">
        <section className="mx-auto grid max-w-7xl gap-14 px-5 pb-20 pt-16 lg:grid-cols-[1.05fr_0.95fr] lg:px-8 lg:pb-28 lg:pt-24">
          <div className="max-w-3xl">
            <div className="inline-flex rounded-full border border-[var(--accent)]/20 bg-[linear-gradient(135deg,var(--accent-soft),rgba(124,77,255,0.08))] px-4 py-2 text-sm font-medium text-[var(--accent-strong)]">
              {renderBrandText(t.badge)}
            </div>
            <h1 className="mt-8 text-5xl font-semibold leading-[1.02] text-[var(--text)] sm:text-6xl xl:text-7xl">
              <span className="block">{renderBrandText(t.titleA)}</span>
              <span className="block text-[var(--text)]">{renderBrandText(t.titleB)}</span>
              <span className="block bg-[image:var(--brand-gradient)] bg-clip-text text-transparent">{renderBrandText(t.titleC)}</span>
            </h1>
            <p className="mt-7 max-w-2xl text-lg leading-8 text-[var(--text-muted)] sm:text-xl">{renderBrandText(t.subtitle)}</p>

            <div className="mt-10 flex flex-col gap-4 sm:flex-row">
              <Link href="/signup" onClick={() => trackEvent("landing_hero_signup_click", { locale: lang })} className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[var(--accent)] px-6 py-4 text-base font-semibold text-[var(--accent-foreground)] shadow-[0_18px_60px_rgba(42,208,125,0.24)]">
                {t.primaryCta}
                <ArrowRight size={18} />
              </Link>
              <a
                href="/download/apk"
                onClick={() => trackEvent("landing_hero_download_click", { locale: lang })}
                className="inline-flex items-center justify-center gap-2 rounded-2xl border border-[var(--border)] bg-white px-6 py-4 text-base font-semibold text-[var(--text)] transition hover:border-[var(--border-strong)] hover:bg-[var(--surface-solid)]"
              >
                <Smartphone size={18} />
                {t.downloadCta}
              </a>
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
            <div className="mt-5 grid gap-8">
              <div>
                <h2 className="max-w-4xl text-4xl font-semibold leading-tight text-[var(--text)] sm:text-5xl">
                  {lang === "pt"
                    ? "O que a APEX COACH jÃ¡ faz hoje e o que entra nas prÃ³ximas versÃµes."
                    : "What APEX COACH already does today and what enters in the next releases."}
                </h2>
                <p className="mt-6 max-w-3xl text-lg leading-8 text-[var(--text-muted)]">
                  {lang === "pt"
                    ? "Em vez de separar o sistema atual do roadmap, esta matriz mostra diretamente o que jÃ¡ estÃ¡ disponÃ­vel na app, onde plataformas generalistas costumam ficar curtas e o que estÃ¡ previsto para a prÃ³xima fase da APEX COACH."
                    : "Instead of separating the current system from the roadmap, this matrix shows what is already available in the app, where broader platforms often fall short, and what is planned for the next APEX COACH phase."}
                </p>
              </div>
              <div>
                <ProductMatrix lang={lang} />
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
                  <Link href="/signup" className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[var(--accent)] px-6 py-4 font-semibold text-[var(--accent-foreground)]">
                    {t.primaryCta}
                    <ArrowRight size={18} />
                  </Link>
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
            {t.faqItems.map((item, index) => (
              <div key={item.title} className="overflow-hidden rounded-[28px] border border-[var(--border)] bg-[var(--surface-solid)] shadow-[var(--shadow-soft)]">
                <button
                  type="button"
                  onClick={() => setOpenFaqIndex((current) => (current === index ? -1 : index))}
                  className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left transition hover:bg-[var(--surface-muted)]"
                >
                  <h3 className="text-xl font-semibold text-[var(--text)]">{item.title}</h3>
                  <ChevronDown
                    size={18}
                    className={`shrink-0 text-[var(--text-muted)] transition-transform ${openFaqIndex === index ? "rotate-180" : ""}`}
                  />
                </button>
                {openFaqIndex === index ? (
                  <div className="border-t border-[var(--border)] px-6 py-5">
                    <p className="max-w-4xl text-base leading-8 text-[var(--text-muted)]">{item.text}</p>
                  </div>
                ) : null}
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
            <BrandLogoIcon className="h-8 w-8 shrink-0" />
            <div>
              <p className="font-medium text-[var(--text)]"><BrandMark compact /></p>
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

