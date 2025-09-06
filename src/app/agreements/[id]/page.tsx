import { CancelAgreementButton } from '@/components/CancelAgreementButton';
import { ConfirmAgreementButton } from '@/components/ConfirmAgreementButton';
import supabaseServer from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function AgreementPage({ params }: { params: { id: string } }) {
  const supa = supabaseServer();
  if (!supa) return <p>Server not configured</p>;

  const { data: agreement } = await supa
    .from('agreements')
    .select('id, status')
    .eq('id', params.id)
    .single();

  if (!agreement) return <p>Agreement not found</p>;

  return (
    <div className="p-4 space-y-4">
      {agreement.status === 'pending' && (
        <ConfirmAgreementButton agreementId={agreement.id} />
      )}
      {agreement.status === 'agreed' && <CancelAgreementButton id={agreement.id} />}
    </div>
  );
}
