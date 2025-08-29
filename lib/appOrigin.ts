export function resolveAppOrigin(){
  if (process.env.NEXT_PUBLIC_APP_ORIGIN) return process.env.NEXT_PUBLIC_APP_ORIGIN;
  if (typeof window !== 'undefined'){
    const { protocol, hostname, port } = window.location;
    return hostname.startsWith('app.')
      ? `${protocol}//${hostname}${port?':'+port:''}`
      : `${protocol}//app.${hostname}${port?':'+port:''}`;
  }
  return 'https://app.quickgig.ph';
}
