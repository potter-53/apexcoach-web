create table if not exists public.account_deletion_requests (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete restrict,
  status text not null default 'cooling_off'
    check (status in ('cooling_off', 'cancelled', 'processing', 'completed', 'failed')),
  requested_at timestamptz not null default now(),
  cooling_off_until timestamptz not null default (now() + interval '7 days'),
  cancelled_at timestamptz,
  updated_at timestamptz not null default now(),
  confirmation_version text not null default 'account-deletion-2026-08-25-v1',
  request_source text not null default 'coach_workspace',
  constraint account_deletion_cancelled_at_check check (
    (status = 'cancelled' and cancelled_at is not null)
    or (status <> 'cancelled' and cancelled_at is null)
  )
);

create unique index if not exists account_deletion_one_open_request_per_user
  on public.account_deletion_requests (user_id)
  where status in ('cooling_off', 'processing');

create index if not exists account_deletion_requests_user_requested_idx
  on public.account_deletion_requests (user_id, requested_at desc);

alter table public.account_deletion_requests enable row level security;

revoke all on table public.account_deletion_requests from anon, authenticated;
grant select, insert on table public.account_deletion_requests to authenticated;
grant update (status, cancelled_at, updated_at) on table public.account_deletion_requests to authenticated;
grant all on table public.account_deletion_requests to service_role;

drop policy if exists "Coaches can read own deletion requests" on public.account_deletion_requests;
create policy "Coaches can read own deletion requests"
  on public.account_deletion_requests
  for select
  to authenticated
  using ((select auth.uid()) is not null and (select auth.uid()) = user_id);

drop policy if exists "Coaches can create own deletion requests" on public.account_deletion_requests;
create policy "Coaches can create own deletion requests"
  on public.account_deletion_requests
  for insert
  to authenticated
  with check (
    (select auth.uid()) is not null
    and (select auth.uid()) = user_id
    and status = 'cooling_off'
    and cancelled_at is null
    and cooling_off_until >= now() + interval '6 days 23 hours'
    and cooling_off_until <= now() + interval '7 days 1 hour'
  );

drop policy if exists "Coaches can cancel own deletion requests" on public.account_deletion_requests;
create policy "Coaches can cancel own deletion requests"
  on public.account_deletion_requests
  for update
  to authenticated
  using (
    (select auth.uid()) is not null
    and (select auth.uid()) = user_id
    and status = 'cooling_off'
    and cooling_off_until > now()
  )
  with check (
    (select auth.uid()) is not null
    and (select auth.uid()) = user_id
    and status = 'cancelled'
    and cancelled_at is not null
  );

comment on table public.account_deletion_requests is
  'User-initiated account deletion requests. No subscription or account status creates rows automatically.';
