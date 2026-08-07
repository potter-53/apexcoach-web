"use client";

import { startTransition, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, CalendarDays, Check, ClipboardList, Dumbbell, Globe2, LayoutDashboard, LoaderCircle, LogOut, MessageCircle, Plus, Send, ShieldCheck, Users, X } from "lucide-react";
import { COACH_LANGUAGE_OPTIONS, applyCoachLocale, getStoredCoachLocale, guessCoachLocale } from "../../src/lib/coach-locale";
import { getSupabaseBrowserClient, isSupabaseConfigured } from "../../src/lib/supabase-browser";
import AgendaWorkspace from "./AgendaWorkspace";
import ClientWorkspace from "./ClientWorkspace";
import AssessmentBuilderWorkspace from "./AssessmentBuilderWorkspace";
import TrainingBuilderWorkspace from "./TrainingBuilderWorkspace";

const DEFAULT_BOOKING_TYPES = [
  { name: "Treino 30min", category: "pt_session", duration_minutes: 30, price_eur: 0 },
  { name: "Treino 45min", category: "pt_session", duration_minutes: 45, price_eur: 0 },
  { name: "Treino 60min", category: "pt_session", duration_minutes: 60, price_eur: 0 },
  { name: "Avaliacao fisica", category: "physical_assessment", duration_minutes: 60, price_eur: 0 },
];

const EMPTY_CORE = {
  profile: null,
  subscription: null,
  metrics: { clients: 0, agendaToday: 0, assessments: 0, trainings: 0 },
  business: {
    monthlyRevenue: 0,
    yearlyRevenue: 0,
    deliveredTrainings: 0,
    missingBookings: 0,
    pendingBillingCount: 0,
    pendingBillingAmount: 0,
    overdueBillingCount: 0,
    expiringPacks: 0,
    attention: [],
    dueProfiles: [],
  },
  upcomingAgenda: [],
};
const EMPTY_LISTS = { students: [], recentAssessments: [], recentTrainings: [] };
const EMPTY_FORM = { studentId: "", bookingTypeId: "", scheduledDate: "", scheduledTime: "", notes: "" };
/*
  { value: "en", label: "English", flag: "🇬🇧" },
  { value: "pt", label: "Português", flag: "🇵🇹" },
  { value: "es", label: "Español", flag: "🇪🇸" },
  { value: "fr", label: "Français", flag: "🇫🇷" },
];

*/
const LANGUAGE_OPTIONS = COACH_LANGUAGE_OPTIONS;

