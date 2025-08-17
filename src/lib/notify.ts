export function canNotify(){ return typeof window!=='undefined' && 'Notification' in window; }
export async function ensurePermission(){
  if(!canNotify()) return 'denied';
  if(Notification.permission==='granted') return 'granted';
  if(Notification.permission==='denied') return 'denied';
  try { return await Notification.requestPermission(); } catch { return 'denied'; }
}
export function push(title:string, body:string, url?:string){
  if(!canNotify() || Notification.permission!=='granted') return;
  const n=new Notification(title, { body });
  if(url) n.onclick=()=>{ window.focus(); window.location.assign(url); };
}
