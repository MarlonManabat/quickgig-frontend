'use client';

import React from 'react';
import { cn } from '@/lib/cn';
import { env } from '@/config/env';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helper?: string;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
}

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helper?: string;
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  helper?: string;
  options: { value: string; label: string }[];
  placeholder?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, helper, icon, iconPosition = 'left', type, ...props }, ref) => {
    const inputId = React.useId();

    return (
      <div className="space-y-2">
        {label && (
          <label htmlFor={inputId} className="block text-sm font-medium text-fg">
            {label}
          </label>
        )}
        <div className="relative">
          {icon && iconPosition === 'left' && (
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
              {icon}
            </div>
          )}
          <input
            type={type}
            id={inputId}
            className={cn(
              env.NEXT_PUBLIC_ENABLE_APP_SHELL_V2
                ? 'block w-full px-4 py-3 border border-muted rounded-md bg-fg text-bg'
                : 'block w-full px-4 py-3 border-2 border-gray-300 rounded-qg-md font-body',
              env.NEXT_PUBLIC_ENABLE_APP_SHELL_V2
                ? 'focus:ring-2 focus:ring-primary focus:border-primary'
                : 'focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-qg-fast',
              'placeholder:text-gray-400',
              error &&
                (env.NEXT_PUBLIC_ENABLE_APP_SHELL_V2
                  ? 'border-red-500'
                  : 'border-red-300 focus:border-red-500 focus:ring-red-500/20'),
              icon && iconPosition === 'left' && 'pl-10',
              icon && iconPosition === 'right' && 'pr-10',
              className
            )}
            ref={ref}
            {...props}
          />
          {icon && iconPosition === 'right' && (
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-gray-400">
              {icon}
            </div>
          )}
        </div>
        {error && (
          <p className="text-sm text-red-600 font-medium">{error}</p>
        )}
        {helper && !error && (
          <p className="text-sm text-gray-500">{helper}</p>
        )}
      </div>
    );
  }
);

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, error, helper, ...props }, ref) => {
    const textareaId = React.useId();

    return (
      <div className="space-y-2">
        {label && (
          <label htmlFor={textareaId} className="block text-sm font-medium text-fg">
            {label}
          </label>
        )}
        <textarea
          id={textareaId}
          className={cn(
            env.NEXT_PUBLIC_ENABLE_APP_SHELL_V2
              ? 'block w-full px-4 py-3 border border-muted rounded-md bg-fg text-bg'
              : 'block w-full px-4 py-3 border-2 border-gray-300 rounded-qg-md font-body',
            env.NEXT_PUBLIC_ENABLE_APP_SHELL_V2
              ? 'focus:ring-2 focus:ring-primary focus:border-primary'
              : 'focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-qg-fast',
            'placeholder:text-gray-400 resize-vertical min-h-[100px]',
            error &&
              (env.NEXT_PUBLIC_ENABLE_APP_SHELL_V2
                ? 'border-red-500'
                : 'border-red-300 focus:border-red-500 focus:ring-red-500/20'),
            className
          )}
          ref={ref}
          {...props}
        />
        {error && (
          <p className="text-sm text-red-600 font-medium">{error}</p>
        )}
        {helper && !error && (
          <p className="text-sm text-gray-500">{helper}</p>
        )}
      </div>
    );
  }
);

const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, label, error, helper, options, placeholder, ...props }, ref) => {
    const selectId = React.useId();

    return (
      <div className="space-y-2">
        {label && (
          <label htmlFor={selectId} className="block text-sm font-medium text-fg">
            {label}
          </label>
        )}
        <select
          id={selectId}
          className={cn(
            env.NEXT_PUBLIC_ENABLE_APP_SHELL_V2
              ? 'block w-full px-4 py-3 border border-muted rounded-md bg-fg text-bg cursor-pointer'
              : 'block w-full px-4 py-3 border-2 border-gray-300 rounded-qg-md font-body',
            env.NEXT_PUBLIC_ENABLE_APP_SHELL_V2
              ? 'focus:ring-2 focus:ring-primary focus:border-primary'
              : 'focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-qg-fast',
            error &&
              (env.NEXT_PUBLIC_ENABLE_APP_SHELL_V2
                ? 'border-red-500'
                : 'border-red-300 focus:border-red-500 focus:ring-red-500/20'),
            className
          )}
          ref={ref}
          {...props}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {error && (
          <p className="text-sm text-red-600 font-medium">{error}</p>
        )}
        {helper && !error && (
          <p className="text-sm text-gray-500">{helper}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
Textarea.displayName = 'Textarea';
Select.displayName = 'Select';

export { Input, Textarea, Select };

