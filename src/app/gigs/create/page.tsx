'use client';

import { useState } from 'react';

export default function CreateGigPage() {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    budget: '',
    region: '',
    province: '',
    city: ''
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
        setFormData({ title: '', description: '', budget: '', region: '', province: '', city: '' });
      } else {
        alert('Failed to post job');
      }
    } catch (error) {
      alert('Error posting job');
    }
  };

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">Post a Job</h1>
        <p className="text-gray-600 mb-8">
          Find qualified candidates for your project or business needs.
        </p>
        
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
            <label className="block text-sm font-medium mb-2">Region</label>
            <select
              value={formData.region}
              onChange={(e) => setFormData({...formData, region: e.target.value})}
              className="w-full p-3 border rounded-lg"
              required
            >
              <option value="">Select Region</option>
              <option value="NCR">National Capital Region</option>
              <option value="CAR">Cordillera Administrative Region</option>
              <option value="Region I">Region I (Ilocos Region)</option>
              <option value="Region II">Region II (Cagayan Valley)</option>
              <option value="Region III">Region III (Central Luzon)</option>
              <option value="Region IV-A">Region IV-A (CALABARZON)</option>
              <option value="Region IV-B">Region IV-B (MIMAROPA)</option>
              <option value="Region V">Region V (Bicol Region)</option>
              <option value="Region VI">Region VI (Western Visayas)</option>
              <option value="Region VII">Region VII (Central Visayas)</option>
              <option value="Region VIII">Region VIII (Eastern Visayas)</option>
              <option value="Region IX">Region IX (Zamboanga Peninsula)</option>
              <option value="Region X">Region X (Northern Mindanao)</option>
              <option value="Region XI">Region XI (Davao Region)</option>
              <option value="Region XII">Region XII (SOCCSKSARGEN)</option>
              <option value="Region XIII">Region XIII (Caraga)</option>
              <option value="ARMM">Autonomous Region in Muslim Mindanao</option>
              <option value="BARMM">Bangsamoro Autonomous Region in Muslim Mindanao</option>
            </select>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700"
          >
            Post Job
          </button>
        </form>
      </div>
    </main>
  );
}
