"use client";

import { useEffect, useMemo, useState } from "react";
import { CalendarPlus2, ChevronRight, ClipboardPlus, CreditCard, Dumbbell, History, LoaderCircle, PencilLine, Search, ShieldCheck, Trash2, UserRound } from "lucide-react";

import { getSupabaseBrowserClient } from "../../src/lib/supabase-browser";

const COPY = {
  en: {
    noDate: "No date",
    noDetail: "No detail",
    loadingClients: "Loading clients...",
    clients: "Clients",
    clientPage: "Client page",
    age: "Age",
    height: "Height",
    id: "ID",
    addSession: "Add session",
    addAssessment: "Add assessment",
    trainingHistory: "Training history",
    fullName: "Full name",
    email: "Email",
    heightCm: "Height (cm)",
    mainGoal: "Main goal",
    clinicalHistory: "Clinical history",
    saveClient: "Save client",
    deleteClient: "Delete client",
    studentHistory: "Student history",
    noHistory: "No history yet for this client.",
    selectClient: "Select a client to open the full workspace.",
    noGoal: "No goal yet",
    deletePrompt: "Delete",
    clientFallback: "Client",
    metricsSaved: "metrics saved",
    trainingSession: "Training session",
    booking: "Booking",
    agendaLabel: "Agenda",
    assessmentLabel: "Assessment",
    trainingLabel: "Training",
    loadClientsError: "Could not load clients.",
    saveClientError: "Could not save client.",
    deleteClientError: "Could not delete client.",
    rosterTitle: "Client roster",
    searchClient: "Search client...",
    totalClients: "total clients",
    orderBy: "Order",
    orderName: "Name",
    orderNumber: "Number",
    rosterSummary: "Roster summary",
    men: "Men",
    women: "Women",
    between2030: "20 to 30",
    details: "Details",
    recentSessions: "Recent sessions",
    recentAssessments: "Recent assessments",
    payments: "Payments",
    activePlan: "Active plan",
    activeProtocol: "Active protocol",
    noPlan: "No active plan",
    noProtocol: "No active protocol",
    noPayments: "No billing setup",
    noAssessmentsYet: "No assessments yet",
    noSessionsYet: "No sessions yet",
    status: "Status",
    cycle: "Cycle",
    amount: "Amount",
    dueDate: "Due date",
    objective: "Objective",
    sessionsPerWeek: "Sessions / week",
    packSessions: "Pack sessions",
    currentWeek: "Current week",
    weeksRemaining: "Weeks left",
    updateClient: "Update client",
    activeClientSnapshot: "Active client snapshot",
    activeClientSnapshotText: "Keep the roster compact and open the full detail only when you need it.",
  },
  pt: {
    noDate: "Sem data",
    noDetail: "Sem detalhe",
    loadingClients: "A carregar clientes...",
    clients: "Clientes",
    clientPage: "Página do cliente",
    age: "Idade",
    height: "Altura",
    id: "ID",
    addSession: "Adicionar sessão",
    addAssessment: "Adicionar avaliação",
    trainingHistory: "Histórico de treino",
    fullName: "Nome completo",
    email: "Email",
    heightCm: "Altura (cm)",
    mainGoal: "Objetivo principal",
    clinicalHistory: "Historial clínico",
    saveClient: "Guardar cliente",
    deleteClient: "Apagar cliente",
    studentHistory: "Histórico do aluno",
    noHistory: "Ainda não há histórico para este cliente.",
    selectClient: "Seleciona um cliente para abrir o workspace completo.",
    noGoal: "Sem objetivo ainda",
    deletePrompt: "Apagar",
    clientFallback: "Cliente",
    metricsSaved: "métricas guardadas",
    trainingSession: "Sessão de treino",
    booking: "Marcação",
    agendaLabel: "Agenda",
    assessmentLabel: "Avaliação",
    trainingLabel: "Treino",
    loadClientsError: "Não foi possível carregar os clientes.",
    saveClientError: "Não foi possível guardar o cliente.",
    deleteClientError: "Não foi possível apagar o cliente.",
    rosterTitle: "Carteira de clientes",
    searchClient: "Pesquisar cliente...",
    totalClients: "clientes totais",
    orderBy: "Ordem",
    orderName: "Nome",
    orderNumber: "Número",
    rosterSummary: "Resumo da carteira",
    men: "Homens",
    women: "Mulheres",
    between2030: "20 aos 30",
    details: "Detalhes",
    recentSessions: "Sessões recentes",
    recentAssessments: "Avaliações recentes",
    payments: "Pagamentos",
    activePlan: "Plano ativo",
    activeProtocol: "Protocolo ativo",
    noPlan: "Sem plano ativo",
    noProtocol: "Sem protocolo ativo",
    noPayments: "Sem configuração de cobrança",
    noAssessmentsYet: "Sem avaliações",
    noSessionsYet: "Sem sessões",
    status: "Estado",
    cycle: "Ciclo",
    amount: "Valor",
    dueDate: "Próximo vencimento",
    objective: "Objetivo",
    sessionsPerWeek: "Sessões / semana",
    packSessions: "Sessões do pack",
    currentWeek: "Semana atual",
    weeksRemaining: "Semanas restantes",
    updateClient: "Atualizar cliente",
    activeClientSnapshot: "Snapshot do cliente",
    activeClientSnapshotText: "Mantém a lista compacta e abre o detalhe completo só quando precisas.",
  },
};

