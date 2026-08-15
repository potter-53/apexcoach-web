"use client";

import Link from "next/link";
import { ArrowRight, CalendarDays, Check, ClipboardCheck, CreditCard, Dumbbell, ExternalLink, MapPin, Menu, Play, Sparkles, TrendingUp, Users, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import ThemeToggle from "../../src/components/ThemeToggle";
import FounderWorldMap from "./FounderWorldMap";

const moments = [
  {
    number: "01",
    label: "Ao pequeno-almoço",
    title: "Antes do café arrefecer, já sabes como vai ser o dia.",
    text: "Abre. Vê a agenda. Segue. A NLOCK mostra-te o que vem a seguir sem mensagens, folhas ou minutos perdidos.",
    gain: "O dia começa claro.",
    image: "/story/coach-breakfast.webp",
    screen: "/screenshot_1.jpeg",
    video: "/videos/nlock-01-agenda.mp4",
    icon: CalendarDays,
  },
  {
    number: "02",
    label: "Antes da sessão",
    title: "O client chega. Tu já sabes o que fazer.",
    text: "Plano, histórico e objetivo da sessão aparecem juntos. Menos improviso. Mais intenção em cada escolha.",
    gain: "Entrar preparado.",
    image: "/story/coach-in-session.webp",
    screen: "/screenshot_3.jpeg",
    video: "/videos/nlock-02-plano.mp4",
    icon: Dumbbell,
  },
  {
    number: "03",
    label: "Durante a sessão",
    title: "A carga certa. Registada no momento certo.",
    text: "Vê o que estava previsto, ajusta ao que está a acontecer e guarda a carga realizada sem sair da sessão.",
    gain: "Treinar e registar tornam-se um só gesto.",
    image: "/story/coach-live-training.webp",
    screen: "/screenshot_3.jpeg",
    video: "/videos/nlock-03-cargas.mp4",
    icon: ClipboardCheck,
  },
  {
    number: "04",
    label: "Entre sessões",
    title: "Uma sessão termina. A próxima já está encaminhada.",
    text: "Regista o PSE, fecha o treino e consulta o próximo compromisso. Tudo no mesmo fluxo, enquanto o contexto ainda está fresco.",
    gain: "Nada fica para lembrar mais tarde.",
    image: "/story/coach-prescribing.webp",
    screen: "/screenshot_2.jpeg",
    video: "/videos/nlock-04-pse.mp4",
    icon: CalendarDays,
  },
  {
    number: "05",
    label: "Depois dos treinos",
    title: "Acabaram os treinos. Não começa outro turno.",
    text: "Prescrição, agenda, pagamentos, contabilidade e automatismos continuam ligados — sem reconstruir o dia ao computador.",
    gain: "Menos administração. Mais vida.",
    image: "/story/coach-business.webp",
    screen: "/screenshot_1.jpeg",
    video: "/videos/nlock-05-operacao.mp4",
    icon: CreditCard,
  },
];

function NlockBrand({ compact = false }) {
  return (
    <span className="inline-flex items-center gap-2.5" aria-label="NLOCK">
      <span aria-hidden="true" className={`${compact ? "h-8 w-8" : "h-10 w-10"} nlock-placeholder-mark`}>N</span>
      <span className="nlock-wordmark text-sm text-white sm:text-base">NLOCK</span>
    </span>
  );
}

function AppActionVideo({ src, alt, className = "", delay = 480 }) {
  const [videoReady, setVideoReady] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const containerRef = useRef(null);
  const videoRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    const video = videoRef.current;
    if (!container || !video || !videoReady) return undefined;

    let playTimer;
    const observer = new IntersectionObserver(([entry]) => {
      window.clearTimeout(playTimer);
      if (entry.isIntersecting && entry.intersectionRatio >= 0.58) {
        playTimer = window.setTimeout(() => {
          video.play().catch(() => {});
        }, delay);
      } else {
        video.pause();
        video.currentTime = 0;
        setIsPlaying(false);
      }
    }, { threshold: [0, 0.58, 0.85] });

    observer.observe(container);
    return () => {
      window.clearTimeout(playTimer);
      observer.disconnect();
    };
  }, [delay, videoReady]);

  if (!videoReady) return null;

  return (
    <div ref={containerRef} className={`overflow-hidden rounded-[18px] transition-opacity duration-300 ${isPlaying ? "opacity-100 shadow-[0_30px_80px_rgba(0,0,0,0.42)]" : "pointer-events-none opacity-0"} ${className}`}>
      <video ref={videoRef} loop muted playsInline preload="metadata" aria-label={alt} onPlaying={() => setIsPlaying(true)} onError={() => setVideoReady(false)} className="block aspect-[921/2048] h-auto w-full object-contain">
        <source src={src} type="video/mp4" />
      </video>
      <span className="pointer-events-none absolute bottom-3 left-3 inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-black/65 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-white/75 backdrop-blur">
        <Play size={11} fill="currentColor" /> App em ação
      </span>
    </div>
  );
}

