export default function PostJobSkeleton(props: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <main
      {...props}
      className={"mx-auto max-w-5xl p-6 animate-pulse " + (props.className ?? "")}
    >
      <div className="h-8 w-64 bg-slate-200 rounded mb-6" />
      <div className="space-y-3">
        <div className="h-24 bg-slate-200 rounded" />
        <div className="h-24 bg-slate-200 rounded" />
        <div className="h-24 bg-slate-200 rounded" />
      </div>
    </main>
  );
}
