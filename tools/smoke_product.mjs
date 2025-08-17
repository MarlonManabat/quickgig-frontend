const BASE=process.env.BASE ?? 'http://localhost:3000';
const paths=['/','/login'];
const fetch = (...a)=>import('node-fetch').then(({default: f})=>f(...a));
(async()=>{
  let bad=0;
  for(const p of paths){
    const r = await fetch(BASE+p, {redirect:'manual'});
    const ok = r.status>=200 && r.status<400;
    console.log(p, r.status, ok ? 'OK' : 'FAIL');
    if(!ok) bad++;
  }
  if(bad) process.exit(1);
})();
