import Stripe from "stripe";
import { CheckCircle2, Download, MailCheck, ShieldCheck, Smartphone } from "lucide-react";
import SignupCompletionClient from "./SignupCompletionClient";

export const metadata = {
  title: "Conta criada | NLOCK",
  description: "A tua conta NLOCK foi criada com sucesso.",
};

export const dynamic = "force-dynamic";

async function getCheckoutState(sessionId) {
  if (!process.env.STRIPE_SECRET_KEY || !sessionId?.startsWith("cs_")) return null;
  try {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    return {
      complete: session.status === "complete" && session.payment_status === "paid",
      founder: session.metadata?.access_tier === "founder",
      email: String(session.customer_details?.email || session.customer_email || "").toLowerCase(),
      metadata: session.metadata || {},
    };
  } catch {
    return null;
  }
}

export default async function SignupSuccessPage({ searchParams }) {
  const params = await searchParams;
  const checkout = await getCheckoutState(String(params?.session_id || ""));
  const confirmed = checkout?.complete === true;
  const emailVerified = params?.email_verified === "1";

  return (
    <main className="relative min-h-screen overflow-hidden bg-[var(--page-gradient)] px-4 py-6 text-[var(--text)] sm:px-6 sm:py-10">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_12%_5%,rgba(8,185,197,0.14),transparent_28%),radial-gradient(circle_at_92%_90%,rgba(185,237,40,0.12),transparent_28%)]" />
      <div className="relative mx-auto flex min-h-[calc(100vh-3rem)] max-w-3xl items-center justify-center">
        <section className="w-full overflow-hidden rounded-[30px] border border-[var(--border)] bg-[var(--surface)] shadow-[var(--shadow-panel)] backdrop-blur-xl sm:rounded-[38px]">
          <div className="border-b border-white/10 bg-[#071019] px-6 py-8 text-white sm:px-10 sm:py-10">
            <div className="flex h-14 w-14 items-center justify-center rounded-full [background:var(--brand-gradient)] text-[#03130e] shadow-[var(--shadow-accent)]">
              <CheckCircle2 size={30} strokeWidth={2.4} />
            </div>
            <p className="mt-6 text-xs font-semibold uppercase tracking-[0.22em] text-[#53e4cb]">NLOCK</p>
            <h1 className="mt-3 max-w-2xl text-4xl font-semibold leading-[0.98] tracking-[-0.045em] sm:text-5xl">
              {confirmed ? "Registo concluído com sucesso." : "Estamos a confirmar o teu registo."}
            </h1>
            <p className="mt-5 max-w-xl text-base leading-7 text-white/65 sm:text-lg">
              {confirmed
                ? `${checkout.founder ? "A tua subscrição Coach Fundador está registada." : "A tua subscrição NLOCK está registada."} Faltam apenas dois passos para entrares na app.`
                : "O pagamento foi recebido e está a ser confirmado. Podes já avançar com os próximos passos."}
            </p>
          </div>

          <div className="grid gap-4 p-5 sm:p-8">
            {confirmed && checkout.email ? (
              <SignupCompletionClient
                sessionId={String(params?.session_id || "")}
                email={checkout.email}
                checkoutMetadata={checkout.metadata}
                emailVerified={emailVerified}
              />
            ) : null}
            <div className="grid gap-4 sm:grid-cols-2">
              <article className={`rounded-[22px] border p-5 ${emailVerified ? "border-[var(--accent-strong)] bg-[var(--accent-soft)]" : "border-[var(--border)] bg-[var(--surface-solid)]"}`}>
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--accent-soft)] text-[var(--accent-strong)]"><MailCheck size={20} /></span>
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--accent-strong)]">Passo 1</p>
                </div>
                <h2 className="mt-5 text-xl font-semibold tracking-[-0.025em]">{emailVerified ? "Email validado" : "Valida o teu email"}</h2>
                <p className="mt-2 text-sm leading-6 text-[var(--text-muted)]">
                  {emailVerified
                    ? "Confirmação concluída. Já podes entrar na app NLOCK."
                    : "Enviámos uma mensagem para o email usado no registo. Abre-a e confirma a tua conta NLOCK."}
                </p>
              </article>

              <article className="rounded-[22px] border border-[var(--border)] bg-[var(--surface-solid)] p-5">
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--accent-soft)] text-[var(--accent-strong)]"><Smartphone size={20} /></span>
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--accent-strong)]">Passo 2</p>
                </div>
                <h2 className="mt-5 text-xl font-semibold tracking-[-0.025em]">Instala a app</h2>
                <p className="mt-2 text-sm leading-6 text-[var(--text-muted)]">Faz download da app NLOCK e usa o mesmo email e palavra-passe para iniciares sessão.</p>
              </article>
            </div>

            <a href="/download/apk" className="inline-flex min-h-[56px] items-center justify-center gap-2 rounded-2xl [background:var(--brand-gradient)] px-5 py-4 font-semibold text-[#03130e] shadow-[var(--shadow-accent)] transition hover:-translate-y-0.5">
              <Download size={19} /> Download da app NLOCK
            </a>
            <div className="flex items-start gap-3 rounded-2xl bg-[var(--surface-muted)] px-4 py-3 text-sm leading-6 text-[var(--text-muted)]">
              <ShieldCheck size={18} className="mt-0.5 shrink-0 text-[var(--accent-strong)]" />
              <p>O pagamento e a subscrição são geridos com segurança pela Stripe.</p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
