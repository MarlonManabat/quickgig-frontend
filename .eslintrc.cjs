/** Minimal Next ESLint config */
module.exports = {
  root: true,
  extends: ['next', 'next/core-web-vitals'],
  ignorePatterns: [
    'node_modules/',
    '.next/',
    'public/legacy/**'
  ],
  rules: {}
};
