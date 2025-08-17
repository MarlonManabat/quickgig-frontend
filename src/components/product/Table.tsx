import * as React from 'react';
import { tokens as T } from '../../theme/tokens';

export function Table(props: React.HTMLAttributes<HTMLTableElement>) {
  return <table {...props} style={{ width: '100%', borderCollapse: 'collapse', ...(props.style || {}) }} />;
}

export function Th(props: React.HTMLAttributes<HTMLTableCellElement>) {
  return (
    <th
      {...props}
      style={{
        textAlign: 'left',
        padding: '8px',
        borderBottom: `1px solid ${T.colors.border}`,
        ...(props.style || {}),
      }}
    />
  );
}

export function Td(props: React.HTMLAttributes<HTMLTableCellElement>) {
  return <td {...props} style={{ padding: '8px', borderBottom: `1px solid ${T.colors.border}`, ...(props.style || {}) }} />;
}

export function Tr(props: React.HTMLAttributes<HTMLTableRowElement>) {
  return <tr {...props} />;
}
