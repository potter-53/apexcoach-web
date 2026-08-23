import { NextResponse } from "next/server";
import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";

import { createClaimToken } from "../../../../src/lib/stripe-claim-token";
import { PayloadTooLargeError, readJsonBody } from "../../../../src/lib/http-json";

const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY || "";
const APP_URL = process.env.APP_URL || process.env.NEXT_PUBLIC_APP_URL || "";
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.APEX_SUPABASE_URL || "";
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.APEX_SUPABASE_ANON_KEY || "";
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.APEX_SUPABASE_SERVICE_ROLE_KEY || "";
const FOUNDER_LIMIT = 50;
const PRICE_IDS = {
  monthly: process.env.STRIPE_PRICE_MONTHLY || "",
  annual: process.env.STRIPE_PRICE_ANNUAL || "",
  founder: process.env.STRIPE_PRICE_FOUNDER || "",
};

function normalizePlan(value) {
  return value === "founder" || value === "annual" ? value : "monthly";
}

function configured(plan) {
  return Boolean(
    STRIPE_SECRET_KEY &&
    PRICE_IDS[plan] &&
    (plan !== "founder" || (SUPABASE_URL && SUPABASE_SERVICE_ROLE_KEY)),
  );
}

async function founderAvailability() {
  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    return { available: false, remaining: 0, reason: "founder_check_unavailable" };
  }

  const admin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  const [{ count, error }, openSessions] = await Promise.all([
    admin
      .from("subscriptions")
      .select("id", { count: "exact", head: true })
      .in("subscription_category", ["nlock_founder_annual", "apex_coach_founder"]),
    new Stripe(STRIPE_SECRET_KEY).checkout.sessions.list({ status: "open", limit: 100 }),
  ]);
  if (error) throw error;
  const claimed = count || 0;
  const now = Math.floor(Date.now() / 1000);
  const reserved = openSessions.data.filter((session) =>
    session.metadata?.nlock_plan === "founder" && session.expires_at > now,
  ).length;
  const remaining = Math.max(0, FOUNDER_LIMIT - claimed - reserved);
  return {
    available: remaining > 0,
    remaining,
    reason: remaining > 0 ? null : "founder_sold_out",
  };
}

function normalizeReferralCode(value) {
  return String(value || "").trim().toUpperCase().replace(/[^A-Z0-9_-]/g, "").slice(0, 32);
}

function stripeMetadata(plan, payload) {
  const yearly = plan === "annual" || plan === "founder";
  const subscriptionCategory = plan === "founder"
    ? "nlock_founder_annual"
    : yearly
      ? "nlock_coach_annual"
      : "nlock_coach_monthly";

  const referralCode = normalizeReferralCode(payload.referralCode);
  return {
    plan: yearly ? "yearly" : "monthly",
    nlock_plan: plan,
    subscription_category: subscriptionCategory,
    access_tier: plan === "founder" ? "founder" : "coach",
    full_name: String(payload.fullName || "Coach").trim().slice(0, 120),
    registration_mode: "subscription",
    accepted_legal_version: "2026-04",
    ...(referralCode ? { referral_code: referralCode } : {}),
  };
}

export async function GET(request) {
  const plan = normalizePlan(new URL(request.url).searchParams.get("plan"));
  if (!configured(plan)) {
    return NextResponse.json({ ok: true, configured: false, plan });
  }
  if (plan !== "founder") {
    return NextResponse.json({ ok: true, configured: true, plan });
  }
  try {
    const availability = await founderAvailability();
    return NextResponse.json({ ok: true, configured: true, plan, ...availability });
  } catch (error) {
    console.error("founder availability lookup failed", error);
    return NextResponse.json({ ok: false, configured: false, plan, error: "founder_check_failed" }, { status: 503 });
  }
}

export async function POST(request) {
  let payload;
  try {
    payload = await readJsonBody(request, 8 * 1024);
  } catch (error) {
    if (error instanceof PayloadTooLargeError) {
      return NextResponse.json({ ok: false, error: "payload_too_large" }, { status: 413 });
    }
    throw error;
  }
  const plan = normalizePlan(payload.plan);
  if (!configured(plan)) {
    return NextResponse.json({ ok: false, error: "checkout_not_configured" }, { status: 503 });
  }
  if (plan === "founder") {
    try {
      const availability = await founderAvailability();
      if (!availability.available) {
        return NextResponse.json(
          { ok: false, error: availability.reason || "founder_sold_out", remaining: availability.remaining },
          { status: 409 },
        );
      }
    } catch (error) {
      console.error("founder availability lookup failed", error);
      return NextResponse.json({ ok: false, error: "founder_check_failed" }, { status: 503 });
    }
  }
  const email = String(payload.email || "").trim().toLowerCase().slice(0, 254);
  if (!email) {
    return NextResponse.json({ ok: false, error: "missing_checkout_identity" }, { status: 400 });
  }
  const origin = APP_URL ? new URL(APP_URL).origin : new URL(request.url).origin;
  const claim = createClaimToken();
  const metadata = { ...stripeMetadata(plan, payload), claim_token_hash: claim.hash };

  try {
    if (metadata.referral_code) {
      if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
        return NextResponse.json({ ok: false, error: "referral_validation_unavailable" }, { status: 503 });
      }
      const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
        auth: { persistSession: false, autoRefreshToken: false },
      });
      const { data: validReferral, error: referralError } = await supabase.rpc("validate_coach_referral_code", {
        p_code: metadata.referral_code,
      });
      if (referralError) throw referralError;
      if (validReferral !== true) {
        return NextResponse.json({ ok: false, error: "invalid_referral_code" }, { status: 400 });
      }
    }

    const stripe = new Stripe(STRIPE_SECRET_KEY);
    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      line_items: [{ price: PRICE_IDS[plan], quantity: 1 }],
      customer_email: email,
      metadata,
      subscription_data: { metadata },
      expires_at: Math.floor(Date.now() / 1000) + 30 * 60,
      allow_promotion_codes: true,
      billing_address_collection: "auto",
      success_url: `${origin}/signup/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/signup?mode=subscription${plan === "founder" ? "&founder=1" : ""}${metadata.referral_code ? `&ref=${encodeURIComponent(metadata.referral_code)}` : ""}&payment=cancelled`,
    });

    return NextResponse.json({ ok: true, url: session.url, claimToken: claim.token });
  } catch (error) {
    console.error("stripe checkout creation failed", error);
    return NextResponse.json({ ok: false, error: "checkout_creation_failed" }, { status: 502 });
  }
}
