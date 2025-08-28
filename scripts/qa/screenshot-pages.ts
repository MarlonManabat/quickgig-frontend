import { chromium } from "playwright";
import fs from "fs/promises";

const BASE = (process.env.BASE_URL ?? "http://localhost:3000").replace(/\/$/, "");

type PageSpec = { path: string; waitFor: string; file: string };
const pages: PageSpec[] = [
  { path: "/", waitFor: "[data-testid=app-header]", file: "home.png" },
  { path: "/jobs/new", waitFor: "[data-testid=job-form]", file: "jobs-new.png" },
  { path: "/jobs", waitFor: "[data-testid=jobs-list]", file: "jobs-list.png" },
  {
    path: "/applications",
    waitFor: "[data-testid=applications-page]",
    file: "applications.png",
  },
  { path: "/messages", waitFor: "[data-testid=messages-page]", file: "messages.png" },
];

(async () => {
  const browser = await chromium.launch();
  const ctx = await browser.newContext({ viewport: { width: 1366, height: 900 } });
  const page = await ctx.newPage();

  const outDir = "test-results/screens";
  await fs.mkdir(outDir, { recursive: true });

  for (const p of pages) {
    const url = `${BASE}${p.path}`;
    try {
      console.log(`Visiting ${url}`);
      const resp = await page.goto(url, {
        waitUntil: "domcontentloaded",
        timeout: 60_000,
      });
      if (!resp) throw new Error("no response");
      await page.waitForLoadState("networkidle", { timeout: 60_000 }).catch(() => {});
      await page.waitForSelector(p.waitFor, { state: "visible", timeout: 60_000 });
      await page.screenshot({ path: `${outDir}/${p.file}`, fullPage: true });
    } catch (e) {
      console.warn(`WARN: Failed to capture ${url}:`, e);
      const msg = String(e);
      await page.setContent(
        `<div style=\"width:100%;height:100%;display:flex;align-items:center;justify-content:center;background:#fee;border:4px solid #f00;font-family:sans-serif;font-size:32px;color:#900;\">Failed to load ${url}: ${msg.replace(/"/g, '&quot;')}\</div>`
      );
      await page.screenshot({ path: `${outDir}/${p.file}`, fullPage: true });
    }
  }

  await browser.close();
})();

