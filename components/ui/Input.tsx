import React from 'react';

type Props = (React.InputHTMLAttributes<HTMLInputElement> & React.TextareaHTMLAttributes<HTMLTextAreaElement>) & {
  as?: 'input' | 'textarea';
};

export default function Input({ as = 'input', className = '', ...props }: Props) {
  const Component: any = as === 'textarea' ? 'textarea' : 'input';
  return <Component className={`input ${className}`.trim()} {...props} />;
}
