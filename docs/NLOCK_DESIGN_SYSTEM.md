# NLOCK — referência visual

Este documento contém os princípios comuns da migração visual. Os valores técnicos vivem em `src/styles/nlock-tokens.css`; a especificação detalhada da landing vive em `docs/NLOCK_STYLE.md` e a da aplicação em `docs/NLOCK_APP_DESIGN_SYSTEM.md`.

## Princípios

1. **Clareza primeiro.** Poucos elementos, hierarquia forte e espaço suficiente.
2. **Energia com controlo.** O gradiente NLOCK identifica marca e ações importantes; não é decoração de fundo recorrente.
3. **Light e dark são equivalentes.** Nenhuma página deve depender de branco, preto ou transparências fixas.
4. **Sem valores soltos.** Cores, sombras e raios novos devem vir dos tokens.
5. **Consistência funcional.** O mesmo tipo de componente deve ter o mesmo aspeto em todas as páginas.

## Marca

- Ciano: `--brand-cyan` (`#08B9C5`)
- Verde: `--brand-mint` (`#35D38A`)
- Lima: `--brand-lime` (`#B9ED28`)
- Gradiente oficial de interface: `--brand-gradient`
- Glow de marca: `--brand-glow`

O gradiente pode ser usado no logótipo, texto de destaque, indicador ativo e CTA principal. Não usar em cartões inteiros, fundos de página, tabelas ou texto corrido.

## Cores semânticas

Usar o significado, não a cor física:

| Necessidade | Token |
| --- | --- |
| Fundo da página | `--bg` |
| Superfície/card | `--surface-solid` |
| Superfície secundária | `--surface-muted` |
| Superfície elevada | `--surface-elevated` |
| Borda normal | `--border` |
| Borda com ênfase | `--border-strong` |
| Texto principal | `--text` |
| Texto secundário | `--text-muted` |
| Texto auxiliar | `--text-subtle` |
| Ação/destaque | `--accent` |
| Fundo suave de destaque | `--accent-soft` |
| Sucesso, aviso e erro | `--success`, `--warning`, `--danger` |

Nunca adicionar `bg-white`, `text-black`, hex ou `rgba()` diretamente num componente migrado.

## Tipografia

- Interface e texto: `--font-sans`
- Títulos: `--font-display`
- Dados técnicos: `--font-mono`
- Títulos grandes: peso 600, `--tracking-display`, line-height entre 0.98 e 1.1.
- Corpo: peso 400, line-height entre 1.5 e 1.75.
- Labels: peso 600, maiúsculas apenas em labels curtas, `--tracking-label`.
- Evitar itálico em elementos de marca e evitar mais de três pesos na mesma página.

A família final pode ser trocada num único ponto através de `--font-sans` e `--font-display`, quando os ficheiros/licença oficiais forem definidos.

## Forma e elevação

- Controlos pequenos: `--radius-sm` (12 px)
- Inputs, botões e cartões: `--radius-md` (16 px)
- Painéis: `--radius-lg` ou `--radius-xl` (20/24 px)
- Hero/modal especial: `--radius-2xl` (28 px)
- Pills: `--radius-pill`
- Card normal: `--shadow-soft`
- Modal/painel elevado: `--shadow-panel`
- CTA ou elemento de marca: `--shadow-accent`

Não criar novos raios como 15, 18, 21, 22, 26 ou 36 px. Durante a migração devem ser normalizados para a escala acima.

## Componentes

### Botão principal

Fundo `--accent`, texto `--accent-foreground`, raio `--radius-md` e altura mínima `--control-height`. Um CTA principal por bloco visual.

### Botão secundário

Fundo `--surface-solid`, borda `--border`, texto `--text`. Hover com `--border-strong`.

### Card

Fundo `--surface-solid`, borda `--border`, raio `--radius-md` ou `--radius-lg`, sombra `--shadow-soft`. O card não deve introduzir um gradiente próprio.

### Input

Fundo `--surface-muted`, borda `--border`, texto `--text`, placeholder `--text-subtle`. Focus com `--accent` e sem glow excessivo.

### Navegação

Header com `--header-bg` e backdrop blur. O item ativo usa `--accent-soft` e `--accent-strong`; itens inativos usam `--text-muted`.

## Movimento

- Interação rápida: `--duration-fast` (180 ms)
- Transição de painel: `--duration-normal` (280 ms)
- Curva padrão: `--ease-standard`
- Respeitar sempre `prefers-reduced-motion`.
- Animação contínua só em elementos demonstrativos, nunca na navegação ou formulários.

## Processo por página

1. Substituir cores e gradientes hardcoded por tokens semânticos.
2. Normalizar tipografia e hierarquia.
3. Normalizar raios e sombras.
4. Validar light, dark, mobile e desktop.
5. Validar contraste, focus de teclado e reduced motion.
6. Só depois alterar composição ou conteúdo da página seguinte.

## Assets de marca pendentes

Para fechar a substituição APEX COACH → NLOCK são necessários assets isolados, idealmente SVG:

- símbolo NLOCK;
- lockup horizontal;
- lockup vertical/comunidade;
- versões para fundo claro e escuro;
- favicon/app icon;
- regras de margem de segurança e tamanho mínimo.

O mockup recebido é a direção visual, mas não deve ser recortado para produção.
