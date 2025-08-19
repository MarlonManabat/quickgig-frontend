import https from 'node:https';

function head(url) {
  return new Promise((resolve, reject) => {
    const req = https.request(url, { method: 'HEAD' }, (res) => {
      resolve({ status: res.statusCode, location: res.headers.location });
    });
    req.on('error', reject);
    req.end();
  });
}

async function safeHead(url) {
  try {
    return await head(url);
  } catch (error) {
    return { error };
  }
}

let ok = true;

const app = await safeHead('https://app.quickgig.ph/');
if (!app.error && (app.status === 200 || ([301, 308].includes(app.status) && app.location && new URL(app.location).host === 'app.quickgig.ph'))) {
  console.log(`\u2705 app.quickgig.ph responded with status ${app.status}`);
} else {
  const msg = app.error ? `request failed: ${app.error.code || app.error.message}` : `status ${app.status}${app.location ? ' and Location ' + app.location : ''}`;
  console.log(`\u274C app.quickgig.ph ${msg}`);
  ok = false;
}
const apex = await safeHead('https://quickgig.ph/any');
if (!apex.error && [301, 308].includes(apex.status) && apex.location === 'https://app.quickgig.ph/any') {
  console.log('\u2705 quickgig.ph redirects to app.quickgig.ph');
} else {
  const msg = apex.error ? `request failed: ${apex.error.code || apex.error.message}` : `status ${apex.status}${apex.location ? ' and Location ' + apex.location : ''}`;
  console.log(`\u274C quickgig.ph ${msg}`);
  ok = false;
}

const www = await safeHead('https://www.quickgig.ph/any');
if (!www.error && [301, 308].includes(www.status) && www.location === 'https://app.quickgig.ph/any') {
  console.log('\u2705 www.quickgig.ph redirects to app.quickgig.ph');
} else {
  const msg = www.error ? `request failed: ${www.error.code || www.error.message}` : `status ${www.status}${www.location ? ' and Location ' + www.location : ''}`;
  console.log(`\u274C www.quickgig.ph ${msg}`);
  ok = false;
}

if (!ok) process.exit(1);
