import { NextResponse } from "next/server";

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
  const userId = String(payload.userId || "").trim().slice(0, 80);
  const origin = new URL(request.url).origin;

  const params = new URLSearchParams();
  params.set("mode", "subscription");
  params.set("line_items[0][price]", PRICE_IDS[plan]);
  params.set("line_items[0][quantity]", "1");
  params.set("customer_email", email);
  params.set("client_reference_id", userId);
  params.set("metadata[nlock_user_id]", userId);
  params.set("metadata[nlock_plan]", plan);
  params.set("allow_promotion_codes", "true");
  params.set("billing_address_collection", "auto");
  params.set("success_url", `${origin}/signup?payment=success&session_id={CHECKOUT_SESSION_ID}`);
  params.set("cancel_url", `${origin}/signup?mode=subscription${plan === "founder" ? "&founder=1" : ""}&payment=cancelled`);

  const response = await fetch("https://api.stripe.com/v1/checkout/sessions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${STRIPE_SECRET_KEY}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: params.toString(),
  });
  const data = await response.json().catch(() => ({}));

  if (!response.ok || !data?.url) {
    console.error("stripe checkout creation failed", data);
    return NextResponse.json({ ok: false, error: "checkout_creation_failed" }, { status: 502 });
  }

  return NextResponse.json({ ok: true, url: data.url });
}
