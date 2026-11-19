
function parseProfile(
  value: string,
  field: "github" | "linkedin"
) {
  const label = field === "github" ? "GitHub" : "LinkedIn";

  let url: URL;

  try {
    const input = value.trim();

    url = new URL(
      /^https?:\/\//i.test(input) ? input : `https://${input}`
    );

    const allowedHosts =
      field === "github"
        ? ["github.com", "www.github.com"]
        : ["linkedin.com", "www.linkedin.com"];

    if (
      !["https:", "http:"].includes(url.protocol) ||
      url.username ||
      url.password ||
      url.port ||
      !allowedHosts.includes(url.hostname.toLowerCase())
    ) {
      throw new Error("Invalid URL");
    }
  } catch {
    return {
      error: `Enter a valid ${label} profile URL.`,
      status: 400,
    };
  }

  const match =
    field === "github"
      ? url.pathname.match(
          /^\/([a-z\d](?:[a-z\d-]{0,37}[a-z\d])?)\/?$/i
        )
      : url.pathname.match(
          /^\/in\/([a-z\d_-]+)\/?$/i
        );

  if (!match) {
    return {
      error: `Enter a valid ${label} profile URL.`,
      status: 400,
    };
  }

  const username = match[1];

  const canonical =
    field === "github"
      ? `https://github.com/${username}`
      : `https://www.linkedin.com/in/${username}/`;

  return { url: canonical, username };
}

export function isValidProfileUrl(value: string, domain: string): boolean {
  return !parseProfile(value, domain === "github.com" ? "github" : "linkedin").error;
}

export async function validateProfile(value: string, field: "github" | "linkedin"): Promise<
  { error: string; status: number; url?: never; verified?: never } |
  { url: string; verified: boolean; error?: never; status?: never }
> {
  const parsed = parseProfile(value, field);
  if (parsed.error !== undefined) return { error: parsed.error, status: parsed.status };
  const { url: canonical, username } = parsed;

  if (field === "linkedin") {
    return { url: canonical, verified: false };
  }

  try {
    const response = await fetch(
      `https://api.github.com/users/${username}`,
      {
        redirect: "manual",
        cache: "no-store",
        signal: AbortSignal.timeout(8000),
        headers: {
          Accept: "application/vnd.github+json",
          "User-Agent": "RevolutionUC-Registration",
        },
      }
    );

    if (response.status === 404 || response.status === 410) {
      return {
        error: "GitHub profile was not found. Please check the URL.",
        status: 400,
      };
    }

    if (response.ok) {
      const profile = await response.json();

      if (
        profile.type === "User" &&
        typeof profile.login === "string" &&
        profile.login.toLowerCase() === username.toLowerCase()
      ) {
        return { url: canonical, verified: true };
      }

      if (profile.type === "Organization") {
        return {
          error: "Enter a GitHub user profile, rather than an organization URL.",
          status: 400,
        };
      }
    }
  } catch {
    
  }

  return { url: canonical, verified: false };
}
