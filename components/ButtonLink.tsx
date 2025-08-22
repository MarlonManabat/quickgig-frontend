import * as React from 'react';
import { useRouter } from 'next/router';
import { safePush, hasDynamicParam, fillPath } from '@/utils/safeNav';

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  to: string;
  params?: Record<string,string|number|undefined|null>;
};

export default function ButtonLink({ to, params = {}, onClick, type, ...rest }: Props) {
  const router = useRouter();
  return (
    <button
      type={type ?? 'button'}
      onClick={(e) => {
        onClick?.(e);
        if (!e.defaultPrevented) {
          const path = hasDynamicParam(to) ? fillPath(to, params) : to;
          safePush(router, path, params);
        }
      }}
      {...rest}
    />
  );
}
