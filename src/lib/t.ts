/** tiny copy helper with english/taglish variants and simple runtime switching */
export type Messages = Record<string, string>;
export type Bundle = { english: Messages; taglish: Messages };

const english: Messages = {
  site_title: "QuickGig • Find Gigs Fast in the Philippines",
  nav_find: "Find work",
  nav_saved: "Saved",
  nav_account: "Account",
  nav_account_desc: "Your saved and applied jobs",
  nav_post: "Post a job",
  nav_post_job: "Post a job",
  nav_signin: "Sign in",
  nav_signout: "Sign out",
  nav_language: "Language",
  home_hero_title: "Hanap trabaho made simple",
  home_hero_cta: "Search gigs near you and apply in minutes.",
  search_placeholder: "Search jobs (keyword, company…)",
  search_filters: "Filters",
  search_title: "Find work",
  search_empty: "No results yet. Try different keywords or clearing filters.",
  search_results_count: "{total} results",
  jobs_featured: "Featured jobs",
  saved_title: "Saved jobs",
  saved_empty: "You haven’t saved any jobs yet.",
  saved_badge: "Saved",
  applied_title: "Applied",
  applied_empty: "Nothing yet. Apply now!",
  applied_badge: "Applied",
  job_apply: "Apply now",
  job_applied: "Applied",
  job_save: "Save",
  job_saved: "Saved",
  job_apply_title: "Apply to this job",
  apply_name: "Full name",
  apply_email: "Email",
  apply_resume: "Resume or note",
  apply_submit: "Submit application",
  apply_success: "Thanks! Your application was received.",
  apply_error: "Something went wrong. Please try again.",
  login_title: "Sign in",
  login_email: "Email",
  login_password: "Password",
  login_submit: "Sign in",
  login_hint: "Use your email and password. No account? it's okay, not required yet.",
  navbar_signin: "Sign in",
  navbar_account: "Account",
  navbar_employer_inbox: "Employer inbox",
  navbar_logout: "Logout",
  employer_post: "Post a job",
  employer_title: "Employer",
  employer_jobs_title: "My jobs",
  employer_applicants_title: "Applicants",
  employer_empty: "No applicants yet.",
  jobs_title: "Jobs",
  applicants_title: "Applicants",
  status_new: "New",
  status_shortlist: "Shortlist",
  status_interview: "Interview",
  status_hired: "Hired",
  status_rejected: "Rejected",
  shortlist: "Shortlist",
  interview: "Interview",
  hire: "Hire",
  reject: "Reject",
  bulk_selected: "{n} selected",
  export_csv: "Export CSV",
  copy_emails: "Copy Emails",
  notes: "Notes",
  notes_placeholder: "Add notes…",
  copied_to_clipboard: "Copied to clipboard",
  no_applicants_for_filter: "No applicants for this filter",
  applicants_empty: "No applicants yet. Share the job link to get applications.",
  view_applicants: "View applicants",
  my_jobs: "My jobs",
  footer_about: "About",
  footer_terms: "Terms",
  footer_privacy: "Privacy",
  footer_copyright: "© {year} QuickGig.ph",
  err404_title: "Page not found",
  err404_body: "We couldn’t find that page. Try the homepage.",
  err500_title: "Something went wrong",
  err500_body: "Please retry or go back to the homepage.",
  not_found: "Page not found",
};

