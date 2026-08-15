# NLOCK App — design system

Esta referência aplica-se apenas ao produto em `/app`. A landing e as páginas públicas não fazem parte desta fase de migração.

## Estrutura da aplicação

- Canvas: `--app-canvas` e `--app-background`.
- Sidebar desktop: `--app-sidebar`, largura base de 224 px e altura fixa ao viewport.
- Header de conteúdo: `--app-header`, sticky quando a página o justificar.
- Conteúdo: grelha fluida, máximo de 1600 px.
- Navegação mobile: lista horizontal até existir um padrão mobile definitivo.

## Hierarquia

1. Sidebar: marca, coach ativo, navegação e ações globais.
2. Header: título da área, contexto curto e ações da página.
3. Workspace: informação e ações do separador ativo.
4. Card: agrupa apenas uma responsabilidade funcional.

## Regras específicas

- A marca visível no shell é NLOCK.
- Não reutilizar gradientes promocionais da landing dentro da app.
- O gradiente de marca fica reservado ao símbolo, seleção ativa, progresso e CTA principal.
- Cards usam superfícies sólidas; a hierarquia vem de tamanho, espaço e borda.
- Métricas usam números fortes e labels discretas, sem sombras individuais excessivas.
- Tabelas e listas devem privilegiar densidade e alinhamento sobre decoração.
- Todos os controlos têm focus visível e altura mínima de 44 px quando são ações principais.

## Componentes a extrair durante a migração

- `AppShell`
- `AppSidebar`
- `AppHeader`
- `Button`
- `Card` / `SectionCard`
- `MetricCard`
- `FormField`
- `StatusBadge`
- `EmptyState`
- `Modal`

## Ordem das páginas da app

1. Dashboard
2. Clients
3. Agenda
4. Training Builder
5. Assessment Builder
6. Coach/settings

Cada página só fica concluída depois de validada em light/dark e desktop/mobile.

## Preview de desenvolvimento

Com `npm run dev`, abrir `/app/preview`. Esta rota usa dados fictícios, existe apenas em desenvolvimento e permite validar o layout sem Supabase ou sessão autenticada. Não substitui os testes funcionais em `/app`.
