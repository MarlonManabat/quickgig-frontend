'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { API } from '@/config/api';
import { toast } from '@/lib/toast';
import { apiPost } from '@/lib/api';

export default function ResetPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await apiPost(API.requestPasswordReset, { email });
      toast('If that email exists, a reset link has been sent.');
    } catch (err) {
      console.warn('password reset', err);
      toast('If that email exists, a reset link has been sent.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="p-4 space-y-6 max-w-md">
      <h1 className="text-xl font-semibold">Reset Password</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          type="email"
          label="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <Button type="submit" disabled={loading}>
          {loading ? 'Sending...' : 'Send reset link'}
        </Button>
      </form>
    </main>
  );
}
