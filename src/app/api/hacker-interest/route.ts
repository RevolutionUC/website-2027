import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { validateProfile } from "@/lib/validateProfile";

const BUCKET = "resumes-aditya";

export async function GET(request: Request) {
  try {
    const params = new URL(request.url).searchParams;
    const field = params.get("field");
    const value = params.get("value");
    if ((field !== "github" && field !== "linkedin") || typeof value !== "string" || value.length > 2048) {
      return NextResponse.json({ error: "Invalid profile URL." }, { status: 400 });
    }
    const result = await validateProfile(value.trim(), field);
    return NextResponse.json(result, { status: result.status ?? 200 });
  } catch {
    return NextResponse.json({ error: "Unable to verify profile. Please try again." }, { status: 503 });
  }
}

export async function POST(request: Request) {
  let form: FormData;
  let registration: Record<string, unknown>;
  try {
    form = await request.formData();
    registration = JSON.parse(String(form.get("registration")));
    if (!registration || typeof registration !== "object" || Array.isArray(registration)) {
      throw new Error("Invalid registration");
    }
  } catch {
    return NextResponse.json({ error: "Invalid registration data." }, { status: 400 });
  }

  const required = [
    "first_name", "last_name", "gender", "ethnicity", "phone", "email",
    "school", "level_of_study", "major", "country", "graduation_year",
    "tshirt_size", "num_hacks",
  ];
  const optional = [
    "other_level_of_study", "other_major", "food_allergy", "linkedin", "github", "add_notes",
  ];
  const data: Record<string, unknown> = {};
  for (const field of required) {
    const value = registration[field];
    if (typeof value !== "string" || !value.trim()) {
      return NextResponse.json({ error: "Please complete all required fields." }, { status: 400 });
    }
    data[field] = value.trim();
  }
  for (const field of optional) {
    const value = registration[field];
    if (value != null && typeof value !== "string") {
      return NextResponse.json({ error: "Invalid registration data." }, { status: 400 });
    }
    data[field] = typeof value === "string" ? value.trim() || null : null;
  }
  const { age, food_preferences, mlh_coc, mlh_sharing, mlh_emails } = registration;
  if (
    typeof age !== "number" || !Number.isInteger(age) || age < 13 || age > 100 ||
    !Array.isArray(food_preferences) || food_preferences.length === 0 ||
    !food_preferences.every((value) => typeof value === "string" && value.trim()) ||
    mlh_coc !== true || mlh_sharing !== true || typeof mlh_emails !== "boolean" ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(String(data.email)) ||
    String(data.phone).replace(/\D/g, "").length !== 10 ||
    (data.level_of_study === "Other" && !data.other_level_of_study) ||
    (data.major === "Other" && !data.other_major)
  ) {
    return NextResponse.json({ error: "Please check your registration details and agreements." }, { status: 400 });
  }
  Object.assign(data, { age, food_preferences, mlh_coc, mlh_sharing, mlh_emails });
  data.email = String(data.email).toLowerCase();

  const resume = form.get("resume");
  if (!(resume instanceof File) || resume.type !== "application/pdf" ||
    !resume.name.toLowerCase().endsWith(".pdf") || resume.size === 0 || resume.size > 5 * 1024 * 1024) {
    return NextResponse.json({ error: "Please upload a PDF resume under 5 MB." }, { status: 400 });
  }

  for (const field of ["linkedin", "github"] as const) {
    if (!data[field]) continue;
    const result = await validateProfile(String(data[field]), field);
    if (result.error) {
      return NextResponse.json({ error: result.error, field }, { status: result.status });
    }
    data[field] = result.url;
  }

  const path = `${crypto.randomUUID()}.pdf`;
  const { error: uploadError } = await supabaseAdmin.storage.from(BUCKET).upload(path, resume, {
    contentType: "application/pdf",
    upsert: false,
  });
  if (uploadError) {
    console.error("Resume upload failed", uploadError);
    return NextResponse.json({ error: "Resume upload failed. Please try again." }, { status: 500 });
  }
  data.resume_url = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/authenticated/${BUCKET}/${path}`;
  const { error } = await supabaseAdmin.from("registrations_2027").insert(data);
  if (error) {
    const { error: cleanupError } = await supabaseAdmin.storage.from(BUCKET).remove([path]);
    if (cleanupError) console.error("Resume cleanup failed", cleanupError);
    if (error.code === "23505") {
      return NextResponse.json({ error: "This email is already registered." }, { status: 409 });
    }
    console.error("Registration insert failed", error);
    return NextResponse.json({ error: "Unable to save registration. Please try again." }, { status: 500 });
  }
  return NextResponse.json({ success: true }, { status: 201 });
}
