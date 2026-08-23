import { NextResponse } from "next/server";
import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";

import { verifyClaimToken } from "../../../../src/lib/stripe-claim-token";
import { PayloadTooLargeError, readJsonBody } from "../../../../src/lib/http-json";

const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY || "";
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.APEX_SUPABASE_URL || "";
const SUPABASE_SERVICE_ROLE_KEY =
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.APEX_SUPABASE_SERVICE_ROLE_KEY || "";

function normalizeCategory(value) {
  if (value === "nlock_founder_annual" || value === "apex_coach_founder") return "nlock_founder_annual";
  if (value === "nlock_coach_annual") return "nlock_coach_annual";
  return "nlock_coach_monthly";
}

function mapStatus(status) {
  if (["trialing", "active", "canceled"].includes(status)) return status;
  if (status === "incomplete_expired") return "expired";
  return "past_due";
}

function iso(seconds) {
  return seconds ? new Date(seconds * 1000).toISOString() : null;
}

function validClaimToken(session, claimToken) {
  const expectedHash = String(session.metadata?.claim_token_hash || "");
  return verifyClaimToken(expectedHash, claimToken);
}

async function persistSubscription(admin, subscription, sessionId, userId, paidAt) {
  const category = normalizeCategory(subscription.metadata?.subscription_category);
  const item = subscription.items.data[0];
  const customerId = typeof subscription.customer === "string"
    ? subscription.customer
    : subscription.customer.id;
  const periodStart = item?.current_period_start ?? subscription.current_period_start;
  const periodEnd = item?.current_period_end ?? subscription.current_period_end;

  const row = {
    coach_id: userId,
    status: mapStatus(subscription.status),
    plan: category === "nlock_coach_monthly" ? "monthly" : "yearly",
    trial_ends_at: iso(subscription.trial_end),
    current_period_starts_at: iso(periodStart),
    current_period_ends_at: iso(periodEnd),
    provider: "stripe",
    provider_customer_id: customerId,
    provider_subscription_id: subscription.id,
    billing_provider: "stripe",
    subscription_category: category,
    stripe_customer_id: customerId,
    stripe_subscription_id: subscription.id,
    stripe_price_id: item?.price?.id || null,
    last_payment_at: paidAt,
    stripe_checkout_session_id: sessionId,
    cancel_at_period_end: Boolean(subscription.cancel_at_period_end),
    updated_at: new Date().toISOString(),
  };

  const byStripe = await admin
    .from("subscriptions")
    .update(row)
    .eq("stripe_subscription_id", subscription.id)
    .select("id, coach_id, status, subscription_category")
    .maybeSingle();
  if (byStripe.error) throw byStripe.error;
  if (byStripe.data) return byStripe.data;

  const existing = await admin
    .from("subscriptions")
    .select("id")
    .eq("coach_id", userId)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();
  if (existing.error) throw existing.error;

  const write = existing.data
    ? await admin.from("subscriptions").update(row).eq("id", existing.data.id).select("id, coach_id, status, subscription_category").single()
    : await admin.from("subscriptions").insert(row).select("id, coach_id, status, subscription_category").single();
  if (write.error) throw write.error;
  return write.data;
}

export async function POST(request) {
  if (!STRIPE_SECRET_KEY || !SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    return NextResponse.json({ ok: false, error: "claim_not_configured" }, { status: 503 });
  }

  let payload;
  try {
    payload = await readJsonBody(request, 4 * 1024);
  } catch (error) {
    if (error instanceof PayloadTooLargeError) {
      return NextResponse.json({ ok: false, error: "payload_too_large" }, { status: 413 });
    }
    throw error;
  }
  const sessionId = String(payload.sessionId || "");
  const userId = String(payload.userId || "");
  const claimToken = String(payload.claimToken || "");
  if (!sessionId.startsWith("cs_") || !userId || claimToken.length < 32 || claimToken.length > 128) {
    return NextResponse.json({ ok: false, error: "invalid_claim" }, { status: 400 });
  }

  try {
    const stripe = new Stripe(STRIPE_SECRET_KEY);
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    if (!validClaimToken(session, claimToken)) {
      return NextResponse.json({ ok: false, error: "invalid_claim_token" }, { status: 403 });
    }
    if (session.status !== "complete" || session.payment_status !== "paid") {
      return NextResponse.json({ ok: false, error: "payment_not_confirmed" }, { status: 409 });
    }

    const admin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
    let authResult = null;
    let authError = null;
    for (let attempt = 0; attempt < 4; attempt += 1) {
      const result = await admin.auth.admin.getUserById(userId);
      authResult = result.data;
      authError = result.error;
      if (authResult?.user?.email) break;
      await new Promise((resolve) => setTimeout(resolve, 400));
    }
    if (authError || !authResult.user?.email) throw authError || new Error("User not found");

    const paidEmail = String(session.customer_details?.email || session.customer_email || "").toLowerCase();
    if (!paidEmail || authResult.user.email.toLowerCase() !== paidEmail) {
      return NextResponse.json({ ok: false, error: "email_mismatch" }, { status: 403 });
    }

    const subscriptionId = typeof session.subscription === "string" ? session.subscription : session.subscription?.id;
    if (!subscriptionId) throw new Error("Checkout has no subscription");
    const identity = { coach_id: userId, nlock_user_id: userId };
    await stripe.checkout.sessions.update(session.id, { metadata: { ...session.metadata, ...identity } });
    const subscription = await stripe.subscriptions.retrieve(subscriptionId);
    await stripe.subscriptions.update(subscriptionId, { metadata: { ...subscription.metadata, ...identity } });
    const claimedSubscription = await stripe.subscriptions.retrieve(subscriptionId);
    const storedSubscription = await persistSubscription(
      admin,
      claimedSubscription,
      session.id,
      userId,
      iso(session.created),
    );

    return NextResponse.json({ ok: true, subscription: storedSubscription });
  } catch (error) {
    console.error("Stripe subscription claim failed", error);
    return NextResponse.json({ ok: false, error: "claim_failed" }, { status: 502 });
  }
}
