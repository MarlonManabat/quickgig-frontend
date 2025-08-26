import { test, expect } from "@playwright/test";
import { stubAuth } from "./utils/stubAuth";

test("nav audit", async ({ page }) => {
  await stubAuth(page);
  const targets: {
    id: string;
    path: string | RegExp;
    marker: string | string[];
  }[] = [
    { id: "nav-find", path: "/find", marker: "gigs-list" },
    { id: "nav-my-gigs", path: "/gigs?mine=1", marker: "my-gigs" },
    {
      id: "nav-applications",
      path: "/applications",
      marker: "applications-list",
    },
    { id: "nav-saved", path: "/saved", marker: "saved-list" },
    {
      id: "nav-post",
      path: /\/(billing|post)/,
      marker: ["paywall-redirect", "gig-editor"],
    },
    { id: "nav-profile", path: "/profile", marker: "profile-save" },
  ];

  const ctaMap: Record<
    string,
    { path: string | RegExp; marker: string | string[] }
  > = {
    "cta-find": { path: "/find", marker: "gigs-list" },
    "cta-post": {
      path: /\/(billing|post)/,
      marker: ["paywall-redirect", "gig-editor"],
    },
  };

  await page.goto("/");

  for (const id of Object.keys(ctaMap)) {
    if (await page.getByTestId(id).count()) {
      targets.push({ id, ...ctaMap[id] });
    }
  }

  for (const t of targets) {
    await page.getByTestId(t.id).click();
    await page.waitForLoadState("networkidle");
    expect(page.url()).toMatch(t.path);
    const markers = Array.isArray(t.marker) ? t.marker : [t.marker];
    let found = false;
    for (const m of markers) {
      if ((await page.getByTestId(m).count()) > 0) {
        found = true;
        break;
      }
      if ((await page.getByRole("heading", { name: m }).count()) > 0) {
        found = true;
        break;
      }
    }
    expect(found).toBeTruthy();
    await page.goto("/");
  }
});
