import * as React from 'react';
import ProductShell from './layout/ProductShell';
import { t } from '@/lib/t';

interface State { hasError: boolean; }

export class ErrorBoundary extends React.Component<{ children: React.ReactNode }, State> {
  state: State = { hasError: false };
  static getDerivedStateFromError() { return { hasError: true }; }
  reset = () => this.setState({ hasError: false });
  render() {
    if (this.state.hasError) {
      return (
        <ProductShell>
          <div style={{ padding: 32, textAlign: 'center' }} role="alert">
            <p>{t('error.generic')}</p>
            <div style={{display:'flex', gap:8, justifyContent:'center'}}>
              <button onClick={this.reset} style={{padding:'6px 12px', border:'1px solid #ccc', borderRadius:4}}>{t('error.try_again')}</button>
              <a href="/" style={{padding:'6px 12px', border:'1px solid #ccc', borderRadius:4}}>{t('error.go_home')}</a>
            </div>
          </div>
        </ProductShell>
      );
    }
    return this.props.children;
  }
}
