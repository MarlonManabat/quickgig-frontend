import '../styles/theme.css';
import '../styles/globals.css';
import '../styles/accessibility.css';
import '@/public/fonts/css/legacy.css';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-surface text-text">{children}</body>
    </html>
  );
}
