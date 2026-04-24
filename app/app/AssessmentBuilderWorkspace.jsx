"use client";

import { Check, LoaderCircle } from "lucide-react";
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

function formatMetric(value, unit = "") {
  if (value === null || value === undefined || value === "") return "--";
  const numeric = Number(value);
  const base = Number.isFinite(numeric) ? (Number.isInteger(numeric) ? numeric.toString() : numeric.toFixed(1)) : String(value);
  return unit ? `${base}${unit}` : base;
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

function partitionFields(fields) {
  const headlineKeys = ["weight_kg", "body_fat_pct", "muscle_mass_kg"];
  const secondaryKeys = ["lean_mass_kg", "bmi", "waist_cm", "hip_cm", "visceral_fat"];

  const headline = fields.filter((field) => headlineKeys.includes(field.key));
  const secondary = fields.filter((field) => secondaryKeys.includes(field.key));
  const remaining = fields.filter((field) => !headlineKeys.includes(field.key) && !secondaryKeys.includes(field.key));

  return { headline, secondary, remaining };
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

  const grouped = useMemo(() => partitionFields(draftFields), [draftFields]);
  const quickSummary = useMemo(() => ([
    { label: "Peso", value: selectedItem?.fields?.weight_kg, unit: "kg" },
    { label: "BF%", value: selectedItem?.fields?.body_fat_pct, unit: "%" },
    { label: "MM", value: selectedItem?.fields?.muscle_mass_kg, unit: "kg" },
  ]), [selectedItem]);

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

  return (
    <section className="rounded-[22px] border border-[var(--border)] bg-[var(--surface-solid)] p-3.5 shadow-[var(--shadow-soft)]">
      <div className="grid gap-4 xl:grid-cols-[320px_minmax(0,1fr)]">
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
                const assessmentFields = item.fields || {};
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setSelectedId(item.id);
                      setDraftFields(normalizeFields(item.fields));
                    }}
                    className={`rounded-[16px] border px-3 py-3 text-left ${active ? "border-[var(--accent)] bg-white" : "border-[var(--border)] bg-white/85"}`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-medium text-[var(--text)]">{item.students?.full_name || copy.client}</p>
                        <p className="mt-1 text-[11px] uppercase tracking-[0.12em] text-[var(--text-muted)]">{formatDate(item.assessment_date, locale)}</p>
                      </div>
                      <span className="rounded-full border border-[var(--border)] bg-[var(--surface-muted)] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-[var(--text-muted)]">
                        #{items.findIndex((entry) => entry.id === item.id) + 1}
                      </span>
                    </div>
                    <div className="mt-3 grid grid-cols-3 gap-2">
                      <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface-muted)] px-2.5 py-2">
                        <p className="text-[10px] uppercase tracking-[0.12em] text-[var(--text-muted)]">Peso</p>
                        <p className="mt-1 text-sm font-semibold text-[var(--text)]">{formatMetric(assessmentFields.weight_kg, "kg")}</p>
                      </div>
                      <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface-muted)] px-2.5 py-2">
                        <p className="text-[10px] uppercase tracking-[0.12em] text-[var(--text-muted)]">BF%</p>
                        <p className="mt-1 text-sm font-semibold text-[var(--text)]">{formatMetric(assessmentFields.body_fat_pct, "%")}</p>
                      </div>
                      <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface-muted)] px-2.5 py-2">
                        <p className="text-[10px] uppercase tracking-[0.12em] text-[var(--text-muted)]">MM</p>
                        <p className="mt-1 text-sm font-semibold text-[var(--text)]">{formatMetric(assessmentFields.muscle_mass_kg, "kg")}</p>
                      </div>
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

              <div className="grid gap-2.5 md:grid-cols-3">
                {quickSummary.map((metric) => (
                  <div key={metric.label} className="rounded-[16px] border border-[var(--border)] bg-[var(--surface-muted)] px-3.5 py-3">
                    <p className="text-[10px] uppercase tracking-[0.12em] text-[var(--text-muted)]">{metric.label}</p>
                    <p className="mt-1 text-base font-semibold text-[var(--text)]">{formatMetric(metric.value, metric.unit)}</p>
                  </div>
                ))}
              </div>

              {grouped.secondary.length > 0 ? (
                <div className="grid gap-2.5 md:grid-cols-3">
                  {grouped.secondary.map((field) => (
                    <label key={field.key} className="grid gap-2 rounded-[16px] border border-[var(--border)] bg-white px-3.5 py-3">
                      <span className="text-[10px] uppercase tracking-[0.12em] text-[var(--text-muted)]">{field.label}</span>
                      <input value={field.value} onChange={(event) => updateDraftField(field.key, event.target.value)} className="bg-transparent text-sm font-medium text-[var(--text)] outline-none" />
                    </label>
                  ))}
                </div>
              ) : null}

              <div className="grid gap-2.5 md:grid-cols-2 xl:grid-cols-3">
                {grouped.remaining.map((field) => (
                  <label key={field.key} className="grid gap-2 rounded-[16px] border border-[var(--border)] bg-white px-3.5 py-3">
                    <span className="text-[10px] uppercase tracking-[0.12em] text-[var(--text-muted)]">{field.label}</span>
                    <input value={field.value} onChange={(event) => updateDraftField(field.key, event.target.value)} className="bg-transparent text-sm font-medium text-[var(--text)] outline-none" />
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
