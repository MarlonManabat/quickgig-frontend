import { execSync } from 'child_process';

const legacyLogin = ['login', 'php'].join('.');
try {
  execSync(
    `grep -RIn --exclude-dir=node_modules -E '${legacyLogin}|quickgig\.ph/${legacyLogin}' .`,
    { stdio: 'inherit' }
  );
  console.error(`Found legacy ${legacyLogin} refs`);
  process.exit(1);
} catch {
  console.log('OK');
}