const DASHBOARD_COPY = {
  en: {
    tabs: { dashboard: "Dashboard", clients: "Clients", assessments: "Assessments", agenda: "Agenda", trainings: "Trainings", coach: "Coach" },
    noDate: "No date",
    noDetail: "No detail",
    coachSession: "Validating coach session...",
    configTitle: "Supabase not configured",
    configText: "Add the public Supabase variables to use the browser with live data.",
    activeClientsHint: "Real clients connected to this coach.",
    agendaTodayHint: "Bookings scheduled for today.",
    assessmentsHint: "Assessments already stored.",
    trainingsHint: "Training sessions in history.",
    languageSetup: "Language setup",
    chooseLanguage: "Choose the language for your coach workspace",
    chooseLanguageText: "We could not find a saved language from the app, so we pre-selected the most likely option based on your browser region. You can change it now and the choice will sync with your coach account.",
    saveLanguage: "Save language",
    saveChanges: "Save changes",
    bookingTitle: "New booking",
    bookingHeading: "Schedule session in browser",
    bookingText: "Create a booking directly for a client with the same agenda logic used in the APK.",
    loadingBooking: "Loading clients and booking types...",
    client: "Client",
    selectClient: "Select client",
    bookingType: "Booking type",
    selectType: "Select type",
    date: "Date",
    time: "Time",
    notes: "Notes",
    notesPlaceholder: "Session details, coaching focus, context...",
    cancel: "Cancel",
    createBooking: "Create booking",
    coachBrowserWorkspace: "Coach browser workspace",
    agendaHeadline: "Agenda first. Faster, clearer, more practical.",
    agendaSubhead: "The coach core loads first and the heavier tabs come in only when you need them.",
    switchAccount: "Switch account",
    signOut: "Sign out",
    loadingCore: "Loading coach core...",
    coachPulse: "Coach pulse",
    agendaSpotlight: "Agenda spotlight",
    quickSummary: "Quick summary",
    summaryText: "The essentials for the coach without waiting for the heavier tabs.",
    quickAction: "Quick action",
    bookFaster: "Book faster",
    bookFasterText: "Open the booking flow and jump straight into the refreshed agenda.",
    createNow: "Create now",
    createNowHint: "The goal is fewer clicks: open, choose a client, select the booking type, and lock it in.",
    assessmentsTitle: "Recent assessments",
    assessmentsText: "This tab only loads when you actually open it.",
    loadingAssessments: "Loading assessments...",
    noAssessments: "No assessments yet",
    noAssessmentsText: "There are still no assessments in this account history.",
    savedMetrics: "saved metrics",
    trainingsTitle: "Training sessions",
    trainingsText: "Training history only loads when you open this tab.",
    loadingTrainings: "Loading trainings...",
    noTrainings: "No training sessions yet",
    noTrainingsText: "There are no recorded training sessions for this account yet.",
    untitledSession: "Untitled session",
    noLinkedClient: "No linked client",
    coachHub: "Coach hub",
    coachAccount: "Coach account",
    coachAccountText: "The coach core stays accessible without slowing down the dashboard boot.",
    noEmail: "No email",
    subscriptionTitle: "Account status",
    subscriptionText: "Quick read on the plan and coach access.",
    languageSettings: "Language settings",
    languageSettingsText: "Change the browser language for this coach account and keep every page aligned.",
    activeLanguage: "Active language",
    saveLanguageHint: "The browser updates immediately and this choice is saved to your coach settings.",
    planStatus: "Plan status",
    webWorkspace: "Web workspace",
    coachNameLabel: "Coach name",
    subscriptionLabel: "Subscription",
    nameLabel: "Name",
    emailLabel: "Email",
    subscriptionEyebrow: "Subscription",
    fastWorkspace: "Fast-loading workspace with the agenda ready to act on.",
    newBooking: "New booking",
    backToLanding: "Back to landing",
    noUpcomingTitle: "No upcoming bookings",
    noUpcomingText: "Create the first booking directly from the browser workspace.",
    couldNotSaveLanguage: "Could not save the language preference.",
    invalidBookingType: "Invalid booking type.",
    prepareBookingError: "Could not prepare the booking.",
    createBookingError: "Could not create the booking.",
    selectRequired: "Select client, booking type, date, and time.",
    businessPulseTitle: "Business pulse",
    businessPulseText: "Revenue, delivery, billing gaps, and pack pressure in one place.",
    monthlyBilling: "Monthly billing",
    yearlyBilling: "Year to date",
    deliveredSessions: "Sessions delivered",
    missingBookings: "Bookings missing",
    pendingBilling: "Pending billing",
    expiringPacks: "Packs low",
    overdueBilling: "Overdue billing",
    operationsBoard: "Operations board",
    financeOverview: "Billing overview",
    financeOverviewText: "What is billed, what is pending, and where the coach needs to act next.",
    attentionBoard: "Client inbox",
    attentionBoardText: "Recent client conversations with pending actions first.",
    noAttention: "No pending client actions right now.",
    pendingAmount: "Pending amount",
    dueProfiles: "Clients awaiting billing follow-up",
    noDueProfiles: "No billing profiles need follow-up right now.",
    actionMissing: "bookings missing",
    actionPack: "pack sessions left",
    actionBilling: "billing pending",
    inboxOpenThread: "Open client thread",
    inboxBack: "Back to inbox",
    inboxReplyPlaceholder: "Write a note or follow-up...",
    inboxPendingThread: "Pending thread",
    inboxSuggestedAction: "Suggested next action",
    inboxAutoMessage: "APEX Coach detected this pending client action.",
    inboxBillingAction: "Review billing status and follow up with the client.",
    inboxScheduleAction: "Review the plan and add the missing booking.",
    inboxPackAction: "Confirm the pack renewal or create the next package.",
    inboxNoConversation: "Select a client to open the thread inside the Coach HUB.",
    inboxRequiresAction: "Needs action",
    inboxReviewed: "Reviewed",
    inboxAuthorCoach: "Coach",
    inboxAuthorClient: "Client",
    inboxAuthorSystem: "Apex",
    inboxInvitePending: "Client invite is pending.",
    inboxInviteAction: "Manage invite",
    inboxAgendaCoachScheduled: "Coach scheduled",
    inboxAgendaClientRequest: "Client requested a booking or change. Coach validation is required.",
    inboxAgendaCancelRequest: "Client requested cancellation. Coach validation is required.",
    inboxClientCompleted: "Client completed",
    inboxValidateSchedule: "Validate schedule",
    inboxViewSchedule: "View schedule",
    inboxViewStatus: "View status",
  },
  pt: {
    tabs: { dashboard: "Dashboard", clients: "Clientes", assessments: "Avaliações", agenda: "Agenda", trainings: "Treinos", coach: "Coach" },
    noDate: "Sem data",
    noDetail: "Sem detalhe",
    coachSession: "A validar sessão do coach...",
    configTitle: "Supabase não configurado",
    configText: "Adiciona as variáveis públicas do Supabase para usar o browser com dados reais.",
    activeClientsHint: "Clientes reais associados a este coach.",
    agendaTodayHint: "Marcações agendadas para hoje.",
    assessmentsHint: "Avaliações já guardadas.",
    trainingsHint: "Sessões de treino no histórico.",
    languageSetup: "Definição de idioma",
    chooseLanguage: "Escolhe o idioma do teu workspace de coach",
    chooseLanguageText: "Não encontrámos um idioma guardado vindo da app, por isso pré-selecionámos a opção mais provável com base na região do teu browser. Podes alterar agora e a escolha ficará sincronizada com a tua conta.",
    saveLanguage: "Guardar idioma",
    saveChanges: "Guardar alterações",
    bookingTitle: "Nova marcação",
    bookingHeading: "Agendar sessão no browser",
    bookingText: "Cria uma marcação diretamente para um cliente com a mesma lógica de agenda usada na APK.",
    loadingBooking: "A carregar clientes e tipos de marcação...",
    client: "Cliente",
    selectClient: "Selecionar cliente",
    bookingType: "Tipo de marcação",
    selectType: "Selecionar tipo",
    date: "Data",
    time: "Hora",
    notes: "Notas",
    notesPlaceholder: "Detalhes da sessão, foco do treino, contexto...",
    cancel: "Cancelar",
    createBooking: "Criar marcação",
    coachBrowserWorkspace: "Workspace web do coach",
    agendaHeadline: "Agenda primeiro. Mais rápida, mais clara, mais prática.",
    agendaSubhead: "O núcleo do coach carrega primeiro e os separadores mais pesados só entram quando precisas deles.",
    switchAccount: "Trocar conta",
    signOut: "Terminar sessão",
    loadingCore: "A carregar núcleo do coach...",
    coachPulse: "Pulso do coach",
    agendaSpotlight: "Agenda em destaque",
    quickSummary: "Resumo rápido",
    summaryText: "O essencial do coach sem esperar pelos separadores mais pesados.",
    quickAction: "Ação rápida",
    bookFaster: "Marcar mais depressa",
    bookFasterText: "Abre a criação de marcação e salta logo para a agenda atualizada.",
    createNow: "Criar agora",
    createNowHint: "O objetivo é reduzir cliques: abrir, escolher cliente, selecionar o tipo e marcar.",
    assessmentsTitle: "Avaliações recentes",
    assessmentsText: "Este separador carrega apenas quando o abres.",
    loadingAssessments: "A carregar avaliações...",
    noAssessments: "Ainda sem avaliações",
    noAssessmentsText: "Ainda não existem avaliações no histórico desta conta.",
    savedMetrics: "métricas guardadas",
    trainingsTitle: "Sessões de treino",
    trainingsText: "O histórico de treinos só carrega quando abres este separador.",
    loadingTrainings: "A carregar treinos...",
    noTrainings: "Ainda sem sessões de treino",
    noTrainingsText: "Ainda não existem sessões de treino registadas para esta conta.",
    untitledSession: "Sessão sem título",
    noLinkedClient: "Sem cliente associado",
    coachHub: "Coach hub",
    coachAccount: "Conta do coach",
    coachAccountText: "O núcleo da conta continua acessível sem atrasar o arranque do dashboard.",
    noEmail: "Sem email",
    subscriptionTitle: "Estado da conta",
    subscriptionText: "Leitura rápida do plano e do acesso do coach.",
    languageSettings: "Definições de idioma",
    languageSettingsText: "Altera o idioma do browser para esta conta de coach e mantém todas as páginas alinhadas.",
    activeLanguage: "Idioma ativo",
    saveLanguageHint: "O browser atualiza logo e esta escolha fica guardada nas settings do coach.",
    planStatus: "Estado do plano",
    webWorkspace: "Workspace web",
    coachNameLabel: "Nome do coach",
    subscriptionLabel: "Subscrição",
    nameLabel: "Nome",
    emailLabel: "Email",
    subscriptionEyebrow: "Subscrição",
    fastWorkspace: "Workspace rápido com a agenda pronta a usar.",
    newBooking: "Nova marcação",
    backToLanding: "Voltar à landing",
    noUpcomingTitle: "Sem marcações futuras",
    noUpcomingText: "Cria a primeira marcação diretamente aqui no browser.",
    couldNotSaveLanguage: "Não foi possível guardar a preferência de idioma.",
    invalidBookingType: "Tipo de marcação inválido.",
    prepareBookingError: "Não foi possível preparar a marcação.",
    createBookingError: "Não foi possível criar a marcação.",
    selectRequired: "Seleciona cliente, tipo de marcação, data e hora.",
    businessPulseTitle: "Pulso do negócio",
    businessPulseText: "Faturação, serviço entregue, falhas de agenda e packs sob pressão num só bloco.",
    monthlyBilling: "Faturação mensal",
    yearlyBilling: "Faturação do ano",
    deliveredSessions: "Sessões dadas",
    missingBookings: "Marcações em falta",
    pendingBilling: "Faturação pendente",
    expiringPacks: "Packs em baixo",
    overdueBilling: "Cobranças em atraso",
    operationsBoard: "Painel operacional",
    financeOverview: "Visão de faturação",
    financeOverviewText: "O que está a entrar, o que falta regularizar e onde o coach precisa de agir.",
    attentionBoard: "Inbox de clientes",
    attentionBoardText: "Conversas recentes com clientes, com pendências no topo.",
    noAttention: "Não existem pendências de clientes neste momento.",
    pendingAmount: "Valor pendente",
    dueProfiles: "Clientes à espera de seguimento de cobrança",
    noDueProfiles: "Não há perfis de cobrança a precisar de seguimento.",
    actionMissing: "marcações em falta",
    actionPack: "sessões de pack restantes",
    actionBilling: "cobrança pendente",
    inboxOpenThread: "Abrir conversa do cliente",
    inboxBack: "Voltar à inbox",
    inboxReplyPlaceholder: "Escrever nota ou seguimento...",
    inboxPendingThread: "Conversa pendente",
    inboxSuggestedAction: "Próxima ação sugerida",
    inboxAutoMessage: "A APEX Coach detetou esta pendência do cliente.",
    inboxBillingAction: "Revê o estado da cobrança e faz seguimento com o cliente.",
    inboxScheduleAction: "Revê o plano e adiciona a marcação em falta.",
    inboxPackAction: "Confirma a renovação do pack ou cria o próximo pacote.",
    inboxNoConversation: "Seleciona um cliente para abrir a conversa dentro do Coach HUB.",
    inboxRequiresAction: "Requer ação",
    inboxReviewed: "Revisto",
    inboxAuthorCoach: "Coach",
    inboxAuthorClient: "Cliente",
    inboxAuthorSystem: "Apex",
    inboxInvitePending: "Convite do cliente pendente.",
    inboxInviteAction: "Gerir convite",
    inboxAgendaCoachScheduled: "Coach agendou",
    inboxAgendaClientRequest: "Cliente pediu marcação ou alteração. Requer validação do coach.",
    inboxAgendaCancelRequest: "Cliente pediu cancelamento. Requer validação do coach.",
    inboxClientCompleted: "Cliente concluiu",
    inboxValidateSchedule: "Validar agenda",
    inboxViewSchedule: "Ver agenda",
    inboxViewStatus: "Ver status",
  },
  es: {
    tabs: { dashboard: "Dashboard", clients: "Clientes", assessments: "Evaluaciones", agenda: "Agenda", trainings: "Entrenamientos", coach: "Coach" },
    noDate: "Sin fecha",
    noDetail: "Sin detalle",
    coachSession: "Validando la sesión del coach...",
    configTitle: "Supabase no configurado",
    configText: "Añade las variables públicas de Supabase para usar el navegador con datos reales.",
    activeClientsHint: "Clientes reales asociados a este coach.",
    agendaTodayHint: "Reservas programadas para hoy.",
    assessmentsHint: "Evaluaciones ya guardadas.",
    trainingsHint: "Sesiones de entrenamiento en el historial.",
    languageSetup: "Configuración de idioma",
    chooseLanguage: "Elige el idioma de tu workspace de coach",
    chooseLanguageText: "No encontramos un idioma guardado desde la app, así que preseleccionamos la opción más probable según la región de tu navegador. Puedes cambiarla ahora y la elección se sincronizará con tu cuenta.",
    saveLanguage: "Guardar idioma",
    saveChanges: "Guardar cambios",
    bookingTitle: "Nueva reserva",
    bookingHeading: "Programar sesión en el navegador",
    bookingText: "Crea una reserva directamente para un cliente con la misma lógica de agenda usada en la APK.",
    loadingBooking: "Cargando clientes y tipos de reserva...",
    client: "Cliente",
    selectClient: "Seleccionar cliente",
    bookingType: "Tipo de reserva",
    selectType: "Seleccionar tipo",
    date: "Fecha",
    time: "Hora",
    notes: "Notas",
    notesPlaceholder: "Detalles de la sesión, enfoque del trabajo, contexto...",
    cancel: "Cancelar",
    createBooking: "Crear reserva",
    coachBrowserWorkspace: "Workspace web del coach",
    agendaHeadline: "Agenda primero. Más rápida, más clara, más práctica.",
    agendaSubhead: "El núcleo del coach carga primero y las pestañas más pesadas solo aparecen cuando las necesitas.",
    switchAccount: "Cambiar cuenta",
    signOut: "Cerrar sesión",
    loadingCore: "Cargando núcleo del coach...",
    coachPulse: "Pulso del coach",
    agendaSpotlight: "Agenda destacada",
    quickSummary: "Resumen rápido",
    summaryText: "Lo esencial del coach sin esperar por las pestañas más pesadas.",
    quickAction: "Acción rápida",
    bookFaster: "Reservar más rápido",
    bookFasterText: "Abre el flujo de reserva y salta directamente a la agenda actualizada.",
    createNow: "Crear ahora",
    createNowHint: "El objetivo es reducir clics: abrir, elegir cliente, seleccionar el tipo y reservar.",
    assessmentsTitle: "Evaluaciones recientes",
    assessmentsText: "Esta pestaña solo carga cuando realmente la abres.",
    loadingAssessments: "Cargando evaluaciones...",
    noAssessments: "Aún no hay evaluaciones",
    noAssessmentsText: "Todavía no hay evaluaciones en el historial de esta cuenta.",
    savedMetrics: "métricas guardadas",
    trainingsTitle: "Sesiones de entrenamiento",
    trainingsText: "El historial de entrenamientos solo carga cuando abres esta pestaña.",
    loadingTrainings: "Cargando entrenamientos...",
    noTrainings: "Aún no hay sesiones de entrenamiento",
    noTrainingsText: "Todavía no hay sesiones registradas para esta cuenta.",
    untitledSession: "Sesión sin título",
    noLinkedClient: "Sin cliente asociado",
    coachHub: "Coach hub",
    coachAccount: "Cuenta del coach",
    coachAccountText: "El núcleo de la cuenta sigue accesible sin ralentizar el dashboard.",
    noEmail: "Sin email",
    subscriptionTitle: "Estado de la cuenta",
    subscriptionText: "Lectura rápida del plan y del acceso del coach.",
    languageSettings: "Ajustes de idioma",
    languageSettingsText: "Cambia el idioma del navegador para esta cuenta de coach y mantén todas las páginas alineadas.",
    activeLanguage: "Idioma activo",
    saveLanguageHint: "El navegador se actualiza al momento y esta elección queda guardada en la cuenta del coach.",
    planStatus: "Estado del plan",
    webWorkspace: "Workspace web",
    coachNameLabel: "Nombre del coach",
    subscriptionLabel: "Suscripción",
    nameLabel: "Nombre",
    emailLabel: "Email",
    subscriptionEyebrow: "Suscripción",
    fastWorkspace: "Workspace rápido con la agenda lista para actuar.",
    newBooking: "Nueva reserva",
    backToLanding: "Volver a la landing",
    noUpcomingTitle: "Sin próximas reservas",
    noUpcomingText: "Crea la primera reserva directamente desde el navegador.",
    couldNotSaveLanguage: "No se pudo guardar la preferencia de idioma.",
    invalidBookingType: "Tipo de reserva inválido.",
    prepareBookingError: "No se pudo preparar la reserva.",
    createBookingError: "No se pudo crear la reserva.",
    selectRequired: "Selecciona cliente, tipo de reserva, fecha y hora.",
    businessPulseTitle: "Pulso del negocio",
    businessPulseText: "Facturación, servicio entregado, huecos de agenda y packs bajo presión en un solo lugar.",
    monthlyBilling: "Facturación mensual",
    yearlyBilling: "Facturación anual",
    deliveredSessions: "Sesiones realizadas",
    missingBookings: "Reservas faltantes",
    pendingBilling: "Facturación pendiente",
    expiringPacks: "Packs bajos",
    overdueBilling: "Cobros atrasados",
    operationsBoard: "Panel operativo",
    financeOverview: "Resumen de facturación",
    financeOverviewText: "Lo que entra, lo que falta regularizar y dónde el coach debe actuar.",
    attentionBoard: "Inbox de clientes",
    attentionBoardText: "Conversaciones recientes con clientes, con pendientes arriba.",
    noAttention: "No hay pendientes de clientes ahora mismo.",
    pendingAmount: "Importe pendiente",
    dueProfiles: "Clientes pendientes de seguimiento de cobro",
    noDueProfiles: "No hay perfiles de cobro que necesiten seguimiento ahora.",
    actionMissing: "reservas pendientes",
    actionPack: "sesiones de pack restantes",
    actionBilling: "cobro pendiente",
    inboxOpenThread: "Abrir conversación del cliente",
    inboxBack: "Volver a la inbox",
    inboxReplyPlaceholder: "Escribir nota o seguimiento...",
    inboxPendingThread: "Conversación pendiente",
    inboxSuggestedAction: "Siguiente acción sugerida",
    inboxAutoMessage: "APEX Coach detectó esta acción pendiente del cliente.",
    inboxBillingAction: "Revisa el estado de cobro y haz seguimiento con el cliente.",
    inboxScheduleAction: "Revisa el plan y añade la reserva pendiente.",
    inboxPackAction: "Confirma la renovación del pack o crea el próximo paquete.",
    inboxNoConversation: "Selecciona un cliente para abrir la conversación dentro del Coach HUB.",
    inboxRequiresAction: "Requiere acción",
    inboxReviewed: "Revisado",
    inboxAuthorCoach: "Coach",
    inboxAuthorClient: "Cliente",
    inboxAuthorSystem: "Apex",
    inboxInvitePending: "La invitación del cliente está pendiente.",
    inboxInviteAction: "Gestionar invitación",
    inboxAgendaCoachScheduled: "Coach programó",
    inboxAgendaClientRequest: "El cliente solicitó una reserva o cambio. Requiere validación del coach.",
    inboxAgendaCancelRequest: "El cliente solicitó cancelación. Requiere validación del coach.",
    inboxClientCompleted: "Cliente completó",
    inboxValidateSchedule: "Validar agenda",
    inboxViewSchedule: "Ver agenda",
    inboxViewStatus: "Ver estado",
  },
  fr: {
    tabs: { dashboard: "Dashboard", clients: "Clients", assessments: "Évaluations", agenda: "Agenda", trainings: "Entraînements", coach: "Coach" },
    noDate: "Sans date",
    noDetail: "Sans détail",
    coachSession: "Validation de la session du coach...",
    configTitle: "Supabase non configuré",
    configText: "Ajoute les variables publiques Supabase pour utiliser le navigateur avec des données réelles.",
    activeClientsHint: "Clients réels liés à ce coach.",
    agendaTodayHint: "Réservations prévues pour aujourd'hui.",
    assessmentsHint: "Évaluations déjà enregistrées.",
    trainingsHint: "Séances d'entraînement dans l'historique.",
    languageSetup: "Configuration de la langue",
    chooseLanguage: "Choisis la langue de ton workspace coach",
    chooseLanguageText: "Nous n'avons trouvé aucune langue enregistrée depuis l'app, donc nous avons présélectionné l'option la plus probable selon la région de ton navigateur. Tu peux la changer maintenant et ce choix sera synchronisé avec ton compte.",
    saveLanguage: "Enregistrer la langue",
    saveChanges: "Enregistrer les modifications",
    bookingTitle: "Nouveau rendez-vous",
    bookingHeading: "Planifier une séance dans le navigateur",
    bookingText: "Crée un rendez-vous directement pour un client avec la même logique d'agenda que l'APK.",
    loadingBooking: "Chargement des clients et des types de rendez-vous...",
    client: "Client",
    selectClient: "Sélectionner un client",
    bookingType: "Type de rendez-vous",
    selectType: "Sélectionner un type",
    date: "Date",
    time: "Heure",
    notes: "Notes",
    notesPlaceholder: "Détails de la séance, focus, contexte...",
    cancel: "Annuler",
    createBooking: "Créer le rendez-vous",
    coachBrowserWorkspace: "Workspace web du coach",
    agendaHeadline: "Agenda d'abord. Plus rapide, plus clair, plus pratique.",
    agendaSubhead: "Le noyau du coach charge d'abord et les onglets plus lourds n'arrivent qu'au moment nécessaire.",
    switchAccount: "Changer de compte",
    signOut: "Se déconnecter",
    loadingCore: "Chargement du noyau du coach...",
    coachPulse: "Pouls du coach",
    agendaSpotlight: "Agenda en avant",
    quickSummary: "Résumé rapide",
    summaryText: "L'essentiel du coach sans attendre les onglets plus lourds.",
    quickAction: "Action rapide",
    bookFaster: "Réserver plus vite",
    bookFasterText: "Ouvre le flux de réservation et passe directement à l'agenda mis à jour.",
    createNow: "Créer maintenant",
    createNowHint: "L'objectif est de réduire les clics : ouvrir, choisir le client, sélectionner le type et réserver.",
    assessmentsTitle: "Évaluations récentes",
    assessmentsText: "Cet onglet charge seulement quand tu l'ouvres.",
    loadingAssessments: "Chargement des évaluations...",
    noAssessments: "Pas encore d'évaluations",
    noAssessmentsText: "Il n'y a pas encore d'évaluations dans l'historique de ce compte.",
    savedMetrics: "métriques enregistrées",
    trainingsTitle: "Séances d'entraînement",
    trainingsText: "L'historique des entraînements ne charge que lorsque tu ouvres cet onglet.",
    loadingTrainings: "Chargement des entraînements...",
    noTrainings: "Pas encore de séances d'entraînement",
    noTrainingsText: "Aucune séance d'entraînement n'est encore enregistrée pour ce compte.",
    untitledSession: "Séance sans titre",
    noLinkedClient: "Aucun client associé",
    coachHub: "Coach hub",
    coachAccount: "Compte du coach",
    coachAccountText: "Le noyau du compte reste accessible sans ralentir le dashboard.",
    noEmail: "Sans email",
    subscriptionTitle: "État du compte",
    subscriptionText: "Lecture rapide du plan et de l'accès du coach.",
    languageSettings: "Réglages de langue",
    languageSettingsText: "Change la langue du navigateur pour ce compte coach et garde toutes les pages alignées.",
    activeLanguage: "Langue active",
    saveLanguageHint: "Le navigateur se met à jour tout de suite et ce choix est enregistré dans les réglages du coach.",
    planStatus: "État du plan",
    webWorkspace: "Workspace web",
    coachNameLabel: "Nom du coach",
    subscriptionLabel: "Abonnement",
    nameLabel: "Nom",
    emailLabel: "Email",
    subscriptionEyebrow: "Abonnement",
    fastWorkspace: "Workspace rapide avec l'agenda prêt à l'action.",
    newBooking: "Nouveau rendez-vous",
    backToLanding: "Retour à la landing",
    noUpcomingTitle: "Aucun rendez-vous à venir",
    noUpcomingText: "Crée le premier rendez-vous directement dans le navigateur.",
    couldNotSaveLanguage: "Impossible d'enregistrer la préférence de langue.",
    invalidBookingType: "Type de rendez-vous invalide.",
    prepareBookingError: "Impossible de préparer le rendez-vous.",
    createBookingError: "Impossible de créer le rendez-vous.",
    selectRequired: "Sélectionne le client, le type de rendez-vous, la date et l'heure.",
    businessPulseTitle: "Pouls business",
    businessPulseText: "Facturation, service livré, manques de planning et packs sous pression au même endroit.",
    monthlyBilling: "Facturation mensuelle",
    yearlyBilling: "Facturation annuelle",
    deliveredSessions: "Séances réalisées",
    missingBookings: "Rendez-vous manquants",
    pendingBilling: "Facturation en attente",
    expiringPacks: "Packs faibles",
    overdueBilling: "Factures en retard",
    operationsBoard: "Panneau opérationnel",
    financeOverview: "Vue facturation",
    financeOverviewText: "Ce qui entre, ce qui reste à régulariser et où le coach doit agir.",
    attentionBoard: "Inbox clients",
    attentionBoardText: "Conversations clients récentes, avec les actions en attente en haut.",
    noAttention: "Aucune action client en attente pour le moment.",
    pendingAmount: "Montant en attente",
    dueProfiles: "Clients en attente de suivi de facturation",
    noDueProfiles: "Aucun profil de facturation n'a besoin de suivi maintenant.",
    actionMissing: "rendez-vous manquants",
    actionPack: "séances pack restantes",
    actionBilling: "facturation en attente",
    inboxOpenThread: "Ouvrir la conversation client",
    inboxBack: "Retour à l'inbox",
    inboxReplyPlaceholder: "Écrire une note ou un suivi...",
    inboxPendingThread: "Conversation en attente",
    inboxSuggestedAction: "Prochaine action suggérée",
    inboxAutoMessage: "APEX Coach a détecté cette action client en attente.",
    inboxBillingAction: "Vérifie l'état de facturation et fais le suivi avec le client.",
    inboxScheduleAction: "Vérifie le plan et ajoute le rendez-vous manquant.",
    inboxPackAction: "Confirme le renouvellement du pack ou crée le prochain forfait.",
    inboxNoConversation: "Sélectionne un client pour ouvrir la conversation dans le Coach HUB.",
    inboxRequiresAction: "Action requise",
    inboxReviewed: "Revu",
    inboxAuthorCoach: "Coach",
    inboxAuthorClient: "Client",
    inboxAuthorSystem: "Apex",
    inboxInvitePending: "Invitation client en attente.",
    inboxInviteAction: "Gérer l'invitation",
    inboxAgendaCoachScheduled: "Coach a planifié",
    inboxAgendaClientRequest: "Le client a demandé un rendez-vous ou un changement. Validation coach requise.",
    inboxAgendaCancelRequest: "Le client a demandé une annulation. Validation coach requise.",
    inboxClientCompleted: "Client a terminé",
    inboxValidateSchedule: "Valider l'agenda",
    inboxViewSchedule: "Voir agenda",
    inboxViewStatus: "Voir statut",
  },
};

function getCopy(locale) {
  return DASHBOARD_COPY[locale] || DASHBOARD_COPY.en;
}

function localeTag(locale) {
  if (locale === "pt") return "pt-PT";
  if (locale === "es") return "es-ES";
  if (locale === "fr") return "fr-FR";
  return "en-GB";
}

function formatDate(value, withYear = false, locale = "en") {
  if (!value) return getCopy(locale).noDate;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return getCopy(locale).noDate;
  return date.toLocaleDateString(localeTag(locale), { day: "2-digit", month: "short", ...(withYear ? { year: "numeric" } : {}) });
}

function formatTime(value, locale = "en") {
  if (!value) return "--:--";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "--:--";
  return date.toLocaleTimeString(localeTag(locale), { hour: "2-digit", minute: "2-digit" });
}

function prettifyStatus(value) {
  const normalized = (value ?? "").toString().toLowerCase();
  return normalized ? normalized.replace(/_/g, " ") : "unknown";
}

function colorDot(colorHex) {
  return colorHex || "linear-gradient(135deg, #2ad07d 0%, #7c4dff 100%)";
}

function isCoachAgendaItem(row) {
  const type = String(row.item_type || "").toLowerCase();
  if (!type) return true;
  return !["activity", "external", "health", "solo", "client_activity", "imported"].some((blocked) => type.includes(blocked));
}

