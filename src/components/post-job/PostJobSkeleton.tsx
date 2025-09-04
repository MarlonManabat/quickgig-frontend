"use client";

export default function PostJobSkeleton() {
  return (
    <div data-testid="post-job-skeleton" className="max-w-xl mx-auto p-4 sm:p-6 space-y-4 animate-pulse">
      <div className="h-6 w-1/3 bg-gray-200 rounded" />
      <div className="h-10 w-full bg-gray-200 rounded" />
      <div className="h-24 w-full bg-gray-200 rounded" />
      <div className="h-10 w-full bg-gray-200 rounded" />
      <div className="h-10 w-full bg-gray-200 rounded" />
    </div>
  );
}
