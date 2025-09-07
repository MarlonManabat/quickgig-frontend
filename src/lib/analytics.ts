export function track(event: string, props: Record<string, any> = {}) {
  // GA4
  // @ts-ignore
  if (typeof window !== 'undefined' && window.gtag) window.gtag('event', event, props);
  // Meta Pixel
  // @ts-ignore
  if (typeof window !== 'undefined' && window.fbq) window.fbq('trackCustom', event, props);
}
