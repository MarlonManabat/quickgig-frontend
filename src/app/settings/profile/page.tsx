'use client';

import { useState, useEffect } from 'react';
import { Input, Textarea } from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { API } from '@/config/api';
import { toast } from '@/lib/toast';
import { apiMe } from '@/lib/auth-client';
import { apiPost } from '@/lib/api';

interface ProfileData {
  name: string;
  headline: string;
  location: string;
  phone: string;
  skills: string;
  bio: string;
  resumeUrl?: string;
  resumeName?: string;
  resumeKey?: string;
}

export default function ProfileSettingsPage() {
  const [data, setData] = useState<ProfileData>({
    name: '',
    headline: '',
    location: '',
    phone: '',
    skills: '',
    bio: '',
  });
  const [resume, setResume] = useState<{ name: string; url?: string; key?: string } | null>(null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const d = (await apiMe()) || {};
        setData({
          name: d.name || '',
          headline: d.headline || '',
          location: d.location || '',
          phone: d.phone || '',
          skills: Array.isArray(d.skills) ? d.skills.join(', ') : d.skills || '',
          bio: d.bio || '',
        });
        if (d.resumeUrl || d.resume || d.resumeKey) {
          setResume({ name: d.resumeName || 'Resume', url: d.resumeUrl || d.resume, key: d.resumeKey });
        }
      } catch {
        /* ignore */
      }
    })();
  }, []);

  const handleChange = (field: keyof ProfileData) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setData({ ...data, [field]: e.target.value });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await apiPost(API.updateProfile, {
        ...data,
        skills: data.skills
          .split(',')
          .map((s) => s.trim())
          .filter(Boolean),
      });
      toast('Profile saved');
    } catch {
      toast('Failed to save profile');
    } finally {
      setSaving(false);
    }
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) {
      toast('File too large (max 10 MB)');
      return;
    }
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await fetch('/api/upload/resume', { method: 'POST', body: formData });
      const json = await res.json();
      if (json.ok) {
        setResume({ name: file.name, url: json.url });
        toast('Resume uploaded');
      } else {
        toast(json.message || 'Upload failed');
      }
    } catch {
      toast('Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleRemove = async () => {
    try {
      await apiPost(API.deleteResume, {});
      setResume(null);
      toast('Resume removed');
    } catch {
      toast('Failed to remove resume');
    }
  };

  const handleView = async () => {
    if (resume?.key && process.env.NEXT_PUBLIC_ENABLE_FILE_SIGNING === 'true') {
      try {
        const res = await fetch(`/api/files/sign?key=${encodeURIComponent(resume.key)}`);
        if (res.ok) {
          const json = await res.json();
          window.open(json.url, '_blank');
          return;
        }
      } catch {
        /* ignore */
      }
    }
    if (resume?.url) window.open(resume.url, '_blank');
  };

  return (
    <main className="p-4 space-y-6 max-w-2xl">
      <h1 className="text-xl font-semibold">Profile Settings</h1>
      <form onSubmit={handleSave} className="space-y-4">
        <Input label="Name" value={data.name} onChange={handleChange('name')} />
        <Input label="Headline" value={data.headline} onChange={handleChange('headline')} />
        <Input label="Location" value={data.location} onChange={handleChange('location')} />
        <Input label="Phone" value={data.phone} onChange={handleChange('phone')} />
        <Input
          label="Skills (comma separated)"
          value={data.skills}
          onChange={handleChange('skills')}
        />
        <Textarea label="Bio" value={data.bio} onChange={handleChange('bio')} />
        <Button type="submit" disabled={saving}>
          {saving ? 'Saving...' : 'Save'}
        </Button>
      </form>
      <div className="space-y-2">
        <h2 className="text-lg font-semibold">Resume</h2>
        {resume ? (
          <div className="space-y-2">
            <p>{resume.name}</p>
            <button onClick={handleView} className="text-qg-accent">
              View
            </button>
            <div className="space-x-2">
              <label className="text-qg-accent cursor-pointer">
                <span>Replace</span>
                <input type="file" accept=".pdf" className="hidden" onChange={handleUpload} />
              </label>
              <button type="button" onClick={handleRemove} className="text-red-600">
                Remove
              </button>
            </div>
          </div>
        ) : (
          <div>
            <input type="file" accept=".pdf" onChange={handleUpload} />
          </div>
        )}
        {uploading && <p>Uploading...</p>}
      </div>
    </main>
  );
}
