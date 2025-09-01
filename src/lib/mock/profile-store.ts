export type ProfileRecord = {
  fullName?: string;
  location?: string;
  bio?: string;
};

export const profileStore = new Map<string, ProfileRecord>();
