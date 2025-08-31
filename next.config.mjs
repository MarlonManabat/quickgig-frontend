import { fileURLToPath } from 'url';
import path from 'path';

/** Resolve repo root in ESM */
const __filename = fileURLToPath(import.meta.url);
const ROOT_DIR = path.dirname(__filename);

/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    config.resolve = config.resolve || {};
    config.resolve.alias = {
      ...(config.resolve.alias || {}),
      '@': path.resolve(ROOT_DIR, 'src'),
    };
    return config;
  },
};

export default nextConfig;
