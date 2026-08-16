import { NextResponse } from "next/server";
import Stripe from "stripe";

const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY || "";
const PRICE_IDS = {
  monthly: process.env.STRIPE_PRICE_MONTHLY || "",
  annual: process.env.STRIPE_PRICE_ANNUAL || "",
  founder: process.env.STRIPE_PRICE_FOUNDER || "",
};

function normalizePlan(value) {
  return value === "founder" || value === "annual" ? value : "monthly";
}

function configured(plan) {
  return Boolean(STRIPE_SECRET_KEY && PRICE_IDS[plan]);
}

function stripeMetadata(plan, payload) {
  const yearly = plan === "annual" || plan === "founder";
  const subscriptionCategory = plan === "founder"
    ? "nlock_founder_annual"
    : yearly
      ? "nlock_coach_annual"
      : "nlock_coach_monthly";

  return {
    plan: yearly ? "yearly" : "monthly",
    nlock_plan: plan,
    subscription_category: subscriptionCategory,
    access_tier: plan === "founder" ? "founder" : "coach",
    full_name: String(payload.fullName || "Coach").trim().slice(0, 120),
    registration_mode: "subscription",
    accepted_legal_version: "2026-04",
  };
}

export async function GET(request) {
  const plan = normalizePlan(new URL(request.url).searchParams.get("plan"));
  return NextResponse.json({ ok: true, configured: configured(plan), plan });
}

export async function POST(request) {
  const payload = await request.json().catch(() => ({}));
  const plan = normalizePlan(payload.plan);
  if (!configured(plan)) {
    return NextResponse.json({ ok: false, error: "checkout_not_configured" }, { status: 503 });
  }
  const email = String(payload.email || "").trim().toLowerCase().slice(0, 254);
  if (!email) {
    return NextResponse.json({ ok: false, error: "missing_checkout_identity" }, { status: 400 });
  }
  const origin = new URL(request.url).origin;
  const metadata = stripeMetadata(plan, payload);

  try {
    const stripe = new Stripe(STRIPE_SECRET_KEY);
    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      line_items: [{ price: PRICE_IDS[plan], quantity: 1 }],
      customer_email: email,
      metadata,
      subscription_data: { metadata },
      allow_promotion_codes: true,
      billing_address_collection: "auto",
      success_url: `${origin}/signup/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/signup?mode=subscription${plan === "founder" ? "&founder=1" : ""}&payment=cancelled`,
    });

    return NextResponse.json({ ok: true, url: session.url });
  } catch (error) {
    console.error("stripe checkout creation failed", error);
    return NextResponse.json({ ok: false, error: "checkout_creation_failed" }, { status: 502 });
  }
}
