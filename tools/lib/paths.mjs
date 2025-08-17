import os from 'os';
import path from 'path';

export function stripQuotes(s = '') {
  if ((s.startsWith('"') && s.endsWith('"')) || (s.startsWith("'") && s.endsWith("'"))) {
    return s.slice(1, -1);
  }
  return s;
}

export function expandTilde(p = '') {
  const home = os.homedir();
  if (p.startsWith('~')) {
    return path.join(home, p.slice(1));
  }
  if (p.startsWith('$HOME')) {
    return path.join(home, p.slice(5));
  }
  return p;
}

export function resolveInputPath(input = '') {
  return path.resolve(expandTilde(stripQuotes(input)));
}
