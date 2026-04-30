import CookieSettingsButton from "../../../src/components/CookieSettingsButton";
import LegalPageShell from "../../../src/components/LegalPageShell";
import { LEGAL_CONFIG } from "../../../src/lib/legal-config";

export const metadata = {
  title: "Política de Cookies | APEX COACH",
  description: "Informação sobre cookies e tecnologias semelhantes no website APEX COACH.",
};

export default function CookiesPage() {
  return (
    <LegalPageShell
      title="Política de Cookies"
      subtitle="Política de cookies orientada para operação na UE e em Portugal. Ajusta as categorias e os prazos à stack real usada em produção."
    >
      <section className="rounded-[22px] border border-[var(--border)] bg-[var(--surface-muted)] p-5">
        <h2 className="text-base font-semibold text-[var(--text)]">1. O que usamos</h2>
        <p className="mt-3">
          O site pode utilizar cookies e tecnologias semelhantes para autenticação, segurança, idioma, preferências do utilizador e analytics. Os cookies não essenciais só devem ser ativados após consentimento.
        </p>
      </section>

      <section className="rounded-[22px] border border-[var(--border)] bg-white p-5">
        <h2 className="text-base font-semibold text-[var(--text)]">2. Categorias</h2>
        <ul className="mt-3 list-disc space-y-2 pl-5">
          <li><strong>Essenciais:</strong> sessão, autenticação, idioma, segurança e persistência mínima do funcionamento do site.</li>
          <li><strong>Analytics:</strong> medição de navegação e desempenho, apenas se houver consentimento.</li>
        </ul>
      </section>

      <section className="rounded-[22px] border border-[var(--border)] bg-white p-5">
        <h2 className="text-base font-semibold text-[var(--text)]">3. Prazos indicativos</h2>
        <ul className="mt-3 list-disc space-y-2 pl-5">
          <li>Preferência de cookies: {LEGAL_CONFIG.cookieRetention.consent}</li>
          <li>Idioma/preferências funcionais: {LEGAL_CONFIG.cookieRetention.language}</li>
          <li>Analytics, se ativado: {LEGAL_CONFIG.cookieRetention.analytics}</li>
        </ul>
      </section>

      <section className="rounded-[22px] border border-[var(--border)] bg-white p-5">
        <h2 className="text-base font-semibold text-[var(--text)]">4. Gestão de preferências</h2>
        <p className="mt-3">
          Podes manter apenas cookies essenciais ou aceitar analytics. A preferência pode ser alterada a qualquer momento.
        </p>
        <div className="mt-4">
          <CookieSettingsButton className="rounded-2xl bg-[var(--accent)] px-4 py-2.5 text-sm font-semibold text-[var(--accent-foreground)]">
            Abrir preferências de cookies
          </CookieSettingsButton>
        </div>
      </section>
    </LegalPageShell>
  );
}
