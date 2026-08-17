"use client";

import Link from "next/link";
import { ArrowRight, Award, Check, Crown, Gift, Lightbulb, Menu, MessageSquareText, ShieldCheck, Sparkles, TrendingUp, Users, X } from "lucide-react";
import { createElement, useEffect, useState } from "react";
import ThemeToggle from "../../src/components/ThemeToggle";

function Brand() {
  return <span className="inline-flex items-center gap-2.5" aria-label="NLOCK"><span aria-hidden="true" className="nlock-placeholder-mark h-8 w-8">N</span><span className="nlock-wordmark text-sm text-white sm:text-base">NLOCK</span></span>;
}

const advantages = [
  { icon: Crown, title: "Identidade histórica", text: "Badge exclusivo e um número único entre Fundador #1 e Fundador #50. O teu lugar na história da NLOCK nunca é reatribuído." },
  { icon: Gift, title: "Preço de Lançamento", text: "199,90 € por ano — equivalente a 16,66 € por mês — enquanto mantiveres a subscrição de Fundador elegível ativa." },
  { icon: Lightbulb, title: "Influência no produto", text: "Ajuda a validar ideias, fluxos e funcionalidades através de perguntas e tarefas estruturadas dentro da NLOCK." },
  { icon: Award, title: "Visibilidade que pode gerar leads", text: "O teu perfil no Mural permite que potenciais clientes conheçam o teu trabalho e entrem diretamente em contacto contigo." },
  { icon: Users, title: "Crescimento partilhado", text: "Por cada três referrals convertidos, recebes 30 dias de NLOCK, até ao máximo de seis meses por ano." },
  { icon: MessageSquareText, title: "Proximidade à equipa", text: "Prioridade em oportunidades de validação e uma ligação mais direta à evolução de uma ferramenta feita para coaches." },
];

const pollOptions = [
  { key: "faster_sessions", label: "Preparar sessões mais depressa" },
  { key: "clearer_progress", label: "Acompanhar a evolução dos clients com mais clareza" },
];

function FounderProgrammePoll() {
  const [poll, setPoll] = useState({ status: "loading", selected: null, percentages: {}, total: 0 });

  useEffect(() => {
    let active = true;
    fetch("/api/founder-program-poll", { cache: "no-store" })
      .then((response) => response.json().then((payload) => ({ response, payload })))
      .then(({ response, payload }) => {
        if (!active) return;
        if (!response.ok || !payload.ok) throw new Error("poll_unavailable");
        setPoll({ status: "ready", selected: payload.selected, percentages: payload.percentages || {}, total: payload.total || 0 });
      })
      .catch(() => { if (active) setPoll((current) => ({ ...current, status: "error" })); });
    return () => { active = false; };
  }, []);

  async function vote(option) {
    if (poll.selected || poll.status === "submitting") return;
    setPoll((current) => ({ ...current, status: "submitting" }));
    try {
      const response = await fetch("/api/founder-program-poll", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ option }) });
      const payload = await response.json().catch(() => ({}));
      if (!response.ok || !payload.ok) throw new Error("poll_vote_failed");
      setPoll({ status: "ready", selected: payload.selected, percentages: payload.percentages || {}, total: payload.total || 0 });
    } catch {
      setPoll((current) => ({ ...current, status: "error" }));
    }
  }

  return (
    <article className="nlock-founder-input rounded-[28px] border border-[var(--brand-mint)]/25 bg-[linear-gradient(145deg,rgba(57,185,138,0.12),rgba(12,19,29,1))] p-7 sm:p-10">
      <div className="flex flex-wrap items-center justify-between gap-3"><p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--brand-mint)]">Ajuda a moldar a NLOCK</p><span className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-white/45">Pergunta real</span></div>
      <h3 className="mt-7 text-2xl font-semibold leading-9">Qual destas melhorias teria mais impacto no teu dia de trabalho?</h3>
      <div className="mt-7 grid gap-3">
        {pollOptions.map((option) => {
          const selected = poll.selected === option.key;
          const percentage = Number(poll.percentages?.[option.key] || 0);
          return poll.selected ? (
            <div key={option.key} className={`relative overflow-hidden rounded-[17px] border px-4 py-4 ${selected ? "border-[var(--brand-mint)]/45" : "border-white/10"}`}>
              <span className="absolute inset-y-0 left-0 bg-[var(--brand-mint)]/12 transition-all duration-700" style={{ width: `${percentage}%` }} />
              <div className="relative flex items-center justify-between gap-4"><span className="flex items-center gap-2 text-sm font-medium">{selected ? <Check size={16} className="text-[var(--brand-mint)]" /> : null}{option.label}</span><strong className="text-lg text-[var(--brand-mint)]">{percentage}%</strong></div>
            </div>
          ) : (
            <button key={option.key} type="button" disabled={poll.status !== "ready"} onClick={() => vote(option.key)} className="rounded-[17px] border border-white/12 bg-white/5 px-4 py-4 text-left text-sm font-semibold transition hover:border-[var(--brand-mint)]/45 hover:bg-[var(--brand-mint)]/10 disabled:cursor-wait disabled:opacity-55">{option.label}</button>
          );
        })}
      </div>
      {poll.selected ? <p className="mt-5 text-xs leading-5 text-white/45">Obrigado pela resposta. Estás a ver o resultado de {poll.total} {poll.total === 1 ? "participação" : "participações"} nesta página.</p> : poll.status === "error" ? <p className="mt-5 text-xs text-white/45">A votação está temporariamente indisponível.</p> : <p className="mt-5 text-xs leading-5 text-white/40">Vota uma vez e vê imediatamente a opinião de quem já participou.</p>}
    </article>
  );
}

