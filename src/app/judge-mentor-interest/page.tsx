"use client";

import { useRef, useState } from "react";
import { InputField } from "@/components/ui/InputField";
import { supabase } from "@/lib/supabase";
import { COUNTRY_CODES } from "./countryCodes";

const EXPERTISE_AREAS = [
  "Software Development",
  "Hardware Engineering",
  "UI/UX",
  "Graphic Design",
  "Data Science & Analytics",
  "Artificial Intelligence & Machine Learning",
  "Cybersecurity",
  "Cloud",
  "Web Development",
  "Business & Entrepreneurship",
  "Product Management",
  "Marketing & Communications",
  "Other",
];

const ROLES = ["Judge", "Mentor", "Other"];

function formatPhone(raw: string): string {
  const digits = raw.replace(/\D/g, "").slice(0, 10);
  if (digits.length <= 3) return digits;
  if (digits.length <= 6) return `${digits.slice(0, 3)}-${digits.slice(3)}`;
  return `${digits.slice(0, 3)}-${digits.slice(3, 6)}-${digits.slice(6)}`;
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim());
}

function isoToFlagEmoji(iso2: string): string {
  return iso2
    .toUpperCase()
    .replace(/./g, (char) => String.fromCodePoint(127397 + char.charCodeAt(0)));
}

interface Errors {
  fullName?: string;
  email?: string;
  linkedIn?: string;
  phone?: string;
  organization?: string;
  jobTitle?: string;
  expertiseAreas?: string;
  roles?: string;
  availability?: string;
}

