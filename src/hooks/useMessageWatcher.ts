'use client';
import { useEffect, useRef } from 'react';
import { toast } from '@/lib/toast';
import { push, ensurePermission } from '@/lib/notify';

export function useMessageWatcher(enabled:boolean){
  const last = useRef<number>(0);
  useEffect(()=>{ if(!enabled) return;
    (async()=>{ try{ await ensurePermission(); }catch{} })();
    const poll = async()=>{
      try{
        const r = await fetch('/api/messages?latest=1',{cache:'no-store'});
        const j = await r.json();
        const ts = j?.latest ? Date.parse(j.latest.createdAt) : 0;
        if(j?.latest && ts>last.current){
          last.current=ts;
          const url = `/messages/${j.latest.threadId}`;
            (toast as unknown as { success?: (title:string, opts?: unknown)=>void }).success?.('New message', { description: j.latest.preview, action:{ label:'Open', onClick(){ location.assign(url);} }});
          push('New message', j.latest.preview, url);
        }
      }catch{}
    };
    poll(); const t=setInterval(poll, 20000);
    return ()=>{ clearInterval(t); };
  }, [enabled]);
}
