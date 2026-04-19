"use client";

import { startTransition, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { CalendarDays, Check, ClipboardList, CreditCard, Dumbbell, Globe2, LayoutDashboard, LoaderCircle, LogOut, Plus, ShieldCheck, Sparkles, Users, X } from "lucide-react";
import { applyCoachLocale, getStoredCoachLocale, guessCoachLocale } from "../../src/lib/coach-locale";
import { getSupabaseBrowserClient, isSupabaseConfigured } from "../../src/lib/supabase-browser";
import AgendaWorkspace from "./AgendaWorkspace";
import ClientWorkspace from "./ClientWorkspace";

const APP_TABS = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "clients", label: "Clients", icon: Users },
  { id: "assessments", label: "Assessments", icon: ClipboardList },
  { id: "agenda", label: "Agenda", icon: CalendarDays },
  { id: "trainings", label: "Trainings", icon: Dumbbell },
  { id: "coach", label: "Coach", icon: ShieldCheck },
];

const DEFAULT_BOOKING_TYPES = [
  { name: "Treino 30min", category: "pt_session", duration_minutes: 30, price_eur: 0 },
  { name: "Treino 45min", category: "pt_session", duration_minutes: 45, price_eur: 0 },
  { name: "Treino 60min", category: "pt_session", duration_minutes: 60, price_eur: 0 },
  { name: "Avaliacao fisica", category: "physical_assessment", duration_minutes: 60, price_eur: 0 },
];

const EMPTY_CORE = { profile: null, subscription: null, metrics: { clients: 0, agendaToday: 0, assessments: 0, trainings: 0 }, upcomingAgenda: [] };
const EMPTY_LISTS = { students: [], recentAssessments: [], recentTrainings: [] };
const EMPTY_FORM = { studentId: "", bookingTypeId: "", scheduledDate: "", scheduledTime: "", notes: "" };
const LANGUAGE_OPTIONS = [
  { value: "en", label: "English", flag: "🇬🇧" },
  { value: "pt", label: "Português", flag: "🇵🇹" },
  { value: "es", label: "Español", flag: "🇪🇸" },
  { value: "fr", label: "Français", flag: "🇫🇷" },
];

function formatDate(value, withYear = false) {
  if (!value) return "Sem data";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Sem data";
  return date.toLocaleDateString("pt-PT", { day: "2-digit", month: "short", ...(withYear ? { year: "numeric" } : {}) });
}

function formatTime(value) {
  if (!value) return "--:--";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "--:--";
  return date.toLocaleTimeString("pt-PT", { hour: "2-digit", minute: "2-digit" });
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
  const response = await colorFallback((includeColor) => supabase.from("training_sessions").select(includeColor ? "id, name, status, session_date, students(full_name, client_color_hex)" : "id, name, status, session_date, students(full_name)").eq("coach_id", user.id).order("session_date", { ascending: false }).limit(12));
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
  return <section className="rounded-[32px] border border-[var(--border)] bg-[var(--surface-solid)] p-5 shadow-[var(--shadow-soft)] sm:p-6"><div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"><div><p className="text-sm uppercase tracking-[0.2em] text-[var(--accent)]">{eyebrow}</p><h2 className="mt-2 text-2xl font-semibold text-[var(--text)]">{title}</h2>{description ? <p className="mt-3 max-w-3xl leading-7 text-[var(--text-muted)]">{description}</p> : null}</div>{action}</div><div className="mt-6">{children}</div></section>;
}

function EmptyState({ title, text }) {
  return <div className="rounded-[24px] border border-dashed border-[var(--border)] bg-[var(--surface-muted)] px-5 py-8 text-center"><p className="text-lg font-semibold text-[var(--text)]">{title}</p><p className="mt-3 leading-7 text-[var(--text-muted)]">{text}</p></div>;
}

