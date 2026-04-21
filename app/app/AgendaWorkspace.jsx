"use client";

import { useEffect, useMemo, useState } from "react";
import { CalendarDays, ChevronLeft, ChevronRight, Clock3, GripVertical, LoaderCircle, PencilLine, Plus } from "lucide-react";

import { getSupabaseBrowserClient } from "../../src/lib/supabase-browser";

const COPY = {
  en: {
    editBooking: "Edit booking",
    date: "Date",
    time: "Time",
    notes: "Notes",
    cancel: "Cancel",
    saveChanges: "Save changes",
    agenda: "Agenda",
    weeklyMonthly: "Weekly and monthly control",
    liveScheduling: "Calendar with live scheduling",
    week: "Week",
    month: "Month",
    newBooking: "New booking",
    loadingAgenda: "Loading agenda...",
    dropHere: "Drop or create a booking here.",
    noBookings: "No bookings",
    lastFive: "Last 5 bookings",
    nextFive: "Next 5 bookings",
    noPast: "No past bookings",
    noPastText: "Completed or previous bookings will appear here.",
    noUpcoming: "No upcoming bookings",
    noUpcomingText: "Future bookings will appear here as soon as they are scheduled.",
    clientFallback: "Client",
    bookingFallback: "Agenda item",
    loadAgendaError: "Could not load agenda.",
    saveAgendaError: "Could not save agenda item.",
    moveBookingError: "Could not move booking.",
    weeklyCalendar: "Weekly calendar",
    dailySubtitle: "Sessions and bookings",
    today: "Today",
    liveWeek: "Live week",
  },
  pt: {
    editBooking: "Editar marcação",
    date: "Data",
    time: "Hora",
    notes: "Notas",
    cancel: "Cancelar",
    saveChanges: "Guardar alterações",
    agenda: "Agenda",
    weeklyMonthly: "Controlo semanal e mensal",
    liveScheduling: "Calendário com marcações em direto",
    week: "Semana",
    month: "Mês",
    newBooking: "Nova marcação",
    loadingAgenda: "A carregar agenda...",
    dropHere: "Larga aqui ou cria uma marcação.",
    noBookings: "Sem marcações",
    lastFive: "Últimas 5 marcações",
    nextFive: "Próximas 5 marcações",
    noPast: "Sem marcações anteriores",
    noPastText: "As marcações concluídas ou passadas aparecem aqui.",
    noUpcoming: "Sem próximas marcações",
    noUpcomingText: "As futuras marcações aparecem aqui assim que forem agendadas.",
    clientFallback: "Cliente",
    bookingFallback: "Item da agenda",
    loadAgendaError: "Não foi possível carregar a agenda.",
    saveAgendaError: "Não foi possível guardar a marcação.",
    moveBookingError: "Não foi possível mover a marcação.",
  },
  es: {
    editBooking: "Editar reserva",
    date: "Fecha",
    time: "Hora",
    notes: "Notas",
    cancel: "Cancelar",
    saveChanges: "Guardar cambios",
    agenda: "Agenda",
    weeklyMonthly: "Control semanal y mensual",
    liveScheduling: "Calendario con reservas en directo",
    week: "Semana",
    month: "Mes",
    newBooking: "Nueva reserva",
    loadingAgenda: "Cargando agenda...",
    dropHere: "Suelta aquí o crea una reserva.",
    noBookings: "Sin reservas",
    lastFive: "Últimas 5 reservas",
    nextFive: "Próximas 5 reservas",
    noPast: "Sin reservas anteriores",
    noPastText: "Las reservas completadas o pasadas aparecerán aquí.",
    noUpcoming: "Sin próximas reservas",
    noUpcomingText: "Las futuras reservas aparecerán aquí en cuanto se programen.",
    clientFallback: "Cliente",
    bookingFallback: "Elemento de agenda",
    loadAgendaError: "No se pudo cargar la agenda.",
    saveAgendaError: "No se pudo guardar la reserva.",
    moveBookingError: "No se pudo mover la reserva.",
  },
  fr: {
    editBooking: "Modifier le rendez-vous",
    date: "Date",
    time: "Heure",
    notes: "Notes",
    cancel: "Annuler",
    saveChanges: "Enregistrer les modifications",
    agenda: "Agenda",
    weeklyMonthly: "Contrôle hebdomadaire et mensuel",
    liveScheduling: "Calendrier avec planification en direct",
    week: "Semaine",
    month: "Mois",
    newBooking: "Nouveau rendez-vous",
    loadingAgenda: "Chargement de l'agenda...",
    dropHere: "Dépose ici ou crée un rendez-vous.",
    noBookings: "Aucun rendez-vous",
    lastFive: "5 derniers rendez-vous",
    nextFive: "5 prochains rendez-vous",
    noPast: "Aucun rendez-vous passé",
    noPastText: "Les rendez-vous passés ou terminés apparaîtront ici.",
    noUpcoming: "Aucun rendez-vous à venir",
    noUpcomingText: "Les futurs rendez-vous apparaîtront ici dès qu'ils seront planifiés.",
    clientFallback: "Client",
    bookingFallback: "Élément d'agenda",
    loadAgendaError: "Impossible de charger l'agenda.",
    saveAgendaError: "Impossible d'enregistrer le rendez-vous.",
    moveBookingError: "Impossible de déplacer le rendez-vous.",
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

function startOfWeek(date) {
  const value = new Date(date);
  const day = (value.getDay() + 6) % 7;
  value.setHours(0, 0, 0, 0);
  value.setDate(value.getDate() - day);
  return value;
}

function startOfMonth(date) {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

function endOfMonth(date) {
  return new Date(date.getFullYear(), date.getMonth() + 1, 1);
}

function formatDate(value, locale, options) {
  return new Date(value).toLocaleDateString(localeTag(locale), options);
}

function formatTime(value, locale) {
  return new Date(value).toLocaleTimeString(localeTag(locale), { hour: "2-digit", minute: "2-digit" });
}

function withSameTime(baseDate, sourceDate) {
  const updated = new Date(baseDate);
  const source = new Date(sourceDate);
  updated.setHours(source.getHours(), source.getMinutes(), 0, 0);
  return updated;
}

function normalizeAgendaRows(rows, copy) {
  return rows.map((row) => ({
    ...row,
    scheduledAt: new Date(row.scheduled_at),
    studentName: row.students?.full_name || copy.clientFallback,
    clientColor: row.students?.client_color_hex || "#2ad07d",
    bookingName: row.booking_types?.name || row.item_type || copy.bookingFallback,
  }));
}

function statusLabel(value) {
  return (value || "scheduled").replace(/_/g, " ");
}

function groupWeekItems(items, locale) {
  return items.slice(0, 4).map((item) => ({
    ...item,
    timeLabel: formatTime(item.scheduledAt, locale),
  }));
}

export default function AgendaWorkspace({ currentUser, compact = false, onOpenCreateBooking, locale = "en" }) {
  const copy = getCopy(locale);
  const [mode, setMode] = useState("week");
  const [anchorDate, setAnchorDate] = useState(new Date());
  const [items, setItems] = useState([]);
  const [nextItems, setNextItems] = useState([]);
  const [pastItems, setPastItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [editingItem, setEditingItem] = useState(null);
  const [savingEdit, setSavingEdit] = useState(false);

  const range = useMemo(() => {
    if (mode === "month") {
      const start = startOfMonth(anchorDate);
      const end = endOfMonth(anchorDate);
      return { start, end };
    }

    const start = startOfWeek(anchorDate);
    const end = new Date(start);
    end.setDate(end.getDate() + 7);
    return { start, end };
  }, [anchorDate, mode]);

  useEffect(() => {
    if (!currentUser) return;
    const supabase = getSupabaseBrowserClient();
    let mounted = true;

    async function loadAgenda() {
      setLoading(true);
      setError("");

      try {
        const [rangeResponse, nextResponse, pastResponse] = await Promise.all([
          supabase
            .from("agenda_items")
            .select("id, item_type, notes, scheduled_at, status, students(full_name, client_color_hex), booking_types(name)")
            .eq("coach_id", currentUser.id)
            .gte("scheduled_at", range.start.toISOString())
            .lt("scheduled_at", range.end.toISOString())
            .order("scheduled_at", { ascending: true }),
          supabase
            .from("agenda_items")
            .select("id, item_type, notes, scheduled_at, status, students(full_name, client_color_hex), booking_types(name)")
            .eq("coach_id", currentUser.id)
            .gte("scheduled_at", new Date().toISOString())
            .order("scheduled_at", { ascending: true })
            .limit(5),
          supabase
            .from("agenda_items")
            .select("id, item_type, notes, scheduled_at, status, students(full_name, client_color_hex), booking_types(name)")
            .eq("coach_id", currentUser.id)
            .lt("scheduled_at", new Date().toISOString())
            .order("scheduled_at", { ascending: false })
            .limit(5),
        ]);

        const failed = [rangeResponse, nextResponse, pastResponse].find((item) => item.error);
        if (failed?.error) throw failed.error;

        if (!mounted) return;
        setItems(normalizeAgendaRows(rangeResponse.data ?? [], copy));
        setNextItems(normalizeAgendaRows(nextResponse.data ?? [], copy));
        setPastItems(normalizeAgendaRows((pastResponse.data ?? []).slice().reverse(), copy));
      } catch (loadError) {
        if (!mounted) return;
        setError(loadError?.message || copy.loadAgendaError);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    loadAgenda();
    return () => {
      mounted = false;
    };
  }, [copy, currentUser, range]);

  const weekDays = useMemo(() => {
    if (mode !== "week") return [];
    return Array.from({ length: 7 }, (_, index) => {
      const date = new Date(range.start);
      date.setDate(date.getDate() + index);
      return date;
    });
  }, [mode, range]);

  const monthDays = useMemo(() => {
    if (mode !== "month") return [];
    const start = startOfWeek(startOfMonth(anchorDate));
    const days = [];
    for (let index = 0; index < 35; index += 1) {
      const date = new Date(start);
      date.setDate(date.getDate() + index);
      days.push(date);
    }
    return days;
  }, [anchorDate, mode]);

  const weekOverview = useMemo(() => {
    if (mode !== "week") return [];
    return weekDays.map((day) => {
      const dayItems = items.filter((item) => item.scheduledAt.toDateString() === day.toDateString());
      return {
        day,
        count: dayItems.length,
        items: groupWeekItems(dayItems, locale),
      };
    });
  }, [items, locale, mode, weekDays]);

  function moveRange(direction) {
    const updated = new Date(anchorDate);
    if (mode === "month") {
      updated.setMonth(updated.getMonth() + direction);
    } else {
      updated.setDate(updated.getDate() + direction * 7);
    }
    setAnchorDate(updated);
  }

  function jumpToToday() {
    setAnchorDate(new Date());
  }

  async function rescheduleItem(item, targetDate) {
    const supabase = getSupabaseBrowserClient();
    const updatedDate = withSameTime(targetDate, item.scheduled_at || item.scheduledAt);
    const response = await supabase
      .from("agenda_items")
      .update({
        scheduled_at: updatedDate.toISOString(),
        scheduled_timezone_offset_minutes: updatedDate.getTimezoneOffset() * -1,
      })
      .eq("id", item.id)
      .eq("coach_id", currentUser.id);

    if (response.error) throw response.error;

    setItems((current) =>
      current.map((entry) => (entry.id === item.id ? { ...entry, scheduledAt: updatedDate, scheduled_at: updatedDate.toISOString() } : entry)),
    );
    setNextItems((current) =>
      current.map((entry) => (entry.id === item.id ? { ...entry, scheduledAt: updatedDate, scheduled_at: updatedDate.toISOString() } : entry)),
    );
  }

  async function saveEdit(event) {
    event.preventDefault();
    if (!editingItem) return;
    setSavingEdit(true);

    try {
      const supabase = getSupabaseBrowserClient();
      const updatedDate = new Date(`${editingItem.date}T${editingItem.time}`);
      const response = await supabase
        .from("agenda_items")
        .update({
          scheduled_at: updatedDate.toISOString(),
          scheduled_timezone_offset_minutes: updatedDate.getTimezoneOffset() * -1,
          notes: editingItem.notes,
        })
        .eq("id", editingItem.id)
        .eq("coach_id", currentUser.id);

      if (response.error) throw response.error;

      setItems((current) =>
        current.map((entry) =>
          entry.id === editingItem.id
            ? { ...entry, notes: editingItem.notes, scheduledAt: updatedDate, scheduled_at: updatedDate.toISOString() }
            : entry,
        ),
      );
      setNextItems((current) =>
        current.map((entry) =>
          entry.id === editingItem.id
            ? { ...entry, notes: editingItem.notes, scheduledAt: updatedDate, scheduled_at: updatedDate.toISOString() }
            : entry,
        ),
      );
      setEditingItem(null);
    } catch (saveError) {
      setError(saveError?.message || copy.saveAgendaError);
    } finally {
      setSavingEdit(false);
    }
  }

  function renderCard(item, draggable = false) {
    return (
      <button
        key={item.id}
        draggable={draggable}
        onDragStart={(event) => event.dataTransfer.setData("text/plain", item.id)}
        onClick={() =>
          setEditingItem({
            id: item.id,
            date: item.scheduledAt.toISOString().slice(0, 10),
            time: `${`${item.scheduledAt.getHours()}`.padStart(2, "0")}:${`${item.scheduledAt.getMinutes()}`.padStart(2, "0")}`,
            notes: item.notes || "",
          })
        }
        className="w-full rounded-[22px] border border-[var(--border)] bg-white p-4 text-left shadow-[var(--shadow-soft)]"
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2">
            {draggable ? <GripVertical size={16} className="text-[var(--text-muted)]" /> : null}
            <span className="h-3 w-3 rounded-full" style={{ background: item.clientColor }} />
            <span className="text-xs uppercase tracking-[0.16em] text-[var(--text-muted)]">{statusLabel(item.status)}</span>
          </div>
          <PencilLine size={16} className="text-[var(--text-muted)]" />
        </div>
        <p className="mt-4 text-lg font-semibold text-[var(--text)]">{item.studentName}</p>
        <p className="mt-2 text-sm uppercase tracking-[0.16em] text-[var(--text-muted)]">{item.bookingName}</p>
        <p className="mt-2 text-sm text-[var(--text-muted)]">{formatTime(item.scheduledAt, locale)}</p>
        {item.notes ? <p className="mt-3 line-clamp-2 text-sm text-[var(--text-muted)]">{item.notes}</p> : null}
      </button>
    );
  }

  return (
    <>
      {editingItem ? (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-slate-950/30 px-4 py-6 backdrop-blur-sm">
          <div className="w-full max-w-xl rounded-[32px] border border-[var(--border-strong)] bg-white p-6 shadow-[var(--shadow-panel)]">
            <h3 className="text-2xl font-semibold text-[var(--text)]">{copy.editBooking}</h3>
            <form onSubmit={saveEdit} className="mt-6 grid gap-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="grid gap-2">
                  <span className="text-sm text-[var(--text-muted)]">{copy.date}</span>
                  <input
                    type="date"
                    value={editingItem.date}
                    onChange={(event) => setEditingItem((current) => ({ ...current, date: event.target.value }))}
                    className="rounded-2xl border border-[var(--border)] bg-[var(--surface-muted)] px-4 py-3"
                  />
                </label>
                <label className="grid gap-2">
                  <span className="text-sm text-[var(--text-muted)]">{copy.time}</span>
                  <input
                    type="time"
                    value={editingItem.time}
                    onChange={(event) => setEditingItem((current) => ({ ...current, time: event.target.value }))}
                    className="rounded-2xl border border-[var(--border)] bg-[var(--surface-muted)] px-4 py-3"
                  />
                </label>
              </div>
              <label className="grid gap-2">
                <span className="text-sm text-[var(--text-muted)]">{copy.notes}</span>
                <textarea
                  rows={4}
                  value={editingItem.notes}
                  onChange={(event) => setEditingItem((current) => ({ ...current, notes: event.target.value }))}
                  className="rounded-2xl border border-[var(--border)] bg-[var(--surface-muted)] px-4 py-3"
                />
              </label>
              <div className="flex justify-end gap-3">
                <button type="button" onClick={() => setEditingItem(null)} className="rounded-2xl border border-[var(--border)] bg-white px-5 py-3 font-medium text-[var(--text-muted)]">
                  {copy.cancel}
                </button>
                <button type="submit" disabled={savingEdit} className="inline-flex items-center gap-2 rounded-2xl bg-[var(--accent)] px-5 py-3 font-semibold text-[var(--accent-foreground)]">
                  {savingEdit ? <LoaderCircle size={16} className="animate-spin" /> : <PencilLine size={16} />}
                  {copy.saveChanges}
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}

      <div className="grid gap-6">
        <section className="rounded-[32px] border border-[var(--border)] bg-[var(--surface-solid)] p-5 shadow-[var(--shadow-soft)] sm:p-6">
          <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.2em] text-[var(--accent)]">{copy.agenda}</p>
              <h2 className="mt-2 text-2xl font-semibold text-[var(--text)]">
                {compact ? copy.weeklyCalendar || copy.weeklyMonthly : copy.liveScheduling}
              </h2>
              <p className="mt-3 text-sm leading-7 text-[var(--text-muted)]">{copy.dailySubtitle || copy.liveScheduling}</p>
            </div>

            <div className="flex flex-wrap gap-3">
              <div className="inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-white px-4 py-2">
                <span className="h-2.5 w-2.5 rounded-full bg-[var(--accent)]" />
                <span className="text-sm font-medium text-[var(--text)]">{copy.liveWeek || copy.agenda}</span>
              </div>
              <div className="inline-flex rounded-full border border-[var(--border)] bg-[var(--surface-muted)] p-1">
                {["week", "month"].map((value) => (
                  <button
                    key={value}
                    onClick={() => setMode(value)}
                    className={`rounded-full px-4 py-2 text-sm font-medium ${mode === value ? "bg-[var(--accent)] text-[var(--accent-foreground)]" : "text-[var(--text-muted)]"}`}
                  >
                    {value === "week" ? copy.week : copy.month}
                  </button>
                ))}
              </div>
              <div className="inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-white px-3 py-2">
                <button onClick={() => moveRange(-1)} className="rounded-full p-2 text-[var(--text-muted)]">
                  <ChevronLeft size={16} />
                </button>
                <span className="text-sm font-medium text-[var(--text)]">
                  {mode === "month"
                    ? formatDate(range.start, locale, { month: "long", year: "numeric" })
                    : `${formatDate(range.start, locale, { day: "2-digit", month: "short" })} - ${formatDate(new Date(range.end.getTime() - 86400000), locale, { day: "2-digit", month: "short" })}`}
                </span>
                <button onClick={() => moveRange(1)} className="rounded-full p-2 text-[var(--text-muted)]">
                  <ChevronRight size={16} />
                </button>
              </div>
              <button onClick={jumpToToday} className="inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-white px-4 py-3 text-sm font-medium text-[var(--text)]">
                <CalendarDays size={16} />
                {copy.today || "Today"}
              </button>
              <button onClick={onOpenCreateBooking} className="inline-flex items-center gap-2 rounded-2xl bg-[var(--accent)] px-4 py-3 text-sm font-semibold text-[var(--accent-foreground)]">
                <Plus size={16} />
                {copy.newBooking}
              </button>
            </div>
          </div>

          {error ? <div className="mt-5 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</div> : null}
          {loading ? <div className="mt-5 inline-flex items-center gap-3 rounded-full border border-[var(--border)] bg-[var(--surface-muted)] px-4 py-3 text-sm text-[var(--text-muted)]"><LoaderCircle size={16} className="animate-spin text-[var(--accent)]" />{copy.loadingAgenda}</div> : null}

          {mode === "week" ? (
            <div className="mt-6 grid gap-6 xl:grid-cols-[minmax(0,1.5fr)_360px]">
              <div className="grid gap-4 xl:grid-cols-7">
                {weekDays.map((day) => {
                  const dayItems = items.filter((item) => item.scheduledAt.toDateString() === day.toDateString());
                  return (
                    <div
                      key={day.toISOString()}
                      onDragOver={(event) => event.preventDefault()}
                      onDrop={async (event) => {
                        const id = event.dataTransfer.getData("text/plain");
                        const item = items.find((entry) => entry.id === id);
                        if (!item) return;
                        try {
                          await rescheduleItem(item, day);
                        } catch (moveError) {
                          setError(moveError?.message || copy.moveBookingError);
                        }
                      }}
                      className={`rounded-[24px] border p-4 ${day.toDateString() === new Date().toDateString() ? "border-[var(--accent)] bg-[linear-gradient(180deg,rgba(233,251,241,0.95),rgba(255,255,255,0.98))]" : "border-[var(--border)] bg-[var(--surface-muted)]"}`}
                    >
                      <p className="text-xs uppercase tracking-[0.18em] text-[var(--text-muted)]">{formatDate(day, locale, { weekday: "short" })}</p>
                      <p className="mt-2 text-lg font-semibold text-[var(--text)]">{formatDate(day, locale, { day: "2-digit", month: "short" })}</p>
                      <div className="mt-4 grid gap-3">
                        {dayItems.length > 0 ? dayItems.map((item) => renderCard(item, true)) : <p className="text-sm text-[var(--text-muted)]">{copy.dropHere}</p>}
                      </div>
                    </div>
                  );
                })}
              </div>

              <aside className="rounded-[28px] border border-[var(--border)] bg-[linear-gradient(180deg,rgba(250,252,251,0.96),rgba(241,245,243,0.98))] p-5">
                <p className="text-xs uppercase tracking-[0.18em] text-[var(--accent)]">{copy.liveWeek || copy.agenda}</p>
                <h3 className="mt-2 text-2xl font-semibold text-[var(--text)]">{copy.week}</h3>
                <p className="mt-3 text-sm leading-7 text-[var(--text-muted)]">{copy.dailySubtitle || copy.liveScheduling}</p>

                <div className="mt-5 grid gap-3">
                  {weekOverview.map(({ day, count, items: dayItems }) => (
                    <div
                      key={day.toISOString()}
                      className={`rounded-[24px] border px-4 py-4 ${day.toDateString() === new Date().toDateString() ? "border-[var(--accent)] bg-white" : "border-[var(--border)] bg-white/80"}`}
                    >
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <p className="text-xs uppercase tracking-[0.18em] text-[var(--text-muted)]">{formatDate(day, locale, { weekday: "short" })}</p>
                          <p className="mt-1 text-base font-semibold text-[var(--text)]">{formatDate(day, locale, { day: "2-digit", month: "short" })}</p>
                        </div>
                        <span className="rounded-full border border-[var(--border)] bg-[var(--surface-muted)] px-3 py-1 text-xs font-semibold text-[var(--text-muted)]">
                          {count}
                        </span>
                      </div>

                      <div className="mt-4 grid gap-2">
                        {dayItems.length > 0 ? (
                          dayItems.map((item) => (
                            <button
                              key={item.id}
                              onClick={() =>
                                setEditingItem({
                                  id: item.id,
                                  date: item.scheduledAt.toISOString().slice(0, 10),
                                  time: `${`${item.scheduledAt.getHours()}`.padStart(2, "0")}:${`${item.scheduledAt.getMinutes()}`.padStart(2, "0")}`,
                                  notes: item.notes || "",
                                })
                              }
                              className="rounded-2xl border border-[var(--border)] bg-[var(--surface-muted)] px-3 py-3 text-left"
                            >
                              <p className="text-xs uppercase tracking-[0.16em] text-[var(--accent)]">{item.timeLabel}</p>
                              <p className="mt-1 font-medium text-[var(--text)]">{item.studentName}</p>
                              <p className="mt-1 text-sm text-[var(--text-muted)]">{item.bookingName}</p>
                            </button>
                          ))
                        ) : (
                          <p className="rounded-2xl border border-dashed border-[var(--border)] bg-[var(--surface-muted)] px-3 py-4 text-sm text-[var(--text-muted)]">
                            {copy.noBookings}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </aside>
            </div>
          ) : (
            <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
              {monthDays.map((day) => {
                const dayItems = items.filter((item) => item.scheduledAt.toDateString() === day.toDateString());
                const inMonth = day.getMonth() === anchorDate.getMonth();

                return (
                  <div key={day.toISOString()} className={`rounded-[22px] border p-4 ${inMonth ? "border-[var(--border)] bg-white" : "border-[var(--border)] bg-[var(--surface-muted)] opacity-60"}`}>
                    <p className="text-xs uppercase tracking-[0.18em] text-[var(--text-muted)]">{formatDate(day, locale, { weekday: "short" })}</p>
                    <p className="mt-2 text-lg font-semibold text-[var(--text)]">{day.getDate()}</p>
                    <div className="mt-3 grid gap-2">
                      {dayItems.slice(0, 3).map((item) => (
                        <button key={item.id} onClick={() => setEditingItem({ id: item.id, date: item.scheduledAt.toISOString().slice(0, 10), time: `${`${item.scheduledAt.getHours()}`.padStart(2, "0")}:${`${item.scheduledAt.getMinutes()}`.padStart(2, "0")}`, notes: item.notes || "" })} className="rounded-2xl border border-[var(--border)] bg-[var(--surface-muted)] px-3 py-2 text-left text-sm text-[var(--text-muted)]">
                          {formatTime(item.scheduledAt, locale)} - {item.studentName}
                        </button>
                      ))}
                      {dayItems.length === 0 ? <p className="text-sm text-[var(--text-muted)]">{copy.noBookings}</p> : null}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        <div className={`grid gap-6 ${compact ? "xl:grid-cols-2" : "xl:grid-cols-[1fr_1fr]"}`}>
          <section className="rounded-[32px] border border-[var(--border)] bg-[var(--surface-solid)] p-5 shadow-[var(--shadow-soft)] sm:p-6">
            <div className="flex items-center gap-3">
              <CalendarDays size={18} className="text-[var(--accent)]" />
              <h3 className="text-xl font-semibold text-[var(--text)]">{copy.lastFive}</h3>
            </div>
            <div className="mt-5 grid gap-3">
              {pastItems.length > 0 ? pastItems.map((item) => renderCard(item, false)) : <EmptyState title={copy.noPast} text={copy.noPastText} />}
            </div>
          </section>

          <section className="rounded-[32px] border border-[var(--border)] bg-[var(--surface-solid)] p-5 shadow-[var(--shadow-soft)] sm:p-6">
            <div className="flex items-center gap-3">
              <Clock3 size={18} className="text-[var(--accent)]" />
              <h3 className="text-xl font-semibold text-[var(--text)]">{copy.nextFive}</h3>
            </div>
            <div className="mt-5 grid gap-3">
              {nextItems.length > 0 ? nextItems.map((item) => renderCard(item, false)) : <EmptyState title={copy.noUpcoming} text={copy.noUpcomingText} />}
            </div>
          </section>
        </div>
      </div>
    </>
  );
}
