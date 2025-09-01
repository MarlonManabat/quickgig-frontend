import { z } from 'zod';

export const profileInput = z.object({
  fullName: z.string().min(1).max(80),
  location: z.string().max(80).optional().nullable(),
  bio: z.string().max(280).optional().nullable(),
});

export type ProfileInput = z.infer<typeof profileInput>;

export const profile = profileInput.partial();
export type Profile = z.infer<typeof profile>;
