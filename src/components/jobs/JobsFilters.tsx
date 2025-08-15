'use client';

import { useEffect, useState } from 'react';
import type { JobFilters } from '@/config/api';
import { Input } from '@/components/ui/Input';
import Button from '@/components/ui/Button';

interface Props {
  filters: JobFilters;
  onChange: (f: JobFilters) => void;
  onClear: () => void;
}

export function SearchBar({ filters, onChange }: { filters: JobFilters; onChange: (f: JobFilters) => void; }) {
  const [value, setValue] = useState(filters.q || '');
  useEffect(() => setValue(filters.q || ''), [filters.q]);
  useEffect(() => {
    const t = setTimeout(() => {
      onChange({ ...filters, q: value, page: 1 });
    }, 400);
    return () => clearTimeout(t);
  }, [value, filters, onChange]);
  return (
    <div>
      <label htmlFor="job-search" className="sr-only">
        Search jobs
      </label>
      <Input
        id="job-search"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Search jobs"
      />
    </div>
  );
}

export function FilterPanel({ filters, onChange }: { filters: JobFilters; onChange: (f: JobFilters) => void; }) {
  return (
    <div className="flex flex-wrap gap-4">
      <div>
        <label htmlFor="location" className="block text-sm">
          Location
        </label>
        <Input
          id="location"
          className="w-40"
          value={filters.location || ''}
          onChange={(e) => onChange({ ...filters, location: e.target.value, page: 1 })}
        />
      </div>
      <div>
        <label htmlFor="category" className="block text-sm">
          Category
        </label>
        <Input
          id="category"
          className="w-40"
          value={filters.category || ''}
          onChange={(e) => onChange({ ...filters, category: e.target.value, page: 1 })}
        />
      </div>
      <div>
        <label htmlFor="type" className="block text-sm">
          Type
        </label>
        <select
          id="type"
          className="border rounded px-2 py-1"
          value={filters.type || ''}
          onChange={(e) =>
            onChange({ ...filters, type: e.target.value || undefined, page: 1 })
          }
        >
          <option value="">Any</option>
          <option value="full-time">Full-time</option>
          <option value="part-time">Part-time</option>
          <option value="contract">Contract</option>
          <option value="intern">Intern</option>
          <option value="gig">Gig</option>
        </select>
      </div>
      <div className="flex items-center gap-1 mt-6">
        <input
          id="remote"
          type="checkbox"
          checked={!!filters.remote}
          onChange={(e) => onChange({ ...filters, remote: e.target.checked, page: 1 })}
        />
        <label htmlFor="remote" className="text-sm">
          Remote
        </label>
      </div>
      <div>
        <label htmlFor="minSalary" className="block text-sm">
          Min Salary
        </label>
        <Input
          id="minSalary"
          type="number"
          className="w-32"
          value={filters.minSalary?.toString() || ''}
          onChange={(e) =>
            onChange({
              ...filters,
              minSalary: e.target.value ? Number(e.target.value) : undefined,
              page: 1,
            })
          }
        />
      </div>
      <div>
        <label htmlFor="maxSalary" className="block text-sm">
          Max Salary
        </label>
        <Input
          id="maxSalary"
          type="number"
          className="w-32"
          value={filters.maxSalary?.toString() || ''}
          onChange={(e) =>
            onChange({
              ...filters,
              maxSalary: e.target.value ? Number(e.target.value) : undefined,
              page: 1,
            })
          }
        />
      </div>
      <div className="flex items-center gap-1 mt-6">
        <input
          id="savedOnly"
          type="checkbox"
          checked={!!filters.savedOnly}
          onChange={(e) =>
            onChange({ ...filters, savedOnly: e.target.checked, page: 1 })
          }
        />
        <label htmlFor="savedOnly" className="text-sm">
          Saved only
        </label>
      </div>
    </div>
  );
}

export function SortSelect({ filters, onChange }: { filters: JobFilters; onChange: (f: JobFilters) => void; }) {
  return (
    <div>
      <label htmlFor="sort" className="block text-sm">
        Sort
      </label>
      <select
        id="sort"
        className="border rounded px-2 py-1"
        value={filters.sort || 'recent'}
        onChange={(e) =>
          onChange({
            ...filters,
            sort: e.target.value as JobFilters['sort'],
            page: 1,
          })
        }
      >
        <option value="recent">Recent</option>
        <option value="salary">Salary</option>
        <option value="relevance">Relevance</option>
      </select>
    </div>
  );
}

export function SelectedChips({ filters, onChange }: { filters: JobFilters; onChange: (f: JobFilters) => void; }) {
  const chips: { key: keyof JobFilters; label: string }[] = [];
  Object.entries(filters).forEach(([k, v]) => {
    if (v && !['page', 'limit'].includes(k)) {
      let label = '';
      if (k === 'remote') label = 'Remote';
      else if (k === 'savedOnly') label = 'Saved';
      else label = `${k}:${v}`;
      chips.push({ key: k as keyof JobFilters, label });
    }
  });
  if (!chips.length) return null;
  return (
    <div className="flex flex-wrap gap-2">
      {chips.map((c) => (
        <button
          key={c.key as string}
          className="px-2 py-1 bg-gray-200 rounded text-sm"
          onClick={() => onChange({ ...filters, [c.key]: undefined, page: 1 })}
        >
          {c.label} ×
        </button>
      ))}
    </div>
  );
}

export function ClearAll({ onClear }: { onClear: () => void }) {
  return (
    <Button variant="outline" onClick={onClear}>
      Clear all
    </Button>
  );
}

export default function JobsFilters({ filters, onChange, onClear }: Props) {
  return (
    <section className="space-y-4">
      <SearchBar filters={filters} onChange={onChange} />
      <FilterPanel filters={filters} onChange={onChange} />
      <SortSelect filters={filters} onChange={onChange} />
      <SelectedChips filters={filters} onChange={onChange} />
      <ClearAll onClear={onClear} />
    </section>
  );
}
