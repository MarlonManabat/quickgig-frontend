/* eslint-disable @next/next/no-css-tags */
import { promises as fs } from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

async function readFragment(file: string): Promise<string | null> {
  try {
    const full = path.join(process.cwd(), 'public', 'legacy', file);
    return await fs.readFile(full, 'utf8');
  } catch {
    return null;
  }
}

export default async function LegacyLogin() {
  const html = await readFragment('login.fragment.html');
  if (!html) {
    return <p className="p-4 text-center">Legacy fragment missing. Run npm run sync:legacy.</p>;
  }
  return (
    <>
      <link rel="stylesheet" href="/legacy/styles.css" />
      <div dangerouslySetInnerHTML={{ __html: html }} />
    </>
  );
}
