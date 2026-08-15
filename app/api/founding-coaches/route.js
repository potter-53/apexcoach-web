import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
const SUPABASE_SERVICE_ROLE_KEY =
  process.env.APEX_SUPABASE_SERVICE_ROLE_KEY ||
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.SUPABASE_SERVICE_KEY ||
  "";
const SUPABASE_READ_KEY = SUPABASE_SERVICE_ROLE_KEY || SUPABASE_ANON_KEY;

const FOUNDER_SUBSCRIPTION_CATEGORY = "apex_coach_founder";
const FOUNDER_APPLICATION_CATEGORIES = [FOUNDER_SUBSCRIPTION_CATEGORY, "nlock_founder_annual"];
const ACTIVE_SUBSCRIPTION_STATUSES = ["active", "trialing"];
const PIN_POSITIONS = [
  { x: "47.5%", y: "28%" },
  { x: "48.2%", y: "29.5%" },
  { x: "46.8%", y: "30.5%" },
  { x: "48.8%", y: "27.2%" },
  { x: "47.1%", y: "31.5%" },
  { x: "49.2%", y: "30%" },
  { x: "46.3%", y: "28.8%" },
  { x: "48%", y: "32%" },
];
const PORTUGAL_COORDINATES = [
  { latitude: 38.72, longitude: -9.14 },
  { latitude: 41.15, longitude: -8.61 },
  { latitude: 40.21, longitude: -8.43 },
  { latitude: 37.02, longitude: -7.93 },
  { latitude: 32.67, longitude: -16.92 },
  { latitude: 37.74, longitude: -25.67 },
  { latitude: 39.74, longitude: -8.81 },
  { latitude: 38.57, longitude: -7.91 },
];

function text(value, fallback = "") {
  return String(value || fallback).trim();
}

function isPublicConsent(metadata) {
  return (
    metadata?.founding_public_profile_consent === true ||
    metadata?.foundingPublicProfileConsent === true ||
    metadata?.founding_public_profile_consent === "true" ||
    metadata?.foundingPublicProfileConsent === "true"
  );
}

function founderNumber(metadata, index) {
  const raw = text(metadata?.founder_number || metadata?.founding_number || metadata?.founderNumber);
  if (raw) return raw.startsWith("#") ? raw : `#${raw}`;
  return `#${String(index + 1).padStart(2, "0")}`;
}

function publicProfileFromApplication(application, index, clientsCount) {
  const metadata = application.metadata || {};
  const position = PIN_POSITIONS[index % PIN_POSITIONS.length];
  const coordinates = PORTUGAL_COORDINATES[index % PORTUGAL_COORDINATES.length];

  return {
    number: founderNumber(metadata, index),
    name: text(metadata.public_name || metadata.display_name || application.full_name, "Founder Coach"),
    city: text(metadata.public_location || metadata.location || metadata.city, "Portugal"),
    country: text(metadata.public_country || metadata.country, "Portugal"),
    specialty: text(metadata.public_specialty || metadata.specialty || metadata.coaching_specialty, "Coach"),
    workplace: text(metadata.public_workplace || metadata.workplace || metadata.gym_name),
    profileUrl: text(metadata.public_profile_url || metadata.profile_url || metadata.website_url),
    bio: text(metadata.public_bio || metadata.bio),
    latitude: Number(metadata.public_latitude ?? metadata.latitude ?? coordinates.latitude),
    longitude: Number(metadata.public_longitude ?? metadata.longitude ?? coordinates.longitude),
    activeSince: application.created_at
      ? new Intl.DateTimeFormat("en-GB", { month: "short", year: "numeric" }).format(new Date(application.created_at))
      : "Active",
    clients: Number.isFinite(clientsCount) ? String(clientsCount) : text(metadata.active_clients, "-"),
    quote: text(
      metadata.public_testimonial || metadata.testimonial,
      "Building the first chapter of APEX COACH.",
    ),
    photoUrl: text(metadata.public_photo_url || metadata.photo_url),
    x: text(metadata.map_x, position.x),
    y: text(metadata.map_y, position.y),
  };
}