function MetricCard({ label, value, Icon, hint }) {
  return <div className="rounded-[28px] border border-[var(--border)] bg-[var(--surface-solid)] p-5 shadow-[var(--shadow-soft)]"><div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--accent)]/12"><Icon size={22} className="text-[var(--accent)]" /></div><p className="mt-6 text-sm uppercase tracking-[0.2em] text-[var(--text-muted)]">{label}</p><p className="mt-2 text-4xl font-semibold text-[var(--text)]">{value}</p><p className="mt-3 text-sm leading-6 text-[var(--text-muted)]">{hint}</p></div>;
}

function PersonRow({ name, detail, meta, colorHex }) {
  return <div className="flex items-center justify-between gap-4 rounded-[24px] border border-[var(--border)] bg-[var(--surface-muted)] px-4 py-4"><div className="flex min-w-0 items-center gap-3"><span className="h-3 w-3 shrink-0 rounded-full" style={{ background: colorDot(colorHex) }} /><div className="min-w-0"><p className="truncate font-medium text-[var(--text)]">{name || "Cliente"}</p><p className="truncate text-sm text-[var(--text-muted)]">{detail || "Sem detalhe"}</p></div></div>{meta ? <p className="shrink-0 text-sm text-[var(--text-muted)]">{meta}</p> : null}</div>;
}

