export default function NlockLogo({ compact = false }) {
  return (
    <div className="flex items-center gap-3" aria-label="NLOCK">
      <span className="grid h-10 w-10 shrink-0 place-items-center rounded-[13px] bg-[image:var(--brand-gradient)] text-sm font-black text-[#03130e] shadow-[var(--shadow-accent)]">
        N
      </span>
      {!compact ? (
        <div className="leading-none">
          <p className="text-sm font-bold tracking-[0.28em] text-[var(--text)]">NLOCK</p>
          <p className="mt-1.5 text-[8px] font-semibold uppercase tracking-[0.2em] text-[var(--text-subtle)]">Coach workspace</p>
        </div>
      ) : null}
    </div>
  );
}
