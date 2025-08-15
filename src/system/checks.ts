export type Check = { name: string; ok: boolean; note?: string };
export function redact(v?: string) { return v ? v.replace(/.(?=.{4})/g, '•') : ''; }
