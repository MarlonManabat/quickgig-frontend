#!/usr/bin/env node
/**
 * check-cta-links.mjs
 * QuickGig CTA verifier for landing + app.
 *
 * - Node >= 20 (uses global fetch)
 * - No external deps
 * - Reads BASE_URLS env (comma-separated). Defaults to quickgig + app.
 *
 * What it checks
 * 1) Landing CTAs ("Find Work"/"Browse jobs"/"Simulan na", "Post a Job") → App domain, sensible paths.
 * 2) App domain: "/" resolves to browse; header CTAs: Browse Jobs, My Applications, Post Job.
 * 3) Targets return 2xx/3xx and not the “Something went wrong / Go home” page.
 */

import { URL } from "node:url";

// --- Config -----------------------------------------------------------------

const DEFAULT_BASES = ["https://quickgig.ph", "https://app.quickgig.ph"];

const rawBases = (process.env.BASE_URLS || "").trim();
const BASES = (rawBases ? rawBases : DEFAULT_BASES.join(","))
  .split(",")
  .map(s => s.trim())
  .filter(Boolean);

// Allowed path patterns (flexible to avoid churn)
const RX = {
  browse: /\/(browse[-/]?jobs?|jobs(\/)?$|jobs\/browse)/i,
  postJob: /\/(post[-/]?job|jobs\/new|employer\/post)/i,
  applications: /\/(my[-/]?applications|applications)/i,
};

const CTA = {
  browseKeywords: ["find work","maghanap","browse jobs","browse job","simulan","start now","simulan na"],
  postKeywords: ["post a job","post job","mag-post","create job","publish job"],
  appsKeywords: ["my applications","applications","aplikasyon"],
};

// --- Utilities ---------------------------------------------------------------

const sleep = (ms)=> new Promise(r=>setTimeout(r, ms));

function stripTags(html){
  return html
    .replace(/<script[\s\S]*?<\/script>/gi,"")
    .replace(/<style[\s\S]*?<\/style>/gi,"")
    .replace(/<[^>]+>/g," ")
    .replace(/\s+/g," ")
    .trim();
}

function* extractAnchors(html){
  const re = /<a\b([^>]*?)>([\s\S]*?)<\/a>/gi;
  let m;
  while((m = re.exec(html))){
    const attrs = m[1] || "";
    const inner = stripTags(m[2] || "").toLowerCase();
    const hrefM = attrs.match(/\bhref\s*=\s*["']([^"']+)["']/i);
    if(!hrefM) continue;
    const href = hrefM[1].trim();
    yield { href, text: inner };
  }
}

