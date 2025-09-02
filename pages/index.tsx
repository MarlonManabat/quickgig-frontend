// pages/index.tsx
import type { GetServerSideProps } from 'next';

export const getServerSideProps: GetServerSideProps = async () => ({
  redirect: { destination: '/browse-jobs', permanent: false },
});

export default function Index() {
  // This page immediately redirects on the server.
  return null;
}
