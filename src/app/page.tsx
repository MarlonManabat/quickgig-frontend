'use client';

import { useState, useEffect } from 'react';
import { supabaseClient } from '@/lib/supabase/client';
import type { Gig } from '@/types/gigs';

const regions = [
  'National Capital Region',
  'Cordillera Administrative Region', 
  'Region I (Ilocos Region)',
  'Region II (Cagayan Valley)',
  'Region III (Central Luzon)',
  'Region IV-A (CALABARZON)',
  'Region IV-B (MIMAROPA)',
  'Region V (Bicol Region)',
  'Region VI (Western Visayas)',
  'Region VII (Central Visayas)',
  'Region VIII (Eastern Visayas)',
  'Region IX (Zamboanga Peninsula)',
  'Region X (Northern Mindanao)',
  'Region XI (Davao Region)',
  'Region XII (SOCCSKSARGEN)',
  'Region XIII (Caraga)',
  'Autonomous Region in Muslim Mindanao',
  'Bangsamoro Autonomous Region in Muslim Mindanao'
];

export default function QuickGigPage() {
  const [jobs, setJobs] = useState<Gig[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJobs = async () => {
      const supa = supabaseClient();
      if (!supa) return;

      const { data, error } = await supa
        .from('gigs')
        .select('*')
        .eq('published', true)
        .order('created_at', { ascending: false })
        .limit(10); // Limit to 10 for a quick view

      if (error) {
        console.error('Error fetching jobs:', error);
      } else {
        setJobs(data as Gig[]);
      }
      setLoading(false);
    };
    fetchJobs();
  }, []);
  
  const [showForm, setShowForm] = useState(false);
  const [selectedRegion, setSelectedRegion] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    budget: '',
    region: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // This form is a mock and should be removed or replaced with a proper API call
    alert('Job posting is handled by the Post a Job page. This is a mock form.');
    setShowForm(false);
  };

  const filteredJobs = selectedRegion
    ? jobs.filter(job => job.region === selectedRegion)
    : jobs;

  if (loading) {
    return (
      <div className="font-sans max-w-6xl mx-auto p-5 text-center">
        <h1 className="text-gray-800 text-3xl font-bold mb-8">QuickGig.ph</h1>
        <p>Loading jobs...</p>
      </div>
    );
  }

  return (
    <div className="font-sans max-w-6xl mx-auto p-5">
      {/* Header */}
      <header className="flex justify-between items-center mb-8 border-b-2 border-gray-200 pb-5">
        <h1 className="text-gray-800 text-3xl font-bold">QuickGig.ph</h1>
        <nav className="flex gap-5">
          <button 
            onClick={() => setShowForm(false)}
            className="px-5 py-2 bg-blue-500 text-white border-none rounded cursor-pointer hover:bg-blue-600"
          >
            Browse Jobs
          </button>
          <button 
            onClick={() => setShowForm(true)}
            className="px-5 py-2 bg-green-500 text-white border-none rounded cursor-pointer hover:bg-green-600"
          >
            Post a Job
          </button>
        </nav>
      </header>

      {showForm ? (
        /* Job Posting Form */
        <div className="bg-white p-8 rounded-lg shadow-lg">
          <h2 className="mb-5 text-gray-800 text-2xl">Post a Job</h2>
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div>
              <label className="block mb-1 font-bold">Job Title</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                className="w-full p-3 border border-gray-300 rounded"
                placeholder="e.g. Web Developer, Graphic Designer"
                required
              />
            </div>

            <div>
              <label className="block mb-1 font-bold">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                className="w-full p-3 border border-gray-300 rounded h-24"
                placeholder="Describe the job requirements"
                required
              />
            </div>

            <div>
              <label className="block mb-1 font-bold">Budget (PHP)</label>
              <input
                type="number"
                value={formData.budget}
                onChange={(e) => setFormData({...formData, budget: e.target.value})}
                className="w-full p-3 border border-gray-300 rounded"
                placeholder="25000"
                required
              />
            </div>

            <div>
              <label className="block mb-1 font-bold">Region</label>
              <select
                value={formData.region}
                onChange={(e) => setFormData({...formData, region: e.target.value})}
                className="w-full p-3 border border-gray-300 rounded"
                required
              >
                <option value="">Select Region</option>
                {regions.map(region => (
                  <option key={region} value={region}>{region}</option>
                ))}
              </select>
            </div>

            <button
              type="submit"
              className="w-full p-4 bg-green-500 text-white border-none rounded text-lg cursor-pointer hover:bg-green-600"
            >
              Post Job
            </button>
          </form>
        </div>
      ) : (
        /* Job Browsing */
        <div>
          <div className="mb-5">
            <label className="block mb-1 font-bold">Filter by Region</label>
            <select
              value={selectedRegion}
              onChange={(e) => setSelectedRegion(e.target.value)}
              className="p-3 border border-gray-300 rounded min-w-80"
            >
              <option value="">All Regions</option>
              {regions.map(region => (
                <option key={region} value={region}>{region}</option>
              ))}
            </select>
          </div>

          <div className="grid gap-5">
            {filteredJobs.length > 0 ? (
              filteredJobs.map(job => (
                <div key={job.id} className="bg-white p-5 rounded-lg shadow">
                  <h3 className="text-gray-800 mb-2 text-xl">{job.title}</h3>
                  <p className="text-gray-600 mb-2">{job.description}</p>
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-green-500">
                      {job.pay_min && job.pay_max
                        ? `₱${job.pay_min.toLocaleString()} - ₱${job.pay_max.toLocaleString()}`
                        : job.budget
                        ? `₱${job.budget.toLocaleString()}`
                        : 'Negotiable'}
                    </span>
                    <span className="text-gray-600 text-sm">{job.region}</span>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-600 p-10">
                No jobs found for the selected region. Try changing your filter or post a new job!
              </p>
            )}
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="mt-12 p-5 border-t border-gray-200 text-center text-gray-600">
        <p className="font-bold">QuickGig.ph - Philippine Job Marketplace with Ticketing System</p>
        <p>✅ Complete Philippine Coverage (18 Regions) | ✅ Job Posting | ✅ Location Filtering | ✅ Professional Interface</p>
      </footer>
    </div>
  );
}
