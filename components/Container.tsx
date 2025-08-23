import * as React from 'react';

interface ContainerProps {
  children: React.ReactNode;
  variant?: 'form' | 'content';
  className?: string;
}

export default function Container({
  children,
  variant = 'content',
  className = '',
}: ContainerProps) {
  const max = variant === 'form' ? 'max-w-[700px]' : 'max-w-6xl';
  return (
    <div className={`${max} mx-auto px-4 sm:px-6 lg:px-8 ${className}`.trim()}>{children}</div>
  );
}
