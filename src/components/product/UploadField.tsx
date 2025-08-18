import * as React from 'react';
import { UploadedFile } from '@/types/upload';
import { toBase64, truncateDataUrl, makeId } from '@/lib/baseUpload';
import { validateFile, MAX_MB } from '@/lib/uploadPolicy';
import { presign, putFile } from '@/lib/uploader';
import { makeUploadKey } from '@/lib/uploadKey';
import { toast } from '@/lib/toast';
import { t } from '@/lib/t';

interface Props {
  label: string;
  accept: string;
  kind: 'resume' | 'avatar';
  onSaved: (f: UploadedFile | null) => void;
  file?: UploadedFile | null;
}

export default function UploadField({ label, accept, kind, onSaved, file: initial }: Props) {
  const [file, setFile] = React.useState<UploadedFile | null>(initial || null);
  const [err, setErr] = React.useState('');
  const [progress, setProgress] = React.useState(0);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const useS3 = process.env.NEXT_PUBLIC_ENABLE_S3_UPLOADS === 'true';

  React.useEffect(() => { setFile(initial || null); }, [initial]);

  const open = () => { inputRef.current?.click(); };

  const onChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    const v = validateFile(f);
    if (!v.ok) {
      setErr(t(v.reason === 'too_big' ? 'upload.too_big' : 'upload.bad_type', { mb: MAX_MB }));
      return;
    }
    setErr('');

    if (useS3) {
      const key = makeUploadKey(kind === 'avatar' ? 'avatars' : 'resumes', f.name);
      try {
        const { url } = await presign(key, f.type);
        await putFile(url, f, p => {
          if (p.total) setProgress(Math.round((p.loaded / p.total) * 100));
        });
        const publicUrl = url.split('?')[0];
        const up: UploadedFile = { key, url: publicUrl, type: f.type, size: f.size };
        setFile(up);
        onSaved(up);
        toast(t(kind === 'resume' ? 'profile.resume.saved' : 'profile.avatar.saved'));
        setProgress(0);
      } catch {
        setErr(t('upload.failed'));
        setProgress(0);
      }
    } else {
      const dataUrl = await toBase64(f);
      const up: UploadedFile = { key: makeId(), url: truncateDataUrl(dataUrl), type: f.type, size: f.size };
      setFile(up);
      onSaved(up);
      toast(t(kind === 'resume' ? 'profile.resume.saved' : 'profile.avatar.saved'));
    }
  };

  const onRemove = () => {
    setFile(null);
    onSaved(null);
  };

  return (
    <div style={{display:'grid', gap:4}}>
      <label style={{fontWeight:600}}>{label}</label>
      {file ? (
        <div style={{display:'flex', alignItems:'center', gap:8}}>
          {kind === 'avatar' && file.url && (
            <img src={file.url} alt="avatar" style={{width:48, height:48, borderRadius:'50%', objectFit:'cover'}} />
          )}
          <div style={{flex:1}}>
            <div>{file.url.split('/').pop()}</div>
            <div style={{fontSize:12,color:'#666'}}>{Math.round(file.size/1024)} KB</div>
          </div>
          <button type="button" onClick={open} style={{marginRight:8, textDecoration:'underline', background:'none', border:'none', cursor:'pointer'}}>{t('profile.resume.replace')}</button>
          <button type="button" onClick={onRemove} style={{textDecoration:'underline', background:'none', border:'none', cursor:'pointer'}}>{t('profile.resume.remove')}</button>
        </div>
      ) : (
        <button type="button" onClick={open} style={{padding:'10px 12px', borderRadius:8, border:'1px solid #ccc', background:'#fff', cursor:'pointer', textAlign:'left'}}>{t('profile.resume.replace')}</button>
      )}
      <input ref={inputRef} type="file" accept={accept} style={{display:'none'}} onChange={onChange} />
      {progress > 0 && progress < 100 && <div style={{fontSize:12}}>{t('upload.uploading')} {progress}%</div>}
      {err && <div style={{color:'crimson', fontSize:12}}>{err}</div>}
      {kind === 'resume' && !file && <div style={{fontSize:12,color:'#666'}}>{t('profile.resume.hint',{mb:MAX_MB})}</div>}
    </div>
  );
}
