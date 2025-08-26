const {
  BASE_URL,
  QA_TEST_EMAIL,
  QA_TEST_SECRET,
  SUPABASE_URL,
  NEXT_PUBLIC_SUPABASE_ANON_KEY,
} = process.env;

if (!BASE_URL) {
  console.log('[ci-seed] skipping: BASE_URL not set');
  process.exit(0);
}

async function main() {
  try {
    const res = await fetch(`${BASE_URL}/api/test/seed`, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'x-qa-email': QA_TEST_EMAIL || '',
        'x-qa-secret': QA_TEST_SECRET || '',
      },
      body: JSON.stringify({}),
    });

    if (res.ok) {
      console.log('[ci-seed] seeded');
    } else {
      const text = await res.text();
      console.log(`[ci-seed] ${res.status} ${text}`);
    }
  } catch (err) {
    console.log('[ci-seed] already seeded or skipped:', err.message);
  }
}

main();

