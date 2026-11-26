#!/usr/bin/env node
// Phase 0 ranking of the 292 pre-pivot calculators against the Search Console export.
// Usage: node research/phase0-rank.mjs <dir with pre-pivot content/calculators> [gsc export dir]
//   git archive 38a7789^ content/calculators | tar -x -C /tmp/prepivot
//   node research/phase0-rank.mjs /tmp/prepivot research/gsc/2026-11-26
// The GSC UI export has Pages and Queries as separate tables (no page × query join), so "top query" is
// the highest-impression query whose words match the page (marked "matched"), not a Google-reported pair.
import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const [, , pre, gscDir = 'research/gsc/2026-11-26'] = process.argv;
if (!pre) { console.error('usage: node research/phase0-rank.mjs <prepivot dir> [gsc dir]'); process.exit(1); }

function csv(file) {
  const s = fs.readFileSync(file, 'utf8'); const rows = []; let row = [], cell = '', q = false;
  for (let i = 0; i < s.length; i++) {
    const c = s[i];
    if (q) { if (c === '"' && s[i + 1] === '"') { cell += '"'; i++; } else if (c === '"') q = false; else cell += c; }
    else if (c === '"') q = true; else if (c === ',') { row.push(cell); cell = ''; }
    else if (c === '\n') { row.push(cell); rows.push(row); row = []; cell = ''; } else if (c !== '\r') cell += c;
  }
  if (cell || row.length) { row.push(cell); rows.push(row); }
  return rows.slice(1).filter(r => r.length > 1);
}
const pages = new Map(csv(path.join(gscDir, 'Pages.csv')).map(([u, c, i, , p]) => [u.replace(/^https?:\/\/calculator\.rest\/?/, '') || '/', { clicks: +c, imp: +i, pos: +p }]));
const queries = csv(path.join(gscDir, 'Queries.csv')).map(([q, c, i, , p]) => ({ q: q.replace(/\s+/g, ' ').trim(), clicks: +c, imp: +i, pos: +p }));
const status = new Map(fs.existsSync(path.join(gscDir, 'live-status-prepivot-urls.tsv')) ? fs.readFileSync(path.join(gscDir, 'live-status-prepivot-urls.tsv'), 'utf8').trim().split('\n').map(l => l.split('\t')) : []);

const dir = path.join(pre, 'content/calculators');
const defs = [];
for (const f of fs.readdirSync(dir).filter(f => f.endsWith('.mjs')).sort()) defs.push((await import(pathToFileURL(path.join(dir, f)).href)).default);

