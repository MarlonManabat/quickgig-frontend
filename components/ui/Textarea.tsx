import * as React from 'react';

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className = '', ...props }, ref) => (
    <textarea
      ref={ref}
      className={`w-full rounded-2xl border border-brand-border bg-surface-base px-3 py-2 text-brand-foreground placeholder-brand-muted focus:outline-none focus:ring-2 focus:ring-brand-primary ${className}`.trim()}
      {...props}
    />
  )
);
Textarea.displayName = 'Textarea';

export default Textarea;
