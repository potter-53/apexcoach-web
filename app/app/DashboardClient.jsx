"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  CalendarDays,
  ClipboardList,
  CreditCard,
  Dumbbell,
  LayoutDashboard,
  LoaderCircle,
  LogOut,
  ShieldCheck,
  Sparkles,
  Users,
} from "lucide-react";

import { getSupabaseBrowserClient, isSupabaseConfigured } from "../../src/lib/supabase-browser";

const APP_TABS = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "clients", label: "Clients", icon: Users },
  { id: "assessments", label: "Assessments", icon: ClipboardList },
  { id: "agenda", label: "Agenda", icon: CalendarDays },
  { id: "trainings", label: "Trainings", icon: Dumbbell },
  { id: "coach", label: "Coach", icon: ShieldCheck },
];

const EMPTY_WORKSPACE = {
  profile: null,
  subscription: null,
  metrics: { clients: 0, agendaToday: 0, assessments: 0, trainings: 0 },
  students: [],
  upcomingAgenda: [],
  recentAssessments: [],
  recentTrainings: [],
};

function formatDate(value, withYear = false) {
  if (!value) return "Sem data";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Sem data";
  return date.toLocaleDateString("pt-PT", {
    day: "2-digit",
    month: "short",
    ...(withYear ? { year: "numeric" } : {}),
  });
}

function formatTime(value) {
  if (!value) return "--:--";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "--:--";
  return date.toLocaleTimeString("pt-PT", { hour: "2-digit", minute: "2-digit" });
}

function prettifyStatus(value) {
  const normalized = (value ?? "").toString().toLowerCase();
  if (!normalized) return "Unknown";
  return normalized.replace(/_/g, " ");
}

function colorDot(colorHex) {
  return colorHex || "linear-gradient(135deg, #2ad07d 0%, #7c4dff 100%)";
}

function isMissingColumn(error, columnName) {
  const message = error?.message?.toLowerCase?.() ?? error?.toString?.().toLowerCase?.() ?? "";
  return message.includes(columnName.toLowerCase()) && (message.includes("42703") || message.includes("column"));
}

async function withColorFallback(builder) {
  try {
    return await builder(true);
  } catch (error) {
    if (!isMissingColumn(error, "client_color_hex")) throw error;
    return builder(false);
  }
}

async function loadWorkspace(supabase, user) {
  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString();
  const todayEnd = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1).toISOString();
  const nowIso = new Date().toISOString();

  const [
    profile,
    subscription,
    clientsCount,
    agendaTodayCount,
    assessmentsCount,
    trainingsCount,
    students,
    upcomingAgenda,
    recentAssessments,
    recentTrainings,
  ] = await Promise.all([
    supabase.from("profiles").select("id, role, full_name").eq("id", user.id).maybeSingle(),
    supabase
      .from("subscriptions")
      .select("status, plan, trial_ends_at, current_period_ends_at, subscription_category, payment_method_last4")
      .eq("coach_id", user.id)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle(),
    supabase.from("students").select("id", { count: "exact", head: true }).eq("coach_id", user.id),
    supabase
      .from("agenda_items")
      .select("id", { count: "exact", head: true })
      .eq("coach_id", user.id)
      .gte("scheduled_at", todayStart)
      .lt("scheduled_at", todayEnd),
    supabase.from("assessments").select("id", { count: "exact", head: true }).eq("coach_id", user.id),
    supabase.from("training_sessions").select("id", { count: "exact", head: true }).eq("coach_id", user.id),
    withColorFallback((includeColor) =>
      supabase
        .from("students")
        .select(
          includeColor
            ? "id, full_name, email, main_goal, created_at, tags, client_color_hex"
            : "id, full_name, email, main_goal, created_at, tags",
        )
        .eq("coach_id", user.id)
        .order("full_name", { ascending: true })
        .limit(8),
    ),
    withColorFallback((includeColor) =>
      supabase
        .from("agenda_items")
        .select(
          includeColor
            ? "id, item_type, notes, scheduled_at, status, students(full_name, client_color_hex), booking_types(name)"
            : "id, item_type, notes, scheduled_at, status, students(full_name), booking_types(name)",
        )
        .eq("coach_id", user.id)
        .gte("scheduled_at", nowIso)
        .order("scheduled_at", { ascending: true })
        .limit(6),
    ),
    withColorFallback((includeColor) =>
      supabase
        .from("assessments")
        .select(includeColor ? "id, assessment_date, fields, students(full_name, client_color_hex)" : "id, assessment_date, fields, students(full_name)")
        .eq("coach_id", user.id)
        .order("assessment_date", { ascending: false })
        .order("created_at", { ascending: false })
        .limit(6),
    ),
    withColorFallback((includeColor) =>
      supabase
        .from("training_sessions")
        .select(includeColor ? "id, name, status, session_date, students(full_name, client_color_hex)" : "id, name, status, session_date, students(full_name)")
        .eq("coach_id", user.id)
        .order("session_date", { ascending: false })
        .limit(6),
    ),
  ]);

  const responses = [
    profile,
    subscription,
    clientsCount,
    agendaTodayCount,
    assessmentsCount,
    trainingsCount,
    students,
    upcomingAgenda,
    recentAssessments,
    recentTrainings,
  ];

  const failed = responses.find((item) => item.error);
  if (failed?.error) throw failed.error;

  return {
    profile: profile.data,
    subscription: subscription.data,
    metrics: {
      clients: clientsCount.count ?? 0,
      agendaToday: agendaTodayCount.count ?? 0,
      assessments: assessmentsCount.count ?? 0,
      trainings: trainingsCount.count ?? 0,
    },
    students: students.data ?? [],
    upcomingAgenda: upcomingAgenda.data ?? [],
    recentAssessments: recentAssessments.data ?? [],
    recentTrainings: recentTrainings.data ?? [],
  };
}

