"use client";

import {
  ArrowUpRight,
  CalendarDays,
  ChevronRight,
  ClipboardCheck,
  Clock3,
  Dumbbell,
  LayoutDashboard,
  Plus,
  Settings,
  TrendingUp,
  Users,
} from "lucide-react";
import ThemeToggle from "../../../src/components/ThemeToggle";

const navigation = [
  { label: "Visão geral", icon: LayoutDashboard, active: true },
  { label: "Clientes", icon: Users },
  { label: "Agenda", icon: CalendarDays },
  { label: "Treinos", icon: Dumbbell },
  { label: "Avaliações", icon: ClipboardCheck },
];

const metrics = [
  { label: "Clientes ativos", value: "128", change: "+14%", icon: Users },
  { label: "Sessões este mês", value: "342", change: "+9%", icon: CalendarDays },
  { label: "Taxa de adesão", value: "78%", change: "+6%", icon: TrendingUp },
  { label: "Tempo poupado", value: "12.4h", change: "esta semana", icon: Clock3 },
];

const agenda = [
  { time: "09:00", name: "Joana Martins", type: "Treino 60 min", color: "var(--brand-cyan)" },
  { time: "11:30", name: "Miguel Santos", type: "Avaliação física", color: "var(--brand-mint)" },
  { time: "14:00", name: "Inês Rocha", type: "Treino 45 min", color: "var(--brand-lime)" },
  { time: "17:30", name: "Pedro Lima", type: "Treino 60 min", color: "var(--brand-cyan)" },
];

function BrandMark() {
  return (
    <div className="flex items-center gap-3">
      <span className="grid h-10 w-10 place-items-center rounded-[var(--radius-sm)] bg-[image:var(--brand-gradient)] text-base font-black text-[var(--accent-foreground)] shadow-[var(--shadow-accent)]">N</span>
      <div>
        <p className="text-sm font-semibold tracking-[0.28em] text-[var(--text)]">NLOCK</p>
        <p className="mt-0.5 text-[9px] uppercase tracking-[var(--tracking-label)] text-[var(--text-subtle)]">Coach workspace</p>
      </div>
    </div>
  );
}

function MetricCard({ label, value, change, icon: Icon }) {
  return (
    <article className="rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--surface-solid)] p-4 shadow-[var(--shadow-soft)]">
      <div className="flex items-start justify-between gap-3">
        <p className="text-xs font-medium text-[var(--text-muted)]">{label}</p>
        <span className="grid h-8 w-8 place-items-center rounded-[var(--radius-sm)] bg-[var(--accent-soft)] text-[var(--accent-strong)]"><Icon size={15} /></span>
      </div>
      <p className="mt-5 text-3xl font-semibold tracking-[var(--tracking-display)] text-[var(--text)]">{value}</p>
      <p className="mt-2 text-[11px] font-semibold text-[var(--accent-strong)]">{change}</p>
    </article>
  );
}

