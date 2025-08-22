# QA & E2E
1. npm i
2. npx playwright install
3. Seed DB: npm run seed
4. Start app: npm run dev
5. Run tests: npm run test:e2e
Notes: Production builds (Vercel) exclude tests from typecheck via tsconfig.json.
CI runs qa:ci

CI runs `npm run qa:ci` which uses start-server-and-test to boot Next at :3000 and execute the @smoke suite.
