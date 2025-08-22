export default function Banner({ kind='info', children }:{kind?:'success'|'error'|'info', children:React.ReactNode}) {
  const base = 'mb-4 rounded-md px-4 py-2 text-sm';
  const map = {success:'bg-green-50 border border-green-200 text-green-800',
               error:'bg-red-50 border border-red-200 text-red-800',
               info:'bg-gray-50 border border-gray-200 text-gray-800'} as const;
  return <div className={`${base} ${map[kind]}`}>{children}</div>;
}
