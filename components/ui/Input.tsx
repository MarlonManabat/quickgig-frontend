import * as React from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className = "", ...props }, ref) => (
    <input
      ref={ref}
      className={`h-11 min-h-[44px] w-full rounded-xl border border-brand-border bg-surface-base px-4 text-base md:text-lg text-brand-foreground placeholder-brand-muted focus:outline-none focus:ring-2 focus:ring-brand-primary ${className}`.trim()}
      {...props}
    />
  ),
);
Input.displayName = "Input";

export default Input;
