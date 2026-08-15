# NLOCK — plano de migração dos layouts

Estado iniciado em 11 de agosto de 2026. Esta lista acompanha a limpeza visual página a página. A referência obrigatória é `docs/NLOCK_DESIGN_SYSTEM.md` e os valores técnicos vivem em `src/styles/nlock-tokens.css`.

## Fundação global

- [x] Tokens light/dark centralizados
- [x] Preferência do sistema e escolha persistida
- [x] Tailwind ligado aos tokens semânticos
- [x] Guia de tipografia, cor, forma, elevação e movimento
- [ ] Assets oficiais NLOCK isolados
- [ ] Componentes base partilhados: Button, Card, Input, Badge e PageShell
- [ ] Remover overrides temporários de compatibilidade do dark mode

## Âmbito atual: aplicação (`/app`)

1. **Dashboard** — define shell, sidebar, navegação, cards e tabelas da app.
2. **Clients** — valida listas, detalhe, estados e ações.
3. **Agenda** — valida calendário e densidade de informação.
4. **Training builder** — valida o padrão de construção/edição.
5. **Assessment builder** — aplica o mesmo padrão de builder.
6. **Coach/settings** — fecha os padrões de conta e preferências.

Landing, autenticação, beta/apply, legal e cookies pertencem ao website público e ficam fora desta fase.

## Auditoria inicial

Ocorrências aproximadas de valores visuais hardcoded fora do ficheiro de tokens:

| Área | Ocorrências | Nota |
| --- | ---: | --- |
| Landing (`src/App.jsx`) | 135 | Muitos raios, sombras e gradientes históricos |
| Dashboard | 85 | Maior prioridade dentro da aplicação |
| Beta | 33 | Gradientes promocionais antigos |
| Signup | 28 | Deve herdar o padrão de login |
| Clients | 22 | Cor antiga `#2ad07d` ainda presente |
| Login | 20 | Melhor primeira página para migrar |
| Training builder | 16 | Migrar após o shell do dashboard |
| Agenda | 16 | Migrar após o shell do dashboard |
| Assessment builder | 13 | Reutilizar padrão de builder |
| Client signup | 11 | Reutilizar padrão de autenticação |

As ocorrências em rotas API correspondem sobretudo a templates HTML de email e devem ser tratadas numa passagem própria, sem misturar com os layouts web.

## Critério de conclusão de uma página

- Zero hex, `rgb/rgba`, gradientes, sombras ou raios novos no componente.
- Usa apenas cores semânticas; light e dark não têm lógica duplicada.
- Tipografia segue a escala do design system.
- Estados hover, focus, disabled, loading, empty e error estão cobertos.
- Verificada em mobile e desktop.
- Sem regressões de lint/build.
