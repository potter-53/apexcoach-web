import Link from "next/link";

import { LEGAL_CONFIG } from "../lib/legal-config";

export default function LegalPageShell({ title, subtitle, children }) {
  return (
    <main className="min-h-screen bg-[var(--bg)] text-[var(--text)]">
      <div className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,rgba(42,208,125,0.10),transparent_24%),radial-gradient(circle_at_bottom_right,rgba(124,77,255,0.08),transparent_20%),linear-gradient(180deg,#fbfbfb_0%,#f5f5f5_48%,#f2f4f3_100%)]" />
      <div className="mx-auto max-w-5xl px-5 py-10 lg:px-8">
        <div className="rounded-[28px] border border-[var(--border-strong)] bg-white p-6 shadow-[var(--shadow-panel)] sm:p-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-[11px] uppercase tracking-[0.16em] text-[var(--accent)]">{LEGAL_CONFIG.brandName}</p>
              <h1 className="mt-2 text-3xl font-semibold tracking-tight text-[var(--text)] sm:text-4xl">{title}</h1>
              {subtitle ? <p className="mt-3 max-w-3xl text-sm leading-7 text-[var(--text-muted)]">{subtitle}</p> : null}
            </div>
            <Link href="/" className="rounded-2xl border border-[var(--border)] bg-[var(--surface-muted)] px-4 py-2 text-sm font-medium text-[var(--text)]">
              Voltar ao site
            </Link>
          </div>

          <div className="mt-8 grid gap-5 text-sm leading-7 text-[var(--text-muted)]">{children}</div>
        </div>
      </div>
    </main>
  );
}
