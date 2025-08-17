import { MAX_UPLOAD_MB, ACCEPT_UPLOADS } from './env';

const EXT_TO_MIME: Record<string, string> = {
  pdf: 'application/pdf',
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  png: 'image/png',
};
export const ACCEPT_STRING = ACCEPT_UPLOADS.map((e) => '.' + e).join(',');
const ALLOWED_MIME = ACCEPT_UPLOADS.map((e) => EXT_TO_MIME[e]).filter(Boolean);

function validate(file: File): { ok: boolean; reason?: string } {
  const max = MAX_UPLOAD_MB * 1024 * 1024;
  if (file.size > max) return { ok: false, reason: 'too_big' };
  if (!ALLOWED_MIME.includes(file.type)) return { ok: false, reason: 'bad_type' };
  return { ok: true };
}

async function put(url: string, file: File, onProgress?: (n: number) => void, signal?: AbortSignal) {
  await new Promise<void>((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable && onProgress) onProgress(e.loaded / e.total);
    };
    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) resolve();
      else reject(new Error('network'));
    };
    xhr.onerror = () => reject(new Error('network'));
    xhr.onabort = () => reject(new Error('canceled'));
    xhr.open('PUT', url);
    xhr.setRequestHeader('Content-Type', file.type);
    if (signal) signal.addEventListener('abort', () => xhr.abort());
    xhr.send(file);
  });
}

export async function uploadFile(
  file: File,
  onProgress?: (n: number) => void,
  signal?: AbortSignal
): Promise<{ key: string; publicUrl: string }> {
  const v = validate(file);
  if (!v.ok) throw new Error(v.reason);
  const r = await fetch('/api/upload/sign', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ filename: file.name, contentType: file.type, size: file.size }),
  });
  if (r.status === 501) throw new Error('not_configured');
  if (!r.ok) throw new Error('network');
  const { url, key } = await r.json();
  await put(url, file, onProgress, signal);
  return { key, publicUrl: url.split('?')[0] };
}

export { MAX_UPLOAD_MB as MAX_MB };
