'use client';

import React from 'react';
import { cn } from '@/lib/cn';
import { env } from '@/config/env';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  hover?: boolean;
  padding?: 'sm' | 'md' | 'lg';
}

interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  variant?: 'default' | 'primary' | 'accent';
}

interface CardContentProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

interface CardFooterProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

interface CardTagProps extends React.HTMLAttributes<HTMLSpanElement> {
  children: React.ReactNode;
  variant?: 'default' | 'primary' | 'accent';
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, children, hover = true, padding = 'md', ...props }, ref) => {
    const paddingClasses = {
      sm: 'p-4',
      md: 'p-6',
      lg: 'p-8',
    };

    return (
      <div
        ref={ref}
        className={cn(
          env.NEXT_PUBLIC_ENABLE_APP_SHELL_V2
            ? 'bg-fg text-bg rounded-lg shadow-qg-md transition-all duration-qg-normal'
            : 'bg-bg text-fg rounded-qg-lg shadow-qg-md transition-all duration-qg-normal',
          hover && 'hover:shadow-qg-lg hover:-translate-y-1 cursor-pointer',
          paddingClasses[padding],
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

const CardHeader = React.forwardRef<HTMLDivElement, CardHeaderProps>(
  ({ className, children, variant = 'default', ...props }, ref) => {
    const v1Variants = {
      default: 'bg-bg text-fg',
      primary: 'bg-primary text-fg',
      accent: 'bg-secondary text-fg',
    } as const;

    const v2Variants = {
      default: 'bg-fg text-bg',
      primary: 'bg-primary text-fg',
      accent: 'bg-secondary text-bg',
    } as const;

    const variants = env.NEXT_PUBLIC_ENABLE_APP_SHELL_V2 ? v2Variants : v1Variants;

    return (
      <div
        ref={ref}
        className={cn(
          'rounded-qg-lg rounded-b-none px-6 py-4 -mx-6 -mt-6 mb-4 font-heading font-semibold',
          variants[variant],
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

const CardContent = React.forwardRef<HTMLDivElement, CardContentProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn('space-y-4', className)}
        {...props}
      >
        {children}
      </div>
    );
  }
);

const CardFooter = React.forwardRef<HTMLDivElement, CardFooterProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn('flex items-center justify-between pt-4 mt-4 border-t border-gray-200', className)}
        {...props}
      >
        {children}
      </div>
    );
  }
);

const CardTag = React.forwardRef<HTMLSpanElement, CardTagProps>(
  ({ className, children, variant = 'default', ...props }, ref) => {
    const tagV1 = {
      default: 'bg-bg text-fg border border-fg',
      primary: 'bg-primary text-fg',
      accent: 'bg-secondary text-fg',
    } as const;

    const tagV2 = {
      default: 'bg-fg text-bg border border-bg',
      primary: 'bg-primary text-fg',
      accent: 'bg-secondary text-bg',
    } as const;

    const variants = env.NEXT_PUBLIC_ENABLE_APP_SHELL_V2 ? tagV2 : tagV1;

    return (
      <span
        ref={ref}
        className={cn(
          'inline-block px-3 py-1 text-sm font-medium rounded-qg-full',
          variants[variant],
          className
        )}
        {...props}
      >
        {children}
      </span>
    );
  }
);

Card.displayName = 'Card';
CardHeader.displayName = 'CardHeader';
CardContent.displayName = 'CardContent';
CardFooter.displayName = 'CardFooter';
CardTag.displayName = 'CardTag';

export { Card, CardHeader, CardContent, CardFooter, CardTag };

