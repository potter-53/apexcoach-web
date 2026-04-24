# Landing Conversion Checklist

## Goal

One clear path from social traffic to active coach workspace:

`social -> landing -> signup/login -> /app -> first booking`

## Critical pages

- `/`
- `/signup`
- `/login`
- `/app`

## Tracking events implemented

- `landing_view`
- `landing_header_signup_click`
- `landing_header_login_click`
- `landing_mobile_menu_signup_click`
- `landing_mobile_menu_login_click`
- `landing_hero_signup_click`
- `landing_hero_login_click`
- `landing_modal_trial_login_click`
- `landing_modal_demo_click`
- `landing_signup_opened`
- `landing_signup_blocked`
- `landing_signup_success`
- `landing_signup_error`
- `landing_signup_back_click`
- `landing_signup_to_login_click`
- `landing_login_opened`
- `landing_login_blocked`
- `landing_login_success`
- `landing_login_error`
- `landing_login_back_click`
- `landing_login_demo_click`
- `landing_login_to_signup_click`

## Data quality checks

- Ensure `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` are set in production.
- Confirm analytics provider receives events from `window.dataLayer` or `window.gtag` or `window.plausible`.
- Validate event volume by route:
  - landing events fire on `/`
  - signup events fire on `/signup`
  - login events fire on `/login`

## Funnel health targets

- Landing to signup/login click-through rate.
- Signup completion rate.
- Login success rate.
- Login success to `/app` session start.
- First booking creation rate inside `/app`.

## Release gate

- `npm run build` passes.
- `npm run lint` passes.
- No mojibake text on `/signup` and `/login`.
- Manual test with one coach account from signup to `/app`.
