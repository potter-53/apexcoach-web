# NLOCK STYLE — Landing page

Versão 1.0 · contrato visual para a migração da experiência pública para NLOCK.

Este documento define as regras mensuráveis da landing. Os valores consumidos pelo código vivem em `src/styles/nlock-tokens.css`. Alterações à escala visual devem ser feitas primeiro nos tokens e refletidas aqui; componentes não devem criar valores concorrentes.

## 1. Direção da marca

NLOCK deve comunicar **foco, progresso e controlo**: tecnologia premium, atlética e silenciosa. A interface usa composição limpa, contraste forte e pequenas ativações do gradiente ciano → verde → lima.

- Preto e branco constroem a hierarquia.
- O gradiente identifica marca, progresso e ações prioritárias.
- Lima é o ponto de energia; não é uma cor de fundo dominante.
- O dark mode é profundo e técnico; o light mode é claro e editorial.
- A referência enviada define direção, não fornece assets prontos para produção.

## 2. Logótipo e naming

- Marca escrita sempre como **NLOCK**, em maiúsculas.
- Tagline oficial na referência: **UNLOCK YOUR FULL POTENTIAL**.
- O símbolo isolado serve para favicon, avatar e espaços compactos.
- O lockup horizontal é preferencial no header; o vertical apenas em hero, footer ou comunicação institucional.
- Reservar uma margem de segurança mínima equivalente à altura do `N` em redor do logo.
- Altura mínima digital: símbolo `24px`; lockup horizontal `96px` de largura.
- Não redesenhar, inclinar, aplicar sombra, trocar cores ou recortar o logo a partir do mockup.

Antes da publicação são necessários SVG oficiais: símbolo, lockup horizontal e vertical, cada um em versões light/dark.

## 3. Cor

### Marca

| Papel | Token | Valor |
| --- | --- | --- |
| Entrada/tecnologia | `--brand-cyan` | `#08B9C5` |
| Progresso/ação | `--brand-mint` | `#35D38A` |
| Energia/meta | `--brand-lime` | `#B9ED28` |
| Gradiente oficial | `--brand-gradient` | 110°, cyan 0%, mint 52%, lime 100% |

O gradiente oficial pode aparecer no logo aprovado, texto de destaque curto, barra de progresso, indicador ativo e CTA principal. Limite: uma área dominante com gradiente por viewport. Não usar como fundo integral de cards, parágrafos ou secções longas.

Todo o restante código usa tokens semânticos (`--bg`, `--surface-solid`, `--text`, `--border`, `--accent`, estados). É proibido adicionar hex, `rgb()` ou cores Tailwind físicas num componente migrado.

## 4. Tipografia

A fonte provisória é a stack `--font-sans`; `--font-display` fica separada para receber a fonte oficial quando a licença/ficheiros forem entregues.

| Estilo | Tamanho | Peso | Altura de linha | Uso |
| --- | --- | --- | --- | --- |
| Display | `--text-display` (44–92px) | 600 | `1.02` | Claim curto do hero |
| H1 | `--text-h1` (40–76px) | 600 | `1.02` | Título principal |
| H2 | `--text-h2` (32–56px) | 600 | `1.15` | Título de secção |
| H3 | `--text-h3` (22–32px) | 600 | `1.15` | Título de card/grupo |
| Lead | `--text-lead` (17–20px) | 400 | `1.65` | Subtítulo/introdução |
| Body | `--text-body` (16px) | 400 | `1.65` | Texto corrente |
| Small | `--text-small` (14px) | 400/500 | `1.5` | Apoio e metadata |
| Label | `--text-label` (12px) | 600 | `1.3` | Eyebrow, badge, categoria |

Títulos usam `--tracking-display`. Labels curtas podem usar maiúsculas e `--tracking-label`; frases completas não. O comprimento ideal de texto corrido é 45–75 caracteres e nunca deve exceder `--content-reading`.

## 5. Grelha e ritmo

- Container máximo: `--content-max` (`1280px`).
- Margem lateral: `--page-gutter` (`16–40px`, fluida).
- Espaço vertical entre secções: `--section-space` (`72–128px`, fluido).
- Grelha desktop: 12 colunas; tablet: 8; mobile: 4.
- Gap: `--grid-gap` (`16–24px`).
- Breakpoints de composição: mobile `<640px`, tablet `640–1023px`, desktop `≥1024px`, wide `≥1280px`.
- Espaçamento interno segue a escala de 4px. Preferir 8, 12, 16, 24, 32, 48, 64, 80, 96 e 128px.

Uma secção deve ter um único objetivo, um título e no máximo uma ação primária. O hero ocupa no mínimo `calc(100svh - header)` em desktop quando a composição não perder legibilidade.

## 6. Forma, limites e elevação

| Elemento | Raio | Borda | Sombra |
| --- | --- | --- | --- |
| Badge/controlo compacto | `--radius-sm` (12px) | `--border` | nenhuma |
| Botão/input/card compacto | `--radius-md` (16px) | `--border` | opcional |
| Card editorial | `--radius-lg` (20px) | `--border` | `--shadow-soft` |
| Media/painel principal | `--radius-xl` (24px) | `--border-strong` | `--shadow-panel` |
| Hero/modal especial | `--radius-2xl` (28px) | `--border-strong` | `--shadow-panel` |
| Pill | `--radius-pill` | `--border` | nenhuma |

