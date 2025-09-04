export default function PostJobSkeleton(
  props: React.HTMLAttributes<HTMLDivElement>
) {
  return (
    <div
      {...props}
      data-testid="post-job-skeleton"
      className={`animate-pulse border rounded p-4 space-y-2 ${
        props.className ?? ""
      }`}
    >
      <div className="h-6 bg-gray-200 rounded w-1/3" />
      <div className="h-4 bg-gray-200 rounded" />
      <div className="h-4 bg-gray-200 rounded w-5/6" />
    </div>
  );
}
