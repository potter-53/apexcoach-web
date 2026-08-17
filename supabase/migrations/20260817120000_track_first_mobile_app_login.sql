create table if not exists public.coach_app_activations (
  coach_id uuid primary key references auth.users(id) on delete cascade,
  first_app_login_at timestamptz not null default now(),
  last_app_login_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.coach_app_activations enable row level security;

revoke all on table public.coach_app_activations from anon;
grant select, insert, update on table public.coach_app_activations to authenticated;
grant all on table public.coach_app_activations to service_role;

drop policy if exists "Coaches can read own app activation" on public.coach_app_activations;
create policy "Coaches can read own app activation"
on public.coach_app_activations
for select
to authenticated
using ((select auth.uid()) = coach_id);

drop policy if exists "Coaches can create own app activation" on public.coach_app_activations;
create policy "Coaches can create own app activation"
on public.coach_app_activations
for insert
to authenticated
with check ((select auth.uid()) = coach_id);

drop policy if exists "Coaches can update own app activation" on public.coach_app_activations;
create policy "Coaches can update own app activation"
on public.coach_app_activations
for update
to authenticated
using ((select auth.uid()) = coach_id)
with check ((select auth.uid()) = coach_id);
