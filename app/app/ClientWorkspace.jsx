"use client";

import { useEffect, useMemo, useState } from "react";
import { CalendarPlus2, ClipboardPlus, History, LoaderCircle, PencilLine, Trash2, UserRound } from "lucide-react";

import { getSupabaseBrowserClient } from "../../src/lib/supabase-browser";

const COPY = {
  en: {
    noDate: "No date",
    loadingClients: "Loading clients...",
    clients: "Clients",
    clientList: "Client list",
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
  },
  pt: {
    noDate: "Sem data",
    loadingClients: "A carregar clientes...",
    clients: "Clientes",
    clientList: "Lista de clientes",
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
    selectClient: "Seleciona um cliente para abrir uma página semelhante à APK.",
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
  },
  es: {
    noDate: "Sin fecha",
    loadingClients: "Cargando clientes...",
    clients: "Clientes",
    clientList: "Lista de clientes",
    clientPage: "Página del cliente",
    age: "Edad",
    height: "Altura",
    id: "ID",
    addSession: "Añadir sesión",
    addAssessment: "Añadir evaluación",
    trainingHistory: "Historial de entrenamiento",
    fullName: "Nombre completo",
    email: "Email",
    heightCm: "Altura (cm)",
    mainGoal: "Objetivo principal",
    clinicalHistory: "Historial clínico",
    saveClient: "Guardar cliente",
    deleteClient: "Eliminar cliente",
    studentHistory: "Historial del alumno",
    noHistory: "Todavía no hay historial para este cliente.",
    selectClient: "Selecciona un cliente para abrir una página similar a la APK.",
    noGoal: "Sin objetivo todavía",
    deletePrompt: "Eliminar",
    clientFallback: "Cliente",
    metricsSaved: "métricas guardadas",
    trainingSession: "Sesión de entrenamiento",
    booking: "Reserva",
    agendaLabel: "Agenda",
    assessmentLabel: "Evaluación",
    trainingLabel: "Entrenamiento",
    loadClientsError: "No se pudieron cargar los clientes.",
    saveClientError: "No se pudo guardar el cliente.",
    deleteClientError: "No se pudo eliminar el cliente.",
  },
  fr: {
    noDate: "Sans date",
    loadingClients: "Chargement des clients...",
    clients: "Clients",
    clientList: "Liste des clients",
    clientPage: "Page client",
    age: "Âge",
    height: "Taille",
    id: "ID",
    addSession: "Ajouter une séance",
    addAssessment: "Ajouter une évaluation",
    trainingHistory: "Historique d'entraînement",
    fullName: "Nom complet",
    email: "Email",
    heightCm: "Taille (cm)",
    mainGoal: "Objectif principal",
    clinicalHistory: "Historique clinique",
    saveClient: "Enregistrer le client",
    deleteClient: "Supprimer le client",
    studentHistory: "Historique de l'élève",
    noHistory: "Aucun historique pour ce client pour le moment.",
    selectClient: "Sélectionne un client pour ouvrir une page proche de l'APK.",
    noGoal: "Aucun objectif pour le moment",
    deletePrompt: "Supprimer",
    clientFallback: "Client",
    metricsSaved: "métriques enregistrées",
    trainingSession: "Séance d'entraînement",
    booking: "Rendez-vous",
    agendaLabel: "Agenda",
    assessmentLabel: "Évaluation",
    trainingLabel: "Entraînement",
    loadClientsError: "Impossible de charger les clients.",
    saveClientError: "Impossible d'enregistrer le client.",
    deleteClientError: "Impossible de supprimer le client.",
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
    clientColor: row.client_color_hex || "#2ad07d",
  }));
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