Bordas são sempre 1px. A sombra não substitui a borda. Cards não flutuam por defeito; hover eleva no máximo `2px` e usa `--shadow-card-hover`.

## 7. Cards

Todos os cards usam `--surface-solid`, `--card-padding`, uma borda semântica e um raio da escala.

| Família | Altura mínima | Estrutura |
| --- | --- | --- |
| Proof/stat | `--card-min-height-sm` (192px) | métrica, label e contexto |
| Feature | `--card-min-height-md` (288px) | ícone, título, descrição e link opcional |
| Showcase | `--card-min-height-lg` (416px) | produto/media e narrativa |
| Testimonial | conteúdo, mínimo 288px | quote curta, pessoa e função |

Cards irmãos na mesma linha têm altura igual. Não aninhar mais de um card dentro de outro. Um card interativo inteiro deve ter um único alvo clicável e estado de foco visível.

## 8. Botões e controlos

### Primário

- Altura `--control-height-lg` (52px), padding horizontal `--button-padding-x` (20px).
- Fundo `--brand-gradient`, texto `--accent-foreground`, raio `--radius-md`.
- Uma ação primária por bloco visual; sombra `--shadow-accent` apenas em hero/CTA.

### Secundário

- Mesmas dimensões; `--surface-solid`, borda `--border`, texto `--text`.
- Hover troca para `--border-strong`; não recebe gradiente.

### Terciário

- Sem caixa permanente, altura mínima 44px, texto `--text` e seta/ícone opcional.
- Hover usa `--accent-soft`.

Todos os controlos têm alvo mínimo `44×44px`, label verbal, estado disabled e foco de 2px em `--accent` com offset de 2px. Em mobile, CTAs do hero ocupam a largura disponível; a partir de 640px usam largura pelo conteúdo.

## 9. Ícones

- Família única: Lucide para a interface; símbolos próprios apenas quando entregues como assets da marca.
- Tamanhos: `16px` inline, `20px` controlo, `24px` navegação e `32px` feature.
- Stroke padrão `--stroke-icon` (`1.75`), com `currentColor`.
- Não misturar ícones outline e preenchidos no mesmo contexto.
- Ícone decorativo recebe `aria-hidden`; ação só com ícone exige nome acessível e tooltip.
- Contentor de ícone de feature: `48×48px`, raio 16px, `--accent-soft`.

## 10. Imagem e produto

- Screenshots do produto devem mostrar UI real, sem inventar métricas que pareçam dados de clientes.
- Rácios preferenciais: `16:10` para desktop, `9:19.5` para telefone, `1:1` para detalhes.
- Moldura de dispositivo só quando melhora a compreensão; não em todas as secções.
- Imagem usa `object-fit: cover` para ambiente e `contain` para produto.
- Overlay máximo de 40% para preservar contraste; incluir texto alternativo útil.

## 11. Movimento

- Microinteração: `--duration-fast` (180ms).
- Entrada/troca de painel: `--duration-normal` (280ms).
- Curva: `--ease-standard`.
- Movimento permitido: opacidade, transform e progresso; distância máxima de entrada 16px.
- Nunca animar layout continuamente. Demos automáticas devem pausar fora do viewport e com interação do utilizador.
- `prefers-reduced-motion: reduce` remove deslocamento, loops e smooth scroll.

## 12. Acessibilidade e responsive

- Contraste mínimo WCAG AA: 4.5:1 em texto normal e 3:1 em texto grande/elementos gráficos.
- Estados não dependem apenas da cor.
- Ordem do DOM acompanha a ordem visual e todos os fluxos funcionam por teclado.
- Não esconder conteúdo essencial em hover.
- A landing deve funcionar a partir de 320px sem scroll horizontal.
- Light e dark têm igualdade funcional; a identidade não depende de um dos temas.

## 13. Anatomia recomendada da landing

1. Header: marca, navegação curta, tema e CTA.
2. Hero: eyebrow, promessa, explicação, CTA primário/secundário e visual do produto.
3. Prova: resultados ou confiança, sem métricas não verificadas.
4. Problema → benefício: Focus, Unlock, Save time, Apex.
5. Produto: mobile para terreno e browser para planeamento/gestão.
6. Funcionalidades: cards consistentes, orientados a resultados.
7. Para quem: coaches e respetivos clientes.
8. CTA final: uma decisão clara.
9. Footer: marca, navegação, legal e contacto.

## 14. Critérios de aceitação da migração

- Zero referências visíveis a APEX COACH, exceto numa comunicação transitória aprovada.
- Zero cores, raios, sombras ou gradientes soltos nos componentes migrados.
- Tipografia, cards, botões e ícones seguem as tabelas deste documento.
- Estados default, hover, active, focus, loading, disabled e error estão cobertos.
- Validado a 320, 390, 768, 1024, 1440 e 1920px.
- Validado em light, dark, teclado e reduced motion.
- Lighthouse sem regressões críticas de acessibilidade ou performance.
- Metadata, canonical, Open Graph, favicon e domínio passam para `nlock.pt` na fase de publicação.

## 15. Fora deste passo

Esta versão define o sistema; não migra ainda o conteúdo nem a composição da landing, não altera domínio/SEO e não produz o logo a partir da fotografia. Essas ações começam depois da aprovação do NLOCK STYLE e da entrega dos assets oficiais.
