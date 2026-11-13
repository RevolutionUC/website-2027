"use client";

import { useEffect, useRef, useState } from "react";
import { InputField } from "@/components/ui/InputField";
import { supabase } from "@/lib/supabase";
import { SCHOOLS } from "./schools";
import { COUNTRIES } from "./countries";
import majors from "@/data/majors_cleaned.json";

const UNIQUE_SCHOOLS = [...new Set(SCHOOLS)];
const AGE_OPTIONS = Array.from({ length: 88 }, (_, i) => String(i + 13));
const GRADUATION_YEARS = [
  "Already graduated",
  ...Array.from({ length: 7 }, (_, i) => String(2026 + i)),
];
const GENDER_OPTIONS = ["Woman", "Man", "Non-binary", "Self-describe", "Prefer not to say"];
const ETHNICITIES = ["American Indian or Alaska Native", "Asian", "Black or African American", "Hispanic or Latino/a/x", "Middle Eastern or North African", "Native Hawaiian or Other Pacific Islander", "White", "Multiracial", "Self-describe", "Prefer not to say"];
const TSHIRT_SIZES = ["XS", "S", "M", "L", "XL", "2XL", "3XL"];
const FOOD_PREFERENCES = [
  "No restrictions",
  "Vegetarian",
  "Vegan",
  "Pescatarian",
  "Gluten-free / Celiac",
  "Dairy-free",
  "Halal",
  "Kosher",
  "Other",
];
const HACKATHON_OPTIONS = ["0", "1-5", "5-10", "10+"];
const MAX_RESUME_SIZE = 5 * 1024 * 1024;
const STUDY_LEVELS = [
  "Less than Secondary / High School",
  "Secondary / High School",
  "Undergraduate University (2 year - community college or similar)",
  "Undergraduate University (3+ year)",
  "Graduate University (Masters, Professional, Doctoral, etc)",
  "Code School / Bootcamp",
  "Other Vocational / Trade Program or Apprenticeship",
  "Post Doctorate",
  "Other",
  "I'm not currently a student",
  "Prefer not to answer",
];

const REG_TABLE = "registrations_2027_dev_aditya_CHANGE_THIS";
const DEV_MODE = true;

function formatPhone(raw: string): string {
  const digits = raw.replace(/\D/g, "").slice(0, 10);
  if (digits.length <= 3) return digits;
  if (digits.length <= 6) return `${digits.slice(0, 3)}-${digits.slice(3)}`;
  return `${digits.slice(0, 3)}-${digits.slice(3, 6)}-${digits.slice(6)}`;
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim());
}

function isValidProfileUrl(value: string, domain: string): boolean {
  try {
    const url = new URL(value.trim());
    const hostname = url.hostname.toLowerCase();
    return (
      (url.protocol === "https:" || url.protocol === "http:") &&
      (hostname === domain || hostname.endsWith(`.${domain}`))
    );
  } catch {
    return false;
  }
}

