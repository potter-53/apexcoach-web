"use client";

import Link from "next/link";
import { ArrowLeft, ArrowRight, CheckCircle2, Eye, EyeOff, KeyRound, LockKeyhole, Mail, ShieldCheck, X } from "lucide-react";
import { useEffect, useState } from "react";
import ThemeToggle from "../../../src/components/ThemeToggle";
import { clearStoredSupabaseSession, getSupabaseBrowserClient, isSupabaseConfigured } from "../../../src/lib/supabase-browser";
import NlockLogo from "../NlockLogo";

const METRIC_SETS = [
  [
    { value: "24", label: "clientes ativos", detail: "carteira atual" },
    { value: "15", label: "sessões", detail: "esta semana" },
    { value: "6", label: "avaliações", detail: "este mês" },
  ],
  [
    { value: "91%", label: "adesão média", detail: "últimos 30 dias" },
    { value: "8,4h", label: "recuperadas", detail: "esta semana" },
    { value: "3", label: "alertas resolvidos", detail: "hoje" },
  ],
  [
    { value: "128", label: "sessões concluídas", detail: "este trimestre" },
    { value: "42", label: "planos ativos", detail: "em acompanhamento" },
    { value: "+18%", label: "evolução média", detail: "nas avaliações" },
  ],
];

