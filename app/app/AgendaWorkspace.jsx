"use client";

import { useEffect, useMemo, useRef, useState } from "react";
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
  return rows.filter(isCoachAgendaItem).map((row) => ({
    ...row,
    scheduledAt: new Date(row.scheduled_at),
    studentName: row.students?.full_name || copy.clientFallback,
    clientColor: row.students?.client_color_hex || "#2ad07d",
    bookingName: row.booking_types?.name || row.item_type || copy.bookingFallback,
  }));
}

function isCoachAgendaItem(row) {
  const type = String(row.item_type || "").toLowerCase();
  if (!type) return true;
  return !["activity", "external", "health", "solo", "client_activity", "imported"].some((blocked) => type.includes(blocked));
}

function statusLabel(value) {
  return (value || "scheduled").replace(/_/g, " ");
}

function inputDateValue(date) {
  const value = new Date(date);
  return `${value.getFullYear()}-${`${value.getMonth() + 1}`.padStart(2, "0")}-${`${value.getDate()}`.padStart(2, "0")}`;
}

const COMPACT_DAY_START_HOUR = 6;
const COMPACT_DAY_END_HOUR = 22;
const COMPACT_HOUR_HEIGHT = 42;
const COMPACT_HEADER_HEIGHT = 44;
const COMPACT_HOURS = Array.from({ length: COMPACT_DAY_END_HOUR - COMPACT_DAY_START_HOUR + 1 }, (_, index) => COMPACT_DAY_START_HOUR + index);

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
  const [now, setNow] = useState(new Date());
  const compactCalendarRef = useRef(null);
  const handleOpenCreateBooking = (date) => {
    if (typeof onOpenCreateBooking === "function") onOpenCreateBooking(date ? { scheduledDate: inputDateValue(date) } : undefined);
  };

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

  const compactNowHour = now.getHours() + now.getMinutes() / 60;
  const showCompactNow = compact && mode === "week" && now >= range.start && now < range.end && compactNowHour >= COMPACT_DAY_START_HOUR && compactNowHour <= COMPACT_DAY_END_HOUR;
  const compactNowTop = (compactNowHour - COMPACT_DAY_START_HOUR) * COMPACT_HOUR_HEIGHT;

  function compactItemStyle(item) {
    const hourValue = item.scheduledAt.getHours() + item.scheduledAt.getMinutes() / 60;
    const top = COMPACT_HEADER_HEIGHT + Math.max(0, hourValue - COMPACT_DAY_START_HOUR) * COMPACT_HOUR_HEIGHT;
    return {
      top: `${top}px`,
      minHeight: "34px",
    };
  }

  useEffect(() => {
    if (!compact || mode !== "week" || !compactCalendarRef.current) return;
    if (!showCompactNow) {
      compactCalendarRef.current.scrollTop = Math.max(0, (8 - COMPACT_DAY_START_HOUR) * COMPACT_HOUR_HEIGHT);
      return;
    }
    compactCalendarRef.current.scrollTop = Math.max(0, compactNowTop - 120);
  }, [compact, compactNowTop, mode, showCompactNow]);

  useEffect(() => {
    if (!compact) return undefined;
    const timer = window.setInterval(() => setNow(new Date()), 60000);
    return () => window.clearInterval(timer);
  }, [compact]);

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
        className={`${compact ? "min-w-0 rounded-[14px] p-2" : "rounded-[18px] p-3"} w-full overflow-hidden border border-[var(--border)] bg-white text-left shadow-[var(--shadow-soft)]`}
      >
        <div className="flex min-w-0 items-start justify-between gap-2">
          <div className="flex min-w-0 items-center gap-1.5">
            {draggable ? <GripVertical size={compact ? 12 : 16} className="shrink-0 text-[var(--text-muted)]" /> : null}
            <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ background: item.clientColor }} />
            <span className={`${compact ? "text-[9px] tracking-[0.1em]" : "text-xs tracking-[0.16em]"} min-w-0 truncate uppercase text-[var(--text-muted)]`}>{statusLabel(item.status)}</span>
          </div>
          {!compact ? <PencilLine size={16} className="shrink-0 text-[var(--text-muted)]" /> : null}
        </div>
        <p className={`${compact ? "mt-2 text-sm" : "mt-3 text-base"} truncate font-semibold text-[var(--text)]`}>{item.studentName}</p>
        <p className={`${compact ? "text-[10px] tracking-[0.1em]" : "text-[11px] tracking-[0.14em]"} mt-1 truncate uppercase text-[var(--text-muted)]`}>{item.bookingName}</p>
        <p className={`${compact ? "text-xs" : "text-sm"} mt-1 text-[var(--text-muted)]`}>{formatTime(item.scheduledAt, locale)}</p>
        {!compact && item.notes ? <p className="mt-2 line-clamp-2 text-sm text-[var(--text-muted)]">{item.notes}</p> : null}
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
        <section className={`${compact ? "grid h-[640px] grid-rows-[auto_minmax(0,1fr)] p-3" : "p-4"} overflow-hidden rounded-[26px] border border-slate-200/80 bg-white shadow-[0_18px_48px_rgba(15,23,42,0.045)]`}>
          <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
            <div>
              <p className="text-[10px] uppercase tracking-[0.16em] text-[var(--accent)]">{copy.agenda}</p>
              <h2 className={`${compact ? "text-base" : "text-lg"} mt-1 font-semibold text-[var(--text)]`}>
                {compact ? copy.weeklyCalendar || copy.weeklyMonthly : copy.liveScheduling}
              </h2>
              {!compact ? <p className="mt-1 text-sm leading-6 text-[var(--text-muted)]">{copy.dailySubtitle || copy.liveScheduling}</p> : null}
            </div>

            <div className="flex flex-wrap gap-2">
              <div className="inline-flex rounded-full border border-[var(--border)] bg-[var(--surface-muted)] p-1">
                {["week", "month"].map((value) => (
                  <button
                    key={value}
                    onClick={() => setMode(value)}
                    className={`rounded-full px-3 py-1.5 text-xs font-medium ${mode === value ? "bg-[var(--accent)] text-[var(--accent-foreground)]" : "text-[var(--text-muted)]"}`}
                  >
                    {value === "week" ? copy.week : copy.month}
                  </button>
                ))}
              </div>
              <div className="inline-flex items-center gap-1.5 rounded-full border border-[var(--border)] bg-white px-2 py-1.5">
                <button onClick={() => moveRange(-1)} className="rounded-full p-1.5 text-[var(--text-muted)]">
                  <ChevronLeft size={14} />
                </button>
                <span className="text-xs font-medium text-[var(--text)]">
                  {mode === "month"
                    ? formatDate(range.start, locale, { month: "long", year: "numeric" })
                    : `${formatDate(range.start, locale, { day: "2-digit", month: "short" })} - ${formatDate(new Date(range.end.getTime() - 86400000), locale, { day: "2-digit", month: "short" })}`}
                </span>
                <button onClick={() => moveRange(1)} className="rounded-full p-1.5 text-[var(--text-muted)]">
                  <ChevronRight size={14} />
                </button>
              </div>
              <button onClick={jumpToToday} className="inline-flex items-center gap-1.5 rounded-full border border-[var(--border)] bg-white px-3 py-2 text-xs font-medium text-[var(--text)]">
                <CalendarDays size={14} />
                {copy.today || "Today"}
              </button>
              <button onClick={() => handleOpenCreateBooking()} className="inline-flex items-center gap-1.5 rounded-full border border-[var(--accent)]/30 bg-[var(--accent-soft)] px-3 py-2 text-xs font-semibold text-[var(--accent-strong)]">
                <Plus size={14} />
                {copy.newBooking}
              </button>
            </div>
          </div>

          {error ? <div className="mt-5 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</div> : null}
          {loading ? <div className="mt-5 inline-flex items-center gap-3 rounded-full border border-[var(--border)] bg-[var(--surface-muted)] px-4 py-3 text-sm text-[var(--text-muted)]"><LoaderCircle size={16} className="animate-spin text-[var(--accent)]" />{copy.loadingAgenda}</div> : null}

          {mode === "week" && compact ? (
            <div className="mt-3 min-h-0 overflow-hidden rounded-[20px] border border-slate-200/70 bg-white shadow-[inset_0_1px_0_rgba(255,255,255,0.9)]">
              <div className="relative grid h-full grid-cols-[48px_repeat(7,minmax(0,1fr))] grid-rows-[44px_1fr] overflow-hidden">
                <div className="border-r border-slate-100 bg-slate-50/80" />
                {weekDays.map((day) => {
                  const isToday = day.toDateString() === new Date().toDateString();
                  return (
                    <div key={`head-${day.toISOString()}`} className={`border-r border-slate-100 px-2 py-2 last:border-r-0 ${isToday ? "bg-[var(--accent-soft)]" : "bg-slate-50/80"}`}>
                      <div className="flex items-start justify-between gap-1">
                        <div className="min-w-0">
                          <p className="truncate text-[9px] uppercase tracking-[0.1em] text-[var(--text-muted)]">{formatDate(day, locale, { weekday: "short" })}</p>
                          <p className={`text-sm font-semibold ${isToday ? "text-[var(--accent-strong)]" : "text-[var(--text)]"}`}>{formatDate(day, locale, { day: "2-digit" })}</p>
                        </div>
                        <button onClick={() => handleOpenCreateBooking(day)} className="rounded-full border border-[var(--border)] bg-white p-1 text-[var(--accent-strong)] shadow-sm" aria-label={copy.newBooking}>
                          <Plus size={12} />
                        </button>
                      </div>
                    </div>
                  );
                })}

                <div ref={compactCalendarRef} className="relative col-span-8 h-full overflow-y-auto overscroll-contain">
                  <div className="relative grid grid-cols-[48px_repeat(7,minmax(0,1fr))]" style={{ minHeight: `${COMPACT_HOURS.length * COMPACT_HOUR_HEIGHT}px` }}>
                  <div className="relative border-r border-slate-100 bg-slate-50/80">
                    {COMPACT_HOURS.map((hour) => (
                      <div key={hour} className="border-b border-slate-100 pr-1 text-right text-[10px] leading-none text-[var(--text-muted)]" style={{ height: `${COMPACT_HOUR_HEIGHT}px` }}>
                        <span className="-translate-y-1.5 inline-block">{`${hour}`.padStart(2, "0")}:00</span>
                      </div>
                    ))}
                  </div>
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
                        className="relative min-w-0 border-r border-slate-100 bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(249,250,251,0.72))] last:border-r-0"
                      >
                        {COMPACT_HOURS.map((hour) => <div key={hour} className="border-b border-slate-100" style={{ height: `${COMPACT_HOUR_HEIGHT}px` }} />)}
                        {dayItems.map((item) => (
                          <button
                            key={item.id}
                            draggable
                            onDragStart={(event) => event.dataTransfer.setData("text/plain", item.id)}
                            onClick={() =>
                              setEditingItem({
                                id: item.id,
                                date: item.scheduledAt.toISOString().slice(0, 10),
                                time: `${`${item.scheduledAt.getHours()}`.padStart(2, "0")}:${`${item.scheduledAt.getMinutes()}`.padStart(2, "0")}`,
                                notes: item.notes || "",
                              })
                            }
                            className="absolute left-1 right-1 overflow-hidden rounded-xl bg-emerald-50 px-2 py-1 text-left shadow-[0_8px_18px_rgba(15,23,42,0.07)] ring-1 ring-emerald-200/80"
                            style={compactItemStyle(item)}
                          >
                            <p className="truncate text-[10px] font-semibold leading-4 text-[var(--text)]">{formatTime(item.scheduledAt, locale)} {item.studentName}</p>
                            <p className="truncate text-[9px] uppercase tracking-[0.08em] text-[var(--text-muted)]">{item.bookingName}</p>
                          </button>
                        ))}
                      </div>
                    );
                  })}
                  {showCompactNow ? (
                    <div className="pointer-events-none absolute left-12 right-0 z-10 flex items-center" style={{ top: `${compactNowTop}px` }}>
                      <span className="h-2 w-2 rounded-full bg-rose-500" />
                      <span className="mr-1 rounded-full bg-rose-500 px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-[0.08em] text-white">agora</span>
                      <span className="h-px flex-1 bg-rose-500" />
                    </div>
                  ) : null}
                  </div>
                </div>
              </div>
            </div>
          ) : mode === "week" ? (
            <div className="mt-5 min-w-0">
              <div className={`${compact ? "grid-cols-7 gap-2" : "gap-3 xl:grid-cols-7"} grid min-w-0`}>
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
                      className={`${compact ? "min-w-0 rounded-[16px] p-2" : "rounded-[18px] p-3"} border ${day.toDateString() === new Date().toDateString() ? "border-[var(--accent)] bg-[linear-gradient(180deg,rgba(233,251,241,0.95),rgba(255,255,255,0.98))]" : "border-[var(--border)] bg-[var(--surface-muted)]"}`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <p className={`${compact ? "text-[9px] tracking-[0.1em]" : "text-[10px] tracking-[0.14em]"} truncate uppercase text-[var(--text-muted)]`}>{formatDate(day, locale, { weekday: "short" })}</p>
                          <p className={`${compact ? "text-xs" : "mt-1 text-sm"} font-semibold text-[var(--text)]`}>{formatDate(day, locale, compact ? { day: "2-digit" } : { day: "2-digit", month: "short" })}</p>
                        </div>
                        <button onClick={() => handleOpenCreateBooking(day)} className="rounded-full border border-[var(--border)] bg-white p-1.5 text-[var(--accent-strong)] shadow-sm" aria-label={copy.newBooking}>
                          <Plus size={13} />
                        </button>
                      </div>
                      <div className={`${compact ? "mt-2 gap-1.5" : "mt-2.5 gap-2"} grid min-w-0`}>
                        {dayItems.length > 0 ? dayItems.map((item) => renderCard(item, true)) : <p className={`${compact ? "text-xs" : "text-sm"} leading-5 text-[var(--text-muted)]`}>{copy.dropHere}</p>}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className={`${compact ? "mt-3 grid-cols-7 gap-2" : "mt-5 gap-3 sm:grid-cols-2 xl:grid-cols-5"} grid`}>
              {monthDays.map((day) => {
                const dayItems = items.filter((item) => item.scheduledAt.toDateString() === day.toDateString());
                const inMonth = day.getMonth() === anchorDate.getMonth();
                const isToday = day.toDateString() === new Date().toDateString();

                return (
                  <div key={day.toISOString()} className={`${compact ? "h-[68px] rounded-[14px] p-2" : "rounded-[18px] p-3"} overflow-hidden border ${isToday ? "border-[var(--accent)] bg-[var(--accent-soft)]" : inMonth ? "border-[var(--border)] bg-white" : "border-[var(--border)] bg-[var(--surface-muted)] opacity-60"}`}>
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p className={`${compact ? "text-[9px] tracking-[0.08em]" : "text-[10px] tracking-[0.14em]"} truncate uppercase text-[var(--text-muted)]`}>{formatDate(day, locale, { weekday: "short" })}</p>
                        <p className={`${compact ? "mt-0.5 text-sm" : "mt-1.5 text-base"} font-semibold ${isToday ? "text-[var(--accent-strong)]" : "text-[var(--text)]"}`}>{day.getDate()}</p>
                      </div>
                      <button onClick={() => handleOpenCreateBooking(day)} className={`${compact ? "p-1" : "p-1.5"} rounded-full border border-[var(--border)] bg-white text-[var(--accent-strong)] shadow-sm`} aria-label={copy.newBooking}>
                        <Plus size={13} />
                      </button>
                    </div>
                    <div className={`${compact ? "mt-1 gap-1" : "mt-2.5 gap-2"} grid`}>
                      {dayItems.slice(0, 3).map((item) => (
                        <button key={item.id} onClick={() => setEditingItem({ id: item.id, date: item.scheduledAt.toISOString().slice(0, 10), time: `${`${item.scheduledAt.getHours()}`.padStart(2, "0")}:${`${item.scheduledAt.getMinutes()}`.padStart(2, "0")}`, notes: item.notes || "" })} className={`${compact ? "rounded-lg px-1.5 py-1 text-[10px]" : "rounded-2xl px-3 py-2 text-sm"} truncate border border-[var(--border)] bg-[var(--surface-muted)] text-left text-[var(--text-muted)]`}>
                          {formatTime(item.scheduledAt, locale)} - {item.studentName}
                        </button>
                      ))}
                      {dayItems.length === 0 && !compact ? <p className="text-sm text-[var(--text-muted)]">{copy.noBookings}</p> : null}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {!compact ? <div className="grid gap-4 xl:grid-cols-[0.9fr_1.1fr]">
          <section className="rounded-[20px] border border-[var(--border)] bg-[var(--surface-solid)] p-4 shadow-[var(--shadow-soft)]">
            <div className="flex items-center gap-3">
              <CalendarDays size={18} className="text-[var(--accent)]" />
              <h3 className="text-base font-semibold text-[var(--text)]">{copy.lastFive}</h3>
            </div>
            <div className="mt-4 grid gap-2">
              {pastItems.length > 0 ? pastItems.slice(-3).map((item) => renderCard(item, false)) : <EmptyState title={copy.noPast} text={copy.noPastText} />}
            </div>
          </section>

          <section className="rounded-[20px] border border-[var(--border)] bg-[var(--surface-solid)] p-4 shadow-[var(--shadow-soft)]">
            <div className="flex items-center gap-3">
              <Clock3 size={18} className="text-[var(--accent)]" />
              <h3 className="text-base font-semibold text-[var(--text)]">{copy.nextFive}</h3>
            </div>
            <div className="mt-4 grid gap-2">
              {nextItems.length > 0 ? nextItems.slice(0, 5).map((item) => renderCard(item, false)) : <EmptyState title={copy.noUpcoming} text={copy.noUpcomingText} />}
            </div>
          </section>
        </div> : null}
      </div>
    </>
  );
}
