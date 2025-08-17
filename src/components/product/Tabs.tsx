import * as React from 'react';
import { tokens as T } from '../../theme/tokens';

type Ctx = { index: number; setIndex: (i: number) => void };
const TabsContext = React.createContext<Ctx | null>(null);

export function Tabs({ children, defaultIndex = 0 }: { children: React.ReactNode; defaultIndex?: number }) {
  const [index, setIndex] = React.useState(defaultIndex);
  return <TabsContext.Provider value={{ index, setIndex }}>{children}</TabsContext.Provider>;
}

export function TabList({ children }: { children: React.ReactNode }) {
  return <div style={{ display: 'flex', gap: 8 }}>{children}</div>;
}

export function Tab({ children, index }: { children: React.ReactNode; index: number }) {
  const ctx = React.useContext(TabsContext)!;
  const active = ctx.index === index;
  return (
    <button
      onClick={() => ctx.setIndex(index)}
      style={{
        padding: '8px 12px',
        borderRadius: 8,
        border: 'none',
        cursor: 'pointer',
        background: active ? T.colors.brand : 'transparent',
        color: active ? '#fff' : T.colors.text,
        fontWeight: 600,
      }}
    >
      {children}
    </button>
  );
}

export function TabPanel({ children, index }: { children: React.ReactNode; index: number }) {
  const ctx = React.useContext(TabsContext)!;
  if (ctx.index !== index) return null;
  return <div style={{ marginTop: 16 }}>{children}</div>;
}