export default function JudgeMentorInterestPage() {
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  // Ref guard blocks double-clicks/Enter presses that fire before React re-renders
  const submittingRef = useRef(false);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [linkedIn, setLinkedIn] = useState("");
  const [countryIso2, setCountryIso2] = useState(COUNTRY_CODES[0].iso2);
  const [phone, setPhone] = useState("");
  const [organization, setOrganization] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [expertiseAreas, setExpertiseAreas] = useState<string[]>([]);
  const [otherExpertise, setOtherExpertise] = useState("");
  const [roles, setRoles] = useState<string[]>([]);
  const [otherRole, setOtherRole] = useState("");
  const [availability, setAvailability] = useState("");
  const [otherAvailability, setOtherAvailability] = useState("");
  const [specialRequirements, setSpecialRequirements] = useState("");
  const [expectations, setExpectations] = useState("");
  const [additionalInfo, setAdditionalInfo] = useState("");
  const [errors, setErrors] = useState<Errors>({});

  function handleNameChange(val: string) {
    setFullName(val.replace(/[^a-zA-Z\s]/g, ""));
    if (errors.fullName) setErrors((prev) => ({ ...prev, fullName: undefined }));
  }

  function handlePhoneChange(raw: string) {
    setPhone(formatPhone(raw));
    if (errors.phone) setErrors((prev) => ({ ...prev, phone: undefined }));
  }

  function handleEmailBlur() {
    if (email && !isValidEmail(email)) {
      setErrors((prev) => ({
        ...prev,
        email: "Please enter a valid email (e.g. name@domain.com)",
      }));
    }
  }

  function toggleExpertise(area: string) {
    setExpertiseAreas((prev) =>
      prev.includes(area) ? prev.filter((a) => a !== area) : [...prev, area],
    );
    if (errors.expertiseAreas) setErrors((prev) => ({ ...prev, expertiseAreas: undefined }));
  }

  function toggleRole(role: string) {
    setRoles((prev) =>
      prev.includes(role) ? prev.filter((r) => r !== role) : [...prev, role],
    );
    if (errors.roles) setErrors((prev) => ({ ...prev, roles: undefined }));
  }

  async function handleSubmit(e: React.SyntheticEvent<HTMLFormElement>) {
    e.preventDefault();
    if (submittingRef.current) return;
    const next: Errors = {};
    const countryCode =
      COUNTRY_CODES.find((c) => c.iso2 === countryIso2)?.dialCode ?? COUNTRY_CODES[0].dialCode;

    if (!fullName.trim()) next.fullName = "Full name is required";
    if (!email.trim()) {
      next.email = "Email is required";
    } else if (!isValidEmail(email)) {
      next.email = "Please enter a valid email (e.g. name@domain.com)";
    }
    if (!linkedIn.trim()) next.linkedIn = "LinkedIn profile URL is required";
    const phoneDigits = phone.replace(/\D/g, "");
    if (!phone.trim()) {
      next.phone = "Phone number is required";
    } else if (phoneDigits.length !== 10) {
      next.phone = "Phone number must be exactly 10 digits";
    }
    if (!organization.trim()) next.organization = "Organisation is required";
    if (!jobTitle.trim()) next.jobTitle = "Job title is required";
    if (expertiseAreas.length === 0) next.expertiseAreas = "Please select at least one area of expertise";
    if (roles.length === 0) next.roles = "Please select at least one role";
    if (!availability) next.availability = "Please select an availability option";

    if (Object.keys(next).length > 0) {
      setErrors(next);
      return;
    }

    const expertiseValue = expertiseAreas.length > 0
      ? expertiseAreas
          .map((a) => (a === "Other" && otherExpertise.trim() ? `Other: ${otherExpertise.trim()}` : a))
          .join(", ")
      : null;

    const rolesValue = roles.length > 0
      ? roles
          .map((r) => (r === "Other" && otherRole.trim() ? `Other: ${otherRole.trim()}` : r))
          .join(", ")
      : null;

    const availabilityValue =
      availability === "Other" && otherAvailability.trim()
        ? `Other: ${otherAvailability.trim()}`
        : availability;

    submittingRef.current = true;
    setSubmitting(true);

    const { error: dbError } = await supabase.from("judge_mentor_interest").insert({
      full_name: fullName.trim(),
      email: email.trim(),
      linkedin_url: linkedIn.trim(),
      phone: `${countryCode} ${phone.trim()}`,
      organization: organization.trim(),
      job_title: jobTitle.trim(),
      expertise_areas: expertiseValue,
      roles: rolesValue,
      availability: availabilityValue,
      special_requirements: specialRequirements.trim() || null,
      expectations: expectations.trim() || null,
      additional_info: additionalInfo.trim() || null,
    });

    if (dbError) {
      submittingRef.current = false;
      setSubmitting(false);
      setErrors({ email: "Something went wrong, please try again." });
      return;
    }

    setSubmitted(true);

    fetch("/api/judge-mentor-interest/notify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        fullName: fullName.trim(),
        email: email.trim(),
        linkedIn: linkedIn.trim(),
        phone: `${countryCode} ${phone.trim()}`,
        organization: organization.trim(),
        jobTitle: jobTitle.trim(),
        expertiseAreas: expertiseValue,
        roles: rolesValue,
        selectedRoles: roles,
        availability: availabilityValue,
        specialRequirements: specialRequirements.trim() || null,
        expectations: expectations.trim() || null,
        additionalInfo: additionalInfo.trim() || null,
      }),
    }).catch((err) => {
      console.error("Failed to send judge/mentor interest notification email", err);
    });
  }

  return (
    <div className="relative min-h-screen pt-24 pb-16 flex items-center justify-center px-4">
      {/* Decorative background blobs */}
      <div
        className="pointer-events-none absolute inset-0 overflow-hidden"
        aria-hidden="true"
      >
        <div className="absolute -top-20 -left-20 h-96 w-96 rounded-full bg-[#228CF6]/10 blur-3xl" />
        <div className="absolute bottom-0 right-0 h-80 w-80 rounded-full bg-[#19E363]/10 blur-3xl" />
      </div>

      <div className="relative w-full max-w-lg">
        {/* Header */}
        <div className="mb-8 text-center">
          <p className="font-mono text-sm uppercase tracking-widest text-[#228CF6] mb-2">
            RevolutionUC
          </p>
          <h1 className="text-4xl sm:text-5xl font-bold text-[#151477] leading-tight">
            Judge / Mentor{" "}
            <span className="relative inline-block after:absolute after:left-0 after:-bottom-1 after:h-1 after:w-full after:bg-[#19E363]">
              Interest Form
            </span>
          </h1>
          <p className="mt-4 text-[#151477]/70 text-base sm:text-lg">
            Interested in judging or mentoring at RevolutionUC? We&apos;d love to have you.
          </p>
        </div>

        {/* Card */}
        <div className="rounded-2xl border border-[#B7D9FF] bg-white/90 shadow-xl backdrop-blur-sm px-6 py-8 sm:px-10 sm:py-10">
          {submitted ? (
            <div className="flex flex-col items-center gap-4 py-8 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#19E363]/20">
                <svg
                  className="h-8 w-8 text-[#19E363]"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2.5}
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4.5 12.75l6 6 9-13.5"
                  />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-[#151477]">Thank you!</h2>
              <p className="text-[#151477]/70">
                We&apos;ve received your interest. Our team will reach out soon.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-6" noValidate>
              {/* Full Name */}
              <InputField
                name="fullName"
                label="Full Name"
                placeholder="e.g. Jane Smith"
                value={fullName}
                onChange={(e) => handleNameChange(e.target.value)}
                error={errors.fullName}
                required
              />

              {/* Email */}
              <InputField
                name="email"
                label="Email Address"
                type="email"
                placeholder="e.g. jane@company.com"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (errors.email) setErrors((prev) => ({ ...prev, email: undefined }));
                }}
                onBlur={handleEmailBlur}
                error={errors.email}
                required
              />

              {/* LinkedIn */}
              <InputField
                name="linkedIn"
                label="LinkedIn Profile URL"
                placeholder="e.g. linkedin.com/in/janesmit"
                value={linkedIn}
                onChange={(e) => {
                  setLinkedIn(e.target.value);
                  if (errors.linkedIn) setErrors((prev) => ({ ...prev, linkedIn: undefined }));
                }}
                error={errors.linkedIn}
                required
              />

              {/* Phone */}
              <div>
                <label htmlFor="phone" className="mb-1 block font-semibold text-gray-900">
                  Phone Number<span className="text-red-600">*</span>
                </label>
                <div className="flex gap-2">
                  <select
                    id="countryCode"
                    name="countryCode"
                    value={countryIso2}
                    onChange={(e) => setCountryIso2(e.target.value)}
                    className="w-28 shrink-0 rounded-md border border-gray-300 bg-white px-2 py-2 text-gray-900 focus:border-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-500"
                  >
                    {COUNTRY_CODES.map((country) => (
                      <option key={country.iso2} value={country.iso2}>
                        {isoToFlagEmoji(country.iso2)} {country.dialCode}
                      </option>
                    ))}
                  </select>
                  <input
                    id="phone"
                    type="tel"
                    name="phone"
                    value={phone}
                    onChange={(e) => handlePhoneChange(e.target.value)}
                    placeholder="e.g. 5558675309"
                    className={`w-full rounded-md border px-3 py-2 text-gray-900 focus:outline-none focus:ring-1 ${
                      errors.phone
                        ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                        : "border-gray-300 focus:border-gray-500 focus:ring-gray-500"
                    } bg-white`}
                  />
                </div>
                {errors.phone && (
                  <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
                )}
              </div>

              {/* Organization */}
              <InputField
                name="organization"
                label="Current Organization/Company"
                placeholder="e.g. Acme Corp"
                value={organization}
                onChange={(e) => {
                  setOrganization(e.target.value);
                  if (errors.organization) setErrors((prev) => ({ ...prev, organization: undefined }));
                }}
                error={errors.organization}
                required
              />

              {/* Job Title */}
              <InputField
                name="jobTitle"
                label="Job Title/Position"
                placeholder="e.g. Senior Software Engineer"
                value={jobTitle}
                onChange={(e) => {
                  setJobTitle(e.target.value);
                  if (errors.jobTitle) setErrors((prev) => ({ ...prev, jobTitle: undefined }));
                }}
                error={errors.jobTitle}
                required
              />

              {/* Expertise areas — required */}
              <div>
                <p className="mb-2 block font-semibold text-gray-900">
                  Which area(s) of expertise would you like to judge/mentor in?
                  <span className="text-red-600">*</span>
                </p>
                <div className="flex flex-col gap-2">
                  {EXPERTISE_AREAS.map((area) => (
                    <label key={area} className="flex items-start gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={expertiseAreas.includes(area)}
                        onChange={() => toggleExpertise(area)}
                        className="mt-0.5 h-4 w-4 shrink-0 accent-[#151477]"
                      />
                      <span className="text-sm text-gray-900">
                        {area === "Other" ? "Other:" : area}
                      </span>
                    </label>
                  ))}
                </div>
                {expertiseAreas.includes("Other") && (
                  <input
                    type="text"
                    placeholder="Please specify..."
                    value={otherExpertise}
                    onChange={(e) => setOtherExpertise(e.target.value)}
                    className="mt-2 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-500"
                  />
                )}
                {errors.expertiseAreas && (
                  <p className="mt-1 text-sm text-red-600">{errors.expertiseAreas}</p>
                )}
              </div>

              {/* Roles — required */}
              <div>
                <p className="mb-2 block font-semibold text-gray-900">
                  Which role(s) are you interested in filling?
                  <span className="text-red-600">*</span>
                </p>
                <div className="flex flex-col gap-2">
                  {ROLES.map((role) => (
                    <label key={role} className="flex items-start gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={roles.includes(role)}
                        onChange={() => toggleRole(role)}
                        className="mt-0.5 h-4 w-4 shrink-0 accent-[#151477]"
                      />
                      <span className="text-sm text-gray-900">
                        {role === "Other" ? "Other:" : role}
                      </span>
                    </label>
                  ))}
                </div>
                {roles.includes("Other") && (
                  <input
                    type="text"
                    placeholder="Please specify..."
                    value={otherRole}
                    onChange={(e) => setOtherRole(e.target.value)}
                    className="mt-2 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-500"
                  />
                )}
                {errors.roles && (
                  <p className="mt-1 text-sm text-red-600">{errors.roles}</p>
                )}
              </div>

              {/* Availability — required */}
              <div>
                <p className="mb-1 font-semibold text-gray-900">
                  Are you available to attend the hackathon in-person?
                  <span className="text-red-600">*</span>
                </p>
                <p className="mb-2 text-xs text-gray-500">
                  Location: Cincinnati, Ohio
                  <br />
                  (We do not offer travel reimbursement for judges or mentors at this time)
                </p>
                <div className="flex flex-col gap-2">
                  {["Yes", "No", "Other"].map((option) => (
                    <label key={option} className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="radio"
                        name="availability"
                        value={option}
                        checked={availability === option}
                        onChange={() => {
                          setAvailability(option);
                          if (errors.availability) setErrors((prev) => ({ ...prev, availability: undefined }));
                        }}
                        className="h-4 w-4 shrink-0 accent-[#151477]"
                      />
                      <span className="text-sm text-gray-900">
                        {option === "Other" ? "Other:" : option}
                      </span>
                    </label>
                  ))}
                </div>
                {availability === "Other" && (
                  <input
                    type="text"
                    placeholder="Please specify..."
                    value={otherAvailability}
                    onChange={(e) => setOtherAvailability(e.target.value)}
                    className="mt-2 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-500"
                  />
                )}
                {errors.availability && (
                  <p className="mt-1 text-sm text-red-600">{errors.availability}</p>
                )}
              </div>

              {/* Special requirements — optional */}
              <div>
                <label htmlFor="specialRequirements" className="mb-1 block font-semibold text-gray-900">
                  Do you have any special requirements or accommodations?
                </label>
                <textarea
                  id="specialRequirements"
                  name="specialRequirements"
                  value={specialRequirements}
                  onChange={(e) => setSpecialRequirements(e.target.value)}
                  placeholder="Any dietary, accessibility, or other requirements..."
                  rows={3}
                  className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-500 resize-none"
                />
              </div>

              {/* Expectations — optional */}
              <div>
                <label htmlFor="expectations" className="mb-1 block font-semibold text-gray-900">
                  Do you have any specific expectations and goals as a judge/mentor at RevolutionUC
                  Hackathon 2027 that you want us to know?
                </label>
                <textarea
                  id="expectations"
                  name="expectations"
                  value={expectations}
                  onChange={(e) => setExpectations(e.target.value)}
                  placeholder="Share your expectations..."
                  rows={3}
                  className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-500 resize-none"
                />
              </div>

              {/* Additional info — optional */}
              <div>
                <label htmlFor="additionalInfo" className="mb-1 block font-semibold text-gray-900">
                  Please provide any additional information or comments you would like us to consider.
                </label>
                <textarea
                  id="additionalInfo"
                  name="additionalInfo"
                  value={additionalInfo}
                  onChange={(e) => setAdditionalInfo(e.target.value)}
                  placeholder="Any additional comments..."
                  rows={3}
                  className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-500 resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="mt-2 w-full rounded-md border-2 border-[#19E363] bg-[#151477] px-6 py-3 font-semibold text-[#EDF6FF] transition-all duration-200 hover:bg-[#19E363] hover:text-[#151477] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:bg-[#151477] disabled:hover:text-[#EDF6FF] disabled:active:scale-100"
              >
                {submitting ? "Submitting..." : "Submit"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