interface Errors {
  firstName?: string;
  lastName?: string;
  age?: string;
  phone?: string;
  email?: string;
  school?: string;
  levelOfStudy?: string;
  country?: string;
  mlhCoc?: string;
  mlhSharing?: string;
  gender?: string;
  ethnicity?: string;
  major?: string;
  graduationYear?: string;
  tshirtSize?: string;
  foodPreferences?: string;
  foodAllergy?: string;
  resume?: string;
  numHacks?: string;
  linkedin?: string;
  github?: string;
  addNotes?: string;
}
function SchoolCombobox({
  value,
  onChange,
  error,
}: {
  value: string;
  onChange: (val: string) => void;
  error?: string;
}) {
  const [query, setQuery] = useState(value);
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const filtered = query.trim()
    ? UNIQUE_SCHOOLS.filter((s) =>
        s.toLowerCase().includes(query.toLowerCase())
      ).slice(0, 100)
    : UNIQUE_SCHOOLS.slice(0, 100);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
        if (!value) setQuery("");
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [value]);

  function select(school: string) {
    onChange(school);
    setQuery(school);
    setOpen(false);
  }

  return (
    <div ref={containerRef} className="relative">
      <label className="mb-1 block font-semibold text-gray-900">
        School<span className="text-red-600">*</span>
      </label>
      <input
        type="text"
        placeholder="Search for your school..."
        value={query}
        autoComplete="off"
        onFocus={() => setOpen(true)}
        onChange={(e) => {
          setQuery(e.target.value);
          onChange("");
          setOpen(true);
        }}
        className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 focus:border-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-500"
      />
      {open && filtered.length > 0 && (
        <ul className="absolute left-0 right-0 z-50 mt-1 max-h-48 overflow-y-auto rounded-md border border-gray-200 bg-white shadow-lg">
          {filtered.map((s) => (
            <li
              key={s}
              onMouseDown={() => select(s)}
              className="cursor-pointer px-3 py-2 text-sm text-gray-900 hover:bg-[#EDF6FF]"
            >
              {s}
            </li>
          ))}
          {query.trim() && filtered.length === 100 && (
            <li className="px-3 py-2 text-xs text-gray-400">
              Showing first 100 results — type more to narrow down
            </li>
          )}
        </ul>
      )}
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
}



