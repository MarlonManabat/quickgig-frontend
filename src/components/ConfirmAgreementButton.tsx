"use client";
import { RequireTickets } from '@/components/RequireTickets';

export function ConfirmAgreementButton({ agreementId }: { agreementId: string }) {
  async function confirmAgreement(id: string) {
    const r = await fetch(`/api/agreements/${id}/confirm`, { method: 'POST' });
    const j = await r.json();
    if (!r.ok || !j?.ok) throw new Error(j?.error || 'Failed');
    alert('Agreement confirmed. 1 ticket was spent from both parties.');
  }

  return (
    <RequireTickets need={1}>
      {(ok) => (
        <button
          id="agree-accept"
          className="rounded-md px-4 py-2 border disabled:opacity-50"
          disabled={!ok}
          onClick={() =>
            ok
              ? confirmAgreement(agreementId).catch(e =>
                  alert(e?.message || 'Failed'),
                )
              : alert('You need 1 ticket to confirm an agreement.')
          }
        >
          Confirm agreement
        </button>
      )}
    </RequireTickets>
  );
}