function isMachinePortalNote(value) {
  const raw = String(value || "").toLowerCase();
  return raw.includes("__apex") || raw.includes("raw_metadata") || raw.includes("agenda_dedupe_key") || raw.includes('"source"') || raw.includes('"provider"');
}

function missingColumn(error) {
  const message = error?.message?.toLowerCase?.() ?? error?.toString?.().toLowerCase?.() ?? "";
  return message.includes("client_color_hex") && (message.includes("42703") || message.includes("column"));
}

function missingResource(error, resource) {
  const message = error?.message?.toLowerCase?.() ?? error?.toString?.().toLowerCase?.() ?? "";
  return message.includes(resource.toLowerCase()) && (message.includes("42p01") || message.includes("does not exist") || message.includes("relation"));
}

async function colorFallback(builder) {
  try {
    return await builder(true);
  } catch (error) {
    if (!missingColumn(error)) throw error;
    return builder(false);
  }
}

async function optionalResource(builder, resource) {
  try {
    const response = await builder();
    if (response?.error && (missingResource(response.error, resource) || missingColumn(response.error))) {
      return { data: [], error: null };
    }
    return response;
  } catch (error) {
    if (!missingResource(error, resource) && !missingColumn(error)) throw error;
    return { data: [], error: null };
  }
}

function todayBounds() {
  const now = new Date();
  return {
    start: new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString(),
    end: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1).toISOString(),
  };
}

function startOfWeek(date) {
  const base = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  base.setDate(base.getDate() - (base.getDay() === 0 ? 6 : base.getDay() - 1));
  return base;
}

