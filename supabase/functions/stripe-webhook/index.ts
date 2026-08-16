import Stripe from "npm:stripe@22.5.0";
import { createClient } from "npm:@supabase/supabase-js@2.57.4";

const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") ?? "");
const cryptoProvider = Stripe.createSubtleCryptoProvider();
const SUPABASE_URL = Deno.env.get("SUPABASE_URL") ?? "";
const SUPABASE_SERVICE_ROLE_KEY =
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ??
  Deno.env.get("APEX_SUPABASE_SERVICE_ROLE_KEY") ??
  "";
const STRIPE_WEBHOOK_SIGNING_SECRET =
  Deno.env.get("STRIPE_WEBHOOK_SIGNING_SECRET") ??
  Deno.env.get("STRIPE_WEBHOOK_SECRET") ??
  "";

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

function mapStatus(status: Stripe.Subscription.Status) {
  if (status === "trialing") return "trialing";
  if (status === "active") return "active";
  if (status === "canceled") return "canceled";
  if (status === "incomplete_expired") return "expired";
  return "past_due";
}

function normalizeCategory(value?: string | null) {
  if (value === "nlock_founder_annual" || value === "apex_coach_founder") {
    return "nlock_founder_annual";
  }
  if (value === "nlock_coach_annual") return "nlock_coach_annual";
  if (value === "nlock_coach_monthly") return "nlock_coach_monthly";
  return "nlock_coach_monthly";
}

function planFor(category: string) {
  return category === "nlock_coach_monthly" ? "monthly" : "yearly";
}

function iso(seconds?: number | null) {
  return seconds ? new Date(seconds * 1000).toISOString() : null;
}

async function ensureFounderApplication(
  admin: ReturnType<typeof createClient>,
  coachId: string,
  category: string,
) {
  if (category !== "nlock_founder_annual") return;

  const { data: authResult, error: authError } = await admin.auth.admin.getUserById(coachId);
  if (authError || !authResult.user?.email) {
    throw authError ?? new Error("Founder auth user has no email.");
  }

  const user = authResult.user;
  const email = user.email.toLowerCase();
  const fullName = String(user.user_metadata?.full_name || "Coach").trim();
  const { data: existing } = await admin
    .from("coach_applications")
    .select("metadata")
    .eq("email", email)
    .maybeSingle();

  const metadata = {
    ...(existing?.metadata || {}),
    access_tier: "founder",
    subscription_category: category,
    registration_mode: "subscription",
    selected_plan: "annual",
    founder_access_requested: true,
    founder_profile_status: existing?.metadata?.founder_profile_status || "required",
    founder_profile_onboarding_required: true,
    stripe_payment_completed: true,
    stripe_payment_completed_at: new Date().toISOString(),
  };

  const { error } = await admin.from("coach_applications").upsert({
    auth_user_id: coachId,
    full_name: fullName,
    email,
    coaching_focus: "",
    locale: String(user.user_metadata?.locale || "pt"),
    source: "nlock-stripe-checkout",
    access_tier: "founder",
    subscription_category: category,
    status: "new",
    metadata,
    updated_at: new Date().toISOString(),
  }, { onConflict: "email" });
  if (error) throw error;
}

