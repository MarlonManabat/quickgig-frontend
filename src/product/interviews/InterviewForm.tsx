'use client';
import { useState } from 'react';
import { t } from '@/lib/i18n';
import { toast } from '@/lib/toast';
import type { Interview } from '@/src/types/interview';

interface Props {
  appId: string;
  jobId: string;
  employerId: string;
  applicantId: string;
  initial?: Partial<Interview>;
  onDone?: () => void;
}

export default function InterviewForm({ appId, jobId, employerId, applicantId, initial, onDone }: Props) {
  const [method, setMethod] = useState<Interview['method']>(
    (initial?.method as Interview['method']) || (process.env.NEXT_PUBLIC_INTERVIEW_DEFAULT_METHOD as Interview['method']) || 'video',
  );
  const [when, setWhen] = useState(
    initial?.whenISO ? initial.whenISO.slice(0, 16) : '',
  );
  const [duration, setDuration] = useState(
    initial?.durationMins || parseInt(process.env.NEXT_PUBLIC_INTERVIEW_SLOT_MINUTES || '30', 10),
  );
  const [note, setNote] = useState(initial?.note || '');

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      appId,
      jobId,
      employerId,
      applicantId,
      method,
      whenISO: new Date(when).toISOString(),
      durationMins: duration,
      note: note || undefined,
    };
    const url = initial?.id ? `/api/interviews/${initial.id}` : '/api/interviews';
    const res = await fetch(url, {
      method: initial?.id ? 'PATCH' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(initial?.id ? { ...payload } : payload),
    });
    if (res.ok) {
      toast(initial?.id ? t('interviews.toast_updated') : t('interviews.toast_sent'));
      onDone?.();
    } else {
      toast('Error');
    }
  };

  return (
    <form onSubmit={submit} className="space-y-2 p-4">
      <label className="block text-sm">
        {t('interviews.section_title')}
        <select value={method} onChange={(e) => setMethod(e.target.value as Interview['method'])} className="border p-1 w-full">
          <option value="video">{t('interviews.method_video')}</option>
          <option value="phone">{t('interviews.method_phone')}</option>
          <option value="in_person">{t('interviews.method_in_person')}</option>
        </select>
      </label>
      <label className="block text-sm">
        Date/time
        <input
          type="datetime-local"
          value={when}
          onChange={(e) => setWhen(e.target.value)}
          className="border p-1 w-full"
          required
        />
      </label>
      <label className="block text-sm">
        Duration (mins)
        <input
          type="number"
          value={duration}
          onChange={(e) => setDuration(Number(e.target.value))}
          className="border p-1 w-full"
        />
      </label>
      <label className="block text-sm">
        {t('notes_optional')}
        <textarea value={note} onChange={(e) => setNote(e.target.value)} className="border p-1 w-full" />
      </label>
      <div className="flex justify-end gap-2 pt-2">
        <button type="submit" className="px-2 py-1 bg-blue-600 text-white rounded">
          {t('submit')}
        </button>
      </div>
    </form>
  );
}
