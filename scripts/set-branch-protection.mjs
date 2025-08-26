import fetch from "node-fetch";

const repo = process.env.GITHUB_REPOSITORY; // owner/repo
const [owner, repoName] = repo.split("/");
const token = process.env.ADMIN_TOKEN;
const branch = "main";

const url = `https://api.github.com/repos/${owner}/${repoName}/branches/${branch}/protection`;

// Require ONLY the single context "Release Check / release"
const body = {
  required_status_checks: {
    strict: false,
    contexts: ["Release Check / release"],
  },
  enforce_admins: true,
  required_pull_request_reviews: null,
  restrictions: null,
};

const res = await fetch(url, {
  method: "PUT",
  headers: {
    Authorization: `Bearer ${token}`,
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
  },
  body: JSON.stringify(body),
});

if (!res.ok) {
  const txt = await res.text();
  console.error("Failed to set branch protection:", res.status, txt);
  process.exit(1);
} else {
  console.log(
    'Branch protection updated to require: "Release Check / release"',
  );
}