function startOfMonth(date) {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

function startOfYear(date) {
  return new Date(date.getFullYear(), 0, 1);
}

function addMonths(date, months) {
  return new Date(date.getFullYear(), date.getMonth() + months, 1);
}

function addYears(date, years) {
  return new Date(date.getFullYear() + years, 0, 1);
}

function monthKey(date) {
  return `${date.getFullYear()}-${`${date.getMonth() + 1}`.padStart(2, "0")}`;
}

function weeksInclusive(start, end) {
  const startWeek = startOfWeek(start);
  const endWeek = startOfWeek(end);
  return Math.floor((endWeek.getTime() - startWeek.getTime()) / (7 * 24 * 60 * 60 * 1000)) + 1;
}

function numericValue(value, fallback = 0) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function billingPeriodStart(now, billing) {
  if (billing?.last_paid_at) {
    const paidAt = new Date(billing.last_paid_at);
    if (!Number.isNaN(paidAt.getTime())) return new Date(paidAt.getTime() + 1000);
  }

  switch ((billing?.billing_cycle || "monthly").toLowerCase()) {
    case "weekly":
      return startOfWeek(now);
    case "yearly":
      return startOfYear(now);
    case "custom":
      if (billing?.next_due_at) {
        const nextDue = new Date(billing.next_due_at);
        if (!Number.isNaN(nextDue.getTime())) return addMonths(nextDue, -1);
      }
      return startOfMonth(now);
    case "monthly":
    default:
      return startOfMonth(now);
  }
}

function billingPeriodEndExclusive(now, billing) {
  if (billing?.next_due_at) {
    const nextDue = new Date(billing.next_due_at);
    if (!Number.isNaN(nextDue.getTime())) return nextDue;
  }

  switch ((billing?.billing_cycle || "monthly").toLowerCase()) {
    case "weekly":
      return new Date(startOfWeek(now).getTime() + 7 * 24 * 60 * 60 * 1000);
    case "yearly":
      return addYears(startOfYear(now), 1);
    case "custom":
    case "monthly":
    default:
      return addMonths(startOfMonth(now), 1);
  }
}

function fallbackPeriodEndExclusive(start, billingCycle) {
  return billingCycle === "weekly" ? new Date(start.getTime() + 7 * 24 * 60 * 60 * 1000) : addMonths(startOfMonth(start), 1);
}

function getBillingCopy(locale) {
  if (locale === "pt") {
    return {
      currentMonth: "Mês atual",
      previousMonths: "Meses anteriores",
      invoices: "Faturas dos clientes",
      noInvoices: "Ainda não existem faturas neste período.",
      total: "Total",
      paid: "Pago",
      pending: "Pendente",
      clients: "Clientes",
      period: "Período",
      viewInvoices: "Ver faturas",
      monthlyInvoice: "Fatura mensal",
      offeredSessions: "oferta",
      discount: "desconto",
    };
  }
  return {
    currentMonth: "Current month",
    previousMonths: "Previous months",
    invoices: "Client invoices",
    noInvoices: "No invoices for this period yet.",
    total: "Total",
    paid: "Paid",
    pending: "Pending",
    clients: "Clients",
    period: "Period",
    viewInvoices: "View invoices",
    monthlyInvoice: "Monthly invoice",
    offeredSessions: "offered",
    discount: "discount",
  };
}

function formatBillingMonthLabel(date, locale) {
  const tag = localeTag(locale);
  const month = date.toLocaleDateString(tag, { month: "long" });
  const year = date.getFullYear();
  return `${month.charAt(0).toUpperCase()}${month.slice(1)} ${year}`;
}

function formatInvoiceDetail(invoice, labels, locale) {
  const periodStart = new Date(invoice.periodStart || invoice.createdAt || Date.now());
  const periodLabel = Number.isNaN(periodStart.getTime()) ? "" : formatBillingMonthLabel(periodStart, locale);
  const details = [`${labels.monthlyInvoice}${periodLabel ? ` · ${periodLabel}` : ""}`];
  if (invoice.offeredSessionsCount > 0) details.push(`${invoice.offeredSessionsCount} ${labels.offeredSessions}`);
  if (invoice.subtotalCents > invoice.totalCents) details.push(labels.discount);
  return details.join(" · ");
}

function isPackPlan(plan) {
  const mode = String(plan?.plan_mode || "").toLowerCase();
  return mode.includes("pack") || numericValue(plan?.pack_sessions_count) > 0;
}

function isPendingBillingStatus(status) {
  const normalized = String(status || "").toLowerCase();
  return normalized && normalized !== "paid" && normalized !== "not_set";
}

function firstName(value, fallback = "Client") {
  const parts = String(value || "").trim().split(/\s+/).filter(Boolean);
  return parts[0] || fallback;
}

function buildBillingMonths(invoices = [], students = [], now = new Date()) {
  const studentsById = Object.fromEntries((students || []).map((student) => [student.id, student]));
  const months = new Map();

  for (const invoice of invoices || []) {
    const status = String(invoice.status || "").toLowerCase();
    if (status === "void") continue;

    const periodStart = new Date(invoice.period_start || invoice.billing_month || invoice.created_at || now);
    if (Number.isNaN(periodStart.getTime())) continue;

    const key = monthKey(periodStart);
    const totalCents = numericValue(invoice.total_cents);
    const paid = status === "paid";
    const studentId = invoice.student_id;
    const student = studentsById[studentId] || {};
    const month = months.get(key) || {
      key,
      date: startOfMonth(periodStart),
      invoices: [],
      totalCents: 0,
      paidCents: 0,
      pendingCents: 0,
    };

    month.invoices.push({
      id: invoice.id || invoice.invoice_id,
      studentId,
      studentName: invoice.student_name || student.full_name || "Client",
      clientColorHex: invoice.client_color_hex || student.client_color_hex || null,
      invoiceNumber: invoice.display_code || invoice.invoice_code || invoice.invoice_number,
      status,
      totalCents,
      subtotalCents: numericValue(invoice.subtotal_cents),
      discountType: invoice.discount_type || "eur",
      discountValue: numericValue(invoice.discount_value),
      offeredSessionsCount: numericValue(invoice.offered_sessions_count),
      includedItems: numericValue(invoice.included_items),
      paidItems: numericValue(invoice.paid_items),
      pendingApprovalItems: numericValue(invoice.pending_approval_items),
      unpaidItems: numericValue(invoice.unpaid_items),
      ledgerStatus: invoice.ledger_status || "ok",
      statusBucket: invoice.status_bucket || (paid ? "paid" : "unpaid"),
      paid,
      periodStart: invoice.period_start,
      periodEnd: invoice.period_end,
      paidAt: invoice.paid_at,
      receiptId: invoice.receipt_id || null,
      billingCycle: invoice.billing_cycle || "monthly",
    });
    month.totalCents += totalCents;
    month.paidCents += paid ? totalCents : 0;
    month.pendingCents += paid ? 0 : totalCents;
    months.set(key, month);
  }

  const ordered = [...months.values()]
    .map((month) => ({
      ...month,
      invoices: [...month.invoices].sort((a, b) => Number(a.paid) - Number(b.paid) || b.totalCents - a.totalCents || a.studentName.localeCompare(b.studentName)),
    }))
    .sort((a, b) => b.date - a.date);
  const currentKey = monthKey(now);

  return {
    currentMonth: ordered.find((month) => month.key === currentKey) || { key: currentKey, date: startOfMonth(now), invoices: [], totalCents: 0, paidCents: 0, pendingCents: 0 },
    previousMonths: ordered.filter((month) => month.key !== currentKey).slice(0, 6),
  };
}

function summarizeBusiness(rows, billingProfiles, trainingPlans, students, inviteRows = [], portalAgendaRows = [], invoiceRows = [], now = new Date()) {
  const monthStart = startOfMonth(now);
  const yearStart = startOfYear(now);
  const studentsById = Object.fromEntries((students || []).map((student) => [student.id, student]));
  const pastPtRows = rows.filter((row) => {
    const scheduledAt = new Date(row.scheduled_at);
    return row.item_type === "pt_session" && row.status !== "canceled" && !Number.isNaN(scheduledAt.getTime()) && scheduledAt <= now;
  });

  const monthlyRevenue = pastPtRows
    .filter((row) => new Date(row.scheduled_at) >= monthStart)
    .reduce((sum, row) => sum + numericValue(row.booking_types?.price_eur), 0);

  const yearlyRevenue = pastPtRows
    .filter((row) => new Date(row.scheduled_at) >= yearStart)
    .reduce((sum, row) => sum + numericValue(row.booking_types?.price_eur), 0);

  const pendingProfiles = billingProfiles.filter((profile) => isPendingBillingStatus(profile.status) && numericValue(profile.amount_cents) > 0);
  const pendingBillingAmount = pendingProfiles.reduce((sum, profile) => sum + numericValue(profile.amount_cents) / 100, 0);
  const overdueBillingCount = pendingProfiles.filter((profile) => {
    if (!profile.next_due_at) return false;
    const dueAt = new Date(profile.next_due_at);
    return !Number.isNaN(dueAt.getTime()) && dueAt < now;
  }).length;

  const rowsByStudent = rows.reduce((acc, row) => {
    const studentId = row.student_id;
    if (!studentId) return acc;
    acc[studentId] ??= [];
    acc[studentId].push(row);
    return acc;
  }, {});

  const reminders = [];
  const billingAlerts = pendingProfiles.map((profile) => ({
    id: `billing-${profile.student_id}`,
    type: "billing_pending",
    studentId: profile.student_id,
    studentName: studentsById[profile.student_id]?.full_name || "Client",
    clientColorHex: studentsById[profile.student_id]?.client_color_hex || null,
    attentionCount: 1,
    time: profile.last_requested_at || profile.next_due_at || now.toISOString(),
    sender: profile.status === "pending_approval" ? "client" : profile.status === "overdue" ? "system" : "coach",
    requiresAction: true,
    actionKey: profile.status === "pending_approval" ? "billing_approval" : profile.status === "overdue" ? "billing_overdue" : "billing",
    amountCents: numericValue(profile.amount_cents),
    currencyCode: profile.currency_code || "EUR",
    status: profile.status,
  }));

  const latestInviteByStudent = new Map();
  for (const invite of inviteRows || []) {
    const studentId = invite.student_id;
    if (!studentId || String(invite.status || "").toLowerCase() !== "pending") continue;
    if (!latestInviteByStudent.has(studentId)) latestInviteByStudent.set(studentId, invite);
  }

  const inviteAlerts = [...latestInviteByStudent.entries()].map(([studentId, invite]) => ({
    id: `invite-${studentId}`,
    type: "invite_pending",
    studentId,
    studentName: studentsById[studentId]?.full_name || "Client",
    clientColorHex: studentsById[studentId]?.client_color_hex || null,
    attentionCount: 1,
    time: invite.created_at || now.toISOString(),
    sender: "system",
    requiresAction: true,
    actionKey: "invite_pending",
  }));

  const portalAgendaAlerts = (portalAgendaRows || [])
    .map((row) => {
      const studentId = row.student_id;
      if (!studentId) return null;
      if (!isCoachAgendaItem(row)) return null;
      const status = String(row.status || "").toLowerCase();
      const role = String(row.requested_by_role || "").toLowerCase();
      if (isMachinePortalNote(row.notes) && role !== "coach") return null;
      const note = cleanPortalNote(row.notes, "");
      const base = {
        id: `portal-agenda-${row.id || `${studentId}-${row.scheduled_at}-${status}`}`,
        studentId,
        studentName: studentsById[studentId]?.full_name || "Client",
        clientColorHex: studentsById[studentId]?.client_color_hex || null,
        attentionCount: 1,
        time: row.scheduled_at || now.toISOString(),
        note,
      };
      if (role === "coach" && status === "scheduled") {
        return { ...base, type: "agenda_coach_scheduled", sender: "coach", requiresAction: false, actionKey: "status" };
      }
      if (role === "athlete" && status === "scheduled") {
        return { ...base, type: "agenda_request", sender: "client", requiresAction: true, actionKey: "agenda_request" };
      }
      if (role === "athlete" && status === "canceled") {
        return { ...base, type: "agenda_cancel_request", sender: "client", requiresAction: true, actionKey: "agenda_cancel_request" };
      }
      if (role !== "coach" && status === "completed") {
        return { ...base, type: "client_update", sender: "client", requiresAction: true, actionKey: "client_update" };
      }
      return null;
    })
    .filter(Boolean);

  for (const plan of trainingPlans) {
    const studentId = plan.student_id;
    if (!studentId) continue;

    const billing = billingProfiles.find((profile) => profile.student_id === studentId) || null;
    const start = billingPeriodStart(now, billing);
    const rawEnd = billingPeriodEndExclusive(now, billing);
    const billingCycle = (billing?.billing_cycle || "monthly").toLowerCase() === "weekly" ? "weekly" : "monthly";
    const end = rawEnd > start ? rawEnd : fallbackPeriodEndExclusive(start, billingCycle);
    const coverageStart = billingCycle === "monthly" ? startOfWeek(start) : start;
    const studentRows = (rowsByStudent[studentId] || []).filter((row) => {
      const scheduledAt = new Date(row.scheduled_at);
      return row.item_type === "pt_session" && row.status !== "canceled" && !Number.isNaN(scheduledAt.getTime()) && scheduledAt >= coverageStart && scheduledAt < end;
    });

    if (isPackPlan(plan)) {
      const packSessionsCount = numericValue(plan.pack_sessions_count);
      const remaining = Math.max(0, packSessionsCount - studentRows.length);
      if (packSessionsCount > 0 && remaining <= 3) {
        reminders.push({
          id: `pack-${studentId}`,
          type: "pack_low",
          studentId,
          studentName: studentsById[studentId]?.full_name || "Client",
          clientColorHex: studentsById[studentId]?.client_color_hex || null,
          attentionCount: remaining,
          time: now.toISOString(),
          sender: "system",
          requiresAction: true,
          actionKey: "pack_low",
        });
      }
      continue;
    }

    const sessionsPerWeek = numericValue(plan.sessions_per_week);
    if (sessionsPerWeek <= 0) continue;

    const firstScheduled = [...studentRows].sort((a, b) => new Date(a.scheduled_at) - new Date(b.scheduled_at))[0];
    const createdAt = plan.created_at ? new Date(plan.created_at) : null;
    const anchorSource = firstScheduled ? new Date(firstScheduled.scheduled_at) : createdAt && !Number.isNaN(createdAt.getTime()) ? createdAt : start;
    const activeStart = startOfWeek(anchorSource < coverageStart ? coverageStart : anchorSource);
    const periodProgressEnd = now < end ? now : new Date(end.getTime() - 1000);
    if (periodProgressEnd < activeStart) continue;

    const expectedCount = weeksInclusive(activeStart, periodProgressEnd) * sessionsPerWeek;
    const missingCount = Math.max(0, expectedCount - studentRows.length);
    if (missingCount > 0) {
      reminders.push({
        id: `schedule-${studentId}`,
        type: "weekly_shortfall",
        studentId,
        studentName: studentsById[studentId]?.full_name || "Client",
        clientColorHex: studentsById[studentId]?.client_color_hex || null,
        attentionCount: missingCount,
        time: now.toISOString(),
        sender: "system",
        requiresAction: true,
        actionKey: "weekly_shortfall",
      });
    }
  }

  const attentionPriority = { billing_pending: 4, agenda_request: 4, agenda_cancel_request: 4, client_update: 3, invite_pending: 3, weekly_shortfall: 2, pack_low: 2, agenda_coach_scheduled: 1 };
  const attention = [...portalAgendaAlerts, ...inviteAlerts, ...reminders, ...billingAlerts]
    .sort((a, b) => {
      if (Boolean(a.requiresAction) !== Boolean(b.requiresAction)) return a.requiresAction ? -1 : 1;
      return (attentionPriority[b.type] || 0) - (attentionPriority[a.type] || 0) || new Date(b.time || 0) - new Date(a.time || 0) || b.attentionCount - a.attentionCount || a.studentName.localeCompare(b.studentName);
    })
    .slice(0, 18);

  return {
    monthlyRevenue,
    yearlyRevenue,
    deliveredTrainings: pastPtRows.length,
    missingBookings: reminders.filter((item) => item.type === "weekly_shortfall").reduce((sum, item) => sum + item.attentionCount, 0),
    pendingBillingCount: pendingProfiles.length,
    pendingBillingAmount,
    overdueBillingCount,
    expiringPacks: reminders.filter((item) => item.type === "pack_low").length,
    attention,
    billingMonths: buildBillingMonths(invoiceRows, students, now),
    dueProfiles: pendingProfiles.slice(0, 5).map((profile) => ({
      ...profile,
      studentName: studentsById[profile.student_id]?.full_name || "Client",
      clientColorHex: studentsById[profile.student_id]?.client_color_hex || null,
    })),
  };
}

function formatCurrency(amount, locale = "en", currencyCode = "EUR") {
  try {
    return new Intl.NumberFormat(localeTag(locale), { style: "currency", currency: currencyCode || "EUR", maximumFractionDigits: 0 }).format(amount || 0);
  } catch {
    return `${(amount || 0).toFixed(0)} ${currencyCode || "EUR"}`;
  }
}

function defaultDate() {
  const date = new Date();
  return `${date.getFullYear()}-${`${date.getMonth() + 1}`.padStart(2, "0")}-${`${date.getDate()}`.padStart(2, "0")}`;
}

function defaultTime() {
  const date = new Date();
  return `${`${date.getHours()}`.padStart(2, "0")}:${`${date.getMinutes()}`.padStart(2, "0")}`;
}

function combineDateTime(dateValue, timeValue) {
  const [year, month, day] = dateValue.split("-").map(Number);
  const [hours, minutes] = timeValue.split(":").map(Number);
  return new Date(year, month - 1, day, hours, minutes, 0, 0);
}

function cleanPortalNote(value, fallback = "") {
  const raw = String(value || "").trim();
  if (!raw) return fallback;

  const extractHumanText = (payload) => {
    if (!payload || typeof payload !== "object") return "";
    const preferredKeys = ["title", "name", "label", "activity_name", "activity_type", "sport", "booking_name", "summary"];
    for (const key of preferredKeys) {
      const current = payload[key];
      if (typeof current === "string" && current.trim() && !current.trim().startsWith("{")) return current.trim();
    }
    const nested = payload.raw_metadata || payload.metadata || payload.activity || payload.source_data;
    if (nested && nested !== payload) return extractHumanText(nested);
    return "";
  };

  try {
    const parsed = JSON.parse(raw);
    const extracted = extractHumanText(parsed);
    if (extracted) return extracted;
    const source = parsed.source || parsed.provider || parsed.source_package;
    return source ? String(source).trim().toUpperCase() : fallback;
  } catch {
    // Continue with plain-text cleanup below.
  }

  if (raw.includes("__apex") || raw.includes("raw_metadata") || raw.includes("agenda_dedupe_key") || raw.includes('"source"')) {
    const beforeMetadata = raw.split("__apex")[0].trim();
    if (beforeMetadata && beforeMetadata.length < 90) return beforeMetadata;
    const sourceMatch = raw.match(/"source"\s*:\s*"([^"]+)"/i) || raw.match(/"provider"\s*:\s*"([^"]+)"/i);
    return sourceMatch?.[1] ? sourceMatch[1].toUpperCase() : fallback;
  }

  return raw.length > 80 ? `${raw.slice(0, 77).trim()}...` : raw;
}

async function loadCore(supabase, user) {
  const { start, end } = todayBounds();
  const nowIso = new Date().toISOString();
  const yearStartIso = startOfYear(new Date()).toISOString();
  const responses = await Promise.all([
    supabase.from("profiles").select("id, role, full_name").eq("id", user.id).maybeSingle(),
    supabase.from("subscriptions").select("status, plan, trial_ends_at, current_period_ends_at, subscription_category, payment_method_last4").eq("coach_id", user.id).order("created_at", { ascending: false }).limit(1).maybeSingle(),
    colorFallback((includeColor) => supabase.from("students").select(includeColor ? "id, full_name, client_color_hex" : "id, full_name").eq("coach_id", user.id).order("full_name", { ascending: true })),
    supabase.from("agenda_items").select("id", { count: "exact", head: true }).eq("coach_id", user.id).gte("scheduled_at", start).lt("scheduled_at", end),
    supabase.from("assessments").select("id", { count: "exact", head: true }).eq("coach_id", user.id),
    supabase.from("training_sessions").select("id", { count: "exact", head: true }).eq("coach_id", user.id),
    colorFallback((includeColor) => supabase.from("agenda_items").select(includeColor ? "id, item_type, notes, scheduled_at, status, students(full_name, client_color_hex), booking_types(name)" : "id, item_type, notes, scheduled_at, status, students(full_name), booking_types(name)").eq("coach_id", user.id).gte("scheduled_at", nowIso).order("scheduled_at", { ascending: true }).limit(8)),
    optionalResource(() => supabase.from("client_billing_profiles").select("student_id, status, billing_cycle, amount_cents, currency_code, next_due_at, last_paid_at, last_requested_at"), "client_billing_profiles"),
    optionalResource(() => supabase.from("client_training_plans").select("student_id, plan_mode, sessions_per_week, pack_sessions_count, created_at").eq("coach_id", user.id), "client_training_plans"),
    supabase.from("agenda_items").select("id, student_id, item_type, status, scheduled_at, booking_types(price_eur, name)").eq("coach_id", user.id).gte("scheduled_at", yearStartIso).lt("scheduled_at", nowIso).neq("status", "canceled").order("scheduled_at", { ascending: false }),
    optionalResource(() => supabase.from("athlete_invites").select("student_id, status, created_at").order("created_at", { ascending: false }).limit(80), "athlete_invites"),
    optionalResource(() => supabase.from("agenda_items").select("id, student_id, item_type, scheduled_at, status, notes, requested_by_role").eq("coach_id", user.id).order("scheduled_at", { ascending: false }).limit(80), "agenda_items"),
    optionalResource(() => supabase.from("coach_invoices").select("id, student_id, invoice_number, status, billing_cycle, subtotal_cents, discount_type, discount_value, offered_sessions_count, total_cents, period_start, period_end, paid_at, receipt_id, created_at").eq("coach_id", user.id).gte("period_start", yearStartIso.slice(0, 10)).order("period_start", { ascending: false }).limit(120), "coach_invoices"),
    optionalResource(() => supabase.from("billing_invoice_ledger").select("invoice_id, student_id, student_name, client_color_hex, invoice_number, invoice_code, display_code, status, status_bucket, billing_cycle, subtotal_cents, included_subtotal_cents, discount_type, discount_value, offered_sessions_count, total_cents, computed_total_cents, total_delta_cents, included_items, paid_items, pending_approval_items, unpaid_items, period_start, period_end, billing_month, paid_at, receipt_id, ledger_status, created_at").eq("coach_id", user.id).gte("billing_month", yearStartIso.slice(0, 10)).order("billing_month", { ascending: false }).limit(160), "billing_invoice_ledger"),
  ]);
  const failed = responses.find((item) => item.error);
  if (failed?.error) throw failed.error;
  const students = responses[2].data ?? [];
  const upcomingAgenda = (responses[6].data ?? []).filter(isCoachAgendaItem);
  const invoiceRows = responses[13].data?.length ? responses[13].data : responses[12].data ?? [];
  const business = summarizeBusiness(responses[9].data ?? [], responses[7].data ?? [], responses[8].data ?? [], students, responses[10].data ?? [], responses[11].data ?? [], invoiceRows);
  return {
    profile: responses[0].data,
    subscription: responses[1].data,
    metrics: { clients: students.length, agendaToday: responses[3].count ?? 0, assessments: responses[4].count ?? 0, trainings: responses[5].count ?? 0 },
    business,
    upcomingAgenda,
  };
}

async function loadStudents(supabase, user) {
  const response = await colorFallback((includeColor) => supabase.from("students").select(includeColor ? "id, full_name, email, main_goal, created_at, client_color_hex" : "id, full_name, email, main_goal, created_at").eq("coach_id", user.id).order("full_name", { ascending: true }));
  if (response.error) throw response.error;
  return response.data ?? [];
}

async function loadAssessments(supabase, user) {
  const response = await colorFallback((includeColor) => supabase.from("assessments").select(includeColor ? "id, assessment_date, fields, students(full_name, client_color_hex)" : "id, assessment_date, fields, students(full_name)").eq("coach_id", user.id).order("assessment_date", { ascending: false }).order("created_at", { ascending: false }).limit(12));
  if (response.error) throw response.error;
  return response.data ?? [];
}

async function loadTrainings(supabase, user) {
  const response = await colorFallback((includeColor) => supabase.from("training_sessions").select(includeColor ? "id, name, notes, status, session_date, students(full_name, client_color_hex)" : "id, name, notes, status, session_date, students(full_name)").eq("coach_id", user.id).order("session_date", { ascending: false }).limit(12));
  if (response.error) throw response.error;
  return response.data ?? [];
}

async function ensureBookingTypes(supabase, user) {
  const initial = await supabase.from("booking_types").select("id, name, category, duration_minutes, price_eur, is_active").eq("coach_id", user.id).eq("is_active", true).order("duration_minutes", { ascending: true }).order("name", { ascending: true });
  if (initial.error) throw initial.error;
  if ((initial.data ?? []).length > 0) return initial.data;
  const inserted = await supabase.from("booking_types").insert(DEFAULT_BOOKING_TYPES.map((item) => ({ coach_id: user.id, ...item, is_active: true })));
  if (inserted.error) throw inserted.error;
  const finalRead = await supabase.from("booking_types").select("id, name, category, duration_minutes, price_eur, is_active").eq("coach_id", user.id).eq("is_active", true).order("duration_minutes", { ascending: true }).order("name", { ascending: true });
  if (finalRead.error) throw finalRead.error;
  return finalRead.data ?? [];
}

function SectionCard({ eyebrow, title, description, action, children }) {
  return <section className="rounded-[24px] border border-[var(--border)] bg-[var(--surface-solid)] p-3.5 shadow-[var(--shadow-soft)] sm:p-4"><div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between"><div><p className="text-[11px] uppercase tracking-[0.16em] text-[var(--accent)]">{eyebrow}</p><h2 className="mt-1 text-lg font-semibold text-[var(--text)]">{title}</h2>{description ? <p className="mt-1 max-w-2xl text-sm leading-6 text-[var(--text-muted)]">{description}</p> : null}</div>{action}</div><div className="mt-4">{children}</div></section>;
}

function EmptyState({ title, text }) {
  return <div className="rounded-[20px] border border-dashed border-[var(--border)] bg-[var(--surface-muted)] px-4 py-6 text-center"><p className="text-base font-semibold text-[var(--text)]">{title}</p><p className="mt-2 text-sm leading-6 text-[var(--text-muted)]">{text}</p></div>;
}

function DashboardHero({ coachName, core, copy, locale, onCreate }) {
  const nextBooking = core.upcomingAgenda[0];
  const welcome = locale === "pt"
    ? `Bem-vindo, ${coachName}`
    : locale === "es"
      ? `Bienvenido, ${coachName}`
      : locale === "fr"
        ? `Bienvenue, ${coachName}`
        : `Welcome, ${coachName}`;
  const headline = locale === "pt"
    ? "A tua operação do dia, pronta para agir."
    : locale === "es"
      ? "Tu operación del día, lista para actuar."
      : locale === "fr"
        ? "Ton opération du jour, prête à piloter."
        : "Your coaching day, ready to act on.";
  const nextLabel = locale === "pt" ? "Próximo agendamento" : locale === "es" ? "Próxima reserva" : locale === "fr" ? "Prochain rendez-vous" : "Next booking";
  const noNext = locale === "pt" ? "Sem próximos agendamentos" : locale === "es" ? "Sin próximas reservas" : locale === "fr" ? "Aucun rendez-vous à venir" : "No upcoming bookings";

  const heroStats = [
    { label: copy.tabs.clients, value: core.metrics.clients },
    { label: copy.deliveredSessions, value: core.business.deliveredTrainings },
    { label: copy.monthlyBilling, value: formatCurrency(core.business.monthlyRevenue, locale) },
    { label: copy.agendaSpotlight, value: core.upcomingAgenda.length },
  ];

  return (
    <section className="overflow-hidden rounded-[26px] border border-[var(--border-strong)] bg-[linear-gradient(135deg,rgba(218,251,234,0.95),rgba(255,255,255,0.98)_42%,rgba(239,235,255,0.82))] p-4 shadow-[var(--shadow-panel)] sm:p-5">
      <div className="grid gap-4 xl:grid-cols-[1fr_380px] xl:items-stretch">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--accent)]">{copy.coachPulse}</p>
          <h1 className="mt-2 text-2xl font-semibold tracking-tight text-[var(--text)] sm:text-3xl">{welcome}</h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-[var(--text-muted)]">{headline}</p>
          <div className="mt-4 grid gap-2 sm:grid-cols-4">
            {heroStats.map((item) => (
              <div key={item.label} className="rounded-[18px] border border-white/70 bg-white/72 px-3 py-3 shadow-sm">
                <p className="text-[10px] font-semibold uppercase tracking-[0.13em] text-[var(--text-muted)]">{item.label}</p>
                <p className="mt-2 text-xl font-semibold text-[var(--text)]">{item.value}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-[22px] border border-white/80 bg-white/78 p-3.5 shadow-sm">
          <div className="flex items-center justify-between gap-3">
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--text-muted)]">{nextLabel}</p>
            <button onClick={onCreate} className="inline-flex items-center gap-2 rounded-2xl bg-[var(--accent)] px-3 py-2 text-xs font-semibold text-[var(--accent-foreground)]">
              <Plus size={13} />
              {copy.newBooking}
            </button>
          </div>
          {nextBooking ? (
            <div className="mt-4 rounded-[18px] border border-[var(--border)] bg-[var(--surface-muted)] p-3">
              <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[var(--accent)]">{formatDate(nextBooking.scheduled_at, true, locale)}</p>
              <p className="mt-1 text-2xl font-semibold text-[var(--text)]">{formatTime(nextBooking.scheduled_at, locale)}</p>
              <div className="mt-3 flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full" style={{ background: colorDot(nextBooking.students?.client_color_hex) }} />
                <p className="font-semibold text-[var(--text)]">{nextBooking.students?.full_name || copy.client}</p>
              </div>
              <p className="mt-1 text-[11px] uppercase tracking-[0.12em] text-[var(--text-muted)]">{nextBooking.booking_types?.name || nextBooking.item_type || copy.bookingType}</p>
            </div>
          ) : (
            <div className="mt-4 rounded-[18px] border border-dashed border-[var(--border)] bg-[var(--surface-muted)] px-4 py-6 text-sm text-[var(--text-muted)]">{noNext}</div>
          )}
        </div>
      </div>
    </section>
  );
}

function attentionLabel(item, copy) {
  if (item.type === "pack_low") return copy.actionPack;
  if (item.type === "billing_pending") return copy.actionBilling;
  if (item.type === "invite_pending") return copy.inboxInviteAction;
  if (item.type === "agenda_request" || item.type === "agenda_cancel_request") return copy.inboxValidateSchedule;
  if (item.type === "agenda_coach_scheduled") return copy.inboxViewSchedule;
  if (item.type === "client_update") return copy.inboxViewStatus;
  return copy.actionMissing;
}

function attentionAction(item, copy) {
  if (item.type === "pack_low") return copy.inboxPackAction;
  if (item.type === "billing_pending") return copy.inboxBillingAction;
  if (item.type === "invite_pending") return copy.inboxInviteAction;
  if (item.type === "agenda_request" || item.type === "agenda_cancel_request") return copy.inboxValidateSchedule;
  if (item.type === "agenda_coach_scheduled") return copy.inboxViewSchedule;
  if (item.type === "client_update") return copy.inboxViewStatus;
  return copy.inboxScheduleAction;
}

