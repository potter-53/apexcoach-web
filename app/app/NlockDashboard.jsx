"use client";

import {
  ArrowRight,
  Bell,
  CalendarDays,
  Camera,
  Cake,
  CheckCircle2,
  ChevronRight,
  ClipboardCheck,
  Copy,
  Crown,
  Dumbbell,
  ExternalLink,
  LayoutDashboard,
  Menu,
  MoreHorizontal,
  Plus,
  Pencil,
  ReceiptEuro,
  Search,
  Share2,
  SlidersHorizontal,
  Settings,
  LogOut,
  Mail,
  ShieldCheck,
  UserRound,
  Users,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ThemeToggle from "../../src/components/ThemeToggle";
import { getSupabaseBrowserClient, getVerifiedSupabaseUser, isSupabaseConfigured } from "../../src/lib/supabase-browser";
import NlockLogo from "./NlockLogo";

const nav = [
  { id: "dashboard", label: "Visão geral", icon: LayoutDashboard },
  { id: "clients", label: "Clientes", icon: Users },
  { id: "agenda", label: "Agenda", icon: CalendarDays },
  { id: "training", label: "Treinos", icon: Dumbbell },
  { id: "assessments", label: "Avaliações", icon: ClipboardCheck },
  { id: "billing", label: "Contabilização", icon: ReceiptEuro },
];

const PERIOD_OPTIONS = [
  { id: "month", label: "Mês" },
  { id: "year", label: "Ano" },
  { id: "all", label: "Sempre" },
];

const EMPTY_DASHBOARD = { activeClients: 0, newClients: 0, completedSessions: 0, scheduledSessions: 0, assessments: 0, revenueCents: 0, pendingRevenueCents: 0, pendingInvoices: 0, todaySessions: [], recentClients: [], monthlyActivity: [] };

function isCanceled(status) {
  return String(status || "").toLowerCase().includes("cancel");
}

function isCompleted(status) {
  const value = String(status || "").toLowerCase();
  return ["completed", "done", "finished", "complete", "closed", "concluida", "concluido"].some((item) => value.includes(item));
}

function initials(name) {
  return String(name || "Coach").split(/\s+/).filter(Boolean).slice(0, 2).map((part) => part[0]).join("").toUpperCase();
}

function timeLabel(value) {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "--:--" : new Intl.DateTimeFormat("pt-PT", { hour: "2-digit", minute: "2-digit" }).format(date);
}

function dashboardRanges(period = "month") {
  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);
  const yearStart = new Date(now.getFullYear(), 0, 1);
  const nextYear = new Date(now.getFullYear() + 1, 0, 1);
  const periodStart = period === "year" ? yearStart : period === "all" ? new Date(2000, 0, 1) : monthStart;
  const periodEnd = period === "year" ? nextYear : period === "all" ? new Date(now.getFullYear() + 1, 0, 1) : nextMonth;
  return {
    now,
    periodStart,
    periodEnd,
    todayStart: new Date(now.getFullYear(), now.getMonth(), now.getDate()),
    tomorrowStart: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1),
  };
}

async function loadCoachDashboardMajor(supabase, coachId, period) {
  const { now, periodStart, periodEnd, todayStart, tomorrowStart } = dashboardRanges(period);
  const [studentsResult, monthAgendaResult, todayAgendaResult] = await Promise.all([
    supabase.from("students").select("id, full_name, main_goal, created_at, is_active, client_color_hex").eq("coach_id", coachId).order("created_at", { ascending: false }),
    supabase.from("agenda_items").select("id, scheduled_at, item_type, status").eq("coach_id", coachId).gte("scheduled_at", periodStart.toISOString()).lt("scheduled_at", periodEnd.toISOString()),
    supabase.from("agenda_items").select("id, scheduled_at, item_type, status, students(full_name), booking_types(name)").eq("coach_id", coachId).gte("scheduled_at", todayStart.toISOString()).lt("scheduled_at", tomorrowStart.toISOString()).order("scheduled_at", { ascending: true }),
  ]);
  const firstError = [studentsResult.error, monthAgendaResult.error, todayAgendaResult.error].find(Boolean);
  if (firstError) throw firstError;
  const activeStudents = (studentsResult.data || []).filter((student) => student.is_active !== false);
  const monthAgenda = (monthAgendaResult.data || []).filter((item) => !isCanceled(item.status));
  return {
    activeClients: activeStudents.length,
    newClients: activeStudents.filter((student) => { const created = new Date(student.created_at); return created >= periodStart && created < periodEnd; }).length,
    completedSessions: monthAgenda.filter((item) => new Date(item.scheduled_at) <= now).length,
    scheduledSessions: monthAgenda.filter((item) => new Date(item.scheduled_at) > now).length,
    todaySessions: (todayAgendaResult.data || []).filter((item) => !isCanceled(item.status)).map((item) => ({ id: item.id, time: timeLabel(item.scheduled_at), name: item.students?.full_name || "Cliente", type: item.booking_types?.name || (item.item_type === "physical_assessment" ? "Avaliação física" : "Sessão"), status: isCompleted(item.status) ? "Concluída" : new Date(item.scheduled_at) < now ? "Em curso" : "Agendada" })),
    recentClients: activeStudents.slice(0, 4).map((student) => ({ id: student.id, initials: initials(student.full_name), name: student.full_name || "Cliente", note: student.main_goal || "Sem objetivo principal definido", color: student.client_color_hex || "var(--accent)" })),
  };
}

async function loadCoachDashboardBackground(supabase, coachId, period) {
  const { now, periodStart, periodEnd } = dashboardRanges(period);
  const [activityResult, assessmentsResult, invoicesResult] = await Promise.all([
    supabase.from("agenda_items").select("id, scheduled_at, status").eq("coach_id", coachId).gte("scheduled_at", periodStart.toISOString()).lt("scheduled_at", periodEnd.toISOString()).lte("scheduled_at", now.toISOString()),
    supabase.from("assessments").select("id", { count: "exact", head: true }).eq("coach_id", coachId).gte("assessment_date", periodStart.toISOString().slice(0, 10)).lt("assessment_date", periodEnd.toISOString().slice(0, 10)),
    supabase.from("coach_invoices").select("total_cents, status, period_start, period_end").eq("coach_id", coachId).neq("status", "void"),
  ]);
  const firstError = [activityResult.error, assessmentsResult.error, invoicesResult.error].find(Boolean);
  if (firstError) throw firstError;
  const invoices = (invoicesResult.data || []).filter((invoice) => {
    const status = String(invoice.status || "").toLowerCase();
    if (["void", "canceled", "cancelled"].includes(status)) return false;
    const accountingDate = new Date(invoice.period_end || invoice.period_start);
    return !Number.isNaN(accountingDate.getTime()) && accountingDate >= periodStart && accountingDate < periodEnd;
  });
  const activityRows = (activityResult.data || []).filter((item) => isCompleted(item.status));
  const monthNames = period === "month"
    ? Array.from({ length: 5 }, (_, index) => ({ key: index, label: `S${index + 1}`, value: 0 }))
    : period === "year"
      ? Array.from({ length: 12 }, (_, month) => ({ key: month, label: new Intl.DateTimeFormat("pt-PT", { month: "short" }).format(new Date(now.getFullYear(), month, 1)).replace(".", ""), value: 0 }))
      : Array.from(new Set(activityRows.map((item) => new Date(item.scheduled_at).getFullYear()))).sort().map((year) => ({ key: year, label: String(year), value: 0 }));
  if (period === "all" && monthNames.length === 0) monthNames.push({ key: now.getFullYear(), label: String(now.getFullYear()), value: 0 });
  activityRows.forEach((item) => {
    const date = new Date(item.scheduled_at);
    const key = period === "month" ? Math.min(Math.floor((date.getDate() - 1) / 7), 4) : period === "year" ? date.getMonth() : date.getFullYear();
    const bucket = monthNames.find((entry) => entry.key === key);
    if (bucket) bucket.value += 1;
  });
  return {
    assessments: assessmentsResult.count || 0,
    revenueCents: invoices.reduce((total, invoice) => total + Number(invoice.total_cents || 0), 0),
    pendingInvoices: invoices.filter((invoice) => String(invoice.status).toLowerCase() !== "paid").length,
    pendingRevenueCents: invoices.filter((invoice) => String(invoice.status).toLowerCase() !== "paid").reduce((total, invoice) => total + Number(invoice.total_cents || 0), 0),
    monthlyActivity: monthNames,
  };
}

function Card({ children, className = "" }) {
  return <article className={`rounded-[20px] border border-[var(--border)] bg-[var(--surface-solid)] shadow-[var(--shadow-soft)] ${className}`}>{children}</article>;
}

