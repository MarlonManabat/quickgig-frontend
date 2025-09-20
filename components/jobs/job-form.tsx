'use client';

import { useMemo, useState } from 'react';
import { useFormState, useFormStatus } from 'react-dom';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { getCityOptions, getRegionOptions } from '@/lib/regions';

export type FormState = {
  error?: string;
};

type JobFormProps = {
  action: (prevState: FormState, formData: FormData) => Promise<FormState>;
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending ? 'Nagpo-post…' : 'I-post ang Gig'}
    </Button>
  );
}

export function JobForm({ action }: JobFormProps) {
  const [state, formAction] = useFormState(action, { error: undefined });
  const [region, setRegion] = useState('');
  const [city, setCity] = useState('');

  const regions = useMemo(() => getRegionOptions(), []);
  const cities = useMemo(() => getCityOptions(region || undefined), [region]);

  return (
    <form data-testid="post-job-form" action={formAction} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="title">Pamagat ng Gig</Label>
        <Input id="title" name="title" placeholder="Hal. Part-time Barista" required maxLength={120} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="description">Detalye</Label>
        <Textarea
          id="description"
          name="description"
          placeholder="Ikuwento ang trabaho, oras, at mga benepisyo."
          required
          maxLength={2000}
        />
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="region">Rehiyon</Label>
          <Select
            value={region}
            onValueChange={(value) => {
              setRegion(value);
              setCity('');
            }}
          >
            <SelectTrigger id="region">
              <SelectValue placeholder="Piliin ang Rehiyon" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Piliin ang Rehiyon</SelectItem>
              {regions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <input type="hidden" name="region" value={region} required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="city">Lungsod</Label>
          <Select value={city} onValueChange={(value) => setCity(value)} disabled={!region}>
            <SelectTrigger id="city">
              <SelectValue placeholder="Piliin ang Lungsod" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Piliin ang Lungsod</SelectItem>
              {cities.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <input type="hidden" name="city" value={city} required />
        </div>
      </div>
      <div className="flex items-center gap-2">
        <input id="published" name="published" type="checkbox" defaultChecked className="h-4 w-4" />
        <Label htmlFor="published">I-publish agad ang gig</Label>
      </div>
      {state?.error ? <p className="text-sm text-destructive">{state.error}</p> : null}
      <SubmitButton />
    </form>
  );
}
