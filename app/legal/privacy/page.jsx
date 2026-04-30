import LegalPageShell from "../../../src/components/LegalPageShell";
import { LEGAL_CONFIG } from "../../../src/lib/legal-config";

export const metadata = {
  title: "Política de Privacidade | APEX COACH",
  description: "Informação sobre tratamento de dados pessoais no website e plataforma APEX COACH.",
};

export default function PrivacyPage() {
  return (
    <LegalPageShell
      title="Política de Privacidade"
      subtitle="Base de privacidade orientada para RGPD / UE e para operação em Portugal. Antes de colocar em produção, confirma os dados da entidade, contactos e prazos reais de retenção."
    >
      <section className="rounded-[22px] border border-[var(--border)] bg-[var(--surface-muted)] p-5">
        <h2 className="text-base font-semibold text-[var(--text)]">1. Responsável pelo tratamento</h2>
        <p className="mt-3">
          O responsável pelo tratamento é <strong>{LEGAL_CONFIG.controllerName}</strong>, com contacto em{" "}
          <a href={`mailto:${LEGAL_CONFIG.privacyEmail}`} className="text-[var(--accent-strong)] underline">
            {LEGAL_CONFIG.privacyEmail}
          </a>
          . Morada: {LEGAL_CONFIG.controllerAddress}. Identificação fiscal: {LEGAL_CONFIG.controllerVat}.
        </p>
      </section>

      <section className="rounded-[22px] border border-[var(--border)] bg-white p-5">
        <h2 className="text-base font-semibold text-[var(--text)]">2. Dados tratados</h2>
        <ul className="mt-3 list-disc space-y-2 pl-5">
          <li>Dados de conta e autenticação do coach.</li>
          <li>Dados operacionais de clientes inseridos pelo coach na plataforma.</li>
          <li>Dados de faturação e histórico de utilização, quando aplicável.</li>
          <li>Dados técnicos do browser, sessão, idioma e segurança.</li>
          <li>Dados de analytics apenas quando o utilizador der consentimento.</li>
        </ul>
      </section>

      <section className="rounded-[22px] border border-[var(--border)] bg-white p-5">
        <h2 className="text-base font-semibold text-[var(--text)]">3. Finalidades e bases legais</h2>
        <div className="mt-3 grid gap-3">
          <p><strong>Execução do contrato:</strong> criar e gerir contas, permitir autenticação, agenda, treinos, avaliações e faturação.</p>
          <p><strong>Interesse legítimo:</strong> segurança, prevenção de fraude, auditoria técnica e melhoria operacional básica.</p>
          <p><strong>Consentimento:</strong> analytics, cookies não essenciais e eventuais comunicações opcionais.</p>
          <p><strong>Obrigação legal:</strong> resposta a pedidos de autoridades, faturação e conservação legalmente exigida.</p>
        </div>
      </section>

      <section className="rounded-[22px] border border-[var(--border)] bg-white p-5">
        <h2 className="text-base font-semibold text-[var(--text)]">4. Titulares dos dados</h2>
        <p className="mt-3">
          O coach é responsável por garantir que tem fundamento jurídico adequado para introduzir e gerir dados de clientes na plataforma. Quando atuamos sobre dados dos clientes do coach, poderemos atuar como subcontratante/processador relativamente a esse tratamento.
        </p>
      </section>

      <section className="rounded-[22px] border border-[var(--border)] bg-white p-5">
        <h2 className="text-base font-semibold text-[var(--text)]">5. Conservação</h2>
        <p className="mt-3">
          Os dados são conservados pelo tempo necessário às finalidades descritas, aos prazos contratuais e às obrigações legais aplicáveis. {LEGAL_CONFIG.retentionNote}
        </p>
      </section>

      <section className="rounded-[22px] border border-[var(--border)] bg-white p-5">
        <h2 className="text-base font-semibold text-[var(--text)]">6. Partilha e subcontratantes</h2>
        <p className="mt-3">
          Podemos recorrer a fornecedores de infraestrutura, autenticação, base de dados, alojamento, e-mail, analytics e suporte técnico. Devem existir acordos de tratamento de dados com os fornecedores que tratem dados pessoais por nossa conta.
        </p>
      </section>

      <section className="rounded-[22px] border border-[var(--border)] bg-white p-5">
        <h2 className="text-base font-semibold text-[var(--text)]">7. Transferências internacionais</h2>
        <p className="mt-3">
          Se existirem transferências para fora do Espaço Económico Europeu, estas devem assentar em mecanismo jurídico adequado, como decisão de adequação ou cláusulas contratuais-tipo, quando exigido.
        </p>
      </section>

      <section className="rounded-[22px] border border-[var(--border)] bg-white p-5">
        <h2 className="text-base font-semibold text-[var(--text)]">8. Direitos dos titulares</h2>
        <p className="mt-3">
          Os titulares podem pedir acesso, retificação, apagamento, limitação, oposição e portabilidade, nos termos legais aplicáveis. Pedidos podem ser enviados para{" "}
          <a href={`mailto:${LEGAL_CONFIG.privacyEmail}`} className="text-[var(--accent-strong)] underline">
            {LEGAL_CONFIG.privacyEmail}
          </a>
          .
        </p>
      </section>

      <section className="rounded-[22px] border border-[var(--border)] bg-white p-5">
        <h2 className="text-base font-semibold text-[var(--text)]">9. Reclamações</h2>
        <p className="mt-3">
          O titular pode também apresentar reclamação à autoridade de controlo competente em Portugal, a CNPD, através de{" "}
          <a href="https://www.cnpd.pt" className="text-[var(--accent-strong)] underline">
            cnpd.pt
          </a>
          .
        </p>
      </section>
    </LegalPageShell>
  );
}
