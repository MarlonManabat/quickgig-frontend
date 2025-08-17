import { Message, Thread } from '@/types/messages';
const TKEY='qq_threads', MKEY='qq_msgs';
const now = ()=>new Date().toISOString();

const read = <T>(k:string, d:T)=> typeof window==='undefined' ? d : (JSON.parse(localStorage.getItem(k)||'null') ?? d);
const write = (k:string, v: unknown)=> { if(typeof window!=='undefined') localStorage.setItem(k, JSON.stringify(v)); };

export function listThreads(userId: string): Thread[] {
  const ts: Thread[] = read(TKEY, []);
  return ts.filter(t=>t.participants.includes(userId)).sort((a,b)=>b.lastMessageAt.localeCompare(a.lastMessageAt));
}
export function getThread(id:string){ const ts:Thread[]=read(TKEY,[]); return ts.find(t=>t.id===id)||null; }
export function ensureThread(a:string,b:string, jobId?:string, title?:string){
  const ts:Thread[]=read(TKEY,[]);
  const found = ts.find(t=> t.participants.includes(a)&&t.participants.includes(b)&&t.jobId===jobId);
  if(found) return found;
  const t:Thread={ id:crypto.randomUUID(), participants:[a,b], jobId, title, lastMessageAt:now(), unreadFor:[b] };
  ts.push(t); write(TKEY,ts); return t;
}
export function listMessages(threadId:string): Message[] {
  const ms:Message[]=read(MKEY,[]); return ms.filter(m=>m.threadId===threadId).sort((a,b)=>a.createdAt.localeCompare(b.createdAt));
}
export function sendMessage(thread:Thread, fromId:string, toId:string, body:string){
  const ms:Message[]=read(MKEY,[]);
  const m:Message={ id:crypto.randomUUID(), threadId:thread.id, fromId, toId, body, createdAt:now(), read:false };
  ms.push(m); write(MKEY,ms);
  const ts:Thread[]=read(TKEY,[]);
  const idx = ts.findIndex(t=>t.id===thread.id);
  if(idx>=0){ ts[idx].lastMessageAt=m.createdAt; ts[idx].unreadFor = Array.from(new Set([...(ts[idx].unreadFor||[]).filter(u=>u!==fromId), toId])); write(TKEY,ts); }
  return m;
}
export function markRead(threadId:string, userId:string){
  const ts:Thread[]=read(TKEY,[]); const t=ts.find(x=>x.id===threadId); if(t){ t.unreadFor=(t.unreadFor||[]).filter(u=>u!==userId); write(TKEY,ts); }
  const ms:Message[]=read(MKEY,[]); ms.forEach(m=>{ if(m.threadId===threadId && m.toId===userId) m.read=true; }); write(MKEY,ms);
}
export function unreadCount(userId:string){ const ts:Thread[]=read(TKEY,[]); return ts.filter(t=>t.unreadFor?.includes(userId)).length; }
