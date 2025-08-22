import { NextRouter } from 'next/router';

export function hasDynamicParam(path: string) {
  // matches /[slug] or /[id] anywhere
  return /\[[^/]+?\]/.test(path);
}

export function isMissingParam(path: string) {
  // if path still contains [xyz], it's missing
  return hasDynamicParam(path);
}

export function fillPath(path: string, params: Record<string,string|number|undefined|null>) {
  return path.replace(/\[([^\]/]+)\]/g, (_, key) => {
    const v = params[key];
    if (v === null || v === undefined || v === '') throw new Error(`Missing param ${key} for ${path}`);
    return String(v);
  });
}

export function safePush(router: NextRouter, path: string, params: Record<string,string|number|undefined|null> = {}) {
  try {
    const finalPath = hasDynamicParam(path) ? fillPath(path, params) : path;
    return router.push(finalPath);
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error('safePush error', e);
    return Promise.resolve(false);
  }
}