function SectionCard({ eyebrow, title, description, children }) {
  return (
    <section className="rounded-[32px] border border-[var(--border)] bg-[var(--surface-solid)] p-5 shadow-[var(--shadow-soft)] sm:p-6">
      <p className="text-sm uppercase tracking-[0.2em] text-[var(--accent)]">{eyebrow}</p>
      <h2 className="mt-2 text-2xl font-semibold text-[var(--text)]">{title}</h2>
      {description ? <p className="mt-3 max-w-3xl leading-7 text-[var(--text-muted)]">{description}</p> : null}
      <div className="mt-6">{children}</div>
    </section>
  );
}

function EmptyState({ title, text }) {
  return (
    <div className="rounded-[24px] border border-dashed border-[var(--border)] bg-[var(--surface-muted)] px-5 py-8 text-center">
      <p className="text-lg font-semibold text-[var(--text)]">{title}</p>
      <p className="mt-3 leading-7 text-[var(--text-muted)]">{text}</p>
    </div>
  );
}

function MetricCard({ label, value, Icon, hint }) {
  return (
    <div className="rounded-[28px] border border-[var(--border)] bg-[var(--surface-solid)] p-5 shadow-[var(--shadow-soft)]">
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--accent)]/12">
        <Icon size={22} className="text-[var(--accent)]" />
      </div>
      <p className="mt-6 text-sm uppercase tracking-[0.2em] text-[var(--text-muted)]">{label}</p>
      <p className="mt-2 text-4xl font-semibold text-[var(--text)]">{value}</p>
      <p className="mt-3 text-sm leading-6 text-[var(--text-muted)]">{hint}</p>
    </div>
  );
}

function PersonRow({ name, detail, meta, colorHex }) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-[24px] border border-[var(--border)] bg-[var(--surface-muted)] px-4 py-4">
      <div className="flex min-w-0 items-center gap-3">
        <span className="h-3 w-3 shrink-0 rounded-full" style={{ background: colorDot(colorHex) }} />
        <div className="min-w-0">
          <p className="truncate font-medium text-[var(--text)]">{name || "Cliente"}</p>
          <p className="truncate text-sm text-[var(--text-muted)]">{detail || "Sem detalhe"}</p>
        </div>
      </div>
      {meta ? <p className="shrink-0 text-sm text-[var(--text-muted)]">{meta}</p> : null}
    </div>
  );
}

