"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  LoaderCircle,
  LockKeyhole,
  ShieldCheck,
} from "lucide-react";

import { getSupabaseBrowserClient, isSupabaseConfigured } from "../../src/lib/supabase-browser";

const highlights = [
  "Continuidade direta com a lógica da app mobile",
  "Mais contexto para gerir clientes, agenda e reports",
  "Experiência premium pensada para o coach em desktop",
];

function describeAuthError(error) {
  const raw = String(error?.message ?? error ?? "").trim();

  if (raw.toLowerCase().includes("invalid login credentials")) {
    return "Email ou password incorretos.";
  }

  if (raw.toLowerCase().includes("email not confirmed")) {
    return "Confirma o teu email antes de entrares no browser.";
  }

  if (raw.toLowerCase().includes("supabase env vars are missing")) {
    return "Faltam as variáveis de ambiente do Supabase no projeto web.";
  }

  return raw || "Não foi possível entrar no browser. Tenta novamente.";
}

export default function LoginClient() {
  const router = useRouter();
  const configured = useMemo(() => isSupabaseConfigured(), []);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();

    if (!configured) {
      setErrorMessage("Faltam as variáveis de ambiente do Supabase no projeto web.");
      return;
    }

    setSubmitting(true);
    setErrorMessage("");

    try {
      const supabase = getSupabaseBrowserClient();
      const normalizedEmail = email.trim().toLowerCase();

      const { error } = await supabase.auth.signInWithPassword({
        email: normalizedEmail,
        password,
      });

      if (error) throw error;

      if (!rememberMe) {
        window.sessionStorage.setItem("apexcoach-session-mode", "session");
      } else {
        window.localStorage.setItem("apexcoach-session-mode", "remember");
      }

      router.push("/app");
      router.refresh();
    } catch (error) {
      setErrorMessage(describeAuthError(error));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="min-h-screen bg-[var(--bg)] text-white">
      <div className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,rgba(110,231,183,0.16),transparent_28%),radial-gradient(circle_at_bottom_right,rgba(56,189,248,0.12),transparent_24%),linear-gradient(180deg,#071014_0%,#09161b_38%,#0c1015_100%)]" />

      <div className="mx-auto flex min-h-screen max-w-7xl flex-col px-5 py-8 lg:px-8">
        <div className="flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/75 transition hover:bg-white/10 hover:text-white"
          >
            <ArrowLeft size={16} />
            Voltar à landing
          </Link>

          <Link
            href="/app"
            className="inline-flex items-center gap-2 rounded-full bg-[var(--accent)] px-4 py-2 text-sm font-semibold text-[#081014]"
          >
            Ver demo do browser
            <ArrowRight size={16} />
          </Link>
        </div>

        <div className="grid flex-1 items-center gap-10 py-10 lg:grid-cols-[0.95fr_1.05fr]">
          <section className="max-w-xl">
            <div className="inline-flex rounded-full border border-[var(--accent)]/25 bg-[var(--accent)]/10 px-4 py-2 text-sm font-medium text-[var(--accent)]">
              Browser access for coaches
            </div>

            <h1 className="mt-8 text-5xl font-semibold leading-[1.02] text-white sm:text-6xl">
              Entra no browser da APEX COACH.
            </h1>

            <p className="mt-6 text-lg leading-8 text-white/70">
              O web entra como complemento premium da app: mais espaço para pensar, mais
              informação visível e uma experiência mais forte para gerir o dia a dia do coach.
            </p>

            <div className="mt-10 grid gap-4">
              {highlights.map((item) => (
                <div
                  key={item}
                  className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-4"
                >
                  <CheckCircle2 size={18} className="mt-0.5 text-[var(--accent)]" />
                  <p className="text-white/78">{item}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-[36px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.08),rgba(255,255,255,0.03))] p-6 shadow-[0_30px_120px_rgba(0,0,0,0.35)] sm:p-8">
            <div className="rounded-[28px] border border-white/8 bg-[#081014]/80 p-6 sm:p-8">
              <div className="mb-8 flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm uppercase tracking-[0.22em] text-white/45">Coach login</p>
                  <h2 className="mt-3 text-3xl font-semibold text-white">Bem-vindo de volta</h2>
                </div>
                <div className="rounded-2xl border border-[var(--accent)]/25 bg-[var(--accent)]/12 p-3 text-[var(--accent)]">
                  <LockKeyhole size={22} />
                </div>
              </div>

              {!configured && (
                <div className="mb-5 flex items-start gap-3 rounded-2xl border border-amber-400/20 bg-amber-400/10 px-4 py-4 text-amber-100">
                  <AlertCircle size={18} className="mt-0.5 shrink-0" />
                  <p className="text-sm leading-7">
                    Falta configurar `NEXT_PUBLIC_SUPABASE_URL` e
                    `NEXT_PUBLIC_SUPABASE_ANON_KEY` no projeto e na Vercel.
                  </p>
                </div>
              )}

              {errorMessage && (
                <div className="mb-5 flex items-start gap-3 rounded-2xl border border-rose-400/20 bg-rose-400/10 px-4 py-4 text-rose-100">
                  <AlertCircle size={18} className="mt-0.5 shrink-0" />
                  <p className="text-sm leading-7">{errorMessage}</p>
                </div>
              )}

              <form className="grid gap-4" onSubmit={handleSubmit}>
                <label className="grid gap-2">
                  <span className="text-sm text-white/65">Email</span>
                  <input
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder="coach@apexcoach.pt"
                    className="rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3.5 text-white outline-none transition placeholder:text-white/28 focus:border-[var(--accent)]/40 focus:bg-white/[0.06]"
                    autoComplete="email"
                    required
                  />
                </label>

                <label className="grid gap-2">
                  <span className="text-sm text-white/65">Password</span>
                  <input
                    type="password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    placeholder="••••••••••"
                    className="rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3.5 text-white outline-none transition placeholder:text-white/28 focus:border-[var(--accent)]/40 focus:bg-white/[0.06]"
                    autoComplete="current-password"
                    required
                  />
                </label>

                <div className="mt-2 flex items-center justify-between gap-4 text-sm text-white/55">
                  <label className="inline-flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(event) => setRememberMe(event.target.checked)}
                      className="h-4 w-4 rounded border-white/20 bg-transparent"
                    />
                    Manter sessão iniciada
                  </label>
                  <button type="button" className="text-[var(--accent)]">
                    Recuperar acesso
                  </button>
                </div>

                <button
                  type="submit"
                  disabled={submitting || !configured}
                  className="mt-4 inline-flex items-center justify-center gap-2 rounded-2xl bg-[var(--accent)] px-5 py-4 font-semibold text-[#081014] shadow-[0_18px_60px_rgba(110,231,183,0.22)] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {submitting ? (
                    <>
                      <LoaderCircle size={18} className="animate-spin" />
                      A entrar...
                    </>
                  ) : (
                    <>
                      Entrar no browser
                      <ArrowRight size={18} />
                    </>
                  )}
                </button>

                <button
                  type="button"
                  className="rounded-2xl border border-white/10 bg-white/[0.04] px-5 py-4 font-semibold text-white/82"
                >
                  Criar conta de coach
                </button>
              </form>

              <div className="mt-8 grid gap-3 rounded-[24px] border border-white/8 bg-white/[0.03] p-4">
                <div className="flex items-center gap-3">
                  <ShieldCheck size={18} className="text-[var(--accent)]" />
                  <p className="font-medium text-white">Single coach identity</p>
                </div>
                <p className="text-sm leading-7 text-white/62">
                  A mesma identidade serve para a app no terreno e para o browser premium no
                  desktop.
                </p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
