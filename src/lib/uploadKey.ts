export const makeUploadKey = (kind: 'avatars'|'resumes', filename: string) =>
  `uploads/${kind}/${crypto.randomUUID()}-${filename.replace(/\s+/g,'-')}`;
