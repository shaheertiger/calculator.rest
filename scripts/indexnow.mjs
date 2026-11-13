// Submit URLs to IndexNow (Bing, Yandex, Seznam, Naver...). Needs dist/ (run node build.mjs first).
//   node scripts/indexnow.mjs            -> every URL in dist/urls.txt
//   node scripts/indexnow.mjs --changed  -> only URLs whose source changed in the last commit
// Runs automatically after each successful Vercel production deploy (.github/workflows/indexnow.yml).
import fs from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';

const root = path.join(path.dirname(new URL(import.meta.url).pathname), '..');
const SITE = 'https://calculator.rest';
const key = fs.readFileSync(path.join(root, 'scripts/.indexnow-key'), 'utf8').trim();
const all = fs.readFileSync(path.join(root, 'dist/urls.txt'), 'utf8').split('\n').filter(Boolean);
let urls = all;

if (process.argv.includes('--changed')) {
  let files = [];
  try { files = execSync('git diff --name-only HEAD~1 HEAD', { cwd: root }).toString().split('\n').filter(Boolean); }
  catch { console.log('No previous commit to diff against; submitting everything.'); files = ['build.mjs']; }
  const calcFiles = files.filter(f => /^content\/calculators\/[^/]+\.mjs$/.test(f));
  const siteWide = files.some(f => /^(build\.mjs|src\/|content\/plan\.tsv)/.test(f));
  if (siteWide) urls = all;
  else if (calcFiles.length) {
    const slugs = calcFiles.map(f => path.basename(f, '.mjs'));
    const changed = new Set([SITE + '/', ...slugs.map(s => `${SITE}/${s}`)]);
    for (const u of all) if (/-calculators$/.test(u)) changed.add(u); // hubs show example answers
    urls = all.filter(u => changed.has(u));
  } else urls = [];
}

if (!urls.length) { console.log('IndexNow: nothing changed, nothing submitted.'); process.exit(0); }
const body = { host: 'calculator.rest', key, keyLocation: `${SITE}/${key}.txt`, urlList: urls.slice(0, 10000) };
const res = await fetch('https://api.indexnow.org/indexnow', { method: 'POST', headers: { 'content-type': 'application/json; charset=utf-8' }, body: JSON.stringify(body) });
console.log(`IndexNow: submitted ${body.urlList.length} URLs → HTTP ${res.status}`);
if (res.status >= 400) process.exit(1);
