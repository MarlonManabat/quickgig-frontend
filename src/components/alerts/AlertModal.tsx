'use client';

import { useState, useEffect } from 'react';
import { Input, Select } from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { api } from '@/lib/apiClient';
import { API, JobFilters } from '@/config/api';
import { toast } from '@/lib/toast';

export interface AlertData {
  id?: string | number;
  name: string;
  filters: JobFilters;
  frequency: 'daily' | 'weekly';
  email: boolean;
}

interface Props {
  open: boolean;
  onClose: () => void;
  initial?: Partial<AlertData>;
  onSaved?: (data: AlertData) => void;
}

export default function AlertModal({ open, onClose, initial, onSaved }: Props) {
  const [name, setName] = useState(initial?.name || '');
  const [filters, setFilters] = useState<JobFilters>(initial?.filters || {});
  const [frequency, setFrequency] = useState<'daily' | 'weekly'>(
    (initial?.frequency as 'daily' | 'weekly') || 'daily'
  );
  const [email, setEmail] = useState(initial?.email ?? true);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open) {
      setName(initial?.name || '');
      setFilters(initial?.filters || {});
      setFrequency((initial?.frequency as 'daily' | 'weekly') || 'daily');
      setEmail(initial?.email ?? true);
    }
  }, [open, initial]);

  if (!open) return null;

  const handleChange = (field: keyof JobFilters) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value =
      e.target.type === 'checkbox'
        ? (e.target as HTMLInputElement).checked
        : e.target.value;
    setFilters({ ...filters, [field]: value });
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast('Name required');
      return;
    }
    setLoading(true);
    try {
      const clean: JobFilters = {
        q: filters.q || undefined,
        location: filters.location || undefined,
        category: filters.category || undefined,
        type: filters.type || undefined,
        remote: filters.remote ? true : undefined,
        minSalary:
          filters.minSalary !== undefined && filters.minSalary !== null
            ? Number(filters.minSalary)
            : undefined,
        maxSalary:
          filters.maxSalary !== undefined && filters.maxSalary !== null
            ? Number(filters.maxSalary)
            : undefined,
      };
      const payload = { name, filters: clean, frequency, email };
      const res = initial?.id
        ? await api.patch(API.alertsUpdate(initial.id), payload)
        : await api.post(API.alertsCreate, payload);
      toast('Alert saved');
      onSaved?.(res.data);
      onClose();
    } catch {
      toast('Failed to save alert');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <form onSubmit={submit} className="bg-white p-4 rounded space-y-2 w-full max-w-md">
        <h2 className="text-lg font-semibold">
          {initial?.id ? 'Edit Alert' : 'New Alert'}
        </h2>
        <Input label="Name" value={name} onChange={(e) => setName(e.target.value)} required />
        <Input
          label="Keywords"
          value={filters.q || ''}
          onChange={handleChange('q')}
        />
        <Input
          label="Location"
          value={filters.location || ''}
          onChange={handleChange('location')}
        />
        <Input
          label="Category"
          value={filters.category || ''}
          onChange={handleChange('category')}
        />
        <Input
          label="Type"
          value={filters.type || ''}
          onChange={handleChange('type')}
        />
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={Boolean(filters.remote)}
            onChange={handleChange('remote')}
          />
          <span>Remote</span>
        </label>
        <div className="flex gap-2">
          <Input
            type="number"
            label="Min Salary"
            value={filters.minSalary ?? ''}
            onChange={handleChange('minSalary')}
          />
          <Input
            type="number"
            label="Max Salary"
            value={filters.maxSalary ?? ''}
            onChange={handleChange('maxSalary')}
          />
        </div>
        <Select
          label="Frequency"
          value={frequency}
          onChange={(e) => setFrequency(e.target.value as 'daily' | 'weekly')}
          options={[
            { value: 'daily', label: 'Daily' },
            { value: 'weekly', label: 'Weekly' },
          ]}
        />
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={email}
            onChange={(e) => setEmail(e.target.checked)}
          />
          <span>Email notifications</span>
        </label>
        <div className="flex justify-end gap-2 pt-2">
          <Button type="button" variant="secondary" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? 'Saving...' : 'Save'}
          </Button>
        </div>
      </form>
    </div>
  );
}
