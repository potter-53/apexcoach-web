"use client";

import { ArrowRight, Eye, EyeOff, LockKeyhole, Mail } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import ThemeToggle from "../../../src/components/ThemeToggle";
import { getSupabaseBrowserClient, getVerifiedSupabaseUser, isSupabaseConfigured } from "../../../src/lib/supabase-browser";
import NlockLogo from "../NlockLogo";

export default function NlockLogin() {
  const router = useRouter();
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isSupabaseConfigured()) return;
    let active = true;
    getVerifiedSupabaseUser()
      .then(({ data }) => {
        if (active && data?.user) router.replace("/app");
      })
      .catch(() => {});
    return () => { active = false; };
  }, [router]);

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
      const { data, error: signInError } = await supabase.auth.signInWithPassword({ email, password });
      if (signInError) throw signInError;

      const { data: profileResult, error: profileError } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", data.user.id)
        .maybeSingle();

      if (profileError || profileResult?.role !== "coach") {
        await supabase.auth.signOut({ scope: "local" });
        throw new Error("Esta conta não tem acesso ao workspace de coach.");
      }

      router.replace("/app");
      router.refresh();
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
          <div className="my-auto max-w-xl"><p className="text-[10px] font-bold uppercase tracking-[0.28em] text-[#35d38a]">O teu sistema de trabalho</p><h1 className="mt-6 text-5xl font-semibold leading-[1.05] tracking-[-0.055em]">Tudo o que precisas para acompanhar melhor.</h1><p className="mt-6 max-w-lg text-base leading-7 text-white/55">Clientes, sessões, treino e progresso num workspace criado para proteger o teu tempo e melhorar cada decisão.</p><div className="mt-12 grid grid-cols-3 gap-3">{[["24","clientes ativos"],["91%","adesão média"],["8,4h","recuperadas"]].map(([value,label]) => <div key={label} className="rounded-2xl border border-white/10 bg-white/[.045] p-4"><p className="text-2xl font-semibold tracking-[-0.04em]">{value}</p><p className="mt-2 text-[9px] uppercase tracking-[0.16em] text-white/40">{label}</p></div>)}</div></div>
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
              <label className="grid gap-2"><span className="flex items-center justify-between text-xs font-semibold">Password<button type="button" className="font-medium text-[var(--accent-strong)]">Recuperar password</button></span><span className="relative"><LockKeyhole size={16} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-subtle)]" /><input required name="password" type={visible ? "text" : "password"} autoComplete="current-password" placeholder="A tua password" className="h-[52px] w-full rounded-[14px] border border-[var(--border)] bg-[var(--surface-solid)] pl-11 pr-12 text-sm outline-none focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent-soft)]" /><button type="button" onClick={() => setVisible(!visible)} aria-label={visible ? "Ocultar password" : "Mostrar password"} className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--text-subtle)]">{visible ? <EyeOff size={17} /> : <Eye size={17} />}</button></span></label>
              {error ? <p role="alert" className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-xs font-medium text-red-600 dark:text-red-300">{error}</p> : null}
              <button disabled={loading} className="mt-2 flex h-[52px] items-center justify-center gap-2 rounded-[14px] bg-[var(--accent)] text-sm font-bold text-[var(--accent-foreground)] shadow-[var(--shadow-accent)] disabled:opacity-70">{loading ? "A entrar…" : "Entrar"}{!loading ? <ArrowRight size={16} /> : null}</button>
            </form>
            <p className="mt-7 text-center text-xs text-[var(--text-muted)]">Ainda não tens conta? <button className="font-bold text-[var(--text)]">Criar conta</button></p>
            <p className="mt-10 text-center text-[10px] leading-5 text-[var(--text-subtle)]">Acesso reservado a coaches com conta NLOCK ativa.</p>
          </div>
        </section>
      </div>
    </main>
  );
}
