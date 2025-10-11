'use client';

import { useState } from 'react';
import { GeoSelectCore } from '@/components/location/GeoSelectCore';

export default function PostJobPage() {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    budget: '',
    location: { region: '', province: '', city: '' }
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const response = await fetch('/api/gigs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          userId: 'demo-user',
          status: 'active'
        })
      });
      
      if (response.ok) {
        alert('Job posted successfully!');
        setFormData({ title: '', description: '', budget: '', location: { region: '', province: '', city: '' } });
      } else {
        alert('Failed to post job');
      }
    } catch (error) {
      alert('Error posting job');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Post a Job</h1>
        
        <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg shadow">
          <div>
            <label className="block text-sm font-medium mb-2">Job Title</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              className="w-full p-3 border rounded-lg"
              placeholder="e.g. Web Developer, Graphic Designer"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Job Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              className="w-full p-3 border rounded-lg h-32"
              placeholder="Describe the job requirements and responsibilities"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Budget (PHP)</label>
            <input
              type="number"
              value={formData.budget}
              onChange={(e) => setFormData({...formData, budget: e.target.value})}
              className="w-full p-3 border rounded-lg"
              placeholder="e.g. 25000"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Location</label>
            <GeoSelectCore 
              onLocationChange={(location) => setFormData({...formData, location})}
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700"
          >
            Post Job
          </button>
        </form>
      </div>
    </div>
  );
}
