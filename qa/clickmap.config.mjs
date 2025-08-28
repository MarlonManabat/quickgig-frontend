export default {
  // Supply via GitHub Vars if available; otherwise fallbacks
  baseLanding: process.env.LANDING_URL || (process.env.PREVIEW_URL ? process.env.PREVIEW_URL.replace('app.','') : 'http://localhost:3000'),
  baseApp: process.env.PREVIEW_URL || 'http://localhost:3000',
  entryPaths: ['/', '/post', '/search', '/inbox', '/admin', '/login', '/dashboard'],
  exclude: [
    'button:has-text("Delete")','button:has-text("Remove")','button:has-text("Archive")',
    'button:has-text("Approve")','button:has-text("Reject")','[data-test=destructive]'
  ],
  intents: [
    { from: '/', expects: [/Post a Job/i, /Find Work|Jobs/i] },
    { from: '/post', expects: [/Post Job/i] },
    { from: '/search', expects: [/Search|Filter/i] },
    { from: '/admin', expects: [/Admin|Orders|Users/i] },
  ],
  maxClicksPerPage: 60,
  navTimeoutMs: 15000,
};
