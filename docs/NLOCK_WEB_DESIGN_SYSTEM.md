# NLOCK Web — referência de migração

O contrato visual completo da landing está em `docs/NLOCK_STYLE.md` e os valores executáveis em `src/styles/nlock-tokens.css`.

Ordem de migração prevista: `/` primeiro; depois `/login`, `/signup`, `/client_signup`, `/beta`, `/apply` e `/legal/*`. Até cada página entrar nessa fase, deve manter o comportamento atual e apenas herdar os tokens globais e o mecanismo light/dark.

A aplicação em `/app` tem necessidades de densidade e operação próprias, descritas em `docs/NLOCK_APP_DESIGN_SYSTEM.md`; partilha a marca e os tokens fundamentais, mas não deve copiar a composição editorial da landing.