const taglish: Messages = {
  site_title: "QuickGig • Hanap Trabaho, Bilis!",
  nav_find: "Hanap trabaho",
  nav_saved: "Na-save",
  nav_account: "Account",
  nav_account_desc: "Mga na-save at inaplayan mo",
  nav_post: "Mag-post ng trabaho",
  nav_post_job: "Mag-post ng trabaho",
  nav_signin: "Mag-log in",
  nav_signout: "Mag-log out",
  nav_language: "Wika",
  home_hero_title: "Hanap trabaho, walang abala",
  home_hero_cta: "Mag-search ng gigs malapit sa’yo at mag-apply agad.",
  search_placeholder: "Maghanap ng trabaho (keyword, company…)",
  search_filters: "Mga filter",
  search_title: "Hanap trabaho",
  search_empty: "Wala pang resulta. Subukan ibang keywords o linisin ang filters.",
  search_results_count: "{total} resulta",
  jobs_featured: "Mga tampok na trabaho",
  saved_title: "Mga na-save na trabaho",
  saved_empty: "Wala ka pang na-save na trabaho.",
  saved_badge: "Na-save",
  applied_title: "Inaplayan",
  applied_empty: "Wala pa. Mag-apply na!",
  applied_badge: "Nakapag-apply",
  job_apply: "Mag-apply ngayon",
  job_applied: "Nakapag-apply na",
  job_save: "I-save",
  job_saved: "Na-save",
  job_apply_title: "Mag-apply sa trabahong ito",
  apply_name: "Buong pangalan",
  apply_email: "Email",
  apply_resume: "Resume o mensahe",
  apply_submit: "Isumite ang application",
  apply_success: "Salamat! Natanggap na ang application mo.",
  apply_error: "May nangyaring mali. Pakisubukang muli.",
  login_title: "Mag-log in",
  login_email: "Email",
  login_password: "Password",
  login_submit: "Mag-log in",
  login_hint: "Gamitin ang email at password mo. Walang account? okay lang, di muna required.",
  navbar_signin: "Mag-log in",
  navbar_account: "Account",
  navbar_employer_inbox: "Employer inbox",
  navbar_logout: "Mag-log out",
  employer_post: "Mag-post ng trabaho",
  employer_title: "Employer",
  employer_jobs_title: "Mga trabaho ko",
  employer_applicants_title: "Mga aplikante",
  employer_empty: "Wala pang nag-apply",
  jobs_title: "Mga trabaho",
  applicants_title: "Mga aplikante",
  status_new: "Bago",
  status_shortlist: "Shortlist",
  status_interview: "Interview",
  status_hired: "Hired",
  status_rejected: "Rejected",
  shortlist: "Shortlist",
  interview: "Interview",
  hire: "Hire",
  reject: "Reject",
  bulk_selected: "{n} napili",
  export_csv: "I-export ang CSV",
  copy_emails: "Kopyahin emails",
  notes: "Notes",
  notes_placeholder: "Magdagdag ng notes…",
  copied_to_clipboard: "Nakopya na sa clipboard",
  no_applicants_for_filter: "Walang applicants sa filter na ito",
  applicants_empty: "Wala pang applicants. Share mo ang job link para makakuha ng mga application.",
  view_applicants: "Tingnan ang mga aplikante",
  my_jobs: "Mga trabaho ko",
  footer_about: "Tungkol",
  footer_terms: "Terms",
  footer_privacy: "Privacy",
  footer_copyright: "© {year} QuickGig.ph",
  err404_title: "Hindi makita ang page",
  err404_body: "Wala kaming mahanap na ganyang page. Balik sa homepage.",
  err500_title: "May aberya",
  err500_body: "Paki-reload o bumalik sa homepage.",
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
  if (q === "tl") {
    window.localStorage.setItem("copyVariant", "taglish");
    return "taglish";
  }
  if (q === "en") {
    window.localStorage.setItem("copyVariant", "english");
    return "english";
  }
  const saved = window.localStorage.getItem("copyVariant");
  if (saved === "taglish" || saved === "english") return saved as keyof Bundle;
  return readVariantFromEnv();
}

export function setVariantRuntime(v: "english" | "taglish") {
  if (typeof window !== "undefined") {
    window.localStorage.setItem("copyVariant", v);
  }
}

export function t(key: keyof typeof english, vars?: Record<string, string | number>): string {
  const v = getVariantRuntime();
  const str = (bundle[v][key] ?? bundle.english[key] ?? key) as string;
  return str.replace(/\{(\w+)\}/g, (_, k) => (vars?.[k] ?? "") as string);
}