function getCopy(locale) {
  return COPY[locale] || COPY.en;
}

function localeTag(locale) {
  if (locale === "pt") return "pt-PT";
  return "en-GB";
}

function calculateAge(value) {
  if (!value) return null;
  const birth = new Date(value);
  if (Number.isNaN(birth.getTime())) return null;
  const now = new Date();
  let age = now.getFullYear() - birth.getFullYear();
  const hadBirthday = now.getMonth() > birth.getMonth() || (now.getMonth() === birth.getMonth() && now.getDate() >= birth.getDate());
  if (!hadBirthday) age -= 1;
  return age;
}

function formatDate(value, locale) {
  if (!value) return getCopy(locale).noDate;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return getCopy(locale).noDate;
  return date.toLocaleDateString(localeTag(locale), { day: "2-digit", month: "short", year: "numeric" });
}

function formatCurrency(amount, currencyCode = "EUR", locale = "en") {
  try {
    return new Intl.NumberFormat(localeTag(locale), { style: "currency", currency: currencyCode || "EUR", maximumFractionDigits: 0 }).format(amount || 0);
  } catch {
    return `${amount || 0} ${currencyCode || "EUR"}`;
  }
}

function normalizeStudents(rows) {
  return rows.map((row) => ({
    ...row,
    supabase_id: row.id,
    clientColor: row.client_color_hex || "#2ad07d",
    age: calculateAge(row.birth_date),
  }));
}

function sortStudents(rows, orderBy) {
  const nextRows = [...rows];
  if (orderBy === "number") {
    nextRows.sort((a, b) => String(a.legacy_id_pessoa || a.id).localeCompare(String(b.legacy_id_pessoa || b.id), undefined, { numeric: true, sensitivity: "base" }));
    return nextRows;
  }
  nextRows.sort((a, b) => String(a.full_name || "").localeCompare(String(b.full_name || ""), undefined, { sensitivity: "base" }));
  return nextRows;
}

function initialsFromName(value, fallback = "C") {
  const parts = String(value ?? "").trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return fallback;
  if (parts.length === 1) return parts[0].slice(0, 1).toUpperCase();
  return `${parts[0].slice(0, 1)}${parts[parts.length - 1].slice(0, 1)}`.toUpperCase();
}

function normalizeHistory(items, type, copy) {
  return items.map((item) => {
    let occurredAt = item.assessment_date || item.session_date || item.scheduled_at || item.created_at;
    if (type === "assessment") occurredAt = item.assessment_date;
    if (type === "training") occurredAt = item.session_date;
    if (type === "agenda") occurredAt = item.scheduled_at;

    return {
      id: `${type}-${item.id}`,
      type,
      title:
        type === "assessment"
          ? `${Object.keys(item.fields || {}).length} ${copy.metricsSaved}`
          : type === "training"
            ? item.name || copy.trainingSession
            : item.booking_types?.name || item.item_type || copy.booking,
      detail: item.notes || item.status || "",
      occurredAt,
    };
  });
}

