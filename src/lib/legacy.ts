export type LegacySource = 'env' | 'url' | 'localStorage' | 'none';

let overrideSource: LegacySource = 'none';

export function legacyEnabled(url?: string): boolean {
  if (process.env.NEXT_PUBLIC_LEGACY_UI === 'true') {
    overrideSource = 'env';
    return true;
  }

  let search = '';
  if (typeof window !== 'undefined') {
    search = window.location.search;
  } else if (url) {
    try {
      const u = new URL(url, 'http://localhost');
      search = u.search;
    } catch {
      search = '';
    }
  }

  const params = new URLSearchParams(search);
  const legacyParam = params.get('legacy');
  if (legacyParam === '1' || legacyParam === '0') {
    if (typeof window !== 'undefined') {
      localStorage.setItem('legacy_ui', legacyParam);
      overrideSource = 'url';
      params.delete('legacy');
      const newUrl = `${window.location.pathname}${params.toString() ? `?${params.toString()}` : ''}${window.location.hash}`;
      window.location.replace(newUrl);
    } else {
      overrideSource = 'url';
    }
    return legacyParam === '1';
  }

  const lsVal = typeof window !== 'undefined' ? localStorage.getItem('legacy_ui') : null;
  if (lsVal === '1') {
    overrideSource = 'localStorage';
    return true;
  }
  if (lsVal === '0') {
    overrideSource = 'localStorage';
    return false;
  }

  overrideSource = 'none';
  return false;
}

export function getOverrideSource(): LegacySource {
  return overrideSource;
}

export function setLegacyOverride(val: '1' | '0') {
  if (typeof window !== 'undefined') {
    localStorage.setItem('legacy_ui', val);
    window.location.reload();
  }
}

export function clearLegacyOverride() {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('legacy_ui');
    window.location.reload();
  }
}
