import { ReactNode } from "react";

export default function AdminTable({ children }: { children: ReactNode }) {
  return <table className="w-full text-sm border-collapse">{children}</table>;
}
