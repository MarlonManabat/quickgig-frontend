import type { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from '@/lib/auth';
import { getProfile, saveProfile } from '@/lib/profileStore';
const MODE = process.env.ENGINE_AUTH_MODE || 'mock';
const BASE = process.env.ENGINE_BASE_URL || '';

export default async function handler(req:NextApiRequest,res:NextApiResponse){
  const user = await getSession(req); // or fallback mock user
  const seed = { id:user?.id||'me', email:user?.email||'' , name:user?.name||'' };
  if(req.method==='GET'){
    if(MODE==='mock') return res.status(200).json(getProfile(seed));
    const r = await fetch(`${BASE}/api/account/profile`,{ headers:{ cookie: req.headers.cookie||'' }});
    return res.status(r.status).send(await r.text());
  }
  if(req.method==='PUT'){
    if(MODE==='mock') return res.status(200).json(saveProfile({ ...getProfile(seed), ...req.body }));
    const r = await fetch(`${BASE}/api/account/profile`,{ method:'PUT', headers:{ 'content-type':'application/json', cookie:req.headers.cookie||'' }, body: JSON.stringify(req.body)});
    return res.status(r.status).send(await r.text());
  }
  res.status(405).end();
}
