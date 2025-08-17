export type LegacySource = 'env' | 'url' | 'localStorage' | 'none';

function coerceBool(v: unknown): boolean {
  return String(v).toLowerCase() === 'true';
}

export function readLegacyFlagClient(): { enabled: boolean; source: LegacySource } {
  let enabled = coerceBool(process.env.NEXT_PUBLIC_LEGACY_UI);
  let source: LegacySource = enabled ? 'env' : 'none';

  if (typeof window !== 'undefined') {
    const url = new URL(window.location.href);
    const q = url.searchParams.get('legacy');

    if (q === '1' || q === '0') {
      localStorage.setItem('legacy_ui', q);
      url.searchParams.delete('legacy');
      window.history.replaceState({}, '', url);
      source = 'url';
      enabled = q === '1';
    }

    const ls = localStorage.getItem('legacy_ui');
    if (ls === '1') { enabled = true; source = source === 'env' ? 'env' : 'localStorage'; }
    if (ls === '0' && source !== 'env') { enabled = false; source = 'localStorage'; }
  }

  return { enabled, source };
}

export function legacyEnabled(): boolean {
  return readLegacyFlagClient().enabled;
}

export function getOverrideSource(): LegacySource {
  return readLegacyFlagClient().source;
}