export default function InterestPage() {
  const [submitted, setSubmitted] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [ethnicity, setEthnicity] = useState("");
  const [major, setMajor] = useState("");
  const [graduationYear, setGraduationYear] = useState("");
  const [tshirtSize, setTshirtSize] = useState("");
  const [foodPreferences, setFoodPreferences] = useState<string[]>([]);
  const [foodAllergy, setFoodAllergy] = useState("");
  const [resume, setResume] = useState<File | null>(null);
  const [resumeError, setResumeError] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const resumeInputRef = useRef<HTMLInputElement>(null);
  const [numHacks, setNumHacks] = useState("");
  const [linkedin, setLinkedin] = useState("");
  const [github, setGithub] = useState("");
  const [addNotes, setAddNotes] = useState("");

  const [school, setSchool] = useState("");
  const [levelOfStudy, setLevelOfStudy] = useState("");
  const [otherLevelOfStudy, setOtherLevelOfStudy] = useState("");
  const [country, setCountry] = useState("");
  const [mlhCoc, setMlhCoc] = useState(false);
  const [mlhSharing, setMlhSharing] = useState(false);
  const [mlhEmails, setMlhEmails] = useState(false);
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState<Errors>({});

  const [majorSearch, setMajorSearch] = useState("");
  const [majorOpen, setMajorOpen] = useState(false);
  const [otherMajor, setOtherMajor] = useState("");
  const majorRef = useRef<HTMLDivElement>(null);
  
  const majorOptions = [
  ...majors.filter((m) => m !== "Other"),
  "Other",
  ];

  const filteredMajors = majorOptions.filter((m) =>
  m.toLowerCase().includes(majorSearch.toLowerCase())
  );

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        majorRef.current &&
        !majorRef.current.contains(event.target as Node)
      ) {
        setMajorOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function handleNameChange(setter: (v: string) => void, field: keyof Errors) {
    return (e: React.ChangeEvent<HTMLInputElement>) => {
      const filtered = e.target.value.replace(/[^a-zA-Z\s]/g, "");
      setter(filtered);
      if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
    };
  }

  function handleResume(file: File | undefined) {
    if (!file) return;

    if (
      file.type !== "application/pdf" ||
      !file.name.toLowerCase().endsWith(".pdf")
    ) {
      setResumeError("Please upload a PDF file.");
      return;
    }

    if (file.size > MAX_RESUME_SIZE) {
      setResumeError("File size must be under 5 MB.");
      return;
    }

    setResume(file);
    setResumeError("");
    if (errors.resume) {
      setErrors((prev) => ({ ...prev, resume: undefined }));
    }
  }

  function handleTextChange(
  setter: (v: string) => void,
  field: keyof Errors
) {
  return (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setter(e.target.value);

    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };
}

  function handlePhoneChange(e: React.ChangeEvent<HTMLInputElement>) {
    setPhone(formatPhone(e.target.value));
    if (errors.phone) setErrors((prev) => ({ ...prev, phone: undefined }));
  }

  function handleEmailChange(e: React.ChangeEvent<HTMLInputElement>) {
    setEmail(e.target.value);
    if (errors.email) setErrors((prev) => ({ ...prev, email: undefined }));
  }

  function handleEmailBlur() {
    if (email && !isValidEmail(email)) {
      setErrors((prev) => ({
        ...prev,
        email: "Please enter a valid email (e.g. name@domain.com)",
      }));
    }
  }

  function toggleFoodPreference(option: string) {
    setFoodPreferences((current) => {
      if (option === "No restrictions") {
        return current.includes(option) ? [] : [option];
      }

      const withoutNoRestrictions = current.filter(
        (item) => item !== "No restrictions"
      );
      return withoutNoRestrictions.includes(option)
        ? withoutNoRestrictions.filter((item) => item !== option)
        : [...withoutNoRestrictions, option];
    });
    if (errors.foodPreferences) {
      setErrors((prev) => ({ ...prev, foodPreferences: undefined }));
    }
  }

  async function handleSubmit(e: React.SyntheticEvent<HTMLFormElement>) {
    e.preventDefault();
    const next: Errors = {};

    if (!firstName.trim()) next.firstName = "First name is required";
    if (!lastName.trim()) next.lastName = "Last name is required";
    if (!age) next.age = "Please select your age";

    const digits = phone.replace(/\D/g, "");
    if (digits.length === 0) {
      next.phone = "Phone number is required";
    } else if (digits.length !== 10) {
      next.phone = "Phone number must be exactly 10 digits";
    }

    if (!email.trim()) {
      next.email = "Email is required";
    } else if (!isValidEmail(email)) {
      next.email = "Please enter a valid email (e.g. name@domain.com)";
    }

    if (!school) next.school = "Please select your school";
    if (!levelOfStudy) next.levelOfStudy = "Please select your level of study";
    if (levelOfStudy === "Other" && !otherLevelOfStudy.trim()) {
      next.levelOfStudy = "Please describe your level of study";
    }
    if (!country) next.country = "Please select your country of residence";
    if (!gender) next.gender = "Please select your gender";
    if (!ethnicity) next.ethnicity = "Please select your ethnicity";
    if (!major) next.major = "Please select your major";
    if (major === "Other" && !otherMajor.trim()) {
      next.major = "Please enter your major";
    }
    if (!graduationYear) next.graduationYear = "Please select a graduation option";
    if (!tshirtSize) next.tshirtSize = "Please select your T-shirt size";
    if (foodPreferences.length === 0) {
      next.foodPreferences = "Please select at least one dietary option";
    }
    if (!resume) next.resume = "Resume is required";
    if (!numHacks) next.numHacks = "Please select your hackathon experience";
    if (linkedin.trim() && !isValidProfileUrl(linkedin, "linkedin.com")) {
      next.linkedin = "Enter a valid LinkedIn URL (for example, https://www.linkedin.com/in/your-name)";
    }
    if (github.trim() && !isValidProfileUrl(github, "github.com")) {
      next.github = "Enter a valid GitHub URL (for example, https://github.com/your-name)";
    }
    if (!mlhCoc) next.mlhCoc = "You must agree to the MLH Code of Conduct";
    if (!mlhSharing) next.mlhSharing = "You must authorize MLH information sharing";

    if (Object.keys(next).length > 0) {
      setErrors(next);
      return;
    }
    if(DEV_MODE){
      // log registration data
      console.log(firstName.trim());
      console.log(lastName.trim());

    }

    const { error: dbError } = await supabase.from(REG_TABLE).insert({
      first_name: firstName.trim(),
      last_name: lastName.trim(),
      age,
      phone,
      email: email.trim(),
      school,
      level_of_study: levelOfStudy,
      other_level_of_study: otherLevelOfStudy || null,
      country,
      mlh_coc: mlhCoc,
      mlh_sharing: mlhSharing,
      mlh_emails: mlhEmails,
    });

    if (dbError) {
      setErrors({ email: "Something went wrong, please try again." });
      return;
    }

    setSubmitted(true);

    fetch("/api/hacker-interest/notify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        age,
        phone,
        email: email.trim(),
        school,
        levelOfStudy,
        otherLevelOfStudy: otherLevelOfStudy.trim() || null,
        country,
      }),
    }).catch((err) => {
      console.error("Failed to send hacker interest confirmation email", err);
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

      <div className="relative w-full max-w-3xl">
        {/* Header */}
        <div className="mb-8 text-center">
          <p className="font-mono text-sm uppercase tracking-widest text-[#228CF6] mb-2">
          
          </p>
          <h1 className="text-4xl sm:text-5xl font-bold text-[#151477] leading-tight">
            Hacker Registration{" "}
            <span className="relative inline-block after:absolute after:left-0 after:-bottom-1 after:h-1 after:w-full after:bg-[#19E363]">
              Form
            </span>
          </h1>
          <p className="mt-4 text-[#151477]/70 text-base sm:text-lg">
            We are glad to know that you&apos;re interested — please fill out the registration form below.
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
              <h2 className="text-2xl font-bold text-[#151477]">You&apos;re on the list!</h2>
              <p className="text-[#151477]/70">
                Thanks for your interest. We&apos;ll be in touch soon.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-6" noValidate>
              <InputField
                name="firstName"
                label="First Name"
                placeholder="e.g. Alex"
                value={firstName}
                onChange={handleNameChange(setFirstName, "firstName")}
                error={errors.firstName}
                required
              />

              <InputField
                name="lastName"
                label="Last Name"
                placeholder="e.g. Smith"
                value={lastName}
                onChange={handleNameChange(setLastName, "lastName")}
                error={errors.lastName}
                required
              />

              <div>
                <label htmlFor="age" className="mb-1 block font-semibold text-gray-900">
                  Age<span className="text-red-600">*</span>
                </label>
                <select
                  id="age"
                  name="age"
                  value={age}
                  onChange={(e) => {
                    setAge(e.target.value);
                    if (errors.age) setErrors((prev) => ({ ...prev, age: undefined }));
                  }}
                  className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 focus:border-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-500"
                >
                  <option value="" disabled>Select...</option>
                  {AGE_OPTIONS.map((opt) => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
                {errors.age && <p className="mt-1 text-sm text-red-600">{errors.age}</p>}
              </div>

              <div>
                <label htmlFor="gender" className="mb-1 block font-semibold text-gray-900">
                  Gender<span className="text-red-600">*</span>
                </label>
                <select
                  id="gender"
                  name="gender"
                  value={gender}
                  onChange={(e) => {
                    setGender(e.target.value);
                    if (errors.gender) setErrors((prev) => ({ ...prev, gender: undefined }));
                  }}
                  className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 focus:border-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-500"
                >
                  <option value="" disabled>Select...</option>
                  {GENDER_OPTIONS.map((opt) => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
                {errors.gender && <p className="mt-1 text-sm text-red-600">{errors.gender}</p>}
              </div>

              <div>
                <label htmlFor="ethnicity" className="mb-1 block font-semibold text-gray-900">
                  Ethnicity<span className="text-red-600">*</span>
                </label>
                <select
                  id="ethnicity"
                  name="ethnicity"
                  value={ethnicity}
                  onChange={(e) => {
                    setEthnicity(e.target.value);
                    if (errors.ethnicity) setErrors((prev) => ({ ...prev, ethnicity: undefined }));
                  }}
                  className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 focus:border-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-500"
                >
                  <option value="" disabled>Select...</option>
                  {ETHNICITIES.map((opt) => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
                {errors.ethnicity && <p className="mt-1 text-sm text-red-600">{errors.ethnicity}</p>}
              </div>
 


              <InputField
                name="phone"
                label="Phone Number"
                type="tel"
                placeholder="e.g. 123-456-7890"
                inputMode="numeric"
                value={phone}
                onChange={handlePhoneChange}
                error={errors.phone}
                required
              />

              <InputField
                name="email"
                label="Email"
                type="email"
                placeholder="e.g. alex@example.com"
                value={email}
                onChange={handleEmailChange}
                onBlur={handleEmailBlur}
                error={errors.email}
                required
              />

              <SchoolCombobox
                value={school}
                onChange={(val) => {
                  setSchool(val);
                  if (errors.school) setErrors((prev) => ({ ...prev, school: undefined }));
                }}
                error={errors.school}
              />

              <div>
                <label htmlFor="levelOfStudy" className="mb-1 block font-semibold text-gray-900">
                  Level of Study<span className="text-red-600">*</span>
                </label>
                <select
                  id="levelOfStudy"
                  name="levelOfStudy"
                  value={levelOfStudy}
                  onChange={(e) => {
                    setLevelOfStudy(e.target.value);
                    if (e.target.value !== "Other") setOtherLevelOfStudy("");
                    if (errors.levelOfStudy) setErrors((prev) => ({ ...prev, levelOfStudy: undefined }));
                  }}
                  className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 focus:border-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-500"
                >
                  <option value="" disabled>Select...</option>
                  {STUDY_LEVELS.map((opt) => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
                {errors.levelOfStudy && <p className="mt-1 text-sm text-red-600">{errors.levelOfStudy}</p>}
              </div>

              {levelOfStudy === "Other" && (
                <InputField
                  name="otherLevelOfStudy"
                  label="Please specify"
                  placeholder="Describe your level of study"
                  value={otherLevelOfStudy}
                  onChange={(e) => setOtherLevelOfStudy(e.target.value)}
                  required
                />
              )}

              
            <div ref={majorRef} className="relative">
              <label htmlFor="major" className="mb-1 block font-semibold text-gray-900">
                Major<span className="text-red-600">*</span>
              </label>

              <input
                id="major"
                name="major"
                type="text"
                autoComplete="off"
                placeholder="Search for your major..."
                value={majorOpen ? majorSearch : major}
                onFocus={() => {
                  setMajorSearch("");
                  setMajorOpen(true);
                }}
                onChange={(e) => {
                  setMajorSearch(e.target.value);
                  setMajorOpen(true);
                  setMajor("");
                  if (errors.major)
                    setErrors((prev) => ({ ...prev, major: undefined }));
                }}
                onKeyDown={(e) => {
                  if (e.key === "Escape") setMajorOpen(false);
                }}
                className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 focus:border-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-500"
                role="combobox"
                aria-expanded={majorOpen}
                aria-controls="major-options"
                aria-autocomplete="list"
              />

              {majorOpen && (
                <ul
                  id="major-options"
                  role="listbox"
                  className="absolute z-50 mt-1 max-h-60 w-full overflow-y-auto rounded-md border border-gray-300 bg-white shadow-lg"
                >
                  {filteredMajors.length > 0 ? (
                    filteredMajors.slice(0, 100).map((opt) => (
                      <li key={opt} role="option" aria-selected={major === opt}>
                        <button
                          type="button"
                          onClick={() => {
                            setMajor(opt);
                            setMajorSearch(opt);
                            setMajorOpen(false);
                            if (errors.major)
                              setErrors((prev) => ({ ...prev, major: undefined }));
                          }}
                          className="w-full px-3 py-2 text-left text-gray-900 hover:bg-gray-100"
                        >
                          {opt}
                        </button>
                      </li>
                    ))
                  ) : (
                    <li className="px-3 py-2 text-gray-500">
                      No majors found
                    </li>
                  )}
                </ul>
              )}

              {errors.major && (
                <p className="mt-1 text-sm text-red-600">{errors.major}</p>
              )}
            </div>
            {major === "Other" && (
              <div className="mt-3">
                <label
                  htmlFor="otherMajor"
                  className="mb-1 block font-semibold text-gray-900"
                >
                  Please specify your major
                  <span className="text-red-600">*</span>
                </label>

                <input
                  id="otherMajor"
                  name="otherMajor"
                  type="text"
                  value={otherMajor}
                  onChange={(e) => setOtherMajor(e.target.value)}
                  placeholder="Enter your major"
                  className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 focus:border-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-500"
                />
              </div>
            )}


              <div>
                <label htmlFor="country" className="mb-1 block font-semibold text-gray-900">
                  Country of Residence<span className="text-red-600">*</span>
                </label>
                <select
                  id="country"
                  name="country"
                  value={country}
                  onChange={(e) => {
                    setCountry(e.target.value);
                    if (errors.country) setErrors((prev) => ({ ...prev, country: undefined }));
                  }}
                  className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 focus:border-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-500"
                >
                  <option value="" disabled>Select...</option>
                  {COUNTRIES.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
                {errors.country && <p className="mt-1 text-sm text-red-600">{errors.country}</p>}
              </div>

              <div>
                <label htmlFor="gradYear" className="mb-1 block font-semibold text-gray-900">
                  Expected Graduation Year<span className="text-red-600">*</span>
                </label>
                <select
                  id="gradYear"
                  name="gradYear"
                  value={graduationYear}
                  onChange={(e) => {
                    setGraduationYear(e.target.value);
                    if (errors.graduationYear) setErrors((prev) => ({ ...prev, graduationYear: undefined }));
                  }}
                  className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 focus:border-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-500"
                >
                  <option value="" disabled>Select...</option>
                  {GRADUATION_YEARS.map((opt) => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
                {errors.graduationYear && <p className="mt-1 text-sm text-red-600">{errors.graduationYear}</p>}
              </div>

              <div>
                <label htmlFor="tshirt" className="mb-1 block font-semibold text-gray-900">
                  T-Shirt Size<span className="text-red-600">*</span>
                </label>
                <select
                  id="tshirt"
                  name="tshirt"
                  value={tshirtSize}
                  onChange={(e) => {
                    setTshirtSize(e.target.value);
                    if (errors.tshirtSize) setErrors((prev) => ({ ...prev, tshirtSize: undefined }));
                  }}
                  className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 focus:border-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-500"
                >
                  <option value="" disabled>Select...</option>
                  {TSHIRT_SIZES.map((opt) => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
                {errors.tshirtSize && <p className="mt-1 text-sm text-red-600">{errors.tshirtSize}</p>}
              </div>

              <fieldset>
                <legend className="mb-2 block font-semibold text-gray-900">
                  Dietary Restrictions<span className="text-red-600">*</span>
                </legend>
                <p className="mb-3 text-sm text-gray-600">Select all that apply.</p>
                <div className="grid gap-2 rounded-md border border-gray-300 bg-white p-3 sm:grid-cols-2">
                  {FOOD_PREFERENCES.map((option) => (
                    <label key={option} className="flex cursor-pointer items-center gap-2 text-sm text-gray-900">
                      <input
                        type="checkbox"
                        name="foodPreferences"
                        value={option}
                        checked={foodPreferences.includes(option)}
                        onChange={() => toggleFoodPreference(option)}
                        className="h-4 w-4 rounded accent-[#151477]"
                      />
                      {option}
                    </label>
                  ))}
                </div>
                {errors.foodPreferences && (
                  <p className="mt-1 text-sm text-red-600">{errors.foodPreferences}</p>
                )}
              </fieldset>
              <InputField
                name="Food Allergy"
                label="Dietary Details or Food Allergies"
                placeholder="List allergies or explain other dietary needs (if any)"
                value={foodAllergy}
                onChange={handleTextChange(setFoodAllergy, "foodAllergy")}
                error={errors.foodAllergy}
              />

              
              <div>
                <label
                  htmlFor="resume"
                  className="mb-1 block font-semibold text-gray-900"
                >
                  Resume<span className="text-red-600">*</span>
                </label>

                <input
                  ref={resumeInputRef}
                  id="resume"
                  name="resume"
                  type="file"
                  accept=".pdf,application/pdf"
                  className="sr-only"
                  onChange={(e) => {
                    handleResume(e.target.files?.[0]);
                    e.target.value = "";
                  }}
                />

                <div
                  role="button"
                  tabIndex={0}
                  onClick={() => resumeInputRef.current?.click()}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      resumeInputRef.current?.click();
                    }
                  }}
                  onDragOver={(e) => {
                    e.preventDefault();
                    setIsDragging(true);
                  }}
                  onDragLeave={(e) => {
                    e.preventDefault();
                    setIsDragging(false);
                  }}
                  onDrop={(e) => {
                    e.preventDefault();
                    setIsDragging(false);
                    handleResume(e.dataTransfer.files[0]);
                  }}
                  className={`cursor-pointer rounded-lg border-2 border-dashed p-6 text-center transition-colors ${
                    isDragging
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-300 bg-white hover:border-gray-500"
                  }`}
                >
                  {resume ? (
                    <div className="space-y-2">
                      <p className="font-medium text-green-700">
                        Resume selected
                      </p>
                      <p className="break-all text-sm text-gray-700">
                        {resume.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {(resume.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                      <p className="text-sm text-blue-600">
                        Click or drop another file to replace
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <p className="font-medium text-gray-900">
                        Drag and drop your resume here
                      </p>
                      <p className="text-sm text-gray-600">
                        or click to browse files
                      </p>
                      <p className="text-xs text-gray-500">
                        PDF only, maximum 5 MB
                      </p>
                    </div>
                  )}
                </div>

                {resume && (
                  <button
                    type="button"
                    onClick={() => setResume(null)}
                    className="mt-2 text-sm text-red-600 hover:underline"
                  >
                    Remove resume
                  </button>
                )}

                {(resumeError || errors.resume) && (
                  <p className="mt-1 text-sm text-red-600">
                    {resumeError || errors.resume}
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="numHacks" className="mb-1 block font-semibold text-gray-900">
                  Number of Hackathons Attended<span className="text-red-600">*</span>
                </label>
                <select
                  id="numHacks"
                  name="numHacks"
                  value={numHacks}
                  onChange={(e) => {
                    setNumHacks(e.target.value);
                    if (errors.numHacks) {
                      setErrors((prev) => ({ ...prev, numHacks: undefined }));
                    }
                  }}
                  className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 focus:border-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-500"
                >
                  <option value="" disabled>Select...</option>
                  {HACKATHON_OPTIONS.map((option) => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
                {errors.numHacks && (
                  <p className="mt-1 text-sm text-red-600">{errors.numHacks}</p>
                )}
              </div>

              <InputField
                name="linkedin"
                label="LinkedIn"
                type="url"
                placeholder="https://www.linkedin.com/in/your-profile"
                value={linkedin}
                onChange={handleTextChange(setLinkedin, "linkedin")}
                onBlur={() => {
                  if (linkedin.trim() && !isValidProfileUrl(linkedin, "linkedin.com")) {
                    setErrors((prev) => ({
                      ...prev,
                      linkedin: "Enter a valid LinkedIn URL (for example, https://www.linkedin.com/in/your-name)",
                    }));
                  }
                }}
                error={errors.linkedin}
              />

              <InputField
                name="github"
                label="GitHub"
                type="url"
                placeholder="https://github.com/your-username"
                value={github}
                onChange={handleTextChange(setGithub, "github")}
                onBlur={() => {
                  if (github.trim() && !isValidProfileUrl(github, "github.com")) {
                    setErrors((prev) => ({
                      ...prev,
                      github: "Enter a valid GitHub URL (for example, https://github.com/your-name)",
                    }));
                  }
                }}
                error={errors.github}
              />
              <InputField
                name="Additional Notes"
                label="Additional Notes"
                placeholder="Enter additional notes"
                value={addNotes}
                onChange={handleTextChange(setAddNotes, "addNotes")}
                error={errors.addNotes}
              />

              {/* MLH Partnership Section */}
              <div className="rounded-lg border border-[#B7D9FF] bg-[#EDF6FF]/60 px-4 py-4 flex flex-col gap-4">
                <p className="text-xs text-[#151477]/70 leading-relaxed">
                  We are currently in the process of partnering with MLH. The following 3 checkboxes are for this partnership. If we do not end up partnering with MLH, your information will not be shared.
                </p>

                <div className="flex flex-col gap-3">
                  {/* Checkbox 1 - required */}
                  <div>
                    <label className="flex items-start gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={mlhCoc}
                        onChange={(e) => {
                          setMlhCoc(e.target.checked);
                          if (errors.mlhCoc) setErrors((prev) => ({ ...prev, mlhCoc: undefined }));
                        }}
                        className="mt-0.5 h-4 w-4 shrink-0 accent-[#151477]"
                      />
                      <span className="text-sm text-gray-900">
                        I have read and agree to the{" "}
                        <a
                          href="https://github.com/MLH/mlh-policies/blob/main/code-of-conduct.md"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[#228CF6] underline hover:text-[#151477]"
                        >
                          MLH Code of Conduct
                        </a>
                        .<span className="text-red-600 ml-0.5">*</span>
                      </span>
                    </label>
                    {errors.mlhCoc && <p className="mt-1 ml-7 text-sm text-red-600">{errors.mlhCoc}</p>}
                  </div>

                  {/* Checkbox 2 - required */}
                  <div>
                    <label className="flex items-start gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={mlhSharing}
                        onChange={(e) => {
                          setMlhSharing(e.target.checked);
                          if (errors.mlhSharing) setErrors((prev) => ({ ...prev, mlhSharing: undefined }));
                        }}
                        className="mt-0.5 h-4 w-4 shrink-0 accent-[#151477]"
                      />
                      <span className="text-sm text-gray-900">
                        I authorize you to share my application/registration information with Major League Hacking for event administration, ranking, and administration (including the creation of linked accounts on MLH and {" "}
                        <a
                          href="https://dev.to"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[#228CF6] underline hover:text-[#151477]"
                        >
                          DEV
                        </a>
                           ) in line with the{" "}
                        <a
                          href="https://github.com/MLH/mlh-policies/blob/main/privacy-policy.md"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[#228CF6] underline hover:text-[#151477]"
                        >
                          MLH Privacy Policy
                        </a>
                        . I further agree to the terms of both the{" "}
                        <a
                          href="https://github.com/MLH/mlh-policies/blob/main/contest-terms.md"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[#228CF6] underline hover:text-[#151477]"
                        >
                          MLH Contest Terms and Conditions
                        </a>
                        {" "}and the MLH Privacy Policy.
                        <span className="text-red-600 ml-0.5">*</span>
                      </span>
                    </label>
                    {errors.mlhSharing && <p className="mt-1 ml-7 text-sm text-red-600">{errors.mlhSharing}</p>}
                  </div>

                  {/* Checkbox 3 - optional */}
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={mlhEmails}
                      onChange={(e) => setMlhEmails(e.target.checked)}
                      className="mt-0.5 h-4 w-4 shrink-0 accent-[#151477]"
                    />
                    <span className="text-sm text-gray-900">
                      I authorize MLH + DEV to send me occasional emails about relevant events, career opportunities, and community announcements.
                    </span>
                  </label>
                </div>
              </div>

              <button
                type="submit"
                className="mt-2 w-full rounded-md border-2 border-[#19E363] bg-[#151477] px-6 py-3 font-semibold text-[#EDF6FF] transition-all duration-200 hover:bg-[#19E363] hover:text-[#151477] active:scale-[0.98]"
              >
                Submit
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
