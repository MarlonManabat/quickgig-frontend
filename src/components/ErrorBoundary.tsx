'use client';

import React from 'react';
import { report } from '@/lib/report';

interface Props {
  children: React.ReactNode;
}

interface State {
  hasError: boolean;
}

export default class ErrorBoundary extends React.Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: unknown) {
    report(error, 'ErrorBoundary');
  }

  private handleReset = () => {
    this.setState({ hasError: false });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-4 text-center">
          <p className="mb-4">Something went wrong.</p>
          <button
            onClick={this.handleReset}
            className="px-4 py-2 bg-qg-accent text-white rounded"
          >
            Try again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

