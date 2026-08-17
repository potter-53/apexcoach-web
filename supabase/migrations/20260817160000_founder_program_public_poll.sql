create table if not exists public.founder_program_poll_votes (
  id bigint generated always as identity primary key,
  poll_key text not null check (char_length(poll_key) between 1 and 100),
  option_key text not null check (char_length(option_key) between 1 and 100),
  voter_token_hash text not null check (char_length(voter_token_hash) = 64),
  created_at timestamptz not null default now(),
  unique (poll_key, voter_token_hash)
);

create index if not exists founder_program_poll_votes_result_idx
  on public.founder_program_poll_votes (poll_key, option_key);

alter table public.founder_program_poll_votes enable row level security;

revoke all on table public.founder_program_poll_votes from anon, authenticated;
grant select, insert on table public.founder_program_poll_votes to service_role;
grant usage, select on sequence public.founder_program_poll_votes_id_seq to service_role;

comment on table public.founder_program_poll_votes is
  'Anonymous public Founder programme poll. Stores only a hash of the soft cookie identifier.';
