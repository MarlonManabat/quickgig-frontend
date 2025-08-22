import React from 'react';

interface BannerProps extends React.HTMLAttributes<HTMLDivElement> {
  kind?: 'info' | 'success' | 'error';
}

export default function Banner({ kind = 'info', className = '', ...props }: BannerProps) {
  const cls = {
    info: 'banner-info',
    success: 'banner-success',
    error: 'banner-error',
  }[kind];
  return <div className={`${cls} ${className}`.trim()} {...props} />;
}
