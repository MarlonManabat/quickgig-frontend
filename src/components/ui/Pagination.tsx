import * as React from "react";

interface PaginationProps {
  page: number;
  totalPages: number;
  onPageChange?: (page: number) => void;
}

export default function Pagination({
  page,
  totalPages,
  onPageChange,
}: PaginationProps) {
  return (
    <div className="flex justify-center items-center gap-2 mt-4">
      <button
        className="px-3 py-1 rounded-2xl border border-brand-border disabled:opacity-50"
        disabled={page <= 1}
        onClick={() => onPageChange?.(page - 1)}
      >
        Prev
      </button>
      <span className="text-sm">
        Page {page} of {totalPages}
      </span>
      <button
        className="px-3 py-1 rounded-2xl border border-brand-border disabled:opacity-50"
        disabled={page >= totalPages}
        onClick={() => onPageChange?.(page + 1)}
      >
        Next
      </button>
    </div>
  );
}
