export const isSmoke =
  process.env.MOCK_MODE === '1' ||
  process.env.CI === 'true' ||
  process.env.SMOKE === '1';
