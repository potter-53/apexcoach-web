"use client";

import { useEffect, useMemo, useState } from "react";
import { Check, Dumbbell, LoaderCircle, Plus, Search, Trash2 } from "lucide-react";

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

export default function TrainingBuilderWorkspace({ items, loading, copy, locale = "en", currentUser, onItemsChange }) {
  const [selectedId, setSelectedId] = useState("");
  const [sessionDraft, setSessionDraft] = useState({ name: "", notes: "" });
  const [exercises, setExercises] = useState([]);
  const [exerciseLibrary, setExerciseLibrary] = useState([]);
  const [exerciseQuery, setExerciseQuery] = useState("");
  const [loadingSession, setLoadingSession] = useState(false);
  const [saving, setSaving] = useState(false);
  const selectedItem = useMemo(() => items.find((item) => item.id === selectedId) || items[0] || null, [items, selectedId]);

  useEffect(() => {
    if (!items.length) {
      setSelectedId("");
      return;
    }
    const nextSelected = items.some((item) => item.id === selectedId) ? items.find((item) => item.id === selectedId) : items[0];
    setSelectedId(nextSelected.id);
    setSessionDraft({ name: nextSelected.name || "", notes: nextSelected.notes || "" });
  }, [items, selectedId]);

  useEffect(() => {
    if (!selectedItem || !currentUser) {
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
            .eq("session_id", selectedItem.id)
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
  }, [selectedItem, currentUser, locale]);

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
    if (!selectedItem || !currentUser) return;
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
        .eq("id", selectedItem.id)
        .eq("coach_id", currentUser.id);

      if (updateSessionResponse.error) throw updateSessionResponse.error;

      const deleteResponse = await supabase
        .from("training_session_exercises")
        .delete()
        .eq("session_id", selectedItem.id);

      if (deleteResponse.error) throw deleteResponse.error;

      if (exercises.length > 0) {
        const insertResponse = await supabase
          .from("training_session_exercises")
          .insert(
            exercises.map((exercise, index) => ({
              session_id: selectedItem.id,
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

      onItemsChange((current) =>
        current.map((item) =>
          item.id === selectedItem.id ? { ...item, ...nextSession } : item,
        ),
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <section className="rounded-[24px] border border-[var(--border)] bg-[var(--surface-solid)] p-4 shadow-[var(--shadow-soft)]">
      <div className="flex flex-col gap-2">
        <p className="text-xs uppercase tracking-[0.18em] text-[var(--accent)]">{copy.tabs.trainings}</p>
        <h2 className="text-xl font-semibold text-[var(--text)]">{copy.trainingsTitle}</h2>
        <p className="text-sm leading-6 text-[var(--text-muted)]">{copy.trainingsText}</p>
      </div>

      <div className="mt-5 grid gap-4 xl:grid-cols-[320px_minmax(0,1fr)]">
        <div className="rounded-[20px] border border-[var(--border)] bg-[var(--surface-muted)] p-3">
          {loading ? (
            <div className="inline-flex items-center gap-3 rounded-full border border-[var(--border)] bg-white px-4 py-3 text-sm text-[var(--text-muted)]">
              <LoaderCircle size={16} className="animate-spin text-[var(--accent)]" />
              {copy.loadingTrainings}
            </div>
          ) : items.length > 0 ? (
            <div className="grid gap-2">
              {items.map((item) => {
                const active = selectedItem?.id === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setSelectedId(item.id);
                      setSessionDraft({ name: item.name || "", notes: item.notes || "" });
                    }}
                    className={`rounded-[18px] border px-3 py-3 text-left ${active ? "border-[var(--accent)] bg-white" : "border-[var(--border)] bg-white/80"}`}
                  >
                    <p className="font-medium text-[var(--text)]">{item.name || copy.untitledSession}</p>
                    <p className="mt-1 text-[11px] uppercase tracking-[0.14em] text-[var(--text-muted)]">{formatDate(item.session_date, locale)}</p>
                    <p className="mt-2 truncate text-sm text-[var(--text-muted)]">{item.students?.full_name || copy.noLinkedClient}</p>
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="rounded-[18px] border border-dashed border-[var(--border)] bg-white px-4 py-8 text-center text-sm text-[var(--text-muted)]">
              {copy.noTrainingsText}
            </div>
          )}
        </div>

        <div className="rounded-[20px] border border-[var(--border)] bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(246,248,247,0.98))] p-4">
          {selectedItem ? (
            <div className="grid gap-4">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-xs uppercase tracking-[0.18em] text-[var(--accent)]">{copy.client}</p>
                  <h3 className="mt-1 text-lg font-semibold text-[var(--text)]">{selectedItem.students?.full_name || copy.noLinkedClient}</h3>
                </div>
                <span className="rounded-full border border-[var(--border)] bg-white px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--text-muted)]">
                  {formatDate(selectedItem.session_date, locale)}
                </span>
              </div>

              <div className="grid gap-3 md:grid-cols-[1fr_1.15fr]">
                <div className="grid gap-3">
                  <label className="grid gap-2">
                    <span className="text-[11px] uppercase tracking-[0.14em] text-[var(--text-muted)]">{copy.trainingLabel}</span>
                    <input
                      value={sessionDraft.name}
                      onChange={(event) => setSessionDraft((current) => ({ ...current, name: event.target.value }))}
                      className="rounded-2xl border border-[var(--border)] bg-white px-4 py-3 text-sm text-[var(--text)] outline-none"
                    />
                  </label>
                  <label className="grid gap-2">
                    <span className="text-[11px] uppercase tracking-[0.14em] text-[var(--text-muted)]">{copy.notes}</span>
                    <textarea
                      rows={5}
                      value={sessionDraft.notes}
                      onChange={(event) => setSessionDraft((current) => ({ ...current, notes: event.target.value }))}
                      className="rounded-2xl border border-[var(--border)] bg-white px-4 py-3 text-sm leading-7 text-[var(--text)] outline-none"
                      placeholder={copy.notesPlaceholder}
                    />
                  </label>

                  <div className="rounded-[18px] border border-[var(--border)] bg-[var(--surface-muted)] p-3">
                    <div className="flex items-center gap-2">
                      <Search size={15} className="text-[var(--text-muted)]" />
                      <input
                        value={exerciseQuery}
                        onChange={(event) => setExerciseQuery(event.target.value)}
                        placeholder="Search exercise..."
                        className="w-full bg-transparent text-sm text-[var(--text)] outline-none"
                      />
                    </div>
                    <div className="mt-3 grid gap-2">
                      {filteredLibrary.map((item) => (
                        <button
                          key={item.id}
                          onClick={() => addExercise(item)}
                          className="flex items-center justify-between rounded-2xl border border-[var(--border)] bg-white px-3 py-2 text-left"
                        >
                          <span className="text-sm text-[var(--text)]">{item.label}</span>
                          <Plus size={15} className="text-[var(--accent)]" />
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="rounded-[18px] border border-[var(--border)] bg-[var(--surface-muted)] p-3">
                  <div className="flex items-center gap-2">
                    <Dumbbell size={15} className="text-[var(--accent)]" />
                    <p className="text-sm font-semibold text-[var(--text)]">Session builder</p>
                  </div>

                  {loadingSession ? (
                    <div className="mt-4 inline-flex items-center gap-3 rounded-full border border-[var(--border)] bg-white px-4 py-3 text-sm text-[var(--text-muted)]">
                      <LoaderCircle size={16} className="animate-spin text-[var(--accent)]" />
                      Loading builder...
                    </div>
                  ) : exercises.length > 0 ? (
                    <div className="mt-4 grid gap-3">
                      {exercises.map((exercise) => (
                        <div key={exercise.id} className="rounded-[18px] border border-[var(--border)] bg-white p-3">
                          <div className="flex items-start justify-between gap-3">
                            <p className="font-medium text-[var(--text)]">{exercise.exercise_name}</p>
                            <button onClick={() => removeExercise(exercise.id)} className="text-[var(--text-muted)]">
                              <Trash2 size={15} />
                            </button>
                          </div>
                          <div className="mt-3 grid gap-2 sm:grid-cols-4">
                            <input value={exercise.sets} onChange={(event) => updateExerciseField(exercise.id, "sets", event.target.value)} className="rounded-2xl border border-[var(--border)] bg-[var(--surface-muted)] px-3 py-2 text-sm" placeholder="Sets" />
                            <input value={exercise.reps_text} onChange={(event) => updateExerciseField(exercise.id, "reps_text", event.target.value)} className="rounded-2xl border border-[var(--border)] bg-[var(--surface-muted)] px-3 py-2 text-sm" placeholder="Reps" />
                            <input value={exercise.load_text} onChange={(event) => updateExerciseField(exercise.id, "load_text", event.target.value)} className="rounded-2xl border border-[var(--border)] bg-[var(--surface-muted)] px-3 py-2 text-sm" placeholder="Load" />
                            <input value={exercise.rest_seconds} onChange={(event) => updateExerciseField(exercise.id, "rest_seconds", event.target.value)} className="rounded-2xl border border-[var(--border)] bg-[var(--surface-muted)] px-3 py-2 text-sm" placeholder="Rest" />
                          </div>
                          <textarea value={exercise.notes} onChange={(event) => updateExerciseField(exercise.id, "notes", event.target.value)} rows={2} className="mt-2 w-full rounded-2xl border border-[var(--border)] bg-[var(--surface-muted)] px-3 py-2 text-sm" placeholder={copy.notesPlaceholder} />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="mt-4 rounded-[18px] border border-dashed border-[var(--border)] bg-white px-4 py-8 text-center text-sm text-[var(--text-muted)]">
                      Add exercises to build this session.
                    </div>
                  )}
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  onClick={saveSessionBuilder}
                  disabled={saving}
                  className="inline-flex items-center gap-2 rounded-2xl bg-[var(--accent)] px-4 py-2.5 text-sm font-semibold text-[var(--accent-foreground)] disabled:opacity-60"
                >
                  {saving ? <LoaderCircle size={16} className="animate-spin" /> : <Check size={16} />}
                  {copy.saveChanges}
                </button>
              </div>
            </div>
          ) : (
            <div className="rounded-[18px] border border-dashed border-[var(--border)] bg-white px-4 py-8 text-center text-sm text-[var(--text-muted)]">
              {copy.noTrainingsText}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
