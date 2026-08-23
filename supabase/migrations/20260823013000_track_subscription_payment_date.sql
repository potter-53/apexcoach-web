alter table public.subscriptions
  add column if not exists last_payment_at timestamptz;

comment on column public.subscriptions.last_payment_at is
  'Timestamp do último pagamento confirmado pelo Stripe; não contém dados do método de pagamento.';