function AvatarBadge({ student, size = 38, textSize = "text-[11px]" }) {
  const [avatarUrl, setAvatarUrl] = useState("");

  useEffect(() => {
    let mounted = true;
    const supabaseId = String(student?.supabase_id || "").trim();
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
  }, [student?.supabase_id]);

  if (avatarUrl) {
    return <img src={avatarUrl} alt={student?.full_name || "Client"} className="shrink-0 rounded-2xl object-cover" style={{ width: size, height: size }} />;
  }

  return (
    <div
      className={`flex shrink-0 items-center justify-center rounded-2xl font-semibold text-[var(--text)] ${textSize}`}
      style={{ width: size, height: size, background: `${student?.clientColor || "#2ad07d"}24`, border: `1px solid ${student?.clientColor || "#2ad07d"}44` }}
    >
      {initialsFromName(student?.full_name, "C")}
    </div>
  );
}

function StatPill({ label, value }) {
  return (
    <div className="rounded-[16px] border border-[var(--border)] bg-white px-3 py-2">
      <p className="text-[10px] uppercase tracking-[0.14em] text-[var(--text-muted)]">{label}</p>
      <p className="mt-1 text-sm font-semibold text-[var(--text)]">{value}</p>
    </div>
  );
}

function MiniSection({ icon: Icon, title, children }) {
  return (
    <section className="rounded-[20px] border border-[var(--border)] bg-[var(--surface-muted)] p-3.5">
      <div className="flex items-center gap-2.5">
        <span className="flex h-8 w-8 items-center justify-center rounded-2xl bg-white text-[var(--accent)]">
          <Icon size={15} />
        </span>
        <h3 className="text-sm font-semibold text-[var(--text)]">{title}</h3>
      </div>
      <div className="mt-3">{children}</div>
    </section>
  );
}

function EmptyInline({ text }) {
  return <div className="rounded-[16px] border border-dashed border-[var(--border)] bg-white px-4 py-5 text-sm text-[var(--text-muted)]">{text}</div>;
}

