"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AlertCircle, ArrowLeft, ArrowRight, CheckCircle2, LoaderCircle, ShieldCheck, UserPlus } from "lucide-react";

import { applyCoachLocale } from "../../src/lib/coach-locale";
import { getSupabaseBrowserClient, isSupabaseConfigured } from "../../src/lib/supabase-browser";

const highlights = [
  "Create one identity for both app and browser",
  "Start with the premium web experience from onboarding",
  "Keep clients, agenda, and operations in the same account",
];

function describeSignupError(error) {
  const raw = String(error?.message ?? error ?? "").trim();
  if (raw.toLowerCase().includes("user already registered")) return "This email is already registered.";
  if (raw.toLowerCase().includes("password")) return "The password must meet the minimum Supabase requirements.";
  return raw || "Could not create the account.";
}

export default function SignupClient() {
  const router = useRouter();
  const configured = useMemo(() => isSupabaseConfigured(), []);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();

    if (!configured) {
      setErrorMessage("Supabase environment variables are missing in the web project.");
      return;
    }

    setSubmitting(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      const supabase = getSupabaseBrowserClient();
      const normalizedEmail = email.trim().toLowerCase();
      const { error } = await supabase.auth.signUp({
        email: normalizedEmail,
        password,
        options: {
          data: {
            full_name: fullName.trim(),
            role: "coach",
            app_locale_code: "en",
            locale_code: "en",
          },
        },
      });

      if (error) throw error;

      applyCoachLocale("en");
      setSuccessMessage("Account created. If Supabase requires email confirmation, confirm your email before signing in.");
      window.setTimeout(() => {
        router.push("/login");
      }, 900);
    } catch (error) {
      setErrorMessage(describeSignupError(error));
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
            href="/login"
            className="inline-flex items-center gap-2 rounded-full bg-[var(--accent)] px-4 py-2 text-sm font-semibold text-[var(--accent-foreground)]"
          >
            I already have an account
            <ArrowRight size={16} />
          </Link>
        </div>

        <div className="grid flex-1 items-center gap-10 py-10 lg:grid-cols-[0.95fr_1.05fr]">
          <section className="max-w-xl">
            <div className="inline-flex rounded-full border border-[var(--accent)]/20 bg-[linear-gradient(135deg,var(--accent-soft),rgba(124,77,255,0.08))] px-4 py-2 text-sm font-medium text-[var(--accent-strong)]">
              Create your coach account
            </div>

            <h1 className="mt-8 text-5xl font-semibold leading-[1.02] text-[var(--text)] sm:text-6xl">
              Create your account for APEX COACH.
            </h1>

            <p className="mt-6 text-lg leading-8 text-[var(--text-muted)]">
              This is the single front door for the coach: same account, same logic,
              mobile app in the field and premium browser on desktop.
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
                  <p className="text-sm uppercase tracking-[0.22em] text-[var(--text-muted)]">Coach signup</p>
                  <h2 className="mt-3 text-3xl font-semibold text-[var(--text)]">Create account</h2>
                </div>
                <div className="rounded-2xl border border-[var(--accent)]/20 bg-[linear-gradient(135deg,var(--accent-soft),rgba(124,77,255,0.1))] p-3 text-[var(--electric)]">
                  <UserPlus size={22} />
                </div>
              </div>

              {!configured && (
                <div className="mb-5 flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-4 text-amber-700">
                  <AlertCircle size={18} className="mt-0.5 shrink-0" />
                  <p className="text-sm leading-7">`NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` still need to be configured.</p>
                </div>
              )}

              {errorMessage && (
                <div className="mb-5 flex items-start gap-3 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-4 text-rose-700">
                  <AlertCircle size={18} className="mt-0.5 shrink-0" />
                  <p className="text-sm leading-7">{errorMessage}</p>
                </div>
              )}

              {successMessage && (
                <div className="mb-5 flex items-start gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-4 text-emerald-700">
                  <CheckCircle2 size={18} className="mt-0.5 shrink-0" />
                  <p className="text-sm leading-7">{successMessage}</p>
                </div>
              )}

              <form className="grid gap-4" onSubmit={handleSubmit}>
                <label className="grid gap-2">
                  <span className="text-sm text-[var(--text-muted)]">Coach name</span>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(event) => setFullName(event.target.value)}
                    placeholder="Gabriel Coach"
                    className="rounded-2xl border border-[var(--border)] bg-[var(--surface-muted)] px-4 py-3.5 text-[var(--text)] outline-none transition placeholder:text-[var(--text-muted)] focus:border-[var(--accent)]/40 focus:bg-white"
                    autoComplete="name"
                    required
                  />
                </label>

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
                    placeholder="minimum 8 characters"
                    className="rounded-2xl border border-[var(--border)] bg-[var(--surface-muted)] px-4 py-3.5 text-[var(--text)] outline-none transition placeholder:text-[var(--text-muted)] focus:border-[var(--accent)]/40 focus:bg-white"
                    autoComplete="new-password"
                    required
                  />
                </label>

                <button
                  type="submit"
                  disabled={submitting || !configured}
                  className="mt-4 inline-flex items-center justify-center gap-2 rounded-2xl bg-[var(--accent)] px-5 py-4 font-semibold text-[var(--accent-foreground)] shadow-[0_18px_60px_rgba(42,208,125,0.22)] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {submitting ? (
                    <>
                      <LoaderCircle size={18} className="animate-spin" />
                      Creating account...
                    </>
                  ) : (
                    <>
                      Create account and continue
                      <ArrowRight size={18} />
                    </>
                  )}
                </button>
              </form>

              <div className="mt-8 grid gap-3 rounded-[24px] border border-[var(--border)] bg-[var(--surface-muted)] p-4">
                <div className="flex items-center gap-3">
                  <ShieldCheck size={18} className="text-[var(--accent-strong)]" />
                  <p className="font-medium text-[var(--text)]">Single coach identity</p>
                </div>
                <p className="text-sm leading-7 text-[var(--text-muted)]">
                  Create the account once and use the same identity for the field app and the premium browser workspace.
                </p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
