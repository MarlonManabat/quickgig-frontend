import * as React from "react";

interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className = "", ...props }, ref) => (
    <input
      type="checkbox"
      ref={ref}
      className={`h-5 w-5 rounded border-brand-border text-brand-primary focus:ring-brand-primary ${className}`.trim()}
      {...props}
    />
  ),
);
Checkbox.displayName = "Checkbox";

export default Checkbox;
