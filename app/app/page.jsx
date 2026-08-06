import DashboardClient from "./DashboardClient";
import Link from "next/link";
import { ArrowLeft, ClipboardList, Dumbbell, Ruler, Smartphone } from "lucide-react";

export const metadata = {
  title: "Modo PC em preparação | APEX COACH",
  description: "Modo PC da APEX COACH em preparação para prescrição, avaliação e registo de clientes.",
};

const BROWSER_WORKSPACE_ENABLED = process.env.NEXT_PUBLIC_BROWSER_WORKSPACE_ENABLED === "true";

const pcModules = [
  {
    title: "Prescrição de treino",
    text: "Preparação de sessões, templates, exercícios, tags, protocolos e periodização com mais espaço para organizar.",
    Icon: Dumbbell,
  },
  {
    title: "Avaliação e métricas",
    text: "Leitura de assessments, comparação de valores, histórico e evolução do cliente num ecrã maior.",
    Icon: Ruler,
  },
  {
    title: "Registo do cliente",
    text: "Perfis completos com dados, sessões, pagamentos, planos ativos, notas e continuidade do acompanhamento.",
    Icon: ClipboardList,
  },
];

export default function CoachDashboardPage() {
  if (!BROWSER_WORKSPACE_ENABLED) {
    return (
      <main className="min-h-screen bg-[var(--bg)] px-5 py-8 text-[var(--text)]">
        <div className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,rgba(42,208,125,0.16),transparent_28%),radial-gradient(circle_at_bottom_right,rgba(124,77,255,0.08),transparent_22%),linear-gradient(180deg,#fbfbfb_0%,#f5f5f5_52%,#f2f4f3_100%)]" />

        <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-6xl flex-col">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <Link
              href="/"
              className="inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-white px-4 py-2 text-sm font-medium text-[var(--text-muted)] shadow-[var(--shadow-soft)] transition hover:text-[var(--text)]"
            >
              <ArrowLeft size={16} />
              Voltar a apexcoach.pt
            </Link>
            <a
              href="/download/apk"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-[var(--accent)] px-4 py-2 text-sm font-semibold text-[var(--accent-foreground)] shadow-[0_12px_30px_rgba(57,185,138,0.2)]"
            >
              <Smartphone size={16} />
              Download APK
            </a>
          </div>

          <section className="grid flex-1 items-center gap-8 py-12 lg:grid-cols-[0.92fr_1.08fr] lg:py-20">
            <div>
              <div className="inline-flex rounded-full border border-[var(--accent)]/20 bg-[var(--accent-soft)] px-4 py-2 text-sm font-semibold text-[var(--accent-strong)]">
                Modo PC em preparação
              </div>
              <h1 className="mt-7 max-w-3xl text-4xl font-semibold leading-[1.02] tracking-tight text-[var(--text)] sm:text-6xl">
                A app continua a ser o centro. O PC vai ser o teu apoio para preparar melhor.
              </h1>
              <p className="mt-6 max-w-2xl text-base leading-7 text-[var(--text-muted)] sm:text-lg sm:leading-8">
                Para já, o acesso browser ainda não está aberto aos coaches. Estamos a preparar o modo PC para concentrar a informação necessária à prescrição, avaliação e registo dos clientes, sem retirar o foco principal da APEX COACH: trabalhar no terreno através do smartphone.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <a
                  href="/download/apk"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-[16px] bg-[var(--accent)] px-5 py-3.5 font-semibold text-[var(--accent-foreground)] shadow-[0_12px_30px_rgba(57,185,138,0.2)]"
                >
                  <Smartphone size={18} />
                  Usar a app mobile
                </a>
                <Link
                  href="/signup"
                  className="inline-flex items-center justify-center rounded-[16px] border border-[var(--border)] bg-white px-5 py-3.5 font-semibold text-[var(--text)]"
                >
                  Começar trial grátis 14 dias
                </Link>
              </div>
            </div>

            <div className="rounded-[32px] border border-[var(--border-strong)] bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(245,245,245,0.95))] p-5 shadow-[var(--shadow-panel)] sm:p-7">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--accent)]">O que o modo PC vai resolver</p>
              <div className="mt-5 grid gap-3">
                {pcModules.map(({ title, text, Icon }) => (
                  <div key={title} className="rounded-[22px] border border-[var(--border)] bg-white p-4 shadow-[var(--shadow-soft)]">
                    <div className="flex items-start gap-3">
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-[var(--accent-soft)] text-[var(--accent-strong)]">
                        <Icon size={18} />
                      </span>
                      <div>
                        <h2 className="text-base font-semibold text-[var(--text)]">{title}</h2>
                        <p className="mt-1 text-sm leading-6 text-[var(--text-muted)]">{text}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-5 rounded-[22px] border border-[var(--accent)]/20 bg-[var(--accent-soft)] p-4 text-sm leading-6 text-[var(--accent-strong)]">
                O objetivo não é transformar a APEX COACH num software de secretária. É dar ao coach um modo PC para preparar e analisar melhor, mantendo a execução diária na app.
              </div>
            </div>
          </section>
        </div>
      </main>
    );
  }

  return <DashboardClient />;
}