function attentionAuthor(item, copy) {
  if (item.sender === "client") return firstName(item.studentName, copy.inboxAuthorClient);
  if (item.sender === "coach") return copy.inboxAuthorCoach;
  return copy.inboxAuthorSystem;
}

function attentionMessage(item, copy, locale = "en") {
  const detail = item.note ? `: ${item.note}` : "";
  if (item.type === "billing_pending") {
    const amount = item.amountCents ? ` ${formatCurrency(item.amountCents / 100, locale, item.currencyCode)}` : "";
    if (String(item.status || "").toLowerCase() === "overdue") return locale === "pt" ? `Pagamento em atraso${amount}.` : `Payment is overdue${amount}.`;
    if (String(item.status || "").toLowerCase() === "pending_approval") return locale === "pt" ? "Cliente pediu validação de pagamento. Requer aprovação do coach." : "Client requested payment validation. Coach approval is required.";
    return locale === "pt" ? "Coach criou um pedido de pagamento para este ciclo." : "Coach created a payment request for this cycle.";
  }
  if (item.type === "invite_pending") return copy.inboxInvitePending;
  if (item.type === "agenda_coach_scheduled") return `${copy.inboxAgendaCoachScheduled}${detail}.`;
  if (item.type === "agenda_request") return `${copy.inboxAgendaClientRequest}${detail ? ` ${detail.slice(2)}.` : ""}`;
  if (item.type === "agenda_cancel_request") return `${copy.inboxAgendaCancelRequest}${detail ? ` ${detail.slice(2)}.` : ""}`;
  if (item.type === "client_update") return `${copy.inboxClientCompleted}${detail}.`;
  if (item.type === "pack_low") return `${item.attentionCount} ${copy.actionPack}.`;
  if (item.type === "weekly_shortfall") return `${item.attentionCount} ${copy.actionMissing}.`;
  return copy.inboxAutoMessage;
}

function buildInboxConversations(attentionItems, copy) {
  const conversations = new Map();
  for (const item of attentionItems) {
    const key = item.studentId || item.studentName || item.id;
    const current = conversations.get(key) || {
      id: key,
      studentId: item.studentId,
      studentName: item.studentName,
      clientColorHex: item.clientColorHex,
      unread: 0,
      priority: 0,
      items: [],
    };
    const priority = item.type === "billing_pending" || item.type === "agenda_request" || item.type === "agenda_cancel_request" ? 4 : item.type === "client_update" || item.type === "invite_pending" ? 3 : item.type === "weekly_shortfall" || item.type === "pack_low" ? 2 : 1;
    current.unread += item.requiresAction ? 1 : 0;
    current.priority = Math.max(current.priority, priority);
    current.items.push(item);
    conversations.set(key, current);
  }

  return [...conversations.values()]
    .map((conversation) => ({
      ...conversation,
      items: [...conversation.items].sort((a, b) => new Date(a.time || 0) - new Date(b.time || 0)),
      latestTime: Math.max(...conversation.items.map((item) => new Date(item.time || 0).getTime()).filter((value) => !Number.isNaN(value)), 0),
      preview: attentionMessage([...conversation.items].sort((a, b) => new Date(b.time || 0) - new Date(a.time || 0))[0], copy),
      totalActions: conversation.items.reduce((sum, item) => sum + Math.max(1, item.attentionCount || 1), 0),
      requiresAction: conversation.items.some((item) => item.requiresAction),
    }))
    .sort((a, b) => {
      if (a.requiresAction !== b.requiresAction) return a.requiresAction ? -1 : 1;
      return b.priority - a.priority || b.latestTime - a.latestTime || b.totalActions - a.totalActions || a.studentName.localeCompare(b.studentName);
    });
}

function ClientAvatar({ studentId, name, colorHex, size = 40 }) {
  const [avatarUrl, setAvatarUrl] = useState("");

  useEffect(() => {
    let mounted = true;
    const supabaseId = String(studentId || "").trim();
    if (!supabaseId) {
      setAvatarUrl("");
      return () => {
        mounted = false;
      };
    }

    async function loadAvatar() {
      try {
        const supabase = getSupabaseBrowserClient();
        const { data, error } = await supabase.storage.from("student-photos").createSignedUrl(`${supabaseId}/avatar.jpg`, 60 * 60);
        if (error) throw error;
        if (mounted) setAvatarUrl(data?.signedUrl || "");
      } catch {
        if (mounted) setAvatarUrl("");
      }
    }

    loadAvatar();
    return () => {
      mounted = false;
    };
  }, [studentId]);

  if (avatarUrl) {
    return <img src={avatarUrl} alt={name || "Client"} className="shrink-0 rounded-full border border-white/80 object-cover shadow-sm" style={{ width: size, height: size }} />;
  }

  const initials = (name || "Client")
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();

  return (
    <span className="flex shrink-0 items-center justify-center rounded-full border border-white/70 text-xs font-semibold text-[var(--text)] shadow-sm" style={{ width: size, height: size, background: colorDot(colorHex) }}>
      {initials || "C"}
    </span>
  );
}

function AttentionRow({ conversation, selected, copy, onClick }) {
  return (
    <button onClick={onClick} className={`flex w-full items-center justify-between gap-2.5 rounded-[14px] border px-2.5 py-2 text-left transition hover:border-[var(--accent)] ${selected ? "border-[var(--accent)] bg-[var(--accent-soft)]" : "border-[var(--border)] bg-white"}`}>
      <div className="flex min-w-0 items-center gap-2.5">
        <ClientAvatar studentId={conversation.studentId} name={conversation.studentName} colorHex={conversation.clientColorHex} size={34} />
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <p className="truncate text-sm font-semibold text-[var(--text)]">{conversation.studentName}</p>
            {conversation.priority >= 3 ? <span className="h-2 w-2 shrink-0 rounded-full bg-rose-400" /> : null}
          </div>
          <p className="truncate text-[11px] leading-4 text-[var(--text-muted)]">{conversation.preview}</p>
        </div>
      </div>
      <span className={`flex h-6 min-w-6 shrink-0 items-center justify-center rounded-full border px-1.5 text-[10px] font-semibold ${conversation.unread > 0 ? "border-[var(--accent)] bg-[var(--accent-soft)] text-[var(--accent-strong)]" : "border-[var(--border)] bg-[var(--surface-muted)] text-[var(--text-muted)]"}`}>
        {conversation.unread > 0 ? conversation.unread : <Check size={13} />}
      </span>
    </button>
  );
}

function CoachHubThread({ conversation, copy, locale, onBack }) {
  return (
    <div className="grid h-full min-w-0 grid-rows-[auto_minmax(0,1fr)_auto] overflow-hidden rounded-[20px] border border-slate-200/80 bg-white shadow-[inset_0_1px_0_rgba(255,255,255,0.9)]">
      <div className="flex items-center justify-between gap-3 border-b border-slate-100 bg-slate-50/70 px-3 py-2.5">
        <button onClick={onBack} className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-2.5 py-1.5 text-[11px] font-semibold text-[var(--text-muted)] transition hover:border-[var(--accent)] hover:text-[var(--text)]">
          <ArrowLeft size={13} />
          {copy.inboxBack}
        </button>
        <div className="flex min-w-0 items-center gap-2 text-right">
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-[var(--text)]">{conversation.studentName}</p>
            <p className="text-[10px] uppercase tracking-[0.14em] text-[var(--accent)]">{copy.inboxPendingThread}</p>
          </div>
          <ClientAvatar studentId={conversation.studentId} name={conversation.studentName} colorHex={conversation.clientColorHex} size={34} />
        </div>
      </div>

      <div className="min-w-0 space-y-2.5 overflow-y-auto overflow-x-hidden bg-[linear-gradient(180deg,rgba(248,250,252,0.72),rgba(255,255,255,0.9))] px-3 py-3">
        {conversation.items.map((item) => {
          const fromCoach = item.sender === "coach";
          const fromClient = item.sender === "client";
          return (
            <div key={item.id} className={`relative min-w-0 max-w-[88%] rounded-[15px] border px-3 py-2.5 shadow-[0_8px_22px_rgba(15,23,42,0.04)] [overflow-wrap:anywhere] ${fromCoach ? "ml-auto rounded-br-sm border-emerald-100 bg-emerald-50/80" : fromClient ? "mr-auto rounded-bl-sm border-sky-100 bg-sky-50/80" : "mx-auto max-w-[82%] border-slate-100 bg-white"}`}>
              <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1">
                <p className={`text-[9px] font-semibold uppercase tracking-[0.14em] ${fromCoach ? "text-emerald-700" : fromClient ? "text-sky-700" : "text-slate-500"}`}>{attentionAuthor(item, copy)}</p>
                {item.requiresAction ? <span className="shrink-0 rounded-full bg-amber-100/90 px-1.5 py-0.5 text-[8px] font-semibold uppercase tracking-[0.1em] text-amber-700">{copy.inboxRequiresAction}</span> : null}
              </div>
              <p className="mt-1.5 break-words text-[12px] leading-5 text-[var(--text)]">{attentionMessage(item, copy, locale)}</p>
              <div className="mt-2 flex flex-wrap items-center justify-between gap-x-3 gap-y-1">
                <p className="text-[10px] text-[var(--text-muted)]">{item.time ? `${formatDate(item.time, false, locale)} · ${formatTime(item.time, locale)}` : ""}</p>
                <p className="text-[10px] font-semibold uppercase tracking-[0.1em] text-[var(--text-muted)]">{attentionLabel(item, copy)}</p>
              </div>
            </div>
          );
        })}

        <div className="min-w-0 rounded-[15px] bg-slate-950 px-3 py-2.5 text-white shadow-[0_14px_32px_rgba(15,23,42,0.16)] [overflow-wrap:anywhere]">
          <p className="text-[9px] font-semibold uppercase tracking-[0.12em] text-emerald-300">{copy.inboxSuggestedAction}</p>
          <p className="mt-1 break-words text-[12px] font-semibold leading-5">{attentionAction(conversation.items[0], copy)}</p>
        </div>
      </div>

      <div className="flex items-center gap-2 border-t border-slate-100 bg-white/90 px-3 py-2.5">
        <input disabled placeholder={copy.inboxReplyPlaceholder} className="min-w-0 flex-1 rounded-full border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs text-[var(--text-muted)] outline-none" />
        <button disabled className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--accent)] text-[var(--accent-foreground)] opacity-50">
          <Send size={14} />
        </button>
      </div>
    </div>
  );
}

