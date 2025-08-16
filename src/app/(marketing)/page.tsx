// Server component – renders the legacy home page HTML fragment verbatim
import { readLegacy } from '@/lib/readLegacy';

export default async function Home() {
  const html = await readLegacy('index.fragment.html'); // BODY fragment only
  return <div dangerouslySetInnerHTML={{ __html: html }} />;
}
