import { cn } from '@utils/cn';
import React from 'react';

export const Container = ({ className, ...p }: React.HTMLAttributes<HTMLDivElement>) => (
  <div {...p} className={cn('mx-auto w-full max-w-[1100px] px-4 sm:px-6 md:px-8', className)} />
);

export default Container;