function AgendaCards({ items, onCreate }) {
  return <SectionCard eyebrow="Agenda spotlight" title="Agenda do coach em destaque" description="A agenda ganha protagonismo real e já permite novas marcações." action={<button onClick={onCreate} className="inline-flex items-center gap-2 rounded-2xl bg-[var(--accent)] px-4 py-3 text-sm font-semibold text-[var(--accent-foreground)]"><Plus size={16} />Nova marcação</button>}>{items.length > 0 ? <div className="grid gap-4 xl:grid-cols-2">{items.map((item) => <div key={item.id} className="rounded-[26px] border border-[var(--border)] bg-[linear-gradient(180deg,rgba(255,255,255,0.96),rgba(246,248,247,0.96))] p-5"><div className="flex items-start justify-between gap-4"><div><p className="text-xs uppercase tracking-[0.18em] text-[var(--accent)]">{formatDate(item.scheduled_at, true)}</p><p className="mt-2 text-3xl font-semibold text-[var(--text)]">{formatTime(item.scheduled_at)}</p></div><span className="rounded-full border border-[var(--border)] bg-white px-3 py-1 text-xs uppercase tracking-[0.18em] text-[var(--text-muted)]">{prettifyStatus(item.status)}</span></div><div className="mt-6 flex items-center gap-3"><span className="h-3 w-3 rounded-full" style={{ background: colorDot(item.students?.client_color_hex) }} /><p className="font-semibold text-[var(--text)]">{item.students?.full_name || "Cliente"}</p></div><p className="mt-3 text-sm uppercase tracking-[0.16em] text-[var(--text-muted)]">{item.booking_types?.name || item.item_type || "Agenda item"}</p><p className="mt-3 leading-7 text-[var(--text-muted)]">{item.notes || "Sem notas adicionais para esta marcação."}</p></div>)}</div> : <EmptyState title="Sem marcações futuras" text="Cria a primeira marcação diretamente aqui no browser." />}</SectionCard>;
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
      applyCoachLocale(storedLocale);
      setLanguageOpen(false);
      setLanguageError("");
      return;
    }

    const suggestedLocale = guessCoachLocale();
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
      setBookingError(error?.message || "Could not prepare the booking.");
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

  async function handleSaveLanguage() {
    if (!currentUser || !configured) return;
    setSavingLanguage(true);
    setLanguageError("");

    try {
      const supabase = getSupabaseBrowserClient();
      const metadata = {
        ...(currentUser.user_metadata || {}),
        app_locale_code: preferredLanguage,
        locale_code: preferredLanguage,
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
      applyCoachLocale(preferredLanguage);
      setLanguageOpen(false);
    } catch (error) {
      setLanguageError(error?.message || "Could not save the language preference.");
    } finally {
      setSavingLanguage(false);
    }
  }

  async function handleCreateBooking(event) {
    event.preventDefault();
    setBookingError("");
    if (!currentUser) return;
    if (!bookingForm.studentId || !bookingForm.bookingTypeId || !bookingForm.scheduledDate || !bookingForm.scheduledTime) {
      setBookingError("Select client, booking type, date, and time.");
      return;
    }
    const bookingType = bookingResources.bookingTypes.find((item) => item.id === bookingForm.bookingTypeId);
    if (!bookingType) {
      setBookingError("Invalid booking type.");
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
      setBookingError(error?.message || "Could not create the booking.");
    } finally {
      setCreatingBooking(false);
    }
  }

  if (!configured) {
    return <main className="flex min-h-screen items-center justify-center bg-[var(--bg)] px-5 text-[var(--text)]"><div className="max-w-xl rounded-[32px] border border-amber-300 bg-amber-50 p-8 shadow-[var(--shadow-soft)]"><h1 className="text-2xl font-semibold">Supabase not configured</h1><p className="mt-4 leading-8 text-[var(--text-muted)]">Add the public Supabase variables to use the browser with live data.</p></div></main>;
  }

  if (checkingSession) {
    return <main className="flex min-h-screen items-center justify-center bg-[var(--bg)] text-[var(--text)]"><div className="inline-flex items-center gap-3 rounded-full border border-[var(--border)] bg-[var(--surface-solid)] px-5 py-3 shadow-[var(--shadow-soft)]"><LoaderCircle size={18} className="animate-spin text-[var(--accent)]" />Validating coach session...</div></main>;
  }

  const coachName = core.profile?.full_name || currentUser?.user_metadata?.full_name || currentUser?.email || "Coach";
  const metrics = [
    { label: "Active clients", value: core.metrics.clients, Icon: Users, hint: "Real clients connected to this coach." },
    { label: "Agenda today", value: core.metrics.agendaToday, Icon: CalendarDays, hint: "Bookings scheduled for today." },
    { label: "Assessments", value: core.metrics.assessments, Icon: ClipboardList, hint: "Assessments already stored." },
    { label: "Trainings", value: core.metrics.trainings, Icon: Dumbbell, hint: "Training sessions in history." },
  ];

  return (
    <>
      {languageOpen ? <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/35 px-4 py-6 backdrop-blur-sm"><div className="w-full max-w-2xl rounded-[32px] border border-[var(--border-strong)] bg-white p-6 shadow-[var(--shadow-panel)] sm:p-8"><div className="flex items-start gap-4"><div className="rounded-2xl border border-[var(--accent)]/20 bg-[linear-gradient(135deg,var(--accent-soft),rgba(124,77,255,0.08))] p-3 text-[var(--accent-strong)]"><Globe2 size={22} /></div><div><p className="text-sm uppercase tracking-[0.18em] text-[var(--accent)]">Language setup</p><h2 className="mt-2 text-3xl font-semibold text-[var(--text)]">Choose the language for your coach workspace</h2><p className="mt-3 leading-7 text-[var(--text-muted)]">We could not find a saved language from the app, so we pre-selected the most likely option based on your browser region. You can change it now and the choice will sync with your coach account.</p></div></div><div className="mt-6 grid gap-3 sm:grid-cols-2">{LANGUAGE_OPTIONS.map((option) => { const active = preferredLanguage === option.value; return <button key={option.value} onClick={() => setPreferredLanguage(option.value)} className={`flex items-center justify-between rounded-[24px] border px-4 py-4 text-left transition ${active ? "border-[var(--accent)] bg-[var(--accent-soft)]" : "border-[var(--border)] bg-[var(--surface-muted)] hover:bg-white"}`}><div className="flex items-center gap-3"><span className="text-2xl">{option.flag}</span><div><p className="font-semibold text-[var(--text)]">{option.label}</p><p className="text-sm text-[var(--text-muted)]">{option.value.toUpperCase()}</p></div></div>{active ? <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--accent)] text-[var(--accent-foreground)]"><Check size={16} /></span> : null}</button>; })}</div>{languageError ? <div className="mt-5 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">{languageError}</div> : null}<div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end"><button onClick={handleSaveLanguage} disabled={savingLanguage} className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[var(--accent)] px-5 py-3 font-semibold text-[var(--accent-foreground)] disabled:opacity-60">{savingLanguage ? <LoaderCircle size={16} className="animate-spin" /> : <Check size={16} />}Save language</button></div></div></div> : null}
      {bookingOpen ? <div className="fixed inset-0 z-40 flex items-center justify-center bg-slate-950/30 px-4 py-6 backdrop-blur-sm"><div className="w-full max-w-2xl rounded-[32px] border border-[var(--border-strong)] bg-white p-6 shadow-[var(--shadow-panel)]"><div className="flex items-start justify-between gap-4"><div><p className="text-sm uppercase tracking-[0.18em] text-[var(--accent)]">New booking</p><h2 className="mt-2 text-3xl font-semibold text-[var(--text)]">Schedule session in browser</h2><p className="mt-3 leading-7 text-[var(--text-muted)]">Create a booking directly for a client with the same agenda logic used in the APK.</p></div><button onClick={closeBookingModal} className="rounded-2xl border border-[var(--border)] bg-[var(--surface-muted)] p-3 text-[var(--text-muted)]"><X size={18} /></button></div>{loadingBookingResources ? <div className="mt-6 inline-flex items-center gap-3 rounded-full border border-[var(--border)] bg-[var(--surface-muted)] px-4 py-3 text-sm text-[var(--text-muted)]"><LoaderCircle size={16} className="animate-spin text-[var(--accent)]" />Loading clients and booking types...</div> : <form onSubmit={handleCreateBooking} className="mt-6 grid gap-4"><label className="grid gap-2"><span className="text-sm font-medium text-[var(--text)]">Client</span><select value={bookingForm.studentId} onChange={(event) => updateBookingField("studentId", event.target.value)} className="rounded-2xl border border-[var(--border)] bg-[var(--surface-muted)] px-4 py-3 text-[var(--text)] outline-none"><option value="">Select client</option>{bookingResources.students.map((student) => <option key={student.id} value={student.id}>{student.full_name}</option>)}</select></label><label className="grid gap-2"><span className="text-sm font-medium text-[var(--text)]">Booking type</span><select value={bookingForm.bookingTypeId} onChange={(event) => updateBookingField("bookingTypeId", event.target.value)} className="rounded-2xl border border-[var(--border)] bg-[var(--surface-muted)] px-4 py-3 text-[var(--text)] outline-none"><option value="">Select type</option>{bookingResources.bookingTypes.map((type) => <option key={type.id} value={type.id}>{type.name}</option>)}</select></label><div className="grid gap-4 sm:grid-cols-2"><label className="grid gap-2"><span className="text-sm font-medium text-[var(--text)]">Date</span><input type="date" value={bookingForm.scheduledDate} onChange={(event) => updateBookingField("scheduledDate", event.target.value)} className="rounded-2xl border border-[var(--border)] bg-[var(--surface-muted)] px-4 py-3 text-[var(--text)] outline-none" /></label><label className="grid gap-2"><span className="text-sm font-medium text-[var(--text)]">Time</span><input type="time" value={bookingForm.scheduledTime} onChange={(event) => updateBookingField("scheduledTime", event.target.value)} className="rounded-2xl border border-[var(--border)] bg-[var(--surface-muted)] px-4 py-3 text-[var(--text)] outline-none" /></label></div><label className="grid gap-2"><span className="text-sm font-medium text-[var(--text)]">Notes</span><textarea value={bookingForm.notes} onChange={(event) => updateBookingField("notes", event.target.value)} rows={4} className="rounded-2xl border border-[var(--border)] bg-[var(--surface-muted)] px-4 py-3 text-[var(--text)] outline-none" placeholder="Session details, coaching focus, context..." /></label>{bookingError ? <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">{bookingError}</div> : null}<div className="flex flex-col gap-3 sm:flex-row sm:justify-end"><button type="button" onClick={closeBookingModal} className="rounded-2xl border border-[var(--border)] bg-white px-5 py-3 font-medium text-[var(--text-muted)]">Cancel</button><button type="submit" disabled={creatingBooking} className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[var(--accent)] px-5 py-3 font-semibold text-[var(--accent-foreground)] disabled:opacity-60">{creatingBooking ? <LoaderCircle size={16} className="animate-spin" /> : <Plus size={16} />}Create booking</button></div></form>}</div></div> : null}

      <main className="min-h-screen bg-[var(--bg)] text-[var(--text)]">
        <div className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,rgba(42,208,125,0.12),transparent_24%),radial-gradient(circle_at_bottom_right,rgba(124,77,255,0.08),transparent_20%),linear-gradient(180deg,#fbfbfb_0%,#f5f5f5_48%,#f2f4f3_100%)]" />
        <div className="mx-auto grid min-h-screen max-w-[1600px] gap-6 px-4 py-4 lg:grid-cols-[280px_minmax(0,1fr)] lg:px-6">
          <aside className="rounded-[32px] border border-[var(--border-strong)] bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(245,245,245,0.95))] p-5 shadow-[var(--shadow-panel)]"><div className="flex items-center gap-3"><div className="rounded-2xl border border-[var(--border)] bg-[linear-gradient(135deg,var(--accent-soft),rgba(124,77,255,0.08))] p-2"><LayoutDashboard size={20} className="text-[var(--accent-strong)]" /></div><div><p className="text-sm font-semibold tracking-[0.18em] text-[var(--text)]">APEX COACH</p><p className="text-xs uppercase tracking-[0.22em] text-[var(--text-muted)]">web workspace</p></div></div><div className="mt-8 rounded-[24px] border border-[var(--border)] bg-[linear-gradient(135deg,var(--accent-soft),rgba(124,77,255,0.08))] p-4"><p className="text-xs uppercase tracking-[0.2em] text-[var(--accent-strong)]">Coach account</p><p className="mt-2 text-lg font-semibold text-[var(--text)]">{coachName}</p><p className="mt-2 text-sm leading-7 text-[var(--text-muted)]">Fast-loading workspace with the agenda ready to act on.</p></div><nav className="mt-8 grid gap-2">{APP_TABS.map(({ id, label, icon: Icon }) => { const active = activeTab === id; return <button key={id} onClick={() => startTransition(() => setActiveTab(id))} className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-left text-sm transition ${active ? "bg-[var(--accent)] text-[#081014] shadow-[0_18px_35px_rgba(42,208,125,0.2)]" : "border border-[var(--border)] bg-[var(--surface-solid)] text-[var(--text-muted)] hover:bg-[var(--surface-muted)]"}`}><Icon size={17} />{label}</button>; })}</nav><div className="mt-8 grid gap-3 rounded-[24px] border border-[var(--border)] bg-[var(--surface-muted)] p-4"><button onClick={openBookingModal} className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[var(--accent)] px-4 py-3 text-sm font-semibold text-[var(--accent-foreground)]"><Plus size={16} />New booking</button><Link href="/" className="rounded-2xl border border-[var(--border)] bg-white px-4 py-3 text-sm text-[var(--text-muted)]">Back to landing</Link><button onClick={handleSignOut} disabled={signingOut} className="inline-flex items-center justify-center gap-2 rounded-2xl border border-[var(--border)] bg-white px-4 py-3 text-sm text-[var(--text-muted)] disabled:opacity-60">{signingOut ? <LoaderCircle size={16} className="animate-spin" /> : <LogOut size={16} />}Sign out</button></div></aside>
          <section className="grid gap-6"><header className="rounded-[32px] border border-[var(--border-strong)] bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(245,245,245,0.95))] p-5 shadow-[var(--shadow-panel)] sm:p-6"><div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between"><div><p className="text-sm uppercase tracking-[0.2em] text-[var(--accent)]">Coach browser workspace</p><h1 className="mt-3 text-4xl font-semibold tracking-tight text-[var(--text)] sm:text-5xl">Agenda first. Faster, clearer, more practical.</h1><p className="mt-4 max-w-3xl text-lg leading-8 text-[var(--text-muted)]">The coach core loads first and the heavier tabs come in only when you need them.</p></div><div className="flex flex-col gap-3 sm:flex-row"><Link href="/login" className="inline-flex items-center justify-center rounded-2xl border border-[var(--border)] bg-white px-5 py-3 text-sm font-semibold text-[var(--text)]">Switch account</Link><button onClick={handleSignOut} disabled={signingOut} className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[var(--accent)] px-5 py-3 text-sm font-semibold text-[var(--accent-foreground)] disabled:opacity-60">{signingOut ? <LoaderCircle size={16} className="animate-spin" /> : <LogOut size={16} />}Sign out</button></div></div></header>{workspaceError ? <div className="rounded-[28px] border border-rose-200 bg-rose-50 px-5 py-4 text-rose-700 shadow-[var(--shadow-soft)]">{workspaceError}</div> : null}{loadingCore ? <div className="inline-flex items-center gap-3 rounded-full border border-[var(--border)] bg-[var(--surface-solid)] px-5 py-3 shadow-[var(--shadow-soft)]"><LoaderCircle size={18} className="animate-spin text-[var(--accent)]" />Loading coach core...</div> : null}<div className="flex gap-3 overflow-x-auto pb-1 lg:hidden">{APP_TABS.map(({ id, label }) => <button key={id} onClick={() => startTransition(() => setActiveTab(id))} className={`shrink-0 rounded-full border px-4 py-2 text-sm font-medium ${activeTab === id ? "border-[var(--accent)] bg-[var(--accent)] text-[var(--accent-foreground)]" : "border-[var(--border)] bg-white text-[var(--text-muted)]"}`}>{label}</button>)}</div>
          {activeTab === "dashboard" ? <><AgendaCards items={core.upcomingAgenda.slice(0, 6)} onCreate={openBookingModal} /><div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">{metrics.map((metric) => <MetricCard key={metric.label} {...metric} />)}</div><div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]"><SectionCard eyebrow="Coach pulse" title="Quick summary" description="The essentials for the coach without waiting for the heavier tabs."><div className="grid gap-4"><div className="rounded-[24px] border border-[var(--border)] bg-[var(--surface-muted)] p-5"><div className="flex items-center gap-3"><Sparkles size={18} className="text-[var(--accent)]" /><div><p className="font-medium text-[var(--text)]">Coach name</p><p className="text-sm text-[var(--text-muted)]">{coachName}</p></div></div></div><div className="rounded-[24px] border border-[var(--border)] bg-[var(--surface-muted)] p-5"><div className="flex items-center gap-3"><CreditCard size={18} className="text-[var(--accent)]" /><div><p className="font-medium text-[var(--text)]">Subscription</p><p className="text-sm text-[var(--text-muted)]">{prettifyStatus(core.subscription?.status || "trialing")}</p></div></div></div></div></SectionCard><SectionCard eyebrow="Quick action" title="Book faster" description="Open the booking flow and jump straight into the refreshed agenda." action={<button onClick={openBookingModal} className="inline-flex items-center gap-2 rounded-2xl bg-[var(--accent)] px-4 py-3 text-sm font-semibold text-[var(--accent-foreground)]"><Plus size={16} />Create now</button>}><p className="leading-7 text-[var(--text-muted)]">The goal is fewer clicks: open, choose a client, select the booking type, and lock it in.</p></SectionCard></div></> : null}
          {activeTab === "clients" ? <ClientWorkspace currentUser={currentUser} onOpenCreateBooking={openBookingModal} onOpenAssessments={openAssessmentsForStudent} onOpenTrainings={openTrainingsForStudent} /> : null}
          {activeTab === "assessments" ? <SectionCard eyebrow="Assessments" title="Avaliações recentes" description="Separador carregado apenas quando realmente entras nele.">{loadingTabs.assessments ? <div className="inline-flex items-center gap-3 rounded-full border border-[var(--border)] bg-[var(--surface-muted)] px-4 py-3 text-sm text-[var(--text-muted)]"><LoaderCircle size={16} className="animate-spin text-[var(--accent)]" />A carregar avaliações...</div> : lists.recentAssessments.length > 0 ? <div className="grid gap-4">{lists.recentAssessments.map((item) => <PersonRow key={item.id} name={item.students?.full_name} detail={`${Object.keys(item.fields || {}).length} métricas guardadas`} meta={formatDate(item.assessment_date, true)} colorHex={item.students?.client_color_hex} />)}</div> : <EmptyState title="Sem avaliações" text="Ainda não existem avaliações no histórico desta conta." />}</SectionCard> : null}
          {activeTab === "agenda" ? <AgendaWorkspace currentUser={currentUser} onOpenCreateBooking={openBookingModal} /> : null}
          {activeTab === "trainings" ? <SectionCard eyebrow="Trainings" title="Sessões de treino" description="O histórico de treinos entra só quando abres este separador.">{loadingTabs.trainings ? <div className="inline-flex items-center gap-3 rounded-full border border-[var(--border)] bg-[var(--surface-muted)] px-4 py-3 text-sm text-[var(--text-muted)]"><LoaderCircle size={16} className="animate-spin text-[var(--accent)]" />A carregar treinos...</div> : lists.recentTrainings.length > 0 ? <div className="grid gap-4">{lists.recentTrainings.map((item) => <PersonRow key={item.id} name={item.name || "Sessão sem título"} detail={item.students?.full_name || "Sem cliente associado"} meta={formatDate(item.session_date, true)} colorHex={item.students?.client_color_hex} />)}</div> : <EmptyState title="Sem treinos" text="Ainda não há sessões de treino registadas para esta conta." />}</SectionCard> : null}
          {activeTab === "coach" ? <div className="grid gap-6 xl:grid-cols-2"><SectionCard eyebrow="Coach hub" title="Conta do coach" description="O núcleo da conta continua acessível, mas sem atrasar o arranque do dashboard."><div className="grid gap-4"><div className="rounded-[24px] border border-[var(--border)] bg-[var(--surface-muted)] p-5"><p className="text-xs uppercase tracking-[0.18em] text-[var(--text-muted)]">Name</p><p className="mt-2 font-semibold text-[var(--text)]">{coachName}</p></div><div className="rounded-[24px] border border-[var(--border)] bg-[var(--surface-muted)] p-5"><p className="text-xs uppercase tracking-[0.18em] text-[var(--text-muted)]">Email</p><p className="mt-2 font-semibold text-[var(--text)]">{currentUser?.email || "Sem email"}</p></div></div></SectionCard><SectionCard eyebrow="Subscription" title="Estado da conta" description="Leitura rápida do plano e acesso do coach."><div className="grid gap-4"><div className="rounded-[24px] border border-[var(--border)] bg-[linear-gradient(135deg,var(--accent-soft),rgba(124,77,255,0.08))] p-5"><p className="text-xs uppercase tracking-[0.18em] text-[var(--accent)]">Plan status</p><p className="mt-2 text-2xl font-semibold text-[var(--text)]">{prettifyStatus(core.subscription?.status || "trialing")}</p><p className="mt-2 leading-7 text-[var(--text-muted)]">{(core.subscription?.subscription_category || "apex_coach").toString().replace(/_/g, " ")}{core.subscription?.payment_method_last4 ? ` · •••• ${core.subscription.payment_method_last4}` : ""}</p></div><button onClick={handleSignOut} disabled={signingOut} className="inline-flex items-center justify-center gap-2 rounded-2xl border border-[var(--border)] bg-white px-5 py-3 font-semibold text-[var(--text)] disabled:opacity-60">{signingOut ? <LoaderCircle size={16} className="animate-spin" /> : <LogOut size={16} />}Terminar sessão</button></div></SectionCard></div> : null}
          </section>
        </div>
      </main>
    </>
  );
}
