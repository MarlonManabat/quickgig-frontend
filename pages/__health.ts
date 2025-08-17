import type { GetServerSideProps } from 'next';
export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  res.setHeader('Content-Type', 'text/plain'); res.write('ok'); res.end();
  return { props: {} };
};
export default function Health(){ return null; }
