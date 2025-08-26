import * as React from "react";

interface TableProps extends React.HTMLAttributes<HTMLTableElement> {}

export default function Table({
  className = "",
  children,
  ...props
}: TableProps) {
  return (
    <div className="overflow-x-auto">
      <table
        className={`w-full text-left text-sm border border-brand-border ${className}`.trim()}
        {...props}
      >
        {children}
      </table>
    </div>
  );
}