export default function NlockLogin() {
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [recovery, setRecovery] = useState({ open: false, step: "email", email: "", code: "", password: "", confirmation: "", busy: false, error: "", success: "" });
  const [recoverySession, setRecoverySession] = useState(false);
  const [metricSet, setMetricSet] = useState(0);
  const [metricsVisible, setMetricsVisible] = useState(true);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return undefined;
    let transitionTimer;
    const rotationTimer = window.setInterval(() => {
      setMetricsVisible(false);
      transitionTimer = window.setTimeout(() => {
        setMetricSet((current) => (current + 1) % METRIC_SETS.length);
        setMetricsVisible(true);
      }, 240);
    }, 3600);
    return () => {
      window.clearInterval(rotationTimer);
      window.clearTimeout(transitionTimer);
    };
  }, []);

  useEffect(() => {
    if (!isSupabaseConfigured()) return;
    const recoveryMode = new URLSearchParams(window.location.search).get("mode") === "recovery";
    const inactiveSession = new URLSearchParams(window.location.search).get("reason") === "inactive";
    if (inactiveSession) setNotice("Terminámos a sessão após 8 horas sem atividade. O teu browser pode preencher novamente os dados guardados.");
    if (!recoveryMode) clearStoredSupabaseSession();
    if (recoveryMode) setRecovery((current) => ({ ...current, open: true, step: "password" }));
    let active = true;
    const supabase = getSupabaseBrowserClient();
    const { data: listener } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "PASSWORD_RECOVERY" && active) {
        setRecoverySession(true);
        setRecovery((current) => ({ ...current, open: true, step: "password", error: "" }));
      }
      if (event === "INITIAL_SESSION" && session?.user && active && recoveryMode) setRecoverySession(true);
    });
    return () => {
      active = false;
      listener.subscription.unsubscribe();
    };
  }, []);

  function updateRecovery(values) {
    setRecovery((current) => ({ ...current, ...values }));
  }

  async function sendRecoveryCode(event) {
    event?.preventDefault();
    const email = recovery.email.trim().toLowerCase();
    if (!email) return updateRecovery({ error: "Indica o email associado à tua conta." });
    if (!isSupabaseConfigured()) return updateRecovery({ error: "A ligação à NLOCK não está configurada neste ambiente." });
    updateRecovery({ busy: true, error: "", success: "" });
    try {
      const { error: resetError } = await getSupabaseBrowserClient().auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/workspace/login?mode=recovery`,
      });
      if (resetError) throw resetError;
      updateRecovery({ step: "password", email, busy: false, success: `Enviámos um código de recuperação para ${email}.` });
    } catch (resetError) {
      updateRecovery({ busy: false, error: resetError?.message || "Não foi possível enviar o código de recuperação." });
    }
  }

  async function updatePassword(event) {
    event.preventDefault();
    if (recovery.password.length < 8) return updateRecovery({ error: "A nova password deve ter pelo menos 8 caracteres." });
    if (recovery.password !== recovery.confirmation) return updateRecovery({ error: "As passwords não coincidem." });
    if (!recoverySession && (!recovery.email.trim() || !recovery.code.trim())) return updateRecovery({ error: "Introduz o email e o código recebidos." });
    updateRecovery({ busy: true, error: "", success: "" });
    try {
      const supabase = getSupabaseBrowserClient();
      if (!recoverySession) {
        const { data, error: verifyError } = await supabase.auth.verifyOtp({
          email: recovery.email.trim().toLowerCase(),
          token: recovery.code.trim(),
          type: "recovery",
        });
        if (verifyError || !data.session?.user) throw verifyError || new Error("Código inválido ou expirado.");
      }
      const { error: passwordError } = await supabase.auth.updateUser({ password: recovery.password });
      if (passwordError) throw passwordError;
      await supabase.auth.signOut({ scope: "local" });
      setRecoverySession(false);
      updateRecovery({ step: "complete", busy: false, error: "", success: "Password atualizada. Já podes iniciar sessão." });
      window.history.replaceState({}, "", "/workspace/login");
    } catch (passwordError) {
      updateRecovery({ busy: false, error: passwordError?.message || "Não foi possível atualizar a password." });
    }
  }

  async function submit(event) {
    event.preventDefault();
    setError("");

    if (!isSupabaseConfigured()) {
      setError("A ligação à NLOCK não está configurada neste ambiente.");
      return;
    }

    setLoading(true);
    const form = new FormData(event.currentTarget);
    const email = String(form.get("email") || "").trim().toLowerCase();
    const password = String(form.get("password") || "");

    try {
      const supabase = getSupabaseBrowserClient();
      const { data, error: signInError } = await withTimeout(
        supabase.auth.signInWithPassword({ email, password }),
        12000,
        "O serviço de autenticação NLOCK está temporariamente indisponível. Tenta novamente dentro de alguns instantes.",
      );
      if (signInError) throw signInError;
      if (!data.user) throw new Error("Não foi possível validar a sessão.");
      window.location.replace(loginDestination());
    } catch (authError) {
      const message = String(authError?.message || "").toLowerCase();
      setError(message.includes("invalid login credentials")
        ? "Email ou password incorretos."
        : authError?.message || "Não foi possível iniciar sessão.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[var(--app-canvas)] text-[var(--text)]">
      <div className="pointer-events-none fixed inset-0 bg-[image:var(--app-background)]" />
      <div className="relative grid min-h-screen lg:grid-cols-[1.05fr_.95fr]">
        <section className="hidden overflow-hidden border-r border-white/10 bg-[#06100e] p-12 text-white lg:flex lg:flex-col">
          <NlockLogo />
          <div className="my-auto max-w-xl"><p className="text-[10px] font-bold uppercase tracking-[0.28em] text-[#35d38a]">O teu sistema de trabalho</p><h1 className="mt-6 text-5xl font-semibold leading-[1.05] tracking-[-0.055em]">Tudo o que precisas para acompanhar melhor.</h1><p className="mt-6 max-w-lg text-base leading-7 text-white/55">Clientes, sessões, treino e progresso num workspace criado para proteger o teu tempo e melhorar cada decisão.</p><div aria-live="polite" className="mt-12 grid grid-cols-3 gap-3">{METRIC_SETS[metricSet].map((metric, index) => <div key={index} className="relative min-h-[126px] overflow-hidden rounded-2xl border border-white/10 bg-white/[.045] p-4"><span className="absolute right-4 top-4 h-1.5 w-1.5 rounded-full bg-[#35d38a] shadow-[0_0_14px_rgba(53,211,138,.75)]" /><div className={`transition-all duration-300 ease-out ${metricsVisible ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0"}`} style={{ transitionDelay: `${index * 45}ms` }}><p className="text-2xl font-semibold tracking-[-0.04em]">{metric.value}</p><p className="mt-2 text-[9px] font-semibold uppercase tracking-[0.16em] text-white/55">{metric.label}</p><p className="mt-2 text-[9px] text-white/25">{metric.detail}</p></div></div>)}</div><div className="mt-4 flex items-center gap-1.5" aria-hidden="true">{METRIC_SETS.map((_, index) => <span key={index} className={`h-1 rounded-full transition-all duration-300 ${index === metricSet ? "w-6 bg-[#35d38a]" : "w-1.5 bg-white/20"}`} />)}<span className="ml-2 text-[8px] font-semibold uppercase tracking-[0.2em] text-white/25">Visão NLOCK</span></div></div>
          <p className="text-[9px] font-semibold uppercase tracking-[0.22em] text-white/30">NLOCK · Less time wasted.</p>
        </section>

        <section className="flex min-h-screen flex-col p-5 sm:p-8 lg:p-12">
          <div className="flex items-center justify-between"><div className="lg:hidden"><NlockLogo /></div><div className="ml-auto"><ThemeToggle language="pt" /></div></div>
          <div className="my-auto mx-auto w-full max-w-[430px] py-12">
            <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[var(--accent-strong)]">Bem-vindo de volta</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-[-0.045em] sm:text-4xl">Entra no teu workspace.</h2>
            <p className="mt-3 text-sm leading-6 text-[var(--text-muted)]">Continua de onde ficaste e mantém o teu dia em movimento.</p>
            <form onSubmit={submit} className="mt-9 grid gap-5">
              <label className="grid gap-2"><span className="text-xs font-semibold">Email</span><span className="relative"><Mail size={16} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-subtle)]" /><input required name="email" type="email" autoComplete="email" placeholder="coach@nlock.pt" className="h-[52px] w-full rounded-[14px] border border-[var(--border)] bg-[var(--surface-solid)] pl-11 pr-4 text-sm outline-none focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent-soft)]" /></span></label>
              <div className="grid gap-2"><span className="flex items-center justify-between text-xs font-semibold"><label htmlFor="nlock-login-password">Password</label><button type="button" onClick={() => updateRecovery({ open: true, step: "email", error: "", success: "" })} className="font-medium text-[var(--accent-strong)]">Recuperar password</button></span><span className="relative"><LockKeyhole size={16} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-subtle)]" /><input id="nlock-login-password" required name="password" type={visible ? "text" : "password"} autoComplete="current-password" placeholder="A tua password" className="h-[52px] w-full rounded-[14px] border border-[var(--border)] bg-[var(--surface-solid)] pl-11 pr-12 text-sm outline-none focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent-soft)]" /><button type="button" onClick={() => setVisible((current) => !current)} aria-label={visible ? "Ocultar password" : "Mostrar password"} className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--text-subtle)]">{visible ? <EyeOff size={17} /> : <Eye size={17} />}</button></span></div>
              {notice ? <p role="status" className="rounded-xl border border-[var(--accent)]/20 bg-[var(--accent-soft)] px-4 py-3 text-xs font-medium leading-5 text-[var(--accent-strong)]">{notice}</p> : null}
              {error ? <p role="alert" className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-xs font-medium text-red-600 dark:text-red-300">{error}</p> : null}
              <button disabled={loading} className="mt-2 flex h-[52px] items-center justify-center gap-2 rounded-[14px] bg-[var(--accent)] text-sm font-bold text-[var(--accent-foreground)] shadow-[var(--shadow-accent)] disabled:opacity-70">{loading ? "A entrar…" : "Entrar"}{!loading ? <ArrowRight size={16} /> : null}</button>
            </form>
            <p className="mt-7 text-center text-xs text-[var(--text-muted)]">Ainda não tens conta? <Link href="/signup?mode=trial" className="font-bold text-[var(--text)]">Criar conta</Link></p>
            <p className="mt-10 text-center text-[10px] leading-5 text-[var(--text-subtle)]">Acesso reservado a coaches com conta NLOCK ativa.</p>
          </div>
        </section>
      </div>
      {recovery.open ? <div className="fixed inset-0 z-50 grid place-items-center overflow-y-auto bg-black/45 p-4 backdrop-blur-sm"><section className="my-6 w-full max-w-[480px] rounded-[24px] border border-[var(--border)] bg-[var(--surface-solid)] p-6 shadow-[var(--shadow-panel)] sm:p-7"><div className="flex items-start gap-4"><span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-[var(--accent-soft)] text-[var(--accent-strong)]">{recovery.step === "complete" ? <CheckCircle2 size={21} /> : <KeyRound size={21} />}</span><div className="min-w-0 flex-1"><p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--accent-strong)]">Acesso NLOCK</p><h3 className="mt-1 text-xl font-semibold">{recovery.step === "email" ? "Recuperar password" : recovery.step === "complete" ? "Password atualizada" : "Definir nova password"}</h3></div><button type="button" disabled={recovery.busy} onClick={() => updateRecovery({ open: false, error: "", success: "" })} aria-label="Fechar" className="grid h-10 w-10 place-items-center rounded-xl border border-[var(--border)] text-[var(--text-muted)] disabled:opacity-50"><X size={16} /></button></div>{recovery.step === "email" ? <form onSubmit={sendRecoveryCode} className="mt-6 grid gap-4"><p className="text-sm leading-6 text-[var(--text-muted)]">Indica o email da tua conta. Vamos enviar-te um código temporário para definires uma nova password.</p><label className="grid gap-2 text-xs font-semibold">Email<span className="relative"><Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-subtle)]" /><input required type="email" autoComplete="email" value={recovery.email} onChange={(event) => updateRecovery({ email: event.target.value })} className="h-[50px] w-full rounded-xl border border-[var(--border)] bg-[var(--surface-muted)] pl-11 pr-4 outline-none focus:border-[var(--accent)]" /></span></label><div className="flex gap-3 rounded-xl border border-[var(--border)] bg-[var(--surface-muted)] p-3 text-xs leading-5 text-[var(--text-muted)]"><ShieldCheck size={17} className="mt-0.5 shrink-0 text-[var(--accent-strong)]" />O código é temporário e será enviado apenas para o email associado à conta.</div>{recovery.error ? <RecoveryError message={recovery.error} /> : null}<button disabled={recovery.busy} className="mt-1 flex h-12 items-center justify-center gap-2 rounded-xl bg-[var(--accent)] text-sm font-bold text-[var(--accent-foreground)] disabled:opacity-60">{recovery.busy ? "A enviar…" : "Enviar código"}<ArrowRight size={16} /></button></form> : recovery.step === "password" ? <form onSubmit={updatePassword} className="mt-6 grid gap-4"><p className="text-sm leading-6 text-[var(--text-muted)]">{recoverySession ? "O link foi validado. Define agora uma nova password." : recovery.success || `Introduz o código enviado para ${recovery.email || "o teu email"}.`}</p>{!recoverySession ? <><label className="grid gap-2 text-xs font-semibold">Email<input required type="email" autoComplete="email" value={recovery.email} onChange={(event) => updateRecovery({ email: event.target.value })} className="h-[50px] rounded-xl border border-[var(--border)] bg-[var(--surface-muted)] px-4 outline-none focus:border-[var(--accent)]" /></label><label className="grid gap-2 text-xs font-semibold">Código de recuperação<input required inputMode="numeric" autoComplete="one-time-code" value={recovery.code} onChange={(event) => updateRecovery({ code: event.target.value.replace(/\s/g, "") })} className="h-[50px] rounded-xl border border-[var(--border)] bg-[var(--surface-muted)] px-4 text-base tracking-[0.16em] outline-none focus:border-[var(--accent)]" /></label></> : null}<label className="grid gap-2 text-xs font-semibold">Nova password<input required minLength={8} type="password" autoComplete="new-password" value={recovery.password} onChange={(event) => updateRecovery({ password: event.target.value })} className="h-[50px] rounded-xl border border-[var(--border)] bg-[var(--surface-muted)] px-4 outline-none focus:border-[var(--accent)]" /></label><label className="grid gap-2 text-xs font-semibold">Confirmar password<input required minLength={8} type="password" autoComplete="new-password" value={recovery.confirmation} onChange={(event) => updateRecovery({ confirmation: event.target.value })} className="h-[50px] rounded-xl border border-[var(--border)] bg-[var(--surface-muted)] px-4 outline-none focus:border-[var(--accent)]" /></label>{recovery.error ? <RecoveryError message={recovery.error} /> : null}<button disabled={recovery.busy} className="mt-1 h-12 rounded-xl bg-[var(--accent)] text-sm font-bold text-[var(--accent-foreground)] disabled:opacity-60">{recovery.busy ? "A atualizar…" : "Atualizar password"}</button>{recovery.email ? <button type="button" disabled={recovery.busy} onClick={sendRecoveryCode} className="text-xs font-semibold text-[var(--accent-strong)] disabled:opacity-50">Reenviar código</button> : null}<button type="button" disabled={recovery.busy} onClick={() => updateRecovery({ step: "email", error: "", success: "" })} className="inline-flex items-center justify-center gap-2 text-xs text-[var(--text-muted)]"><ArrowLeft size={13} />Alterar email</button></form> : <div className="mt-6"><p className="rounded-xl bg-[var(--accent-soft)] px-4 py-4 text-sm font-medium text-[var(--accent-strong)]">{recovery.success}</p><button type="button" onClick={() => updateRecovery({ open: false, step: "email", code: "", password: "", confirmation: "", success: "" })} className="mt-5 h-12 w-full rounded-xl bg-[var(--accent)] text-sm font-bold text-[var(--accent-foreground)]">Voltar ao login</button></div>}</section></div> : null}
    </main>
  );
}

function RecoveryError({ message }) {
  return <p role="alert" className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-xs font-medium text-red-600 dark:text-red-300">{message}</p>;
}

function withTimeout(request, milliseconds, message) {
  let timeoutId;
  const timeout = new Promise((_, reject) => {
    timeoutId = window.setTimeout(() => reject(new Error(message)), milliseconds);
  });
  return Promise.race([request, timeout]).finally(() => window.clearTimeout(timeoutId));
}

function loginDestination() {
  return "/workspace";
}
