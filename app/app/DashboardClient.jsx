"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Activity,
  ArrowRight,
  Bell,
  CalendarDays,
  ChevronRight,
  ClipboardList,
  CreditCard,
  LayoutDashboard,
  LoaderCircle,
  LogOut,
  Search,
  Users,
} from "lucide-react";

import { getSupabaseBrowserClient, isSupabaseConfigured } from "../../src/lib/supabase-browser";

const upcomingSessions = [
  { time: "08:30", athlete: "Marta Silva", focus: "Lower strength" },
  { time: "10:00", athlete: "Tiago Costa", focus: "Return to play" },
  { time: "12:15", athlete: "Bruna Reis", focus: "Power + speed" },
];

const clients = [
  { name: "Marta Silva", status: "Report pending", color: "bg-emerald-300" },
  { name: "Tiago Costa", status: "Payment due", color: "bg-sky-300" },
  { name: "Bruna Reis", status: "Assessment ready", color: "bg-amber-300" },
];

const metrics = [
  { label: "Active clients", value: "24", icon: Users },
  { label: "Sessions today", value: "11", icon: CalendarDays },
  { label: "Pending follow-up", value: "7", icon: Bell },
  { label: "Reports this week", value: "4", icon: ClipboardList },
];

export default function DashboardClient() {
  const router = useRouter();
  const configured = useMemo(() => isSupabaseConfigured(), []);
  const [checkingSession, setCheckingSession] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);
  const [signingOut, setSigningOut] = useState(false);

  useEffect(() => {
    if (!configured) {
      setCheckingSession(false);
      return;
    }

    const supabase = getSupabaseBrowserClient();

    let mounted = true;

    async function loadSession() {
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
    }

    loadSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!mounted) return;

      if (!session?.user) {
        router.replace("/login");
        return;
      }

      setCurrentUser(session.user);
      setCheckingSession(false);
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
        <div className="max-w-xl rounded-[32px] border border-amber-400/20 bg-amber-400/10 p-8">
          <h1 className="text-2xl font-semibold">Supabase não configurado</h1>
          <p className="mt-4 leading-8 text-amber-100/85">
            Para proteger o browser com sessão real, adiciona
            `NEXT_PUBLIC_SUPABASE_URL` e `NEXT_PUBLIC_SUPABASE_ANON_KEY` no projeto e na Vercel.
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

  return (
    <main className="min-h-screen bg-[var(--bg)] text-[var(--text)]">
      <div className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,rgba(42,208,125,0.12),transparent_24%),radial-gradient(circle_at_bottom_right,rgba(124,77,255,0.08),transparent_20%),linear-gradient(180deg,#fbfbfb_0%,#f5f5f5_48%,#f2f4f3_100%)]" />

      <div className="mx-auto grid min-h-screen max-w-[1600px] gap-6 px-4 py-4 lg:grid-cols-[260px_minmax(0,1fr)] lg:px-6">
        <aside className="rounded-[32px] border border-[var(--border-strong)] bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(245,245,245,0.95))] p-5 shadow-[var(--shadow-panel)]">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl border border-[var(--border)] bg-[linear-gradient(135deg,var(--accent-soft),rgba(124,77,255,0.08))] p-2">
              <LayoutDashboard size={20} className="text-[var(--accent-strong)]" />
            </div>
            <div>
              <p className="text-sm font-semibold tracking-[0.18em] text-[var(--text)]">APEX COACH</p>
              <p className="text-xs uppercase tracking-[0.22em] text-[var(--text-muted)]">browser companion</p>
            </div>
          </div>

          <div className="mt-8 rounded-[24px] border border-[var(--border)] bg-[linear-gradient(135deg,var(--accent-soft),rgba(124,77,255,0.08))] p-4">
            <p className="text-xs uppercase tracking-[0.2em] text-[var(--accent-strong)]">Coach workspace</p>
            <p className="mt-2 text-lg font-semibold text-[var(--text)]">
              {currentUser?.user_metadata?.full_name || currentUser?.email || "Coach"}
            </p>
            <p className="mt-2 text-sm leading-7 text-[var(--text-muted)]">
              Vista premium para gerir agenda, clientes, reports e follow-up num ecrã maior.
            </p>
          </div>

          <nav className="mt-8 grid gap-2">
            {[
              "Overview",
              "Clients",
              "Calendar",
              "Assessments",
              "Reports",
              "Billing",
              "Settings",
            ].map((item, index) => (
              <button
                key={item}
                className={`flex items-center justify-between rounded-2xl px-4 py-3 text-left text-sm transition ${
                  index === 0
                    ? "bg-[var(--accent)] text-[#081014]"
                    : "border border-[var(--border)] bg-[var(--surface-solid)] text-[var(--text-muted)] hover:bg-[var(--surface-muted)]"
                }`}
              >
                <span>{item}</span>
                <ChevronRight size={16} />
              </button>
            ))}
          </nav>

          <div className="mt-8 grid gap-3 rounded-[24px] border border-[var(--border)] bg-[var(--surface-muted)] p-4">
            <p className="text-sm font-medium text-[var(--text)]">Quick jump</p>
            <Link
              href="/login"
              className="rounded-2xl border border-[var(--border)] bg-white px-4 py-3 text-sm text-[var(--text-muted)]"
            >
              Login screen
            </Link>
            <Link
              href="/"
              className="rounded-2xl border border-[var(--border)] bg-white px-4 py-3 text-sm text-[var(--text-muted)]"
            >
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
            <div className="flex flex-col gap-6 xl:flex-row xl:items-center xl:justify-between">
              <div>
                <p className="text-sm uppercase tracking-[0.2em] text-[var(--accent)]">Browser overview</p>
                <h1 className="mt-3 text-4xl font-semibold tracking-tight text-[var(--text)] sm:text-5xl">
                  O complemento web premium do coach.
                </h1>
                <p className="mt-4 max-w-3xl text-lg leading-8 text-[var(--text-muted)]">
                  Esta shell mostra a direção do browser: mais contexto, melhor organização e uma
                  sensação de comando total da operação.
                </p>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                <button className="rounded-2xl border border-[var(--border)] bg-white px-5 py-3 font-semibold text-[var(--text)]">
                  Download .apk
                </button>
                <button className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[var(--accent)] px-5 py-3 font-semibold text-[var(--accent-foreground)] shadow-[0_18px_40px_rgba(42,208,125,0.24)]">
                  Open session workspace
                  <ArrowRight size={18} />
                </button>
              </div>
            </div>
          </header>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {metrics.map(({ label, value, icon: Icon }) => (
              <div
                key={label}
                className="rounded-[28px] border border-[var(--border)] bg-[var(--surface-solid)] p-5 shadow-[var(--shadow-soft)]"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--accent)]/12">
                  <Icon size={22} className="text-[var(--accent)]" />
                </div>
                <p className="mt-6 text-sm uppercase tracking-[0.2em] text-[var(--text-muted)]">{label}</p>
                <p className="mt-2 text-4xl font-semibold text-[var(--text)]">{value}</p>
              </div>
            ))}
          </div>

          <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
            <div className="rounded-[32px] border border-[var(--border)] bg-[var(--surface-solid)] p-5 shadow-[var(--shadow-soft)] sm:p-6">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm uppercase tracking-[0.2em] text-[var(--text-muted)]">Today</p>
                  <h2 className="mt-2 text-2xl font-semibold text-[var(--text)]">Upcoming sessions</h2>
                </div>
                <div className="inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--surface-muted)] px-4 py-2 text-sm text-[var(--text-muted)]">
                  <Search size={16} />
                  Search athlete or session
                </div>
              </div>

              <div className="mt-6 grid gap-4">
                {upcomingSessions.map((session) => (
                  <div
                    key={`${session.time}-${session.athlete}`}
                    className="grid gap-4 rounded-[24px] border border-[var(--border)] bg-[var(--surface-muted)] p-5 sm:grid-cols-[110px_1fr_auto]"
                  >
                    <div>
                      <p className="text-xs uppercase tracking-[0.2em] text-[var(--text-muted)]">Time</p>
                      <p className="mt-2 text-2xl font-semibold text-[var(--text)]">{session.time}</p>
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-[0.2em] text-[var(--text-muted)]">Athlete</p>
                      <p className="mt-2 text-lg font-semibold text-[var(--text)]">{session.athlete}</p>
                      <p className="mt-1 text-[var(--text-muted)]">{session.focus}</p>
                    </div>
                    <button className="rounded-2xl border border-[var(--accent)]/20 bg-[var(--accent)]/10 px-4 py-3 text-sm font-semibold text-[var(--accent)]">
                      Open session
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid gap-6">
              <div className="rounded-[32px] border border-[var(--border)] bg-[var(--surface-solid)] p-5 shadow-[var(--shadow-soft)] sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm uppercase tracking-[0.2em] text-[var(--text-muted)]">Focus queue</p>
                    <h2 className="mt-2 text-2xl font-semibold text-[var(--text)]">Clients needing action</h2>
                  </div>
                  <Activity size={20} className="text-[var(--accent)]" />
                </div>

                <div className="mt-6 grid gap-4">
                  {clients.map((client) => (
                    <div
                      key={client.name}
                      className="flex items-center justify-between rounded-[24px] border border-[var(--border)] bg-[var(--surface-muted)] px-4 py-4"
                    >
                      <div className="flex items-center gap-3">
                        <span className={`h-3 w-3 rounded-full ${client.color}`} />
                        <div>
                          <p className="font-medium text-[var(--text)]">{client.name}</p>
                          <p className="text-sm text-[var(--text-muted)]">{client.status}</p>
                        </div>
                      </div>
                      <ChevronRight size={18} className="text-white/45" />
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-[32px] border border-[var(--border-strong)] bg-[linear-gradient(180deg,var(--accent-soft),rgba(124,77,255,0.08))] p-5 shadow-[var(--shadow-soft)] sm:p-6">
                <div className="flex items-center gap-3">
                  <CreditCard size={20} className="text-[var(--accent)]" />
                  <p className="text-sm uppercase tracking-[0.2em] text-[var(--accent)]">Premium browser angle</p>
                </div>
                <h2 className="mt-4 text-2xl font-semibold text-[var(--text)]">
                  Gestão, leitura e follow-up com mais autoridade.
                </h2>
                <p className="mt-4 leading-8 text-[var(--text-muted)]">
                  Esta vista ajuda a vender o web como o espaço onde o coach organiza a operação,
                  acompanha decisões e trabalha com uma perceção de produto mais premium.
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
