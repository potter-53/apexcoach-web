import LegalPageShell from "../../../src/components/LegalPageShell";
import { LEGAL_CONFIG } from "../../../src/lib/legal-config";

export const metadata = {
  title: "Informação ao Consumidor | APEX COACH",
  description: "Informação de consumo, reclamações e resolução alternativa de litígios para Portugal e UE.",
};

export default function ConsumerPage() {
  return (
    <LegalPageShell
      title="Informação ao Consumidor"
      subtitle="Página preparada para requisitos de informação ao consumidor em Portugal quando exista contratação online de serviços."
    >
      <section className="rounded-[22px] border border-[var(--border)] bg-[var(--surface-muted)] p-5">
        <h2 className="text-base font-semibold text-[var(--text)]">1. Identificação do operador</h2>
        <p className="mt-3">
          {LEGAL_CONFIG.controllerName} · {LEGAL_CONFIG.controllerAddress} · {LEGAL_CONFIG.controllerVat}
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
          Em caso de litígio de consumo, o consumidor pode consultar a lista oficial de entidades RAL em Portugal através de{" "}
          <a href={LEGAL_CONFIG.adrListUrl} className="text-[var(--accent-strong)] underline">
            {LEGAL_CONFIG.adrListUrl}
          </a>
          .
        </p>
        <p className="mt-3">
          Para litígios online na UE, pode ainda consultar a plataforma europeia de resolução de litígios em linha em{" "}
          <a href={LEGAL_CONFIG.onlineDisputeUrl} className="text-[var(--accent-strong)] underline">
            {LEGAL_CONFIG.onlineDisputeUrl}
          </a>
          .
        </p>
      </section>

      <section className="rounded-[22px] border border-[var(--border)] bg-white p-5">
        <h2 className="text-base font-semibold text-[var(--text)]">4. Contratação à distância</h2>
        <p className="mt-3">
          Se houver subscrição ou compra online por consumidores, a informação pré-contratual deve incluir, entre outros pontos, identidade do fornecedor, preço, pagamento, duração, renovação, cancelamento e, quando aplicável, direito de livre resolução.
        </p>
      </section>
    </LegalPageShell>
  );
}