export default function DashboardClient() {
  const router = useRouter();
  const configured = useMemo(() => isSupabaseConfigured(), []);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [checkingSession, setCheckingSession] = useState(true);
  const [loadingWorkspace, setLoadingWorkspace] = useState(false);
  const [workspaceError, setWorkspaceError] = useState("");
  const [currentUser, setCurrentUser] = useState(null);
  const [workspace, setWorkspace] = useState(EMPTY_WORKSPACE);
  const [signingOut, setSigningOut] = useState(false);

  useEffect(() => {
    if (!configured) {
      setCheckingSession(false);
      return;
    }

    const supabase = getSupabaseBrowserClient();
    let mounted = true;

    async function hydrate(user) {
      setLoadingWorkspace(true);
      setWorkspaceError("");

      try {
        const data = await loadWorkspace(supabase, user);
        if (mounted) setWorkspace(data);
      } catch (error) {
        if (mounted) setWorkspaceError(error?.message || "Não foi possível carregar os dados do coach.");
      } finally {
        if (mounted) setLoadingWorkspace(false);
      }
    }

    async function boot() {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!mounted) return;
      if (!session?.user) {
        router.replace("/login");
        return;
      }

      setCurrentUser(session.user);
      setCheckingSession(false);
      await hydrate(session.user);
    }

    boot();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (!mounted) return;
      if (!session?.user) {
        router.replace("/login");
        return;
      }

      setCurrentUser(session.user);
      setCheckingSession(false);
      await hydrate(session.user);
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [configured, router]);

  async function handleSignOut() {
    if (!configured) {
      router.replace("/login");
      return;
    }

    setSigningOut(true);
    try {
      const supabase = getSupabaseBrowserClient();
      await supabase.auth.signOut();
      router.replace("/login");
      router.refresh();
    } finally {
      setSigningOut(false);
    }
  }

  if (!configured) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[var(--bg)] px-5 text-[var(--text)]">
        <div className="max-w-xl rounded-[32px] border border-amber-300 bg-amber-50 p-8 shadow-[var(--shadow-soft)]">
          <h1 className="text-2xl font-semibold">Supabase não configurado</h1>
          <p className="mt-4 leading-8 text-[var(--text-muted)]">
            Adiciona as variáveis públicas do Supabase para usar o browser com dados reais.
          </p>
        </div>
      </main>
    );
  }

  if (checkingSession) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[var(--bg)] text-[var(--text)]">
        <div className="inline-flex items-center gap-3 rounded-full border border-[var(--border)] bg-[var(--surface-solid)] px-5 py-3 shadow-[var(--shadow-soft)]">
          <LoaderCircle size={18} className="animate-spin text-[var(--accent)]" />
          A validar sessão do coach...
        </div>
      </main>
    );
  }

  const coachName =
    workspace.profile?.full_name || currentUser?.user_metadata?.full_name || currentUser?.email || "Coach";

  const metrics = [
    { label: "Active clients", value: workspace.metrics.clients, Icon: Users, hint: "Clientes reais associados ao coach." },
    { label: "Agenda today", value: workspace.metrics.agendaToday, Icon: CalendarDays, hint: "Marcações calendarizadas para hoje." },
    { label: "Assessments", value: workspace.metrics.assessments, Icon: ClipboardList, hint: "Avaliações já guardadas." },
    { label: "Trainings", value: workspace.metrics.trainings, Icon: Dumbbell, hint: "Sessões de treino no histórico." },
  ];

  return (
    <main className="min-h-screen bg-[var(--bg)] text-[var(--text)]">
      <div className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,rgba(42,208,125,0.12),transparent_24%),radial-gradient(circle_at_bottom_right,rgba(124,77,255,0.08),transparent_20%),linear-gradient(180deg,#fbfbfb_0%,#f5f5f5_48%,#f2f4f3_100%)]" />

      <div className="mx-auto grid min-h-screen max-w-[1600px] gap-6 px-4 py-4 lg:grid-cols-[280px_minmax(0,1fr)] lg:px-6">
        <aside className="rounded-[32px] border border-[var(--border-strong)] bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(245,245,245,0.95))] p-5 shadow-[var(--shadow-panel)]">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl border border-[var(--border)] bg-[linear-gradient(135deg,var(--accent-soft),rgba(124,77,255,0.08))] p-2">
              <LayoutDashboard size={20} className="text-[var(--accent-strong)]" />
            </div>
            <div>
              <p className="text-sm font-semibold tracking-[0.18em] text-[var(--text)]">APEX COACH</p>
              <p className="text-xs uppercase tracking-[0.22em] text-[var(--text-muted)]">web workspace</p>
            </div>
          </div>

          <div className="mt-8 rounded-[24px] border border-[var(--border)] bg-[linear-gradient(135deg,var(--accent-soft),rgba(124,77,255,0.08))] p-4">
            <p className="text-xs uppercase tracking-[0.2em] text-[var(--accent-strong)]">Coach account</p>
            <p className="mt-2 text-lg font-semibold text-[var(--text)]">{coachName}</p>
            <p className="mt-2 text-sm leading-7 text-[var(--text-muted)]">
              Os mesmos separadores da APK, com um dashboard principal para juntar tudo de forma clean.
            </p>
          </div>

          <nav className="mt-8 grid gap-2">
            {APP_TABS.map(({ id, label, icon: Icon }) => {
              const active = activeTab === id;
              return (
                <button
                  key={id}
                  onClick={() => setActiveTab(id)}
                  className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-left text-sm transition ${
                    active
                      ? "bg-[var(--accent)] text-[#081014] shadow-[0_18px_35px_rgba(42,208,125,0.2)]"
                      : "border border-[var(--border)] bg-[var(--surface-solid)] text-[var(--text-muted)] hover:bg-[var(--surface-muted)]"
                  }`}
                >
                  <Icon size={17} />
                  {label}
                </button>
              );
            })}
          </nav>

          <div className="mt-8 grid gap-3 rounded-[24px] border border-[var(--border)] bg-[var(--surface-muted)] p-4">
            <Link href="/" className="rounded-2xl border border-[var(--border)] bg-white px-4 py-3 text-sm text-[var(--text-muted)]">
              Back to landing
            </Link>
            <button
              onClick={handleSignOut}
              disabled={signingOut}
              className="inline-flex items-center justify-center gap-2 rounded-2xl border border-[var(--border)] bg-white px-4 py-3 text-sm text-[var(--text-muted)] disabled:opacity-60"
            >
              {signingOut ? <LoaderCircle size={16} className="animate-spin" /> : <LogOut size={16} />}
              Sign out
            </button>
          </div>
        </aside>

        <section className="grid gap-6">
          <header className="rounded-[32px] border border-[var(--border-strong)] bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(245,245,245,0.95))] p-5 shadow-[var(--shadow-panel)] sm:p-6">
            <p className="text-sm uppercase tracking-[0.2em] text-[var(--accent)]">Coach browser workspace</p>
            <h1 className="mt-3 text-4xl font-semibold tracking-tight text-[var(--text)] sm:text-5xl">
              Dashboard first. A mesma estrutura da APK, com mais visão.
            </h1>
            <p className="mt-4 max-w-3xl text-lg leading-8 text-[var(--text-muted)]">
              Clientes, assessments, agenda, trainings e coach hub passam a viver no web com a mesma lógica do mobile.
            </p>
          </header>

          {workspaceError ? (
            <div className="rounded-[28px] border border-rose-200 bg-rose-50 px-5 py-4 text-rose-700 shadow-[var(--shadow-soft)]">
              {workspaceError}
            </div>
          ) : null}

          {loadingWorkspace ? (
            <div className="inline-flex items-center gap-3 rounded-full border border-[var(--border)] bg-[var(--surface-solid)] px-5 py-3 shadow-[var(--shadow-soft)]">
              <LoaderCircle size={18} className="animate-spin text-[var(--accent)]" />
              A carregar dados reais do coach...
            </div>
          ) : null}

          <div className="flex gap-3 overflow-x-auto pb-1 lg:hidden">
            {APP_TABS.map(({ id, label }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`shrink-0 rounded-full border px-4 py-2 text-sm font-medium ${
                  activeTab === id
                    ? "border-[var(--accent)] bg-[var(--accent)] text-[var(--accent-foreground)]"
                    : "border-[var(--border)] bg-white text-[var(--text-muted)]"
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          {activeTab === "dashboard" ? (
            <>
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                {metrics.map((metric) => (
                  <MetricCard key={metric.label} {...metric} />
                ))}
              </div>

              <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
                <SectionCard
                  eyebrow="Agenda pulse"
                  title="Próximas marcações"
                  description="A agenda real do coach aparece logo no dashboard principal."
                >
                  {workspace.upcomingAgenda.length > 0 ? (
                    <div className="grid gap-4">
                      {workspace.upcomingAgenda.slice(0, 4).map((item) => (
                        <PersonRow
                          key={item.id}
                          name={item.students?.full_name}
                          detail={item.notes || item.booking_types?.name || item.item_type}
                          meta={formatTime(item.scheduled_at)}
                          colorHex={item.students?.client_color_hex}
                        />
                      ))}
                    </div>
                  ) : (
                    <EmptyState title="Sem próximas marcações" text="Quando houver sessões futuras, elas aparecem aqui." />
                  )}
                </SectionCard>

                <SectionCard
                  eyebrow="Coach pulse"
                  title="Resumo rápido"
                  description="O browser fica com cara de cockpit, mas sem fugir ao ecossistema da app."
                >
                  <div className="grid gap-4">
                    <div className="rounded-[24px] border border-[var(--border)] bg-[var(--surface-muted)] p-5">
                      <div className="flex items-center gap-3">
                        <Sparkles size={18} className="text-[var(--accent)]" />
                        <div>
                          <p className="font-medium text-[var(--text)]">Coach name</p>
                          <p className="text-sm text-[var(--text-muted)]">{coachName}</p>
                        </div>
                      </div>
                    </div>
                    <div className="rounded-[24px] border border-[var(--border)] bg-[var(--surface-muted)] p-5">
                      <div className="flex items-center gap-3">
                        <CreditCard size={18} className="text-[var(--accent)]" />
                        <div>
                          <p className="font-medium text-[var(--text)]">Subscription</p>
                          <p className="text-sm text-[var(--text-muted)]">
                            {prettifyStatus(workspace.subscription?.status || "trialing")}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </SectionCard>
              </div>
            </>
          ) : null}

          {activeTab === "clients" ? (
            <SectionCard
              eyebrow="Clients"
              title="Base real de clientes"
              description="Os clientes usados na app aparecem aqui com detalhe rápido."
            >
              {workspace.students.length > 0 ? (
                <div className="grid gap-4">
                  {workspace.students.map((student) => (
                    <PersonRow
                      key={student.id}
                      name={student.full_name}
                      detail={student.main_goal || student.email}
                      meta={formatDate(student.created_at)}
                      colorHex={student.client_color_hex}
                    />
                  ))}
                </div>
              ) : (
                <EmptyState title="Ainda sem clientes" text="Quando existirem clientes, este separador fica logo ativo." />
              )}
            </SectionCard>
          ) : null}

          {activeTab === "assessments" ? (
            <SectionCard
              eyebrow="Assessments"
              title="Avaliações recentes"
              description="Primeira leitura web das avaliações guardadas pelo coach."
            >
              {workspace.recentAssessments.length > 0 ? (
                <div className="grid gap-4">
                  {workspace.recentAssessments.map((item) => (
                    <PersonRow
                      key={item.id}
                      name={item.students?.full_name}
                      detail={`${Object.keys(item.fields || {}).length} métricas guardadas`}
                      meta={formatDate(item.assessment_date, true)}
                      colorHex={item.students?.client_color_hex}
                    />
                  ))}
                </div>
              ) : (
                <EmptyState title="Sem avaliações" text="Ainda não existem avaliações no histórico desta conta." />
              )}
            </SectionCard>
          ) : null}

          {activeTab === "agenda" ? (
            <SectionCard
              eyebrow="Agenda"
              title="Sessões futuras"
              description="Separador dedicado à agenda real do coach."
            >
              {workspace.upcomingAgenda.length > 0 ? (
                <div className="grid gap-4">
                  {workspace.upcomingAgenda.map((item) => (
                    <PersonRow
                      key={item.id}
                      name={item.students?.full_name}
                      detail={`${item.booking_types?.name || item.item_type || "Agenda item"} · ${prettifyStatus(item.status)}`}
                      meta={formatTime(item.scheduled_at)}
                      colorHex={item.students?.client_color_hex}
                    />
                  ))}
                </div>
              ) : (
                <EmptyState title="Agenda limpa" text="Não encontrámos marcações futuras neste momento." />
              )}
            </SectionCard>
          ) : null}

          {activeTab === "trainings" ? (
            <SectionCard
              eyebrow="Trainings"
              title="Sessões de treino"
              description="O histórico recente de treinos num formato limpo para web."
            >
              {workspace.recentTrainings.length > 0 ? (
                <div className="grid gap-4">
                  {workspace.recentTrainings.map((item) => (
                    <PersonRow
                      key={item.id}
                      name={item.name || "Sessão sem título"}
                      detail={item.students?.full_name || "Sem cliente associado"}
                      meta={formatDate(item.session_date, true)}
                      colorHex={item.students?.client_color_hex}
                    />
                  ))}
                </div>
              ) : (
                <EmptyState title="Sem treinos" text="Ainda não há sessões de treino registadas para esta conta." />
              )}
            </SectionCard>
          ) : null}

          {activeTab === "coach" ? (
            <div className="grid gap-6 xl:grid-cols-2">
              <SectionCard
                eyebrow="Coach hub"
                title="Conta do coach"
                description="A mesma ideia da zona Coach da APK, trazida para o browser."
              >
                <div className="grid gap-4">
                  <div className="rounded-[24px] border border-[var(--border)] bg-[var(--surface-muted)] p-5">
                    <p className="text-xs uppercase tracking-[0.18em] text-[var(--text-muted)]">Name</p>
                    <p className="mt-2 font-semibold text-[var(--text)]">{coachName}</p>
                  </div>
                  <div className="rounded-[24px] border border-[var(--border)] bg-[var(--surface-muted)] p-5">
                    <p className="text-xs uppercase tracking-[0.18em] text-[var(--text-muted)]">Email</p>
                    <p className="mt-2 font-semibold text-[var(--text)]">{currentUser?.email || "Sem email"}</p>
                  </div>
                </div>
              </SectionCard>

              <SectionCard
                eyebrow="Subscription"
                title="Estado da conta"
                description="Primeira versão do lado premium da conta dentro do web."
              >
                <div className="grid gap-4">
                  <div className="rounded-[24px] border border-[var(--border)] bg-[linear-gradient(135deg,var(--accent-soft),rgba(124,77,255,0.08))] p-5">
                    <p className="text-xs uppercase tracking-[0.18em] text-[var(--accent)]">Plan status</p>
                    <p className="mt-2 text-2xl font-semibold text-[var(--text)]">
                      {prettifyStatus(workspace.subscription?.status || "trialing")}
                    </p>
                    <p className="mt-2 leading-7 text-[var(--text-muted)]">
                      {(workspace.subscription?.subscription_category || "apex_coach").toString().replace(/_/g, " ")}
                      {workspace.subscription?.payment_method_last4
                        ? ` · •••• ${workspace.subscription.payment_method_last4}`
                        : ""}
                    </p>
                  </div>
                  <button
                    onClick={handleSignOut}
                    disabled={signingOut}
                    className="inline-flex items-center justify-center gap-2 rounded-2xl border border-[var(--border)] bg-white px-5 py-3 font-semibold text-[var(--text)] disabled:opacity-60"
                  >
                    {signingOut ? <LoaderCircle size={16} className="animate-spin" /> : <LogOut size={16} />}
                    Terminar sessão
                  </button>
                </div>
              </SectionCard>
            </div>
          ) : null}
        </section>
      </div>
    </main>
  );
}
