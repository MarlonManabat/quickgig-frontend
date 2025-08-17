export type ApiError = { status: number; message: string };
const base = (process.env.NEXT_PUBLIC_API_URL || '').replace(/\/+$/,''); // allow empty for relative

export async function api<T=unknown>(path: string, init: RequestInit = {}): Promise<T>{
  const url = base ? base + path : path;
  const res = await fetch(url, {
    headers: {'content-type': 'application/json', ...(init.headers||{})},
    ...init
  }).catch((e)=>{ throw {status:0, message:String(e)} as ApiError; });

  const text = await res.text();
  let data: unknown = null; try { data = text ? JSON.parse(text) : null; } catch {}
  if(!res.ok){
    const info = (data as Record<string, unknown>) || {};
    const msg = typeof info.error === 'string' ? info.error : typeof info.message === 'string' ? info.message : text || 'Request failed';
    throw { status: res.status, message: msg } as ApiError;
  }
  return (data ?? ({} as unknown)) as T;
}

export const Auth = {
  async login(email: string, password: string){
    return api<{token?: string}>('/auth/login', { method:'POST', body: JSON.stringify({email, password}) });
  }
};

export async function safeFetch(url: string, init?: RequestInit): Promise<Response>{
  return fetch(url, init);
}
export async function checkHealth(): Promise<Response>{
  return safeFetch('/health');
}
export async function fetchJobs(){
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return api<any>('/jobs');
}