function Sidebar({ expanded, toggle, collapse, active, setActive, coachName, coachEmail, coachAvatarUrl, openCoachProfile, onSignOut }) {
  return (
    <>
      {expanded ? <button aria-label="Recolher menu" onClick={collapse} className="fixed inset-0 z-40 bg-black/35 backdrop-blur-sm lg:hidden" /> : null}
      <aside className={`fixed inset-y-0 left-0 z-50 flex flex-col overflow-hidden border-r border-[var(--border)] bg-[var(--app-sidebar)] py-5 transition-[width,padding] duration-300 ${expanded ? "w-[268px] px-5 lg:w-[238px]" : "w-[76px] px-3"}`}>
        <div className={`flex items-center ${expanded ? "justify-between" : "flex-col gap-3"}`}>
          <NlockLogo compact={!expanded} />
          <button onClick={toggle} className="grid h-10 w-10 shrink-0 place-items-center rounded-xl text-[var(--text-muted)] transition hover:bg-[var(--surface-muted)] hover:text-[var(--text)]" aria-label={expanded ? "Recolher menu" : "Expandir menu"} title={expanded ? "Recolher menu" : "Expandir menu"}>{expanded ? <X size={18} /> : <Menu size={18} />}</button>
        </div>

        <button type="button" onClick={openCoachProfile} className={`mt-8 flex w-full items-center rounded-2xl border text-left transition ${active === "profile" ? "border-[var(--accent)] bg-[var(--accent-soft)]" : "border-[var(--border)] bg-[var(--surface-muted)] hover:border-[var(--accent)]"} ${expanded ? "gap-3 p-3" : "justify-center p-1.5"}`} title={!expanded ? `${coachName}${coachEmail ? ` · ${coachEmail}` : ""}` : undefined} aria-label={`Abrir perfil de ${coachName}`}>
          <span className="grid h-10 w-10 shrink-0 place-items-center overflow-hidden rounded-xl bg-[#0d1715] text-xs font-bold text-white">{coachAvatarUrl ? <img src={coachAvatarUrl} alt="" className="h-full w-full object-cover" /> : initials(coachName)}</span>
          {expanded ? <><div className="min-w-0"><p className="truncate text-sm font-semibold text-[var(--text)]">{coachName}</p><p className="mt-1 truncate text-[10px] font-medium text-[var(--text-muted)]">{coachEmail || "Coach NLOCK"}</p></div><MoreHorizontal size={16} className="ml-auto shrink-0 text-[var(--text-subtle)]" /></> : null}
        </button>

        {expanded ? <p className="mb-2 mt-8 px-3 text-[9px] font-bold uppercase tracking-[0.2em] text-[var(--text-subtle)]">Workspace</p> : <div className="mt-8" />}
        <nav className="grid gap-1">
          {nav.map(({ id, label, icon: Icon }) => {
            const selected = active === id;
            return <button key={id} title={!expanded ? label : undefined} aria-label={label} onClick={() => { setActive(id); if (window.innerWidth < 1024) collapse(); }} className={`group flex min-h-11 items-center rounded-xl text-left text-sm font-medium transition ${expanded ? "gap-3 px-3" : "justify-center px-0"} ${selected ? "bg-[var(--accent-soft)] text-[var(--accent-strong)]" : "text-[var(--text-muted)] hover:bg-[var(--surface-muted)] hover:text-[var(--text)]"}`}><Icon size={18} className="shrink-0" />{expanded ? <span className="whitespace-nowrap">{label}</span> : null}{selected && expanded ? <span className="ml-auto h-1.5 w-1.5 rounded-full bg-[var(--accent)]" /> : null}</button>;
          })}
        </nav>

        <div className="mt-auto border-t border-[var(--border)] pt-4">
          <button title={!expanded ? "Definições" : undefined} aria-label="Definições" className={`flex min-h-11 w-full items-center rounded-xl text-sm font-medium text-[var(--text-muted)] hover:bg-[var(--surface-muted)] hover:text-[var(--text)] ${expanded ? "gap-3 px-3" : "justify-center"}`}><Settings size={18} />{expanded ? <span>Definições</span> : null}</button>
          <button title={!expanded ? "Terminar sessão" : undefined} aria-label="Terminar sessão" onClick={onSignOut} className={`flex min-h-11 w-full items-center rounded-xl text-sm font-medium text-[var(--text-muted)] hover:bg-[var(--surface-muted)] hover:text-[var(--text)] ${expanded ? "gap-3 px-3" : "justify-center"}`}><LogOut size={18} />{expanded ? <span className="whitespace-nowrap">Terminar sessão</span> : null}</button>
          {expanded ? <p className="mt-4 whitespace-nowrap px-3 text-[8px] font-semibold uppercase tracking-[0.19em] text-[var(--text-subtle)]">Less time wasted.</p> : null}
        </div>
      </aside>
    </>
  );
}

function Metric({ label, value, detail, icon: Icon, onClick }) {
  return <button type="button" onClick={onClick} className="rounded-[20px] border border-[var(--border)] bg-[var(--surface-solid)] p-4 text-left shadow-[var(--shadow-soft)] transition hover:-translate-y-0.5 hover:border-[var(--accent)] hover:shadow-[var(--shadow-card-hover)] sm:p-5"><div className="flex items-start justify-between"><p className="text-xs font-medium text-[var(--text-muted)]">{label}</p><span className="grid h-9 w-9 place-items-center rounded-xl bg-[var(--accent-soft)] text-[var(--accent-strong)]"><Icon size={16} /></span></div><p className="mt-5 text-3xl font-semibold tracking-[-0.05em] text-[var(--text)]">{value}</p><div className="mt-2 flex items-center justify-between gap-2"><p className="text-[11px] font-semibold text-[var(--accent-strong)]">{detail}</p><ChevronRight size={14} className="text-[var(--text-subtle)]" /></div></button>;
}

function DashboardHome({ data, majorLoading, backgroundLoading, error, onRetry, onNavigate, period, onPeriodChange }) {
  const chartMax = Math.max(...data.monthlyActivity.map((item) => item.value), 1);
  const today = new Intl.DateTimeFormat("pt-PT", { day: "2-digit", month: "long" }).format(new Date());
  const revenue = new Intl.NumberFormat("pt-PT", { style: "currency", currency: "EUR" }).format(data.revenueCents / 100);
  const pendingRevenue = new Intl.NumberFormat("pt-PT", { style: "currency", currency: "EUR" }).format(data.pendingRevenueCents / 100);
  const periodLabel = period === "year" ? "ano atual" : period === "all" ? "desde sempre" : "mês atual";
  return (
    <div className="grid gap-4">
      {error ? <div role="alert" className="flex items-center justify-between gap-4 rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-xs text-red-600"><span>Não foi possível carregar todos os dados do dashboard.</span><button onClick={onRetry} className="font-bold">Tentar novamente</button></div> : null}
      <div className="flex items-center justify-between gap-3"><p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[var(--text-subtle)]">Timeline dos dados</p><div className="inline-flex rounded-xl border border-[var(--border)] bg-[var(--surface-solid)] p-1">{PERIOD_OPTIONS.map((option) => <button key={option.id} type="button" onClick={() => onPeriodChange(option.id)} className={`min-h-9 rounded-lg px-3 text-xs font-semibold transition ${period === option.id ? "bg-[var(--accent-soft)] text-[var(--accent-strong)]" : "text-[var(--text-muted)] hover:text-[var(--text)]"}`}>{option.label}</button>)}</div></div>
      <button type="button" onClick={() => onNavigate("agenda")} className="rounded-[20px] border border-[var(--border)] bg-[var(--surface-solid)] p-5 text-left shadow-[var(--shadow-soft)] transition hover:border-[var(--accent)] hover:shadow-[var(--shadow-card-hover)] sm:p-6">
        <div className="flex items-center justify-between"><div><p className="text-[9px] font-bold uppercase tracking-[0.2em] text-[var(--accent-strong)]">Hoje · {today}</p><h2 className="mt-2 text-lg font-semibold">Agenda do dia</h2></div><span className="grid h-10 w-10 place-items-center rounded-xl border border-[var(--border)] text-[var(--text-muted)]"><ArrowRight size={15} /></span></div>
        <div className="mt-5 grid gap-2.5 md:grid-cols-2 xl:grid-cols-3">{majorLoading ? <p className="rounded-2xl bg-[var(--surface-muted)] px-4 py-7 text-center text-xs text-[var(--text-muted)] md:col-span-2 xl:col-span-3">A carregar agenda…</p> : data.todaySessions.length ? data.todaySessions.map((item) => <div key={item.id} className="flex items-center gap-3 rounded-2xl border border-[var(--border)] bg-[var(--surface-muted)] p-3"><span className="h-9 w-1 rounded-full bg-[var(--accent)]" /><div className="min-w-0 flex-1"><p className="truncate text-sm font-semibold">{item.name}</p><p className="mt-1 truncate text-[10px] text-[var(--text-muted)]">{item.type}</p></div><div className="text-right"><p className="text-xs font-bold">{item.time}</p><p className="mt-1 text-[9px] text-[var(--accent-strong)]">{item.status}</p></div></div>) : <p className="rounded-2xl bg-[var(--surface-muted)] px-4 py-7 text-center text-xs text-[var(--text-muted)] md:col-span-2 xl:col-span-3">Sem sessões agendadas para hoje.</p>}</div>
      </button>
      <section className="grid grid-cols-2 gap-3 xl:grid-cols-5">
        <Metric label="Clientes ativos" value={majorLoading ? "—" : data.activeClients} detail={majorLoading ? "A carregar" : `+${data.newClients} · ${periodLabel}`} icon={Users} onClick={() => onNavigate("clients")} />
        <Metric label="Sessões concluídas" value={majorLoading ? "—" : data.completedSessions} detail={majorLoading ? "A carregar" : periodLabel} icon={CheckCircle2} onClick={() => onNavigate("training")} />
        <Metric label="Sessões agendadas" value={majorLoading ? "—" : data.scheduledSessions} detail={majorLoading ? "A carregar" : periodLabel} icon={CalendarDays} onClick={() => onNavigate("agenda")} />
        <Metric label="Avaliações" value={backgroundLoading ? "—" : data.assessments} detail={backgroundLoading ? "A sincronizar" : periodLabel} icon={ClipboardCheck} onClick={() => onNavigate("assessments")} />
        <Metric label="Contabilização" value={backgroundLoading ? "—" : revenue} detail={backgroundLoading ? "A sincronizar" : `Pendente: ${pendingRevenue}`} icon={ReceiptEuro} onClick={() => onNavigate("billing")} />
      </section>
      <section className="grid gap-4 xl:grid-cols-[1.18fr_.82fr]">
        <button type="button" onClick={() => onNavigate("training")} className="overflow-hidden rounded-[20px] border border-[var(--border)] bg-[var(--surface-solid)] p-5 text-left shadow-[var(--shadow-soft)] transition hover:border-[var(--accent)] hover:shadow-[var(--shadow-card-hover)] sm:p-6">
          <div className="flex items-start justify-between gap-4"><div><p className="text-[9px] font-bold uppercase tracking-[0.2em] text-[var(--accent-strong)]">Atividade</p><h2 className="mt-2 text-lg font-semibold">Sessões concluídas</h2><p className="mt-1 text-xs text-[var(--text-muted)]">Distribuição dentro da timeline selecionada</p></div><span className="rounded-xl border border-[var(--border)] px-3 py-2 text-xs font-semibold capitalize text-[var(--text-muted)]">{periodLabel}</span></div>
          <div className="mt-7 h-[230px] rounded-2xl bg-[var(--surface-muted)] p-4">{backgroundLoading ? <div className="grid h-full place-items-center text-xs text-[var(--text-muted)]">A sincronizar histórico…</div> : <div className="flex h-full items-end gap-2 border-b border-[var(--border)] px-2 pb-7 sm:gap-3">{data.monthlyActivity.map((item) => <div key={item.key} className="group relative flex h-full flex-1 items-end"><div title={`${item.value} sessões`} className="w-full min-h-[3px] rounded-t-lg bg-[image:var(--brand-gradient)] opacity-80" style={{ height: `${Math.max((item.value / chartMax) * 100, item.value ? 8 : 2)}%` }} /><span className="absolute -bottom-5 left-1/2 -translate-x-1/2 text-[9px] capitalize text-[var(--text-subtle)]">{item.label}</span><span className="absolute left-1/2 -translate-x-1/2 text-[9px] font-bold text-[var(--text)]" style={{ bottom: `${Math.max((item.value / chartMax) * 100, item.value ? 8 : 2)}%` }}>{item.value}</span></div>)}</div>}</div>
        </button>
        <button type="button" onClick={() => onNavigate("clients")} className="rounded-[20px] border border-[var(--border)] bg-[var(--surface-solid)] p-5 text-left shadow-[var(--shadow-soft)] transition hover:border-[var(--accent)] hover:shadow-[var(--shadow-card-hover)] sm:p-6"><div className="flex items-center justify-between"><div><p className="text-[9px] font-bold uppercase tracking-[0.2em] text-[var(--accent-strong)]">Clientes</p><h2 className="mt-2 text-lg font-semibold">Adicionados recentemente</h2></div><ChevronRight size={16} className="text-[var(--text-subtle)]" /></div><div className="mt-5 grid gap-3">{majorLoading ? <p className="rounded-2xl bg-[var(--surface-muted)] px-4 py-8 text-center text-xs text-[var(--text-muted)]">A carregar clientes…</p> : data.recentClients.length ? data.recentClients.map((client) => <div key={client.id} className="flex items-center gap-3 rounded-2xl border border-[var(--border)] p-3"><span className="grid h-10 w-10 place-items-center rounded-xl text-[10px] font-bold text-white" style={{ backgroundColor: client.color }}>{client.initials}</span><div className="min-w-0"><p className="truncate text-sm font-semibold">{client.name}</p><p className="mt-1 truncate text-[10px] text-[var(--text-muted)]">{client.note}</p></div></div>) : <p className="rounded-2xl bg-[var(--surface-muted)] px-4 py-8 text-center text-xs text-[var(--text-muted)]">Ainda não existem clientes ativos.</p>}</div></button>
      </section>
    </div>
  );
}

