import * as React from 'react';

import { cn } from '@/lib/utils';

const Badge = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('inline-flex items-center rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-medium uppercase tracking-wide text-primary', className)}
    {...props}
  />
));
Badge.displayName = 'Badge';

export { Badge };
