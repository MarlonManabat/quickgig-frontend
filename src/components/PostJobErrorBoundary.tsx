"use client";
import { Component, ReactNode } from "react";

interface Props { children: ReactNode }
interface State { hasError: boolean }

export default class PostJobErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: any) {
    // eslint-disable-next-line no-console
    console.error(error, error?.digest);
  }

  handleRetry = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="max-w-xl mx-auto p-4 sm:p-6 space-y-2">
          <p>Something went wrong loading the form.</p>
          <button onClick={this.handleRetry} className="border rounded px-4 py-2">Try again</button>
        </div>
      );
    }
    return this.props.children;
  }
}
