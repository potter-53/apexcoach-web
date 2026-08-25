import LegalPageShell from "../../../src/components/LegalPageShell";
import { LEGAL_CONFIG } from "../../../src/lib/legal-config";

export const metadata = {
  title: "Informação ao Consumidor | NLOCK",
  description: "Informação de consumo, reclamações e resolução alternativa de litígios para Portugal e UE.",
};

export default function ConsumerPage() {
  return (
    <LegalPageShell
      title="Informação ao Consumidor"
      subtitle="Informação sobre o operador, apoio, reclamações e resolução alternativa de litígios em Portugal."
    >
      <section className="rounded-[22px] border border-[var(--border)] bg-[var(--surface-muted)] p-5">
        <h2 className="text-base font-semibold text-[var(--text)]">1. Identificação do operador</h2>
        <p className="mt-3">
          <strong>{LEGAL_CONFIG.controllerName}</strong> · NIPC {LEGAL_CONFIG.controllerVat} · {LEGAL_CONFIG.controllerAddress}
        </p>
      </section>

      <section className="rounded-[22px] border border-[var(--border)] bg-white p-5">
        <h2 className="text-base font-semibold text-[var(--text)]">2. Apoio e reclamações</h2>
        <p className="mt-3">
          Pedidos de suporte e reclamações podem ser enviados para{" "}
          <a href={`mailto:${LEGAL_CONFIG.supportEmail}`} className="text-[var(--accent-strong)] underline">
            {LEGAL_CONFIG.supportEmail}
          </a>
          .
        </p>
        <p className="mt-3">
          Livro de Reclamações eletrónico:{" "}
          <a href={LEGAL_CONFIG.complaintsBookUrl} className="text-[var(--accent-strong)] underline">
            {LEGAL_CONFIG.complaintsBookUrl}
          </a>
          .
        </p>
      </section>

      <section className="rounded-[22px] border border-[var(--border)] bg-white p-5">
        <h2 className="text-base font-semibold text-[var(--text)]">3. Resolução alternativa de litígios</h2>
        <p className="mt-3">
          Em caso de litígio de consumo relacionado com uma contratação abrangida pela competência territorial de Santarém, o consumidor pode recorrer ao{" "}
          <a href={LEGAL_CONFIG.adrUrl} className="text-[var(--accent-strong)] underline">
            {LEGAL_CONFIG.adrName}
          </a>
          . Contactos: {LEGAL_CONFIG.adrEmail} · {LEGAL_CONFIG.adrPhone}.
        </p>
        <p className="mt-3">
          A entidade competente pode variar em função do local da contratação ou do domicílio do consumidor. A lista oficial atualizada das entidades RAL está disponível na{" "}
          <a href={LEGAL_CONFIG.adrListUrl} className="text-[var(--accent-strong)] underline">
            Direção-Geral do Consumidor
          </a>.
        </p>
      </section>

      <section className="rounded-[22px] border border-[var(--border)] bg-white p-5">
        <h2 className="text-base font-semibold text-[var(--text)]">4. Contratação à distância</h2>
        <p className="mt-3">
          Antes da subscrição são apresentados o plano escolhido, preço, periodicidade e condições essenciais de pagamento. O trial de 30 dias termina sem cobrança automática. Uma subscrição paga pode ser cancelada a qualquer momento, mantendo-se o acesso até ao final do período já pago. Não são realizados reembolsos, exceto quando legalmente obrigatórios. Para esclarecimentos sobre renovação, cancelamento ou direitos do consumidor, contacta {LEGAL_CONFIG.supportEmail}.
        </p>
      </section>
    </LegalPageShell>
  );
}
