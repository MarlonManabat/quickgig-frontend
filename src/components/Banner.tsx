export default function Banner({
  kind = "info",
  children,
}: {
  kind?: "success" | "error" | "info";
  children: React.ReactNode;
}) {
  const base = "mb-4 rounded-md px-4 py-2 text-sm border";
  const map = {
    success: "bg-brand-success/10 border-brand-success text-brand-success",
    error: "bg-brand-danger/10 border-brand-danger text-brand-danger",
    info: "bg-brand-info/10 border-brand-info text-brand-info",
  } as const;
  return <div className={`${base} ${map[kind]}`}>{children}</div>;
}
