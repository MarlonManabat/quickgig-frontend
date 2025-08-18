export type UploadResult = { url: string };
export type PutProgress = { loaded: number; total?: number };

export async function presign(name: string, type: string, size: number) {
  const r = await fetch('/api/upload', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, type, size }),
  });
  const j = await r.json().catch(() => ({}));
  if (r.status === 429) throw new Error('rate_limited');
  if (!r.ok || !j?.ok) throw new Error(j?.error || 'Presign failed');
  return j as { ok: true; url: string; key: string; maxMb: number };
}

export async function putFile(url: string, file: File, onProgress?: (p: PutProgress) => void, signal?: AbortSignal) {
  // XHR to get progress; still a simple PUT
  await new Promise<void>((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open('PUT', url, true);
    xhr.setRequestHeader('Content-Type', file.type);
    if (onProgress) xhr.upload.onprogress = e => onProgress({ loaded: e.loaded, total: e.lengthComputable ? e.total : undefined });
    xhr.onload = () => (xhr.status >= 200 && xhr.status < 300 ? resolve() : reject(new Error(`Upload failed: ${xhr.status}`)));
    xhr.onerror = () => reject(new Error('Network error'));
    if (signal) signal.addEventListener('abort', () => { try { xhr.abort(); } catch {} reject(new Error('aborted')); });
    xhr.send(file);
  });
}
