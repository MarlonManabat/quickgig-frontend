import { promises as fs } from "fs"; import path from "path";
async function* walk(d){for(const e of await fs.readdir(d,{withFileTypes:true}).catch(()=>[])){const p=path.join(d,e.name);if(e.isDirectory()) yield* walk(p);else if(/\.(m?[jt]sx?)$/.test(e.name)) yield p}}
const issues=[]; for (const root of ["pages","app"]) {
  for await (const f of walk(root)) {
    const t=await fs.readFile(f,"utf8").catch(()=>""), m=t.match(/export\s+const\s+revalidate\s*=\s*([^\n;]+)/);
    if (m) { const v=m[1].trim(), ok=/^\d+$/.test(v)||/^(false|0|true)$/.test(v)||/^process\.env\./.test(v); if(!ok) issues.push(`${f}: revalidate=${v}`) }
  }
}
if (issues.length){ console.error(issues.join("\n")); process.exit(1)} else console.log("revalidate OK");
