"use client";

import { useEffect, useMemo, useState } from "react";
import { Check, ClipboardList, LoaderCircle } from "lucide-react";

import { getSupabaseBrowserClient } from "../../src/lib/supabase-browser";

function formatDate(value, locale = "en") {
  const tag = locale === "pt" ? "pt-PT" : locale === "es" ? "es-ES" : locale === "fr" ? "fr-FR" : "en-GB";
  return new Date(value).toLocaleDateString(tag, { day: "2-digit", month: "short", year: "numeric" });
}

function normalizeFields(fields) {
  return Object.entries(fields || {})
    .filter(([key]) => !["created_at", "updated_at"].includes(key))
    .map(([key, value]) => ({
      key,
      label: String(key).replace(/_/g, " "),
      value: value === null || value === undefined ? "" : String(value),
    }));
}

export default function AssessmentBuilderWorkspace({ items, loading, locale = "en", copy, currentUser, onItemsChange }) {
  const [selectedId, setSelectedId] = useState("");
  const [draftFields, setDraftFields] = useState([]);
  const [saving, setSaving] = useState(false);
  const selectedItem = useMemo(() => items.find((item) => item.id === selectedId) || items[0] || null, [items, selectedId]);

  useEffect(() => {
    if (!items.length) {
      setSelectedId("");
      setDraftFields([]);
      return;
    }
    const nextSelected = items.some((item) => item.id === selectedId) ? items.find((item) => item.id === selectedId) : items[0];
    setSelectedId(nextSelected.id);
    setDraftFields(normalizeFields(nextSelected.fields));
  }, [items, selectedId]);

  function updateDraftField(key, value) {
    setDraftFields((current) => current.map((field) => (field.key === key ? { ...field, value } : field)));
  }

  async function saveAssessment() {
    if (!selectedItem || !currentUser) return;
    setSaving(true);
    try {
      const supabase = getSupabaseBrowserClient();
      const nextFields = draftFields.reduce((acc, field) => {
        const trimmed = field.value.trim();
        if (!trimmed) return acc;
        const parsed = Number(trimmed);
        acc[field.key] = Number.isFinite(parsed) && `${parsed}` === trimmed ? parsed : trimmed;
        return acc;
      }, {});

      const response = await supabase
        .from("assessments")
        .update({ fields: nextFields })
        .eq("id", selectedItem.id)
        .eq("coach_id", currentUser.id);

      if (response.error) throw response.error;

      onItemsChange((current) =>
        current.map((item) =>
          item.id === selectedItem.id ? { ...item, fields: nextFields } : item,
        ),
      );
    } finally {
      setSaving(false);
    }
  }

  const quickSummary = useMemo(() => {
    if (!selectedItem?.fields) return [];
    return [
      ["Weight", selectedItem.fields.weight_kg, "kg"],
      ["BF%", selectedItem.fields.body_fat_pct, "%"],
      ["MM", selectedItem.fields.muscle_mass_kg, "kg"],
    ].filter(([, value]) => value !== null && value !== undefined && value !== "");
  }, [selectedItem]);

  return (
    <section className="rounded-[22px] border border-[var(--border)] bg-[var(--surface-solid)] p-3.5 shadow-[var(--shadow-soft)]">
      <div className="grid gap-4 xl:grid-cols-[280px_minmax(0,1fr)]">
        <div className="rounded-[18px] border border-[var(--border)] bg-[var(--surface-muted)] p-2.5">
          {loading ? (
            <div className="inline-flex items-center gap-3 rounded-full border border-[var(--border)] bg-white px-4 py-3 text-sm text-[var(--text-muted)]">
              <LoaderCircle size={16} className="animate-spin text-[var(--accent)]" />
              {copy.loadingAssessments}
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
                      setDraftFields(normalizeFields(item.fields));
                    }}
                    className={`rounded-[16px] border px-3 py-2.5 text-left ${active ? "border-[var(--accent)] bg-white" : "border-[var(--border)] bg-white/80"}`}
                  >
                    <p className="font-medium text-[var(--text)]">{item.students?.full_name || copy.client}</p>
                    <div className="mt-1 flex items-center justify-between gap-2">
                      <p className="text-[11px] uppercase tracking-[0.12em] text-[var(--text-muted)]">{formatDate(item.assessment_date, locale)}</p>
                      <p className="text-xs text-[var(--text-muted)]">{`${Object.keys(item.fields || {}).length} ${copy.savedMetrics}`}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="rounded-[18px] border border-dashed border-[var(--border)] bg-white px-4 py-8 text-center text-sm text-[var(--text-muted)]">
              {copy.noAssessmentsText}
            </div>
          )}
        </div>

        <div className="rounded-[18px] border border-[var(--border)] bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(246,248,247,0.98))] p-3.5">
          {selectedItem ? (
            <div className="grid gap-4">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-[11px] uppercase tracking-[0.16em] text-[var(--accent)]">{copy.client}</p>
                  <h3 className="mt-1 text-base font-semibold text-[var(--text)]">{selectedItem.students?.full_name || copy.client}</h3>
                </div>
                <span className="rounded-full border border-[var(--border)] bg-white px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-[var(--text-muted)]">
                  {formatDate(selectedItem.assessment_date, locale)}
                </span>
              </div>

              {quickSummary.length > 0 ? (
                <div className="grid gap-2.5 md:grid-cols-3">
                  {quickSummary.map(([label, value, unit]) => (
                    <div key={label} className="rounded-[16px] border border-[var(--border)] bg-[var(--surface-muted)] px-3.5 py-3">
                      <p className="text-[10px] uppercase tracking-[0.12em] text-[var(--text-muted)]">{label}</p>
                      <p className="mt-1 text-base font-semibold text-[var(--text)]">{value}{unit ? ` ${unit}` : ""}</p>
                    </div>
                  ))}
                </div>
              ) : null}

              <div className="grid gap-2.5 md:grid-cols-2 xl:grid-cols-3">
                {draftFields.map((field) => (
                  <label key={field.key} className="grid gap-2">
                    <span className="text-[10px] uppercase tracking-[0.12em] text-[var(--text-muted)]">{field.label}</span>
                    <input
                      value={field.value}
                      onChange={(event) => updateDraftField(field.key, event.target.value)}
                      className="rounded-2xl border border-[var(--border)] bg-white px-3.5 py-2.5 text-sm text-[var(--text)] outline-none"
                    />
                  </label>
                ))}
              </div>

              <div className="flex justify-end">
                <button
                  onClick={saveAssessment}
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
              {copy.noAssessmentsText}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
