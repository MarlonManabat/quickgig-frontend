export const log = (msg: string, meta?: unknown) => {
  try { console.info(`[app] ${msg}`, meta ?? {}); } catch {}
};
export const warn = (msg: string, meta?: unknown) => {
  try { console.warn(`[app] ${msg}`, meta ?? {}); } catch {}
};
export const error = (msg: string, meta?: unknown) => {
  try { console.error(`[app] ${msg}`, meta ?? {}); } catch {}
};
