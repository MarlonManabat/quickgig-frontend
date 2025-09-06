import { useRouter } from 'next/router';

export default function JobSmoke() {
  const { query } = useRouter();
  return (
    <main>
      <h1>Mock Job {String(query.id || '')}</h1>
      <a data-cta="apply-open" href="/auth/sign-in">Apply</a>
    </main>
  );
}
