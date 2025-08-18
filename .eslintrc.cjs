/** @type {import('eslint').Linter.Config} */
module.exports = {
  root: true,
  extends: ['next/core-web-vitals'],
  ignorePatterns: ['public/legacy/**', 'tools/**', 'scripts/**', 'dist/**', '.next/**']
};
