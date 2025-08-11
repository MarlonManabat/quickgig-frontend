'use client';

import React from 'react';
import { cn } from '../lib/utils';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  loading?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', children, loading, disabled, ...props }, ref) => {
    const baseClasses = 'qg-btn inline-flex items-center justify-center gap-2 font-heading font-semibold transition-all duration-qg-fast focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';
    
    const variants = {
      primary: 'qg-btn-primary focus:ring-qg-primary',
      secondary: 'qg-btn-secondary focus:ring-qg-accent',
      outline: 'qg-btn-outline focus:ring-qg-primary',
      ghost: 'bg-transparent text-qg-primary hover:bg-qg-primary/10 focus:ring-qg-primary',
    };
    
    const sizes = {
      sm: 'px-3 py-1.5 text-sm rounded-qg-sm',
      md: 'px-6 py-3 text-base rounded-qg-md',
      lg: 'px-8 py-4 text-lg rounded-qg-lg',
    };

    return (
      <button
        className={cn(
          baseClasses,
          variants[variant],
          sizes[size],
          loading && 'cursor-wait',
          className
        )}
        disabled={disabled || loading}
        ref={ref}
        {...props}
      >
        {loading && (
          <svg
            className="animate-spin -ml-1 mr-2 h-4 w-4"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
        )}
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';

export default Button;

