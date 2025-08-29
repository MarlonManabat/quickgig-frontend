'use client';
import React from 'react';
export class ErrorBoundary extends React.Component<{children:React.ReactNode},{err:boolean}>{
  constructor(p:any){super(p);this.state={err:false}}
  static getDerivedStateFromError(){return {err:true}}
  componentDidCatch(e:any,i:any){console.error('Post section error',e,i)}
  render(){return this.state.err ? <div className="opacity-70">Unable to load section.</div> : this.props.children}
}
