/* eslint-disable @typescript-eslint/no-explicit-any */
export type ApiError = { status: number; message: string };
const base = (process.env.NEXT_PUBLIC_API_URL || '').replace(/\/+$/,'');

export async function apiFetch<T=unknown>(path: string, init: RequestInit = {}): Promise<T>{
  const url = base ? base + path : path;
  const res = await fetch(url, {
    headers: {'content-type': 'application/json', ...(init.headers||{})},
    ...init
  }).catch((e)=>{ throw {status:0, message:String(e)} as ApiError; });

  const text = await res.text();
  let data: unknown = null; try { data = text ? JSON.parse(text) : null; } catch {}
  if(!res.ok){
    const errData = data as { error?: string; message?: string } | null;
    throw { status: res.status, message: (errData && (errData.error||errData.message)) || text || 'Request failed' } as ApiError;
  }
  return (data ?? {}) as T;
}

export const api = {
  get<T = any>(path: string, init?: RequestInit){
    return apiFetch<T>(path, { ...init, method:'GET' });
  },
  post<T = any>(path: string, body?: unknown, init?: RequestInit){
    return apiFetch<T>(path, {
      ...init,
      method:'POST',
      body: body ? JSON.stringify(body) : undefined
    });
  }
};

export const Auth = {
  async login(email: string, password: string){
    return api.post<{token?: string}>('/auth/login', { email, password });
  }
};
