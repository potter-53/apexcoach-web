import LegalPageShell from "../../../src/components/LegalPageShell";
import { LEGAL_CONFIG } from "../../../src/lib/legal-config";

export const metadata = {
  title: "Termos e Condições | NLOCK",
  description: "Termos de utilização da plataforma NLOCK.",
};

export default function TermsPage() {
  return (
    <LegalPageShell
      title="Termos e Condições"
      subtitle="Condições aplicáveis ao acesso e utilização do website e da plataforma NLOCK."
    >
      <section className="rounded-[22px] border border-[var(--border)] bg-[var(--surface-muted)] p-5">
        <h2 className="text-base font-semibold text-[var(--text)]">1. Objeto</h2>
        <p className="mt-3">
          A {LEGAL_CONFIG.brandName}, disponibilizada por <strong>{LEGAL_CONFIG.companyName}</strong>, oferece uma plataforma digital de apoio à gestão de clientes, agenda, treinos, avaliações e operação de coaches.
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
          O plano, preço, periodicidade e condições de renovação são apresentados antes da contratação. Os pagamentos são processados pela Stripe. As subscrições pagas renovam-se segundo a periodicidade escolhida, salvo cancelamento antes da data de renovação.
        </p>
        <p className="mt-3">
          A subscrição pode ser cancelada a qualquer momento. Após o cancelamento, o acesso mantém-se até ao final do período já pago e não são efetuadas novas renovações. O cancelamento não dá origem a reembolso proporcional do período em curso, sem prejuízo dos casos em que o reembolso seja legalmente obrigatório.
        </p>
      </section>

      <section className="rounded-[22px] border border-[var(--border)] bg-white p-5">
        <h2 className="text-base font-semibold text-[var(--text)]">5. Período experimental</h2>
        <p className="mt-3">
          O trial disponibilizado pela NLOCK tem a duração anunciada de 30 dias. No final do período experimental não é iniciada qualquer cobrança automática. Para continuar num plano pago, o utilizador terá de escolher expressamente o plano e concluir o respetivo pagamento.
        </p>
      </section>

      <section className="rounded-[22px] border border-[var(--border)] bg-white p-5">
        <h2 className="text-base font-semibold text-[var(--text)]">6. Propriedade intelectual</h2>
        <p className="mt-3">
          O software, design, conteúdos, documentação, nome e identidade da plataforma pertencem à {LEGAL_CONFIG.companyName} ou aos seus licenciantes e encontram-se protegidos por direitos de propriedade intelectual, salvo indicação expressa em contrário.
        </p>
      </section>

      <section className="rounded-[22px] border border-[var(--border)] bg-white p-5">
        <h2 className="text-base font-semibold text-[var(--text)]">7. Contactos</h2>
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
