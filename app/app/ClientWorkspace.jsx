"use client";

import { useEffect, useMemo, useState } from "react";
import { CalendarPlus2, ChevronRight, ClipboardPlus, History, LoaderCircle, PencilLine, Search, Trash2, UserRound } from "lucide-react";

import { getSupabaseBrowserClient } from "../../src/lib/supabase-browser";

const COPY = {
  en: {
    noDate: "No date",
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
    selectClient: "Select a client to open a client page similar to the APK.",
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
  },
  pt: {
    noDate: "Sem data",
    loadingClients: "A carregar clientes...",
    clients: "Clientes",
    clientPage: "Pagina do cliente",
    age: "Idade",
    height: "Altura",
    id: "ID",
    addSession: "Adicionar sessao",
    addAssessment: "Adicionar avaliacao",
    trainingHistory: "Historico de treino",
    fullName: "Nome completo",
    email: "Email",
    heightCm: "Altura (cm)",
    mainGoal: "Objetivo principal",
    clinicalHistory: "Historial clinico",
    saveClient: "Guardar cliente",
    deleteClient: "Apagar cliente",
    studentHistory: "Historico do aluno",
    noHistory: "Ainda nao ha historico para este cliente.",
    selectClient: "Seleciona um cliente para abrir uma pagina semelhante a APK.",
    noGoal: "Sem objetivo ainda",
    deletePrompt: "Apagar",
    clientFallback: "Cliente",
    metricsSaved: "metricas guardadas",
    trainingSession: "Sessao de treino",
    booking: "Marcacao",
    agendaLabel: "Agenda",
    assessmentLabel: "Avaliacao",
    trainingLabel: "Treino",
    loadClientsError: "Nao foi possivel carregar os clientes.",
    saveClientError: "Nao foi possivel guardar o cliente.",
    deleteClientError: "Nao foi possivel apagar o cliente.",
    rosterTitle: "Carteira de clientes",
    searchClient: "Pesquisar cliente...",
    totalClients: "clientes totais",
    orderBy: "Ordem",
    orderName: "Nome",
    orderNumber: "Numero",
  },
  es: {
    noDate: "Sin fecha",
    loadingClients: "Cargando clientes...",
    clients: "Clientes",
    clientPage: "Pagina del cliente",
    age: "Edad",
    height: "Altura",
    id: "ID",
    addSession: "Anadir sesion",
    addAssessment: "Anadir evaluacion",
    trainingHistory: "Historial de entrenamiento",
    fullName: "Nombre completo",
    email: "Email",
    heightCm: "Altura (cm)",
    mainGoal: "Objetivo principal",
    clinicalHistory: "Historial clinico",
    saveClient: "Guardar cliente",
    deleteClient: "Eliminar cliente",
    studentHistory: "Historial del alumno",
    noHistory: "Todavia no hay historial para este cliente.",
    selectClient: "Selecciona un cliente para abrir una pagina similar a la APK.",
    noGoal: "Sin objetivo todavia",
    deletePrompt: "Eliminar",
    clientFallback: "Cliente",
    metricsSaved: "metricas guardadas",
    trainingSession: "Sesion de entrenamiento",
    booking: "Reserva",
    agendaLabel: "Agenda",
    assessmentLabel: "Evaluacion",
    trainingLabel: "Entrenamiento",
    loadClientsError: "No se pudieron cargar los clientes.",
    saveClientError: "No se pudo guardar el cliente.",
    deleteClientError: "No se pudo eliminar el cliente.",
    rosterTitle: "Cartera de clientes",
    searchClient: "Buscar cliente...",
    totalClients: "clientes totales",
    orderBy: "Orden",
    orderName: "Nombre",
    orderNumber: "Numero",
  },
  fr: {
    noDate: "Sans date",
    loadingClients: "Chargement des clients...",
    clients: "Clients",
    clientPage: "Page client",
    age: "Age",
    height: "Taille",
    id: "ID",
    addSession: "Ajouter une seance",
    addAssessment: "Ajouter une evaluation",
    trainingHistory: "Historique d entrainement",
    fullName: "Nom complet",
    email: "Email",
    heightCm: "Taille (cm)",
    mainGoal: "Objectif principal",
    clinicalHistory: "Historique clinique",
    saveClient: "Enregistrer le client",
    deleteClient: "Supprimer le client",
    studentHistory: "Historique de l eleve",
    noHistory: "Aucun historique pour ce client pour le moment.",
    selectClient: "Selectionne un client pour ouvrir une page proche de l APK.",
    noGoal: "Aucun objectif pour le moment",
    deletePrompt: "Supprimer",
    clientFallback: "Client",
    metricsSaved: "metriques enregistrees",
    trainingSession: "Seance d entrainement",
    booking: "Rendez-vous",
    agendaLabel: "Agenda",
    assessmentLabel: "Evaluation",
    trainingLabel: "Entrainement",
    loadClientsError: "Impossible de charger les clients.",
    saveClientError: "Impossible d enregistrer le client.",
    deleteClientError: "Impossible de supprimer le client.",
    rosterTitle: "Portefeuille clients",
    searchClient: "Rechercher un client...",
    totalClients: "clients au total",
    orderBy: "Ordre",
    orderName: "Nom",
    orderNumber: "Numero",
  },
};

