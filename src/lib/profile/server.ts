import 'server-only';

import type { Profile, ProfileInput } from './schema';
import { adminSupabase } from '@/lib/supabase/server';
import { profileStore } from '../mock/profile-store';

let loggedMock = false;
function logMock() {
  if (!loggedMock) {
    console.log('[profile] using mock store');
    loggedMock = true;
  }
}

async function ensureTable(client: any) {
  const { error } = await client.from('profiles').select('id').limit(1);
  if (error && error.code === '42P01') {
    await client.rpc('exec', {
      sql: `create table if not exists profiles (
        id uuid primary key,
        full_name text,
        location text,
        bio text
      )`,
    });
  }
}

export async function getProfile(uid: string): Promise<Profile | null> {
  const supa = await adminSupabase();
  if (!supa) {
    logMock();
    return profileStore.get(uid) ?? null;
  }
  await ensureTable(supa);
  const { data, error } = await supa
    .from('profiles')
    .select('full_name, location, bio')
    .eq('id', uid)
    .single();
  if (error) {
    if (error.code === '42P01') {
      logMock();
      return profileStore.get(uid) ?? null;
    }
    if (error.code === 'PGRST116') return null;
    throw error;
  }
  return {
    fullName: data.full_name ?? undefined,
    location: data.location ?? undefined,
    bio: data.bio ?? undefined,
  };
}

export async function upsertProfile(uid: string, data: ProfileInput): Promise<void> {
  const supa = await adminSupabase();
  if (!supa) {
    logMock();
    profileStore.set(uid, { ...data });
    return;
  }
  await ensureTable(supa);
  const { error } = await supa.from('profiles').upsert(
    { id: uid, full_name: data.fullName, location: data.location, bio: data.bio },
    { onConflict: 'id' }
  );
  if (error) {
    logMock();
    profileStore.set(uid, { ...data });
  }
}
