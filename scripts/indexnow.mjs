// Submit every URL in dist/urls.txt to IndexNow (Bing, Yandex, Seznam, Naver...).
// Run after a production deploy is live:  node build.mjs && node scripts/indexnow.mjs
import fs from 'node:fs';
import path from 'node:path';
const root = path.join(path.dirname(new URL(import.meta.url).pathname), '..');
const key = fs.readFileSync(path.join(root, 'scripts/.indexnow-key'), 'utf8').trim();
const urls = fs.readFileSync(path.join(root, 'dist/urls.txt'), 'utf8').split('\n').filter(Boolean);
const body = { host: 'calculator.rest', key, keyLocation: `https://calculator.rest/${key}.txt`, urlList: urls };
const res = await fetch('https://api.indexnow.org/indexnow', { method: 'POST', headers: { 'content-type': 'application/json; charset=utf-8' }, body: JSON.stringify(body) });
console.log(`IndexNow: submitted ${urls.length} URLs → HTTP ${res.status}`);
