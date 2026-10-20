"use client";

import { memo, useEffect, useRef, useState } from "react";
import { InputField } from "@/components/ui/InputField";
import { supabase } from "@/lib/supabase";
import { SCHOOLS } from "./schools";
import { COUNTRIES } from "./countries";

const UNIQUE_SCHOOLS = [...new Set(SCHOOLS)];
const AGE_OPTIONS = Array.from({ length: 88 }, (_, i) => String(i + 13));
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

function formatPhone(raw: string): string {
  const digits = raw.replace(/\D/g, "").slice(0, 10);
  if (digits.length <= 3) return digits;
  if (digits.length <= 6) return `${digits.slice(0, 3)}-${digits.slice(3)}`;
  return `${digits.slice(0, 3)}-${digits.slice(3, 6)}-${digits.slice(6)}`;
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim());
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
    ? UNIQUE_SCHOOLS.filter((s) => s.toLowerCase().includes(query.toLowerCase())).slice(0, 100)
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

const REGISTRATION_INPUT_CLASS =
  "min-h-11 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-base text-gray-900 focus:border-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-500";

const SKILL_OPTIONS = [
  "Web development",
  "Mobile development",
  "AI or machine learning",
  "Data science",
  "Cybersecurity",
  "Hardware or IoT",
  "Game development",
  "Haven't decided yet",
];

function skillsFromText(value: string) {
  const skills = value
    .split(",")
    .map((skill) => skill.trim())
    .filter(Boolean);
  return skills.filter(
    (skill, index) =>
      skills.findIndex((item) => item.toLowerCase() === skill.toLowerCase()) === index,
  );
}

