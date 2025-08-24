export function reportWebVitals(metric: any){
  // Only log in preview/dev; production can be wired to analytics later
  if (process.env.NODE_ENV !== 'production') {
    console.log('[Vitals]', metric.name, metric.value);
  }
}