export default function ClientWorkspace({ currentUser, onOpenCreateBooking, onOpenAssessments, onOpenTrainings, locale = "en" }) {
  const copy = getCopy(locale);
  const [students, setStudents] = useState([]);
  const [selectedId, setSelectedId] = useState("");
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState(null);
  const [search, setSearch] = useState("");
  const [orderBy, setOrderBy] = useState("name");
  const [billingProfile, setBillingProfile] = useState(null);
  const [trainingPlan, setTrainingPlan] = useState(null);
  const [activeProtocol, setActiveProtocol] = useState(null);
  const [recentAssessments, setRecentAssessments] = useState([]);
  const [recentSessions, setRecentSessions] = useState([]);

  const selectedStudent = useMemo(() => students.find((student) => student.id === selectedId) || null, [selectedId, students]);

  const filteredStudents = useMemo(() => {
    const query = search.trim().toLowerCase();
    const source = !query
      ? students
      : students.filter((student) => [student.full_name, student.email, student.main_goal, student.legacy_id_pessoa].filter(Boolean).some((value) => String(value).toLowerCase().includes(query)));
    return sortStudents(source, orderBy);
  }, [orderBy, search, students]);

  const rosterStats = useMemo(() => {
    const total = students.length;
    const men = students.filter((student) => String(student.sex || "").toLowerCase().startsWith("m")).length;
    const women = students.filter((student) => String(student.sex || "").toLowerCase().startsWith("f")).length;
    const between2030 = students.filter((student) => typeof student.age === "number" && student.age >= 20 && student.age <= 30).length;
    return { total, men, women, between2030 };
  }, [students]);

  useEffect(() => {
    if (!currentUser) return;
    const supabase = getSupabaseBrowserClient();
    let mounted = true;

    async function loadStudents() {
      setLoading(true);
      setError("");

      try {
        const response = await supabase
          .from("students")
          .select("id, legacy_id_pessoa, full_name, birth_date, sex, height_cm, email, main_goal, clinical_history, created_at, client_color_hex")
          .eq("coach_id", currentUser.id)
          .order("full_name", { ascending: true });

        if (response.error) throw response.error;
        if (!mounted) return;

        const nextStudents = normalizeStudents(response.data ?? []);
        setStudents(nextStudents);
        setSelectedId((current) => current || nextStudents[0]?.id || "");
      } catch (loadError) {
        if (!mounted) return;
        setError(loadError?.message || copy.loadClientsError);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    loadStudents();
    return () => {
      mounted = false;
    };
  }, [copy.loadClientsError, currentUser]);

  useEffect(() => {
    if (!selectedStudent || !currentUser) return;
    const supabase = getSupabaseBrowserClient();
    let mounted = true;

    setForm({
      full_name: selectedStudent.full_name || "",
      email: selectedStudent.email || "",
      height_cm: selectedStudent.height_cm || "",
      main_goal: selectedStudent.main_goal || "",
      clinical_history: selectedStudent.clinical_history || "",
    });

    async function loadDetail() {
      try {
        const [agendaResponse, assessmentsResponse, trainingsResponse, billingResponse, planResponse] = await Promise.all([
          supabase.from("agenda_items").select("id, item_type, notes, scheduled_at, status, booking_types(name)").eq("coach_id", currentUser.id).eq("student_id", selectedStudent.id).order("scheduled_at", { ascending: false }).limit(5),
          supabase.from("assessments").select("id, assessment_date, fields").eq("coach_id", currentUser.id).eq("student_id", selectedStudent.id).order("assessment_date", { ascending: false }).limit(4),
          supabase
            .from("training_sessions")
            .select("id, name, notes, session_date, status, protocol_label, protocol_objective, protocol_current_week, protocol_weeks_remaining, protocol_weeks_planned")
            .eq("coach_id", currentUser.id)
            .eq("student_id", selectedStudent.id)
            .order("session_date", { ascending: false })
            .limit(4),
          supabase.from("client_billing_profiles").select("student_id, status, billing_cycle, amount_cents, currency_code, next_due_at").eq("student_id", selectedStudent.id).maybeSingle(),
          supabase.from("client_training_plans").select("student_id, plan_mode, sessions_per_week, pack_sessions_count, updated_at").eq("student_id", selectedStudent.id).maybeSingle(),
        ]);

        const failed = [agendaResponse, assessmentsResponse, trainingsResponse, billingResponse, planResponse].find((item) => item.error && !String(item.error.message || "").toLowerCase().includes("does not exist") && !String(item.error.message || "").toLowerCase().includes("42p01"));
        if (failed?.error) throw failed.error;

        const timeline = [
          ...normalizeHistory(agendaResponse.data ?? [], "agenda", copy),
          ...normalizeHistory(assessmentsResponse.data ?? [], "assessment", copy),
          ...normalizeHistory(trainingsResponse.data ?? [], "training", copy),
        ].sort((a, b) => new Date(b.occurredAt).getTime() - new Date(a.occurredAt).getTime());

        const protocolSource = (trainingsResponse.data ?? []).find((item) => item.protocol_label || item.protocol_objective) || null;

        if (!mounted) return;
        setHistory(timeline);
        setRecentAssessments(assessmentsResponse.data ?? []);
        setRecentSessions(trainingsResponse.data ?? []);
        setBillingProfile(billingResponse.data ?? null);
        setTrainingPlan(planResponse.data ?? null);
        setActiveProtocol(protocolSource);
      } catch {
        if (!mounted) return;
        setHistory([]);
        setRecentAssessments([]);
        setRecentSessions([]);
        setBillingProfile(null);
        setTrainingPlan(null);
        setActiveProtocol(null);
      }
    }

    loadDetail();
    return () => {
      mounted = false;
    };
  }, [copy, currentUser, selectedStudent]);

  async function saveClient() {
    if (!selectedStudent || !form) return;
    setSaving(true);
    setError("");

    try {
      const supabase = getSupabaseBrowserClient();
      const response = await supabase
        .from("students")
        .update({
          full_name: form.full_name.trim(),
          email: form.email.trim(),
          height_cm: Number(form.height_cm) || null,
          main_goal: form.main_goal.trim(),
          clinical_history: form.clinical_history.trim(),
        })
        .eq("id", selectedStudent.id)
        .eq("coach_id", currentUser.id);

      if (response.error) throw response.error;

      setStudents((current) =>
        current.map((student) =>
          student.id === selectedStudent.id
            ? {
                ...student,
                full_name: form.full_name.trim(),
                email: form.email.trim(),
                height_cm: Number(form.height_cm) || null,
                main_goal: form.main_goal.trim(),
                clinical_history: form.clinical_history.trim(),
              }
            : student,
        ),
      );
    } catch (saveError) {
      setError(saveError?.message || copy.saveClientError);
    } finally {
      setSaving(false);
    }
  }

  async function deleteClient() {
    if (!selectedStudent || !window.confirm(`${copy.deletePrompt} ${selectedStudent.full_name}?`)) return;
    setSaving(true);
    setError("");

    try {
      const supabase = getSupabaseBrowserClient();
      const response = await supabase.from("students").delete().eq("id", selectedStudent.id).eq("coach_id", currentUser.id);
      if (response.error) throw response.error;

      setStudents((current) => current.filter((student) => student.id !== selectedStudent.id));
      setSelectedId("");
      setHistory([]);
      setBillingProfile(null);
      setTrainingPlan(null);
      setActiveProtocol(null);
    } catch (deleteError) {
      setError(deleteError?.message || copy.deleteClientError);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="grid gap-4 xl:grid-cols-[320px_minmax(0,1fr)]">
      <section className="rounded-[24px] border border-[var(--border)] bg-[var(--surface-solid)] p-3.5 shadow-[var(--shadow-soft)] xl:sticky xl:top-4 xl:h-[calc(100vh-2rem)] xl:overflow-hidden">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-[11px] uppercase tracking-[0.18em] text-[var(--accent)]">{copy.clients}</p>
            <h2 className="mt-1 text-lg font-semibold text-[var(--text)]">{copy.rosterTitle}</h2>
          </div>
          <span className="rounded-full border border-[var(--border)] bg-white px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-[var(--text-muted)]">
            {students.length} {copy.totalClients}
          </span>
        </div>

        <div className="mt-3 rounded-[18px] border border-[var(--border)] bg-[linear-gradient(135deg,var(--accent-soft),rgba(124,77,255,0.06))] p-3">
          <p className="text-[10px] uppercase tracking-[0.14em] text-[var(--accent)]">{copy.rosterSummary}</p>
          <div className="mt-3 grid gap-2 sm:grid-cols-2 xl:grid-cols-2">
            <StatPill label={copy.totalClients} value={rosterStats.total} />
            <StatPill label={copy.men} value={rosterStats.men} />
            <StatPill label={copy.women} value={rosterStats.women} />
            <StatPill label={copy.between2030} value={rosterStats.between2030} />
          </div>
        </div>

        <div className="mt-3 flex items-center gap-3 rounded-[18px] border border-[var(--border)] bg-[var(--surface-muted)] px-3.5 py-2.5">
          <Search size={16} className="text-[var(--text-muted)]" />
          <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder={copy.searchClient} className="w-full bg-transparent text-sm text-[var(--text)] outline-none placeholder:text-[var(--text-muted)]" />
        </div>

        <div className="mt-2.5 flex items-center justify-between gap-3 rounded-[16px] border border-[var(--border)] bg-white px-3 py-2">
          <span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[var(--text-muted)]">{copy.orderBy}</span>
          <div className="inline-flex rounded-full border border-[var(--border)] bg-[var(--surface-muted)] p-1">
            <button onClick={() => setOrderBy("name")} className={`rounded-full px-3 py-1.5 text-xs font-medium ${orderBy === "name" ? "bg-[var(--accent)] text-[var(--accent-foreground)]" : "text-[var(--text-muted)]"}`}>{copy.orderName}</button>
            <button onClick={() => setOrderBy("number")} className={`rounded-full px-3 py-1.5 text-xs font-medium ${orderBy === "number" ? "bg-[var(--accent)] text-[var(--accent-foreground)]" : "text-[var(--text-muted)]"}`}>{copy.orderNumber}</button>
          </div>
        </div>

        {loading ? <div className="mt-4 inline-flex items-center gap-3 rounded-full border border-[var(--border)] bg-[var(--surface-muted)] px-4 py-3 text-sm text-[var(--text-muted)]"><LoaderCircle size={16} className="animate-spin text-[var(--accent)]" />{copy.loadingClients}</div> : null}
        {error ? <div className="mt-4 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</div> : null}

        <div className="mt-4 grid gap-2 overflow-y-auto xl:max-h-[calc(100vh-24rem)] xl:pr-1">
          {filteredStudents.map((student) => (
            <button
              key={student.id}
              onClick={() => setSelectedId(student.id)}
              className={`rounded-[16px] border px-3 py-2 text-left transition ${selectedId === student.id ? "border-[var(--accent)] bg-[linear-gradient(135deg,var(--accent-soft),rgba(124,77,255,0.06))]" : "border-[var(--border)] bg-white hover:bg-[var(--surface-muted)]"}`}
            >
              <div className="flex items-center gap-3">
                <AvatarBadge student={student} size={38} textSize="text-[11px]" />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-3">
                    <p className="truncate text-[15px] font-semibold text-[var(--text)]">{student.full_name || copy.clientFallback}</p>
                    <ChevronRight size={14} className="shrink-0 text-[var(--text-muted)]" />
                  </div>
                  <p className="mt-0.5 truncate text-[13px] text-[var(--text-muted)]">{student.main_goal || student.email || copy.noGoal}</p>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    <span className="rounded-full border border-[var(--border)] bg-[var(--surface-muted)] px-2 py-0.5 text-[11px] text-[var(--text-muted)]">{student.age ?? "-"} y</span>
                    <span className="rounded-full border border-[var(--border)] bg-[var(--surface-muted)] px-2 py-0.5 text-[11px] text-[var(--text-muted)]">{student.height_cm || "-"} cm</span>
                    <span className="rounded-full px-2 py-0.5 text-[11px] font-semibold" style={{ background: `${student.clientColor}20`, color: student.clientColor, border: `1px solid ${student.clientColor}33` }}>
                      #{student.legacy_id_pessoa || student.id}
                    </span>
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>
      </section>

      <section className="rounded-[24px] border border-[var(--border)] bg-[var(--surface-solid)] p-3.5 shadow-[var(--shadow-soft)] sm:p-4">
        {selectedStudent && form ? (
          <div className="grid gap-4">
            <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
              <div>
                <p className="text-[11px] uppercase tracking-[0.18em] text-[var(--accent)]">{copy.activeClientSnapshot}</p>
                <h2 className="mt-1 text-xl font-semibold text-[var(--text)]">{selectedStudent.full_name}</h2>
                <p className="mt-1 text-sm text-[var(--text-muted)]">{copy.activeClientSnapshotText}</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <StatPill label={copy.age} value={selectedStudent.age ?? "-"} />
                  <StatPill label={copy.height} value={`${selectedStudent.height_cm || "-"} cm`} />
                  <StatPill label={copy.id} value={selectedStudent.legacy_id_pessoa || selectedStudent.id} />
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                <button onClick={() => onOpenCreateBooking(selectedStudent.id)} className="inline-flex items-center gap-2 rounded-2xl bg-[var(--accent)] px-3.5 py-2.5 text-sm font-semibold text-[var(--accent-foreground)]">
                  <CalendarPlus2 size={16} />
                  {copy.addSession}
                </button>
                <button onClick={() => onOpenAssessments(selectedStudent.id)} className="inline-flex items-center gap-2 rounded-2xl border border-[var(--border)] bg-white px-3.5 py-2.5 text-sm font-semibold text-[var(--text)]">
                  <ClipboardPlus size={16} />
                  {copy.addAssessment}
                </button>
                <button onClick={() => onOpenTrainings(selectedStudent.id)} className="inline-flex items-center gap-2 rounded-2xl border border-[var(--border)] bg-white px-3.5 py-2.5 text-sm font-semibold text-[var(--text)]">
                  <UserRound size={16} />
                  {copy.trainingHistory}
                </button>
              </div>
            </div>

            <div className="grid gap-4 xl:grid-cols-[0.95fr_1.05fr]">
              <div className="grid gap-4">
                <MiniSection icon={UserRound} title={copy.details}>
                  <div className="grid gap-3">
                    <label className="grid gap-2">
                      <span className="text-sm text-[var(--text-muted)]">{copy.fullName}</span>
                      <input value={form.full_name} onChange={(event) => setForm((current) => ({ ...current, full_name: event.target.value }))} className="rounded-2xl border border-[var(--border)] bg-white px-3.5 py-2.5" />
                    </label>
                    <label className="grid gap-2">
                      <span className="text-sm text-[var(--text-muted)]">{copy.email}</span>
                      <input value={form.email} onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))} className="rounded-2xl border border-[var(--border)] bg-white px-3.5 py-2.5" />
                    </label>
                    <div className="grid gap-3 sm:grid-cols-2">
                      <label className="grid gap-2">
                        <span className="text-sm text-[var(--text-muted)]">{copy.heightCm}</span>
                        <input value={form.height_cm} onChange={(event) => setForm((current) => ({ ...current, height_cm: event.target.value }))} className="rounded-2xl border border-[var(--border)] bg-white px-3.5 py-2.5" />
                      </label>
                      <label className="grid gap-2">
                        <span className="text-sm text-[var(--text-muted)]">{copy.mainGoal}</span>
                        <input value={form.main_goal} onChange={(event) => setForm((current) => ({ ...current, main_goal: event.target.value }))} className="rounded-2xl border border-[var(--border)] bg-white px-3.5 py-2.5" />
                      </label>
                    </div>
                    <label className="grid gap-2">
                      <span className="text-sm text-[var(--text-muted)]">{copy.clinicalHistory}</span>
                      <textarea rows={4} value={form.clinical_history} onChange={(event) => setForm((current) => ({ ...current, clinical_history: event.target.value }))} className="rounded-2xl border border-[var(--border)] bg-white px-3.5 py-2.5" />
                    </label>
                    <div className="flex flex-wrap gap-3">
                      <button onClick={saveClient} disabled={saving} className="inline-flex items-center gap-2 rounded-2xl bg-[var(--accent)] px-4 py-2.5 font-semibold text-[var(--accent-foreground)]">
                        {saving ? <LoaderCircle size={16} className="animate-spin" /> : <PencilLine size={16} />}
                        {copy.updateClient}
                      </button>
                      <button onClick={deleteClient} disabled={saving} className="inline-flex items-center gap-2 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-2.5 font-semibold text-rose-700">
                        <Trash2 size={16} />
                        {copy.deleteClient}
                      </button>
                    </div>
                  </div>
                </MiniSection>

                <MiniSection icon={CreditCard} title={copy.payments}>
                  {billingProfile ? (
                    <div className="grid gap-2 sm:grid-cols-2">
                      <StatPill label={copy.status} value={billingProfile.status || "-"} />
                      <StatPill label={copy.cycle} value={billingProfile.billing_cycle || "-"} />
                      <StatPill label={copy.amount} value={formatCurrency((billingProfile.amount_cents || 0) / 100, billingProfile.currency_code, locale)} />
                      <StatPill label={copy.dueDate} value={formatDate(billingProfile.next_due_at, locale)} />
                    </div>
                  ) : (
                    <EmptyInline text={copy.noPayments} />
                  )}
                </MiniSection>

                <MiniSection icon={ShieldCheck} title={copy.activePlan}>
                  {trainingPlan ? (
                    <div className="grid gap-2 sm:grid-cols-2">
                      <StatPill label={copy.status} value={trainingPlan.plan_mode || "-"} />
                      <StatPill label={copy.sessionsPerWeek} value={trainingPlan.sessions_per_week || "-"} />
                      <StatPill label={copy.packSessions} value={trainingPlan.pack_sessions_count || "-"} />
                      <StatPill label={copy.noDate} value={formatDate(trainingPlan.updated_at, locale)} />
                    </div>
                  ) : (
                    <EmptyInline text={copy.noPlan} />
                  )}
                </MiniSection>

                <MiniSection icon={Dumbbell} title={copy.activeProtocol}>
                  {activeProtocol ? (
                    <div className="grid gap-2 sm:grid-cols-2">
                      <StatPill label={copy.activeProtocol} value={activeProtocol.protocol_label || copy.noProtocol} />
                      <StatPill label={copy.currentWeek} value={activeProtocol.protocol_current_week || "-"} />
                      <StatPill label={copy.weeksRemaining} value={activeProtocol.protocol_weeks_remaining || "-"} />
                      <StatPill label={copy.status} value={activeProtocol.protocol_weeks_planned || "-"} />
                      <div className="sm:col-span-2 rounded-[16px] border border-[var(--border)] bg-white px-3 py-2.5">
                        <p className="text-[10px] uppercase tracking-[0.14em] text-[var(--text-muted)]">{copy.objective}</p>
                        <p className="mt-1 text-sm text-[var(--text)]">{activeProtocol.protocol_objective || copy.noProtocol}</p>
                      </div>
                    </div>
                  ) : (
                    <EmptyInline text={copy.noProtocol} />
                  )}
                </MiniSection>
              </div>

              <div className="grid gap-4">
                <MiniSection icon={Dumbbell} title={copy.recentSessions}>
                  {recentSessions.length > 0 ? (
                    <div className="grid gap-2">
                      {recentSessions.map((item) => (
                        <div key={item.id} className="rounded-[16px] border border-[var(--border)] bg-white px-3.5 py-3">
                          <div className="flex items-center justify-between gap-3">
                            <p className="font-semibold text-[var(--text)]">{item.name || copy.trainingSession}</p>
                            <span className="text-xs text-[var(--text-muted)]">{formatDate(item.session_date, locale)}</span>
                          </div>
                          <p className="mt-1 text-sm text-[var(--text-muted)]">{item.protocol_label || item.notes || item.status || copy.noDetail}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <EmptyInline text={copy.noSessionsYet} />
                  )}
                </MiniSection>

                <MiniSection icon={ClipboardPlus} title={copy.recentAssessments}>
                  {recentAssessments.length > 0 ? (
                    <div className="grid gap-2">
                      {recentAssessments.map((item) => (
                        <div key={item.id} className="rounded-[16px] border border-[var(--border)] bg-white px-3.5 py-3">
                          <div className="flex items-center justify-between gap-3">
                            <p className="font-semibold text-[var(--text)]">{Object.keys(item.fields || {}).length} {copy.metricsSaved}</p>
                            <span className="text-xs text-[var(--text-muted)]">{formatDate(item.assessment_date, locale)}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <EmptyInline text={copy.noAssessmentsYet} />
                  )}
                </MiniSection>

                <MiniSection icon={History} title={copy.studentHistory}>
                  {history.length > 0 ? (
                    <div className="grid gap-2">
                      {history.map((item) => (
                        <div key={item.id} className="rounded-[16px] border border-[var(--border)] bg-white px-3.5 py-3">
                          <div className="flex items-center justify-between gap-3">
                            <p className="text-[10px] uppercase tracking-[0.14em] text-[var(--text-muted)]">
                              {item.type === "agenda" ? copy.agendaLabel : item.type === "assessment" ? copy.assessmentLabel : copy.trainingLabel}
                            </p>
                            <span className="text-xs text-[var(--text-muted)]">{formatDate(item.occurredAt, locale)}</span>
                          </div>
                          <p className="mt-1 font-semibold text-[var(--text)]">{item.title}</p>
                          {item.detail ? <p className="mt-1 text-sm text-[var(--text-muted)]">{item.detail}</p> : null}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <EmptyInline text={copy.noHistory} />
                  )}
                </MiniSection>
              </div>
            </div>
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-[var(--border)] bg-[var(--surface-muted)] px-4 py-8 text-center text-[var(--text-muted)]">
            {copy.selectClient}
          </div>
        )}
      </section>
    </div>
  );
}