function CoachHubCard({ copy, attentionItems, locale }) {
  const [selectedConversationId, setSelectedConversationId] = useState("");
  const conversations = useMemo(() => buildInboxConversations(attentionItems, copy), [attentionItems, copy]);
  const selectedConversation = conversations.find((conversation) => conversation.id === selectedConversationId) || null;

  useEffect(() => {
    if (selectedConversationId && !selectedConversation) {
      setSelectedConversationId("");
    }
  }, [selectedConversationId, selectedConversation]);

  return (
    <section className="grid h-[640px] min-w-0 grid-rows-[auto_minmax(0,1fr)] overflow-hidden rounded-[26px] border border-slate-200/80 bg-white p-3.5 shadow-[0_18px_48px_rgba(15,23,42,0.045)] sm:p-4">
      <div className="flex min-w-0 items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[11px] uppercase tracking-[0.2em] text-[var(--accent)]">{copy.coachHub}</p>
          <h2 className="mt-1 text-lg font-semibold text-[var(--text)]">Coach HUB</h2>
          <p className="mt-1 truncate text-xs text-[var(--text-muted)]">{selectedConversation ? copy.inboxOpenThread : copy.attentionBoardText}</p>
        </div>
        <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-slate-200 bg-white px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-[var(--text-muted)] shadow-sm">
          <MessageCircle size={12} />
          {conversations.length}
        </span>
      </div>

      <div className="mt-3 min-h-0 overflow-hidden">
        {selectedConversation ? (
          <CoachHubThread conversation={selectedConversation} copy={copy} locale={locale} onBack={() => setSelectedConversationId("")} />
        ) : (
          <div className="grid h-full content-start gap-1.5 overflow-y-auto overflow-x-hidden pr-1.5">
            {conversations.length > 0 ? (
              conversations.map((conversation) => (
                <AttentionRow
                  key={conversation.id}
                  conversation={conversation}
                  selected={conversation.id === selectedConversationId}
                  copy={copy}
                  onClick={() => setSelectedConversationId(conversation.id)}
                />
              ))
            ) : (
              <div className="rounded-[16px] border border-dashed border-[var(--border)] bg-white px-3 py-5 text-sm leading-6 text-[var(--text-muted)]">{copy.noAttention}</div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}

function BillingProfileRow({ item, locale = "en" }) {
  const currency = item.currency_code || "EUR";
  return (
    <div className="flex items-center justify-between gap-3 rounded-[16px] border border-[var(--border)] bg-white px-3.5 py-3">
      <div className="min-w-0">
        <p className="truncate text-sm font-semibold text-[var(--text)]">{item.studentName || "Client"}</p>
        <p className="truncate text-xs text-[var(--text-muted)]">{prettifyStatus(item.status)}</p>
      </div>
      <div className="text-right">
        <p className="text-sm font-semibold text-[var(--text)]">{formatCurrency(numericValue(item.amount_cents) / 100, locale, currency)}</p>
        {item.next_due_at ? <p className="text-xs text-[var(--text-muted)]">{formatDate(item.next_due_at, true, locale)}</p> : null}
      </div>
    </div>
  );
}

function BillingInvoiceRow({ invoice, locale }) {
  const status = prettifyStatus(invoice.status);
  const paid = invoice.paid;
  const invoiceLabel = invoice.invoiceNumber ? String(invoice.invoiceNumber) : invoice.billingCycle;
  return (
    <div className="flex items-center justify-between gap-3 rounded-[16px] border border-slate-100 bg-white px-3 py-2.5 shadow-[0_8px_20px_rgba(15,23,42,0.035)]">
      <div className="flex min-w-0 items-center gap-2.5">
        <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ background: colorDot(invoice.clientColorHex) }} />
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-[var(--text)]">{invoice.studentName}</p>
          <p className="truncate text-[10px] uppercase tracking-[0.12em] text-[var(--text-muted)]">
            {invoiceLabel} · {status}
          </p>
        </div>
      </div>
      <div className="shrink-0 text-right">
        <p className="text-sm font-semibold text-[var(--text)]">{formatCurrency(invoice.totalCents / 100, locale)}</p>
        <span className={`mt-1 inline-flex rounded-full px-2 py-0.5 text-[9px] font-semibold uppercase tracking-[0.1em] ${paid ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"}`}>
          {status}
        </span>
      </div>
    </div>
  );
}

function BillingMonthCard({ month, locale, labels, featured = false }) {
  const hasInvoices = month.invoices.length > 0;
  return (
    <div className={`${featured ? "rounded-[24px] border border-[var(--accent)]/20 bg-[linear-gradient(135deg,rgba(47,211,132,0.1),rgba(255,255,255,0.96))] p-4" : "rounded-[20px] border border-slate-200 bg-slate-50/70 p-3"}`}>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-[10px] uppercase tracking-[0.16em] text-[var(--accent)]">{featured ? labels.currentMonth : labels.period}</p>
          <h3 className={`${featured ? "text-xl" : "text-base"} mt-1 font-semibold text-[var(--text)]`}>
            {month.date.toLocaleDateString(localeTag(locale), { month: "long", year: "numeric" })}
          </h3>
          <p className="mt-1 text-xs text-[var(--text-muted)]">{month.invoices.length} {labels.clients}</p>
        </div>
        <div className="grid min-w-[180px] grid-cols-3 gap-2 text-right">
          <div>
            <p className="text-[9px] uppercase tracking-[0.12em] text-[var(--text-muted)]">{labels.total}</p>
            <p className="text-sm font-semibold text-[var(--text)]">{formatCurrency(month.totalCents / 100, locale)}</p>
          </div>
          <div>
            <p className="text-[9px] uppercase tracking-[0.12em] text-[var(--text-muted)]">{labels.paid}</p>
            <p className="text-sm font-semibold text-emerald-700">{formatCurrency(month.paidCents / 100, locale)}</p>
          </div>
          <div>
            <p className="text-[9px] uppercase tracking-[0.12em] text-[var(--text-muted)]">{labels.pending}</p>
            <p className="text-sm font-semibold text-amber-700">{formatCurrency(month.pendingCents / 100, locale)}</p>
          </div>
        </div>
      </div>

      <div className="mt-3 grid gap-2">
        {hasInvoices ? month.invoices.map((invoice) => <BillingInvoiceRow key={invoice.id} invoice={invoice} locale={locale} />) : <div className="rounded-[16px] border border-dashed border-slate-200 bg-white px-3 py-4 text-sm text-[var(--text-muted)]">{labels.noInvoices}</div>}
      </div>
    </div>
  );
}

function BillingOverviewSection({ business, copy, locale }) {
  const labels = getBillingCopy(locale);
  const months = business.billingMonths || {};
  const previousMonths = months.previousMonths || [];

  return (
    <SectionCard eyebrow={copy.financeOverview} title={copy.financeOverview} description={copy.financeOverviewText}>
      <div className="grid gap-3">
        <BillingMonthCard month={months.currentMonth || { date: startOfMonth(new Date()), invoices: [], totalCents: 0, paidCents: 0, pendingCents: 0 }} locale={locale} labels={labels} featured />
        <div className="rounded-[22px] border border-slate-200 bg-white p-3">
          <div className="mb-3 flex items-center justify-between gap-3">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--text-muted)]">{labels.previousMonths}</p>
            <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-semibold text-[var(--text-muted)]">{previousMonths.length}</span>
          </div>
          <div className="grid gap-2 xl:grid-cols-2">
            {previousMonths.length > 0 ? previousMonths.map((month) => <BillingMonthCard key={month.key} month={month} locale={locale} labels={labels} />) : <div className="rounded-[16px] border border-dashed border-slate-200 bg-slate-50 px-3 py-4 text-sm text-[var(--text-muted)]">{labels.noInvoices}</div>}
          </div>
        </div>
      </div>
    </SectionCard>
  );
}

function CompactBillingInvoiceRow({ invoice, labels, locale }) {
  const status = prettifyStatus(invoice.status);
  const paid = invoice.paid;
  const detail = formatInvoiceDetail(invoice, labels, locale);
  return (
    <div className="flex min-h-[42px] items-center justify-between gap-3 rounded-[14px] border border-slate-100 bg-white px-2.5 py-2 shadow-[0_5px_14px_rgba(15,23,42,0.03)]">
      <div className="flex min-w-0 items-center gap-2.5">
        <span className="h-2 w-2 shrink-0 rounded-full" style={{ background: colorDot(invoice.clientColorHex) }} />
        <div className="min-w-0">
          <p className="truncate text-[13px] font-semibold leading-4 text-[var(--text)]">{invoice.studentName}</p>
          <p className="truncate text-[9px] uppercase tracking-[0.1em] text-[var(--text-muted)]">{detail}</p>
        </div>
      </div>
      <div className="flex shrink-0 items-center gap-2 text-right">
        <span className={`inline-flex rounded-full px-2 py-0.5 text-[8px] font-semibold uppercase tracking-[0.08em] ${paid ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"}`}>
          {status}
        </span>
        <p className="min-w-[68px] text-sm font-semibold text-[var(--text)]">{formatCurrency(invoice.totalCents / 100, locale)}</p>
      </div>
    </div>
  );
}

function CompactBillingMonthCard({ month, locale, labels, featured = false }) {
  const hasInvoices = month.invoices.length > 0;
  const monthLabel = formatBillingMonthLabel(month.date, locale);

  if (!featured) {
    return (
      <details className="group rounded-[16px] border border-slate-200 bg-slate-50/80 px-3 py-2.5">
        <summary className="flex cursor-pointer list-none items-center justify-between gap-3">
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold capitalize text-[var(--text)]">{monthLabel}</p>
            <p className="mt-0.5 text-[10px] uppercase tracking-[0.12em] text-[var(--text-muted)]">{month.invoices.length} {labels.clients}</p>
          </div>
          <div className="flex shrink-0 items-center gap-3 text-right">
            <div>
              <p className="text-[9px] uppercase tracking-[0.1em] text-[var(--text-muted)]">{labels.total}</p>
              <p className="text-sm font-semibold text-[var(--text)]">{formatCurrency(month.totalCents / 100, locale)}</p>
            </div>
            <div>
              <p className="text-[9px] uppercase tracking-[0.1em] text-[var(--text-muted)]">{labels.pending}</p>
              <p className="text-sm font-semibold text-amber-700">{formatCurrency(month.pendingCents / 100, locale)}</p>
            </div>
            <span className="rounded-full border border-slate-200 bg-white px-2 py-1 text-[9px] font-semibold uppercase tracking-[0.08em] text-[var(--text-muted)] group-open:hidden">{labels.viewInvoices}</span>
          </div>
        </summary>
        <div className="mt-2 grid max-h-[180px] gap-1.5 overflow-y-auto pr-1">
          {hasInvoices ? month.invoices.map((invoice) => <CompactBillingInvoiceRow key={invoice.id} invoice={invoice} labels={labels} locale={locale} />) : <div className="rounded-[14px] border border-dashed border-slate-200 bg-white px-3 py-3 text-xs text-[var(--text-muted)]">{labels.noInvoices}</div>}
        </div>
      </details>
    );
  }

  return (
    <div className="rounded-[22px] border border-[var(--accent)]/20 bg-[linear-gradient(135deg,rgba(47,211,132,0.1),rgba(255,255,255,0.96))] p-3.5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-[10px] uppercase tracking-[0.16em] text-[var(--accent)]">{labels.currentMonth}</p>
          <h3 className="mt-1 text-lg font-semibold capitalize text-[var(--text)]">{monthLabel}</h3>
          <p className="mt-1 text-xs text-[var(--text-muted)]">{month.invoices.length} {labels.clients}</p>
        </div>
        <div className="grid min-w-[260px] flex-1 grid-cols-3 gap-2 text-right sm:flex-none">
          <div className="rounded-[14px] border border-white/70 bg-white/70 px-2.5 py-2">
            <p className="text-[9px] uppercase tracking-[0.12em] text-[var(--text-muted)]">{labels.total}</p>
            <p className="text-sm font-semibold text-[var(--text)]">{formatCurrency(month.totalCents / 100, locale)}</p>
          </div>
          <div className="rounded-[14px] border border-white/70 bg-white/70 px-2.5 py-2">
            <p className="text-[9px] uppercase tracking-[0.12em] text-[var(--text-muted)]">{labels.paid}</p>
            <p className="text-sm font-semibold text-emerald-700">{formatCurrency(month.paidCents / 100, locale)}</p>
          </div>
          <div className="rounded-[14px] border border-white/70 bg-white/70 px-2.5 py-2">
            <p className="text-[9px] uppercase tracking-[0.12em] text-[var(--text-muted)]">{labels.pending}</p>
            <p className="text-sm font-semibold text-amber-700">{formatCurrency(month.pendingCents / 100, locale)}</p>
          </div>
        </div>
      </div>
      <div className="mt-2 grid max-h-[220px] gap-1.5 overflow-y-auto pr-1">
        {hasInvoices ? month.invoices.map((invoice) => <CompactBillingInvoiceRow key={invoice.id} invoice={invoice} labels={labels} locale={locale} />) : <div className="rounded-[14px] border border-dashed border-slate-200 bg-white px-3 py-3 text-xs text-[var(--text-muted)]">{labels.noInvoices}</div>}
      </div>
    </div>
  );
}

function CompactBillingOverviewSection({ business, copy, locale }) {
  const labels = getBillingCopy(locale);
  const months = business.billingMonths || {};
  const previousMonths = months.previousMonths || [];

  return (
    <SectionCard eyebrow={copy.financeOverview} title={copy.financeOverview} description={copy.financeOverviewText}>
      <div className="grid gap-2.5">
        <CompactBillingMonthCard month={months.currentMonth || { date: startOfMonth(new Date()), invoices: [], totalCents: 0, paidCents: 0, pendingCents: 0 }} locale={locale} labels={labels} featured />
        <div className="rounded-[18px] border border-slate-200 bg-white p-2.5">
          <div className="mb-2 flex items-center justify-between gap-3 px-1">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--text-muted)]">{labels.previousMonths}</p>
            <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-semibold text-[var(--text-muted)]">{previousMonths.length}</span>
          </div>
          <div className="grid gap-1.5">
            {previousMonths.length > 0 ? previousMonths.map((month) => <CompactBillingMonthCard key={month.key} month={month} locale={locale} labels={labels} />) : <div className="rounded-[14px] border border-dashed border-slate-200 bg-slate-50 px-3 py-3 text-xs text-[var(--text-muted)]">{labels.noInvoices}</div>}
          </div>
        </div>
      </div>
    </SectionCard>
  );
}

function PersonRow({ name, detail, meta, colorHex, locale = "en" }) {
  const copy = getCopy(locale);
  return <div className="flex items-center justify-between gap-4 rounded-[24px] border border-[var(--border)] bg-[var(--surface-muted)] px-4 py-4"><div className="flex min-w-0 items-center gap-3"><span className="h-3 w-3 shrink-0 rounded-full" style={{ background: colorDot(colorHex) }} /><div className="min-w-0"><p className="truncate font-medium text-[var(--text)]">{name || copy.client}</p><p className="truncate text-sm text-[var(--text-muted)]">{detail || copy.noDetail}</p></div></div>{meta ? <p className="shrink-0 text-sm text-[var(--text-muted)]">{meta}</p> : null}</div>;
}

function formatMetricValue(value) {
  if (value === null || value === undefined || value === "") return "-";
  if (typeof value === "boolean") return value ? "Yes" : "No";
  if (Array.isArray(value)) return value.join(", ");
  if (typeof value === "object") return JSON.stringify(value);
  return String(value);
}

function getAssessmentEntries(fields) {
  return Object.entries(fields || {})
    .filter(([, value]) => value !== null && value !== undefined && value !== "")
    .slice(0, 12);
}

function CompactWorkspaceShell({ eyebrow, title, description, list, detail }) {
  return (
    <section className="rounded-[28px] border border-[var(--border)] bg-[var(--surface-solid)] p-5 shadow-[var(--shadow-soft)]">
      <div className="flex flex-col gap-2">
        <p className="text-xs uppercase tracking-[0.18em] text-[var(--accent)]">{eyebrow}</p>
        <h2 className="text-2xl font-semibold text-[var(--text)]">{title}</h2>
        <p className="max-w-3xl text-sm leading-7 text-[var(--text-muted)]">{description}</p>
      </div>
      <div className="mt-5 grid gap-5 xl:grid-cols-[360px_minmax(0,1fr)]">
        <div className="rounded-[24px] border border-[var(--border)] bg-[var(--surface-muted)] p-3">{list}</div>
        <div className="rounded-[24px] border border-[var(--border)] bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(246,248,247,0.98))] p-4">{detail}</div>
      </div>
    </section>
  );
}

function AssessmentWorkspace({ items, loading, copy, locale }) {
  const [selectedId, setSelectedId] = useState("");
  const selectedItem = useMemo(() => items.find((item) => item.id === selectedId) || items[0] || null, [items, selectedId]);
  const entries = useMemo(() => getAssessmentEntries(selectedItem?.fields), [selectedItem]);

  useEffect(() => {
    if (!items.length) {
      setSelectedId("");
      return;
    }
    setSelectedId((current) => (items.some((item) => item.id === current) ? current : items[0].id));
  }, [items]);

  return (
    <CompactWorkspaceShell
      eyebrow={copy.tabs.assessments}
      title={copy.assessmentsTitle}
      description={copy.assessmentsText}
      list={
        loading ? (
          <div className="inline-flex items-center gap-3 rounded-full border border-[var(--border)] bg-white px-4 py-3 text-sm text-[var(--text-muted)]"><LoaderCircle size={16} className="animate-spin text-[var(--accent)]" />{copy.loadingAssessments}</div>
        ) : items.length > 0 ? (
          <div className="grid gap-2">
            {items.map((item) => {
              const active = selectedItem?.id === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setSelectedId(item.id)}
                  className={`rounded-[18px] border px-3 py-3 text-left ${active ? "border-[var(--accent)] bg-white" : "border-[var(--border)] bg-white/70"}`}
                >
                  <p className="font-medium text-[var(--text)]">{item.students?.full_name || copy.client}</p>
                  <p className="mt-1 text-xs uppercase tracking-[0.14em] text-[var(--text-muted)]">{formatDate(item.assessment_date, true, locale)}</p>
                  <p className="mt-2 text-sm text-[var(--text-muted)]">{`${Object.keys(item.fields || {}).length} ${copy.savedMetrics}`}</p>
                </button>
              );
            })}
          </div>
        ) : (
          <EmptyState title={copy.noAssessments} text={copy.noAssessmentsText} />
        )
      }
      detail={
        selectedItem ? (
          <div className="grid gap-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-xs uppercase tracking-[0.18em] text-[var(--accent)]">{copy.client}</p>
                <h3 className="mt-1 text-xl font-semibold text-[var(--text)]">{selectedItem.students?.full_name || copy.client}</h3>
              </div>
              <span className="rounded-full border border-[var(--border)] bg-white px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-[var(--text-muted)]">
                {formatDate(selectedItem.assessment_date, true, locale)}
              </span>
            </div>
            <div className="grid gap-3 md:grid-cols-2">
              {entries.length > 0 ? entries.map(([key, value]) => (
                <div key={key} className="rounded-[18px] border border-[var(--border)] bg-white px-4 py-3">
                  <p className="text-[11px] uppercase tracking-[0.14em] text-[var(--text-muted)]">{String(key).replace(/_/g, " ")}</p>
                  <p className="mt-1 text-sm font-medium text-[var(--text)]">{formatMetricValue(value)}</p>
                </div>
              )) : <EmptyState title={copy.noAssessments} text={copy.noAssessmentsText} />}
            </div>
          </div>
        ) : (
          <EmptyState title={copy.noAssessments} text={copy.noAssessmentsText} />
        )
      }
    />
  );
}

function TrainingWorkspace({ items, loading, copy, locale, currentUser, onItemsChange }) {
  const [selectedId, setSelectedId] = useState("");
  const [draft, setDraft] = useState({ name: "", notes: "" });
  const [saving, setSaving] = useState(false);
  const selectedItem = useMemo(() => items.find((item) => item.id === selectedId) || items[0] || null, [items, selectedId]);

  useEffect(() => {
    if (!items.length) {
      setSelectedId("");
      setDraft({ name: "", notes: "" });
      return;
    }
    const nextSelected = items.some((item) => item.id === selectedId) ? items.find((item) => item.id === selectedId) : items[0];
    setSelectedId(nextSelected.id);
    setDraft({ name: nextSelected.name || "", notes: nextSelected.notes || "" });
  }, [items, selectedId]);

  async function saveTraining() {
    if (!selectedItem || !currentUser) return;
    setSaving(true);
    try {
      const supabase = getSupabaseBrowserClient();
      const response = await supabase
        .from("training_sessions")
        .update({
          name: draft.name.trim(),
          notes: draft.notes.trim(),
        })
        .eq("id", selectedItem.id)
        .eq("coach_id", currentUser.id);

      if (response.error) throw response.error;

      onItemsChange((current) =>
        current.map((item) =>
          item.id === selectedItem.id
            ? { ...item, name: draft.name.trim(), notes: draft.notes.trim() }
            : item,
        ),
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <CompactWorkspaceShell
      eyebrow={copy.tabs.trainings}
      title={copy.trainingsTitle}
      description={copy.trainingsText}
      list={
        loading ? (
          <div className="inline-flex items-center gap-3 rounded-full border border-[var(--border)] bg-white px-4 py-3 text-sm text-[var(--text-muted)]"><LoaderCircle size={16} className="animate-spin text-[var(--accent)]" />{copy.loadingTrainings}</div>
        ) : items.length > 0 ? (
          <div className="grid gap-2">
            {items.map((item) => {
              const active = selectedItem?.id === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setSelectedId(item.id);
                    setDraft({ name: item.name || "", notes: item.notes || "" });
                  }}
                  className={`rounded-[18px] border px-3 py-3 text-left ${active ? "border-[var(--accent)] bg-white" : "border-[var(--border)] bg-white/70"}`}
                >
                  <p className="font-medium text-[var(--text)]">{item.name || copy.untitledSession}</p>
                  <p className="mt-1 text-xs uppercase tracking-[0.14em] text-[var(--text-muted)]">{formatDate(item.session_date, true, locale)}</p>
                  <p className="mt-2 truncate text-sm text-[var(--text-muted)]">{item.students?.full_name || copy.noLinkedClient}</p>
                </button>
              );
            })}
          </div>
        ) : (
          <EmptyState title={copy.noTrainings} text={copy.noTrainingsText} />
        )
      }
      detail={
        selectedItem ? (
          <div className="grid gap-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-xs uppercase tracking-[0.18em] text-[var(--accent)]">{copy.client}</p>
                <h3 className="mt-1 text-xl font-semibold text-[var(--text)]">{selectedItem.students?.full_name || copy.noLinkedClient}</h3>
              </div>
              <span className="rounded-full border border-[var(--border)] bg-white px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-[var(--text-muted)]">
                {formatDate(selectedItem.session_date, true, locale)}
              </span>
            </div>
            <label className="grid gap-2">
              <span className="text-sm font-medium text-[var(--text)]">{copy.trainingLabel}</span>
              <input
                value={draft.name}
                onChange={(event) => setDraft((current) => ({ ...current, name: event.target.value }))}
                className="rounded-2xl border border-[var(--border)] bg-white px-4 py-3 text-sm text-[var(--text)] outline-none"
              />
            </label>
            <label className="grid gap-2">
              <span className="text-sm font-medium text-[var(--text)]">{copy.notes}</span>
              <textarea
                rows={10}
                value={draft.notes}
                onChange={(event) => setDraft((current) => ({ ...current, notes: event.target.value }))}
                className="rounded-2xl border border-[var(--border)] bg-white px-4 py-3 text-sm leading-7 text-[var(--text)] outline-none"
                placeholder={copy.notesPlaceholder}
              />
            </label>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <span className="rounded-full border border-[var(--border)] bg-white px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-[var(--text-muted)]">
                {prettifyStatus(selectedItem.status)}
              </span>
              <button onClick={saveTraining} disabled={saving} className="inline-flex items-center gap-2 rounded-2xl bg-[var(--accent)] px-4 py-3 text-sm font-semibold text-[var(--accent-foreground)] disabled:opacity-60">
                {saving ? <LoaderCircle size={16} className="animate-spin" /> : <Check size={16} />}
                {copy.saveChanges}
              </button>
            </div>
          </div>
        ) : (
          <EmptyState title={copy.noTrainings} text={copy.noTrainingsText} />
        )
      }
    />
  );
}