function clientAge(value) {
  if (!value) return null;
  const birth = new Date(value);
  if (Number.isNaN(birth.getTime())) return null;
  const now = new Date();
  let age = now.getFullYear() - birth.getFullYear();
  if (now < new Date(now.getFullYear(), birth.getMonth(), birth.getDate())) age -= 1;
  return age;
}

function clientBillingLabel(profile) {
  const status = String(profile?.status || "").toLowerCase();
  if (status === "paid") return "Pago";
  if (profile) return "Pendente";
  return "Por definir";
}

function clientPlanLabel(plan) {
  if (!plan) return "Sem plano";
  const duration = Number(plan.session_duration_minutes || 0);
  const suffix = duration ? `${duration} min` : "sessão";
  if (String(plan.plan_mode || "").toLowerCase().includes("pack")) return `${plan.pack_sessions_count || "—"} × ${suffix}`;
  return `${plan.sessions_per_week || "—"} × ${suffix} / semana`;
}

function ClientDetailPane({ student, agenda, assessments, billing, plan, protocol }) {
  if (!student) return <Card className="grid min-h-[620px] place-items-center p-8 text-center"><div><span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-[var(--surface-muted)] text-[var(--text-subtle)]"><UserRound size={23} /></span><h2 className="mt-5 text-lg font-semibold">Nenhum cliente selecionado</h2><p className="mt-2 text-xs text-[var(--text-muted)]">Seleciona um cliente na listagem para consultar a sua ficha.</p></div></Card>;
  const upcoming = agenda.filter((item) => item.student_id === student.id && !isCanceled(item.status)).slice(0, 4);
  const recentAssessments = assessments.filter((item) => item.student_id === student.id).slice(0, 4);
  const age = clientAge(student.birth_date);
  const sex = String(student.sex || "").toLowerCase().startsWith("m") ? "Masculino" : String(student.sex || "").toLowerCase().startsWith("f") ? "Feminino" : "Não definido";
  return <div className="grid h-full min-h-0 min-w-0 grid-rows-[auto_minmax(0,1fr)] gap-4">
    <Card className="overflow-hidden"><div className="h-24 bg-[image:var(--brand-gradient)] opacity-85" /><div className="-mt-8 px-5 pb-6"><div className="flex items-end gap-4"><span className="grid h-16 w-16 shrink-0 place-items-center rounded-[20px] border-4 border-[var(--surface-solid)] text-sm font-bold text-white" style={{ backgroundColor: student.client_color_hex || "#0d1715" }}>{initials(student.full_name)}</span><div className="min-w-0 pb-1"><p className="text-[9px] font-bold uppercase tracking-[0.18em] text-[var(--accent-strong)]">Cliente NLOCK</p><h2 className="mt-1 truncate text-2xl font-semibold">{student.full_name || "Cliente"}</h2><p className="mt-1 text-[10px] font-semibold text-[var(--text-muted)]">{sex} · {age == null ? "Idade N/D" : `${age} anos`} · {student.height_cm ? `${student.height_cm} cm` : "Altura N/D"}</p></div></div><div className="mt-5 grid grid-cols-3 gap-2">{[["Estado", student.is_active === false ? "Cliente inativo" : "Cliente ativo"],["Plano", clientPlanLabel(plan)],["Pagamento", clientBillingLabel(billing)]].map(([label,value], index) => <div key={label} className={`min-w-0 rounded-2xl border p-3 ${index === 0 && student.is_active !== false ? "border-[var(--accent)]/25 bg-[var(--accent-soft)]" : "border-[var(--border)] bg-[var(--surface-muted)]"}`}><p className="text-[9px] text-[var(--text-subtle)]">{label}</p><p className="mt-1 truncate text-xs font-bold">{value}</p></div>)}</div></div></Card>
    <div className="grid min-h-0 content-start gap-4 overflow-y-auto pr-1">
    <section className="grid gap-4 xl:grid-cols-2"><Card className="p-5"><p className="text-[9px] font-bold uppercase tracking-[0.18em] text-[var(--accent-strong)]">Informação principal</p><div className="mt-4 grid gap-3 text-sm"><p><span className="text-[var(--text-subtle)]">Email · </span>{student.email || "Não definido"}</p><p><span className="text-[var(--text-subtle)]">Objetivo · </span>{student.main_goal || "Sem objetivo principal definido"}</p></div></Card><Card className="p-5"><p className="text-[9px] font-bold uppercase tracking-[0.18em] text-[var(--accent-strong)]">Atividade</p><div className="mt-4 grid grid-cols-2 gap-3"><div><p className="text-[10px] text-[var(--text-subtle)]">Próxima sessão</p><p className="mt-1 text-xs font-semibold">{upcoming[0] ? `${readableDate(upcoming[0].scheduled_at)} · ${timeLabel(upcoming[0].scheduled_at)}` : "Sem marcação"}</p></div><div><p className="text-[10px] text-[var(--text-subtle)]">Última avaliação</p><p className="mt-1 text-xs font-semibold">{recentAssessments[0] ? readableDate(recentAssessments[0].assessment_date) : "Sem avaliação"}</p></div></div></Card></section>
    <Card className="p-5"><div className="flex items-start justify-between gap-4"><div><p className="text-[9px] font-bold uppercase tracking-[0.18em] text-[var(--accent-strong)]">Periodização</p><h3 className="mt-2 text-base font-semibold">{protocol?.protocol_label || "Sem protocolo ativo"}</h3></div><span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[var(--accent-soft)] text-[var(--accent-strong)]"><Dumbbell size={17} /></span></div>{protocol ? <><div className="mt-4 grid grid-cols-3 gap-2"><div className="rounded-xl bg-[var(--surface-muted)] p-3"><p className="text-[9px] text-[var(--text-subtle)]">Semana atual</p><p className="mt-1 text-sm font-bold">{protocol.protocol_current_week || "—"}</p></div><div className="rounded-xl bg-[var(--surface-muted)] p-3"><p className="text-[9px] text-[var(--text-subtle)]">Semanas restantes</p><p className="mt-1 text-sm font-bold">{protocol.protocol_weeks_remaining || "—"}</p></div><div className="rounded-xl bg-[var(--surface-muted)] p-3"><p className="text-[9px] text-[var(--text-subtle)]">Semanas planeadas</p><p className="mt-1 text-sm font-bold">{protocol.protocol_weeks_planned || "—"}</p></div></div><p className="mt-4 text-sm leading-6 text-[var(--text-muted)]">{protocol.protocol_objective || "Sem objetivo de protocolo definido."}</p></> : <p className="mt-3 text-xs text-[var(--text-muted)]">Ainda não existe um protocolo planeado para este cliente.</p>}</Card>
    <section className="grid gap-4 xl:grid-cols-2"><Card className="p-5"><p className="text-[9px] font-bold uppercase tracking-[0.18em] text-[var(--accent-strong)]">Próximas sessões</p><div className="mt-4 grid gap-2">{upcoming.length ? upcoming.map((item) => <div key={item.id} className="rounded-xl bg-[var(--surface-muted)] p-3"><p className="text-xs font-semibold">{item.booking_types?.name || "Sessão"}</p><p className="mt-1 text-[10px] text-[var(--text-muted)]">{readableDate(item.scheduled_at)} · {timeLabel(item.scheduled_at)}</p></div>) : <p className="text-xs text-[var(--text-muted)]">Sem sessões agendadas.</p>}</div></Card><Card className="p-5"><p className="text-[9px] font-bold uppercase tracking-[0.18em] text-[var(--accent-strong)]">Acompanhamento</p><div className="mt-4 grid gap-3"><div><p className="text-[10px] text-[var(--text-subtle)]">Avaliações recentes</p><p className="mt-1 text-xl font-semibold">{recentAssessments.length}</p></div><div><p className="text-[10px] text-[var(--text-subtle)]">Ciclo de cobrança</p><p className="mt-1 text-sm font-semibold">{billing?.billing_cycle || "Não configurado"}</p></div></div></Card></section>
    {student.clinical_history ? <Card className="p-5"><p className="text-[9px] font-bold uppercase tracking-[0.18em] text-[var(--accent-strong)]">Historial clínico</p><p className="mt-4 text-sm leading-6 text-[var(--text-muted)]">{student.clinical_history}</p></Card> : null}
    </div>
  </div>;
}

