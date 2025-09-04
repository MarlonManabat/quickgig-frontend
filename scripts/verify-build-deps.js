const pkg = require('../package.json');
const mustBeRuntime = ['postcss','autoprefixer','tailwindcss','browserslist'];
const bad = mustBeRuntime.filter(n => pkg.devDependencies && pkg.devDependencies[n]);
if (bad.length) {
  console.error('Build-time CSS deps must be in dependencies:', bad.join(', '));
  process.exit(1);
}
