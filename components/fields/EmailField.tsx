'use client';
import * as React from 'react';

type Props = Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> & {
  label?: string;
  testId?: string;
};

const EmailField = React.forwardRef<HTMLInputElement, Props>(function EmailField(
  { id = 'email', label = 'Email address', testId = 'email-input', className = '', ...rest },
  ref
) {
  return (
    <div className="mb-5">
      <label htmlFor={id} className="block text-sm font-medium mb-1">{label}</label>
      <input
        id={id}
        ref={ref}
        type="email"
        data-testid={testId}
        autoComplete="email"
        inputMode="email"
        enterKeyHint="done"
        autoCapitalize="none"
        spellCheck={false}
        className={`w-full text-base md:text-lg leading-6 px-3 py-3 border rounded-lg ${className}`}
        {...rest}
      />
    </div>
  );
});

export default EmailField;
