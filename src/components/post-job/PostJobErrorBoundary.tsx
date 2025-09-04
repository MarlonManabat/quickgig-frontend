"use client";
import React from "react";

export default class PostJobErrorBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean }> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  componentDidCatch(error: any) {
    // eslint-disable-next-line no-console
    console.error("PostJobErrorBoundary", error);
  }
  render() {
    if (this.state.hasError) {
      return <div>Failed to load form</div>;
    }
    return this.props.children;
  }
}