export default function DashboardClient() {
  const router = useRouter();
  const configured = useMemo(() => isSupabaseConfigured(), []);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [checkingSession, setCheckingSession] = useState(true);
  const [loadingCore, setLoadingCore] = useState(false);
  const [loadingTabs, setLoadingTabs] = useState({ clients: false, assessments: false, trainings: false });
  const [workspaceError, setWorkspaceError] = useState("");
  const [currentUser, setCurrentUser] = useState(null);
  const [core, setCore] = useState(EMPTY_CORE);
  const [lists, setLists] = useState(EMPTY_LISTS);
  const [bookingOpen, setBookingOpen] = useState(false);
  const [bookingForm, setBookingForm] = useState({ ...EMPTY_FORM, scheduledDate: defaultDate(), scheduledTime: defaultTime() });
  const [bookingResources, setBookingResources] = useState({ students: [], bookingTypes: [] });
  const [loadingBookingResources, setLoadingBookingResources] = useState(false);
  const [bookingError, setBookingError] = useState("");
  const [creatingBooking, setCreatingBooking] = useState(false);
  const [signingOut, setSigningOut] = useState(false);
  const [languageOpen, setLanguageOpen] = useState(false);
  const [preferredLanguage, setPreferredLanguage] = useState("en");
  const [activeLocale, setActiveLocale] = useState("en");
  const [savingLanguage, setSavingLanguage] = useState(false);
  const [languageError, setLanguageError] = useState("");

  useEffect(() => {
    if (!configured) {
      setCheckingSession(false);
      return;
    }
    const supabase = getSupabaseBrowserClient();
    let mounted = true;

    async function refreshCore(user) {
      setLoadingCore(true);
      setWorkspaceError("");
      try {
        const data = await loadCore(supabase, user);
        if (mounted) setCore(data);
      } catch (error) {
        if (mounted) setWorkspaceError(error?.message || "Não foi possível carregar o núcleo do coach.");
      } finally {
        if (mounted) setLoadingCore(false);
      }
    }

    async function boot() {
      const { data: { session } } = await supabase.auth.getSession();
      if (!mounted) return;
      if (!session?.user) {
        router.replace("/login");
        return;
      }
      setCurrentUser(session.user);
      setCheckingSession(false);
      refreshCore(session.user);
    }

    boot();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!mounted) return;
      if (!session?.user) {
        router.replace("/login");
        return;
      }
      setCurrentUser(session.user);
      setCheckingSession(false);
      refreshCore(session.user);
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [configured, router]);

  useEffect(() => {
    if (!currentUser || !configured) return;
    const supabase = getSupabaseBrowserClient();

    async function loadTab(kind) {
      if (kind === "clients") {
        if (lists.students.length > 0 || loadingTabs.clients) return;
        setLoadingTabs((current) => ({ ...current, clients: true }));
        try {
          const students = await loadStudents(supabase, currentUser);
          setLists((current) => ({ ...current, students }));
        } finally {
          setLoadingTabs((current) => ({ ...current, clients: false }));
        }
      }
      if (kind === "assessments") {
        if (lists.recentAssessments.length > 0 || loadingTabs.assessments) return;
        setLoadingTabs((current) => ({ ...current, assessments: true }));
        try {
          const recentAssessments = await loadAssessments(supabase, currentUser);
          setLists((current) => ({ ...current, recentAssessments }));
        } finally {
          setLoadingTabs((current) => ({ ...current, assessments: false }));
        }
      }
      if (kind === "trainings") {
        if (lists.recentTrainings.length > 0 || loadingTabs.trainings) return;
        setLoadingTabs((current) => ({ ...current, trainings: true }));
        try {
          const recentTrainings = await loadTrainings(supabase, currentUser);
          setLists((current) => ({ ...current, recentTrainings }));
        } finally {
          setLoadingTabs((current) => ({ ...current, trainings: false }));
        }
      }
    }

    if (activeTab === "clients" || bookingOpen) loadTab("clients");
    if (activeTab === "assessments") loadTab("assessments");
    if (activeTab === "trainings") loadTab("trainings");
  }, [activeTab, bookingOpen, configured, currentUser, lists.recentAssessments.length, lists.recentTrainings.length, lists.students.length, loadingTabs.assessments, loadingTabs.clients, loadingTabs.trainings]);

  useEffect(() => {
    if (!currentUser) return;
    const storedLocale = getStoredCoachLocale(currentUser);
    if (storedLocale) {
      setActiveLocale(storedLocale);
      applyCoachLocale(storedLocale);
      setLanguageOpen(false);
      setLanguageError("");
      return;
    }

    const suggestedLocale = guessCoachLocale();
    setActiveLocale(suggestedLocale);
    applyCoachLocale(suggestedLocale);
    setPreferredLanguage(suggestedLocale);
    setLanguageOpen(true);
  }, [currentUser]);

  async function handleSignOut() {
    if (!configured) {
      router.replace("/login");
      return;
    }
    setSigningOut(true);
    try {
      const supabase = getSupabaseBrowserClient();
      await supabase.auth.signOut();
      router.replace("/login");
      router.refresh();
    } finally {
      setSigningOut(false);
    }
  }

  async function openBookingModal(prefill = "") {
    const prefilledStudentId = typeof prefill === "string" ? prefill : prefill?.studentId || "";
    const prefilledDate = typeof prefill === "object" && prefill?.scheduledDate ? prefill.scheduledDate : "";
    setBookingOpen(true);
    setBookingError("");
    if (prefilledDate) {
      setBookingForm((current) => ({ ...current, scheduledDate: prefilledDate }));
    }
    if (!currentUser || loadingBookingResources) return;
    if (bookingResources.students.length > 0 && bookingResources.bookingTypes.length > 0) {
      setBookingForm((current) => ({
        ...current,
        scheduledDate: prefilledDate || current.scheduledDate,
        studentId: prefilledStudentId || current.studentId || bookingResources.students[0]?.id || "",
        bookingTypeId: current.bookingTypeId || bookingResources.bookingTypes[0]?.id || "",
      }));
      return;
    }
    setLoadingBookingResources(true);
    try {
      const supabase = getSupabaseBrowserClient();
      const [students, bookingTypes] = await Promise.all([
        lists.students.length > 0 ? Promise.resolve(lists.students) : loadStudents(supabase, currentUser),
        ensureBookingTypes(supabase, currentUser),
      ]);
      if (lists.students.length === 0) setLists((current) => ({ ...current, students }));
      setBookingResources({ students, bookingTypes });
      setBookingForm((current) => ({
        ...current,
        scheduledDate: prefilledDate || current.scheduledDate,
        studentId: prefilledStudentId || current.studentId || students[0]?.id || "",
        bookingTypeId: current.bookingTypeId || bookingTypes[0]?.id || "",
      }));
    } catch (error) {
      setBookingError(error?.message || getCopy(activeLocale).prepareBookingError);
    } finally {
      setLoadingBookingResources(false);
    }
  }

  function closeBookingModal() {
    setBookingOpen(false);
    setBookingError("");
  }

  function updateBookingField(field, value) {
    setBookingForm((current) => ({ ...current, [field]: value }));
  }

  function openAssessmentsForStudent() {
    startTransition(() => setActiveTab("assessments"));
  }

  function openTrainingsForStudent() {
    startTransition(() => setActiveTab("trainings"));
  }

  async function handleSaveLanguage(targetLocale = preferredLanguage, options = {}) {
    if (!currentUser || !configured) return;
    const normalizedLocale = targetLocale || preferredLanguage;
    setSavingLanguage(true);
    setLanguageError("");

    try {
      const supabase = getSupabaseBrowserClient();
      const metadata = {
        ...(currentUser.user_metadata || {}),
        app_locale_code: normalizedLocale,
        locale_code: normalizedLocale,
      };

      const { data, error } = await supabase.auth.updateUser({
        data: metadata,
      });

      if (error) throw error;

      const nextUser = data?.user || {
        ...currentUser,
        user_metadata: metadata,
      };

      setCurrentUser(nextUser);
      setPreferredLanguage(normalizedLocale);
      setActiveLocale(normalizedLocale);
      applyCoachLocale(normalizedLocale);
      if (options.closeModal !== false) {
        setLanguageOpen(false);
      }
    } catch (error) {
      setLanguageError(error?.message || getCopy(normalizedLocale).couldNotSaveLanguage);
    } finally {
      setSavingLanguage(false);
    }
  }

  async function handleCreateBooking(event) {
    event.preventDefault();
    setBookingError("");
    if (!currentUser) return;
    if (!bookingForm.studentId || !bookingForm.bookingTypeId || !bookingForm.scheduledDate || !bookingForm.scheduledTime) {
      setBookingError(getCopy(activeLocale).selectRequired);
      return;
    }
    const bookingType = bookingResources.bookingTypes.find((item) => item.id === bookingForm.bookingTypeId);
    if (!bookingType) {
      setBookingError(getCopy(activeLocale).invalidBookingType);
      return;
    }
    setCreatingBooking(true);
    try {
      const supabase = getSupabaseBrowserClient();
      const scheduledAt = combineDateTime(bookingForm.scheduledDate, bookingForm.scheduledTime);
      const response = await supabase.from("agenda_items").insert({
        coach_id: currentUser.id,
        student_id: bookingForm.studentId,
        booking_type_id: bookingType.id,
        item_type: bookingType.category,
        notes: bookingForm.notes.trim(),
        scheduled_at: scheduledAt.toISOString(),
        scheduled_timezone_offset_minutes: scheduledAt.getTimezoneOffset() * -1,
        status: "scheduled",
        approval_status: "approved",
        requested_by_role: "coach",
      });
      if (response.error) throw response.error;
      const refreshedCore = await loadCore(supabase, currentUser);
      setCore(refreshedCore);
      setBookingForm({ ...EMPTY_FORM, studentId: bookingForm.studentId, bookingTypeId: bookingForm.bookingTypeId, scheduledDate: defaultDate(), scheduledTime: defaultTime() });
      setBookingOpen(false);
      startTransition(() => setActiveTab("agenda"));
    } catch (error) {
      setBookingError(error?.message || getCopy(activeLocale).createBookingError);
    } finally {
      setCreatingBooking(false);
    }
  }

  if (!configured) {
    return <main className="flex min-h-screen items-center justify-center bg-[var(--bg)] px-5 text-[var(--text)]"><div className="max-w-xl rounded-[32px] border border-amber-300 bg-amber-50 p-8 shadow-[var(--shadow-soft)]"><h1 className="text-2xl font-semibold">{getCopy(activeLocale).configTitle}</h1><p className="mt-4 leading-8 text-[var(--text-muted)]">{getCopy(activeLocale).configText}</p></div></main>;
  }

  if (checkingSession) {
    return <main className="flex min-h-screen items-center justify-center bg-[var(--bg)] text-[var(--text)]"><div className="inline-flex items-center gap-3 rounded-full border border-[var(--border)] bg-[var(--surface-solid)] px-5 py-3 shadow-[var(--shadow-soft)]"><LoaderCircle size={18} className="animate-spin text-[var(--accent)]" />{getCopy(activeLocale).coachSession}</div></main>;
  }

  const coachName = core.profile?.full_name || currentUser?.user_metadata?.full_name || currentUser?.email || "Coach";
  const copy = getCopy(activeLocale);
  const appTabs = [
    { id: "dashboard", label: copy.tabs.dashboard, icon: LayoutDashboard },
    { id: "clients", label: copy.tabs.clients, icon: Users },
    { id: "assessments", label: copy.tabs.assessments, icon: ClipboardList },
    { id: "agenda", label: copy.tabs.agenda, icon: CalendarDays },
    { id: "trainings", label: copy.tabs.trainings, icon: Dumbbell },
    { id: "coach", label: copy.tabs.coach, icon: ShieldCheck },
  ];
  return (
    <>
      {languageOpen ? <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/35 px-4 py-6 backdrop-blur-sm"><div className="w-full max-w-2xl rounded-[28px] border border-[var(--border-strong)] bg-white p-5 shadow-[var(--shadow-panel)] sm:p-6"><div className="flex items-start gap-4"><div className="rounded-2xl border border-[var(--accent)]/20 bg-[linear-gradient(135deg,var(--accent-soft),rgba(124,77,255,0.08))] p-3 text-[var(--accent-strong)]"><Globe2 size={20} /></div><div><p className="text-xs uppercase tracking-[0.18em] text-[var(--accent)]">{copy.languageSetup}</p><h2 className="mt-2 text-2xl font-semibold text-[var(--text)]">{copy.chooseLanguage}</h2><p className="mt-3 text-sm leading-7 text-[var(--text-muted)]">{copy.chooseLanguageText}</p></div></div><div className="mt-6 grid gap-3 sm:grid-cols-2">{LANGUAGE_OPTIONS.map((option) => { const active = preferredLanguage === option.value; return <button key={option.value} onClick={() => { setPreferredLanguage(option.value); setActiveLocale(option.value); applyCoachLocale(option.value); }} className={`flex items-center justify-between rounded-[20px] border px-4 py-3 text-left transition ${active ? "border-[var(--accent)] bg-[var(--accent-soft)]" : "border-[var(--border)] bg-[var(--surface-muted)] hover:bg-white"}`}><div className="flex items-center gap-3"><span className="text-2xl" style={{ fontFamily: "\"Segoe UI Emoji\",\"Apple Color Emoji\",\"Noto Color Emoji\",sans-serif" }}>{option.flag}</span><div><p className="font-semibold text-[var(--text)]">{option.label}</p></div></div>{active ? <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--accent)] text-[var(--accent-foreground)]"><Check size={15} /></span> : null}</button>; })}</div>{languageError ? <div className="mt-5 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">{languageError}</div> : null}<div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end"><button onClick={handleSaveLanguage} disabled={savingLanguage} className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[var(--accent)] px-5 py-3 font-semibold text-[var(--accent-foreground)] disabled:opacity-60">{savingLanguage ? <LoaderCircle size={16} className="animate-spin" /> : <Check size={16} />}{copy.saveLanguage}</button></div></div></div> : null}
      {bookingOpen ? <div className="fixed inset-0 z-40 flex items-center justify-center bg-slate-950/30 px-4 py-6 backdrop-blur-sm"><div className="w-full max-w-2xl rounded-[28px] border border-[var(--border-strong)] bg-white p-5 shadow-[var(--shadow-panel)]"><div className="flex items-start justify-between gap-4"><div><p className="text-xs uppercase tracking-[0.18em] text-[var(--accent)]">{copy.bookingTitle}</p><h2 className="mt-2 text-2xl font-semibold text-[var(--text)]">{copy.bookingHeading}</h2><p className="mt-3 text-sm leading-7 text-[var(--text-muted)]">{copy.bookingText}</p></div><button onClick={closeBookingModal} className="rounded-2xl border border-[var(--border)] bg-[var(--surface-muted)] p-3 text-[var(--text-muted)]"><X size={18} /></button></div>{loadingBookingResources ? <div className="mt-6 inline-flex items-center gap-3 rounded-full border border-[var(--border)] bg-[var(--surface-muted)] px-4 py-3 text-sm text-[var(--text-muted)]"><LoaderCircle size={16} className="animate-spin text-[var(--accent)]" />{copy.loadingBooking}</div> : <form onSubmit={handleCreateBooking} className="mt-6 grid gap-4"><label className="grid gap-2"><span className="text-sm font-medium text-[var(--text)]">{copy.client}</span><select value={bookingForm.studentId} onChange={(event) => updateBookingField("studentId", event.target.value)} className="rounded-2xl border border-[var(--border)] bg-[var(--surface-muted)] px-4 py-3 text-sm text-[var(--text)] outline-none"><option value="">{copy.selectClient}</option>{bookingResources.students.map((student) => <option key={student.id} value={student.id}>{student.full_name}</option>)}</select></label><label className="grid gap-2"><span className="text-sm font-medium text-[var(--text)]">{copy.bookingType}</span><select value={bookingForm.bookingTypeId} onChange={(event) => updateBookingField("bookingTypeId", event.target.value)} className="rounded-2xl border border-[var(--border)] bg-[var(--surface-muted)] px-4 py-3 text-sm text-[var(--text)] outline-none"><option value="">{copy.selectType}</option>{bookingResources.bookingTypes.map((type) => <option key={type.id} value={type.id}>{type.name}</option>)}</select></label><div className="grid gap-4 sm:grid-cols-2"><label className="grid gap-2"><span className="text-sm font-medium text-[var(--text)]">{copy.date}</span><input type="date" value={bookingForm.scheduledDate} onChange={(event) => updateBookingField("scheduledDate", event.target.value)} className="rounded-2xl border border-[var(--border)] bg-[var(--surface-muted)] px-4 py-3 text-sm text-[var(--text)] outline-none" /></label><label className="grid gap-2"><span className="text-sm font-medium text-[var(--text)]">{copy.time}</span><input type="time" value={bookingForm.scheduledTime} onChange={(event) => updateBookingField("scheduledTime", event.target.value)} className="rounded-2xl border border-[var(--border)] bg-[var(--surface-muted)] px-4 py-3 text-sm text-[var(--text)] outline-none" /></label></div><label className="grid gap-2"><span className="text-sm font-medium text-[var(--text)]">{copy.notes}</span><textarea value={bookingForm.notes} onChange={(event) => updateBookingField("notes", event.target.value)} rows={4} className="rounded-2xl border border-[var(--border)] bg-[var(--surface-muted)] px-4 py-3 text-sm text-[var(--text)] outline-none" placeholder={copy.notesPlaceholder} /></label>{bookingError ? <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">{bookingError}</div> : null}<div className="flex flex-col gap-3 sm:flex-row sm:justify-end"><button type="button" onClick={closeBookingModal} className="rounded-2xl border border-[var(--border)] bg-white px-5 py-3 text-sm font-medium text-[var(--text-muted)]">{copy.cancel}</button><button type="submit" disabled={creatingBooking} className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[var(--accent)] px-5 py-3 text-sm font-semibold text-[var(--accent-foreground)] disabled:opacity-60">{creatingBooking ? <LoaderCircle size={16} className="animate-spin" /> : <Plus size={16} />}{copy.createBooking}</button></div></form>}</div></div> : null}

      <main className="min-h-screen bg-[var(--bg)] text-[var(--text)] lg:h-screen lg:overflow-hidden">
        <div className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,rgba(42,208,125,0.12),transparent_24%),radial-gradient(circle_at_bottom_right,rgba(124,77,255,0.08),transparent_20%),linear-gradient(180deg,#fbfbfb_0%,#f5f5f5_48%,#f2f4f3_100%)]" />
        <div className="mx-auto grid min-h-screen max-w-[1600px] gap-3 px-4 py-4 lg:h-screen lg:min-h-0 lg:grid-cols-[240px_minmax(0,1fr)] lg:px-5">
          <aside className="rounded-[24px] border border-[var(--border-strong)] bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(245,245,245,0.95))] p-3 shadow-[var(--shadow-panel)] lg:sticky lg:top-4 lg:flex lg:h-[calc(100vh-2rem)] lg:flex-col">
            <div className="flex items-center gap-2.5 px-1">
              <div className="rounded-2xl border border-[var(--border)] bg-[linear-gradient(135deg,var(--accent-soft),rgba(124,77,255,0.08))] p-2">
                <LayoutDashboard size={16} className="text-[var(--accent-strong)]" />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold tracking-[0.14em] text-[var(--text)]">APEX COACH</p>
                <p className="text-[10px] uppercase tracking-[0.16em] text-[var(--text-muted)]">{copy.webWorkspace}</p>
              </div>
            </div>

            <div className="mt-3 rounded-[18px] border border-[var(--border)] bg-[linear-gradient(135deg,var(--accent-soft),rgba(124,77,255,0.08))] px-3 py-3">
              <p className="truncate text-sm font-semibold text-[var(--text)]">{coachName}</p>
              <p className="mt-1 text-[10px] uppercase tracking-[0.14em] text-[var(--text-muted)]">{prettifyStatus(core.subscription?.status || "trialing")}</p>
            </div>

            <div className="mt-3 flex min-h-0 flex-1 flex-col">
              <p className="px-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--text-muted)]">Workspace</p>
              <nav className="mt-2 grid gap-1">
                {appTabs.map(({ id, label, icon: Icon }) => {
                  const active = activeTab === id;
                  const emphasized = id === "agenda";
                  return (
                    <button
                      key={id}
                      onClick={() => startTransition(() => setActiveTab(id))}
                      className={`group flex items-center gap-2.5 rounded-[15px] border px-3 py-2 text-left text-sm transition ${active ? "border-[var(--accent)] bg-[var(--accent)] text-[#081014] shadow-[0_10px_22px_rgba(42,208,125,0.18)]" : emphasized ? "border-[var(--accent)]/25 bg-[linear-gradient(135deg,var(--accent-soft),rgba(124,77,255,0.06))] text-[var(--text)]" : "border-transparent bg-transparent text-[var(--text-muted)] hover:border-[var(--border)] hover:bg-white hover:text-[var(--text)]"}`}
                    >
                      <span className={`flex h-7 w-7 items-center justify-center rounded-xl transition ${active ? "bg-white/22" : "bg-white text-[var(--text-muted)] group-hover:text-[var(--text)]"}`}>
                        <Icon size={14} />
                      </span>
                      <span className="font-medium">{label}</span>
                    </button>
                  );
                })}
              </nav>
            </div>

            <div className="mt-auto grid gap-2 border-t border-[var(--border)] pt-3">
              <button onClick={openBookingModal} className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[var(--accent)] px-3.5 py-2.5 text-sm font-semibold text-[var(--accent-foreground)]">
                <Plus size={14} />
                {copy.newBooking}
              </button>
              <button onClick={handleSignOut} disabled={signingOut} className="inline-flex items-center justify-center gap-2 rounded-2xl border border-[var(--border)] bg-white px-3.5 py-2.5 text-sm text-[var(--text-muted)] disabled:opacity-60">
                {signingOut ? <LoaderCircle size={14} className="animate-spin" /> : <LogOut size={14} />}
                {copy.signOut}
              </button>
            </div>
          </aside>
          <section className="grid min-w-0 overflow-x-hidden gap-3 lg:h-[calc(100vh-2rem)] lg:overflow-y-auto lg:pr-2">{activeTab !== "dashboard" ? <header className="rounded-[20px] border border-[var(--border-strong)] bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(245,245,245,0.95))] px-4 py-3 shadow-[var(--shadow-panel)]"><div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between"><div><h1 className="text-xl font-semibold tracking-tight text-[var(--text)] sm:text-[1.7rem]">{appTabs.find((tab) => tab.id === activeTab)?.label || copy.tabs.dashboard}</h1><p className="mt-1 max-w-3xl text-sm leading-6 text-[var(--text-muted)]">{copy.fastWorkspace}</p></div><Link href="/login" className="inline-flex items-center justify-center rounded-2xl border border-[var(--border)] bg-white px-3.5 py-2 text-sm font-semibold text-[var(--text)]">{copy.switchAccount}</Link></div></header> : null}{workspaceError ? <div className="rounded-[20px] border border-rose-200 bg-rose-50 px-5 py-4 text-rose-700 shadow-[var(--shadow-soft)]">{workspaceError}</div> : null}{loadingCore ? <div className="inline-flex items-center gap-3 rounded-full border border-[var(--border)] bg-[var(--surface-solid)] px-5 py-3 shadow-[var(--shadow-soft)]"><LoaderCircle size={18} className="animate-spin text-[var(--accent)]" />{copy.loadingCore}</div> : null}<div className="flex gap-3 overflow-x-auto pb-1 lg:hidden">{appTabs.map(({ id, label }) => <button key={id} onClick={() => startTransition(() => setActiveTab(id))} className={`shrink-0 rounded-full border px-4 py-2 text-sm font-medium ${activeTab === id ? "border-[var(--accent)] bg-[var(--accent)] text-[var(--accent-foreground)]" : "border-[var(--border)] bg-white text-[var(--text-muted)]"}`}>{label}</button>)}</div>
          {activeTab === "dashboard" ? (
            <div className="grid gap-3">
              <DashboardHero coachName={coachName} core={core} copy={copy} locale={activeLocale} onCreate={openBookingModal} />

              <div className="grid gap-3 xl:grid-cols-[minmax(0,1.45fr)_minmax(360px,0.7fr)]">
                <AgendaWorkspace currentUser={currentUser} compact onOpenCreateBooking={openBookingModal} locale={activeLocale} />
                <CoachHubCard
                  copy={copy}
                  attentionItems={core.business.attention}
                  locale={activeLocale}
                />
              </div>

              <CompactBillingOverviewSection business={core.business} copy={copy} locale={activeLocale} />

              <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                <button onClick={openBookingModal} className="rounded-[20px] border border-[var(--accent)] bg-[var(--accent)] px-4 py-3 text-left font-semibold text-[var(--accent-foreground)] shadow-[var(--shadow-soft)]">
                  <span className="inline-flex items-center gap-2 text-sm"><Plus size={15} />{copy.newBooking}</span>
                  <span className="mt-2 block text-xs font-medium opacity-75">{copy.createNowHint}</span>
                </button>
                <button onClick={() => startTransition(() => setActiveTab("clients"))} className="rounded-[20px] border border-[var(--border)] bg-white px-4 py-3 text-left shadow-[var(--shadow-soft)]">
                  <span className="text-sm font-semibold text-[var(--text)]">{copy.tabs.clients}</span>
                  <span className="mt-2 block text-xs leading-5 text-[var(--text-muted)]">{copy.activeClientsHint}</span>
                </button>
                <button onClick={() => startTransition(() => setActiveTab("assessments"))} className="rounded-[20px] border border-[var(--border)] bg-white px-4 py-3 text-left shadow-[var(--shadow-soft)]">
                  <span className="text-sm font-semibold text-[var(--text)]">{copy.tabs.assessments}</span>
                  <span className="mt-2 block text-xs leading-5 text-[var(--text-muted)]">{copy.assessmentsHint}</span>
                </button>
                <button onClick={() => startTransition(() => setActiveTab("trainings"))} className="rounded-[20px] border border-[var(--border)] bg-white px-4 py-3 text-left shadow-[var(--shadow-soft)]">
                  <span className="text-sm font-semibold text-[var(--text)]">{copy.tabs.trainings}</span>
                  <span className="mt-2 block text-xs leading-5 text-[var(--text-muted)]">{copy.trainingsHint}</span>
                </button>
              </div>
                    </div>
          ) : null}
          {activeTab === "clients" ? <ClientWorkspace currentUser={currentUser} onOpenCreateBooking={openBookingModal} onOpenAssessments={openAssessmentsForStudent} onOpenTrainings={openTrainingsForStudent} locale={activeLocale} /> : null}
          {activeTab === "assessments" ? <AssessmentBuilderWorkspace items={lists.recentAssessments} loading={loadingTabs.assessments} copy={copy} locale={activeLocale} currentUser={currentUser} onItemsChange={(updater) => setLists((current) => ({ ...current, recentAssessments: typeof updater === "function" ? updater(current.recentAssessments) : updater }))} /> : null}
          {activeTab === "agenda" ? <AgendaWorkspace currentUser={currentUser} onOpenCreateBooking={openBookingModal} locale={activeLocale} /> : null}
          {activeTab === "trainings" ? <TrainingBuilderWorkspace items={lists.recentTrainings} loading={loadingTabs.trainings} copy={copy} locale={activeLocale} currentUser={currentUser} onItemsChange={(updater) => setLists((current) => ({ ...current, recentTrainings: typeof updater === "function" ? updater(current.recentTrainings) : updater }))} /> : null}
          {activeTab === "coach" ? <div className="grid gap-4 xl:grid-cols-3"><SectionCard eyebrow={copy.coachHub} title={copy.coachAccount} description={copy.coachAccountText}><div className="grid gap-3"><div className="rounded-[20px] border border-[var(--border)] bg-[var(--surface-muted)] p-4"><p className="text-xs uppercase tracking-[0.18em] text-[var(--text-muted)]">{copy.nameLabel}</p><p className="mt-2 font-semibold text-[var(--text)]">{coachName}</p></div><div className="rounded-[20px] border border-[var(--border)] bg-[var(--surface-muted)] p-4"><p className="text-xs uppercase tracking-[0.18em] text-[var(--text-muted)]">{copy.emailLabel}</p><p className="mt-2 font-semibold text-[var(--text)]">{currentUser?.email || copy.noEmail}</p></div></div></SectionCard><SectionCard eyebrow={copy.subscriptionEyebrow} title={copy.subscriptionTitle} description={copy.subscriptionText}><div className="grid gap-3"><div className="rounded-[20px] border border-[var(--border)] bg-[linear-gradient(135deg,var(--accent-soft),rgba(124,77,255,0.08))] p-4"><p className="text-xs uppercase tracking-[0.18em] text-[var(--accent)]">{copy.planStatus}</p><p className="mt-2 text-xl font-semibold text-[var(--text)]">{prettifyStatus(core.subscription?.status || "trialing")}</p><p className="mt-2 text-sm leading-6 text-[var(--text-muted)]">{(core.subscription?.subscription_category || "apex_coach").toString().replace(/_/g, " ")}</p></div><button onClick={handleSignOut} disabled={signingOut} className="inline-flex items-center justify-center gap-2 rounded-2xl border border-[var(--border)] bg-white px-4 py-2.5 text-sm font-semibold text-[var(--text)] disabled:opacity-60">{signingOut ? <LoaderCircle size={16} className="animate-spin" /> : <LogOut size={16} />}{copy.signOut}</button></div></SectionCard><SectionCard eyebrow={copy.languageSetup} title={copy.languageSettings} description={copy.languageSettingsText}><div className="grid gap-3"><div className="rounded-[20px] border border-[var(--border)] bg-[var(--surface-muted)] p-4"><p className="text-xs uppercase tracking-[0.18em] text-[var(--text-muted)]">{copy.activeLanguage}</p><p className="mt-2 text-lg font-semibold text-[var(--text)]">{LANGUAGE_OPTIONS.find((option) => option.value === activeLocale)?.label || activeLocale.toUpperCase()}</p><p className="mt-2 text-sm leading-6 text-[var(--text-muted)]">{copy.saveLanguageHint}</p></div><div className="grid gap-2 sm:grid-cols-2">{LANGUAGE_OPTIONS.map((option) => { const active = preferredLanguage === option.value; return <button key={option.value} onClick={() => { setPreferredLanguage(option.value); setActiveLocale(option.value); applyCoachLocale(option.value); }} className={`flex items-center justify-between rounded-[18px] border px-3 py-3 text-left transition ${active ? "border-[var(--accent)] bg-[var(--accent-soft)]" : "border-[var(--border)] bg-white hover:bg-[var(--surface-muted)]"}`}><div className="flex items-center gap-3"><span className="text-xl" style={{ fontFamily: "\"Segoe UI Emoji\",\"Apple Color Emoji\",\"Noto Color Emoji\",sans-serif" }}>{option.flag}</span><div><p className="font-semibold text-[var(--text)]">{option.label}</p><p className="text-[11px] uppercase tracking-[0.14em] text-[var(--text-muted)]">{option.short}</p></div></div>{active ? <Check size={15} className="text-[var(--accent-strong)]" /> : null}</button>; })}</div>{languageError ? <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">{languageError}</div> : null}<button onClick={() => handleSaveLanguage(preferredLanguage, { closeModal: false })} disabled={savingLanguage} className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[var(--accent)] px-4 py-2.5 text-sm font-semibold text-[var(--accent-foreground)] disabled:opacity-60">{savingLanguage ? <LoaderCircle size={16} className="animate-spin" /> : <Check size={16} />}{copy.saveLanguage}</button></div></SectionCard></div> : null}
          </section>
        </div>
      </main>
    </>
  );
}
