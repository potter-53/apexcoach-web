create or replace function public.activate_coach_trial_after_email_confirmation(
  p_user_id uuid,
  p_confirmed_at timestamptz default timezone('utc', now())
)
returns void
language plpgsql
security definer
set search_path = public
as $function$
declare
  v_confirmation_time timestamptz := coalesce(p_confirmed_at, timezone('utc', now()));
  v_subscription_id uuid;
  v_trial_requested boolean := true;
begin
  if not exists (
    select 1
    from public.profiles
    where id = p_user_id
      and role::text = 'coach'
  ) then
    return;
  end if;

  select case
    when raw_user_meta_data ? 'trial_requested'
      then lower(coalesce(raw_user_meta_data->>'trial_requested', 'false')) = 'true'
    when raw_user_meta_data->>'registration_mode' = 'subscription'
      then false
    else true
  end
  into v_trial_requested
  from auth.users
  where id = p_user_id;

  if not coalesce(v_trial_requested, true) then
    return;
  end if;

  select id
  into v_subscription_id
  from public.subscriptions
  where coach_id = p_user_id
    and status = 'trialing'
    and plan = 'trial'
  order by created_at desc
  limit 1;

  if v_subscription_id is not null then
    update public.subscriptions
    set
      subscription_category = 'nlock_coach_trial',
      current_period_starts_at = v_confirmation_time,
      trial_ends_at = v_confirmation_time + interval '30 days',
      current_period_ends_at = v_confirmation_time + interval '30 days'
    where id = v_subscription_id;
    return;
  end if;

  if not exists (
    select 1
    from public.subscriptions
    where coach_id = p_user_id
  ) then
    insert into public.subscriptions (
      coach_id,
      status,
      plan,
      subscription_category,
      billing_provider,
      current_period_starts_at,
      trial_ends_at,
      current_period_ends_at,
      created_at
    )
    values (
      p_user_id,
      'trialing',
      'trial',
      'nlock_coach_trial',
      'nlock',
      v_confirmation_time,
      v_confirmation_time + interval '30 days',
      v_confirmation_time + interval '30 days',
      v_confirmation_time
    );
  end if;
end;
$function$;

revoke all on function public.activate_coach_trial_after_email_confirmation(uuid, timestamptz)
from public, anon, authenticated;
