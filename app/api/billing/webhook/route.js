import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";
import Stripe from "stripe";

const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY || "";
const STRIPE_WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET || "";
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const SUPABASE_SERVICE_ROLE_KEY =
  process.env.APEX_SUPABASE_SERVICE_ROLE_KEY ||
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.SUPABASE_SERVICE_KEY ||
  "";

export const dynamic = "force-dynamic";

function appStatus(status) {
  if (status === "trialing") return "trialing";
  if (status === "active") return "active";
  if (status === "canceled") return "canceled";
  if (status === "incomplete_expired") return "expired";
  return "past_due";
}

function appPlan(nlockPlan) {
  return nlockPlan === "monthly" ? "monthly" : "yearly";
}

function category(nlockPlan) {
  if (nlockPlan === "founder") return "nlock_founder_annual";
  return nlockPlan === "monthly" ? "nlock_coach_monthly" : "nlock_coach_annual";
}

function toIso(unixSeconds) {
  return unixSeconds ? new Date(unixSeconds * 1000).toISOString() : null;
}

async function upsertSubscription({ stripe, supabase, subscriptionId, subscriptionObject, coachId, checkoutSessionId = null }) {
  const subscription = subscriptionObject || (await stripe.subscriptions.retrieve(subscriptionId));
  const nlockPlan = subscription.metadata?.nlock_plan || "annual";
  const resolvedCoachId = coachId || subscription.metadata?.nlock_user_id;
  if (!resolvedCoachId) throw new Error("Missing NLOCK coach id in Stripe metadata.");

  const priceId = subscription.items?.data?.[0]?.price?.id || null;
  const row = {
    coach_id: resolvedCoachId,
    status: appStatus(subscription.status),
    plan: appPlan(nlockPlan),
    provider: "stripe",
    billing_provider: "stripe",
    provider_customer_id: String(subscription.customer || "") || null,
    provider_subscription_id: subscription.id,
    stripe_customer_id: String(subscription.customer || "") || null,
    stripe_subscription_id: subscription.id,
    stripe_price_id: priceId,
    stripe_checkout_session_id: checkoutSessionId,
    subscription_category: category(nlockPlan),
    current_period_starts_at: toIso(subscription.current_period_start),
    current_period_ends_at: toIso(subscription.current_period_end),
    cancel_at_period_end: Boolean(subscription.cancel_at_period_end),
    updated_at: new Date().toISOString(),
  };

  const { error } = await supabase
    .from("subscriptions")
    .upsert(row, { onConflict: "stripe_subscription_id" });
  if (error) throw error;
}

export async function POST(request) {
  if (!STRIPE_SECRET_KEY || !STRIPE_WEBHOOK_SECRET || !SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    return NextResponse.json({ ok: false, error: "webhook_not_configured" }, { status: 503 });
  }

  const signature = request.headers.get("stripe-signature");
  if (!signature) return NextResponse.json({ ok: false, error: "missing_signature" }, { status: 400 });

  const stripe = new Stripe(STRIPE_SECRET_KEY);
  const rawBody = await request.text();
  let event;
  try {
    event = stripe.webhooks.constructEvent(rawBody, signature, STRIPE_WEBHOOK_SECRET);
  } catch (error) {
    console.error("invalid Stripe webhook signature", error);
    return NextResponse.json({ ok: false, error: "invalid_signature" }, { status: 400 });
  }

  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  try {
    if (event.type === "checkout.session.completed") {
      const session = event.data.object;
      if (session.mode === "subscription" && session.subscription) {
        await upsertSubscription({
          stripe,
          supabase,
          subscriptionId: String(session.subscription),
          coachId: session.client_reference_id || session.metadata?.nlock_user_id,
          checkoutSessionId: session.id,
        });
      }
    } else if (event.type === "customer.subscription.updated" || event.type === "customer.subscription.deleted") {
      const subscription = event.data.object;
      await upsertSubscription({
        stripe,
        supabase,
        subscriptionId: subscription.id,
        subscriptionObject: subscription,
        coachId: subscription.metadata?.nlock_user_id,
      });
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Stripe webhook processing failed", error);
    return NextResponse.json({ ok: false, error: "webhook_processing_failed" }, { status: 500 });
  }
}
