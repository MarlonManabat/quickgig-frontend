'use client';
import * as React from 'react';

type Props = {
  id: string;
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
  autoFocus?: boolean;
  hint?: string;
  error?: string;
  name?: string;
} & React.InputHTMLAttributes<HTMLInputElement>;

const EmailField = React.forwardRef<HTMLInputElement, Props>(function EmailField(
  { id, label, value, onChange, required, autoFocus, hint, error, name = 'email', ...rest },
  ref
) {
  const hintId = hint ? `${id}-hint` : undefined;
  const errorId = error ? `${id}-error` : undefined;
  const describedBy = [hintId, errorId].filter(Boolean).join(' ') || undefined;
  return (
    <div className="min-w-0">
      <label htmlFor={id} className="block text-sm font-medium mb-1">{label}</label>
      <input
        id={id}
        ref={ref}
        type="email"
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        autoFocus={autoFocus}
        inputMode="email"
        autoComplete="email"
        spellCheck={false}
        className="block w-full min-w-0 rounded-lg border border-gray-300 bg-white px-3 py-2 text-base leading-6 text-gray-900 placeholder:text-gray-400 shadow-sm ring-1 ring-inset ring-transparent focus:outline-none focus:ring-2 focus:ring-blue-600 disabled:opacity-60"
        aria-invalid={!!error}
        aria-describedby={describedBy}
        {...rest}
      />
      {hint && (
        <p id={hintId} className="mt-1 text-sm text-gray-500">
          {hint}
        </p>
      )}
      {error && (
        <p id={errorId} className="mt-1 text-sm text-red-600">
          {error}
        </p>
      )}
    </div>
  );
});

export default EmailField;
