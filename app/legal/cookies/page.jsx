import CookieSettingsButton from "../../../src/components/CookieSettingsButton";
import LegalPageShell from "../../../src/components/LegalPageShell";
import { LEGAL_CONFIG } from "../../../src/lib/legal-config";

export const metadata = {
  title: "Política de Cookies | NLOCK",
  description: "Informação sobre cookies e tecnologias semelhantes no website e plataforma NLOCK.",
};

export default function CookiesPage() {
  return (
    <LegalPageShell
      title="Política de Cookies"
      subtitle="Informação sobre cookies, armazenamento local e tecnologias necessárias ao funcionamento da NLOCK."
    >
      <section className="rounded-[22px] border border-[var(--border)] bg-[var(--surface-muted)] p-5">
        <h2 className="text-base font-semibold text-[var(--text)]">1. O que usamos</h2>
        <p className="mt-3">
          A NLOCK utiliza cookies e armazenamento local do browser para autenticação, segurança, idioma, tema, preferências e memória de interações iniciadas pelo utilizador. Neste momento não está ativo qualquer fornecedor externo de analytics ou publicidade no website.
        </p>
      </section>

      <section className="rounded-[22px] border border-[var(--border)] bg-white p-5">
        <h2 className="text-base font-semibold text-[var(--text)]">2. Categorias</h2>
        <ul className="mt-3 list-disc space-y-2 pl-5">
          <li><strong>Autenticação e segurança:</strong> dados locais de sessão necessários para entrar e permanecer autenticado através do Supabase.</li>
          <li><strong>Preferências:</strong> idioma, tema visual, opção de manter a sessão iniciada e escolha relativa a cookies.</li>
          <li><strong>Interações públicas:</strong> o cookie <code>nlock_founder_poll_v1</code> evita respostas repetidas à pergunta do Programa de Fundadores e apresenta o resultado já registado.</li>
        </ul>
      </section>

      <section className="rounded-[22px] border border-[var(--border)] bg-white p-5">
        <h2 className="text-base font-semibold text-[var(--text)]">3. Prazos indicativos</h2>
        <ul className="mt-3 list-disc space-y-2 pl-5">
          <li>Preferência de cookies: {LEGAL_CONFIG.cookieRetention.consent}</li>
          <li>Idioma/preferências funcionais: {LEGAL_CONFIG.cookieRetention.language}</li>
          <li>Memória de participação em perguntas públicas: {LEGAL_CONFIG.cookieRetention.publicPoll}</li>
          <li>Sessão e autenticação: {LEGAL_CONFIG.cookieRetention.session}</li>
        </ul>
      </section>

      <section className="rounded-[22px] border border-[var(--border)] bg-white p-5">
        <h2 className="text-base font-semibold text-[var(--text)]">4. Gestão de preferências</h2>
        <p className="mt-3">
          Podes rever a informação guardada e voltar a abrir este aviso a qualquer momento. Também podes apagar cookies e armazenamento local nas definições do browser; ao fazê-lo, poderás terminar a sessão ou perder preferências guardadas.
        </p>
        <div className="mt-4">
          <CookieSettingsButton className="rounded-2xl bg-[var(--accent)] px-4 py-2.5 text-sm font-semibold text-[var(--accent-foreground)]">
            Reabrir aviso de cookies
          </CookieSettingsButton>
        </div>
      </section>
    </LegalPageShell>
  );
}
