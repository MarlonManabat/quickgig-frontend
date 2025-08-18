export interface EngineHealth {
  engine: boolean;
  db: boolean;
  timestamp: string;
}

export async function health(): Promise<EngineHealth> {
  if (process.env.ENGINE_MODE !== 'php') {
    return { engine: true, db: true, timestamp: new Date().toISOString() };
  }
  const base = process.env.ENGINE_BASE_URL || '';
  try {
    const res = await fetch(`${base}/_health`);
    const json: Record<string, unknown> = await res.json().catch(() => ({}));
    return {
      engine: res.ok,
      db: (json as { db?: boolean }).db !== false,
      timestamp: (json as { timestamp?: string }).timestamp || new Date().toISOString(),
    };
  } catch {
    return { engine: false, db: false, timestamp: new Date().toISOString() };
  }
}
