export const money = (n: number, c = 'USD', l = 'en-US') =>
  new Intl.NumberFormat(l, { style: 'currency', currency: c, maximumFractionDigits: 0 }).format(n);

export const when = (iso: string | number | Date, l = 'en-US') =>
  new Intl.DateTimeFormat(l, { dateStyle: 'medium' }).format(new Date(iso));

