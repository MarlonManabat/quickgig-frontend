import * as React from 'react';
import ProductShell from '../layout/ProductShell';
import { tokens as T } from '../../theme/tokens';

export default function DashboardShell({ title, tabs, children }: { title: React.ReactNode; tabs?: React.ReactNode; children: React.ReactNode }) {
  return (
    <ProductShell>
      <div style={{ position: 'sticky', top: 0, zIndex: 10, background: T.colors.surface, paddingBottom: 8 }}>
        <h1 style={{ margin: '0 0 8px' }}>{title}</h1>
        {tabs}
      </div>
      <div style={{ marginTop: 16 }}>{children}</div>
    </ProductShell>
  );
}