function ClientsWorkspace({ coachId, search, filters, setFilters, filterOpen, setFilterOpen }) {
  const [state, setState] = useState({ loading: true, enriching: true, error: "", students: [], agenda: [], assessments: [], billing: [], plans: [], protocols: [] });
  const [selected, setSelected] = useState(null);
  useEffect(() => {
    if (!coachId) return;
    let mounted = true;
    const supabase = getSupabaseBrowserClient();
    async function loadClients() {
      const studentsResult = await supabase.from("students").select("id, legacy_id_pessoa, full_name, birth_date, sex, height_cm, email, main_goal, clinical_history, created_at, is_active, tags, client_color_hex").eq("coach_id", coachId).order("full_name", { ascending: true });
      if (!mounted) return;
      if (studentsResult.error) { setState((currentState) => ({ ...currentState, loading: false, enriching: false, error: studentsResult.error.message })); return; }
      setState((currentState) => ({ ...currentState, loading: false, students: studentsResult.data || [] }));
      const nowIso = new Date().toISOString();
      const [agendaResult, assessmentsResult, billingResult, plansResult, protocolsResult] = await Promise.all([
        supabase.from("agenda_items").select("id, student_id, scheduled_at, status, item_type, booking_types(name)").eq("coach_id", coachId).gte("scheduled_at", nowIso).order("scheduled_at", { ascending: true }).limit(500),
        supabase.from("assessments").select("id, student_id, assessment_date").eq("coach_id", coachId).order("assessment_date", { ascending: false }).limit(500),
        supabase.from("client_billing_profiles").select("student_id, status, billing_cycle, amount_cents, currency_code, next_due_at"),
        supabase.from("client_training_plans").select("student_id, plan_mode, sessions_per_week, pack_sessions_count, session_duration_minutes"),
        supabase.from("training_sessions").select("id, student_id, session_date, protocol_label, protocol_objective, protocol_current_week, protocol_weeks_remaining, protocol_weeks_planned").eq("coach_id", coachId).order("session_date", { ascending: false }).limit(500),
      ]);
      if (mounted) setState((currentState) => ({ ...currentState, enriching: false, agenda: agendaResult.data || [], assessments: assessmentsResult.data || [], billing: billingResult.data || [], plans: plansResult.data || [], protocols: protocolsResult.data || [] }));
    }
    loadClients();
    return () => { mounted = false; };
  }, [coachId]);
  const activeCount = state.students.filter((student) => student.is_active !== false).length;
  const inactiveCount = state.students.length - activeCount;
  const monthStart = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
  const newCount = state.students.filter((student) => new Date(student.created_at) >= monthStart).length;
  const visible = state.students.filter((student) => {
    const activity = student.is_active !== false ? "active" : "inactive";
    if (filters.activity.length && !filters.activity.includes(activity)) return false;
    const sex = String(student.sex || "").toLowerCase().startsWith("m") ? "male" : String(student.sex || "").toLowerCase().startsWith("f") ? "female" : "";
    if (filters.sex.length && !filters.sex.includes(sex)) return false;
    const age = clientAge(student.birth_date);
    if (filters.ages.length && !filters.ages.some((range) => range === "under18" ? age != null && age < 18 : range === "18to29" ? age >= 18 && age <= 29 : range === "30to39" ? age >= 30 && age <= 39 : range === "40to49" ? age >= 40 && age <= 49 : age >= 50)) return false;
    if (filters.tags.length && !filters.tags.some((tag) => (student.tags || []).includes(tag))) return false;
    const query = search.trim().toLowerCase();
    return !query || [student.full_name, student.email, student.main_goal].some((value) => String(value || "").toLowerCase().includes(query));
  });
  const tags = Array.from(new Set(state.students.flatMap((student) => Array.isArray(student.tags) ? student.tags : []))).sort();
  const toggleFilter = (group, value) => setFilters((currentFilters) => ({ ...currentFilters, [group]: currentFilters[group].includes(value) ? currentFilters[group].filter((item) => item !== value) : [...currentFilters[group], value] }));
  const selectedStudent = selected && visible.some((student) => student.id === selected.id) ? selected : null;
  const selectedBilling = selectedStudent ? state.billing.find((item) => item.student_id === selectedStudent.id) : null;
  const selectedPlan = selectedStudent ? state.plans.find((item) => item.student_id === selectedStudent.id) : null;
  const selectedProtocol = selectedStudent ? state.protocols.find((item) => item.student_id === selectedStudent.id && (item.protocol_label || item.protocol_objective)) : null;
  return <div className="grid h-full min-h-0 gap-4 lg:grid-rows-[auto_minmax(0,1fr)] lg:overflow-hidden">
    <section className="grid grid-cols-2 gap-3 lg:grid-cols-4"><Metric label="Clientes totais" value={state.loading ? "—" : state.students.length} detail="Carteira completa" icon={Users} onClick={() => setFilters({ activity: [], sex: [], ages: [], tags: [] })} /><Metric label="Ativos" value={state.loading ? "—" : activeCount} detail="Em acompanhamento" icon={CheckCircle2} onClick={() => setFilters((currentFilters) => ({ ...currentFilters, activity: ["active"] }))} /><Metric label="Inativos" value={state.loading ? "—" : inactiveCount} detail="Fora de acompanhamento" icon={UserRound} onClick={() => setFilters((currentFilters) => ({ ...currentFilters, activity: ["inactive"] }))} /><Metric label="Novos clientes" value={state.loading ? "—" : newCount} detail="Este mês" icon={Plus} onClick={() => setFilters({ activity: [], sex: [], ages: [], tags: [] })} /></section>
    {state.error ? <div className="rounded-2xl border border-red-500/20 bg-red-500/10 p-4 text-xs text-red-600">Não foi possível carregar os clientes.</div> : null}
    <section className="grid min-h-0 min-w-0 gap-4 lg:grid-cols-[minmax(290px,38%)_minmax(0,1fr)] lg:overflow-hidden">
      <Card className="grid min-h-0 grid-rows-[auto_minmax(0,1fr)] overflow-hidden"><div className="flex items-center justify-between border-b border-[var(--border)] px-4 py-4"><div><p className="text-sm font-semibold">Lista de clientes</p><p className="mt-1 text-[10px] text-[var(--text-muted)]">{visible.length} cliente{visible.length === 1 ? "" : "s"}</p></div><Users size={17} className="text-[var(--accent-strong)]" /></div><div className="min-h-0 overflow-y-auto overscroll-contain p-2">{state.loading ? Array.from({ length: 6 }, (_, index) => <div key={index} className="mb-2 h-20 animate-pulse rounded-2xl bg-[var(--surface-muted)]" />) : visible.length ? visible.map((student) => { const nextSession = state.agenda.find((item) => item.student_id === student.id && !isCanceled(item.status)); const activeRow = selectedStudent?.id === student.id; return <button key={student.id} type="button" onClick={() => setSelected(student)} className={`mb-1.5 flex w-full items-center gap-3 rounded-2xl border p-3 text-left transition ${activeRow ? "border-[var(--accent)] bg-[var(--accent-soft)]" : "border-transparent hover:border-[var(--border)] hover:bg-[var(--surface-muted)]"}`}><span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl text-[11px] font-bold text-white" style={{ backgroundColor: student.client_color_hex || "#0d1715" }}>{initials(student.full_name)}</span><div className="min-w-0 flex-1"><div className="flex items-center gap-2"><p className="truncate text-sm font-semibold">{student.full_name || "Cliente"}</p><span className={`h-1.5 w-1.5 shrink-0 rounded-full ${student.is_active === false ? "bg-[var(--text-subtle)]" : "bg-emerald-500"}`} /></div><p className="mt-1 truncate text-[10px] text-[var(--text-muted)]">{nextSession ? `Próxima · ${readableDate(nextSession.scheduled_at)} · ${timeLabel(nextSession.scheduled_at)}` : "Sem sessão marcada"}</p></div><ChevronRight size={15} className={activeRow ? "text-[var(--accent-strong)]" : "text-[var(--text-subtle)]"} /></button>; }) : <div className="px-4 py-12 text-center"><Users size={21} className="mx-auto text-[var(--text-subtle)]" /><p className="mt-3 text-sm font-semibold">Nenhum cliente encontrado</p><p className="mt-1 text-xs text-[var(--text-muted)]">Ajusta a pesquisa ou os filtros.</p></div>}</div></Card>
      <ClientDetailPane student={selectedStudent} agenda={state.agenda} assessments={state.assessments} billing={selectedBilling} plan={selectedPlan} protocol={selectedProtocol} />
    </section>
    {state.enriching && !state.loading ? <p className="text-center text-[10px] text-[var(--text-subtle)]">A sincronizar agenda, avaliações, plano e cobrança…</p> : null}
    {filterOpen ? <div className="fixed inset-0 z-[70] grid place-items-center bg-black/45 p-4 backdrop-blur-sm"><div className="w-full max-w-lg rounded-[24px] border border-[var(--border)] bg-[var(--surface-solid)] p-6 shadow-[var(--shadow-panel)]"><div className="flex items-start justify-between"><div><p className="text-[9px] font-bold uppercase tracking-[0.2em] text-[var(--accent-strong)]">Clientes</p><h3 className="mt-2 text-xl font-semibold">Filtrar carteira</h3></div><button type="button" onClick={() => setFilterOpen(false)} className="grid h-10 w-10 place-items-center rounded-xl border border-[var(--border)]"><X size={16} /></button></div><div className="mt-6 grid gap-5">{[["activity","Estado",[["active","Ativo"],["pending","Pendente"],["inactive","Inativo"]]],["sex","Sexo",[["male","Masculino"],["female","Feminino"]]],["ages","Faixa etária",[["under18","Menos de 18"],["18to29","18–29"],["30to39","30–39"],["40to49","40–49"],["50plus","50+"]]]].map(([group,label,options]) => <fieldset key={group}><legend className="text-xs font-semibold">{label}</legend><div className="mt-2 flex flex-wrap gap-2">{options.map(([value,textLabel]) => <button key={value} type="button" onClick={() => toggleFilter(group,value)} className={`rounded-xl border px-3 py-2 text-xs font-semibold ${filters[group].includes(value) ? "border-[var(--accent)] bg-[var(--accent-soft)] text-[var(--accent-strong)]" : "border-[var(--border)] text-[var(--text-muted)]"}`}>{textLabel}</button>)}</div></fieldset>)}{tags.length ? <fieldset><legend className="text-xs font-semibold">Tags</legend><div className="mt-2 flex flex-wrap gap-2">{tags.map((tag) => <button key={tag} type="button" onClick={() => toggleFilter("tags",tag)} className={`rounded-xl border px-3 py-2 text-xs font-semibold ${filters.tags.includes(tag) ? "border-[var(--accent)] bg-[var(--accent-soft)] text-[var(--accent-strong)]" : "border-[var(--border)] text-[var(--text-muted)]"}`}>{tag}</button>)}</div></fieldset> : null}</div><div className="mt-6 grid grid-cols-2 gap-3"><button type="button" onClick={() => setFilters({ activity: ["active","pending"], sex: [], ages: [], tags: [] })} className="h-11 rounded-xl border border-[var(--border)] text-xs font-semibold">Limpar</button><button type="button" onClick={() => setFilterOpen(false)} className="h-11 rounded-xl bg-[var(--accent)] text-xs font-bold text-[var(--accent-foreground)]">Ver {visible.length} clientes</button></div></div></div> : null}
  </div>;
}

function ComingSoon({ active }) {
  const item = nav.find((entry) => entry.id === active);
  const Icon = item?.icon || LayoutDashboard;
  return <Card className="grid min-h-[440px] place-items-center p-8 text-center"><div><span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-[var(--accent-soft)] text-[var(--accent-strong)]"><Icon size={23} /></span><p className="mt-5 text-[9px] font-bold uppercase tracking-[0.2em] text-[var(--accent-strong)]">NLOCK workspace</p><h2 className="mt-2 text-2xl font-semibold">{item?.label}</h2><p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-[var(--text-muted)]">Esta área será construída a seguir, sobre a nova base NLOCK.</p></div></Card>;
}

function readableDate(value) {
  if (!value) return "Não definido";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "Não definido" : new Intl.DateTimeFormat("pt-PT", { day: "2-digit", month: "long", year: "numeric" }).format(date);
}

function normalizeSubscription(row) {
  if (!row) return null;
  const endsAt = row.current_period_ends_at || row.trial_ends_at || "";
  let status = String(row.status || "").toLowerCase() || "indisponível";
  if (endsAt && new Date(endsAt) < new Date()) {
    if (status === "trialing") status = "expired";
    else if (status === "active") status = "past_due";
  }
  return { status, plan: String(row.plan || ""), endsAt, lastPaymentAt: row.last_payment_at || row.current_period_starts_at || "", category: String(row.subscription_category || "nlock_coach"), founderNumber: row.founder_number ? String(row.founder_number) : "" };
}

function subscriptionLabels(subscription) {
  if (!subscription) return { title: "Estado indisponível", type: "Coach NLOCK", status: "Indisponível", renewal: "Ciclo de faturação indisponível", paidAt: "Não disponível" };
  const isFounder = subscription.category === "nlock_founder_annual" || Boolean(subscription.founderNumber);
  const statusNames = { active: "Ativa", trialing: "Período experimental", past_due: "Pagamento pendente", canceled: "Cancelada", expired: "Expirada" };
  const title = isFounder ? `NLOCK Founder${subscription.founderNumber ? ` #${subscription.founderNumber}` : ""}` : subscription.plan === "yearly" ? "NLOCK Anual" : subscription.plan === "monthly" ? "NLOCK Mensal" : "NLOCK";
  const date = subscription.endsAt ? readableDate(subscription.endsAt) : "";
  const renewal = !date ? "Ciclo de faturação indisponível" : subscription.status === "trialing" ? `Período experimental até ${date}` : ["expired", "canceled"].includes(subscription.status) ? `Terminou a ${date}` : subscription.status === "past_due" ? `Ciclo terminado a ${date}` : `Renova a ${date}`;
  const paidAt = subscription.lastPaymentAt ? readableDate(subscription.lastPaymentAt) : "Não disponível";
  return { title, type: isFounder ? `Coach fundador${subscription.founderNumber ? ` #${subscription.founderNumber}` : ""}` : subscription.plan === "yearly" ? "Coach anual" : subscription.plan === "monthly" ? "Coach mensal" : "Coach NLOCK", status: statusNames[subscription.status] || subscription.status, renewal, paidAt };
}

function normalizeFounderProgramme(row) {
  if (!row) return null;
  const summary = row.summary || {};
  return {
    referralCode: String(row.referral_code || ""),
    convertedReferrals: Number(summary.converted_referrals || 0),
    referralsUntilReward: Number(summary.referrals_until_reward || 3),
    pendingLeads: Number(summary.pending_leads || 0),
    totalLeads: Number(summary.total_leads || 0),
    availableTasks: Number(summary.available_tasks || 0),
    completedTasks: Number(summary.completed_tasks || 0),
    referrals: Array.isArray(row.referrals) ? row.referrals.map((referral, index) => ({ id: String(referral.id || `referral-${index}`), name: String(referral.coach_name || "Coach referenciado"), status: String(referral.status || "invited"), trialDaysRemaining: referral.trial_days_remaining, founderNumber: referral.founder_number })) : [],
    profile: { publicName: String(row.profile?.public_name || ""), location: String(row.profile?.location || ""), licenseNumber: String(row.profile?.license_number || ""), bio: String(row.profile?.bio || ""), professionalUrl: String(row.profile?.professional_url || ""), testimonial: String(row.profile?.testimonial || ""), publicationConsent: row.profile?.publication_consent === true },
  };
}

function referralStatusLabel(referral) {
  if (referral.status === "trial") return referral.trialDaysRemaining == null ? "Período experimental" : `Trial · faltam ${referral.trialDaysRemaining} dias`;
  if (["completed", "active"].includes(referral.status)) return referral.founderNumber ? `Fundador #${referral.founderNumber} · Concluído` : "Concluído";
  if (referral.status === "cancelled") return "Cancelado";
  if (referral.status === "registered") return "Registado";
  return "Convidado";
}

function CoachProfile({ coach, onAvatarChange }) {
  const [copied, setCopied] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState(coach.avatarUrl || "");
  const [avatarBusy, setAvatarBusy] = useState(false);
  const [subscriptionOpen, setSubscriptionOpen] = useState(false);
  const [checkoutBusy, setCheckoutBusy] = useState("");
  const [muralOpen, setMuralOpen] = useState(false);
  const [muralProfile, setMuralProfile] = useState(coach.founderProgramme?.profile || { publicName: "", location: "", licenseNumber: "", bio: "", professionalUrl: "", testimonial: "", publicationConsent: false });
  const [muralBusy, setMuralBusy] = useState(false);
  const [feedback, setFeedback] = useState("");
  const sex = String(coach.sex || "").toUpperCase() === "M" ? "Masculino" : String(coach.sex || "").toUpperCase() === "F" ? "Feminino" : "Não definido";
  const details = [
    { label: "Email", value: coach.email || "Não definido", icon: Mail },
    { label: "Data de nascimento", value: readableDate(coach.birthDate), icon: Cake },
    { label: "Sexo", value: sex, icon: UserRound },
    { label: "N.º de cédula", value: coach.licenseNumber || "Não definido", icon: ShieldCheck },
  ];
  const subscription = subscriptionLabels(coach.subscription);
  const founder = coach.founderProgramme;
  const rewardTarget = Math.max(founder?.referralsUntilReward || 3, 1);
  const referralProgress = founder ? founder.convertedReferrals % rewardTarget : 0;
  const referralCount = founder?.referrals.length || 0;
  const referralConversion = referralCount ? Math.round(((founder?.convertedReferrals || 0) / referralCount) * 100) : 0;
  const taskTotal = (founder?.availableTasks || 0) + (founder?.completedTasks || 0);
  const taskCompletion = taskTotal ? Math.round(((founder?.completedTasks || 0) / taskTotal) * 100) : 0;
  const completedLeads = Math.max((founder?.totalLeads || 0) - (founder?.pendingLeads || 0), 0);
  const referralLink = founder?.referralCode ? `https://nlock.pt/signup?ref=${encodeURIComponent(founder.referralCode)}` : "";
  async function copyReferralInvite() {
    if (!referralLink) return;
    await navigator.clipboard.writeText(`Quero convidar-te para conheceres a NLOCK, a app/software para coaches. Cria a tua conta em ${referralLink} e usa o meu código ${founder.referralCode}.`);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  }
  async function uploadAvatar(event) {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/") || file.size > 8 * 1024 * 1024) { setFeedback("Seleciona uma imagem até 8 MB."); return; }
    setAvatarBusy(true); setFeedback("");
    const supabase = getSupabaseBrowserClient();
    const path = `coaches/${coach.id}/avatar.jpg`;
    const { error } = await supabase.storage.from("student-photos").upload(path, file, { upsert: true, cacheControl: "3600", contentType: file.type });
    if (error) setFeedback("Não foi possível atualizar a fotografia.");
    else { const { data } = await supabase.storage.from("student-photos").createSignedUrl(path, 3600); const nextAvatarUrl = data?.signedUrl ? `${data.signedUrl}&v=${Date.now()}` : ""; setAvatarUrl(nextAvatarUrl); onAvatarChange(nextAvatarUrl); setFeedback("Fotografia atualizada."); }
    setAvatarBusy(false); event.target.value = "";
  }
  async function startCheckout(plan) {
    setCheckoutBusy(plan); setFeedback("");
    const response = await fetch("/api/billing/checkout", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ plan, email: coach.email, fullName: coach.fullName }) });
    const checkout = await response.json().catch(() => ({}));
    if (!response.ok || !checkout.url || !checkout.claimToken) { setFeedback(checkout.error === "founder_sold_out" ? "As vagas Founder estão preenchidas." : "Não foi possível iniciar a subscrição."); setCheckoutBusy(""); return; }
    window.sessionStorage.setItem("nlock_pending_signup", JSON.stringify({ existingUser: true, userId: coach.id, email: coach.email, fullName: coach.fullName, claimToken: checkout.claimToken, submittedAt: new Date().toISOString() }));
    window.location.assign(checkout.url);
  }
  async function saveMural(event) {
    event.preventDefault(); setMuralBusy(true); setFeedback("");
    const { error } = await getSupabaseBrowserClient().rpc("update_founder_public_profile", { p_profile: { public_name: muralProfile.publicName.trim(), location: muralProfile.location.trim(), license_number: muralProfile.licenseNumber.trim(), bio: muralProfile.bio.trim(), professional_url: muralProfile.professionalUrl.trim(), testimonial: muralProfile.testimonial.trim(), publication_consent: muralProfile.publicationConsent, consent_notice_version: "founder-mural-2026-08-17-v1" } });
    if (error) setFeedback("Não foi possível guardar o perfil do Mural."); else { setFeedback("Perfil do Mural atualizado."); setMuralOpen(false); }
    setMuralBusy(false);
  }
  return <div className="grid gap-4">
    <Card className="overflow-hidden">
      <div className="h-24 bg-[image:var(--brand-gradient)] opacity-85 sm:h-32" />
      <div className="px-5 pb-6 sm:px-7 sm:pb-8">
        <div className="-mt-10 flex flex-col gap-4 sm:-mt-12 sm:flex-row sm:items-end sm:justify-between">
          <div className="flex min-w-0 items-end gap-4"><label className="group relative grid h-20 w-20 shrink-0 cursor-pointer place-items-center overflow-hidden rounded-[24px] border-4 border-[var(--surface-solid)] bg-[#0d1715] text-xl font-bold text-white sm:h-24 sm:w-24" title="Alterar fotografia">{avatarUrl ? <img src={avatarUrl} alt={`Fotografia de ${coach.fullName}`} className="h-full w-full object-cover" /> : initials(coach.fullName)}<span className="absolute inset-0 grid place-items-center bg-black/45 opacity-0 transition group-hover:opacity-100"><Camera size={20} /></span><input type="file" accept="image/jpeg,image/png,image/webp" disabled={avatarBusy} onChange={uploadAvatar} className="sr-only" /></label><div className="min-w-0 pb-1"><p className="text-[9px] font-bold uppercase tracking-[0.18em] text-[var(--accent-strong)]">Identidade profissional NLOCK</p><h2 className="mt-2 truncate text-2xl font-semibold tracking-[-0.03em] sm:text-3xl">{coach.fullName}</h2>{avatarBusy ? <p className="mt-1 text-[10px] text-[var(--text-muted)]">A atualizar fotografia…</p> : null}</div></div>
          <span className="inline-flex w-fit items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-2 text-[11px] font-bold text-emerald-600"><Crown size={15} />{subscription.type}</span>
        </div>
        <p className="mt-6 max-w-3xl text-sm leading-6 text-[var(--text-muted)]">{coach.bio || "Ainda não foi adicionada uma apresentação profissional ao perfil."}</p>
      </div>
    </Card>
    <Card className="p-5 sm:p-6"><p className="text-[9px] font-bold uppercase tracking-[0.2em] text-[var(--accent-strong)]">Dados pessoais e profissionais</p><div className="mt-5 grid gap-3 sm:grid-cols-2">{details.map(({ label, value, icon: Icon }) => <div key={label} className="flex min-w-0 items-center gap-3 rounded-2xl border border-[var(--border)] bg-[var(--surface-muted)] p-4"><span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[var(--surface-solid)] text-[var(--accent-strong)]"><Icon size={17} /></span><div className="min-w-0"><p className="text-[10px] font-medium text-[var(--text-subtle)]">{label}</p><p className="mt-1 truncate text-sm font-semibold" title={value}>{value}</p></div></div>)}</div></Card>
    <Card className="p-5 sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-3"><div><p className="text-[9px] font-bold uppercase tracking-[0.2em] text-[var(--accent-strong)]">Conta NLOCK</p><h3 className="mt-2 text-xl font-semibold">Adesão e subscrição</h3></div><div className="flex items-center gap-2"><span className={`inline-flex items-center gap-2 rounded-full border px-3 py-2 text-[11px] font-bold ${coach.subscription?.status === "active" || coach.subscription?.status === "trialing" ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-600" : "border-amber-500/20 bg-amber-500/10 text-amber-600"}`}><ShieldCheck size={14} />{subscription.status}</span><button type="button" onClick={() => setSubscriptionOpen(true)} className="min-h-9 rounded-xl bg-[var(--accent)] px-3 text-[11px] font-bold text-[var(--accent-foreground)]">Subscrever</button></div></div>
      {coach.subscriptionError ? <p className="mt-5 rounded-2xl border border-amber-500/20 bg-amber-500/10 p-4 text-xs text-amber-700">Não foi possível carregar o estado da subscrição.</p> : <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4"><div className="rounded-2xl bg-[var(--surface-muted)] p-4"><p className="text-[10px] text-[var(--text-subtle)]">Data de adesão</p><p className="mt-2 text-sm font-semibold">{readableDate(coach.createdAt)}</p></div><div className="rounded-2xl bg-[var(--surface-muted)] p-4"><p className="text-[10px] text-[var(--text-subtle)]">Tipo de coach</p><p className="mt-2 text-sm font-semibold">{subscription.type}</p></div><div className="rounded-2xl bg-[var(--surface-muted)] p-4"><p className="text-[10px] text-[var(--text-subtle)]">Ciclo da subscrição</p><p className="mt-2 text-sm font-semibold">{subscription.renewal}</p></div><div className="rounded-2xl bg-[var(--surface-muted)] p-4"><p className="text-[10px] text-[var(--text-subtle)]">Último pagamento</p><p className="mt-2 text-sm font-semibold">{subscription.paidAt}</p></div></div>}
      <div className="mt-5 flex flex-col gap-2 border-t border-[var(--border)] pt-4 text-xs sm:flex-row sm:items-center sm:justify-between"><span className="inline-flex items-center gap-2 font-semibold text-[var(--accent-strong)]"><ShieldCheck size={15} />Identidade validada pelo login</span><span className="truncate font-mono text-[10px] text-[var(--text-subtle)]" title={coach.id}>{coach.id}</span></div>
    </Card>
    <Card className="relative overflow-hidden p-5 sm:p-6">
      <div className="pointer-events-none absolute -right-16 -top-20 h-52 w-52 rounded-full bg-[var(--accent-soft)] blur-3xl" />
      <div className="relative flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex min-w-0 items-start gap-4"><span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-[image:var(--brand-gradient)] text-[#03130e] shadow-[var(--shadow-accent)]"><Crown size={21} /></span><div className="min-w-0"><p className="text-[9px] font-bold uppercase tracking-[0.2em] text-[var(--accent-strong)]">Programa de Fundadores</p><div className="mt-2 flex flex-wrap items-center gap-2"><h3 className="text-xl font-semibold">{coach.subscription?.founderNumber ? `Fundador NLOCK #${coach.subscription.founderNumber}` : "Ajuda a construir o futuro da NLOCK"}</h3>{coach.subscription?.founderNumber ? <span className="inline-flex items-center gap-1.5 rounded-full border border-[var(--accent)]/25 bg-[var(--accent-soft)] px-2.5 py-1 text-[10px] font-bold text-[var(--accent-strong)]"><ShieldCheck size={12} />Verificado</span> : null}</div><p className="mt-2 max-w-2xl text-sm leading-6 text-[var(--text-muted)]">{coach.subscription?.founderNumber ? "Membro fundador reconhecido, com identidade histórica e participação próxima na evolução da plataforma." : "Conhece o programa reservado aos primeiros coaches que participam ativamente na evolução da NLOCK."}</p></div></div>
      </div>
      {coach.founderProgrammeError ? <p className="relative mt-5 rounded-2xl border border-amber-500/20 bg-amber-500/10 p-4 text-xs text-amber-700">Não foi possível carregar os dados do Programa de Fundadores.</p> : founder ? <div className="relative mt-6 grid gap-4 lg:grid-cols-[1fr_.72fr]">
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface-muted)] p-4 sm:p-5"><p className="text-[10px] font-semibold text-[var(--text-subtle)]">O teu código de partilha</p><div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center"><code className="min-w-0 flex-1 truncate rounded-xl border border-[var(--border)] bg-[var(--surface-solid)] px-4 py-3 text-base font-bold tracking-[0.16em] text-[var(--text)]">{founder.referralCode || "Ainda indisponível"}</code><button type="button" disabled={!referralLink} onClick={copyReferralInvite} className="inline-flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-xl bg-[var(--accent)] px-4 text-xs font-bold text-[var(--accent-foreground)] disabled:cursor-not-allowed disabled:opacity-40">{copied ? <CheckCircle2 size={15} /> : <Copy size={15} />}{copied ? "Copiado" : "Copiar convite"}</button></div>{referralLink ? <div className="mt-3 flex items-center gap-2 text-[11px] text-[var(--text-muted)]"><Share2 size={13} className="shrink-0" /><span className="truncate">{referralLink}</span></div> : null}</div>
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface-muted)] p-4 sm:p-5"><div className="flex items-start justify-between gap-3"><div><p className="text-[10px] text-[var(--text-subtle)]">Próxima recompensa</p><p className="mt-2 text-lg font-semibold">{referralProgress} de {rewardTarget} concluídos</p></div><span className="rounded-xl bg-[var(--accent-soft)] px-3 py-2 text-xs font-bold text-[var(--accent-strong)]">+30 dias</span></div><div className="mt-5 grid gap-2" style={{ gridTemplateColumns: `repeat(${rewardTarget}, minmax(0, 1fr))` }}>{Array.from({ length: rewardTarget }, (_, index) => <span key={index} className={`h-2 rounded-full ${index < referralProgress ? "bg-[var(--accent)]" : "bg-[var(--border)]"}`} />)}</div><p className="mt-4 text-[11px] leading-5 text-[var(--text-muted)]">Cada {rewardTarget} conversões válidas oferecem +30 dias de NLOCK.</p></div>
        <div className="lg:col-span-2"><div className="flex items-center justify-between"><p className="text-xs font-semibold">Coaches referenciados</p><p className="text-[10px] text-[var(--text-subtle)]">{referralCount} através do código</p></div><div className="mt-3 grid gap-2 sm:grid-cols-2">{founder.referrals.length ? founder.referrals.slice(0, 6).map((referral) => <div key={referral.id} className="flex min-w-0 items-center gap-3 rounded-2xl border border-[var(--border)] p-3"><span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-[var(--accent-soft)] text-xs font-bold text-[var(--accent-strong)]">{initials(referral.name)}</span><div className="min-w-0"><p className="truncate text-sm font-semibold">{referral.name}</p><p className="mt-1 truncate text-[10px] text-[var(--text-muted)]">{referralStatusLabel(referral)}</p></div></div>) : <p className="rounded-2xl bg-[var(--surface-muted)] px-4 py-6 text-center text-xs text-[var(--text-muted)] sm:col-span-2">Ainda não existem coaches referenciados.</p>}</div></div>
        <div className="grid gap-3 sm:grid-cols-3 lg:col-span-2"><div className="rounded-2xl bg-[var(--surface-muted)] p-4"><p className="text-[10px] font-semibold text-[var(--text-subtle)]">Taxa de conversão</p><p className="mt-2 text-2xl font-semibold">{referralConversion}%</p><p className="mt-1 text-[10px] text-[var(--text-muted)]">{referralCount} referrals · {founder.convertedReferrals} convertidos</p></div><div className="rounded-2xl bg-[var(--surface-muted)] p-4"><div className="flex items-center justify-between gap-2"><p className="text-[10px] font-semibold text-[var(--text-subtle)]">Tarefas</p>{founder.availableTasks > 0 ? <span className="rounded-full bg-amber-500/12 px-2 py-1 text-[9px] font-bold text-amber-600">{founder.availableTasks} pendente{founder.availableTasks === 1 ? "" : "s"}</span> : null}</div><p className="mt-2 text-2xl font-semibold">{taskCompletion}%</p><p className="mt-1 text-[10px] text-[var(--text-muted)]">{founder.completedTasks} realizadas · {taskTotal} no período ativo</p></div><div className="rounded-2xl bg-[var(--surface-muted)] p-4"><div className="flex items-center justify-between gap-2"><p className="text-[10px] font-semibold text-[var(--text-subtle)]">Leads do Mural</p>{founder.pendingLeads > 0 ? <span className="rounded-full bg-amber-500/12 px-2 py-1 text-[9px] font-bold text-amber-600">{founder.pendingLeads} pendente{founder.pendingLeads === 1 ? "" : "s"}</span> : null}</div><p className="mt-2 text-2xl font-semibold">{completedLeads}/{founder.totalLeads}</p><p className="mt-1 text-[10px] text-[var(--text-muted)]">{completedLeads} realizados · {founder.totalLeads} no total</p></div></div>
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface-muted)] p-4 lg:col-span-2"><div className="flex items-center justify-between gap-3"><div><p className="text-xs font-semibold">Informação publicada no Mural</p><p className="mt-1 text-[10px] text-[var(--text-muted)]">{muralProfile.publicationConsent ? "Perfil autorizado para publicação" : "Publicação desativada"}</p></div><button type="button" onClick={() => setMuralOpen(true)} className="inline-flex min-h-9 items-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--surface-solid)] px-3 text-[11px] font-bold"><Pencil size={13} />Editar</button></div><div className="mt-4 grid gap-3 sm:grid-cols-3"><div><p className="text-[9px] text-[var(--text-subtle)]">Nome público</p><p className="mt-1 truncate text-sm font-semibold">{muralProfile.publicName || "Não definido"}</p></div><div><p className="text-[9px] text-[var(--text-subtle)]">Localização</p><p className="mt-1 truncate text-sm font-semibold">{muralProfile.location || "Não definida"}</p></div><div><p className="text-[9px] text-[var(--text-subtle)]">Website</p><p className="mt-1 truncate text-sm font-semibold">{muralProfile.professionalUrl || "Não definido"}</p></div></div></div>
      </div> : null}
    </Card>
    {feedback ? <div role="status" className="fixed bottom-5 right-5 z-[80] rounded-2xl border border-[var(--border)] bg-[var(--surface-solid)] px-4 py-3 text-xs font-semibold shadow-[var(--shadow-panel)]">{feedback}</div> : null}
    {subscriptionOpen ? <div className="fixed inset-0 z-[70] grid place-items-center bg-black/45 p-4 backdrop-blur-sm"><div className="w-full max-w-xl rounded-[24px] border border-[var(--border)] bg-[var(--surface-solid)] p-6 shadow-[var(--shadow-panel)]"><div className="flex items-start justify-between"><div><p className="text-[9px] font-bold uppercase tracking-[0.2em] text-[var(--accent-strong)]">Subscrição NLOCK</p><h3 className="mt-2 text-xl font-semibold">Escolher modalidade</h3></div><button type="button" onClick={() => setSubscriptionOpen(false)} className="grid h-10 w-10 place-items-center rounded-xl border border-[var(--border)]"><X size={16} /></button></div><div className="mt-6 grid gap-3">{(coach.subscription?.founderNumber ? [{ id: "founder", title: "Founder anual", price: "199,90 € / ano", note: "Mantém o estatuto e preço Founder." }] : [{ id: "monthly", title: "Mensal", price: "29,90 € / mês", note: "Flexibilidade mensal." }, { id: "annual", title: "Anual", price: "299,90 € / ano", note: "Melhor valor anual." }]).map((plan) => <button key={plan.id} type="button" disabled={Boolean(checkoutBusy)} onClick={() => startCheckout(plan.id)} className="flex items-center justify-between gap-4 rounded-2xl border border-[var(--border)] bg-[var(--surface-muted)] p-4 text-left transition hover:border-[var(--accent)] disabled:opacity-50"><div><p className="text-sm font-semibold">{plan.title}</p><p className="mt-1 text-xs text-[var(--text-muted)]">{plan.note}</p></div><div className="text-right"><p className="text-sm font-bold">{plan.price}</p><p className="mt-1 text-[10px] text-[var(--accent-strong)]">{checkoutBusy === plan.id ? "A abrir Stripe…" : "Selecionar"}</p></div></button>)}</div></div></div> : null}
    {muralOpen ? <div className="fixed inset-0 z-[70] grid place-items-center overflow-y-auto bg-black/45 p-4 backdrop-blur-sm"><form onSubmit={saveMural} className="my-6 w-full max-w-2xl rounded-[24px] border border-[var(--border)] bg-[var(--surface-solid)] p-6 shadow-[var(--shadow-panel)]"><div className="flex items-start justify-between"><div><p className="text-[9px] font-bold uppercase tracking-[0.2em] text-[var(--accent-strong)]">Mural de Fundadores</p><h3 className="mt-2 text-xl font-semibold">Editar perfil público</h3></div><button type="button" onClick={() => setMuralOpen(false)} className="grid h-10 w-10 place-items-center rounded-xl border border-[var(--border)]"><X size={16} /></button></div><div className="mt-6 grid gap-4 sm:grid-cols-2">{[["publicName","Nome público"],["location","Localização"],["licenseNumber","Cédula profissional"],["professionalUrl","Website ou perfil profissional"]].map(([key,label]) => <label key={key} className="grid gap-2 text-xs font-semibold">{label}<input value={muralProfile[key]} onChange={(event) => setMuralProfile((currentProfile) => ({ ...currentProfile, [key]: event.target.value }))} className="h-12 rounded-xl border border-[var(--border)] bg-[var(--surface-muted)] px-4 outline-none focus:border-[var(--accent)]" /></label>)}<label className="grid gap-2 text-xs font-semibold sm:col-span-2">Bio<textarea rows={3} value={muralProfile.bio} onChange={(event) => setMuralProfile((currentProfile) => ({ ...currentProfile, bio: event.target.value }))} className="rounded-xl border border-[var(--border)] bg-[var(--surface-muted)] p-4 outline-none focus:border-[var(--accent)]" /></label><label className="grid gap-2 text-xs font-semibold sm:col-span-2">Testemunho<textarea rows={3} value={muralProfile.testimonial} onChange={(event) => setMuralProfile((currentProfile) => ({ ...currentProfile, testimonial: event.target.value }))} className="rounded-xl border border-[var(--border)] bg-[var(--surface-muted)] p-4 outline-none focus:border-[var(--accent)]" /></label><label className="flex items-start gap-3 rounded-2xl border border-[var(--border)] bg-[var(--surface-muted)] p-4 text-xs leading-5 sm:col-span-2"><input type="checkbox" checked={muralProfile.publicationConsent} onChange={(event) => setMuralProfile((currentProfile) => ({ ...currentProfile, publicationConsent: event.target.checked }))} className="mt-1" /><span>Autorizo a publicação destes dados, fotografia e testemunho no Mural de Fundadores público. <a href="/legal/privacy#mural-fundadores" target="_blank" className="inline-flex items-center gap-1 font-semibold text-[var(--accent-strong)]">Privacidade <ExternalLink size={11} /></a></span></label></div><button disabled={muralBusy} className="mt-5 h-12 w-full rounded-xl bg-[var(--accent)] text-sm font-bold text-[var(--accent-foreground)] disabled:opacity-50">{muralBusy ? "A guardar…" : "Guardar perfil do Mural"}</button></form></div> : null}
  </div>;
}