// ---- query -> page matching (heuristic, documented) ----
const STOP = new Set(['calculator', 'calculate', 'calc', 'how', 'to', 'the', 'a', 'of', 'on', 'is', 'what', 'for', 'and', 'in', 'my', 'i', 'with', 'per', 'do', 'you', 'much', 'does', 'free', 'online']);
const tok = s => String(s).toLowerCase().replace(/[^a-z0-9%]+/g, ' ').split(' ').filter(w => w && !STOP.has(w));
// hand rules for queries whose words do not name the page (numeric searches, homework wording)
const RULES = [
  [/new car is purchased .* depreciates by one half|bought a new car for .* value of th|car depreciat|vehicle depreciat|auto depreciat|truck depreciat|depreciation of car/, 'car-depreciation-calculator'],
  [/^\d+(\.\d+)? ?[x*] ?0?\.\d+$|^0?\.\d+ ?[x*] ?\d+$|^\d+\/0?\.\d+$|percent of|^\d+\/\d+ percent|test percent/, 'percentage-calculator'],
  [/%? ?(percent )?tip on|tip calc|tipping|tip percent|tip guide|how much to tip|tips calculator/, 'tip-calculator'],
  [/^average of|^\d+(\.\d+)?\+\d+(\.\d+)?(\+\d+)?$|average test/, 'average-calculator'],
  [/²|³|¹|⁰|power of|exponent/, 'exponent-calculator'],
  [/energy input|energy output|\befficien/, 'efficiency-calculator'],
  [/drives \d+ miles|speed\?/, 'speed-calculator'],
  [/compounded|deposit \$[\d,]+ into an account/, 'compound-interest-calculator'],
  [/grades in his math class|school grades|point system grade/, 'grade-calculator'],
  [/score on a test|test score/, 'test-score-calculator'],
  [/whole chickens|catering food|party food/, 'party-food-calculator'],
  [/lmp|due date/, 'due-date-calculator'],
  [/federal tax|federal taxes|1099 tax|tax calculator 20/, 'income-tax-calculator'],
  [/mifflin|harris benedict|bmr/, 'bmr-calculator'],
  [/extra payment|additional payment|extra repayment|mortgage payoff|early mortgage|paying extra|extra principal|mortgage with extra/, 'mortgage-payoff-calculator'],
  [/damage per second|dps|attack speed/, 'dps-calculator'],
  [/mah|watt.?hour|\bwh\b/, 'watt-hours-calculator'],
  [/watts? (to|is how many) amps|w is how many amps|vac to amps|240v amps/, 'amps-calculator'],
  [/cpi|inflation|worth today/, 'inflation-calculator'],
  [/heloc/, 'heloc-payment-calculator'],
  [/time and a half|overtime/, 'overtime-calculator'],
  [/^\d+(\.\d+)? ?\* ?1\.0\d$|raise/, 'raise-calculator'],
  [/stock days|weeks of supply/, 'days-of-supply-calculator'],
  [/average inventory/, 'average-inventory-calculator'],
  [/pay off (my )?loan|loan end date|pay my loan off|payoff date/, 'loan-payoff-calculator'],
  [/house can i afford/, 'house-affordability-calculator'],
  [/cltv/, 'ltv-calculator'],
  [/minimum payment/, 'credit-card-minimum-payment-calculator'],
  [/credit card .*interest|card apr/, 'credit-card-interest-calculator']
];
const index = defs.map(d => ({ slug: d.slug, words: new Set([...tok(d.slug.replace(/-calculator$/, '')), ...tok(d.name)]), phrases: [d.keyword, ...(d.also || [])].filter(Boolean).map(x => x.toLowerCase()) }));
function owner(q) {
  const ql = q.toLowerCase();
  for (const [re, slug] of RULES) if (re.test(ql)) return slug;
  let best = null, bestScore = 0;
  for (const p of index) {
    if (p.phrases.includes(ql)) return p.slug;
    const t = tok(ql); if (!t.length) continue;
    const hit = t.filter(w => p.words.has(w)).length;
    const score = hit / Math.max(p.words.size, 1) + hit / t.length;
    if (hit && score > bestScore) { bestScore = score; best = p.slug; }
  }
  return bestScore >= 1 ? best : null;
}
const bySlug = new Map();
for (const q of queries) { const o = owner(q.q); q.owner = o; if (!o) continue; if (!bySlug.has(o)) bySlug.set(o, []); bySlug.get(o).push(q); }

// ---- niche (Phase 0 step 3): school maths, everyday percentages/averages, grades, word problems, unit and rate maths ----
const NICHE_HUBS = new Set(['math', 'education', 'everyday', 'science', 'time', 'sports']);
const EXCLUDE = { // in a niche hub but out of scope, or out of hub but in scope
  'due-date-calculator': 'health', 'income-tax-calculator': 'money advice (tax)', 'telescope-magnification-calculator': 'hobby optics, not school or everyday maths', 'life-path-number-calculator': 'numerology',
  'sourdough-hydration-calculator': 'cooking ratio, no school use', 'safety-stock-calculator': 'inventory operations', 'break-even-calculator': 'business finance',
  'profit-margin-calculator': 'business finance', 'cagr-calculator': 'investing', 'npv-calculator': 'corporate finance', 'irr-calculator': 'corporate finance', 'wacc-calculator': 'corporate finance'
};
const INCLUDE_OUT_OF_HUB = { 'cogs-calculator': 'accounting-class formula (owner decision, Nov 26)', 'car-depreciation-calculator': 'exponential decay word problems (Phase 3 solver)', 'compound-interest-calculator': 'exponential growth word problems (school algebra)', 'tip-calculator': 'everyday percentage', 'split-bill-calculator': 'everyday division and percentage', 'time-card-calculator': 'time arithmetic', 'ev-charging-cost-calculator': 'unit-rate maths (kWh × price)', 'moving-average-calculator': 'averages' };
function niche(d) {
  if (EXCLUDE[d.slug]) return [false, EXCLUDE[d.slug]];
  if (INCLUDE_OUT_OF_HUB[d.slug]) return [true, INCLUDE_OUT_OF_HUB[d.slug]];
  if (NICHE_HUBS.has(d.hub)) return [true, `hub: ${d.hub}`];
  return [false, `hub: ${d.hub}`];
}

