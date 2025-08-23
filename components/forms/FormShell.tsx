"use client";
import { ReactNode } from 'react';
import Container from '../Container';
import { H1, P } from '../ui/Text';

interface Props {
  title?: ReactNode;
  description?: ReactNode;
  children: ReactNode;
}

export default function FormShell({ title, description, children }: Props) {
  return (
    <Container className="max-w-[700px] w-full">
      {title && <H1 className="mb-2">{title}</H1>}
      {description && <P className="mb-4 text-brand-subtle text-sm">{description}</P>}
      <div className="grid gap-4">{children}</div>
    </Container>
  );
}