function normalizeUrl(base, href){
  try{
    if(/^https?:\/\//i.test(href)) return new URL(href).toString();
    return new URL(href, base).toString();
  }catch{return null;}
}

async function fetchFollow(url, opts={}){
  const res = await fetch(url, { redirect: "follow", ...opts });
  const finalUrl = res.url || url;
  const text = await res.text();
  const ok = res.ok || (res.status >= 200 && res.status < 400);
  return { ok, status: res.status, url: finalUrl, text };
}

function looksLikeErrorPage(html){
  const t = (html || "").toLowerCase();
  return t.includes("something went wrong") && t.includes("go home");
}

function findByKeywords(anchors, keywords){
  return anchors.find(a => keywords.some(k => a.text.includes(k)));
}

function hostKind(u){
  try{
    const h = new URL(u).hostname;
    return h.includes("app.") ? "app" : "landing";
  }catch{return "unknown";}
}

function okPath(u, rx){
  try{
    const p = new URL(u).pathname;
    return rx.test(p);
  }catch{
    return rx.test(u);
  }
}

function printHeader(title){
  console.log("\n\u001b[1m" + title + "\u001b[0m");
}

// --- Checks ------------------------------------------------------------------

async function checkLanding(base){
  const errors = [];
  printHeader(`Landing checks @ ${base}`);

  const root = await fetchFollow(base);
  if(!root.ok) errors.push(`Landing root ${base} returned HTTP ${root.status}`);
  if(looksLikeErrorPage(root.text)) errors.push(`Landing root rendered an error page.`);

  const anchors = Array.from(extractAnchors(root.text))
    .map(a => ({ ...a, abs: normalizeUrl(base, a.href)}))
    .filter(a => !!a.abs);

  const aBrowse = findByKeywords(anchors, CTA.browseKeywords);
  if(!aBrowse){
    errors.push(`Missing "Find Work / Browse / Simulan na" CTA on landing.`);
  }else{
    const dest = aBrowse.abs;
    if(hostKind(dest) !== "app") errors.push(`Landing browse CTA must point to App domain; got ${dest}`);
    if(!okPath(dest, RX.browse)) errors.push(`Landing browse CTA path should look like /browse-jobs; got ${dest}`);
    const r = await fetchFollow(dest);
    if(!r.ok) errors.push(`Landing browse target HTTP ${r.status} (${dest})`);
    if(looksLikeErrorPage(r.text)) errors.push(`Landing browse target shows error page (${dest}).`);
    console.log(`✓ Landing browse CTA → ${r.url} [${r.status}]`);
  }

  const aPost = findByKeywords(anchors, CTA.postKeywords);
  if(!aPost){
    errors.push(`Missing "Post a Job" CTA on landing.`);
  }else{
    const dest = aPost.abs;
    if(hostKind(dest) !== "app") errors.push(`Landing post-job CTA must point to App domain; got ${dest}`);
    if(!okPath(dest, RX.postJob)) errors.push(`Landing post-job CTA should look like /post-job; got ${dest}`);
    const r = await fetchFollow(dest);
    if(!r.ok) errors.push(`Landing post-job target HTTP ${r.status} (${dest})`);
    if(looksLikeErrorPage(r.text)) errors.push(`Landing post-job target shows error page (${dest}).`);
    console.log(`✓ Landing post-job CTA → ${r.url} [${r.status}]`);
  }

  return errors;
}

async function checkApp(base){
  const errors = [];
  printHeader(`App checks @ ${base}`);

  const root = await fetchFollow(base);
  if(!root.ok) errors.push(`App root ${base} returned HTTP ${root.status}`);
  if(looksLikeErrorPage(root.text)) errors.push(`App root rendered an error page.`);
  if(!okPath(root.url, RX.browse)){
    errors.push(`App "/" should resolve to a browse page. Final URL: ${root.url}`);
  }else{
    console.log(`✓ App "/" resolves to ${root.url}`);
  }

  const anchors = Array.from(extractAnchors(root.text))
    .map(a => ({ ...a, abs: normalizeUrl(root.url, a.href)}))
    .filter(a => !!a.abs);

  const aApps = findByKeywords(anchors, CTA.appsKeywords);
  if(!aApps){
    errors.push(`Missing "My Applications" link on app page.`);
  }else{
    const r = await fetchFollow(aApps.abs);
    if(!okPath(r.url, RX.applications)) errors.push(`"My Applications" path should look like /applications; got ${r.url}`);
    if(!r.ok) errors.push(`"My Applications" HTTP ${r.status} (${r.url})`);
    if(looksLikeErrorPage(r.text)) errors.push(`"My Applications" shows error page (${r.url}).`);
    console.log(`✓ My Applications → ${r.url} [${r.status}]`);
  }

  const aPost = findByKeywords(anchors, CTA.postKeywords);
  if(!aPost){
    errors.push(`Missing "Post Job" link on app page.`);
  }else{
    const r = await fetchFollow(aPost.abs);
    if(!okPath(r.url, RX.postJob)) errors.push(`"Post Job" path should look like /post-job; got ${r.url}`);
    if(!r.ok) errors.push(`"Post Job" HTTP ${r.status} (${r.url})`);
    if(looksLikeErrorPage(r.text)) errors.push(`"Post Job" shows error page (${r.url}).`);
    console.log(`✓ Post Job → ${r.url} [${r.status}]`);
  }

  return errors;
}

// --- Main -------------------------------------------------------------------

(async()=>{
  if(BASES.length === 0){
    console.error("No BASE_URLS provided and no defaults available.");
    process.exit(1);
  }

  console.log(`Checking CTAs for: ${BASES.join(", ")}`);

  const allErrors = [];
  for(const base of BASES){
    await sleep(100);
    const kind = hostKind(base);
    if(kind === "landing"){
      allErrors.push(...await checkLanding(base));
    }else if(kind === "app"){
      allErrors.push(...await checkApp(base));
    }else{
      const isAppish = /(^|\.)app[.-]/i.test(new URL(base).hostname);
      allErrors.push(...await (isAppish ? checkApp(base) : checkLanding(base)));
    }
  }

  if(allErrors.length){
    console.error("\n❌ CTA checks failed:");
    for(const e of allErrors) console.error(" - " + e);
    console.error('\nHint:\n  BASE_URLS="https://quickgig.ph,https://app.quickgig.ph" node scripts/check-cta-links.mjs');
    process.exit(1);
  }

  console.log("\n✅ All CTA checks passed.");
  process.exit(0);
})().catch(err=>{
  console.error("Unhandled error in CTA check:", err?.stack || err);
  process.exit(1);
});