async function publicProfileFromRpc(supabase, row, index) {
  const position = PIN_POSITIONS[index % PIN_POSITIONS.length];
  const fallbackCoordinates = PORTUGAL_COORDINATES[index % PORTUGAL_COORDINATES.length];
  const isCascais = text(row.public_location).toLowerCase() === "cascais";
  const coordinates = isCascais
    ? { latitude: 38.7, longitude: -9.42 }
    : fallbackCoordinates;

  let photoUrl = "";
  if (text(row.photo_storage_path)) {
    const { data } = await supabase.storage
      .from("student-photos")
      .createSignedUrl(row.photo_storage_path, 60 * 60);
    photoUrl = text(data?.signedUrl);
  }

  return {
    number: founderNumber({ founder_number: row.founder_number }, index),
    name: text(row.public_name, "Founder Coach"),
    city: text(row.public_location, "Portugal"),
    country: text(row.public_country, "Portugal"),
    specialty: text(row.public_specialty, "Coach"),
    workplace: text(row.public_workplace),
    profileUrl: text(row.public_profile_url),
    latitude: coordinates.latitude,
    longitude: coordinates.longitude,
    activeSince: row.active_since
      ? new Intl.DateTimeFormat("en-GB", { month: "short", year: "numeric" }).format(
          new Date(`${row.active_since}T00:00:00Z`),
        )
      : "Active",
    clients: "-",
    bio: text(row.public_bio),
    quote: text(row.public_testimonial),
    photoUrl,
    x: position.x,
    y: position.y,
  };
}

async function countActiveClients(supabase, coachId) {
  if (!coachId) return null;

  const activeCount = await supabase
    .from("students")
    .select("id", { count: "exact", head: true })
    .eq("coach_id", coachId)
    .eq("is_active", true);

  if (!activeCount.error) return activeCount.count ?? 0;

  const fallbackCount = await supabase
    .from("students")
    .select("id", { count: "exact", head: true })
    .eq("coach_id", coachId);

  if (!fallbackCount.error) return fallbackCount.count ?? 0;
  return null;
}

export async function GET() {
  if (!SUPABASE_URL || !SUPABASE_READ_KEY) {
    return NextResponse.json({ coaches: [] });
  }

  try {
    const supabase = createClient(SUPABASE_URL, SUPABASE_READ_KEY, {
      auth: { persistSession: false, autoRefreshToken: false },
    });

    const { data: publicFounders, error: publicFoundersError } = await supabase.rpc(
      "get_public_founding_coaches",
    );

    if (!publicFoundersError) {
      return NextResponse.json({
        coaches: await Promise.all(
          (publicFounders || [])
            .slice(0, 12)
            .map((row, index) => publicProfileFromRpc(supabase, row, index)),
        ),
      });
    }

    if (!SUPABASE_SERVICE_ROLE_KEY) throw publicFoundersError;

    const { data: applications, error: applicationError } = await supabase
      .from("coach_applications")
      .select("auth_user_id, full_name, status, subscription_category, access_tier, metadata, created_at")
      .in("subscription_category", FOUNDER_APPLICATION_CATEGORIES)
      .eq("access_tier", "founder")
      .order("created_at", { ascending: true })
      .limit(50);

    if (applicationError) throw applicationError;

    const consentedApplications = (applications || []).filter((application) =>
      isPublicConsent(application.metadata),
    );
    const coachIds = consentedApplications
      .map((application) => application.auth_user_id)
      .filter(Boolean);

    if (!coachIds.length) {
      return NextResponse.json({ coaches: [] });
    }

    const { data: subscriptions, error: subscriptionError } = await supabase
      .from("subscriptions")
      .select("coach_id, status, subscription_category")
      .in("coach_id", coachIds)
      .eq("subscription_category", FOUNDER_SUBSCRIPTION_CATEGORY)
      .in("status", ACTIVE_SUBSCRIPTION_STATUSES);

    if (subscriptionError) throw subscriptionError;

    const activeCoachIds = new Set((subscriptions || []).map((subscription) => subscription.coach_id));
    const activeApplications = consentedApplications.filter((application) =>
      activeCoachIds.has(application.auth_user_id),
    );

    const coaches = [];
    for (const application of activeApplications.slice(0, 12)) {
      const clientsCount = await countActiveClients(supabase, application.auth_user_id);
      coaches.push(publicProfileFromApplication(application, coaches.length, clientsCount));
    }

    return NextResponse.json({ coaches });
  } catch (error) {
    console.error("founding coaches lookup failed", error);
    return NextResponse.json({ coaches: [] });
  }
}
