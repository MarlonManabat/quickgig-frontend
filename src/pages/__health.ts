import type { NextApiResponse } from 'next'
export default function Page(){ return null }
export async function getServerSideProps({ res }: { res: NextApiResponse }) {
  res.setHeader('Content-Type','text/plain'); res.write('ok'); res.end();
  return { props: {} }
}
