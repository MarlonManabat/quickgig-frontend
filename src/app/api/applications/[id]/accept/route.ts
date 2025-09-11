import { NextResponse } from 'next/server';
import { requireUser } from '@/lib/auth/requireUser';
import { createAgreementFromApplication } from '@/lib/agreements';

export async function POST(_: Request, { params }: { params: { id: string } }) {
  const { user } = await requireUser();
  const id = await createAgreementFromApplication(params.id, user.id);
  return NextResponse.json({ id }, { status: 201 });
}
