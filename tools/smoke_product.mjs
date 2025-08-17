const base=(process.env.BASE||'http://localhost:3000').replace(/\/$/,'');
const paths=['/','/?legacy=1','/login','/legacy/styles.css','/legacy/fonts/LegacySans.woff2'];
(async()=>{
  for(const p of paths){
    try{
      const r=await fetch(base+p,{method:'HEAD'});
      console.log(p, r.status, r.headers.get('content-type')||'-', r.headers.get('content-length')||'-');
    }catch(e){ console.log(p, 'ERR', String(e)); }
  }
})();
