import { ReactNode } from "react";

export default function Badge({ children }: { children: ReactNode }) {
  return <span className="inline-block rounded-full px-2.5 py-0.5 text-xs border">{children}</span>;
}

