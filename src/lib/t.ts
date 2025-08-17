/** tiny copy helper with english/taglish variants and simple runtime switching */
export type Messages = Record<string, string>;
export type Bundle = { english: Messages; taglish: Messages };

const english: Messages = {
  site_title: "QuickGig • Find Gigs Fast in the Philippines",
  nav_find: "Find work",
  nav_saved: "Saved",
  nav_post: "Post a job",
  nav_signin: "Sign in",
  nav_signout: "Sign out",
  nav_language: "Language",
  home_hero_title: "Hanap trabaho made simple",
  home_hero_tag: "Search gigs near you and apply in minutes.",
  search_placeholder: "Search jobs (keyword, company…)",
  search_filters: "Filters",
  jobs_featured: "Featured jobs",
  saved_title: "Saved jobs",
  job_apply: "Apply now",
  job_applied: "Applied",
  job_save: "Save",
  job_saved: "Saved",
  login_title: "Sign in",
  apply_title: "Apply to this job",
  employer_post: "Post a job",
  not_found: "Page not found",
};

const taglish: Messages = {
  site_title: "QuickGig • Hanap Trabaho, Bilis!",
  nav_find: "Hanap trabaho",
  nav_saved: "Na-save",
  nav_post: "Mag-post ng trabaho",
  nav_signin: "Mag-log in",
  nav_signout: "Mag-log out",
  nav_language: "Wika",
  home_hero_title: "Hanap trabaho, walang abala",
  home_hero_tag: "Mag-search ng gigs malapit sa’yo at mag-apply agad.",
  search_placeholder: "Maghanap ng trabaho (keyword, company…)",
  search_filters: "Mga filter",
  jobs_featured: "Mga tampok na trabaho",
  saved_title: "Mga na-save na trabaho",
  job_apply: "Mag-apply ngayon",
  job_applied: "Nakapag-apply na",
  job_save: "I-save",
  job_saved: "Na-save",
  login_title: "Mag-log in",
  apply_title: "Mag-apply sa trabahong ito",
  employer_post: "Mag-post ng trabaho",
  not_found: "Hindi makita ang page",
};

const bundle: Bundle = { english, taglish };

function readVariantFromEnv(): keyof Bundle {
  const v = (process.env.NEXT_PUBLIC_COPY_VARIANT || "english").toLowerCase();
  return (v === "taglish" ? "taglish" : "english") as keyof Bundle;
}

/** Decide variant: ?lang=tl|en > localStorage('copyVariant') > env */
export function getVariantRuntime(): keyof Bundle {
  if (typeof window === "undefined") return readVariantFromEnv();
  const u = new URL(window.location.href);
  const q = u.searchParams.get("lang");
  if (q === "tl") return "taglish";
  if (q === "en") return "english";
  const saved = window.localStorage.getItem("copyVariant");
  if (saved === "taglish" || saved === "english") return saved as keyof Bundle;
  return readVariantFromEnv();
}

export function setVariantRuntime(v: "english" | "taglish") {
  if (typeof window !== "undefined") {
    window.localStorage.setItem("copyVariant", v);
  }
}

export function t(key: keyof typeof english): string {
  const v = getVariantRuntime();
  return (bundle[v][key] ?? bundle.english[key] ?? key) as string;
}
