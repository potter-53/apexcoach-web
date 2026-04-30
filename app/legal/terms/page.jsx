import LegalPageShell from "../../../src/components/LegalPageShell";
import { LEGAL_CONFIG } from "../../../src/lib/legal-config";

export const metadata = {
  title: "Termos e Condições | APEX COACH",
  description: "Termos de utilização da plataforma APEX COACH.",
};

export default function TermsPage() {
  return (
    <LegalPageShell
      title="Termos e Condições"
      subtitle="Estrutura base para coaches e utilização da plataforma. Deve ser revista com as regras comerciais, subscrições, cancelamento e responsabilidades clínicas efetivamente adotadas."
    >
      <section className="rounded-[22px] border border-[var(--border)] bg-[var(--surface-muted)] p-5">
        <h2 className="text-base font-semibold text-[var(--text)]">1. Objeto</h2>
        <p className="mt-3">
          A {LEGAL_CONFIG.brandName} disponibiliza uma plataforma digital para apoio à gestão de clientes, agenda, treinos, avaliações e operação de coaches.
        </p>
      </section>

      <section className="rounded-[22px] border border-[var(--border)] bg-white p-5">
        <h2 className="text-base font-semibold text-[var(--text)]">2. Conta e acesso</h2>
        <p className="mt-3">
          O coach é responsável pela veracidade dos dados fornecidos, pela segurança das credenciais e pela utilização lícita da conta. O acesso pode ser suspenso em caso de uso indevido, risco de segurança ou incumprimento contratual.
        </p>
      </section>

      <section className="rounded-[22px] border border-[var(--border)] bg-white p-5">
        <h2 className="text-base font-semibold text-[var(--text)]">3. Responsabilidade do coach</h2>
        <p className="mt-3">
          O coach é responsável pelo conteúdo que introduz, pela legitimidade dos dados dos seus clientes e por garantir que qualquer decisão profissional, técnica ou clínica é tomada com autonomia e segundo as regras aplicáveis à sua atividade.
        </p>
      </section>

      <section className="rounded-[22px] border border-[var(--border)] bg-white p-5">
        <h2 className="text-base font-semibold text-[var(--text)]">4. Planos, pagamentos e cancelamento</h2>
        <p className="mt-3">
          As condições comerciais, preço, renovação, período experimental, faturação, cancelamento e reembolso devem ser apresentadas de forma clara antes da contratação. Se existir contratação à distância com consumidores, confirma também o regime do direito de livre resolução e respetivas exceções.
        </p>
      </section>

      <section className="rounded-[22px] border border-[var(--border)] bg-white p-5">
        <h2 className="text-base font-semibold text-[var(--text)]">5. Propriedade intelectual</h2>
        <p className="mt-3">
          O software, design, base documental, nome e identidade da plataforma permanecem protegidos por direitos de propriedade intelectual, salvo quando expressamente indicado em contrário.
        </p>
      </section>

      <section className="rounded-[22px] border border-[var(--border)] bg-white p-5">
        <h2 className="text-base font-semibold text-[var(--text)]">6. Contactos</h2>
        <p className="mt-3">
          Para assuntos legais ou contratuais:{" "}
          <a href={`mailto:${LEGAL_CONFIG.legalEmail}`} className="text-[var(--accent-strong)] underline">
            {LEGAL_CONFIG.legalEmail}
          </a>
          .
        </p>
      </section>
    </LegalPageShell>
  );
}