export default function DashboardPreview() {
  return (
    <main className="nlock-app min-h-screen bg-[var(--app-canvas)] text-[var(--text)]">
      <div className="pointer-events-none fixed inset-0 -z-10 bg-[image:var(--app-background)]" />
      <div className="mx-auto grid min-h-screen max-w-[1600px] gap-4 p-3 lg:grid-cols-[240px_minmax(0,1fr)] lg:p-4">
        <aside className="hidden border border-[var(--border)] bg-[var(--app-sidebar)] p-4 shadow-[var(--shadow-panel)] lg:flex lg:flex-col">
          <BrandMark />

          <div className="mt-7 rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--surface-muted)] p-3">
            <p className="truncate text-sm font-semibold text-[var(--text)]">Gabriel Coach</p>
            <p className="mt-1 text-[10px] uppercase tracking-[var(--tracking-label)] text-[var(--accent-strong)]">Plano Founder</p>
          </div>

          <nav className="mt-6 grid gap-1.5">
            {navigation.map(({ label, icon: Icon, active }) => (
              <button key={label} className={`flex min-h-11 items-center gap-3 rounded-[var(--radius-sm)] px-3 text-left text-sm font-medium ${active ? "bg-[var(--accent-soft)] text-[var(--accent-strong)]" : "text-[var(--text-muted)] hover:bg-[var(--surface-muted)] hover:text-[var(--text)]"}`}>
                <Icon size={17} />
                <span>{label}</span>
                {active ? <span className="ml-auto h-1.5 w-1.5 rounded-full bg-[var(--accent)]" /> : null}
              </button>
            ))}
          </nav>

          <div className="mt-auto grid gap-2 border-t border-[var(--border)] pt-4">
            <button className="flex min-h-11 items-center gap-3 rounded-[var(--radius-sm)] px-3 text-sm text-[var(--text-muted)] hover:bg-[var(--surface-muted)]"><Settings size={17} />Definições</button>
            <p className="px-3 text-[9px] uppercase tracking-[var(--tracking-label)] text-[var(--text-subtle)]">Less time wasted.</p>
          </div>
        </aside>

        <section className="min-w-0">
          <header className="sticky top-3 z-20 flex items-center justify-between gap-4 border border-[var(--border)] bg-[var(--app-header)] px-4 py-3 shadow-[var(--shadow-soft)] backdrop-blur-xl sm:px-5">
            <div className="flex min-w-0 items-center gap-3">
              <div className="lg:hidden"><BrandMark /></div>
              <div className="hidden sm:block">
                <p className="text-[10px] uppercase tracking-[var(--tracking-label)] text-[var(--text-subtle)]">Visão geral</p>
                <h1 className="mt-1 text-xl font-semibold text-[var(--text)]">Bom dia, Gabriel <span aria-hidden="true">👋</span></h1>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <ThemeToggle language="pt" />
              <button className="inline-flex min-h-11 items-center gap-2 rounded-[var(--radius-sm)] bg-[var(--accent)] px-4 text-sm font-semibold text-[var(--accent-foreground)] shadow-[var(--shadow-accent)]"><Plus size={16} />Nova sessão</button>
            </div>
          </header>

          <div className="grid gap-4 py-4">
            <div className="sm:hidden">
              <p className="text-[10px] uppercase tracking-[var(--tracking-label)] text-[var(--text-subtle)]">Visão geral</p>
              <h1 className="mt-1 text-2xl font-semibold text-[var(--text)]">Bom dia, Gabriel <span aria-hidden="true">👋</span></h1>
            </div>

            <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              {metrics.map((metric) => <MetricCard key={metric.label} {...metric} />)}
            </section>

            <section className="grid gap-4 xl:grid-cols-[1.35fr_0.65fr]">
              <article className="rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface-solid)] p-4 shadow-[var(--shadow-soft)] sm:p-5">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-[10px] uppercase tracking-[var(--tracking-label)] text-[var(--accent-strong)]">Performance</p>
                    <h2 className="mt-2 text-lg font-semibold text-[var(--text)]">Evolução dos resultados</h2>
                  </div>
                  <button className="inline-flex items-center gap-1 text-xs font-semibold text-[var(--text-muted)] hover:text-[var(--text)]">Últimos 6 meses <ChevronRight size={14} /></button>
                </div>
                <div className="mt-8 h-52 rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--surface-muted)] p-4">
                  <svg viewBox="0 0 700 180" className="h-full w-full" role="img" aria-label="Gráfico de evolução ascendente">
                    <defs><linearGradient id="area" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="var(--brand-mint)" stopOpacity=".25"/><stop offset="1" stopColor="var(--brand-cyan)" stopOpacity="0"/></linearGradient></defs>
                    <path d="M0 148 C65 130 75 72 140 92 S220 140 280 94 S355 55 420 80 S505 120 560 62 S640 70 700 18 L700 180 L0 180 Z" fill="url(#area)" />
                    <path d="M0 148 C65 130 75 72 140 92 S220 140 280 94 S355 55 420 80 S505 120 560 62 S640 70 700 18" fill="none" stroke="var(--brand-mint)" strokeWidth="3" strokeLinecap="round" />
                  </svg>
                </div>
              </article>

              <article className="rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface-solid)] p-4 shadow-[var(--shadow-soft)] sm:p-5">
                <div className="flex items-center justify-between">
                  <div><p className="text-[10px] uppercase tracking-[var(--tracking-label)] text-[var(--accent-strong)]">Hoje</p><h2 className="mt-2 text-lg font-semibold text-[var(--text)]">Próximas sessões</h2></div>
                  <button className="grid h-9 w-9 place-items-center rounded-[var(--radius-sm)] border border-[var(--border)] text-[var(--text-muted)]"><ArrowUpRight size={15} /></button>
                </div>
                <div className="mt-5 grid gap-2">
                  {agenda.map((item) => (
                    <div key={`${item.time}-${item.name}`} className="flex items-center gap-3 rounded-[var(--radius-sm)] border border-[var(--border)] bg-[var(--surface-muted)] p-3">
                      <span className="h-8 w-1 rounded-full" style={{ background: item.color }} />
                      <div className="min-w-0 flex-1"><p className="truncate text-sm font-semibold text-[var(--text)]">{item.name}</p><p className="mt-1 truncate text-[10px] text-[var(--text-muted)]">{item.type}</p></div>
                      <p className="text-xs font-semibold text-[var(--text)]">{item.time}</p>
                    </div>
                  ))}
                </div>
              </article>
            </section>
          </div>
        </section>
      </div>
    </main>
  );
}
