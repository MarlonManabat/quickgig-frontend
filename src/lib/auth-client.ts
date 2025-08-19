export async function apiLogin(payload:{identifier:string; password:string}) {
  const r = await fetch('/api/session/login', { method:'POST', headers:{'content-type':'application/json'}, body: JSON.stringify(payload) });
  if (!r.ok) throw new Error((await r.json()).message ?? 'Login failed');
}
export async function apiRegister(payload:{name:string; email:string; password:string}) {
  const r = await fetch('/api/session/register', { method:'POST', headers:{'content-type':'application/json'}, body: JSON.stringify(payload) });
  if (!r.ok) throw new Error((await r.json()).message ?? 'Register failed');
}
export async function apiLogout(){ await fetch('/api/session/logout',{ method:'POST' }); }
export async function apiMe(){ const r=await fetch('/api/session/me',{ cache:'no-store' }); return r.ok ? r.json() : null; }
