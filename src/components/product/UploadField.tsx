import * as React from 'react';
import { UploadedFile } from '@/types/upload';
import { toBase64, truncateDataUrl, validate, makeId, MAX_MB } from '@/lib/uploader';
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
  const inputRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => { setFile(initial || null); }, [initial]);

  const open = () => { inputRef.current?.click(); };

  const onChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    const v = validate(f);
    if (!v.ok) {
      setErr(t(v.reason === 'too_big' ? 'profile.resume.too_big' : 'profile.resume.bad_type', { mb: MAX_MB }));
      return;
    }
    setErr('');
    const dataUrl = await toBase64(f);
    const up: UploadedFile = { id: makeId(), name: f.name, type: f.type, size: f.size, data: truncateDataUrl(dataUrl), createdAt: Date.now() };
    try {
      const r = await fetch('/api/upload', { method: 'POST', headers:{'content-type':'application/json'}, body: JSON.stringify({ kind, file: up }) });
      if (!r.ok) throw new Error('upload');
      setFile(up);
      onSaved(up);
      toast(t(kind === 'resume' ? 'profile.resume.saved' : 'profile.avatar.saved'));
    } catch {
      setErr('upload failed');
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
          {kind === 'avatar' && file.data && (
            <img src={file.data} alt="avatar" style={{width:48, height:48, borderRadius:'50%', objectFit:'cover'}} />
          )}
          <div style={{flex:1}}>
            <div>{file.name}</div>
            <div style={{fontSize:12,color:'#666'}}>{Math.round(file.size/1024)} KB</div>
          </div>
          <button type="button" onClick={open} style={{marginRight:8, textDecoration:'underline', background:'none', border:'none', cursor:'pointer'}}>{t('profile.resume.replace')}</button>
          <button type="button" onClick={onRemove} style={{textDecoration:'underline', background:'none', border:'none', cursor:'pointer'}}>{t('profile.resume.remove')}</button>
        </div>
      ) : (
        <button type="button" onClick={open} style={{padding:'10px 12px', borderRadius:8, border:'1px solid #ccc', background:'#fff', cursor:'pointer', textAlign:'left'}}>{t('profile.resume.replace')}</button>
      )}
      <input ref={inputRef} type="file" accept={accept} style={{display:'none'}} onChange={onChange} />
      {err && <div style={{color:'crimson', fontSize:12}}>{err}</div>}
      {kind === 'resume' && !file && <div style={{fontSize:12,color:'#666'}}>{t('profile.resume.hint',{mb:MAX_MB})}</div>}
    </div>
  );
}
