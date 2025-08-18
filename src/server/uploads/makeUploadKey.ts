export function makeUploadKey(userId: string | null, filename: string) {
  const ext = filename.split('.').pop() || 'bin';
  const d = new Date();
  const yyyy = d.getFullYear().toString();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  const user = (userId || 'anon').replace(/[^a-zA-Z0-9_-]/g, 'anon');
  const id = crypto.randomUUID();
  return `uploads/${yyyy}/${mm}/${dd}/${user}/${id}.${ext}`;
}
