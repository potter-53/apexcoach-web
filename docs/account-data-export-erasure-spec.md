# NLOCK — exportação e eliminação de conta

Estado: pedido e cancelamento implementados; executor destrutivo deliberadamente desativado
Última revisão: 25 de agosto de 2026

## Objetivo

Permitir que um coach autenticado:

1. exporte os dados associados à sua conta;
2. peça o encerramento e eliminação da conta;
3. acompanhe o estado do pedido;
4. cancele o pedido durante um período de segurança, quando ainda seja tecnicamente possível.

O fluxo deve respeitar os dados dos clientes geridos pelo coach, os documentos fiscais que têm de ser conservados e os dados tratados pela VERTEX LABS enquanto subcontratante.

## Localização na aplicação

Separador `Coach` → `Conta e subscrição` → área `Dados e privacidade`.

Ações:

- `Exportar os meus dados`
- `Eliminar conta`
- ligação para a Política de Privacidade;
- contacto `nlock@nlock.pt`.

## Exportação

### Pedido

- Exigir sessão autenticada recente.
- Voltar a pedir a palavra-passe ou outro fator de confirmação antes de iniciar a exportação.
- Criar um pedido com identificador único, data, estado e utilizador.
- Nunca aceitar um `user_id` fornecido livremente pelo cliente; usar sempre o utilizador autenticado.

### Conteúdo

Incluir, quando aplicável:

- perfil e definições do coach;
- clientes e respetivos dados operacionais;
- agenda e tipos de marcação;
- sessões, planos, avaliações e registos de progresso;
- packs, pedidos de pagamento e registos contabilísticos apresentados na app;
- subscrição, referências e participação no Programa de Fundadores;
- consentimentos, perfil público e pedidos de contacto recebidos.

Não incluir segredos técnicos, credenciais, tokens, hashes, dados completos de cartões ou dados pessoais de terceiros que o coach não esteja autorizado a receber.

### Entrega

- Produzir ficheiro ZIP com JSON e, quando útil, CSV.
- Cifrar o ficheiro em repouso.
- Disponibilizar ligação assinada, individual e temporária.
- Validade recomendada da ligação: 24 horas.
- Apagar o ficheiro de exportação no máximo 7 dias após a criação.
- Registar criação, download e expiração para auditoria de segurança.

## Eliminação da conta

### Informação prévia

Antes da confirmação, mostrar claramente:

- a subscrição deixa de renovar;
- o acesso pago mantém-se até ao fim do período já pago, salvo pedido de eliminação imediata;
- a eliminação pode afetar todos os clientes, sessões, avaliações e documentos operacionais;
- documentos fiscais podem ser conservados durante 10 anos;
- cópias de segurança podem persistir até 90 dias;
- o Coach Fundador mantém apenas o número histórico, ficando os benefícios inativos nos termos do programa.

### Confirmação

- Exigir autenticação recente.
- Exigir a introdução do texto `ELIMINAR CONTA`.
- Oferecer exportação antes de continuar.
- Registar versão do aviso, data, utilizador, IP reduzido ou pseudonimizado e confirmação.
- Enviar confirmação para o email da conta.

### Estados recomendados

- `requested`: pedido recebido;
- `cooling_off`: período de segurança de 7 dias;
- `processing`: acessos bloqueados e eliminação em curso;
- `completed`: dados ativos eliminados ou anonimizados;
- `cancelled`: pedido retirado antes do processamento;
- `failed`: intervenção administrativa necessária.

### Sequência técnica

1. Validar o utilizador através de Supabase Auth no servidor.
2. Criar o pedido numa tabela privada, protegida por RLS e acessível apenas ao titular e ao serviço administrativo necessário.
3. Marcar a conta como `pending_deletion`, impedindo novas cobranças e alterações destrutivas concorrentes.
4. Agendar o cancelamento da renovação da Stripe para o fim do período pago.
5. Terminado o período aplicável, revogar sessões e bloquear o acesso.
6. Eliminar ou anonimizar dados por ordem de dependências, preservando apenas registos legalmente exigidos.
7. Remover objetos do Storage, incluindo fotografias e exportações.
8. Eliminar a identidade de Supabase Auth apenas depois de concluída a limpeza das tabelas.
9. Enviar confirmação e guardar um registo mínimo e separado da execução do pedido.

## Retenção após encerramento

- Conta e dados operacionais: eliminação até 30 dias após o pedido ou encerramento.
- Backups: eliminação progressiva até 90 dias.
- Faturação e documentos fiscais: 10 anos civis subsequentes.
- Leads sem conversão: 12 meses após o último contacto.
- Candidaturas incompletas: 6 meses após a última interação.
- Registos de consentimento: enquanto necessários para comprovação e obrigações legais.
- Dados irreversivelmente anonimizados: sem prazo de conservação pessoal.

## Segurança e Supabase

- Não executar eliminação administrativa diretamente a partir do browser.
- Nunca expor a chave `service_role` ao cliente.
- Aplicar RLS com predicado de titularidade a pedidos e exportações.
- Não usar `user_metadata` como autorização.
- Funções privilegiadas devem permanecer fora de schemas expostos, validar `auth.uid()` e ter permissões mínimas.
- Testar a eliminação num projeto de staging com dados artificiais antes de ativar o fluxo em produção.
- Produzir um relatório de tabelas afetadas e validar que não ficam referências órfãs.

## Decisões que exigem validação antes da implementação

- Confirmar se o período de segurança de 7 dias deve existir para todos os pedidos.
- Decidir se o coach pode pedir eliminação imediata durante um período pago.
- Mapear todas as tabelas Supabase e separar dados fiscais de dados operacionais.
- Confirmar como serão comunicadas exportações superiores ao limite de tamanho definido.
- Definir quem recebe e resolve pedidos com estado `failed` através de `nlock@nlock.pt`.