export default function TestLanding() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [founders, setFounders] = useState([]);
  const [activeFounderIndex, setActiveFounderIndex] = useState(0);
  const [contactFounder, setContactFounder] = useState(null);
  const [leadForm, setLeadForm] = useState({ name: "", email: "", phone: "", message: "", website: "" });
  const [leadState, setLeadState] = useState({ status: "idle", message: "" });

  useEffect(() => {
    let active = true;
    fetch("/api/founding-coaches", { cache: "no-store" })
      .then((response) => response.json())
      .then((payload) => {
        if (active && Array.isArray(payload?.coaches)) setFounders(payload.coaches);
      })
      .catch(() => {
        if (active) setFounders([]);
      });
    return () => { active = false; };
  }, []);

  const activeFounder = founders[activeFounderIndex] || founders[0];

  async function submitLead(event) {
    event.preventDefault();
    if (!contactFounder || leadState.status === "sending") return;
    setLeadState({ status: "sending", message: "" });
    try {
      const response = await fetch("/api/coach-leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...leadForm, founderNumber: contactFounder.number }),
      });
      const payload = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(payload?.error || "Não foi possível enviar o pedido.");
      setLeadState({ status: "sent", message: `Pedido enviado ao Coach ${contactFounder.name}.` });
      setLeadForm({ name: "", email: "", phone: "", message: "", website: "" });
    } catch (error) {
      setLeadState({ status: "error", message: error.message || "Não foi possível enviar o pedido." });
    }
  }

  return (
    <div className="nlock-test min-h-screen bg-[#05090f] text-white">
      <header className="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-[#05090f]/80 backdrop-blur-xl">
        <div className="mx-auto flex h-[72px] max-w-[var(--content-max)] items-center justify-between px-[var(--page-gutter)]">
          <a href="#top"><NlockBrand compact /></a>
          <nav className="hidden items-center gap-8 text-sm text-white/60 lg:flex">
            <a href="#moments" className="transition hover:text-white">Em ação</a>
            <a href="#system" className="transition hover:text-white">O sistema</a>
            <a href="#community" className="transition hover:text-white">Comunidade</a>
            <a href="#pricing" className="transition hover:text-white">Planos</a>
            <a href="#start" className="transition hover:text-white">Começar</a>
          </nav>
          <div className="flex items-center gap-2">
            <ThemeToggle language="pt" className="!border-white/10 !bg-white/5 !text-white" />
            <Link href="/signup?mode=trial" className="hidden min-h-11 items-center rounded-[var(--radius-md)] bg-[image:var(--brand-gradient)] px-5 text-sm font-semibold text-[#03130e] sm:inline-flex">
              Experimentar
            </Link>
            <button type="button" onClick={() => setMenuOpen((value) => !value)} className="flex h-11 w-11 items-center justify-center rounded-[var(--radius-md)] border border-white/10 lg:hidden" aria-label="Abrir navegação">
              {menuOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>
        {menuOpen ? (
          <nav className="grid gap-2 border-t border-white/10 bg-[#05090f] p-4 lg:hidden">
            <a href="#moments" onClick={() => setMenuOpen(false)} className="rounded-xl px-4 py-3 text-white/70">Em ação</a>
            <a href="#system" onClick={() => setMenuOpen(false)} className="rounded-xl px-4 py-3 text-white/70">O sistema</a>
            <a href="#community" onClick={() => setMenuOpen(false)} className="rounded-xl px-4 py-3 text-white/70">Comunidade</a>
            <a href="#pricing" onClick={() => setMenuOpen(false)} className="rounded-xl px-4 py-3 text-white/70">Planos</a>
            <Link href="/signup?mode=trial" className="rounded-xl bg-[image:var(--brand-gradient)] px-4 py-3 text-center font-semibold text-[#03130e]">Experimentar</Link>
          </nav>
        ) : null}
      </header>

      <main id="top">
        <section className="nlock-test-hero relative min-h-[100svh] overflow-hidden pt-[72px]">
          <img src="/story/coach-in-session.webp" alt="Coach a usar a NLOCK no ginásio" className="absolute inset-0 h-full w-full object-cover object-[62%_center]" />
          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(5,9,15,0.98)_0%,rgba(5,9,15,0.84)_42%,rgba(5,9,15,0.18)_76%,rgba(5,9,15,0.35)_100%)]" />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_55%,#05090f_100%)]" />

          <div className="relative mx-auto grid min-h-[calc(100svh-72px)] max-w-[var(--content-max)] items-center gap-10 px-[var(--page-gutter)] py-16 lg:grid-cols-[1fr_0.72fr]">
            <div className="max-w-3xl">
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[var(--brand-mint)]">Built for the work that happens now</p>
              <h1 className="mt-6 text-[clamp(3.25rem,8.5vw,7.75rem)] font-semibold leading-[0.88] tracking-[-0.065em]">
                UNLOCK YOUR<br />FULL POTENTIAL
              </h1>
              <p className="mt-5 bg-[image:var(--brand-gradient)] bg-clip-text text-[clamp(1.5rem,3vw,2.75rem)] font-semibold tracking-[-0.04em] text-transparent">AND YOUR CLIENTS’</p>
              <p className="mt-8 max-w-xl text-lg leading-8 text-white/65">A ferramenta que acompanha o coach antes, durante e depois de cada sessão.</p>
              <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                <Link href="/signup?mode=trial" className="inline-flex min-h-[52px] items-center justify-center gap-2 rounded-[var(--radius-md)] bg-[image:var(--brand-gradient)] px-6 font-semibold text-[#03130e] shadow-[var(--shadow-accent)]">
                  Começar agora <ArrowRight size={18} />
                </Link>
                <a href="#moments" className="inline-flex min-h-[52px] items-center justify-center rounded-[var(--radius-md)] border border-white/15 bg-white/5 px-6 font-semibold text-white backdrop-blur">Ver em ação</a>
              </div>
            </div>
            <div className="relative hidden h-[620px] lg:block">
              <AppActionVideo src="/videos/nlock-01-agenda.mp4" poster="/screenshot_1.jpeg" alt="Agenda NLOCK em ação" className="absolute right-8 top-1/2 w-[230px] -translate-y-1/2 rotate-[2deg]" />
              <div className="nlock-hero-status absolute bottom-20 left-0 rounded-[var(--radius-lg)] border border-white/10 bg-[#0c131d]/88 p-5 text-white backdrop-blur-xl">
                <p className="text-xs uppercase tracking-[0.2em] text-white/45">Próxima sessão</p>
                <p className="mt-2 font-semibold">Contexto pronto. Foco no client.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="border-y border-white/10 bg-[#080d14]">
          <div className="mx-auto grid max-w-[var(--content-max)] grid-cols-2 divide-x divide-white/10 px-[var(--page-gutter)] md:grid-cols-5">
            {["AGENDA", "PLANO", "CARGAS + PSE", "PRESCRIÇÃO", "PAGAMENTOS"].map((item) => <p key={item} className="py-5 text-center text-[11px] font-semibold tracking-[0.2em] text-white/45 sm:text-xs">{item}</p>)}
          </div>
        </section>

        <section id="moments" className="mx-auto max-w-[var(--content-max)] px-[var(--page-gutter)] py-[var(--section-space)]">
          <div className="max-w-4xl">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[var(--brand-mint)]">NLOCK em ação</p>
            <h2 className="mt-5 text-[clamp(2.6rem,6vw,5.5rem)] font-semibold leading-[0.95] tracking-[-0.055em]">Menos software.<br /><span className="text-white/38">Mais coaching.</span></h2>
          </div>

          <div className="mt-16 grid gap-8">
            {moments.map((moment, index) => {
              const Icon = moment.icon;
              return (
                <article key={moment.number} className="group relative grid overflow-hidden rounded-[22px] border border-white/10 bg-[#0c131d] sm:rounded-[28px] lg:min-h-[620px] lg:grid-cols-2">
                  <div className={`relative min-h-[330px] overflow-hidden sm:min-h-[420px] lg:min-h-full ${index % 2 ? "lg:order-2" : ""}`}>
                    <img src={moment.image} alt="" aria-hidden="true" loading="lazy" className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-[1.025]" />
                    <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_35%,rgba(5,9,15,0.72)_100%)]" />
                    <AppActionVideo src={moment.video} poster={moment.screen} alt={moment.title} className="absolute bottom-4 right-4 w-[138px] sm:bottom-8 sm:right-8 sm:w-[180px]" />
                  </div>
                  <div className="flex flex-col justify-center p-7 sm:p-12 lg:p-16">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold text-[var(--brand-mint)]">{moment.number}</span>
                      <Icon size={24} strokeWidth={1.5} className="text-white/35" />
                    </div>
                    <p className="mt-14 text-xs font-semibold uppercase tracking-[0.22em] text-white/38">{moment.label}</p>
                    <h3 className="mt-4 text-[clamp(2rem,4vw,4rem)] font-semibold leading-[0.98] tracking-[-0.05em]">{moment.title}</h3>
                    <p className="mt-6 max-w-xl text-base leading-7 text-white/55 sm:text-lg sm:leading-8">{moment.text}</p>
                    <p className="mt-10 inline-flex items-center gap-2 font-semibold text-[var(--brand-mint)]"><Check size={18} /> {moment.gain}</p>
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        <section id="system" className="overflow-hidden border-y border-white/10 bg-[#080d14] py-[var(--section-space)]">
          <div className="mx-auto grid max-w-[var(--content-max)] items-center gap-14 px-[var(--page-gutter)] lg:grid-cols-[0.8fr_1.2fr]">
            <div>
              <TrendingUp size={34} strokeWidth={1.5} className="text-[var(--brand-mint)]" />
              <h2 className="mt-7 text-[clamp(2.5rem,5vw,5rem)] font-semibold leading-[0.96] tracking-[-0.055em]">Tudo ligado.<br /><span className="text-white/35">Sempre contigo.</span></h2>
              <p className="mt-7 max-w-lg text-lg leading-8 text-white/55">O que registas hoje melhora a decisão de amanhã. Para o coach e para cada client.</p>
            </div>
            <div className="relative min-h-[500px] rounded-[28px] border border-white/10 bg-[radial-gradient(circle_at_50%_35%,rgba(53,211,138,0.13),transparent_45%),#0c131d]">
              <AppActionVideo src="/videos/nlock-06-progresso.mp4" poster="/screenshot_2.jpeg" alt="Evolução do client na NLOCK" className="absolute left-1/2 top-1/2 w-[210px] -translate-x-1/2 -translate-y-1/2" />
              <span className="absolute left-5 top-5 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs text-white/55 sm:left-10 sm:top-10">TREINO → HISTÓRICO</span>
              <span className="absolute bottom-5 right-5 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs text-white/55 sm:bottom-10 sm:right-10">AVALIAÇÃO → DECISÃO</span>
            </div>
          </div>
        </section>

        <section id="community" className="overflow-hidden border-b border-white/10 bg-[#080d14] py-[var(--section-space)]">
          <div className="mx-auto max-w-[var(--content-max)] px-[var(--page-gutter)]">
            <div className="max-w-4xl">
              <div className="flex items-center gap-3 text-[var(--brand-mint)]"><Users size={22} /><span className="text-xs font-semibold uppercase tracking-[0.22em]">Mural dos Coaches Fundadores</span></div>
              <h2 className="mt-5 text-[clamp(2.7rem,6vw,5.5rem)] font-semibold leading-[0.95] tracking-[-0.055em]">De Portugal para o mundo.<br /><span className="text-white/38">Conhece quem está a construir o início.</span></h2>
              <p className="mt-7 max-w-2xl text-lg leading-8 text-white/55">Cada ponto representa um Coach Fundador ativo. Seleciona o avatar para conhecer o coach, a sua localização e área de intervenção.</p>
            </div>

            <div className="mt-12 grid overflow-hidden rounded-[28px] border border-white/10 bg-[#0c131d] lg:grid-cols-[1.45fr_0.55fr]">
              <div className="relative min-h-[390px] overflow-hidden border-b border-white/10 sm:min-h-[520px] lg:border-b-0 lg:border-r">
                <FounderWorldMap founders={founders} activeIndex={activeFounderIndex} onSelect={setActiveFounderIndex} />
                <div className="pointer-events-none absolute left-4 top-4 z-[500] flex items-center gap-2 rounded-full border border-white/10 bg-black/55 px-3 py-1.5 text-[10px] uppercase tracking-[0.16em] text-white/70 backdrop-blur sm:left-7 sm:top-7"><MapPin size={12} /> {founders.length || 0} fundadores públicos</div>
                {!founders.length ? <div className="pointer-events-none absolute inset-x-6 bottom-6 z-[500] rounded-[18px] border border-dashed border-white/15 bg-black/55 p-5 text-center text-white backdrop-blur sm:inset-x-auto sm:bottom-8 sm:left-1/2 sm:w-[420px] sm:-translate-x-1/2"><p className="font-semibold">Os primeiros pontos do mapa começam aqui.</p><p className="mt-2 text-sm text-white/60">Os perfis aparecem quando existirem Coaches Fundadores ativos com consentimento público.</p></div> : null}
              </div>

              <aside className="flex min-h-[360px] flex-col justify-center p-6 sm:p-9">
                {activeFounder ? (
                  <>
                    <div className="flex items-center gap-4">
                      {activeFounder.photoUrl ? <img src={activeFounder.photoUrl} alt={activeFounder.name} className="h-20 w-20 rounded-[22px] object-cover" /> : <div className="flex h-20 w-20 items-center justify-center rounded-[22px] bg-[image:var(--brand-gradient)] text-lg font-bold text-[#03130e]">{activeFounder.number}</div>}
                      <div><p className="text-xs font-semibold text-[var(--brand-mint)]">FOUNDER {activeFounder.number}</p><h3 className="mt-1 text-2xl font-semibold tracking-[-0.03em]">{activeFounder.name}</h3></div>
                    </div>
                    <div className="mt-8 grid gap-3 border-y border-white/10 py-6 text-sm">
                      <div className="flex items-center justify-between gap-3"><span className="text-white/35">Localização</span><strong className="text-right">{activeFounder.city}{activeFounder.country && activeFounder.country !== activeFounder.city ? `, ${activeFounder.country}` : ""}</strong></div>
                      {activeFounder.workplace ? <div className="flex items-center justify-between gap-3"><span className="text-white/35">Onde treina</span><strong className="text-right">{activeFounder.workplace}</strong></div> : null}
                      <div className="flex items-center justify-between gap-3"><span className="text-white/35">Especialidade</span><strong className="text-right">{activeFounder.specialty || "Coach"}</strong></div>
                      <div className="flex items-center justify-between gap-3"><span className="text-white/35">Fundador desde</span><strong>{activeFounder.activeSince}</strong></div>
                    </div>
                    {activeFounder.bio ? <p className="mt-5 text-sm leading-6 text-white/55">{activeFounder.bio}</p> : null}
                    <button type="button" onClick={() => { setContactFounder(activeFounder); setLeadState({ status: "idle", message: "" }); }} className="mt-7 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-[var(--radius-md)] bg-[image:var(--brand-gradient)] px-5 font-semibold text-[#03130e]">Entrar em contacto <ArrowRight size={16} /></button>
                    {activeFounder.profileUrl ? <a href={activeFounder.profileUrl} target="_blank" rel="noreferrer" className="mt-3 inline-flex min-h-11 items-center justify-center gap-2 rounded-[var(--radius-md)] border border-white/15 bg-white/5 px-5 font-semibold">Perfil profissional <ExternalLink size={15} /></a> : null}
                  </>
                ) : (
                  <div className="text-center lg:text-left">
                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-[20px] border border-white/10 bg-white/5 text-[var(--brand-mint)] lg:mx-0"><Users size={26} /></div>
                    <h3 className="mt-6 text-2xl font-semibold">O mural está pronto.</h3>
                    <p className="mt-3 text-sm leading-6 text-white/45">O primeiro Coach Fundador com perfil público ativa o mapa e inaugura a comunidade.</p>
                    <Link href="/signup?mode=subscription&founder=1" className="mt-7 inline-flex min-h-11 items-center justify-center gap-2 rounded-[var(--radius-md)] bg-[image:var(--brand-gradient)] px-5 font-semibold text-[#03130e]">Ser Coach Fundador <ArrowRight size={16} /></Link>
                  </div>
                )}
              </aside>
            </div>

            {founders.length ? <div className="mt-8 flex gap-3 overflow-x-auto pb-3">{founders.map((founder, index) => <button key={`wall-${founder.number}`} type="button" onClick={() => setActiveFounderIndex(index)} className={`flex min-w-[220px] items-center gap-3 rounded-[18px] border p-3 text-left ${activeFounderIndex === index ? "border-[var(--brand-mint)] bg-[var(--brand-mint)]/10" : "border-white/10 bg-white/[0.025]"}`}>{founder.photoUrl ? <img src={founder.photoUrl} alt="" className="h-11 w-11 rounded-xl object-cover" /> : <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[image:var(--brand-gradient)] text-xs font-bold text-[#03130e]">{founder.number}</span>}<span><strong className="block text-sm">{founder.name}</strong><span className="mt-1 block text-xs text-white/40">{founder.city}</span></span></button>)}</div> : null}
          </div>
        </section>

        <section id="pricing" className="relative overflow-hidden py-[var(--section-space)]">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_20%,rgba(53,211,138,0.1),transparent_42%)]" />
          <div className="relative mx-auto max-w-[var(--content-max)] px-[var(--page-gutter)]">
            <div className="mx-auto max-w-3xl text-center">
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[var(--brand-mint)]">Planos NLOCK</p>
              <h2 className="mt-5 text-[clamp(2.7rem,6vw,5.5rem)] font-semibold leading-[0.95] tracking-[-0.055em]">Começa sem risco.<br /><span className="text-white/38">Cresce sem limites artificiais.</span></h2>
              <p className="mt-7 text-lg leading-8 text-white/55">30 dias para perceberes quanto tempo a tua operação pode devolver-te.</p>
            </div>

            <div className="mx-auto mt-14 grid max-w-5xl gap-6 lg:grid-cols-2">
              <article className="flex flex-col rounded-[28px] border border-white/10 bg-[#0c131d] p-7 sm:p-10">
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-white/40">Coach</p>
                <h3 className="mt-5 text-3xl font-semibold tracking-[-0.04em]">Toda a NLOCK.<br />Todos os dias.</h3>
                <div className="mt-8 flex items-end gap-2"><strong className="text-5xl tracking-[-0.055em]">29,90 €</strong><span className="pb-1 text-white/45">/mês</span></div>
                <p className="mt-3 text-sm text-white/40">ou 299,90 €/ano · equivalente a 10 meses</p>
                <ul className="mt-9 grid gap-4 text-sm text-white/65">
                  {["30 dias de trial grátis", "Clients ilimitados", "Treino, avaliações, agenda e PSE", "Packs, pagamentos e automatismos"].map((item) => <li key={item} className="flex items-center gap-3"><Check size={16} className="text-[var(--brand-mint)]" />{item}</li>)}
                </ul>
                <Link href="/signup?mode=trial" className="mt-10 inline-flex min-h-[52px] items-center justify-center gap-2 rounded-[var(--radius-md)] border border-white/15 bg-white/5 px-6 font-semibold text-white">Experimentar 30 dias <ArrowRight size={18} /></Link>
              </article>

              <article className="nlock-founder-plan relative flex flex-col overflow-hidden rounded-[28px] border border-[var(--brand-mint)]/40 bg-[linear-gradient(145deg,rgba(53,211,138,0.14),rgba(12,19,29,0.98)_42%)] p-7 text-white shadow-[var(--shadow-accent)] sm:p-10">
                <Sparkles size={170} strokeWidth={0.7} className="pointer-events-none absolute -right-12 -top-12 text-[var(--brand-mint)]/10" />
                <div className="relative">
                  <div className="flex items-center justify-between gap-4"><p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--brand-mint)]">Coach Fundador</p><span className="rounded-full bg-[var(--brand-mint)] px-3 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-[#03130e]">50 vagas</span></div>
                  <h3 className="mt-5 text-3xl font-semibold tracking-[-0.04em]">Entra cedo.<br />Cresce connosco.</h3>
                  <div className="mt-8 flex items-end gap-2"><strong className="text-5xl tracking-[-0.055em]">199,90 €</strong><span className="pb-1 text-white/45">/ano</span></div>
                  <p className="mt-3 text-sm text-white/40">≈ 16,66 €/mês · preço Founder enquanto a subscrição se mantiver ativa</p>
                  <ul className="mt-9 grid gap-4 text-sm text-white/65">
                    {["Tudo do plano Coach", "Badge e número exclusivo", "Early access e comunidade privada", "Participação na evolução do produto e suporte prioritário"].map((item) => <li key={item} className="flex items-center gap-3"><Check size={16} className="text-[var(--brand-mint)]" />{item}</li>)}
                  </ul>
                  <Link href="/signup?mode=subscription&founder=1" className="mt-10 inline-flex min-h-[52px] w-full items-center justify-center gap-2 rounded-[var(--radius-md)] bg-[image:var(--brand-gradient)] px-6 font-semibold text-[#03130e]">Candidatar-me <ArrowRight size={18} /></Link>
                </div>
              </article>
            </div>
            <p className="mx-auto mt-6 max-w-3xl text-center text-xs leading-6 text-white/35">O estatuto Coach Fundador requer subscrição anual, disponibilidade de vaga e aprovação da candidatura.</p>
          </div>
        </section>

        <section id="start" className="relative overflow-hidden py-[clamp(7rem,16vw,13rem)] text-center">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_70%,rgba(53,211,138,0.15),transparent_40%)]" />
          <div className="relative mx-auto max-w-5xl px-[var(--page-gutter)]">
            <NlockBrand />
            <h2 className="mt-10 text-[clamp(3rem,8vw,7rem)] font-semibold leading-[0.9] tracking-[-0.065em]">UNLOCK YOUR<br />FULL POTENTIAL.</h2>
            <p className="mt-5 bg-[image:var(--brand-gradient)] bg-clip-text text-2xl font-semibold text-transparent sm:text-4xl">AND YOUR CLIENTS’.</p>
            <Link href="/signup?mode=trial" className="mt-10 inline-flex min-h-[54px] items-center gap-2 rounded-[var(--radius-md)] bg-[image:var(--brand-gradient)] px-7 font-semibold text-[#03130e] shadow-[var(--shadow-accent)]">Experimentar NLOCK <ArrowRight size={18} /></Link>
          </div>
        </section>
      </main>

      <footer className="border-t border-white/10 px-[var(--page-gutter)] py-8 text-sm text-white/40">
        <div className="mx-auto flex max-w-[var(--content-max)] flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <NlockBrand compact />
          <p>UNLOCK YOUR FULL POTENTIAL · AND YOUR CLIENTS’</p>
          <Link href="/" className="hover:text-white">Landing atual</Link>
        </div>
      </footer>

      {contactFounder ? (
        <div className="fixed inset-0 z-[1000] flex items-end justify-center bg-black/75 p-3 backdrop-blur-sm sm:items-center sm:p-6" role="dialog" aria-modal="true" aria-label={`Contactar ${contactFounder.name}`}>
          <div className="max-h-[92svh] w-full max-w-xl overflow-y-auto rounded-[26px] border border-white/12 bg-[#0c131d] p-6 shadow-2xl sm:p-8">
            <div className="flex items-start justify-between gap-5">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--brand-mint)]">Contactar Founder {contactFounder.number}</p>
                <h3 className="mt-2 text-3xl font-semibold tracking-[-0.04em]">Falar com {contactFounder.name}</h3>
                <p className="mt-3 text-sm leading-6 text-white/50">O pedido entra diretamente no Coach Hub como uma nova oportunidade de trabalho.</p>
              </div>
              <button type="button" onClick={() => setContactFounder(null)} className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/5" aria-label="Fechar"><X size={18} /></button>
            </div>

            {leadState.status === "sent" ? (
              <div className="mt-8 rounded-[20px] border border-[var(--brand-mint)]/30 bg-[var(--brand-mint)]/10 p-6">
                <p className="text-lg font-semibold text-[var(--brand-mint)]">Pedido enviado.</p>
                <p className="mt-2 text-sm leading-6 text-white/60">{leadState.message}</p>
                <button type="button" onClick={() => setContactFounder(null)} className="mt-5 inline-flex min-h-11 items-center rounded-[var(--radius-md)] border border-white/15 px-5 font-semibold">Fechar</button>
              </div>
            ) : (
              <form onSubmit={submitLead} className="mt-7 grid gap-4">
                <input aria-hidden="true" tabIndex={-1} autoComplete="off" value={leadForm.website} onChange={(event) => setLeadForm((current) => ({ ...current, website: event.target.value }))} className="hidden" name="website" />
                <label className="grid gap-2 text-sm font-medium"><span>Nome</span><input required minLength={2} maxLength={120} value={leadForm.name} onChange={(event) => setLeadForm((current) => ({ ...current, name: event.target.value }))} className="min-h-12 rounded-[14px] border border-white/12 bg-white/5 px-4 outline-none transition focus:border-[var(--brand-mint)]" /></label>
                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="grid gap-2 text-sm font-medium"><span>Email</span><input required type="email" maxLength={254} value={leadForm.email} onChange={(event) => setLeadForm((current) => ({ ...current, email: event.target.value }))} className="min-h-12 rounded-[14px] border border-white/12 bg-white/5 px-4 outline-none transition focus:border-[var(--brand-mint)]" /></label>
                  <label className="grid gap-2 text-sm font-medium"><span>Telefone <span className="text-white/35">(opcional)</span></span><input type="tel" maxLength={40} value={leadForm.phone} onChange={(event) => setLeadForm((current) => ({ ...current, phone: event.target.value }))} className="min-h-12 rounded-[14px] border border-white/12 bg-white/5 px-4 outline-none transition focus:border-[var(--brand-mint)]" /></label>
                </div>
                <label className="grid gap-2 text-sm font-medium"><span>Como pode este coach ajudar?</span><textarea required minLength={10} maxLength={2000} rows={5} value={leadForm.message} onChange={(event) => setLeadForm((current) => ({ ...current, message: event.target.value }))} className="rounded-[14px] border border-white/12 bg-white/5 px-4 py-3 outline-none transition focus:border-[var(--brand-mint)]" /></label>
                {leadState.status === "error" ? <p className="rounded-xl border border-red-400/25 bg-red-400/10 px-4 py-3 text-sm text-red-200">{leadState.message}</p> : null}
                <p className="text-xs leading-5 text-white/35">Ao enviar, os teus dados de contacto são partilhados apenas com este coach para responder ao pedido.</p>
                <button disabled={leadState.status === "sending"} className="inline-flex min-h-[52px] items-center justify-center gap-2 rounded-[var(--radius-md)] bg-[image:var(--brand-gradient)] px-6 font-semibold text-[#03130e] disabled:opacity-50">{leadState.status === "sending" ? "A enviar…" : "Enviar pedido"} <ArrowRight size={17} /></button>
              </form>
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
}