async function syncSubscription(
  admin: ReturnType<typeof createClient>,
  subscription: Stripe.Subscription,
  checkoutSessionId?: string | null,
) {
  const metadata = subscription.metadata || {};
  const coachId = metadata.coach_id || metadata.nlock_user_id;
  if (!coachId) throw new Error("Stripe subscription is missing coach_id.");

  const category = normalizeCategory(metadata.subscription_category);
  const item = subscription.items.data[0];
  const periodStart =
    (item as Stripe.SubscriptionItem & { current_period_start?: number }).current_period_start ??
    (subscription as Stripe.Subscription & { current_period_start?: number }).current_period_start;
  const periodEnd =
    (item as Stripe.SubscriptionItem & { current_period_end?: number }).current_period_end ??
    (subscription as Stripe.Subscription & { current_period_end?: number }).current_period_end;
  const paymentMethod =
    typeof subscription.default_payment_method === "string"
      ? null
      : subscription.default_payment_method;
  const stripeCustomerId =
    typeof subscription.customer === "string"
      ? subscription.customer
      : subscription.customer.id;

  const row = {
    coach_id: coachId,
    status: mapStatus(subscription.status),
    plan: planFor(category),
    trial_ends_at: iso(subscription.trial_end),
    current_period_starts_at: iso(periodStart),
    current_period_ends_at: iso(periodEnd),
    provider: "stripe",
    provider_customer_id: stripeCustomerId,
    provider_subscription_id: subscription.id,
    billing_provider: "stripe",
    subscription_category: category,
    stripe_customer_id: stripeCustomerId,
    stripe_subscription_id: subscription.id,
    stripe_price_id: item?.price?.id || null,
    stripe_discount_id:
      (subscription as Stripe.Subscription & { discount?: { coupon?: { id?: string } } }).discount
        ?.coupon?.id || null,
    payment_method_type: paymentMethod?.type || null,
    payment_method_last4:
      paymentMethod?.type === "card"
        ? paymentMethod.card?.last4 || null
        : paymentMethod?.type === "sepa_debit"
          ? paymentMethod.sepa_debit?.last4 || null
          : null,
    stripe_checkout_session_id: checkoutSessionId || null,
    cancel_at_period_end: Boolean(subscription.cancel_at_period_end),
    updated_at: new Date().toISOString(),
  };

  const byStripe = await admin
    .from("subscriptions")
    .update(row)
    .eq("stripe_subscription_id", subscription.id)
    .select("id")
    .maybeSingle();
  if (byStripe.error) throw byStripe.error;
  if (byStripe.data) {
    await ensureFounderApplication(admin, coachId, category);
    return;
  }

  const existing = await admin
    .from("subscriptions")
    .select("id")
    .eq("coach_id", coachId)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();
  if (existing.error) throw existing.error;

  const write = existing.data
    ? await admin.from("subscriptions").update(row).eq("id", existing.data.id)
    : await admin.from("subscriptions").insert(row);
  if (write.error) throw write.error;
  await ensureFounderApplication(admin, coachId, category);
}

Deno.serve(async (request) => {
  if (request.method !== "POST") return json({ ok: false, error: "method_not_allowed" }, 405);
  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY || !STRIPE_WEBHOOK_SIGNING_SECRET) {
    return json({ ok: false, error: "webhook_not_configured" }, 503);
  }

  const signature = request.headers.get("stripe-signature");
  if (!signature) return json({ ok: false, error: "missing_signature" }, 400);

  let processingStage = "signature_verification";
  try {
    const event = await stripe.webhooks.constructEventAsync(
      await request.text(),
      signature,
      STRIPE_WEBHOOK_SIGNING_SECRET,
      undefined,
      cryptoProvider,
    );
    const admin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
      auth: { persistSession: false, autoRefreshToken: false },
    });

    if (event.type === "checkout.session.completed") {
      processingStage = "checkout_subscription_retrieve";
      const session = event.data.object as Stripe.Checkout.Session;
      const subscriptionId =
        typeof session.subscription === "string"
          ? session.subscription
          : session.subscription?.id;
      if (subscriptionId) {
        const subscription = await stripe.subscriptions.retrieve(subscriptionId, {
          expand: ["default_payment_method"],
        });
        processingStage = "checkout_subscription_sync";
        await syncSubscription(admin, subscription, session.id);
      }
    } else if (
      event.type === "customer.subscription.created" ||
      event.type === "customer.subscription.updated" ||
      event.type === "customer.subscription.deleted"
    ) {
      processingStage = "subscription_event_sync";
      await syncSubscription(admin, event.data.object as Stripe.Subscription);
    } else if (event.type === "invoice.paid" || event.type === "invoice.payment_failed") {
      processingStage = "invoice_status_sync";
      const invoice = event.data.object as Stripe.Invoice;
      const parent = invoice.parent?.subscription_details?.subscription;
      const subscriptionId = typeof parent === "string" ? parent : parent?.id;
      if (subscriptionId) {
        const { error } = await admin
          .from("subscriptions")
          .update({ status: event.type === "invoice.paid" ? "active" : "past_due" })
          .eq("stripe_subscription_id", subscriptionId);
        if (error) throw error;
      }
    }

    return json({ received: true });
  } catch (error) {
    console.error("Stripe webhook failed", error);
    return json({ ok: false, error: "webhook_processing_failed", stage: processingStage }, 400);
  }
});
