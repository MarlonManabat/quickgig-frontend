'use client';
import { useState } from 'react';
import { t } from '@/lib/i18n';
import { toast } from '@/lib/toast';

export default function ReportJob({ id }: { id: string }) {
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState<'spam' | 'duplicate' | 'offensive' | 'other'>('spam');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await fetch(`/api/jobs/${id}/report`, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ reason, notes }),
      });
      toast(t('report_thanks'));
      setOpen(false);
      setReason('spam');
      setNotes('');
    } catch {
      /* ignore */
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button onClick={() => setOpen(true)} className="text-sm text-red-600 hover:underline">
        {t('report_job')}
      </button>
      {open && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <form onSubmit={submit} className="bg-white rounded p-4 w-full max-w-sm space-y-2">
            <h2 className="text-lg font-semibold">{t('report_job')}</h2>
            <div className="space-y-1">
              <label className="flex items-center gap-2">
                <input type="radio" name="reason" value="spam" checked={reason==='spam'} onChange={()=>setReason('spam')} />
                {t('reason_spam')}
              </label>
              <label className="flex items-center gap-2">
                <input type="radio" name="reason" value="duplicate" checked={reason==='duplicate'} onChange={()=>setReason('duplicate')} />
                {t('reason_duplicate')}
              </label>
              <label className="flex items-center gap-2">
                <input type="radio" name="reason" value="offensive" checked={reason==='offensive'} onChange={()=>setReason('offensive')} />
                {t('reason_offensive')}
              </label>
              <label className="flex items-center gap-2">
                <input type="radio" name="reason" value="other" checked={reason==='other'} onChange={()=>setReason('other')} />
                {t('reason_other')}
              </label>
            </div>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder={t('notes_optional')}
              className="w-full border px-2 py-1"
            />
            <div className="flex justify-end gap-2 pt-2">
              <button type="button" onClick={() => setOpen(false)} className="px-3 py-1 border rounded">
                {t('cancel')}
              </button>
              <button type="submit" disabled={loading} className="px-3 py-1 bg-red-600 text-white rounded disabled:opacity-50">
                {t('submit')}
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
}