function getCopy(locale) {
  return COPY[locale] || COPY.en;
}

function localeTag(locale) {
  if (locale === "pt") return "pt-PT";
  if (locale === "es") return "es-ES";
  if (locale === "fr") return "fr-FR";
  return "en-GB";
}

function calculateAge(value) {
  if (!value) return "-";
  const birth = new Date(value);
  if (Number.isNaN(birth.getTime())) return "-";
  const now = new Date();
  let age = now.getFullYear() - birth.getFullYear();
  const hadBirthday = now.getMonth() > birth.getMonth() || (now.getMonth() === birth.getMonth() && now.getDate() >= birth.getDate());
  if (!hadBirthday) age -= 1;
  return age;
}

function formatDate(value, locale) {
  if (!value) return getCopy(locale).noDate;
  return new Date(value).toLocaleDateString(localeTag(locale), { day: "2-digit", month: "short", year: "numeric" });
}

function normalizeStudents(rows) {
  return rows.map((row) => ({
    ...row,
    supabase_id: row.supabase_id || row.id,
    clientColor: row.client_color_hex || "#2ad07d",
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

function DetailChip({ label, value }) {
  return (
    <span className="rounded-full border border-[var(--border)] bg-[var(--surface-muted)] px-3 py-1 text-sm text-[var(--text-muted)]">
      {label}: {value}
    </span>
  );
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

function AvatarBadge({ student, size = 40, textSize = "text-xs" }) {
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

  const selectedStudent = useMemo(
    () => students.find((student) => student.id === selectedId) || null,
    [selectedId, students],
  );

  const filteredStudents = useMemo(() => {
    const query = search.trim().toLowerCase();
    const source = !query ? students : students.filter((student) =>
      [student.full_name, student.email, student.main_goal, student.legacy_id_pessoa]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(query)),
    );
    return sortStudents(source, orderBy);
  }, [orderBy, search, students]);

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
          .select("id, legacy_id_pessoa, full_name, birth_date, height_cm, email, main_goal, clinical_history, created_at, client_color_hex")
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

    async function loadHistory() {
      try {
        const [agendaResponse, assessmentsResponse, trainingsResponse] = await Promise.all([
          supabase
            .from("agenda_items")
            .select("id, item_type, notes, scheduled_at, status, booking_types(name)")
            .eq("coach_id", currentUser.id)
            .eq("student_id", selectedStudent.id)
            .order("scheduled_at", { ascending: false })
            .limit(5),
          supabase
            .from("assessments")
            .select("id, assessment_date, fields")
            .eq("coach_id", currentUser.id)
            .eq("student_id", selectedStudent.id)
            .order("assessment_date", { ascending: false })
            .limit(5),
          supabase
            .from("training_sessions")
            .select("id, name, notes, session_date, status")
            .eq("coach_id", currentUser.id)
            .eq("student_id", selectedStudent.id)
            .order("session_date", { ascending: false })
            .limit(5),
        ]);

        const failed = [agendaResponse, assessmentsResponse, trainingsResponse].find((item) => item.error);
        if (failed?.error) throw failed.error;

        const timeline = [
          ...normalizeHistory(agendaResponse.data ?? [], "agenda", copy),
          ...normalizeHistory(assessmentsResponse.data ?? [], "assessment", copy),
          ...normalizeHistory(trainingsResponse.data ?? [], "training", copy),
        ].sort((a, b) => new Date(b.occurredAt).getTime() - new Date(a.occurredAt).getTime());

        if (!mounted) return;
        setHistory(timeline);
      } catch {
        if (!mounted) return;
        setHistory([]);
      }
    }

    loadHistory();
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
    } catch (deleteError) {
      setError(deleteError?.message || copy.deleteClientError);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="grid gap-4 xl:grid-cols-[300px_minmax(0,1fr)]">
      <section className="rounded-[24px] border border-[var(--border)] bg-[var(--surface-solid)] p-3.5 shadow-[var(--shadow-soft)] xl:sticky xl:top-4 xl:h-fit">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-[11px] uppercase tracking-[0.18em] text-[var(--accent)]">{copy.clients}</p>
            <h2 className="mt-1 text-lg font-semibold text-[var(--text)]">{copy.rosterTitle}</h2>
          </div>
          <span className="rounded-full border border-[var(--border)] bg-white px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-[var(--text-muted)]">
            {students.length} {copy.totalClients}
          </span>
        </div>

        <div className="mt-3 flex items-center gap-3 rounded-[18px] border border-[var(--border)] bg-[var(--surface-muted)] px-3.5 py-2.5">
          <Search size={16} className="text-[var(--text-muted)]" />
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder={copy.searchClient}
            className="w-full bg-transparent text-sm text-[var(--text)] outline-none placeholder:text-[var(--text-muted)]"
          />
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

        <div className="mt-4 grid gap-2">
          {filteredStudents.map((student) => (
            <button
              key={student.id}
              onClick={() => setSelectedId(student.id)}
              className={`rounded-[16px] border px-3 py-2.5 text-left transition ${selectedId === student.id ? "border-[var(--accent)] bg-[linear-gradient(135deg,var(--accent-soft),rgba(124,77,255,0.08))]" : "border-[var(--border)] bg-[var(--surface-muted)] hover:bg-white"}`}
            >
              <div className="flex items-center gap-3">
                <AvatarBadge student={student} size={40} textSize="text-[11px]" />
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="truncate font-medium text-[var(--text)]">{student.full_name || copy.clientFallback}</p>
                      <p className="mt-1 truncate text-sm text-[var(--text-muted)]">{student.main_goal || student.email || copy.noGoal}</p>
                    </div>
                    <ChevronRight size={16} className="shrink-0 text-[var(--text-muted)]" />
                  </div>
                  <div className="mt-2 flex flex-wrap items-center gap-2">
                    <span className="inline-flex items-center gap-1 rounded-full border border-[var(--border)] bg-white px-2.5 py-1 text-[11px] text-[var(--text-muted)]"><span className="h-2 w-2 rounded-full" style={{ background: student.clientColor }} />{calculateAge(student.birth_date)} y</span>
                    <span className="inline-flex items-center rounded-full border border-[var(--border)] bg-white px-2.5 py-1 text-[11px] text-[var(--text-muted)]">{student.height_cm || "-"} cm</span>
                    <span
                      className="rounded-full px-2.5 py-1 text-[11px] font-semibold"
                      style={{ background: `${student.clientColor}20`, color: student.clientColor, border: `1px solid ${student.clientColor}33` }}
                    >
                      #{String(student.legacy_id_pessoa || student.id).slice(0, 6)}
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
          <>
            <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
              <div>
                <p className="text-[11px] uppercase tracking-[0.18em] text-[var(--accent)]">{copy.clientPage}</p>
                <div className="mt-2 flex items-center gap-3">
                  <AvatarBadge student={selectedStudent} size={52} textSize="text-sm" />
                  <div>
                    <h2 className="text-xl font-semibold text-[var(--text)]">{selectedStudent.full_name}</h2>
                    <p className="mt-1 text-sm text-[var(--text-muted)]">{selectedStudent.main_goal || selectedStudent.email || copy.noGoal}</p>
                  </div>
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  <DetailChip label={copy.age} value={calculateAge(selectedStudent.birth_date)} />
                  <DetailChip label={copy.height} value={`${selectedStudent.height_cm || "-"} cm`} />
                  <DetailChip label={copy.id} value={selectedStudent.legacy_id_pessoa || selectedStudent.id} />
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

            <div className="mt-6 grid gap-4">
              <div className="grid gap-3">
                <label className="grid gap-2">
                  <span className="text-sm text-[var(--text-muted)]">{copy.fullName}</span>
                  <input value={form.full_name} onChange={(event) => setForm((current) => ({ ...current, full_name: event.target.value }))} className="rounded-2xl border border-[var(--border)] bg-[var(--surface-muted)] px-3.5 py-2.5" />
                </label>
                <label className="grid gap-2">
                  <span className="text-sm text-[var(--text-muted)]">{copy.email}</span>
                  <input value={form.email} onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))} className="rounded-2xl border border-[var(--border)] bg-[var(--surface-muted)] px-3.5 py-2.5" />
                </label>
                <div className="grid gap-3 sm:grid-cols-2">
                  <label className="grid gap-2">
                    <span className="text-sm text-[var(--text-muted)]">{copy.heightCm}</span>
                    <input value={form.height_cm} onChange={(event) => setForm((current) => ({ ...current, height_cm: event.target.value }))} className="rounded-2xl border border-[var(--border)] bg-[var(--surface-muted)] px-3.5 py-2.5" />
                  </label>
                  <label className="grid gap-2">
                    <span className="text-sm text-[var(--text-muted)]">{copy.mainGoal}</span>
                    <input value={form.main_goal} onChange={(event) => setForm((current) => ({ ...current, main_goal: event.target.value }))} className="rounded-2xl border border-[var(--border)] bg-[var(--surface-muted)] px-3.5 py-2.5" />
                  </label>
                </div>
                <label className="grid gap-2">
                  <span className="text-sm text-[var(--text-muted)]">{copy.clinicalHistory}</span>
                  <textarea rows={4} value={form.clinical_history} onChange={(event) => setForm((current) => ({ ...current, clinical_history: event.target.value }))} className="rounded-2xl border border-[var(--border)] bg-[var(--surface-muted)] px-3.5 py-2.5" />
                </label>

                <div className="flex flex-wrap gap-3">
                  <button onClick={saveClient} disabled={saving} className="inline-flex items-center gap-2 rounded-2xl bg-[var(--accent)] px-4 py-2.5 font-semibold text-[var(--accent-foreground)]">
                    {saving ? <LoaderCircle size={16} className="animate-spin" /> : <PencilLine size={16} />}
                    {copy.saveClient}
                  </button>
                  <button onClick={deleteClient} disabled={saving} className="inline-flex items-center gap-2 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-2.5 font-semibold text-rose-700">
                    <Trash2 size={16} />
                    {copy.deleteClient}
                  </button>
                </div>
              </div>

              <div className="rounded-[20px] border border-[var(--border)] bg-[var(--surface-muted)] p-4">
                <div className="flex items-center gap-3">
                  <History size={18} className="text-[var(--accent)]" />
                  <h3 className="text-base font-semibold text-[var(--text)]">{copy.studentHistory}</h3>
                </div>
                <div className="mt-4 grid gap-2.5">
                  {history.length > 0 ? (
                    history.map((item) => (
                      <div key={item.id} className="rounded-2xl border border-[var(--border)] bg-white px-3.5 py-3">
                        <p className="text-[10px] uppercase tracking-[0.14em] text-[var(--text-muted)]">{item.type === "agenda" ? copy.agendaLabel : item.type === "assessment" ? copy.assessmentLabel : copy.trainingLabel}</p>
                        <p className="mt-1.5 font-semibold text-[var(--text)]">{item.title}</p>
                        {item.detail ? <p className="mt-1.5 text-sm text-[var(--text-muted)]">{item.detail}</p> : null}
                        <p className="mt-2 text-xs text-[var(--text-muted)]">{formatDate(item.occurredAt, locale)}</p>
                      </div>
                    ))
                  ) : (
                    <div className="rounded-2xl border border-dashed border-[var(--border)] bg-white px-4 py-8 text-center text-[var(--text-muted)]">
                      {copy.noHistory}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="rounded-2xl border border-dashed border-[var(--border)] bg-[var(--surface-muted)] px-4 py-8 text-center text-[var(--text-muted)]">
            {copy.selectClient}
          </div>
        )}
      </section>
    </div>
  );
}
