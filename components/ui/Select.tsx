import * as React from "react";

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {}

const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className = "", children, ...props }, ref) => (
    <select
      ref={ref}
      className={`w-full rounded-2xl border border-brand-border bg-surface-base px-3 py-2 text-brand-foreground focus:outline-none focus:ring-2 focus:ring-brand-primary ${className}`.trim()}
      {...props}
    >
      {children}
    </select>
  ),
);
Select.displayName = "Select";

export default Select;
