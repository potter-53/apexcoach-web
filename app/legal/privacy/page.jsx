import LegalPageShell from "../../../src/components/LegalPageShell";
import { LEGAL_CONFIG } from "../../../src/lib/legal-config";

export const metadata = {
  title: "Política de Privacidade | NLOCK",
  description: "Informação sobre o tratamento de dados pessoais no website e na plataforma NLOCK.",
};

export default function PrivacyPage() {
  return (
    <LegalPageShell
      title="Política de Privacidade"
      subtitle="Explica como a VERTEX LABS trata os dados pessoais recolhidos através do website e da plataforma NLOCK."
    >
      <section className="rounded-[22px] border border-[var(--border)] bg-[var(--surface-muted)] p-5">
        <h2 className="text-base font-semibold text-[var(--text)]">1. Responsável pelo tratamento</h2>
        <p className="mt-3">
          O responsável pelo tratamento é <strong>{LEGAL_CONFIG.controllerName}</strong>, NIPC {LEGAL_CONFIG.controllerVat}, com sede em {LEGAL_CONFIG.controllerAddress}. Para questões de privacidade, contacta-nos através de{" "}
          <a href={`mailto:${LEGAL_CONFIG.privacyEmail}`} className="text-[var(--accent-strong)] underline">
            {LEGAL_CONFIG.privacyEmail}
          </a>
          . Não foi designado um encarregado de proteção de dados.
        </p>
      </section>

      <section className="rounded-[22px] border border-[var(--border)] bg-white p-5">
        <h2 className="text-base font-semibold text-[var(--text)]">2. Dados tratados</h2>
        <ul className="mt-3 list-disc space-y-2 pl-5">
          <li>Dados de conta e autenticação do coach.</li>
          <li>Dados operacionais de clientes inseridos pelo coach, incluindo treino, avaliações, agenda, progresso e informação de saúde ou condição física quando registada.</li>
          <li>Dados de subscrição, faturação e pagamentos. A NLOCK não armazena os dados completos do cartão.</li>
          <li>Dados técnicos de sessão, dispositivo, idioma, preferências e segurança.</li>
          <li>Dados enviados em formulários, pedidos de contacto, candidaturas e respostas a perguntas públicas.</li>
        </ul>
      </section>

      <section className="rounded-[22px] border border-[var(--border)] bg-white p-5">
        <h2 className="text-base font-semibold text-[var(--text)]">3. Finalidades e bases legais</h2>
        <div className="mt-3 grid gap-3">
          <p><strong>Execução do contrato:</strong> criar e gerir contas, permitir autenticação, agenda, treinos, avaliações e faturação.</p>
          <p><strong>Interesse legítimo:</strong> segurança, prevenção de fraude, auditoria técnica e melhoria operacional básica.</p>
          <p><strong>Consentimento:</strong> publicação de perfis, comunicações opcionais e outros tratamentos para os quais seja solicitado consentimento específico.</p>
          <p><strong>Obrigação legal:</strong> resposta a pedidos de autoridades, faturação e conservação legalmente exigida.</p>
        </div>
      </section>

      <section className="rounded-[22px] border border-[var(--border)] bg-white p-5">
        <h2 className="text-base font-semibold text-[var(--text)]">4. Titulares dos dados</h2>
        <p className="mt-3">
          O coach é responsável por garantir que tem fundamento jurídico adequado para introduzir e gerir dados de clientes na plataforma, incluindo uma condição válida para tratar dados de saúde ou outros dados sensíveis. Quando tratamos dados dos clientes por instrução do coach, a VERTEX LABS atua, em regra, como subcontratante nos termos do artigo 28.º do RGPD.
        </p>
      </section>

      <section id="mural-fundadores" className="rounded-[22px] border border-[var(--border)] bg-white p-5">
        <h2 className="text-base font-semibold text-[var(--text)]">5. Mural de Fundadores</h2>
        <p className="mt-3">
          O perfil de um Coach Fundador só é publicado após consentimento específico. O coach escolhe os dados públicos, como nome, fotografia, localização, bio, especialidade e ligação profissional. O consentimento pode ser retirado através de {LEGAL_CONFIG.privacyEmail}, sem afetar a licitude da publicação anterior ao pedido.
        </p>
      </section>

      <section className="rounded-[22px] border border-[var(--border)] bg-white p-5">
        <h2 className="text-base font-semibold text-[var(--text)]">6. Conservação</h2>
        <ul className="mt-3 list-disc space-y-2 pl-5">
          <li><strong>Conta e dados operacionais:</strong> enquanto a conta estiver ativa e, após encerramento, {LEGAL_CONFIG.dataRetention.accountDeletion}.</li>
          <li><strong>Cópias de segurança:</strong> {LEGAL_CONFIG.dataRetention.backups} após a eliminação dos dados nos sistemas ativos.</li>
          <li><strong>Faturação e documentos fiscais:</strong> {LEGAL_CONFIG.dataRetention.billing}.</li>
          <li><strong>Leads e pedidos de contacto:</strong> {LEGAL_CONFIG.dataRetention.leads}.</li>
          <li><strong>Candidaturas ou registos não concluídos:</strong> {LEGAL_CONFIG.dataRetention.incompleteApplications}.</li>
          <li><strong>Registos de consentimento:</strong> {LEGAL_CONFIG.dataRetention.consentRecords}.</li>
          <li><strong>Dados anonimizados:</strong> podem ser conservados sem prazo quando já não permitam identificar uma pessoa.</li>
        </ul>
        <p className="mt-3">{LEGAL_CONFIG.retentionNote}</p>
      </section>

      <section className="rounded-[22px] border border-[var(--border)] bg-white p-5">
        <h2 className="text-base font-semibold text-[var(--text)]">7. Partilha e subcontratantes</h2>
        <p className="mt-3">
          Utilizamos fornecedores estritamente necessários à prestação do serviço: <strong>Supabase</strong> para autenticação, base de dados e armazenamento; <strong>Vercel</strong> para alojamento e entrega do website; <strong>Stripe</strong> para pagamentos e gestão de subscrições; e <strong>Resend</strong> para envio de mensagens transacionais. Estes fornecedores tratam dados segundo as nossas instruções e os respetivos contratos e políticas de privacidade.
        </p>
      </section>

      <section className="rounded-[22px] border border-[var(--border)] bg-white p-5">
        <h2 className="text-base font-semibold text-[var(--text)]">8. Transferências internacionais</h2>
        <p className="mt-3">
          Alguns fornecedores podem tratar dados fora do Espaço Económico Europeu. Quando aplicável, recorremos a mecanismos reconhecidos pelo RGPD, designadamente decisões de adequação e cláusulas contratuais-tipo, juntamente com medidas adicionais adequadas.
        </p>
      </section>

      <section className="rounded-[22px] border border-[var(--border)] bg-white p-5">
        <h2 className="text-base font-semibold text-[var(--text)]">9. Direitos dos titulares</h2>
        <p className="mt-3">
          Os titulares podem pedir acesso, retificação, apagamento, limitação, oposição e portabilidade, nos termos legais aplicáveis. Pedidos podem ser enviados para{" "}
          <a href={`mailto:${LEGAL_CONFIG.privacyEmail}`} className="text-[var(--accent-strong)] underline">
            {LEGAL_CONFIG.privacyEmail}
          </a>
          .
        </p>
      </section>

      <section className="rounded-[22px] border border-[var(--border)] bg-white p-5">
        <h2 className="text-base font-semibold text-[var(--text)]">10. Reclamações</h2>
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
