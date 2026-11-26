// IndexNow (Bing, Yandex, Seznam, Naver…). One submission per release, never a mass resubmit.
// The list to submit lives in scripts/indexnow-release.txt (one URL per line, # comments allowed).
// Every URL must be in dist/urls.txt, i.e. indexable and in the sitemap (run node build.mjs first).
//   node scripts/indexnow.mjs --dry-run           -> print what would be sent
//   node scripts/indexnow.mjs                     -> submit the release list now
//   node scripts/indexnow.mjs --if-release-changed -> submit only if indexnow-release.txt changed in the
//                                                    deployed commit (used by .github/workflows/indexnow.yml)
import fs from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';

const root = path.join(path.dirname(new URL(import.meta.url).pathname), '..');
const SITE = 'https://calculator.rest';
const LIST = 'scripts/indexnow-release.txt';
const key = fs.readFileSync(path.join(root, 'scripts/.indexnow-key'), 'utf8').trim();
const indexable = new Set(fs.readFileSync(path.join(root, 'dist/urls.txt'), 'utf8').split('\n').filter(Boolean));
const urls = fs.readFileSync(path.join(root, LIST), 'utf8').split('\n').map(l => l.replace(/#.*/, '').trim()).filter(Boolean);

if (process.argv.includes('--if-release-changed')) {
  let changed = false;
  try { changed = execSync('git diff --name-only HEAD~1 HEAD', { cwd: root }).toString().split('\n').includes(LIST); }
  catch { console.log('IndexNow: cannot diff against the previous commit; submitting nothing.'); process.exit(0); }
  if (!changed) { console.log(`IndexNow: ${LIST} unchanged in this deploy; nothing submitted.`); process.exit(0); }
}
const bad = urls.filter(u => !indexable.has(u));
if (bad.length) { console.error(`IndexNow: refusing, not indexable / not in sitemap:\n${bad.join('\n')}`); process.exit(1); }
if (!urls.length) { console.log('IndexNow: release list is empty; nothing submitted.'); process.exit(0); }
if (process.argv.includes('--dry-run')) { console.log(`IndexNow dry run: ${urls.length} URLs\n${urls.join('\n')}`); process.exit(0); }
const body = { host: 'calculator.rest', key, keyLocation: `${SITE}/${key}.txt`, urlList: urls };
const res = await fetch('https://api.indexnow.org/indexnow', { method: 'POST', headers: { 'content-type': 'application/json; charset=utf-8' }, body: JSON.stringify(body) });
console.log(`IndexNow: submitted ${urls.length} URLs → HTTP ${res.status}`);
if (res.status >= 400) process.exit(1);
