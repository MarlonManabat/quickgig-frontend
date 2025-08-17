export type UploadedFile = {
  id: string;
  name: string;
  type: string;
  size: number; // bytes
  data?: string; // Base64 data URL (may be truncated for storage)
  createdAt: number;
};
