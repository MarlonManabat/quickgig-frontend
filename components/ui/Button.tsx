import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'outline' | 'subtle' | 'destructive' | 'qg-primary' | 'qg-outline';
}

export default function Button({ variant = 'primary', className = '', ...props }: ButtonProps) {
  const base =
    'inline-flex h-11 min-h-[44px] w-full sm:w-auto items-center justify-center rounded-xl px-4 text-base md:text-lg font-medium focus:outline-none focus:ring-2 focus:ring-brand-accent';
  const styles: Record<NonNullable<ButtonProps['variant']>, string> = {
    primary:
      'bg-brand-accent text-brand-foreground hover:bg-brand-accent/90 shadow-[0_6px_20px_rgba(250,204,21,0.35)]',
    outline:
      'border border-brand-border text-brand-foreground bg-surface-base hover:bg-surface-raised',
    subtle: 'bg-surface-raised text-brand-foreground hover:bg-surface-base',
    destructive: 'bg-brand-danger text-white hover:bg-brand-danger/90',
    'qg-primary': 'qg-btn qg-btn--primary',
    'qg-outline': 'qg-btn qg-btn--outline',
  };
  const useBase = variant !== 'qg-primary' && variant !== 'qg-outline';
  return <button className={`${useBase ? base : ''} ${styles[variant]} ${className}`.trim()} {...props} />;
}
