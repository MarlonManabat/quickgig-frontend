'use client';
import { useState } from 'react';
import { t } from '@/lib/i18n';
import { toast } from '@/lib/toast';
import { createInvite } from '@/lib/interviews';
import type { Interview } from '@/types/interview';

interface Props {
  jobId: string;
  applicantId: string;
  onCreated?: (iv: Interview) => void;
  onClose: () => void;
}

export default function InterviewForm({ jobId, applicantId, onCreated, onClose }: Props) {
  const [startsAt, setStartsAt] = useState('');
  const [duration, setDuration] = useState<number>(
    parseInt(process.env.NEXT_PUBLIC_INTERVIEW_SLOT_MINUTES || '30', 10),
  );
  const [method, setMethod] = useState<string>(
    process.env.NEXT_PUBLIC_INTERVIEW_DEFAULT_METHOD || 'video',
  );
  const [location, setLocation] = useState('');
  const [notes, setNotes] = useState('');
  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const interview = await createInvite({
        jobId,
        applicantId,
        startsAt,
        durationMin: duration,
        method: method as Interview['method'],
        locationOrLink: location || undefined,
        notes: notes || undefined,
      });
      toast(t('interviews.sent'));
      onCreated?.(interview);
      onClose();
    } catch {
      toast('Error');
    }
  };
  return (
    <form onSubmit={submit} className="space-y-2 p-4">
      <label className="block">
        {t('interviews.when')}
        <input
          type="datetime-local"
          value={startsAt}
          onChange={(e) => setStartsAt(e.target.value)}
          className="border p-1 w-full"
          required
        />
      </label>
      <label className="block">
        Duration (min)
        <input
          type="number"
          value={duration}
          onChange={(e) => setDuration(Number(e.target.value))}
          className="border p-1 w-full"
        />
      </label>
      <div>
        {['video', 'phone', 'in_person'].map((m) => (
          <label key={m} className="mr-4 text-sm">
            <input
              type="radio"
              name="method"
              value={m}
              checked={method === m}
              onChange={(e) => setMethod(e.target.value)}
              className="mr-1"
            />
            {t(`interviews.method.${m}`)}
          </label>
        ))}
      </div>
      <label className="block">
        {t('interviews.where')}
        <input
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="border p-1 w-full"
        />
      </label>
      <label className="block">
        {t('interviews.notes')}
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className="border p-1 w-full"
        />
      </label>
      <div className="flex gap-2 justify-end pt-2">
        <button type="button" onClick={onClose} className="px-2 py-1 border">
          {t('cancel')}
        </button>
        <button type="submit" className="px-2 py-1 bg-blue-600 text-white">
          {t('interviews.invite')}
        </button>
      </div>
    </form>
  );
}