export default function AffiliateProgrammePage() {
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <div className="nlock-test nlock-founder-page min-h-screen bg-[#05090f] text-white">
      <header className="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-[#05090f]/80 backdrop-blur-xl">
        <div className="mx-auto flex h-[72px] max-w-[var(--content-max)] items-center justify-between px-[var(--page-gutter)]">
          <Link href="/"><Brand /></Link>
          <nav className="hidden items-center gap-8 text-sm text-white/60 lg:flex"><a href="#advantages" className="transition hover:text-white">Vantagens</a><a href="#influence" className="transition hover:text-white">Influência</a><a href="#conditions" className="transition hover:text-white">Condições</a></nav>
          <div className="flex items-center gap-2"><ThemeToggle language="pt" className="!border-white/10 !bg-white/5 !text-white" /><Link href="/signup?mode=subscription&founder=1" className="hidden min-h-11 items-center rounded-[var(--radius-md)] bg-[image:var(--brand-gradient)] px-5 text-sm font-semibold text-[#03130e] sm:inline-flex">Ativar plano anual</Link><button type="button" onClick={() => setMenuOpen((value) => !value)} className="flex h-11 w-11 items-center justify-center rounded-[var(--radius-md)] border border-white/10 lg:hidden" aria-label="Abrir navegação">{menuOpen ? <X size={18} /> : <Menu size={18} />}</button></div>
        </div>
        {menuOpen ? <nav className="grid gap-2 border-t border-white/10 bg-[#05090f] p-4 lg:hidden">{[["#advantages", "Vantagens"], ["#influence", "Influência"], ["#conditions", "Condições"]].map(([href, label]) => <a key={href} href={href} onClick={() => setMenuOpen(false)} className="rounded-xl px-4 py-3 text-white/70">{label}</a>)}<Link href="/signup?mode=subscription&founder=1" className="rounded-xl bg-[image:var(--brand-gradient)] px-4 py-3 text-center font-semibold text-[#03130e]">Ativar plano anual</Link></nav> : null}
      </header>

      <main>
        <section className="nlock-founder-hero relative overflow-hidden px-[var(--page-gutter)] pb-24 pt-40 sm:pb-32 sm:pt-48">
          <div className="absolute left-[12%] top-24 h-[460px] w-[460px] rounded-full bg-[var(--brand-mint)]/12 blur-[130px]" /><div className="absolute right-[8%] top-40 h-[400px] w-[400px] rounded-full bg-[var(--brand-sky)]/10 blur-[140px]" />
          <div className="relative mx-auto grid max-w-[var(--content-max)] gap-12 lg:grid-cols-[1fr_0.52fr] lg:items-center">
            <div><span className="inline-flex rounded-full bg-[var(--brand-mint)] px-4 py-2 text-xs font-bold tracking-[0.18em] text-[#03130e]">APENAS 50 COACHES FUNDADORES</span><h1 className="mt-8 max-w-5xl text-[clamp(3.4rem,7.5vw,7.2rem)] font-semibold leading-[0.88] tracking-[-0.065em]">DESBLOQUEIA O TEU<br /><span className="bg-[image:var(--brand-gradient)] bg-clip-text text-transparent">POTENCIAL COMPLETO.</span></h1><p className="mt-8 max-w-2xl text-lg leading-8 text-white/60 sm:text-xl">Os primeiros 50 coaches que ativarem o plano anual tornam-se Fundadores automaticamente — com identidade histórica, Preço de Lançamento e participação mais próxima na evolução da NLOCK.</p><div className="mt-10 flex flex-col gap-3 sm:flex-row"><Link href="/signup?mode=subscription&founder=1" className="inline-flex min-h-[54px] items-center justify-center gap-2 rounded-[var(--radius-md)] bg-[image:var(--brand-gradient)] px-7 font-semibold text-[#03130e] shadow-[var(--shadow-accent)]">Ativar plano anual <ArrowRight size={18} /></Link><a href="#advantages" className="inline-flex min-h-[54px] items-center justify-center rounded-[var(--radius-md)] border border-white/15 bg-white/5 px-7 font-semibold">Ver vantagens</a></div></div>
            <aside className="nlock-founder-badge rounded-[30px] border border-[var(--brand-mint)]/30 bg-[linear-gradient(145deg,rgba(57,185,138,0.16),rgba(12,19,29,0.94))] p-8 shadow-[var(--shadow-accent)] sm:p-10"><Crown size={32} className="text-[var(--brand-mint)]" /><p className="mt-12 text-xs font-semibold tracking-[0.22em] text-[var(--brand-mint)]">FUNDADOR</p><p className="mt-2 text-7xl font-semibold tracking-[-0.07em]">#17</p><div className="mt-9 border-t border-white/10 pt-6"><p className="text-sm text-white/45">Preço de Lançamento</p><p className="mt-2 text-3xl font-semibold">199,90 € <span className="text-base font-normal text-white/40">/ano</span></p><p className="mt-2 text-sm text-white/40">≈ 16,66 €/mês</p></div></aside>
          </div>
        </section>

        <section id="advantages" className="border-y border-white/10 bg-[#080d14] px-[var(--page-gutter)] py-[var(--section-space)]"><div className="mx-auto max-w-[var(--content-max)]"><p className="text-xs font-semibold uppercase tracking-[0.28em] text-[var(--brand-mint)]">Vantagens de ser Fundador</p><h2 className="mt-5 max-w-4xl text-[clamp(2.7rem,6vw,5.5rem)] font-semibold leading-[0.95] tracking-[-0.055em]">Entra no primeiro capítulo.<br /><span className="text-white/38">Leva mais da NLOCK contigo.</span></h2><div className="mt-14 grid gap-4 md:grid-cols-2 lg:grid-cols-3">{advantages.map(({ icon, title, text }) => <article key={title} className="nlock-founder-feature rounded-[24px] border border-white/10 bg-[#0c131d] p-7">{createElement(icon, { size: 24, className: "text-[var(--brand-mint)]" })}<h3 className="mt-9 text-xl font-semibold">{title}</h3><p className="mt-3 text-sm leading-7 text-white/50">{text}</p></article>)}</div></div></section>

        <section id="influence" className="px-[var(--page-gutter)] py-[var(--section-space)]"><div className="mx-auto grid max-w-[var(--content-max)] gap-10 lg:grid-cols-[0.86fr_1.14fr] lg:items-center"><div><Sparkles size={32} className="text-[var(--brand-mint)]" /><h2 className="mt-7 text-[clamp(2.7rem,5vw,5rem)] font-semibold leading-[0.95] tracking-[-0.055em]">Ajuda a moldar a NLOCK.</h2><p className="mt-6 max-w-xl text-lg leading-8 text-white/55">A tua experiência no terreno tem valor. Participa nesta pergunta e vê imediatamente como a tua prioridade se compara com a de outros coaches que visitaram esta página.</p></div><FounderProgrammePoll /></div></section>

        <section className="border-y border-white/10 bg-[#080d14] px-[var(--page-gutter)] py-[var(--section-space)]"><div className="mx-auto max-w-[var(--content-max)]"><div className="grid gap-5 lg:grid-cols-3"><article className="nlock-founder-feature rounded-[26px] border border-white/10 bg-[#0c131d] p-7"><Gift className="text-[var(--brand-mint)]" /><p className="mt-12 text-xs font-semibold uppercase tracking-[0.18em] text-white/35">Referrals convertidos</p><h3 className="mt-3 text-3xl font-semibold">3 referrals<br /><span className="text-[var(--brand-mint)]">+30 dias</span></h3><p className="mt-5 leading-7 text-white/50">Máximo de seis meses de subscrição por ano.</p></article><article className="nlock-founder-feature rounded-[26px] border border-white/10 bg-[#0c131d] p-7"><TrendingUp className="text-[var(--brand-mint)]" /><p className="mt-12 text-xs font-semibold uppercase tracking-[0.18em] text-white/35">Participação ativa</p><h3 className="mt-3 text-3xl font-semibold">Mais contributo.<br /><span className="text-[var(--brand-mint)]">Mais vantagens.</span></h3><p className="mt-5 leading-7 text-white/50">Quanto mais ajudas a NLOCK, mais reconhecimento e oportunidades podes receber dentro do programa.</p></article><article className="nlock-founder-feature rounded-[26px] border border-white/10 bg-[#0c131d] p-7"><Award className="text-[var(--brand-mint)]" /><p className="mt-12 text-xs font-semibold uppercase tracking-[0.18em] text-white/35">Mural de Fundadores</p><h3 className="mt-3 text-3xl font-semibold">Mais visibilidade.<br /><span className="text-[var(--brand-mint)]">Potenciais leads.</span></h3><p className="mt-5 leading-7 text-white/50">Visitantes podem descobrir o teu perfil e enviar um pedido de contacto diretamente através do mural.</p></article></div></div></section>

        <section id="conditions" className="px-[var(--page-gutter)] py-[var(--section-space)]"><div className="mx-auto grid max-w-[var(--content-max)] gap-10 lg:grid-cols-[0.75fr_1.25fr]"><div><ShieldCheck size={34} className="text-[var(--brand-mint)]" /><h2 className="mt-7 text-4xl font-semibold tracking-[-0.045em]">Um estatuto exclusivo, com condições claras.</h2></div><div className="grid gap-5 sm:grid-cols-2">{[["Atribuição automática", "Os primeiros 50 coaches que ativarem uma subscrição anual elegível recebem automaticamente o estatuto."], ["Número histórico", "Se cancelares, o número permanece teu e nunca será atribuído a outro coach."], ["Benefícios ativos", "Cancelar remove o badge ativo, Preço de Lançamento, recompensas, ranking e visibilidade no mural."], ["Reconhecimento, não certificação", "O estatuto de Fundador reconhece participação na NLOCK; não certifica nem recomenda serviços profissionais."]].map(([title, text]) => <article key={title} className="border-t border-white/15 pt-5"><h3 className="font-semibold">{title}</h3><p className="mt-2 text-sm leading-6 text-white/45">{text}</p></article>)}</div></div></section>

        <section className="nlock-founder-cta px-[var(--page-gutter)] pb-[var(--section-space)] text-center"><div className="mx-auto max-w-5xl rounded-[32px] border border-[var(--brand-mint)]/25 bg-[linear-gradient(135deg,rgba(57,185,138,0.16),rgba(67,144,211,0.09),rgba(12,19,29,1))] px-6 py-16 sm:px-12 sm:py-20"><p className="text-xs font-semibold uppercase tracking-[0.28em] text-[var(--brand-mint)]">As primeiras 50 vagas</p><h2 className="mt-6 text-[clamp(3rem,7vw,6.2rem)] font-semibold leading-[0.9] tracking-[-0.06em]">DESBLOQUEIA O TEU<br /><span className="bg-[image:var(--brand-gradient)] bg-clip-text text-transparent">POTENCIAL COMPLETO.</span></h2><Link href="/signup?mode=subscription&founder=1" className="mt-10 inline-flex min-h-[54px] items-center justify-center gap-2 rounded-[var(--radius-md)] bg-[image:var(--brand-gradient)] px-7 font-semibold text-[#03130e]">Começar como Fundador <ArrowRight size={18} /></Link></div></section>
      </main>
      <footer className="border-t border-white/10 px-[var(--page-gutter)] py-8"><div className="mx-auto flex max-w-[var(--content-max)] flex-col items-center justify-between gap-5 text-sm text-white/40 sm:flex-row"><Link href="/"><Brand /></Link><p>Limitado aos primeiros 50 Coaches Fundadores elegíveis.</p></div></footer>
    </div>
  );
}
