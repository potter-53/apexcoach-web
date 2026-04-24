"use client";

import { startTransition, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { CalendarDays, Check, ClipboardList, Dumbbell, Globe2, LayoutDashboard, LoaderCircle, LogOut, Plus, ShieldCheck, Users, X } from "lucide-react";
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

const EMPTY_CORE = { profile: null, subscription: null, metrics: { clients: 0, agendaToday: 0, assessments: 0, trainings: 0 }, upcomingAgenda: [] };
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

function missingColumn(error) {
  const message = error?.message?.toLowerCase?.() ?? error?.toString?.().toLowerCase?.() ?? "";
  return message.includes("client_color_hex") && (message.includes("42703") || message.includes("column"));
}

async function colorFallback(builder) {
  try {
    return await builder(true);
  } catch (error) {
    if (!missingColumn(error)) throw error;
    return builder(false);
  }
}

function todayBounds() {
  const now = new Date();
  return {
    start: new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString(),
    end: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1).toISOString(),
  };
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

async function loadCore(supabase, user) {
  const { start, end } = todayBounds();
  const nowIso = new Date().toISOString();
  const responses = await Promise.all([
    supabase.from("profiles").select("id, role, full_name").eq("id", user.id).maybeSingle(),
    supabase.from("subscriptions").select("status, plan, trial_ends_at, current_period_ends_at, subscription_category, payment_method_last4").eq("coach_id", user.id).order("created_at", { ascending: false }).limit(1).maybeSingle(),
    supabase.from("students").select("id", { count: "exact", head: true }).eq("coach_id", user.id),
    supabase.from("agenda_items").select("id", { count: "exact", head: true }).eq("coach_id", user.id).gte("scheduled_at", start).lt("scheduled_at", end),
    supabase.from("assessments").select("id", { count: "exact", head: true }).eq("coach_id", user.id),
    supabase.from("training_sessions").select("id", { count: "exact", head: true }).eq("coach_id", user.id),
    colorFallback((includeColor) => supabase.from("agenda_items").select(includeColor ? "id, item_type, notes, scheduled_at, status, students(full_name, client_color_hex), booking_types(name)" : "id, item_type, notes, scheduled_at, status, students(full_name), booking_types(name)").eq("coach_id", user.id).gte("scheduled_at", nowIso).order("scheduled_at", { ascending: true }).limit(8)),
  ]);
  const failed = responses.find((item) => item.error);
  if (failed?.error) throw failed.error;
  return {
    profile: responses[0].data,
    subscription: responses[1].data,
    metrics: { clients: responses[2].count ?? 0, agendaToday: responses[3].count ?? 0, assessments: responses[4].count ?? 0, trainings: responses[5].count ?? 0 },
    upcomingAgenda: responses[6].data ?? [],
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

function MetricCard({ label, value, Icon, hint }) {
  return <div className="rounded-[20px] border border-[var(--border)] bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(246,248,247,0.98))] p-3.5 shadow-[var(--shadow-soft)]"><div className="flex items-start justify-between gap-3"><div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-[var(--accent)]/12"><Icon size={16} className="text-[var(--accent)]" /></div><span className="rounded-full border border-[var(--border)] bg-white px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-[var(--text-muted)]">{label}</span></div><p className="mt-3 text-2xl font-semibold text-[var(--text)]">{value}</p><p className="mt-1.5 text-sm leading-5 text-[var(--text-muted)]">{hint}</p></div>;
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

function AgendaCards({ items, onCreate, locale }) {
  const copy = getCopy(locale);
  return <SectionCard eyebrow={copy.agendaSpotlight} title={copy.tabs.agenda} description={null} action={<button onClick={onCreate} className="inline-flex items-center gap-2 rounded-2xl bg-[var(--accent)] px-3.5 py-2 text-sm font-semibold text-[var(--accent-foreground)]"><Plus size={14} />{copy.newBooking}</button>}>{items.length > 0 ? <div className="grid gap-3 xl:grid-cols-[1.1fr_0.9fr]">{items.slice(0, 1).map((item) => <div key={item.id} className="rounded-[20px] border border-[var(--border)] bg-[linear-gradient(135deg,var(--accent-soft),rgba(124,77,255,0.08))] p-3.5"><div className="flex items-start justify-between gap-4"><div><p className="text-[10px] uppercase tracking-[0.14em] text-[var(--accent)]">{formatDate(item.scheduled_at, true, locale)}</p><p className="mt-1 text-2xl font-semibold text-[var(--text)]">{formatTime(item.scheduled_at, locale)}</p></div><span className="rounded-full border border-[var(--border)] bg-white px-2 py-1 text-[10px] uppercase tracking-[0.14em] text-[var(--text-muted)]">{prettifyStatus(item.status)}</span></div><div className="mt-4 flex items-center gap-2.5"><span className="h-2.5 w-2.5 rounded-full" style={{ background: colorDot(item.students?.client_color_hex) }} /><p className="font-semibold text-[var(--text)]">{item.students?.full_name || copy.client}</p></div><p className="mt-1 text-[11px] uppercase tracking-[0.12em] text-[var(--text-muted)]">{item.booking_types?.name || item.item_type || copy.bookingType}</p>{item.notes ? <p className="mt-2 line-clamp-2 text-sm leading-5 text-[var(--text-muted)]">{item.notes}</p> : null}</div>)}<div className="grid gap-2.5">{items.slice(1, 5).map((item) => <div key={item.id} className="rounded-[16px] border border-[var(--border)] bg-[linear-gradient(180deg,rgba(255,255,255,0.96),rgba(246,248,247,0.96))] p-3"><div className="flex items-start justify-between gap-3"><div><p className="text-[10px] uppercase tracking-[0.14em] text-[var(--accent)]">{formatDate(item.scheduled_at, true, locale)}</p><p className="mt-1 text-lg font-semibold text-[var(--text)]">{formatTime(item.scheduled_at, locale)}</p></div><span className="rounded-full border border-[var(--border)] bg-white px-2 py-1 text-[10px] uppercase tracking-[0.12em] text-[var(--text-muted)]">{prettifyStatus(item.status)}</span></div><div className="mt-2.5 flex items-center gap-2.5"><span className="h-2.5 w-2.5 rounded-full" style={{ background: colorDot(item.students?.client_color_hex) }} /><p className="font-medium text-[var(--text)]">{item.students?.full_name || copy.client}</p></div><p className="mt-1 text-[11px] uppercase tracking-[0.12em] text-[var(--text-muted)]">{item.booking_types?.name || item.item_type || copy.bookingType}</p></div>)}</div></div> : <EmptyState title={copy.noUpcomingTitle} text={copy.noUpcomingText} />}</SectionCard>;
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

  async function openBookingModal(prefilledStudentId = "") {
    setBookingOpen(true);
    setBookingError("");
    if (!currentUser || loadingBookingResources) return;
    if (bookingResources.students.length > 0 && bookingResources.bookingTypes.length > 0) {
      setBookingForm((current) => ({
        ...current,
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
  const metrics = [
    { label: copy.tabs.clients, value: core.metrics.clients, Icon: Users, hint: copy.activeClientsHint },
    { label: copy.tabs.agenda, value: core.metrics.agendaToday, Icon: CalendarDays, hint: copy.agendaTodayHint },
    { label: copy.tabs.assessments, value: core.metrics.assessments, Icon: ClipboardList, hint: copy.assessmentsHint },
    { label: copy.tabs.trainings, value: core.metrics.trainings, Icon: Dumbbell, hint: copy.trainingsHint },
  ];

  return (
    <>
      {languageOpen ? <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/35 px-4 py-6 backdrop-blur-sm"><div className="w-full max-w-2xl rounded-[28px] border border-[var(--border-strong)] bg-white p-5 shadow-[var(--shadow-panel)] sm:p-6"><div className="flex items-start gap-4"><div className="rounded-2xl border border-[var(--accent)]/20 bg-[linear-gradient(135deg,var(--accent-soft),rgba(124,77,255,0.08))] p-3 text-[var(--accent-strong)]"><Globe2 size={20} /></div><div><p className="text-xs uppercase tracking-[0.18em] text-[var(--accent)]">{copy.languageSetup}</p><h2 className="mt-2 text-2xl font-semibold text-[var(--text)]">{copy.chooseLanguage}</h2><p className="mt-3 text-sm leading-7 text-[var(--text-muted)]">{copy.chooseLanguageText}</p></div></div><div className="mt-6 grid gap-3 sm:grid-cols-2">{LANGUAGE_OPTIONS.map((option) => { const active = preferredLanguage === option.value; return <button key={option.value} onClick={() => { setPreferredLanguage(option.value); setActiveLocale(option.value); applyCoachLocale(option.value); }} className={`flex items-center justify-between rounded-[20px] border px-4 py-3 text-left transition ${active ? "border-[var(--accent)] bg-[var(--accent-soft)]" : "border-[var(--border)] bg-[var(--surface-muted)] hover:bg-white"}`}><div className="flex items-center gap-3"><span className="text-2xl" style={{ fontFamily: "\"Segoe UI Emoji\",\"Apple Color Emoji\",\"Noto Color Emoji\",sans-serif" }}>{option.flag}</span><div><p className="font-semibold text-[var(--text)]">{option.label}</p></div></div>{active ? <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--accent)] text-[var(--accent-foreground)]"><Check size={15} /></span> : null}</button>; })}</div>{languageError ? <div className="mt-5 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">{languageError}</div> : null}<div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end"><button onClick={handleSaveLanguage} disabled={savingLanguage} className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[var(--accent)] px-5 py-3 font-semibold text-[var(--accent-foreground)] disabled:opacity-60">{savingLanguage ? <LoaderCircle size={16} className="animate-spin" /> : <Check size={16} />}{copy.saveLanguage}</button></div></div></div> : null}
      {bookingOpen ? <div className="fixed inset-0 z-40 flex items-center justify-center bg-slate-950/30 px-4 py-6 backdrop-blur-sm"><div className="w-full max-w-2xl rounded-[28px] border border-[var(--border-strong)] bg-white p-5 shadow-[var(--shadow-panel)]"><div className="flex items-start justify-between gap-4"><div><p className="text-xs uppercase tracking-[0.18em] text-[var(--accent)]">{copy.bookingTitle}</p><h2 className="mt-2 text-2xl font-semibold text-[var(--text)]">{copy.bookingHeading}</h2><p className="mt-3 text-sm leading-7 text-[var(--text-muted)]">{copy.bookingText}</p></div><button onClick={closeBookingModal} className="rounded-2xl border border-[var(--border)] bg-[var(--surface-muted)] p-3 text-[var(--text-muted)]"><X size={18} /></button></div>{loadingBookingResources ? <div className="mt-6 inline-flex items-center gap-3 rounded-full border border-[var(--border)] bg-[var(--surface-muted)] px-4 py-3 text-sm text-[var(--text-muted)]"><LoaderCircle size={16} className="animate-spin text-[var(--accent)]" />{copy.loadingBooking}</div> : <form onSubmit={handleCreateBooking} className="mt-6 grid gap-4"><label className="grid gap-2"><span className="text-sm font-medium text-[var(--text)]">{copy.client}</span><select value={bookingForm.studentId} onChange={(event) => updateBookingField("studentId", event.target.value)} className="rounded-2xl border border-[var(--border)] bg-[var(--surface-muted)] px-4 py-3 text-sm text-[var(--text)] outline-none"><option value="">{copy.selectClient}</option>{bookingResources.students.map((student) => <option key={student.id} value={student.id}>{student.full_name}</option>)}</select></label><label className="grid gap-2"><span className="text-sm font-medium text-[var(--text)]">{copy.bookingType}</span><select value={bookingForm.bookingTypeId} onChange={(event) => updateBookingField("bookingTypeId", event.target.value)} className="rounded-2xl border border-[var(--border)] bg-[var(--surface-muted)] px-4 py-3 text-sm text-[var(--text)] outline-none"><option value="">{copy.selectType}</option>{bookingResources.bookingTypes.map((type) => <option key={type.id} value={type.id}>{type.name}</option>)}</select></label><div className="grid gap-4 sm:grid-cols-2"><label className="grid gap-2"><span className="text-sm font-medium text-[var(--text)]">{copy.date}</span><input type="date" value={bookingForm.scheduledDate} onChange={(event) => updateBookingField("scheduledDate", event.target.value)} className="rounded-2xl border border-[var(--border)] bg-[var(--surface-muted)] px-4 py-3 text-sm text-[var(--text)] outline-none" /></label><label className="grid gap-2"><span className="text-sm font-medium text-[var(--text)]">{copy.time}</span><input type="time" value={bookingForm.scheduledTime} onChange={(event) => updateBookingField("scheduledTime", event.target.value)} className="rounded-2xl border border-[var(--border)] bg-[var(--surface-muted)] px-4 py-3 text-sm text-[var(--text)] outline-none" /></label></div><label className="grid gap-2"><span className="text-sm font-medium text-[var(--text)]">{copy.notes}</span><textarea value={bookingForm.notes} onChange={(event) => updateBookingField("notes", event.target.value)} rows={4} className="rounded-2xl border border-[var(--border)] bg-[var(--surface-muted)] px-4 py-3 text-sm text-[var(--text)] outline-none" placeholder={copy.notesPlaceholder} /></label>{bookingError ? <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">{bookingError}</div> : null}<div className="flex flex-col gap-3 sm:flex-row sm:justify-end"><button type="button" onClick={closeBookingModal} className="rounded-2xl border border-[var(--border)] bg-white px-5 py-3 text-sm font-medium text-[var(--text-muted)]">{copy.cancel}</button><button type="submit" disabled={creatingBooking} className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[var(--accent)] px-5 py-3 text-sm font-semibold text-[var(--accent-foreground)] disabled:opacity-60">{creatingBooking ? <LoaderCircle size={16} className="animate-spin" /> : <Plus size={16} />}{copy.createBooking}</button></div></form>}</div></div> : null}

      <main className="min-h-screen bg-[var(--bg)] text-[var(--text)]">
        <div className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,rgba(42,208,125,0.12),transparent_24%),radial-gradient(circle_at_bottom_right,rgba(124,77,255,0.08),transparent_20%),linear-gradient(180deg,#fbfbfb_0%,#f5f5f5_48%,#f2f4f3_100%)]" />
        <div className="mx-auto grid min-h-screen max-w-[1600px] gap-4 px-4 py-4 lg:grid-cols-[248px_minmax(0,1fr)] lg:px-5">
          <aside className="rounded-[26px] border border-[var(--border-strong)] bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(245,245,245,0.95))] p-3.5 shadow-[var(--shadow-panel)] lg:sticky lg:top-4 lg:flex lg:h-[calc(100vh-2rem)] lg:flex-col"><div className="flex items-center gap-3"><div className="rounded-2xl border border-[var(--border)] bg-[linear-gradient(135deg,var(--accent-soft),rgba(124,77,255,0.08))] p-2"><LayoutDashboard size={17} className="text-[var(--accent-strong)]" /></div><div><p className="text-sm font-semibold tracking-[0.16em] text-[var(--text)]">APEX COACH</p><p className="text-[10px] uppercase tracking-[0.18em] text-[var(--text-muted)]">{copy.webWorkspace}</p></div></div><div className="mt-4 rounded-[20px] border border-[var(--border)] bg-[linear-gradient(135deg,var(--accent-soft),rgba(124,77,255,0.08))] px-3.5 py-3"><p className="text-sm font-semibold text-[var(--text)]">{coachName}</p><p className="mt-1 text-[11px] uppercase tracking-[0.14em] text-[var(--text-muted)]">{prettifyStatus(core.subscription?.status || "trialing")}</p></div><nav className="mt-4 grid gap-2 lg:flex-1 lg:content-start lg:overflow-y-auto lg:pr-1">{appTabs.map(({ id, label, icon: Icon }) => { const active = activeTab === id; const emphasized = id === "agenda"; return <button key={id} onClick={() => startTransition(() => setActiveTab(id))} className={`flex items-center gap-3 rounded-[16px] border px-3 py-2.5 text-left text-sm transition ${active ? "border-[var(--accent)] bg-[var(--accent)] text-[#081014] shadow-[0_10px_22px_rgba(42,208,125,0.18)]" : emphasized ? "border-[var(--accent)]/25 bg-[linear-gradient(135deg,var(--accent-soft),rgba(124,77,255,0.06))] text-[var(--text)]" : "border-[var(--border)] bg-[var(--surface-solid)] text-[var(--text-muted)] hover:bg-[var(--surface-muted)]"}`}><span className={`flex h-8 w-8 items-center justify-center rounded-2xl ${active ? "bg-white/22" : "bg-white"}`}><Icon size={15} /></span><span className="font-medium">{label}</span></button>; })}</nav><div className="mt-4 grid gap-2 border-t border-[var(--border)] pt-3"><button onClick={openBookingModal} className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[var(--accent)] px-4 py-2.5 text-sm font-semibold text-[var(--accent-foreground)]"><Plus size={15} />{copy.newBooking}</button><button onClick={handleSignOut} disabled={signingOut} className="inline-flex items-center justify-center gap-2 rounded-2xl border border-[var(--border)] bg-white px-4 py-2.5 text-sm text-[var(--text-muted)] disabled:opacity-60">{signingOut ? <LoaderCircle size={15} className="animate-spin" /> : <LogOut size={15} />}{copy.signOut}</button><Link href="/" className="rounded-2xl px-3 py-2 text-center text-sm text-[var(--text-muted)]">{copy.backToLanding}</Link></div></aside>
          <section className="grid min-w-0 gap-4"><header className="rounded-[22px] border border-[var(--border-strong)] bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(245,245,245,0.95))] p-3.5 shadow-[var(--shadow-panel)]"><div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between"><div><p className="text-[11px] uppercase tracking-[0.16em] text-[var(--accent)]">{copy.coachBrowserWorkspace}</p><h1 className="mt-1.5 text-xl font-semibold tracking-tight text-[var(--text)] sm:text-2xl">{appTabs.find((tab) => tab.id === activeTab)?.label || copy.tabs.dashboard}</h1><p className="mt-1 max-w-3xl text-sm leading-6 text-[var(--text-muted)]">{activeTab === "dashboard" ? copy.agendaSubhead : copy.fastWorkspace}</p></div><Link href="/login" className="inline-flex items-center justify-center rounded-2xl border border-[var(--border)] bg-white px-4 py-2 text-sm font-semibold text-[var(--text)]">{copy.switchAccount}</Link></div></header>{workspaceError ? <div className="rounded-[20px] border border-rose-200 bg-rose-50 px-5 py-4 text-rose-700 shadow-[var(--shadow-soft)]">{workspaceError}</div> : null}{loadingCore ? <div className="inline-flex items-center gap-3 rounded-full border border-[var(--border)] bg-[var(--surface-solid)] px-5 py-3 shadow-[var(--shadow-soft)]"><LoaderCircle size={18} className="animate-spin text-[var(--accent)]" />{copy.loadingCore}</div> : null}<div className="flex gap-3 overflow-x-auto pb-1 lg:hidden">{appTabs.map(({ id, label }) => <button key={id} onClick={() => startTransition(() => setActiveTab(id))} className={`shrink-0 rounded-full border px-4 py-2 text-sm font-medium ${activeTab === id ? "border-[var(--accent)] bg-[var(--accent)] text-[var(--accent-foreground)]" : "border-[var(--border)] bg-white text-[var(--text-muted)]"}`}>{label}</button>)}</div>
          {activeTab === "dashboard" ? <><div className="grid gap-4 xl:grid-cols-[1.2fr_0.8fr]"><AgendaCards items={core.upcomingAgenda.slice(0, 5)} onCreate={openBookingModal} locale={activeLocale} /><SectionCard eyebrow={copy.quickAction} title={copy.bookFaster} description={copy.bookFasterText} action={<button onClick={openBookingModal} className="inline-flex items-center gap-2 rounded-2xl bg-[var(--accent)] px-4 py-2.5 text-sm font-semibold text-[var(--accent-foreground)]"><Plus size={15} />{copy.createNow}</button>}><div className="grid gap-3"><p className="text-sm leading-6 text-[var(--text-muted)]">{copy.createNowHint}</p><div className="grid gap-3 sm:grid-cols-2"><div className="rounded-[18px] border border-[var(--border)] bg-[var(--surface-muted)] px-4 py-3"><p className="text-[11px] uppercase tracking-[0.14em] text-[var(--text-muted)]">{copy.tabs.agenda}</p><p className="mt-1 text-xl font-semibold text-[var(--text)]">{core.metrics.agendaToday}</p></div><div className="rounded-[18px] border border-[var(--border)] bg-[var(--surface-muted)] px-4 py-3"><p className="text-[11px] uppercase tracking-[0.14em] text-[var(--text-muted)]">{copy.tabs.clients}</p><p className="mt-1 text-xl font-semibold text-[var(--text)]">{core.metrics.clients}</p></div></div></div></SectionCard></div><div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">{metrics.map((metric) => <MetricCard key={metric.label} {...metric} />)}</div></> : null}
          {activeTab === "dashboard" ? <><div className="grid gap-4 xl:grid-cols-[1.2fr_0.8fr]"><AgendaCards items={core.upcomingAgenda.slice(0, 5)} onCreate={openBookingModal} locale={activeLocale} /><SectionCard eyebrow={copy.quickAction} title={copy.bookFaster} description={null} action={<button onClick={openBookingModal} className="inline-flex items-center gap-2 rounded-2xl bg-[var(--accent)] px-3.5 py-2 text-sm font-semibold text-[var(--accent-foreground)]"><Plus size={14} />{copy.createNow}</button>}><div className="grid gap-3"><div className="grid gap-3 sm:grid-cols-2"><div className="rounded-[16px] border border-[var(--border)] bg-[var(--surface-muted)] px-3.5 py-3"><p className="text-[10px] uppercase tracking-[0.12em] text-[var(--text-muted)]">{copy.tabs.agenda}</p><p className="mt-1 text-lg font-semibold text-[var(--text)]">{core.metrics.agendaToday}</p></div><div className="rounded-[16px] border border-[var(--border)] bg-[var(--surface-muted)] px-3.5 py-3"><p className="text-[10px] uppercase tracking-[0.12em] text-[var(--text-muted)]">{copy.tabs.clients}</p><p className="mt-1 text-lg font-semibold text-[var(--text)]">{core.metrics.clients}</p></div></div><p className="text-sm leading-5 text-[var(--text-muted)]">{copy.createNowHint}</p></div></SectionCard></div><div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">{metrics.map((metric) => <MetricCard key={metric.label} {...metric} />)}</div></> : null}
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