export default function ClientWorkspace({ currentUser, onOpenCreateBooking, onOpenAssessments, onOpenTrainings, locale = "en" }) {
  const copy = getCopy(locale);
  const [students, setStudents] = useState([]);
  const [selectedId, setSelectedId] = useState("");
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState(null);

  const selectedStudent = useMemo(
    () => students.find((student) => student.id === selectedId) || null,
    [selectedId, students],
  );

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
  }, [currentUser]);

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
    <div className="grid gap-6 xl:grid-cols-[0.8fr_1.2fr]">
      <section className="rounded-[32px] border border-[var(--border)] bg-[var(--surface-solid)] p-5 shadow-[var(--shadow-soft)] sm:p-6">
        <p className="text-sm uppercase tracking-[0.2em] text-[var(--accent)]">{copy.clients}</p>
        <h2 className="mt-2 text-2xl font-semibold text-[var(--text)]">{copy.clientList}</h2>

        {loading ? <div className="mt-6 inline-flex items-center gap-3 rounded-full border border-[var(--border)] bg-[var(--surface-muted)] px-4 py-3 text-sm text-[var(--text-muted)]"><LoaderCircle size={16} className="animate-spin text-[var(--accent)]" />{copy.loadingClients}</div> : null}
        {error ? <div className="mt-6 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</div> : null}

        <div className="mt-6 grid gap-3">
          {students.map((student) => (
            <button
              key={student.id}
              onClick={() => setSelectedId(student.id)}
              className={`rounded-[24px] border px-4 py-4 text-left ${selectedId === student.id ? "border-[var(--accent)] bg-[var(--accent-soft)]" : "border-[var(--border)] bg-[var(--surface-muted)]"}`}
            >
              <div className="flex items-center gap-3">
                <span className="h-3 w-3 rounded-full" style={{ background: student.clientColor }} />
                <div>
                  <p className="font-medium text-[var(--text)]">{student.full_name || copy.clientFallback}</p>
                  <p className="text-sm text-[var(--text-muted)]">{student.main_goal || student.email || copy.noGoal}</p>
                </div>
              </div>
            </button>
          ))}
        </div>
      </section>

      <section className="rounded-[32px] border border-[var(--border)] bg-[var(--surface-solid)] p-5 shadow-[var(--shadow-soft)] sm:p-6">
        {selectedStudent && form ? (
          <>
            <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
              <div>
                <p className="text-sm uppercase tracking-[0.2em] text-[var(--accent)]">{copy.clientPage}</p>
                <h2 className="mt-2 text-3xl font-semibold text-[var(--text)]">{selectedStudent.full_name}</h2>
                <div className="mt-4 flex flex-wrap gap-3">
                  <span className="rounded-full border border-[var(--border)] bg-[var(--surface-muted)] px-3 py-1 text-sm text-[var(--text-muted)]">{copy.age}: {calculateAge(selectedStudent.birth_date)}</span>
                  <span className="rounded-full border border-[var(--border)] bg-[var(--surface-muted)] px-3 py-1 text-sm text-[var(--text-muted)]">{copy.height}: {selectedStudent.height_cm || "-"} cm</span>
                  <span className="rounded-full border border-[var(--border)] bg-[var(--surface-muted)] px-3 py-1 text-sm text-[var(--text-muted)]">{copy.id}: {selectedStudent.legacy_id_pessoa || selectedStudent.id}</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-3">
                <button onClick={() => onOpenCreateBooking(selectedStudent.id)} className="inline-flex items-center gap-2 rounded-2xl bg-[var(--accent)] px-4 py-3 text-sm font-semibold text-[var(--accent-foreground)]">
                  <CalendarPlus2 size={16} />
                  {copy.addSession}
                </button>
                <button onClick={() => onOpenAssessments(selectedStudent.id)} className="inline-flex items-center gap-2 rounded-2xl border border-[var(--border)] bg-white px-4 py-3 text-sm font-semibold text-[var(--text)]">
                  <ClipboardPlus size={16} />
                  {copy.addAssessment}
                </button>
                <button onClick={() => onOpenTrainings(selectedStudent.id)} className="inline-flex items-center gap-2 rounded-2xl border border-[var(--border)] bg-white px-4 py-3 text-sm font-semibold text-[var(--text)]">
                  <UserRound size={16} />
                  {copy.trainingHistory}
                </button>
              </div>
            </div>

            <div className="mt-8 grid gap-6 xl:grid-cols-[1fr_0.95fr]">
              <div className="grid gap-4">
                <label className="grid gap-2">
                  <span className="text-sm text-[var(--text-muted)]">{copy.fullName}</span>
                  <input value={form.full_name} onChange={(event) => setForm((current) => ({ ...current, full_name: event.target.value }))} className="rounded-2xl border border-[var(--border)] bg-[var(--surface-muted)] px-4 py-3" />
                </label>
                <label className="grid gap-2">
                  <span className="text-sm text-[var(--text-muted)]">{copy.email}</span>
                  <input value={form.email} onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))} className="rounded-2xl border border-[var(--border)] bg-[var(--surface-muted)] px-4 py-3" />
                </label>
                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="grid gap-2">
                    <span className="text-sm text-[var(--text-muted)]">{copy.heightCm}</span>
                    <input value={form.height_cm} onChange={(event) => setForm((current) => ({ ...current, height_cm: event.target.value }))} className="rounded-2xl border border-[var(--border)] bg-[var(--surface-muted)] px-4 py-3" />
                  </label>
                  <label className="grid gap-2">
                    <span className="text-sm text-[var(--text-muted)]">{copy.mainGoal}</span>
                    <input value={form.main_goal} onChange={(event) => setForm((current) => ({ ...current, main_goal: event.target.value }))} className="rounded-2xl border border-[var(--border)] bg-[var(--surface-muted)] px-4 py-3" />
                  </label>
                </div>
                <label className="grid gap-2">
                  <span className="text-sm text-[var(--text-muted)]">{copy.clinicalHistory}</span>
                  <textarea rows={5} value={form.clinical_history} onChange={(event) => setForm((current) => ({ ...current, clinical_history: event.target.value }))} className="rounded-2xl border border-[var(--border)] bg-[var(--surface-muted)] px-4 py-3" />
                </label>

                <div className="flex flex-wrap gap-3">
                  <button onClick={saveClient} disabled={saving} className="inline-flex items-center gap-2 rounded-2xl bg-[var(--accent)] px-5 py-3 font-semibold text-[var(--accent-foreground)]">
                    {saving ? <LoaderCircle size={16} className="animate-spin" /> : <PencilLine size={16} />}
                    {copy.saveClient}
                  </button>
                  <button onClick={deleteClient} disabled={saving} className="inline-flex items-center gap-2 rounded-2xl border border-rose-200 bg-rose-50 px-5 py-3 font-semibold text-rose-700">
                    <Trash2 size={16} />
                    {copy.deleteClient}
                  </button>
                </div>
              </div>

              <div className="rounded-[28px] border border-[var(--border)] bg-[var(--surface-muted)] p-5">
                <div className="flex items-center gap-3">
                  <History size={18} className="text-[var(--accent)]" />
                  <h3 className="text-xl font-semibold text-[var(--text)]">{copy.studentHistory}</h3>
                </div>
                <div className="mt-5 grid gap-3">
                  {history.length > 0 ? (
                    history.map((item) => (
                      <div key={item.id} className="rounded-2xl border border-[var(--border)] bg-white px-4 py-4">
                        <p className="text-xs uppercase tracking-[0.16em] text-[var(--text-muted)]">{item.type === "agenda" ? copy.agendaLabel : item.type === "assessment" ? copy.assessmentLabel : copy.trainingLabel}</p>
                        <p className="mt-2 font-semibold text-[var(--text)]">{item.title}</p>
                        {item.detail ? <p className="mt-2 text-sm text-[var(--text-muted)]">{item.detail}</p> : null}
                        <p className="mt-3 text-sm text-[var(--text-muted)]">{formatDate(item.occurredAt, locale)}</p>
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