const rows = defs.map(d => {
  const p = pages.get(d.slug) || { clicks: 0, imp: 0, pos: null };
  const qs = (bySlug.get(d.slug) || []).sort((a, b) => b.imp - a.imp || a.pos - b.pos);
  const qImpTop25 = qs.filter(q => q.pos <= 25).reduce((a, q) => a + q.imp, 0);
  const [fit, why] = niche(d);
  const signal = p.imp > 0 && ((p.pos != null && p.pos <= 25) || qImpTop25 >= 5);
  return { slug: d.slug, hub: d.hub, imp: p.imp, clicks: p.clicks, pos: p.pos, topQuery: qs[0] ? qs[0].q : '', topQueryImp: qs[0] ? qs[0].imp : 0, topQueryPos: qs[0] ? qs[0].pos : '', qImpTop25, matchedQueries: qs.length, status: status.get(d.slug) || '?', fit, why, signal };
});
rows.sort((a, b) => b.imp - a.imp || (a.pos ?? 999) - (b.pos ?? 999) || a.slug.localeCompare(b.slug));
const launch = rows.filter(r => r.signal && r.fit).slice(0, 40);
const launchSet = new Set(launch.map(r => r.slug));
const decision = r => launchSet.has(r.slug) ? 'LAUNCH' : r.signal ? (r.fit ? 'over cap' : 'signal, out of niche') : r.imp ? 'impressions only at > 25' : 'no impressions';

const out = path.join(gscDir, 'prepivot-ranking.tsv');
fs.writeFileSync(out, ['rank\tslug\told_hub\timpressions\tclicks\tavg_position\tmatched_top_query\ttop_query_impressions\ttop_query_position\timpressions_on_matched_queries_at_pos_le_25\tstatus_2026-11-26\tniche_fit\tniche_reason\tdecision',
  ...rows.map((r, i) => [i + 1, r.slug, r.hub, r.imp, r.clicks, r.pos ?? '', r.topQuery, r.topQueryImp || '', r.topQueryPos, r.qImpTop25, r.status, r.fit ? 'yes' : 'no', r.why, decision(r)].join('\t'))].join('\n') + '\n');
fs.writeFileSync(path.join(gscDir, 'query-owner-matched.tsv'), ['query\timpressions\tposition\tmatched_page', ...queries.map(q => [q.q, q.imp, q.pos, q.owner || ''].join('\t'))].join('\n') + '\n');

// summary numbers
const sum = a => a.reduce((x, y) => x + y, 0);
const cd = queries.filter(q => q.owner === 'car-depreciation-calculator');
const wp = cd.filter(q => /new car is purchased|bought a new car/i.test(q.q));
console.log(`pre-pivot calculators: ${defs.length}; with impressions: ${rows.filter(r => r.imp).length}; signal (pos ≤ 25 or ≥ 5 matched-query impressions at ≤ 25): ${rows.filter(r => r.signal).length}; launch set: ${launch.length}`);
console.log(`queries: ${queries.length}, impressions in query table: ${sum(queries.map(q => q.imp))} (rest anonymised), matched to a page: ${sum(queries.filter(q => q.owner).map(q => q.imp))}`);
console.log(`car-depreciation: page ${pages.get('car-depreciation-calculator').imp} imp; matched queries ${sum(cd.map(q => q.imp))} imp, of which homework word problems ${wp.length} queries / ${sum(wp.map(q => q.imp))} imp at avg pos ${(sum(wp.map(q => q.pos * q.imp)) / sum(wp.map(q => q.imp))).toFixed(1)}`);
console.log('\nLAUNCH SET'); for (const r of launch) console.log([r.slug, r.imp, r.pos, r.qImpTop25, r.topQuery.slice(0, 60)].join(' | '));
console.log('\nSIGNAL BUT EXCLUDED'); for (const r of rows.filter(r => r.signal && !launchSet.has(r.slug))) console.log([r.slug, r.imp, r.pos, r.why].join(' | '));
console.log(`\nwrote ${out}`);
