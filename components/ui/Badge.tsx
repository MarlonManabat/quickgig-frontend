import * as React from "react";

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {}

export default function Badge({ className = "", ...props }: BadgeProps) {
  return (
    <span
      className={`inline-block rounded-full bg-brand-primary/10 text-brand-foreground text-xs px-2 py-1 ${className}`.trim()}
      {...props}
    />
  );
}
