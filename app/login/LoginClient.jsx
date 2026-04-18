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

import { applyCoachLocale, getCoachLocaleFromUser } from "../../src/lib/coach-locale";
import { getSupabaseBrowserClient, isSupabaseConfigured } from "../../src/lib/supabase-browser";

const highlights = [
  "Direct continuity with the mobile app logic",
  "More context for managing clients, agenda, and reports",
  "Premium desktop experience built for the coach",
];

function describeAuthError(error) {
  const raw = String(error?.message ?? error ?? "").trim();

  if (raw.toLowerCase().includes("invalid login credentials")) {
    return "Incorrect email or password.";
  }

  if (raw.toLowerCase().includes("email not confirmed")) {
    return "Confirm your email before entering the browser workspace.";
  }

  if (raw.toLowerCase().includes("supabase env vars are missing")) {
    return "Supabase environment variables are missing in the web project.";
  }

  return raw || "Could not sign into the browser workspace. Try again.";
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
      setErrorMessage("Supabase environment variables are missing in the web project.");
      return;
    }

    setSubmitting(true);
    setErrorMessage("");

    try {
      const supabase = getSupabaseBrowserClient();
      const normalizedEmail = email.trim().toLowerCase();

      const { data, error } = await supabase.auth.signInWithPassword({
        email: normalizedEmail,
        password,
      });

      if (error) throw error;
      applyCoachLocale(getCoachLocaleFromUser(data?.user));

      try {
        if (!rememberMe) {
          window.sessionStorage.setItem("apexcoach-session-mode", "session");
        } else {
          window.localStorage.setItem("apexcoach-session-mode", "remember");
        }
      } catch {}

      router.push("/app");
      router.refresh();
    } catch (error) {
      setErrorMessage(describeAuthError(error));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="min-h-screen bg-[var(--bg)] text-[var(--text)]">
      <div className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,rgba(42,208,125,0.16),transparent_28%),radial-gradient(circle_at_bottom_right,rgba(124,77,255,0.08),transparent_22%),linear-gradient(180deg,#fbfbfb_0%,#f5f5f5_52%,#f2f4f3_100%)]" />

      <div className="mx-auto flex min-h-screen max-w-7xl flex-col px-5 py-8 lg:px-8">
        <div className="flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--surface-solid)] px-4 py-2 text-sm text-[var(--text-muted)] transition hover:bg-white hover:text-[var(--text)]"
          >
            <ArrowLeft size={16} />
            Back to landing
          </Link>

          <Link
            href="/app"
            className="inline-flex items-center gap-2 rounded-full bg-[var(--accent)] px-4 py-2 text-sm font-semibold text-[var(--accent-foreground)]"
          >
            View browser demo
            <ArrowRight size={16} />
          </Link>
        </div>

        <div className="grid flex-1 items-center gap-10 py-10 lg:grid-cols-[0.95fr_1.05fr]">
          <section className="max-w-xl">
            <div className="inline-flex rounded-full border border-[var(--accent)]/20 bg-[linear-gradient(135deg,var(--accent-soft),rgba(124,77,255,0.08))] px-4 py-2 text-sm font-medium text-[var(--accent-strong)]">
              Browser access for coaches
            </div>

            <h1 className="mt-8 text-5xl font-semibold leading-[1.02] text-[var(--text)] sm:text-6xl">
              Enter the APEX COACH browser workspace.
            </h1>

            <p className="mt-6 text-lg leading-8 text-[var(--text-muted)]">
              The web is the premium companion to the app: more space to think,
              more visible information, and a stronger workflow for the coach day to day.
            </p>

            <div className="mt-10 grid gap-4">
              {highlights.map((item) => (
                <div
                  key={item}
                  className="flex items-start gap-3 rounded-2xl border border-[var(--border)] bg-[var(--surface-solid)] px-4 py-4 shadow-[var(--shadow-soft)]"
                >
                  <CheckCircle2 size={18} className="mt-0.5 text-[var(--accent-strong)]" />
                  <p className="text-[var(--text-muted)]">{item}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-[36px] border border-[var(--border-strong)] bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(245,245,245,0.95))] p-6 shadow-[var(--shadow-panel)] sm:p-8">
            <div className="rounded-[28px] border border-[var(--border)] bg-[var(--surface-solid)] p-6 sm:p-8">
              <div className="mb-8 flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm uppercase tracking-[0.22em] text-[var(--text-muted)]">Coach login</p>
                  <h2 className="mt-3 text-3xl font-semibold text-[var(--text)]">Welcome back</h2>
                </div>
                <div className="rounded-2xl border border-[var(--accent)]/20 bg-[linear-gradient(135deg,var(--accent-soft),rgba(124,77,255,0.1))] p-3 text-[var(--electric)]">
                  <LockKeyhole size={22} />
                </div>
              </div>

              {!configured && (
                <div className="mb-5 flex items-start gap-3 rounded-2xl border border-amber-400/20 bg-amber-400/10 px-4 py-4 text-amber-100">
                  <AlertCircle size={18} className="mt-0.5 shrink-0" />
                  <p className="text-sm leading-7">
                    `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`
                    still need to be configured in the project and on Vercel.
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
                  <span className="text-sm text-[var(--text-muted)]">Email</span>
                  <input
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder="coach@apexcoach.pt"
                    className="rounded-2xl border border-[var(--border)] bg-[var(--surface-muted)] px-4 py-3.5 text-[var(--text)] outline-none transition placeholder:text-[var(--text-muted)] focus:border-[var(--accent)]/40 focus:bg-white"
                    autoComplete="email"
                    required
                  />
                </label>

                <label className="grid gap-2">
                  <span className="text-sm text-[var(--text-muted)]">Password</span>
                  <input
                    type="password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    placeholder="••••••••••"
                    className="rounded-2xl border border-[var(--border)] bg-[var(--surface-muted)] px-4 py-3.5 text-[var(--text)] outline-none transition placeholder:text-[var(--text-muted)] focus:border-[var(--accent)]/40 focus:bg-white"
                    autoComplete="current-password"
                    required
                  />
                </label>

                <div className="mt-2 flex items-center justify-between gap-4 text-sm text-[var(--text-muted)]">
                  <label className="inline-flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(event) => setRememberMe(event.target.checked)}
                      className="h-4 w-4 rounded border-white/20 bg-transparent"
                    />
                    Keep me signed in
                  </label>
                  <button type="button" className="text-[var(--accent-strong)]">
                    Recover access
                  </button>
                </div>

                <button
                  type="submit"
                  disabled={submitting || !configured}
                  className="mt-4 inline-flex items-center justify-center gap-2 rounded-2xl bg-[var(--accent)] px-5 py-4 font-semibold text-[var(--accent-foreground)] shadow-[0_18px_60px_rgba(42,208,125,0.22)] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {submitting ? (
                    <>
                      <LoaderCircle size={18} className="animate-spin" />
                      Signing in...
                    </>
                  ) : (
                    <>
                      Enter browser workspace
                      <ArrowRight size={18} />
                    </>
                  )}
                </button>

                <Link
                  href="/signup"
                  className="rounded-2xl border border-[var(--border)] bg-[var(--surface-muted)] px-5 py-4 text-center font-semibold text-[var(--text)]"
                >
                  Create coach account
                </Link>
              </form>

              <div className="mt-8 grid gap-3 rounded-[24px] border border-[var(--border)] bg-[var(--surface-muted)] p-4">
                <div className="flex items-center gap-3">
                  <ShieldCheck size={18} className="text-[var(--accent-strong)]" />
                  <p className="font-medium text-[var(--text)]">Single coach identity</p>
                </div>
                <p className="text-sm leading-7 text-[var(--text-muted)]">
                  The same identity works for the field app and the premium browser workspace.
                </p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
