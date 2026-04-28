"use client";

import { Check, Dumbbell, LoaderCircle, Plus, Search, Trash2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import { getSupabaseBrowserClient } from "../../src/lib/supabase-browser";

function localeTag(locale) {
  if (locale === "pt") return "pt-PT";
  if (locale === "es") return "es-ES";
  if (locale === "fr") return "fr-FR";
  return "en-GB";
}

function formatDate(value, locale = "en") {
  return new Date(value).toLocaleDateString(localeTag(locale), { day: "2-digit", month: "short", year: "numeric" });
}

function normalizeExerciseRows(rows) {
  return (rows || []).map((row) => ({
    id: row.id,
    exercise_id: row.exercise_id,
    exercise_name: row.exercise_name || "Exercise",
    order_index: row.order_index || 0,
    sets: row.sets || 0,
    reps_text: row.reps_text || "",
    load_text: row.load_text || "",
    rest_seconds: row.rest_seconds || 0,
    notes: row.notes || "",
  })).sort((a, b) => a.order_index - b.order_index);
}

function normalizeTemplateGroups(rows) {
  const groups = new Map();
  for (const raw of rows || []) {
    const key = String(raw.series_id || raw.id);
    const existing = groups.get(key) || [];
    existing.push(raw);
    groups.set(key, existing);
  }

  return [...groups.entries()].map(([groupKey, groupRows]) => {
    const ordered = [...groupRows].sort((a, b) => new Date(a.scheduled_at).getTime() - new Date(b.scheduled_at).getTime());
    const future = ordered.find((row) => new Date(row.scheduled_at).getTime() >= Date.now()) || ordered[ordered.length - 1];
    const firstTraining = Array.isArray(ordered[0]?.training_sessions) ? ordered[0].training_sessions[0] : null;
    const activeTraining = Array.isArray(future?.training_sessions) ? future.training_sessions[0] : null;
    const linked = activeTraining || firstTraining;

    return {
      id: linked?.id || `template-${groupKey}`,
      builderSessionId: linked?.id || null,
      name: linked?.name || "Template",
      notes: linked?.notes || future?.notes || "",
      status: linked?.status || future?.status || "scheduled",
      session_date: linked?.session_date || future?.scheduled_at,
      students: future?.students || null,
      isTemplate: true,
      templateCount: ordered.length,
      templateSeriesId: groupKey,
    };
  }).sort((a, b) => new Date(b.session_date).getTime() - new Date(a.session_date).getTime());
}

export default function TrainingBuilderWorkspace({ items, loading, copy, locale = "en", currentUser, onItemsChange }) {
  const [boardTab, setBoardTab] = useState("sessions");
  const [selectedId, setSelectedId] = useState("");
  const [sessionDraft, setSessionDraft] = useState({ name: "", notes: "" });
  const [exercises, setExercises] = useState([]);
  const [exerciseLibrary, setExerciseLibrary] = useState([]);
  const [exerciseQuery, setExerciseQuery] = useState("");
  const [templates, setTemplates] = useState([]);
  const [templatesLoading, setTemplatesLoading] = useState(false);
  const [loadingSession, setLoadingSession] = useState(false);
  const [saving, setSaving] = useState(false);

  const ui = useMemo(() => ({
    sessions: locale === "pt" ? "Sessoes" : locale === "es" ? "Sesiones" : locale === "fr" ? "Seances" : "Sessions",
    templates: locale === "pt" ? "Templates" : locale === "es" ? "Templates" : locale === "fr" ? "Templates" : "Templates",
    searchExercise: locale === "pt" ? "Pesquisar exercicio..." : locale === "es" ? "Buscar ejercicio..." : locale === "fr" ? "Rechercher un exercice..." : "Search exercise...",
    builderTitle: locale === "pt" ? "Builder da sessao" : locale === "es" ? "Builder de sesion" : locale === "fr" ? "Builder de seance" : "Session builder",
    loadingBuilder: locale === "pt" ? "A carregar builder..." : locale === "es" ? "Cargando builder..." : locale === "fr" ? "Chargement du builder..." : "Loading builder...",
    emptyBuilder: locale === "pt" ? "Adiciona exercicios para montar esta sessao." : locale === "es" ? "Anade ejercicios para montar esta sesion." : locale === "fr" ? "Ajoute des exercices pour construire cette seance." : "Add exercises to build this session.",
    noTemplates: locale === "pt" ? "Sem templates criados." : locale === "es" ? "Sin templates creados." : locale === "fr" ? "Aucun template cree." : "No templates created.",
    templateSeries: locale === "pt" ? "Blocos" : locale === "es" ? "Bloques" : locale === "fr" ? "Blocs" : "Blocks",
    sets: locale === "pt" ? "Series" : locale === "es" ? "Series" : locale === "fr" ? "Series" : "Sets",
    reps: "Reps",
    load: locale === "pt" ? "Carga" : locale === "es" ? "Carga" : locale === "fr" ? "Charge" : "Load",
    rest: locale === "pt" ? "Desc." : locale === "es" ? "Desc." : locale === "fr" ? "Repos" : "Rest",
  }), [locale]);

  const visibleItems = boardTab === "templates" ? templates : items;
  const selectedItem = useMemo(() => visibleItems.find((item) => item.id === selectedId) || visibleItems[0] || null, [visibleItems, selectedId]);
  const activeSessionId = selectedItem?.builderSessionId || selectedItem?.id || null;

  useEffect(() => {
    const source = visibleItems;
    if (!source.length) {
      setSelectedId("");
      setSessionDraft({ name: "", notes: "" });
      return;
    }
    const nextSelected = source.some((item) => item.id === selectedId) ? source.find((item) => item.id === selectedId) : source[0];
    setSelectedId(nextSelected.id);
    setSessionDraft({ name: nextSelected.name || "", notes: nextSelected.notes || "" });
  }, [visibleItems, selectedId]);

  useEffect(() => {
    if (!currentUser) return;
    const supabase = getSupabaseBrowserClient();
    let mounted = true;

    async function loadTemplates() {
      setTemplatesLoading(true);
      try {
        const response = await supabase
          .from("agenda_items")
          .select("id, series_id, notes, scheduled_at, status, students(full_name, client_color_hex), training_sessions(id, name, notes, status, session_date)")
          .eq("coach_id", currentUser.id)
          .eq("item_type", "prescribed_training")
          .order("scheduled_at", { ascending: false });

        if (response.error) throw response.error;
        if (!mounted) return;
        setTemplates(normalizeTemplateGroups(response.data || []));
      } finally {
        if (mounted) setTemplatesLoading(false);
      }
    }

    loadTemplates();
    return () => {
      mounted = false;
    };
  }, [currentUser]);

  useEffect(() => {
    if (!activeSessionId || !currentUser) {
      setExercises([]);
      return;
    }
    const supabase = getSupabaseBrowserClient();
    let mounted = true;

    async function loadSessionExercises() {
      setLoadingSession(true);
      try {
        const [sessionResponse, libraryResponse] = await Promise.all([
          supabase
            .from("training_session_exercises")
            .select("id, exercise_id, exercise_name, order_index, sets, reps_text, load_text, rest_seconds, notes")
            .eq("session_id", activeSessionId)
            .order("order_index", { ascending: true }),
          supabase
            .from("exercise_library")
            .select("id, name_en, name_pt")
            .or(`coach_id.is.null,coach_id.eq.${currentUser.id}`)
            .order("name_en", { ascending: true })
            .limit(80),
        ]);

        if (sessionResponse.error) throw sessionResponse.error;
        if (libraryResponse.error) throw libraryResponse.error;
        if (!mounted) return;

        setExercises(normalizeExerciseRows(sessionResponse.data));
        setExerciseLibrary((libraryResponse.data || []).map((item) => ({
          id: item.id,
          label: locale === "pt" ? item.name_pt || item.name_en : item.name_en || item.name_pt,
        })));
      } finally {
        if (mounted) setLoadingSession(false);
      }
    }

    loadSessionExercises();
    return () => {
      mounted = false;
    };
  }, [activeSessionId, currentUser, locale]);

  const filteredLibrary = useMemo(() => {
    const query = exerciseQuery.trim().toLowerCase();
    if (!query) return exerciseLibrary.slice(0, 10);
    return exerciseLibrary.filter((item) => item.label.toLowerCase().includes(query)).slice(0, 10);
  }, [exerciseLibrary, exerciseQuery]);

  function updateExerciseField(id, field, value) {
    setExercises((current) => current.map((item) => (item.id === id ? { ...item, [field]: value } : item)));
  }

  function removeExercise(id) {
    setExercises((current) => current.filter((item) => item.id !== id).map((item, index) => ({ ...item, order_index: index })));
  }

  function addExercise(item) {
    setExercises((current) => [
      ...current,
      {
        id: `draft-${Date.now()}-${item.id}`,
        exercise_id: item.id,
        exercise_name: item.label,
        order_index: current.length,
        sets: 3,
        reps_text: "10",
        load_text: "",
        rest_seconds: 60,
        notes: "",
      },
    ]);
    setExerciseQuery("");
  }

  async function saveSessionBuilder() {
    if (!activeSessionId || !currentUser) return;
    setSaving(true);
    try {
      const supabase = getSupabaseBrowserClient();
      const nextSession = {
        name: sessionDraft.name.trim(),
        notes: sessionDraft.notes.trim(),
      };

      const updateSessionResponse = await supabase
        .from("training_sessions")
        .update(nextSession)
        .eq("id", activeSessionId)
        .eq("coach_id", currentUser.id);

      if (updateSessionResponse.error) throw updateSessionResponse.error;

      const deleteResponse = await supabase
        .from("training_session_exercises")
        .delete()
        .eq("session_id", activeSessionId);

      if (deleteResponse.error) throw deleteResponse.error;

      if (exercises.length > 0) {
        const insertResponse = await supabase
          .from("training_session_exercises")
          .insert(
            exercises.map((exercise, index) => ({
              session_id: activeSessionId,
              exercise_id: exercise.exercise_id || null,
              exercise_name: exercise.exercise_name,
              order_index: index,
              sets: Number(exercise.sets) || null,
              reps_text: exercise.reps_text,
              load_text: exercise.load_text,
              rest_seconds: Number(exercise.rest_seconds) || null,
              notes: exercise.notes,
            })),
          );

        if (insertResponse.error) throw insertResponse.error;
      }

      onItemsChange((current) => current.map((item) => (item.id === activeSessionId ? { ...item, ...nextSession } : item)));
      setTemplates((current) => current.map((item) => ((item.builderSessionId || item.id) === activeSessionId ? { ...item, ...nextSession } : item)));
    } finally {
      setSaving(false);
    }
  }

  return (
    <section className="rounded-[22px] border border-[var(--border)] bg-[var(--surface-solid)] p-3.5 shadow-[var(--shadow-soft)]">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="inline-flex rounded-full border border-[var(--border)] bg-[var(--surface-muted)] p-1">
          {["sessions", "templates"].map((tab) => (
            <button
              key={tab}
              onClick={() => setBoardTab(tab)}
              className={`rounded-full px-4 py-2 text-sm font-medium ${boardTab === tab ? "bg-[var(--accent)] text-[var(--accent-foreground)]" : "text-[var(--text-muted)]"}`}
            >
              {tab === "sessions" ? ui.sessions : ui.templates}
            </button>
          ))}
        </div>
        <span className="rounded-full border border-[var(--border)] bg-white px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-[var(--text-muted)]">
          {visibleItems.length} {boardTab === "sessions" ? ui.sessions : ui.templates}
        </span>
      </div>

      <div className="mt-4 grid gap-4 xl:grid-cols-[280px_minmax(0,1fr)]">
        <div className="rounded-[18px] border border-[var(--border)] bg-[var(--surface-muted)] p-2.5">
          {loading || (boardTab === "templates" && templatesLoading) ? (
            <div className="inline-flex items-center gap-3 rounded-full border border-[var(--border)] bg-white px-4 py-3 text-sm text-[var(--text-muted)]">
              <LoaderCircle size={16} className="animate-spin text-[var(--accent)]" />
              {boardTab === "sessions" ? copy.loadingTrainings : ui.templates}
            </div>
          ) : visibleItems.length > 0 ? (
            <div className="grid gap-2">
              {visibleItems.map((item) => {
                const active = selectedItem?.id === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setSelectedId(item.id);
                      setSessionDraft({ name: item.name || "", notes: item.notes || "" });
                    }}
                    className={`rounded-[14px] border px-3 py-2.5 text-left ${active ? "border-[var(--accent)] bg-white" : "border-[var(--border)] bg-white/80"}`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium text-[var(--text)]">{item.name || copy.untitledSession}</p>
                        <p className="mt-1 text-[11px] uppercase tracking-[0.12em] text-[var(--text-muted)]">{formatDate(item.session_date, locale)}</p>
                      </div>
                      {item.isTemplate ? <span className="rounded-full border border-[var(--border)] bg-[var(--surface-muted)] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-[var(--text-muted)]">{item.templateCount}</span> : null}
                    </div>
                    <p className="mt-2 truncate text-sm text-[var(--text-muted)]">{item.students?.full_name || copy.noLinkedClient}</p>
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="rounded-[18px] border border-dashed border-[var(--border)] bg-white px-4 py-8 text-center text-sm text-[var(--text-muted)]">
              {boardTab === "sessions" ? copy.noTrainingsText : ui.noTemplates}
            </div>
          )}
        </div>

        <div className="rounded-[18px] border border-[var(--border)] bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(246,248,247,0.98))] p-3.5">
          {selectedItem ? (
            <div className="grid gap-4">
              <div className="flex flex-wrap items-start justify-between gap-3 rounded-[16px] border border-[var(--border)] bg-white px-3.5 py-3">
                <div>
                  <p className="text-[11px] uppercase tracking-[0.16em] text-[var(--accent)]">{boardTab === "sessions" ? ui.sessions : ui.templates}</p>
                  <h3 className="mt-1 text-base font-semibold text-[var(--text)]">{selectedItem.students?.full_name || copy.noLinkedClient}</h3>
                </div>
                <div className="flex items-center gap-2">
                  {selectedItem.isTemplate ? <span className="rounded-full border border-[var(--border)] bg-[var(--surface-muted)] px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-[var(--text-muted)]">{ui.templateSeries}: {selectedItem.templateCount}</span> : null}
                  <span className="rounded-full border border-[var(--border)] bg-white px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-[var(--text-muted)]">
                    {formatDate(selectedItem.session_date, locale)}
                  </span>
                </div>
              </div>

              <div className="grid gap-3">
                <div className="grid gap-3 xl:grid-cols-[minmax(0,1fr)_260px]">
                  <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)]">
                    <label className="grid gap-2">
                      <span className="text-[10px] uppercase tracking-[0.12em] text-[var(--text-muted)]">{copy.trainingLabel}</span>
                      <input value={sessionDraft.name} onChange={(event) => setSessionDraft((current) => ({ ...current, name: event.target.value }))} className="rounded-2xl border border-[var(--border)] bg-white px-3.5 py-2.5 text-sm text-[var(--text)] outline-none" />
                    </label>
                    <label className="grid gap-2">
                      <span className="text-[10px] uppercase tracking-[0.12em] text-[var(--text-muted)]">{copy.notes}</span>
                      <textarea rows={2} value={sessionDraft.notes} onChange={(event) => setSessionDraft((current) => ({ ...current, notes: event.target.value }))} className="rounded-2xl border border-[var(--border)] bg-white px-3.5 py-2.5 text-sm leading-6 text-[var(--text)] outline-none" placeholder={copy.notesPlaceholder} />
                    </label>
                  </div>
                  <div className="rounded-[16px] border border-[var(--border)] bg-[var(--surface-muted)] p-3">
                    <div className="flex items-center gap-2">
                      <Search size={15} className="text-[var(--text-muted)]" />
                      <input value={exerciseQuery} onChange={(event) => setExerciseQuery(event.target.value)} placeholder={ui.searchExercise} className="w-full bg-transparent text-sm text-[var(--text)] outline-none" />
                    </div>
                    <div className="mt-3 grid gap-2">
                      {filteredLibrary.map((item) => (
                        <button key={item.id} onClick={() => addExercise(item)} className="flex items-center justify-between rounded-2xl border border-[var(--border)] bg-white px-3 py-2 text-left">
                          <span className="truncate text-sm text-[var(--text)]">{item.label}</span>
                          <Plus size={15} className="shrink-0 text-[var(--accent)]" />
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="rounded-[16px] border border-[var(--border)] bg-[var(--surface-muted)] p-3">
                  <div className="flex items-center gap-2">
                    <Dumbbell size={15} className="text-[var(--accent)]" />
                    <p className="text-sm font-semibold text-[var(--text)]">{ui.builderTitle}</p>
                  </div>

                  {!activeSessionId ? (
                    <div className="mt-4 rounded-[18px] border border-dashed border-[var(--border)] bg-white px-4 py-8 text-center text-sm text-[var(--text-muted)]">
                      {ui.noTemplates}
                    </div>
                  ) : loadingSession ? (
                    <div className="mt-4 inline-flex items-center gap-3 rounded-full border border-[var(--border)] bg-white px-4 py-3 text-sm text-[var(--text-muted)]">
                      <LoaderCircle size={16} className="animate-spin text-[var(--accent)]" />
                      {ui.loadingBuilder}
                    </div>
                  ) : exercises.length > 0 ? (
                    <div className="mt-4 grid gap-2">
                      {exercises.map((exercise) => (
                        <div key={exercise.id} className="rounded-[14px] border border-[var(--border)] bg-white p-3">
                          <div className="flex items-start justify-between gap-3">
                            <p className="text-sm font-medium text-[var(--text)]">{exercise.exercise_name}</p>
                            <button onClick={() => removeExercise(exercise.id)} className="text-[var(--text-muted)]">
                              <Trash2 size={15} />
                            </button>
                          </div>
                          <div className="mt-3 grid gap-2 sm:grid-cols-4">
                            <input value={exercise.sets} onChange={(event) => updateExerciseField(exercise.id, "sets", event.target.value)} className="rounded-2xl border border-[var(--border)] bg-[var(--surface-muted)] px-3 py-2 text-sm" placeholder={ui.sets} />
                            <input value={exercise.reps_text} onChange={(event) => updateExerciseField(exercise.id, "reps_text", event.target.value)} className="rounded-2xl border border-[var(--border)] bg-[var(--surface-muted)] px-3 py-2 text-sm" placeholder={ui.reps} />
                            <input value={exercise.load_text} onChange={(event) => updateExerciseField(exercise.id, "load_text", event.target.value)} className="rounded-2xl border border-[var(--border)] bg-[var(--surface-muted)] px-3 py-2 text-sm" placeholder={ui.load} />
                            <input value={exercise.rest_seconds} onChange={(event) => updateExerciseField(exercise.id, "rest_seconds", event.target.value)} className="rounded-2xl border border-[var(--border)] bg-[var(--surface-muted)] px-3 py-2 text-sm" placeholder={ui.rest} />
                          </div>
                          <textarea value={exercise.notes} onChange={(event) => updateExerciseField(exercise.id, "notes", event.target.value)} rows={2} className="mt-2 w-full rounded-2xl border border-[var(--border)] bg-[var(--surface-muted)] px-3 py-2 text-sm" placeholder={copy.notesPlaceholder} />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="mt-4 rounded-[18px] border border-dashed border-[var(--border)] bg-white px-4 py-8 text-center text-sm text-[var(--text-muted)]">
                      {ui.emptyBuilder}
                    </div>
                  )}
                </div>
              </div>

              <div className="flex justify-end">
                <button onClick={saveSessionBuilder} disabled={saving || !activeSessionId} className="inline-flex items-center gap-2 rounded-2xl bg-[var(--accent)] px-4 py-2.5 text-sm font-semibold text-[var(--accent-foreground)] disabled:opacity-60">
                  {saving ? <LoaderCircle size={16} className="animate-spin" /> : <Check size={16} />}
                  {copy.saveChanges}
                </button>
              </div>
            </div>
          ) : (
            <div className="rounded-[18px] border border-dashed border-[var(--border)] bg-white px-4 py-8 text-center text-sm text-[var(--text-muted)]">
              {boardTab === "sessions" ? copy.noTrainingsText : ui.noTemplates}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
