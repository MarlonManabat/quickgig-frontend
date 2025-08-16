// server-only
import 'server-only';
import { load as loadHTML, type CheerioAPI } from 'cheerio';

export function parseFragment(html: string): CheerioAPI {
  return loadHTML(html);
}
