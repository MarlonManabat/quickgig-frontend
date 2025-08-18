export function toBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = (e) => reject(e);
    reader.readAsDataURL(file);
  });
}

export function truncateDataUrl(dataUrl: string, limitKB = 256): string {
  const [header, data] = dataUrl.split(',', 2);
  const maxBytes = limitKB * 1024;
  const maxChars = Math.floor(maxBytes / 3) * 4; // base64 4 chars -> 3 bytes
  const truncated = data.length > maxChars ? data.slice(0, maxChars) : data;
  return `${header},${truncated}`;
}

export function makeId(): string {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}
