'use client';
import dynamic from 'next/dynamic';
import { useState } from 'react';
import ClientOnly from '@/components/util/ClientOnly';
import { ErrorBoundary } from '@/components/util/ErrorBoundary';
import type { LocationValue } from '@/components/location/LocationSelect';

const LocationSelect = dynamic(() => import('@/components/location/LocationSelect'), { ssr:false });

export default function PostJobPage(){
  const [title, setTitle] = useState('');
  const [company, setCompany] = useState('');
  const [location, setLocation] = useState<LocationValue>({});

  function onSubmit(e:React.FormEvent){ e.preventDefault(); /* TODO: credits check + submit */ }

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-4">Post a Job</h1>
      <form onSubmit={onSubmit}>
        <input className="input mb-3 w-full" name="title" placeholder="Job title" value={title} onChange={e=>setTitle(e.target.value)} required />
        <input className="input mb-3 w-full" name="company" placeholder="Company (optional)" value={company} onChange={e=>setCompany(e.target.value)} />
        <ErrorBoundary>
          <ClientOnly>
            <LocationSelect value={location} onChange={setLocation} />
          </ClientOnly>
        </ErrorBoundary>
        <button type="submit" className="btn btn-primary mt-4" aria-label="Post Job">Post Job</button>
      </form>
    </div>
  );
}
