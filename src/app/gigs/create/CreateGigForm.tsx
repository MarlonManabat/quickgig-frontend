'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';

const GeoSelectCore = dynamic(
  () => import("@/components/location/GeoSelectCore"),
  { ssr: false },
);

interface CreateGigFormProps {
  userId: string;
  userTickets: number;
}

export default function CreateGigForm({ userId, userTickets }: CreateGigFormProps) {
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    budget: '',
    region: '',
    province: '',
    city: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleLocationChange = (location: { region: string; province: string; city: string }) => {
    setFormData(prev => ({
      ...prev,
      region: location.region,
      province: location.province,
      city: location.city,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (userTickets < 1) {
      setError('You need at least 1 ticket to post a job. Please purchase tickets first.');
      return;
    }

    if (!formData.title.trim() || !formData.description.trim()) {
      setError('Please fill in all required fields.');
      return;
    }

    if (!formData.region || !formData.city) {
      setError('Please select a location.');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      const response = await fetch('/api/gigs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: formData.title.trim(),
          description: formData.description.trim(),
          budget: formData.budget ? parseFloat(formData.budget) : null,
          region_code: formData.region,
          city_code: formData.city,
        }),
      });

      if (response.ok) {
        const result = await response.json();
        router.push(`/browse-jobs/${result.gig.id}`);
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Failed to create job posting');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (userTickets < 1) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
          <h2 className="font-semibold text-yellow-800 mb-2">Tickets Required</h2>
          <p className="text-yellow-700 mb-4">
            You need at least 1 ticket to post a job. Tickets ensure serious commitment from both employers and job seekers.
          </p>
          <a 
            href="/tickets/buy" 
            className="inline-block bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded font-medium"
          >
            Buy Tickets
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
            Job Title *
          </label>
          <input
            type="text"
            id="title"
            value={formData.title}
            onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            placeholder="e.g., Web Developer, Graphic Designer, Virtual Assistant"
            required
          />
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
            Job Description *
          </label>
          <textarea
            id="description"
            value={formData.description}
            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
            rows={6}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            placeholder="Describe the job requirements, responsibilities, and qualifications..."
            required
          />
        </div>

        <div>
          <label htmlFor="budget" className="block text-sm font-medium text-gray-700 mb-2">
            Budget (PHP)
          </label>
          <input
            type="number"
            id="budget"
            value={formData.budget}
            onChange={(e) => setFormData(prev => ({ ...prev, budget: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            placeholder="e.g., 25000"
            min="0"
            step="0.01"
          />
          <p className="text-sm text-gray-500 mt-1">Optional: Specify the budget for this job</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Location *
          </label>
          <GeoSelectCore onLocationChange={handleLocationChange} />
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-md p-4">
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        )}

        <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
          <h3 className="font-medium text-blue-800 mb-2">Ticket Usage</h3>
          <p className="text-blue-700 text-sm">
            Posting this job will not spend any tickets immediately. Tickets are only spent when you and a job seeker reach an agreement.
          </p>
          <p className="text-blue-600 text-xs mt-1">
            Current balance: {userTickets} tickets
          </p>
        </div>

        <div className="flex gap-4">
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex-1 bg-teal-600 hover:bg-teal-700 disabled:bg-gray-400 text-white px-6 py-3 rounded-md font-medium transition-colors"
          >
            {isSubmitting ? 'Creating Job...' : 'Post Job'}
          </button>
          <button
            type="button"
            onClick={() => router.push('/browse-jobs')}
            className="px-6 py-3 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
