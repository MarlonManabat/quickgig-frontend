'use client';
import React from 'react';

type Props = {
  page: number;
  total: number;
  pageSize: number;
  onPageChange: (p: number) => void;
};

export default function Pagination({ page, total, pageSize, onPageChange }: Props) {
  const totalPages = Math.ceil(total / pageSize);
  if (totalPages <= 1) return null;
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);
  return (
    <nav className="flex items-center gap-2" aria-label="Pagination">
      <button
        className="px-2 py-1 border rounded disabled:opacity-50"
        onClick={() => onPageChange(Math.max(1, page - 1))}
        disabled={page <= 1}
      >
        Prev
      </button>
      {pages.map((p) => (
        <button
          key={p}
          className={`px-3 py-1 border rounded ${p === page ? 'bg-gray-200' : ''}`}
          onClick={() => onPageChange(p)}
        >
          {p}
        </button>
      ))}
      <button
        className="px-2 py-1 border rounded disabled:opacity-50"
        onClick={() => onPageChange(Math.min(totalPages, page + 1))}
        disabled={page >= totalPages}
      >
        Next
      </button>
    </nav>
  );
}
