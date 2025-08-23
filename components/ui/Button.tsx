import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'outline' | 'subtle' | 'destructive';
}

export default function Button({ variant = 'primary', className = '', ...props }: ButtonProps) {
  const base =
    'inline-flex h-11 min-h-[44px] w-full sm:w-auto items-center justify-center rounded-xl px-4 text-base md:text-lg font-medium focus:outline-none focus:ring-2 focus:ring-brand-primary';
  const styles: Record<NonNullable<ButtonProps['variant']>, string> = {
    primary: 'bg-brand-primary text-white hover:bg-brand-primary/90 shadow-soft',
    outline:
      'border border-brand-border text-brand-foreground bg-surface-base hover:bg-surface-raised',
    subtle: 'bg-surface-raised text-brand-foreground hover:bg-surface-base',
    destructive: 'bg-brand-danger text-white hover:bg-brand-danger/90',
  };
  return <button className={`${base} ${styles[variant]} ${className}`.trim()} {...props} />;
}
