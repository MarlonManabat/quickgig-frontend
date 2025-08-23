import * as React from 'react';

interface RadioProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const Radio = React.forwardRef<HTMLInputElement, RadioProps>(
  ({ className = '', ...props }, ref) => (
    <input
      type="radio"
      ref={ref}
      className={`h-5 w-5 rounded-full border-brand-border text-brand-primary focus:ring-brand-primary ${className}`.trim()}
      {...props}
    />
  )
);
Radio.displayName = 'Radio';

export default Radio;
