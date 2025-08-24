import localFont from 'next/font/local';

export const qgSans = localFont({
  src: [
    { path: '../public/legacy/fonts/LegacySans-Regular.woff2', weight: '400', style: 'normal' },
    { path: '../public/legacy/fonts/LegacySans-Medium.woff2', weight: '500', style: 'normal' },
  ],
  display: 'swap',
  preload: true,
});
