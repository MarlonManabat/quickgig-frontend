import axios from 'axios';
import { env } from '@/config/env';

let serverCookies: (() => { get: (name: string) => { value: string } | undefined }) | undefined;
if (typeof window === 'undefined') {
  // eslint-disable-next-line @typescript-eslint/no-var-requires, @typescript-eslint/no-require-imports
  serverCookies = require('next/headers').cookies;
}

const apiClient = axios.create({
  baseURL: env.API_URL,
  withCredentials: true,
});

apiClient.interceptors.request.use((config) => {
  let token: string | undefined;
  if (typeof window === 'undefined') {
    try {
      token = serverCookies?.().get(env.JWT_COOKIE_NAME)?.value;
    } catch {}
  } else {
    const match = document.cookie.match(new RegExp(`${env.JWT_COOKIE_NAME}=([^;]+)`));
    if (match) token = match[1];
  }
  if (token) {
    config.headers = config.headers || {};
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
});

apiClient.interceptors.response.use(
  (res) => res,
  async (error) => {
    if (error.response?.status === 401) {
      try {
        await fetch('/api/session/logout', { method: 'POST' });
      } catch {}
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient;
