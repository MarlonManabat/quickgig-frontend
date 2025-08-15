import type { NextPageContext } from 'next';
import Link from 'next/link';
import SeoHead from '@/components/SeoHead';

function Error({ statusCode }: { statusCode?: number }) {
  return (
    <>
      <SeoHead title="Error" />
      <main className="p-4 space-y-4">
        <h1 className="text-xl font-semibold">Something went wrong</h1>
        {statusCode ? (
          <p>Server responded with status {statusCode}</p>
        ) : (
          <p>An unexpected error occurred</p>
        )}
        <Link href="/jobs" className="text-qg-accent">
          Go to jobs
        </Link>
      </main>
    </>
  );
}

Error.getInitialProps = ({ res, err }: NextPageContext) => {
  const statusCode = res ? res.statusCode : err ? err.statusCode : 404;
  return { statusCode };
};

export default Error;
