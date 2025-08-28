import { chromium } from 'playwright';
import fs from 'node:fs/promises';
import cfg from './clickmap.config';
import { watchConsoleAndNetwork } from './utils';

async function collectClickables(page){ return page.$$(':is(a,button,[role="button"],[data-testid],.btn,.button,.link)'); }
async function shouldSkip(el, excludes:string[]){ const txt=(await el.textContent())?.trim()||''; for(const x of excludes){ if(txt.match(new RegExp(x.replace(/^.*text\("(.+)"\).*$/,'$1'),'i'))) return true; } return false; }

async function scan(base:string, path:string, clicks:any[]){
  const browser = await chromium.launch();
  const ctx = await browser.newContext();
  const page = await ctx.newPage();
  const errs = watchConsoleAndNetwork(page);
  await page.goto(base + path, { waitUntil:'domcontentloaded', timeout: cfg.navTimeoutMs }).catch(e=>errs.push({type:'nav',text:String(e)}));
  const els = await collectClickables(page);
  for(const el of els.slice(0, cfg.maxClicksPerPage)){
    try{
      if(await shouldSkip(el, cfg.exclude)) continue;
      const from = page.url();
      const label = (await el.textContent())?.trim() || await el.getAttribute('aria-label') || 'el';
      await el.click({ trial:true }).catch(()=>{});
      await el.click().catch(()=>{});
      await page.waitForLoadState('domcontentloaded', { timeout: cfg.navTimeoutMs }).catch(()=>{});
      clicks.push({ from, to: page.url(), label });
      await page.title();
    }catch(e){ errs.push({ type:'click', text:String(e) }); }
  }
  await fs.mkdir('artifacts', { recursive:true });
  await fs.writeFile(`artifacts/clickmap-${path.replace(/\W/g,'_')}.json`, JSON.stringify({ base, path, clicks, errors:errs }, null, 2));
  await browser.close();
  return errs;
}

(async()=>{
  const bases = Array.from(new Set([cfg.baseLanding, cfg.baseApp]));
  const clicks:any[] = []; const allErrs:any[]=[];
  for(const b of bases){ for(const p of cfg.entryPaths){ const e=await scan(b,p,clicks); allErrs.push(...e); } }
  await fs.writeFile('artifacts/clickmap-summary.json', JSON.stringify({ clicks, errors: allErrs }, null, 2));
  if(allErrs.length){ console.error('CLICKMAP FAIL:', allErrs.slice(0,10)); process.exit(1); }
})();
