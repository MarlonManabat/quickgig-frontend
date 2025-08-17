import * as React from 'react';
import { UploadedFile } from '@/types/upload';
import { uploadFile, MAX_MB, ACCEPT_STRING } from '@/lib/upload';
import { toast } from '@/lib/toast';
import { t } from '@/lib/t';

interface Props {
  label: string;
  accept?: string;
  kind: 'resume' | 'avatar';
  onSaved: (f: UploadedFile | null) => void;
  file?: UploadedFile | null;
}

export default function UploadField({ label, accept, kind, onSaved, file: initial }: Props) {
  const [file, setFile] = React.useState<UploadedFile | null>(initial || null);
  const [uploading, setUploading] = React.useState(false);
  const [progress, setProgress] = React.useState(0);
  const [enabled, setEnabled] = React.useState(true);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const abortRef = React.useRef<AbortController | null>(null);

  React.useEffect(() => {
    setFile(initial || null);
  }, [initial]);

  React.useEffect(() => {
    // detect config on mount
    if (!ACCEPT_STRING) return;
    (async () => {
      try {
        const r = await fetch('/api/upload/sign', {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({ filename: 'ping', contentType: 'application/pdf', size: 0 }),
        });
        if (r.status === 501) setEnabled(false);
      } catch {
        /* ignore */
      }
    })();
  }, []);

  const open = () => {
    if (enabled && !uploading) inputRef.current?.click();
  };

  const onChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setUploading(true);
    setProgress(0);
    const ctrl = new AbortController();
    abortRef.current = ctrl;
    try {
      const { publicUrl } = await uploadFile(f, (p) => setProgress(p), ctrl.signal);
      const up: UploadedFile = { name: f.name, url: publicUrl, contentType: f.type, size: f.size };
      setFile(up);
      onSaved(up);
      toast(t(kind === 'resume' ? 'profile.resume.saved' : 'profile.avatar.saved'));
    } catch (err: unknown) {
      const code = err instanceof Error ? err.message : String(err);
      if (code === 'too_big') toast(t('upload.too_big', { n: MAX_MB }));
      else if (code === 'bad_type') toast(t('upload.bad_type'));
      else if (code === 'canceled') toast(t('upload.canceled'));
      else if (code === 'not_configured') {
        setEnabled(false);
        toast('Uploads not configured');
      } else toast('Upload failed');
    } finally {
      setUploading(false);
      setProgress(0);
      if (inputRef.current) inputRef.current.value = '';
    }
  };

  const cancel = () => {
    abortRef.current?.abort();
  };

  const remove = () => {
    setFile(null);
    onSaved(null);
  };

  return (
    <div style={{ display: 'grid', gap: 4 }}>
      <label style={{ fontWeight: 600 }}>{label}</label>
      {file ? (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {kind === 'avatar' && (
            <img
              src={file.url}
              alt="avatar"
              style={{ width: 48, height: 48, borderRadius: '50%', objectFit: 'cover' }}
            />
          )}
          {kind === 'resume' && (
            <a href={file.url} target="_blank" rel="noreferrer" style={{ marginRight: 8 }}>
              {t('upload.view_resume')}
            </a>
          )}
          <div style={{ flex: 1 }}>{file.name}</div>
          <button
            type="button"
            onClick={open}
            style={{ marginRight: 8, textDecoration: 'underline', background: 'none', border: 'none', cursor: 'pointer' }}
          >
            {t('profile.resume.replace')}
          </button>
          <button
            type="button"
            onClick={remove}
            style={{ textDecoration: 'underline', background: 'none', border: 'none', cursor: 'pointer' }}
          >
            {t('profile.resume.remove')}
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={open}
          disabled={!enabled}
          title={!enabled ? 'Uploads not configured' : undefined}
          style={{
            padding: '10px 12px',
            borderRadius: 8,
            border: '1px solid #ccc',
            background: '#fff',
            cursor: !enabled ? 'not-allowed' : 'pointer',
            textAlign: 'left',
          }}
        >
          {uploading ? t('upload.uploading') : t('profile.resume.replace')}
        </button>
      )}
      {uploading && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ flex: 1, height: 4, background: '#eee', borderRadius: 2 }}>
            <div
              style={{
                width: `${Math.round(progress * 100)}%`,
                height: '100%',
                background: '#0069d1',
              }}
            />
          </div>
          <button
            type="button"
            onClick={cancel}
            style={{ textDecoration: 'underline', background: 'none', border: 'none', cursor: 'pointer' }}
          >
            Cancel
          </button>
        </div>
      )}
      <input ref={inputRef} type="file" accept={accept || ACCEPT_STRING} style={{ display: 'none' }} onChange={onChange} />
      {kind === 'resume' && !file && !uploading && (
        <div style={{ fontSize: 12, color: '#666' }}>{t('profile.resume.hint', { mb: MAX_MB })}</div>
      )}
    </div>
  );
}
