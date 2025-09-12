import fs from 'fs';
import path from 'path';

const file = path.join('public', 'stubs', 'jobs.json');
const job = {
  id: 'demo-job',
  title: 'Demo Courier Shift \u2013 NCR'
};

function seed() {
  if (!fs.existsSync(file)) {
    fs.mkdirSync(path.dirname(file), { recursive: true });
    fs.writeFileSync(file, JSON.stringify([job], null, 2));
    console.log('Seeded stub job');
    return;
  }
  try {
    const data = JSON.parse(fs.readFileSync(file, 'utf8'));
    if (!Array.isArray(data) || data.length === 0) {
      fs.writeFileSync(file, JSON.stringify([job], null, 2));
      console.log('Seeded stub job');
    } else {
      console.log('Jobs already seeded');
    }
  } catch (err) {
    console.error('Failed to read stub jobs, rewriting');
    fs.writeFileSync(file, JSON.stringify([job], null, 2));
  }
}

seed();