export default function NlockDashboard() {
  const router = useRouter();
  const [active, setActive] = useState("dashboard");
  const [period, setPeriod] = useState("month");
  const [menuOpen, setMenuOpen] = useState(false);
  const [sessionOpen, setSessionOpen] = useState(false);
  const [clientSearch, setClientSearch] = useState("");
  const [clientFilterOpen, setClientFilterOpen] = useState(false);
  const [clientFilters, setClientFilters] = useState({ activity: ["active", "pending"], sex: [], ages: [], tags: [] });
  const [authState, setAuthState] = useState({ loading: true, coachId: "", coachName: "Coach", coach: null });
  const [dashboardState, setDashboardState] = useState({ majorLoading: true, backgroundLoading: true, error: "", data: EMPTY_DASHBOARD });
  const current = active === "profile" ? { id: "profile", label: "Perfil do coach", icon: UserRound } : nav.find((item) => item.id === active) || nav[0];
  const clientFilterCount = (clientFilters.activity.length === 2 && clientFilters.activity.includes("active") && clientFilters.activity.includes("pending") ? 0 : 1) + (clientFilters.sex.length ? 1 : 0) + clientFilters.ages.length + clientFilters.tags.length;

  useEffect(() => {
    if (!isSupabaseConfigured()) {
      router.replace("/app/login");
      return;
    }

    let activeRequest = true;
    const supabase = getSupabaseBrowserClient();

    async function validateCoach() {
      try {
        const { data: userResult, error: userError } = await getVerifiedSupabaseUser();
        if (userError || !userResult?.user) {
          if (activeRequest) router.replace("/app/login");
          return;
        }

        const { data: profile, error: profileError } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", userResult.user.id)
          .maybeSingle();

        if (profileError || profile?.role !== "coach") {
          await supabase.auth.signOut({ scope: "local" });
          if (activeRequest) router.replace("/app/login");
          return;
        }

        const [{ data: subscriptionRow, error: subscriptionError }, subscriptionPeriodResult, founderProgrammeResult, avatarResult] = await Promise.all([
          supabase.rpc("get_coach_account_status"),
          supabase.from("subscriptions").select("current_period_starts_at").eq("coach_id", userResult.user.id).order("created_at", { ascending: false }).limit(1).maybeSingle(),
          supabase.rpc("get_coach_programme_dashboard"),
          supabase.storage.from("student-photos").createSignedUrl(`coaches/${userResult.user.id}/avatar.jpg`, 3600),
        ]);
        const subscriptionData = subscriptionRow ? { ...subscriptionRow, current_period_starts_at: subscriptionPeriodResult.data?.current_period_starts_at || subscriptionRow.current_period_starts_at } : subscriptionRow;
        const coachName = profile.full_name || userResult.user.user_metadata?.full_name || userResult.user.email || "Coach";
        const founderProgramme = normalizeFounderProgramme(founderProgrammeResult.data);
        if (founderProgramme) founderProgramme.profile = { ...founderProgramme.profile, publicName: founderProgramme.profile.publicName || coachName, licenseNumber: founderProgramme.profile.licenseNumber || profile.coach_license_number || "", bio: founderProgramme.profile.bio || profile.coach_bio || "" };
        if (activeRequest) setAuthState({ loading: false, coachId: userResult.user.id, coachName, coach: { id: userResult.user.id, fullName: coachName, email: profile.email || userResult.user.email || "", sex: profile.sex || userResult.user.user_metadata?.sex || "", birthDate: profile.birth_date || userResult.user.user_metadata?.birth_date || "", licenseNumber: profile.coach_license_number || userResult.user.user_metadata?.coach_license_number || "", bio: profile.coach_bio || userResult.user.user_metadata?.coach_bio || "", createdAt: profile.created_at || userResult.user.created_at || "", avatarUrl: avatarResult.data?.signedUrl || "", subscription: normalizeSubscription(subscriptionData), subscriptionError: Boolean(subscriptionError), founderProgramme, founderProgrammeError: Boolean(founderProgrammeResult.error) } });
        try {
          const majorData = await loadCoachDashboardMajor(supabase, userResult.user.id, period);
          if (activeRequest) setDashboardState((currentState) => ({ ...currentState, majorLoading: false, error: "", data: { ...currentState.data, ...majorData } }));
          const backgroundData = await loadCoachDashboardBackground(supabase, userResult.user.id, period);
          if (activeRequest) setDashboardState((currentState) => ({ ...currentState, backgroundLoading: false, error: "", data: { ...currentState.data, ...backgroundData } }));
        } catch (dashboardError) {
          console.error("NLOCK dashboard load failed", dashboardError);
          if (activeRequest) setDashboardState((currentState) => ({ ...currentState, majorLoading: false, backgroundLoading: false, error: dashboardError?.message || "load_failed" }));
        }
      } catch (authError) {
        console.error("NLOCK session validation failed", authError);
        if (activeRequest) setAuthState((currentState) => ({ ...currentState, loading: false }));
      }
    }

    validateCoach();
    const { data: listener } = supabase.auth.onAuthStateChange((event) => {
      if (event === "SIGNED_OUT" && activeRequest) router.replace("/app/login");
    });

    return () => {
      activeRequest = false;
      listener.subscription.unsubscribe();
    };
  }, [period, router]);

  async function signOut() {
    await getSupabaseBrowserClient().auth.signOut({ scope: "local" });
    router.replace("/app/login");
    router.refresh();
  }

  async function refreshDashboard() {
    if (!authState.coachId) return;
    setDashboardState((currentState) => ({ ...currentState, majorLoading: true, backgroundLoading: true, error: "" }));
    try {
      const supabase = getSupabaseBrowserClient();
      const majorData = await loadCoachDashboardMajor(supabase, authState.coachId, period);
      setDashboardState((currentState) => ({ ...currentState, majorLoading: false, data: { ...currentState.data, ...majorData } }));
      const backgroundData = await loadCoachDashboardBackground(supabase, authState.coachId, period);
      setDashboardState((currentState) => ({ ...currentState, backgroundLoading: false, data: { ...currentState.data, ...backgroundData } }));
    } catch (dashboardError) {
      setDashboardState((currentState) => ({ ...currentState, majorLoading: false, backgroundLoading: false, error: dashboardError?.message || "load_failed" }));
    }
  }

  function changePeriod(nextPeriod) {
    if (nextPeriod === period) return;
    setDashboardState((currentState) => ({ ...currentState, majorLoading: true, backgroundLoading: true, error: "" }));
    setPeriod(nextPeriod);
  }

  if (authState.loading) {
    return <main className="grid min-h-screen place-items-center bg-[var(--app-canvas)] text-[var(--text)]"><div className="text-center"><NlockLogo /><p className="mt-5 text-xs text-[var(--text-muted)]">A validar sessão…</p></div></main>;
  }

  return (
    <main className="nlock-app min-h-screen bg-[var(--app-canvas)] text-[var(--text)]">
      <div className="pointer-events-none fixed inset-0 -z-10 bg-[image:var(--app-background)]" />
      <div className="mx-auto flex min-h-screen max-w-[1600px]">
        <Sidebar expanded={menuOpen} toggle={() => setMenuOpen((currentOpen) => !currentOpen)} collapse={() => setMenuOpen(false)} active={active} setActive={setActive} coachName={authState.coachName} coachEmail={authState.coach?.email || ""} coachAvatarUrl={authState.coach?.avatarUrl || ""} openCoachProfile={() => { setActive("profile"); if (window.innerWidth < 1024) setMenuOpen(false); }} onSignOut={signOut} />
        <section className={`min-w-0 flex-1 px-3 pb-8 transition-[margin] duration-300 sm:px-5 lg:px-7 ${menuOpen ? "ml-[76px] lg:ml-[238px]" : "ml-[76px]"}`}>
          <header className="sticky top-0 z-30 -mx-3 flex min-h-[76px] items-center justify-between gap-3 border-b border-[var(--border)] bg-[var(--app-header)] px-3 backdrop-blur-xl sm:-mx-5 sm:px-5 lg:-mx-7 lg:px-7">
            <div className="flex min-w-0 items-center gap-3"><div><p className="text-[9px] font-bold uppercase tracking-[0.2em] text-[var(--text-subtle)]">{current.label}</p><h1 className="mt-1 truncate text-lg font-semibold sm:text-xl">{active === "dashboard" ? `Bom dia, ${authState.coachName.split(" ")[0]}` : current.label}</h1></div></div>
            <div className="flex items-center gap-2"><label className="hidden h-11 w-[min(32vw,300px)] items-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--surface-solid)] px-3 text-xs text-[var(--text-muted)] sm:flex"><Search size={15} className="shrink-0" /><input value={active === "clients" ? clientSearch : ""} onChange={(event) => { if (active === "clients") setClientSearch(event.target.value); }} placeholder={active === "clients" ? "Pesquisar clientes" : "Pesquisar"} className="min-w-0 flex-1 bg-transparent outline-none" /></label><button type="button" disabled={active !== "clients"} onClick={() => { if (active === "clients") setClientFilterOpen(true); }} className={`relative grid h-11 w-11 place-items-center rounded-xl border bg-[var(--surface-solid)] ${active === "clients" && clientFilterCount ? "border-[var(--accent)] text-[var(--accent-strong)]" : "border-[var(--border)] text-[var(--text-muted)]"} disabled:opacity-55`} aria-label={`Filtrar ${current.label.toLowerCase()}`}><SlidersHorizontal size={16} />{active === "clients" && clientFilterCount ? <span className="absolute -right-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full bg-[var(--accent)] px-1 text-[9px] font-bold text-[var(--accent-foreground)]">{clientFilterCount}</span> : null}</button><button className="relative grid h-11 w-11 place-items-center rounded-xl border border-[var(--border)] bg-[var(--surface-solid)] text-[var(--text-muted)]"><Bell size={16} /><span className="absolute right-2.5 top-2.5 h-1.5 w-1.5 rounded-full bg-[var(--accent)]" /></button><ThemeToggle language="pt" className="rounded-xl" /><button onClick={() => setSessionOpen(true)} className="inline-flex h-11 items-center gap-2 rounded-xl bg-[var(--accent)] px-3 text-xs font-bold text-[var(--accent-foreground)] shadow-[var(--shadow-accent)] sm:px-4"><Plus size={16} /><span className="hidden sm:inline">Nova sessão</span></button></div>
          </header>
          <div className={`pt-5 ${active === "clients" ? "lg:h-[calc(100vh-76px)] lg:overflow-hidden lg:pb-8" : ""}`}>{active === "dashboard" ? <DashboardHome data={dashboardState.data} majorLoading={dashboardState.majorLoading} backgroundLoading={dashboardState.backgroundLoading} error={dashboardState.error} onRetry={refreshDashboard} onNavigate={setActive} period={period} onPeriodChange={changePeriod} /> : active === "profile" && authState.coach ? <CoachProfile coach={authState.coach} onAvatarChange={(avatarUrl) => setAuthState((currentState) => ({ ...currentState, coach: { ...currentState.coach, avatarUrl } }))} /> : active === "clients" ? <ClientsWorkspace coachId={authState.coachId} search={clientSearch} filters={clientFilters} setFilters={setClientFilters} filterOpen={clientFilterOpen} setFilterOpen={setClientFilterOpen} /> : <ComingSoon active={active} />}</div>
        </section>
      </div>

      {sessionOpen ? <div className="fixed inset-0 z-[60] grid place-items-center bg-black/45 p-4 backdrop-blur-sm"><div className="w-full max-w-md rounded-[24px] border border-[var(--border)] bg-[var(--surface-solid)] p-6 shadow-[var(--shadow-panel)]"><div className="flex items-start justify-between"><div><p className="text-[9px] font-bold uppercase tracking-[0.2em] text-[var(--accent-strong)]">Agenda</p><h2 className="mt-2 text-xl font-semibold">Nova sessão</h2></div><button onClick={() => setSessionOpen(false)} className="grid h-10 w-10 place-items-center rounded-xl border border-[var(--border)]"><X size={16} /></button></div><div className="mt-6 grid gap-4"><label className="grid gap-2 text-xs font-semibold">Cliente<input className="h-12 rounded-xl border border-[var(--border)] bg-[var(--surface-muted)] px-4 outline-none" placeholder="Pesquisar cliente" /></label><div className="grid grid-cols-2 gap-3"><label className="grid gap-2 text-xs font-semibold">Data<input type="date" className="h-12 rounded-xl border border-[var(--border)] bg-[var(--surface-muted)] px-3 outline-none" /></label><label className="grid gap-2 text-xs font-semibold">Hora<input type="time" className="h-12 rounded-xl border border-[var(--border)] bg-[var(--surface-muted)] px-3 outline-none" /></label></div><button onClick={() => setSessionOpen(false)} className="mt-2 h-12 rounded-xl bg-[var(--accent)] text-sm font-bold text-[var(--accent-foreground)]">Criar sessão</button></div></div></div> : null}
    </main>
  );
}