function SkillsMultiSelect({ error, clearError }: { error?: string; clearError: () => void }) {
  const [skillText, setSkillText] = useState("");
  const [committedText, setCommittedText] = useState("");
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const selected = skillsFromText(skillText);
  const menuSkills = [
    ...SKILL_OPTIONS,
    ...skillsFromText(committedText).filter(
      (skill) => !SKILL_OPTIONS.includes(skill) && selected.includes(skill),
    ),
  ];

  useEffect(() => {
    function closeOnOutsideClick(event: MouseEvent) {
      if (!containerRef.current?.contains(event.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", closeOnOutsideClick);
    return () => document.removeEventListener("mousedown", closeOnOutsideClick);
  }, []);

  function toggleSkill(skill: string) {
    const next = selected.some((item) => item.toLowerCase() === skill.toLowerCase())
      ? selected.filter((item) => item.toLowerCase() !== skill.toLowerCase())
      : [...selected, skill];
    const nextText = next.join(", ");
    setSkillText(nextText);
    setCommittedText(nextText);
    clearError();
  }

  return (
    <div ref={containerRef} className="relative">
      <label id="skills-label" className="mb-1 block font-semibold text-gray-900">
        Skills or technologies you want to work with<span className="text-red-600">*</span>
      </label>
      <input type="hidden" name="skills" value={JSON.stringify(selected)} />
      <div
        className={`${REGISTRATION_INPUT_CLASS} flex items-center gap-2 focus-within:border-gray-500 focus-within:ring-1 focus-within:ring-gray-500`}
      >
        <input
          ref={inputRef}
          id="skills"
          type="text"
          value={skillText}
          onChange={(event) => setSkillText(event.target.value)}
          onFocus={() => setOpen(true)}
          onClick={() => {
            if (skillText === committedText) {
              inputRef.current?.setSelectionRange(skillText.length, skillText.length);
            }
          }}
          onKeyDown={(event) => {
            if (event.key === "Escape") {
              setOpen(false);
              return;
            }
            if (event.key === "Enter") {
              event.preventDefault();
              const nextText = selected.join(", ");
              setSkillText(nextText);
              setCommittedText(nextText);
              setOpen(false);
              if (nextText) clearError();
              return;
            }
            if (
              event.key.length === 1 &&
              !event.altKey &&
              !event.ctrlKey &&
              !event.metaKey &&
              skillText.length > 0 &&
              skillText === committedText &&
              inputRef.current?.selectionStart === skillText.length &&
              inputRef.current?.selectionEnd === skillText.length
            ) {
              event.preventDefault();
              setSkillText(`${skillText}, ${event.key}`);
            }
          }}
          aria-labelledby="skills-label"
          aria-expanded={open}
          aria-controls="skills-options"
          aria-invalid={Boolean(error)}
          placeholder="Select…"
          className="min-w-0 flex-1 bg-transparent text-base text-gray-900 outline-none placeholder:text-gray-900"
        />
        <button
          type="button"
          aria-label={open ? "Hide skill options" : "Show skill options"}
          aria-expanded={open}
          aria-controls="skills-options"
          onClick={() => setOpen((current) => !current)}
          className="flex h-7 w-7 shrink-0 items-center justify-center rounded-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#151477]"
        >
          <svg
            aria-hidden="true"
            className="h-4 w-4 text-gray-700"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="m6 9 6 6 6-6" />
          </svg>
        </button>
      </div>
      {open && (
        <div
          id="skills-options"
          className="absolute left-0 right-0 z-50 border border-gray-500 bg-white"
          onKeyDown={(event) => {
            if (event.key === "Escape") setOpen(false);
          }}
        >
          <div className="max-h-48 overflow-y-auto">
            {menuSkills.map((skill) => (
              <label
                key={skill}
                className={`flex min-h-8 cursor-pointer items-center px-4 text-base text-gray-900 hover:bg-[#9bc4fa] focus-within:bg-[#9bc4fa] ${selected.includes(skill) ? "bg-[#9bc4fa]" : "bg-white"}`}
              >
                <input
                  type="checkbox"
                  checked={selected.includes(skill)}
                  onChange={() => toggleSkill(skill)}
                  className="sr-only"
                />
                {skill}
              </label>
            ))}
          </div>
        </div>
      )}
      {error && (
        <p className="mt-1 text-sm text-red-600" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

const RegistrationHackerFields = memo(function RegistrationHackerFields({
  section,
  errors,
  setErrors,
}: {
  section:
    | "identity"
    | "education"
    | "referral"
    | "demographics"
    | "logistics"
    | "technical"
    | "social"
    | "resume"
    | "sponsor";
  errors: Record<string, string>;
  setErrors: React.Dispatch<React.SetStateAction<Record<string, string>>>;
}) {
  const [showOtherDiet, setShowOtherDiet] = useState(false);
  const [resumeError, setResumeError] = useState("");
  const [resumeName, setResumeName] = useState("");
  const resumeInputRef = useRef<HTMLInputElement>(null);

  return (
    <div
      data-registration-fields
      className="flex flex-col gap-5"
      onChange={(event) => {
        const name = (event.target as HTMLInputElement).name;
        if (
          name &&
          (name !== "dietRestrictions" ||
            event.currentTarget.querySelector('input[name="dietRestrictions"]:checked'))
        ) {
          setErrors((previous) => {
            if (!previous[name]) return previous;
            const next = { ...previous };
            delete next[name];
            return next;
          });
        }
      }}
    >
      {section === "identity" && (
        <>
          <InputField
            name="preferredName"
            label="Preferred name"
            autoComplete="nickname"
            required
            aria-invalid={Boolean(errors.preferredName)}
            error={errors.preferredName}
            className={REGISTRATION_INPUT_CLASS}
          />
          <InputField
            name="pronouns"
            label="Pronouns"
            required
            aria-invalid={Boolean(errors.pronouns)}
            error={errors.pronouns}
            className={REGISTRATION_INPUT_CLASS}
          />
        </>
      )}
      {section === "education" && (
        <>
          <InputField
            name="major"
            label="Major or field of study"
            required
            aria-invalid={Boolean(errors.major)}
            error={errors.major}
            className={REGISTRATION_INPUT_CLASS}
          />
          <InputField
            name="graduationYear"
            label="Expected graduation year"
            type="number"
            inputMode="numeric"
            required
            aria-invalid={Boolean(errors.graduationYear)}
            error={errors.graduationYear}
            className={REGISTRATION_INPUT_CLASS}
          />
        </>
      )}
      {section === "technical" && (
        <>
          <div>
            <label htmlFor="hackathons" className="mb-1 block font-semibold text-gray-900">
              Previous hackathons<span className="text-red-600">*</span>
            </label>
            <select
              id="hackathons"
              name="hackathons"
              required
              aria-invalid={Boolean(errors.hackathons)}
              className={REGISTRATION_INPUT_CLASS}
            >
              <option value="">Select…</option>
              {["First hackathon", "1–2", "3–5", "6+"].map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
            {errors.hackathons && <p className="mt-1 text-sm text-red-600">{errors.hackathons}</p>}
          </div>
          <SkillsMultiSelect
            error={errors.skills}
            clearError={() =>
              setErrors((previous) => {
                if (!previous.skills) return previous;
                const next = { ...previous };
                delete next.skills;
                return next;
              })
            }
          />
          <div>
            <label htmlFor="workshopInterests" className="mb-1 block font-semibold text-gray-900">
              Would you like to attend workshops?<span className="text-red-600">*</span>
            </label>
            <select
              id="workshopInterests"
              name="workshopInterests"
              required
              aria-invalid={Boolean(errors.workshopInterests)}
              className={REGISTRATION_INPUT_CLASS}
            >
              <option value="">Select…</option>
              {["Yes", "No", "Not sure yet"].map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
            {errors.workshopInterests && (
              <p className="mt-1 text-sm text-red-600">{errors.workshopInterests}</p>
            )}
          </div>
          <div>
            <label htmlFor="teamStatus" className="mb-1 block font-semibold text-gray-900">
              Team plans<span className="text-red-600">*</span>
            </label>
            <select
              id="teamStatus"
              name="teamStatus"
              required
              aria-invalid={Boolean(errors.teamStatus)}
              className={REGISTRATION_INPUT_CLASS}
            >
              <option value="">Select…</option>
              {[
                "Looking for a team",
                "Already have a team",
                "Open to more teammates",
                "Prefer to work solo",
                "Not sure yet",
              ].map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
            {errors.teamStatus && <p className="mt-1 text-sm text-red-600">{errors.teamStatus}</p>}
          </div>
        </>
      )}
      {section === "social" && (
        <>
          <InputField
            name="githubUrl"
            label="GitHub profile"
            type="url"
            spellCheck={false}
            required
            aria-invalid={Boolean(errors.githubUrl)}
            error={errors.githubUrl}
            className={REGISTRATION_INPUT_CLASS}
          />
          <InputField
            name="linkedinUrl"
            label="LinkedIn or portfolio"
            type="url"
            spellCheck={false}
            required
            aria-invalid={Boolean(errors.linkedinUrl)}
            error={errors.linkedinUrl}
            className={REGISTRATION_INPUT_CLASS}
          />
          <InputField
            name="discordHandle"
            label="Discord handle"
            spellCheck={false}
            required
            aria-invalid={Boolean(errors.discordHandle)}
            error={errors.discordHandle}
            className={REGISTRATION_INPUT_CLASS}
          />
        </>
      )}
      {section === "referral" && (
        <>
          <div>
            <label htmlFor="referralSource" className="mb-1 block font-semibold text-gray-900">
              How did you hear about RevUC?<span className="text-red-600">*</span>
            </label>
            <select
              id="referralSource"
              name="referralSource"
              required
              aria-invalid={Boolean(errors.referralSource)}
              className={REGISTRATION_INPUT_CLASS}
            >
              <option value="">Select…</option>
              {[
                "Friend or family",
                "School or university",
                "Social media",
                "Previous RevUC event",
                "Major League Hacking",
                "Other",
              ].map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
            {errors.referralSource && (
              <p className="mt-1 text-sm text-red-600">{errors.referralSource}</p>
            )}
          </div>
        </>
      )}
      {section === "demographics" && (
        <>
          <div>
            <label htmlFor="gender" className="mb-1 block font-semibold text-gray-900">
              Gender<span className="text-red-600">*</span>
            </label>
            <select
              id="gender"
              name="gender"
              required
              aria-invalid={Boolean(errors.gender)}
              aria-describedby="demographics-help"
              className={REGISTRATION_INPUT_CLASS}
            >
              <option value="">Select…</option>
              {["Man", "Woman", "Non-binary", "Another gender", "Prefer not to answer"].map(
                (option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ),
              )}
            </select>
            {errors.gender && <p className="mt-1 text-sm text-red-600">{errors.gender}</p>}
          </div>
          <div>
            <label htmlFor="raceEthnicity" className="mb-1 block font-semibold text-gray-900">
              Race or ethnicity<span className="text-red-600">*</span>
            </label>
            <select
              id="raceEthnicity"
              name="raceEthnicity"
              required
              aria-invalid={Boolean(errors.raceEthnicity)}
              aria-describedby="demographics-help"
              className={REGISTRATION_INPUT_CLASS}
            >
              <option value="">Select…</option>
              {[
                "American Indian or Alaska Native",
                "Asian",
                "Black or African American",
                "Hispanic or Latino",
                "Middle Eastern or North African",
                "Native Hawaiian or Pacific Islander",
                "White",
                "Prefer not to answer",
              ].map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
            {errors.raceEthnicity && (
              <p className="mt-1 text-sm text-red-600">{errors.raceEthnicity}</p>
            )}
          </div>
          <p id="demographics-help" className="text-sm text-gray-600">
            Select Prefer not to answer if you do not want to disclose these details.
          </p>
        </>
      )}
      {section === "logistics" && (
        <>
          <fieldset>
            <legend className="mb-1 font-semibold text-gray-900">
              Dietary restrictions<span className="text-red-600">*</span>
            </legend>
            <div className="flex flex-col">
              {[
                "None",
                "Vegetarian",
                "Vegan",
                "Halal",
                "Kosher",
                "Gluten-free",
                "Other",
                "Prefer to discuss privately",
              ].map((option) => (
                <label
                  key={option}
                  className="flex min-h-11 cursor-pointer items-center gap-3 text-gray-900"
                >
                  <input
                    type="checkbox"
                    name="dietRestrictions"
                    value={option}
                    className="h-4 w-4 shrink-0 accent-[#151477]"
                    onChange={(event) => {
                      if (option === "Other") setShowOtherDiet(event.target.checked);
                    }}
                  />
                  {option}
                </label>
              ))}
            </div>
            {errors.dietRestrictions && (
              <p className="mt-1 text-sm text-red-600">{errors.dietRestrictions}</p>
            )}
          </fieldset>
          {showOtherDiet && (
            <InputField
              name="otherDiet"
              label="Other dietary restrictions"
              required
              aria-invalid={Boolean(errors.otherDiet)}
              error={errors.otherDiet}
              className={REGISTRATION_INPUT_CLASS}
            />
          )}
          <div>
            <label htmlFor="foodAllergies" className="mb-1 block font-semibold text-gray-900">
              Food allergies (optional)
            </label>
            <textarea
              id="foodAllergies"
              name="foodAllergies"
              rows={3}
              className={REGISTRATION_INPUT_CLASS}
            />
          </div>
          <div>
            <label htmlFor="accessibilityNeeds" className="mb-1 block font-semibold text-gray-900">
              Accessibility or accommodation requests (optional)
            </label>
            <p id="accessibility-help" className="mb-2 text-sm text-gray-600">
              Tell us what assistance you need. You do not need to share a diagnosis.
            </p>
            <textarea
              id="accessibilityNeeds"
              name="accessibilityNeeds"
              rows={3}
              aria-describedby="accessibility-help"
              className={REGISTRATION_INPUT_CLASS}
            />
          </div>
          <div>
            <label htmlFor="shirtSize" className="mb-1 block font-semibold text-gray-900">
              Shirt size<span className="text-red-600">*</span>
            </label>
            <select
              id="shirtSize"
              name="shirtSize"
              required
              aria-invalid={Boolean(errors.shirtSize)}
              className={REGISTRATION_INPUT_CLASS}
            >
              <option value="">Select…</option>
              {["XS", "S", "M", "L", "XL", "2XL", "3XL", "No shirt"].map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
            {errors.shirtSize && <p className="mt-1 text-sm text-red-600">{errors.shirtSize}</p>}
          </div>
        </>
      )}
      {section === "resume" && (
        <>
          <div>
            <label htmlFor="resume" className="mb-1 block font-semibold text-gray-900">
              Choose a PDF resume<span className="text-red-600">*</span>
            </label>
            <p id="resume-help" className="mb-2 text-sm text-gray-600">
              PDF only, up to 4 MB. Selecting a file does not upload it yet.
            </p>
            <input
              ref={resumeInputRef}
              id="resume"
              name="resume"
              type="file"
              accept=".pdf,application/pdf"
              required
              aria-describedby={
                resumeError || errors.resume ? "resume-help resume-error" : "resume-help"
              }
              aria-invalid={Boolean(resumeError || errors.resume)}
              className={REGISTRATION_INPUT_CLASS}
              onChange={(event) => {
                const file = event.currentTarget.files?.[0];
                setResumeError("");
                setResumeName("");
                if (!file) return;
                if (
                  !file.name.toLowerCase().endsWith(".pdf") ||
                  (file.type && file.type !== "application/pdf")
                ) {
                  setResumeError("Please choose a PDF file.");
                  event.currentTarget.value = "";
                } else if (file.size > 4 * 1024 * 1024) {
                  setResumeError("Please choose a PDF no larger than 4 MB.");
                  event.currentTarget.value = "";
                } else {
                  setResumeName(file.name);
                }
              }}
            />
            {(resumeError || errors.resume) && (
              <p id="resume-error" role="alert" className="mt-2 text-sm text-red-600">
                {resumeError || errors.resume}
              </p>
            )}
            {resumeName && (
              <button
                type="button"
                className="mt-2 min-h-11 rounded-md border border-[#B7D9FF] px-3 py-2 text-sm font-semibold text-[#151477] hover:bg-[#EDF6FF] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#228CF6]"
                onClick={() => {
                  if (resumeInputRef.current) {
                    resumeInputRef.current.value = "";
                    resumeInputRef.current.focus();
                  }
                  setResumeName("");
                  setResumeError("");
                }}
              >
                Remove selected resume
              </button>
            )}
          </div>
        </>
      )}
      {section === "sponsor" && (
        <>
          <label className="flex min-h-11 cursor-pointer items-start gap-3 py-2 text-sm text-gray-900">
            <input
              type="checkbox"
              name="sponsorResumeConsent"
              className="mt-0.5 h-4 w-4 shrink-0 accent-[#151477]"
            />
            I want my resume shared with authorized RevUC sponsors for recruiting.
          </label>
          <label className="flex min-h-11 cursor-pointer items-start gap-3 py-2 text-sm text-gray-900">
            <input
              type="checkbox"
              name="sponsorContactConsent"
              className="mt-0.5 h-4 w-4 shrink-0 accent-[#151477]"
            />
            RevUC sponsors may contact me about recruiting opportunities.
          </label>
        </>
      )}
    </div>
  );
});
export default function InterestPage() {
  const [submitted, setSubmitted] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [age, setAge] = useState("");
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
  const [additionalErrors, setAdditionalErrors] = useState<Record<string, string>>({});

  function handleNameChange(setter: (v: string) => void, field: keyof Errors) {
    return (e: React.ChangeEvent<HTMLInputElement>) => {
      const filtered = e.target.value.replace(/[^a-zA-Z\s]/g, "");
      setter(filtered);
      if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
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
    if (!country) next.country = "Please select your country of residence";
    if (!mlhCoc) next.mlhCoc = "You must agree to the MLH Code of Conduct";
    if (!mlhSharing) next.mlhSharing = "You must authorize MLH information sharing";

    const form = e.currentTarget;
    const nextAdditional: Record<string, string> = {};
    const requiredFields = form.querySelectorAll<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >("[data-registration-fields] [required]");
    for (const field of requiredFields) {
      if (field.validity.valueMissing || (field.type !== "file" && !field.value.trim())) {
        nextAdditional[field.name] = "This answer is required";
      } else if (!field.validity.valid) {
        nextAdditional[field.name] = "Please enter a valid value";
      }
    }
    if (form.querySelector<HTMLInputElement>('input[name="skills"]')?.value === "[]") {
      nextAdditional.skills = "Select or add at least one skill";
    }
    if (!form.querySelector('input[name="dietRestrictions"]:checked')) {
      nextAdditional.dietRestrictions = "Please select a dietary restriction or None";
    }
    setAdditionalErrors(nextAdditional);

    if (Object.keys(next).length > 0 || Object.keys(nextAdditional).length > 0) {
      setErrors(next);
      if (Object.keys(next).length === 0) {
        const firstInvalid = Array.from(
          form.querySelectorAll<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>(
            "[data-registration-fields] [name]",
          ),
        ).find((field) => nextAdditional[field.name]);
        requestAnimationFrame(() =>
          firstInvalid?.name === "skills"
            ? form.querySelector<HTMLButtonElement>("#skills")?.focus()
            : firstInvalid?.focus(),
        );
      }
      return;
    }

    const { error: dbError } = await supabase.from("hacker_interest").insert({
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
    <div
      id="hacker-interest-page"
      className="relative min-h-screen pt-24 pb-16 flex items-center justify-center px-4"
    >
      <style>{`body:has(#hacker-interest-page) > nav { position: absolute; }`}</style>
      {/* Decorative background blobs */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
        <div className="absolute -top-20 -left-20 h-96 w-96 rounded-full bg-[#228CF6]/10 blur-3xl" />
        <div className="absolute bottom-0 right-0 h-80 w-80 rounded-full bg-[#19E363]/10 blur-3xl" />
      </div>

      <div className="relative w-full max-w-lg">
        {/* Header */}
        <div className="mb-8 text-center">
          <p className="font-mono text-sm uppercase tracking-widest text-[#228CF6] mb-2"></p>
          <h1 className="text-4xl sm:text-5xl font-bold text-[#151477] leading-tight">
            Hacker Interest{" "}
            <span className="relative inline-block after:absolute after:left-0 after:-bottom-1 after:h-1 after:w-full after:bg-[#19E363]">
              Form
            </span>
          </h1>
          <p className="mt-4 text-[#151477]/70 text-base sm:text-lg">
            We are glad to know that you&apos;re interested — please fill out the interest form
            below and we&apos;ll reach out when registration opens.
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
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
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

              <RegistrationHackerFields
                section="identity"
                errors={additionalErrors}
                setErrors={setAdditionalErrors}
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
                  <option value="" disabled>
                    Select...
                  </option>
                  {AGE_OPTIONS.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
                {errors.age && <p className="mt-1 text-sm text-red-600">{errors.age}</p>}
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
                    if (errors.levelOfStudy)
                      setErrors((prev) => ({ ...prev, levelOfStudy: undefined }));
                  }}
                  className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 focus:border-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-500"
                >
                  <option value="" disabled>
                    Select...
                  </option>
                  {STUDY_LEVELS.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
                {errors.levelOfStudy && (
                  <p className="mt-1 text-sm text-red-600">{errors.levelOfStudy}</p>
                )}
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

              <RegistrationHackerFields
                section="education"
                errors={additionalErrors}
                setErrors={setAdditionalErrors}
              />

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
                  <option value="" disabled>
                    Select...
                  </option>
                  {COUNTRIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
                {errors.country && <p className="mt-1 text-sm text-red-600">{errors.country}</p>}
              </div>

              {(["referral", "demographics", "logistics", "technical", "social"] as const).map(
                (section) => (
                  <RegistrationHackerFields
                    key={section}
                    section={section}
                    errors={additionalErrors}
                    setErrors={setAdditionalErrors}
                  />
                ),
              )}

              <div className="flex flex-col gap-5 rounded-lg border border-[#B7D9FF] p-4">
                <RegistrationHackerFields
                  section="resume"
                  errors={additionalErrors}
                  setErrors={setAdditionalErrors}
                />
                <RegistrationHackerFields
                  section="sponsor"
                  errors={additionalErrors}
                  setErrors={setAdditionalErrors}
                />
              </div>

              {/* MLH Partnership Section */}
              <div className="rounded-lg border border-[#B7D9FF] bg-[#EDF6FF]/60 px-4 py-4 flex flex-col gap-4">
                <p className="text-xs text-[#151477]/70 leading-relaxed">
                  We are currently in the process of partnering with MLH. The following 3 checkboxes
                  are for this partnership. If we do not end up partnering with MLH, your
                  information will not be shared.
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
                    {errors.mlhCoc && (
                      <p className="mt-1 ml-7 text-sm text-red-600">{errors.mlhCoc}</p>
                    )}
                  </div>

                  {/* Checkbox 2 - required */}
                  <div>
                    <label className="flex items-start gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={mlhSharing}
                        onChange={(e) => {
                          setMlhSharing(e.target.checked);
                          if (errors.mlhSharing)
                            setErrors((prev) => ({ ...prev, mlhSharing: undefined }));
                        }}
                        className="mt-0.5 h-4 w-4 shrink-0 accent-[#151477]"
                      />
                      <span className="text-sm text-gray-900">
                        I authorize you to share my application/registration information with Major
                        League Hacking for event administration, ranking, and administration
                        (including the creation of linked accounts on MLH{" and "}
                        <a
                          href="dev.to"
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
                        </a>{" "}
                        and the MLH Privacy Policy.
                        <span className="text-red-600 ml-0.5">*</span>
                      </span>
                    </label>
                    {errors.mlhSharing && (
                      <p className="mt-1 ml-7 text-sm text-red-600">{errors.mlhSharing}</p>
                    )}
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
                      I authorize MLH + DEV to send me occasional emails about relevant events,
                      career opportunities, and community announcements.
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
