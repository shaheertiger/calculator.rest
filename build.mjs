#!/usr/bin/env node
// calculator.rest static site builder. Zero dependencies.
// Usage: node build.mjs [--check] [--only=slug,slug] [--no-strict] [--quiet]
//
// Two page templates:
//   - "show the work" (school and everyday maths): modules with `facts`. Indexable. Strict checks (see README).
//   - legacy retirement modules (hubs marked `retired` in src/hubs.mjs): live, noindex,follow, out of the
//     sitemap, linked only from /retirement until a credentialed reviewer is named on each page.
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { pathToFileURL } from 'node:url';
import hubs from './src/hubs.mjs';
import pages from './src/pages.mjs';

const ROOT = path.dirname(new URL(import.meta.url).pathname);
const OUT = path.join(ROOT, 'dist');
const SITE = 'https://calculator.rest';
const BRAND = 'calculator.rest';
// The one content date of the Nov 2026 reset. Pages this release rebuilt carry it as `updated`; later edits set
// their own date, so after this release the sitemap's lastmod values must not all be identical.
const RELEASE = '2026-11-26';
const MAX_INDEXABLE = 45;
const WORDS_MIN = 600, WORDS_MAX = 1100;
const MAX_OVERLAP = 0.30;
const args = Object.fromEntries(process.argv.slice(2).map(a => { const [k, v] = a.replace(/^--/, '').split('='); return [k, v ?? true]; }));
const STRICT = !args['no-strict'];
const ONLY = args.only ? new Set(String(args.only).split(',').map(x => x.trim()).filter(Boolean)) : null;
const CHECK = !!args.check;
const PLAN_ROWS = fs.readFileSync(path.join(ROOT, 'content/plan.tsv'), 'utf8').split('\n').slice(1).map(l => l.split('\t')).filter(r => r[0]);
const PLAN = new Set(PLAN_ROWS.map(r => r[0]));

const read = p => fs.readFileSync(path.join(ROOT, p), 'utf8');
const helpersSrc = read('src/helpers.js');
const renderSrc = read('src/render.js');
const runtimeSrc = read('src/runtime.js');
const H = new Function(helpersSrc + '\nreturn H;')();
const renderResult = new Function('H', renderSrc + '\nreturn renderResult;')(H);

const errors = [], warnings = [];
const err = (slug, msg) => errors.push(`✗ ${slug}: ${msg}`);
const warn = (slug, msg) => warnings.push(`! ${slug}: ${msg}`);
const esc = s => String(s ?? '').replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const strip = s => String(s ?? '').replace(/<[^>]+>/g, ' ').replace(/&nbsp;/g, ' ').replace(/&[a-z#0-9]+;/gi, ' ').replace(/\s+/g, ' ').trim();
const words = s => strip(s).split(' ').filter(Boolean).length;
const fmtDay = iso => new Date(iso + 'T00:00:00Z').toLocaleDateString('en-US', { timeZone: 'UTC', month: 'short', day: 'numeric', year: 'numeric' });
const jsonScript = o => JSON.stringify(o).replace(/</g, '\\u003c');
const TODAY = new Date().toISOString().slice(0, 10);

/* ---------------- load calculators ---------------- */
const calcDir = path.join(ROOT, 'content/calculators');
const files = fs.existsSync(calcDir) ? fs.readdirSync(calcDir).filter(f => f.endsWith('.mjs')).sort() : [];
const calcs = [];
for (const f of files) {
  try {
    const mod = await import(pathToFileURL(path.join(calcDir, f)).href);
    const def = mod.default;
    if (!def || !def.slug) { err(f, 'no default export with slug'); continue; }
    if (def.slug + '.mjs' !== f) err(def.slug, `filename ${f} does not match slug`);
    calcs.push(def);
  } catch (e) { err(f, 'failed to import: ' + e.message.split('\n')[0]); }
}
const planIndex = new Map([...PLAN].map((s, i) => [s, i]));
calcs.sort((a, b) => (planIndex.get(a.slug) ?? 1e9) - (planIndex.get(b.slug) ?? 1e9)); // demand order from plan.tsv
const bySlug = new Map(calcs.map(c => [c.slug, c]));
const hubById = new Map(hubs.map(h => [h.id, h]));
const liveHubs = hubs.filter(h => !h.retired);
const retiredHubs = hubs.filter(h => h.retired);
const isRetired = def => !!(hubById.get(def.hub) || {}).retired;
const isV2 = def => !!def.facts;
const indexable = def => !isRetired(def) && def.index !== false;
const mathCalcs = calcs.filter(c => !isRetired(c));
const retiredCalcs = calcs.filter(isRetired);

/* ---------------- defaults & compute ---------------- */
function defaultsOf(inputs) {
  const v = {};
  for (const c of inputs || []) {
    if (c.type === 'rows') v[c.id] = (c.value || []).map(r => { const o = {}; for (const f of c.fields) o[f.id] = f.type === 'number' ? (r[f.id] === '' || r[f.id] == null ? NaN : Number(r[f.id])) : (f.type === 'checkbox' ? !!r[f.id] : String(r[f.id] ?? '')); return o; });
    else if (c.type === 'number') v[c.id] = c.value === '' || c.value == null ? NaN : Number(c.value);
    else if (c.type === 'checkbox') v[c.id] = !!c.value;
    else if (c.type === 'date') v[c.id] = resolveDate(c.value);
    else v[c.id] = String(c.value ?? '');
  }
  return v;
}
function resolveDate(val) {
  if (!val || typeof val !== 'string') return H.today();
  const m = /^today([+-]\d+)?$/.exec(val);
  if (m) return H.iso(H.addDays(H.parseDate(H.today()), Number(m[1] || 0)));
  return val;
}
function fnSource(fn) {
  const s = fn.toString().trim();
  if (/^(async\s+)?function\b/.test(s) || /^\(?[\w\s,{}=]*\)?\s*=>/.test(s)) return s;
  return 'function ' + s; // method shorthand: compute(v, H) { ... }
}

/* ---------------- shared layout ---------------- */
const FONTS = 'https://fonts.googleapis.com/css2?family=Newsreader:opsz,wght@6..72,400;6..72,500;6..72,600&family=Inter:wght@400;500;600;700&display=swap';
const cssMin = read('src/styles.css').replace(/\/\*[\s\S]*?\*\//g, '').replace(/\s+/g, ' ').replace(/\s*([{}:;,>])\s*/g, '$1').replace(/;}/g, '}').trim();
const appJs = helpersSrc + '\n' + renderSrc + '\n' + runtimeSrc;
const appHash = crypto.createHash('md5').update(appJs).digest('hex').slice(0, 8);
const APP_URL = `/assets/app.${appHash}.js`;
const INDEX = 'index,follow,max-image-preview:large';
const NOINDEX = 'noindex,follow';

function shell({ title, meta, url, body, graph, robots = INDEX, ogType = 'website', scripts = '' }) {
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${esc(title)}</title>
<meta name="description" content="${esc(meta)}">
<link rel="canonical" href="${url}">
<meta name="robots" content="${robots}">
<meta name="theme-color" content="#fbfaf8">
<meta property="og:type" content="${ogType}">
<meta property="og:site_name" content="${BRAND}">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(meta)}">
<meta property="og:url" content="${url}">
<meta property="og:image" content="${SITE}/og.png">
<meta property="og:image:width" content="1200"><meta property="og:image:height" content="630">
<meta name="twitter:card" content="summary_large_image">
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<link rel="icon" href="/favicon.ico" sizes="32x32">
<link rel="apple-touch-icon" href="/apple-touch-icon.png">
<link rel="manifest" href="/site.webmanifest">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="${FONTS}" media="print" onload="this.media='all'">
<noscript><link rel="stylesheet" href="${FONTS}"></noscript>
<style>${cssMin}</style>
${graph ? `<script type="application/ld+json">${jsonScript({ '@context': 'https://schema.org', '@graph': graph })}</script>` : ''}
<script>window.va=window.va||function(){(window.vaq=window.vaq||[]).push(arguments);};</script>
</head>
<body>
<a class="skip" href="#main">Skip to content</a>
<div class="wrap">
<header class="top">
<a class="brand" href="/" aria-label="calculator.rest home"><i></i>calculator.rest</a>
<nav class="nav" aria-label="Main">${liveHubs.map(h => `<a class="hide-sm" href="/${h.slug}">${esc(h.short)}</a>`).join('')}<a class="pill" href="/#calculators">all ${mathCalcs.length} calculators</a></nav>
</header>
</div>
<main id="main">
${body}
</main>
${footer()}
${scripts}
<script defer src="/_vercel/insights/script.js"></script>
</body>
</html>`;
}

function footer() {
  const top = ['percentage-calculator', 'car-depreciation-calculator', 'grade-calculator', 'average-calculator', 'exponent-calculator', 'tip-calculator'].filter(s => bySlug.has(s));
  return `<footer>
<div class="wrap">
<div class="foot">
<div><a class="brand" href="/"><i></i>calculator.rest</a><p>Calculators that show the work. Type your numbers and get every step, the way a teacher would write it out on the board.</p></div>
<div><h2>Calculators</h2><ul>${liveHubs.map(h => `<li><a href="/${h.slug}">${esc(h.name)}</a></li>`).join('')}</ul></div>
<div><h2>Popular</h2><ul>${top.map(s => `<li><a href="/${s}">${esc(bySlug.get(s).name)}</a></li>`).join('')}</ul></div>
<div><h2>Site</h2><ul><li><a href="/about">About</a></li><li><a href="/methodology">How steps are checked</a></li><li><a href="/privacy">Privacy</a></li>${retiredCalcs.length ? '<li><a href="/retirement">Retirement calculators</a></li>' : ''}</ul></div>
</div>
<div class="fine"><span>© 2026 calculator.rest · <a href="/about">About</a> · <a href="/methodology">Methodology</a> · <a href="/privacy">Privacy</a></span><span>nothing you type leaves your browser</span></div>
</div>
</footer>`;
}

const ORG = { '@type': 'Organization', '@id': SITE + '/#org', name: BRAND, url: SITE + '/', logo: { '@type': 'ImageObject', url: SITE + '/apple-touch-icon.png', width: 180, height: 180 } };
const WEBSITE = { '@type': 'WebSite', '@id': SITE + '/#website', url: SITE + '/', name: BRAND, publisher: { '@id': SITE + '/#org' }, inLanguage: 'en-US' };
const crumbsLd = (url, items) => ({ '@type': 'BreadcrumbList', '@id': url + '#breadcrumb', itemListElement: items.map((it, i) => ({ '@type': 'ListItem', position: i + 1, name: it[0], item: it[1] })) });
const crumbsHtml = items => `<ol class="crumbs" aria-label="Breadcrumb">${items.map((it, i) => i < items.length - 1 ? `<li><a href="${it[1].replace(SITE, '') || '/'}">${esc(it[0])}</a></li>` : `<li aria-current="page">${esc(it[0])}</li>`).join('')}</ol>`;
const APP_CAT = { income: 'FinanceApplication', planning: 'FinanceApplication', rules: 'FinanceApplication' };

/* ---------------- inputs ---------------- */
function inputHtml(c, val, inRow) {
  const id = inRow ? '' : ` id="f-${c.id}" name="${c.id}"`;
  const dk = inRow ? ` data-k="${c.id}" aria-label="${esc(c.label)}"` : '';
  switch (c.type) {
    case 'select':
      return `<select${id}${dk}>${(c.options || []).map(o => { const [ov, ol] = Array.isArray(o) ? o : [o, o]; return `<option value="${esc(ov)}"${String(ov) === String(val) ? ' selected' : ''}>${esc(ol)}</option>`; }).join('')}</select>`;
    case 'checkbox':
      return `<input type="checkbox"${id}${dk}${val ? ' checked' : ''}>`;
    case 'text':
      if (c.multiline) return `<textarea${id}${dk} rows="${c.multiline === true ? 3 : c.multiline}" spellcheck="false"${c.placeholder ? ` placeholder="${esc(c.placeholder)}"` : ''}>${esc(val)}</textarea>`;
    // fallthrough
    default: {
      const type = c.type === 'date' ? 'date' : c.type === 'time' ? 'time' : 'text';
      const im = c.type === 'number' ? ' inputmode="decimal"' : '';
      const shown = c.type === 'number' ? (Number.isFinite(val) ? String(val) : '') : val;
      const field = `<input type="${type}"${id}${dk}${im} value="${esc(shown)}" autocomplete="off"${c.placeholder ? ` placeholder="${esc(c.placeholder)}"` : ''}${c.type === 'date' && c.min ? ` min="${c.min}"` : ''}>`;
      return (c.prefix || c.suffix || c.type === 'number' || type === 'text') ? `<div class="inp">${c.prefix ? `<span class="pre">${esc(c.prefix)}</span>` : ''}${field}${c.suffix ? `<span class="suf">${esc(c.suffix)}</span>` : ''}</div>` : `<div class="inp">${field}</div>`;
    }
  }
}
function fieldsHtml(def, v) {
  return (def.inputs || []).map(c => {
    const hidden = c.showIf && !Object.keys(c.showIf).every(k => c.showIf[k].map(String).includes(String(v[k]))) ? ' hidden' : '';
    if (c.type === 'rows') {
      const cols = c.fields.length;
      const rows = v[c.id].map(r => `<div class="row">${c.fields.map(f => inputHtml(f, r[f.id], true)).join('')}<button type="button" class="rm" aria-label="Remove row">×</button></div>`).join('');
      return `<div class="field rows-field" data-field="${c.id}"${hidden}><div class="lbl">${esc(c.label)}</div><div class="rows" data-rows="${c.id}" style="--cols:${cols}"><div class="row-head">${c.fields.map(f => `<span>${esc(f.label)}</span>`).join('')}<span></span></div>${rows}</div><button type="button" class="add" data-add="${c.id}">${esc(c.addLabel || '+ add row')}</button>${c.help ? `<small>${c.help}</small>` : ''}</div>`;
    }
    if (c.type === 'checkbox') return `<div class="field${c.wide ? ' wide' : ''}" data-field="${c.id}"${hidden}><label class="check">${inputHtml(c, v[c.id])} ${esc(c.label)}</label>${c.help ? `<small>${c.help}</small>` : ''}</div>`;
    const wide = c.wide || (c.type === 'text' && c.multiline);
    return `<div class="field${wide ? ' wide' : ''}" data-field="${c.id}"${hidden}><label for="f-${c.id}">${esc(c.label)}</label>${c.help ? `<small id="h-${c.id}">${c.help}</small>` : ''}${inputHtml(c, v[c.id])}</div>`;
  }).join('\n');
}

/* ---------------- calculator block (inputs left, results + steps right) ---------------- */
function calcBlock(def, v, r, summary) {
  const inputsLite = (def.inputs || []).map(c => ({ id: c.id, type: c.type, showIf: c.showIf, max: c.max, fields: c.fields && c.fields.map(f => ({ id: f.id, type: f.type, value: f.value, blank: f.blank })) }));
  const notes = def.notes || null;
  const script = `<script>window.CALC={slug:${jsonScript(def.slug)},name:${jsonScript(def.name)},inputs:${jsonScript(inputsLite)},notes:${notes ? jsonScript(notes) : 'null'},data:${def.data ? jsonScript(def.data) : 'null'},compute:${fnSource(def.compute)}};</script>\n<script src="${APP_URL}" defer></script>`;
  const v2 = isV2(def);
  const actions = '<div class="actions"><button type="button" data-copy>Copy result</button><button type="button" data-share>Share</button><button type="button" data-reset>Reset</button></div>';
  const html = `<section class="calc${v2 ? ' calc-v2' : ''}" aria-label="${esc(def.name)}">
<form id="calc-form" class="calc-in" data-calc autocomplete="off" novalidate>
${fieldsHtml(def, v)}
${v2 ? '' : actions}
</form>
<div class="calc-out">
<output id="result" for="calc-form" aria-live="polite">${renderResult(r, H, notes)}</output>
${v2 ? '' : `<div class="summary"><h3>Summary</h3><p id="summary">${summary}</p>${def.assumptions ? `<p class="assume">${def.assumptions}</p>` : ''}</div>`}
${v2 ? actions : ''}
<p class="privacy-note">Worked out on your device. Nothing you type is sent or stored.</p>
</div>
</section>`;
  return { html, script };
}

/* ---------------- calculator pages ---------------- */
const built = []; // {def, r, url, html, text, ...}
const YEAR = '2026';
const RETIRE_URL = `${SITE}/retirement`;
for (const def of calcs) {
  const s = def.slug;
  const v2 = isV2(def);
  const retired = isRetired(def);
  if (!v2) { def.title = def.seoTitle || `${YEAR} ${def.name} | ${BRAND}`; def.h1 = def.seoH1 || `${def.name} ${YEAR}`; }
  else def.h1 = def.h1 || def.name;
  if (!hubById.has(def.hub)) err(s, `unknown hub "${def.hub}"`);
  if (!retired && !v2) err(s, 'every live (non-retirement) calculator must use the show-the-work template (`facts`, `answer`, steps)');
  const v = defaultsOf(def.inputs);
  let r;
  const run = (over = {}) => { try { return def.compute({ ...v, ...over }, H, def.data) || {}; } catch (e) { err(s, 'compute threw: ' + e.message); return {}; } };
  try { r = def.compute(v, H, def.data); } catch (e) { err(s, 'compute(defaults) threw: ' + e.message); r = { error: 'error' }; }
  if (!r || r.error) err(s, 'compute(defaults) returned error: ' + (r && r.error));
  try { new Function('return ' + fnSource(def.compute)); } catch (e) { err(s, 'compute is not serializable: ' + e.message); }
  try { // serialization round-trip (catches closures over module scope)
    const fn = new Function('H', 'return (' + fnSource(def.compute) + ')')(H);
    const rr = fn(JSON.parse(JSON.stringify(v, (k, x) => (typeof x === 'number' && !isFinite(x)) ? null : x)), H, def.data ? JSON.parse(JSON.stringify(def.data)) : undefined);
    if (strip(rr && rr.value) !== strip(r && r.value) && !(Object.values(v).some(x => typeof x === 'number' && isNaN(x)))) warn(s, 'serialized compute gives different value: ' + strip(rr && rr.value));
    if (v2 && JSON.stringify(rr && rr.steps) !== JSON.stringify(r && r.steps)) err(s, 'serialized compute gives different steps than the build');
  } catch (e) { err(s, 'serialized compute fails in isolation (uses outside variables?): ' + e.message); }
  const ctx = { v, r: r || {}, H, D: def.data, run };
  const url = `${SITE}/${s}`;
  const hub = hubById.get(def.hub) || liveHubs[0];
  const updated = def.updated || '2026-11-13';
  const cb = calcBlock(def, v, r || {}, '');

  if (v2) {
    let answer = '';
    try { answer = typeof def.answer === 'function' ? def.answer(ctx) : String(def.answer || ''); } catch (e) { err(s, 'answer() threw: ' + e.message); }
    const related = (def.related || []).filter(x => {
      if (!bySlug.has(x)) { err(s, `related calculator does not exist: ${x}`); return false; }
      if (!indexable(bySlug.get(x))) { err(s, `related calculator is not indexable: ${x}`); return false; }
      return x !== s;
    });
    const F = def.facts || {};
    const factsHtml = `<aside class="facts" aria-labelledby="facts-h"><h2 id="facts-h">Key facts</h2><div class="expr-big">${F.formula || ''}</div>${F.vars ? `<dl>${F.vars.map(([a, b]) => `<dt>${a}</dt><dd>${b}</dd>`).join('')}</dl>` : ''}${F.rounding ? `<p class="facts-r"><strong>Rounding:</strong> ${F.rounding}</p>` : ''}${F.note ? `<p class="facts-r">${F.note}</p>` : ''}</aside>`;
    const content = [
      factsHtml,
      def.example ? `<h2 id="example">${esc(def.example.h2)}</h2><div class="example">${def.example.html}</div>` : '',
      ...(def.variants || []).map(x => `<h2>${esc(x.h2)}</h2>${x.html}`),
      def.mistakes && def.mistakes.length ? `<h2 id="mistakes">Common mistakes</h2><ul class="mistakes">${def.mistakes.map(m => `<li>${m}</li>`).join('')}</ul>` : '',
      related.length ? `<h2 id="related">Related calculators</h2><ul class="explore">${related.map(x => `<li><a href="/${x}">${esc(bySlug.get(x).name)}</a></li>`).join('')}</ul>` : '',
      def.faq && def.faq.length ? `<section class="faq"><h2 id="faq">FAQs</h2>${def.faq.map(f => `<h3>${esc(f.q)}</h3><div class="faq-a">${/^\s*</.test(f.a) ? f.a : `<p>${f.a}</p>`}</div>`).join('')}</section>` : ''
    ].join('\n');
    const trust = `<p class="trust">${def.sources && def.sources.length ? `Formula source${def.sources.length > 1 ? 's' : ''}: ${def.sources.map(x => `<a href="${esc(x.url)}" rel="nofollow noopener" target="_blank">${esc(x.name)}</a>`).join(' · ')}<br>` : ''}Steps are produced by the same code that runs the calculator · Updated ${fmtDay(updated)} · <a href="/methodology">How steps are checked</a> · Spotted a wrong step? <a href="/about#report">Report it</a></p>`;
    const crumbs = [['Home', SITE + '/'], [hub.name, `${SITE}/${hub.slug}`], [def.name, url]];
    const body = `<div class="wrap">
${crumbsHtml(crumbs)}
<header class="page-head v2-head">
<h1>${esc(def.h1)}</h1>
<p class="answer-line">${answer}</p>
</header>
${cb.html}
<article class="article">
${content}
${trust}
</article>
</div>`;
    const graph = [ORG, WEBSITE,
      { '@type': 'WebPage', '@id': url + '#page', url, name: def.title, description: def.meta, isPartOf: { '@id': SITE + '/#website' }, breadcrumb: { '@id': url + '#breadcrumb' }, inLanguage: 'en-US', dateModified: updated, mainEntity: { '@id': url + '#app' } },
      crumbsLd(url, crumbs),
      { '@type': 'WebApplication', '@id': url + '#app', name: def.name, url, description: def.meta, applicationCategory: 'EducationalApplication', operatingSystem: 'Any', browserRequirements: 'Default answer and steps work without JavaScript', isAccessibleForFree: true, offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' }, publisher: { '@id': SITE + '/#org' } },
      def.faq && def.faq.length ? { '@type': 'FAQPage', '@id': url + '#faq', mainEntity: def.faq.map(f => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: strip(f.a) } })) } : null
    ].filter(Boolean);
    const html = shell({ title: def.title, meta: def.meta, url, body, graph, robots: indexable(def) ? INDEX : NOINDEX, scripts: cb.script });
    // word count = everything a reader reads on the page except the site chrome and the input labels
    const text = strip(answer + ' ' + renderResult(r || {}, H, def.notes) + ' ' + content);
    built.push({ def, r: r || {}, url, html, text, answer, related, updated, v2: true, index: indexable(def) });
    continue;
  }

  /* legacy (retirement) template: unchanged layout, noindex, breadcrumb to /retirement */
  let quick = '';
  try { quick = typeof def.quick === 'function' ? def.quick(ctx) : String(def.quick || ''); } catch (e) { err(s, 'quick() threw: ' + e.message); }
  let tableRows = [];
  if (def.table) { try { tableRows = typeof def.table.rows === 'function' ? def.table.rows(ctx) : (def.table.rows || []); } catch (e) { err(s, 'table.rows() threw: ' + e.message); } }
  const related = (def.related || []).filter(x => bySlug.has(x) && isRetired(bySlug.get(x)) && x !== s);
  const formula = def.formula ? `<div class="formula"><div class="expr-big">${def.formula.expr}</div>${def.formula.vars ? `<dl>${def.formula.vars.map(([a, b]) => `<dt>${a}</dt><dd>${b}</dd>`).join('')}</dl>` : ''}</div>${def.formula.note ? `<p>${def.formula.note}</p>` : ''}` : '';
  const explore = [...related, ...retiredCalcs.filter(c => c.hub === def.hub && c.slug !== s && !related.includes(c.slug)).map(c => c.slug)];
  const article = [
    def.table && tableRows.length ? `<h2 id="table">${esc(def.table.title)}</h2>${def.table.intro ? `<p>${def.table.intro}</p>` : ''}<div class="twrap"><table><thead><tr>${def.table.head.map(h => `<th scope="col">${h}</th>`).join('')}</tr></thead><tbody>${tableRows.map(row => `<tr>${row.map(c => `<td>${c}</td>`).join('')}</tr>`).join('')}</tbody></table></div>${def.table.note ? `<p class="tnote">${def.table.note}</p>` : ''}` : '',
    (def.formula || def.example) ? `<h2 id="formula">${esc(def.formulaTitle || 'How is it calculated?')}</h2>${formula}${def.example ? `<h3>Worked example</h3><div class="example">${def.example}</div>` : ''}` : '',
    ...(def.sections || []).map(sec => `<h2>${esc(sec.h2)}</h2>${sec.html}`),
    explore.length ? `<h2 id="explore">Other retirement calculators</h2><ul class="explore">${explore.map(x => `<li><a href="/${x}">${esc(bySlug.get(x).name)}</a></li>`).join('')}</ul>` : '',
    def.faq && def.faq.length ? `<section class="faq"><h2 id="faq">FAQs</h2>${def.faq.map(f => `<h3>${esc(f.q)}</h3><div class="faq-a">${/^\s*</.test(f.a) ? f.a : `<p>${f.a}</p>`}</div>`).join('')}</section>` : '',
    `<h2 id="sources">Sources and method</h2>${def.sources && def.sources.length ? `<ul class="sources">${def.sources.map(x => `<li><a href="${esc(x.url)}" rel="nofollow noopener" target="_blank">${esc(x.name)}</a></li>`).join('')}</ul>` : ''}<p class="trust">Built and maintained by calculator.rest${def.reviewer ? ` · Reviewed by ${def.reviewer.url ? `<a href="${esc(def.reviewer.url)}">${esc(def.reviewer.name)}</a>` : esc(def.reviewer.name)}, ${esc(def.reviewer.credential)}${def.reviewer.date ? ` on ${fmtDay(def.reviewer.date)}` : ''}` : ' · Not yet reviewed by a credentialed financial professional'} · Formula follows the sources above · Last updated ${fmtDay(updated)}${def.disclaimer ? `<br>${def.disclaimer}` : ''}</p>`
  ].join('\n');
  const crumbs = [['Home', SITE + '/'], ['Retirement calculators', RETIRE_URL], [def.name, url]];
  const body = `<div class="wrap">
${crumbsHtml(crumbs)}
<header class="page-head">
<h1>${esc(def.h1)}</h1>
<p class="intro">${def.intro || quick}</p>
${def.intro && quick ? `<div class="answer"><span class="tag">Quick answer</span><p>${quick}</p></div>` : ''}
<p class="meta-line">Updated ${fmtDay(updated)} · Sources: ${esc((def.sources || []).map(x => x.name.split(':')[0]).filter((x, i, a) => a.indexOf(x) === i).slice(0, 3).join(', ') || 'see below')}</p>
</header>
${calcBlock(def, v, r || {}, quick).html}
<article class="article">
${article}
</article>
</div>`;
  const graph = [ORG, WEBSITE,
    { '@type': 'WebPage', '@id': url + '#page', url, name: def.title, description: def.meta, isPartOf: { '@id': SITE + '/#website' }, breadcrumb: { '@id': url + '#breadcrumb' }, inLanguage: 'en-US', dateModified: updated, mainEntity: { '@id': url + '#app' } },
    crumbsLd(url, crumbs),
    { '@type': 'WebApplication', '@id': url + '#app', name: def.name, url, description: def.meta, applicationCategory: APP_CAT[def.hub] || 'UtilitiesApplication', operatingSystem: 'Any', isAccessibleForFree: true, offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' }, publisher: { '@id': SITE + '/#org' } }
  ];
  const html = shell({ title: def.title, meta: def.meta, url, body, graph, robots: NOINDEX, scripts: cb.script });
  built.push({ def, r: r || {}, url, html, text: strip((def.intro || '') + ' ' + quick + ' ' + article), quick, updated, v2: false, index: false });
}
const B = new Map(built.map(b => [b.def.slug, b]));

/* ---------------- checks ---------------- */
const seen = { title: new Map(), meta: new Map(), h1: new Map() };
const live = built.filter(b => b.v2);
for (const b of built) {
  const d = b.def, s = d.slug;
  for (const k of ['name', 'title', 'h1', 'meta', 'hub']) if (!d[k]) err(s, `missing ${k}`);
  for (const k of ['title', 'meta', 'h1']) {
    if (!d[k]) continue;
    const key = String(d[k]).toLowerCase().trim();
    if (seen[k].has(key)) err(s, `duplicate ${k} with ${seen[k].get(key)}`); else seen[k].set(key, s);
  }
  const ml = (d.meta || '').length;
  if (ml < 100 || ml > 170) err(s, `meta ${ml} chars (110–160)`); else if (ml < 110 || ml > 160) warn(s, `meta ${ml} chars (aim 110–160)`);
  if (d.meta && d.title && d.meta.trim().toLowerCase() === d.title.trim().toLowerCase()) err(s, 'meta equals title');
  if (/[$€£]\s?\d{1,3}\.\d{3}\.\d{3}/.test(b.text)) err(s, 'European-style money format (use $1,000,000)');
  if (!b.v2) continue;

  /* show-the-work template: every one of these fails the build */
  const tl = (d.title || '').length;
  if (tl > 60) err(s, `title ${tl} chars (max 60)`);
  if (!/\d/.test(d.title || '')) err(s, 'title has no worked number');
  if (!d.keyword) err(s, 'missing keyword');
  if (!/\d/.test(strip(b.answer))) err(s, 'answer sentence under the H1 has no number');
  const aw = words(b.answer);
  if (aw < 6 || aw > 40) err(s, `answer sentence ${aw} words (one sentence, 6–40 words)`);
  const steps = (b.r && b.r.steps) || [];
  if (steps.length < 3) err(s, `default example shows ${steps.length} steps (need formula → substitution → arithmetic → answer, ≥ 3)`);
  else {
    if (!/^answer\b/i.test(strip(steps[steps.length - 1]))) err(s, 'last step must start with "Answer" and state units and rounding');
    if (!/^formula\b/i.test(strip(steps[0]))) err(s, 'first step must start with "Formula"');
  }
  if (!/<ol class="work-steps">/.test(b.html) || (b.html.match(/<li class="ws">/g) || []).length !== steps.length) err(s, 'solved example with steps is not in the server HTML');
  if (b.r && b.r.value != null && !b.html.includes(String(b.r.value))) err(s, 'default answer value is not in the server HTML');
  for (const k of ['facts', 'example', 'mistakes', 'faq', 'related', 'updated']) if (!d[k] || (Array.isArray(d[k]) && !d[k].length)) err(s, `missing ${k}`);
  if (d.facts && (!d.facts.formula || !d.facts.vars || !d.facts.rounding)) err(s, 'Key facts needs formula, vars (what each letter means) and rounding');
  const nv = (d.variants || []).length; if (nv < 2 || nv > 3) err(s, `${nv} search-worded variant H2s (need 2–3)`);
  const nf = (d.faq || []).length; if (nf < 3 || nf > 5) err(s, `${nf} FAQs (need 3–5)`);
  const nr = b.related.length; if (nr < 3 || nr > 5) err(s, `${nr} related calculators (need 3–5)`);
  const nm = (d.mistakes || []).length; if (nm < 2 || nm > 5) err(s, `${nm} common mistakes (need 2–5)`);
  const wc = words(b.text); b.words = wc;
  if (wc < WORDS_MIN || wc > WORDS_MAX) err(s, `${wc} words (need ${WORDS_MIN}–${WORDS_MAX})`);
  if (/what is an? [\w\s]*calculator\?/i.test([...(d.variants || []).map(x => x.h2), ...(d.faq || []).map(x => x.q)].join(' '))) err(s, 'filler "What is a … calculator?" heading');
  if (/\b(tested|we tested|our testing|hands-on|certified|expert-reviewed|reviewed by)\b/i.test(b.text)) warn(s, 'claims testing or review; keep only what is literally true');
  if (d.updated > TODAY) err(s, `updated ${d.updated} is in the future`);
  // no page for a single numeric variant
  if (b.index && /\d/.test(s)) err(s, 'indexable slug contains a number (one page per tool, never one per numeric variant)');
}
// two indexable pages must never be the same tool with different numbers
{
  const byName = new Map(), byFn = new Map();
  for (const b of live.filter(x => x.index)) {
    const n = b.def.name.toLowerCase().replace(/[\d.,%$]+/g, '#').replace(/\s+/g, ' ').trim();
    if (byName.has(n)) err(`${byName.get(n)} ↔ ${b.def.slug}`, 'same calculator name apart from numbers: a numeric-variant page'); else byName.set(n, b.def.slug);
    const f = fnSource(b.def.compute).replace(/\s+/g, '');
    if (byFn.has(f)) err(`${byFn.get(f)} ↔ ${b.def.slug}`, 'identical compute(): one tool published twice'); else byFn.set(f, b.def.slug);
  }
}
// name-masked 5-gram overlap: any two indexable show-the-work pages (whole site), legacy pages within their hub
function shingles(b) {
  let t = b.text.toLowerCase();
  const mask = [b.def.name, b.def.keyword].filter(Boolean).map(x => x.toLowerCase().replace(/ calculator$/, '')).sort((a, b) => b.length - a.length);
  for (const m of mask) t = t.split(m).join(' NAME ');
  const w = t.replace(/[^a-z0-9%$. ]/g, ' ').split(/\s+/).filter(Boolean);
  const set = new Set();
  for (let i = 0; i + 5 <= w.length; i++) set.add(w.slice(i, i + 5).join(' '));
  return set;
}
const sh = built.map(b => ({ b, set: shingles(b) }));
let maxOverlap = 0, maxPair = '';
for (let i = 0; i < sh.length; i++) for (let j = i + 1; j < sh.length; j++) {
  const A = sh[i], Bq = sh[j];
  const bothLive = A.b.index && Bq.b.index;
  if (!bothLive && !(A.b.def.hub === Bq.b.def.hub && !A.b.v2 && !Bq.b.v2)) continue;
  if (ONLY && !ONLY.has(A.b.def.slug) && !ONLY.has(Bq.b.def.slug)) continue;
  let inter = 0; for (const x of A.set) if (Bq.set.has(x)) inter++;
  const o = inter / Math.max(1, Math.min(A.set.size, Bq.set.size));
  const pair = `${A.b.def.slug} ↔ ${Bq.b.def.slug}`;
  if (bothLive) {
    if (o > maxOverlap) { maxOverlap = o; maxPair = pair; }
    if (o > MAX_OVERLAP) err(pair, `text overlap ${(o * 100).toFixed(0)}% (> ${MAX_OVERLAP * 100}%)`); else if (o > 0.2) warn(pair, `text overlap ${(o * 100).toFixed(0)}%`);
  } else if (o > 0.35) err(pair, `5-gram overlap ${(o * 100).toFixed(0)}% (> 35%)`);
}

/* ---------------- hub pages (live hubs only) ---------------- */
const hubPages = liveHubs.map(hub => {
  const list = built.filter(b => b.v2 && b.index && b.def.hub === hub.id);
  const url = `${SITE}/${hub.slug}`;
  const updated = list.map(b => b.updated).sort().pop() || RELEASE;
  const body = `<div class="wrap">
${crumbsHtml([['Home', SITE + '/'], [hub.name, url]])}
<div class="hub-hero"><h1>${esc(hub.h1 || hub.name)}<span class="dot">.</span></h1><p>${hub.intro}</p></div>
<div class="twrap"><table class="hub-table"><thead><tr><th scope="col">Calculator</th><th scope="col">Worked example (open it to see every step)</th></tr></thead><tbody>
${list.map(b => `<tr><td><a href="/${b.def.slug}">${esc(b.def.name)}</a></td><td>${b.answer}</td></tr>`).join('\n')}
</tbody></table></div>
<p class="trust">${list.length} calculators · Updated ${fmtDay(updated)} · <a href="/methodology">How steps are checked</a></p>
</div>`;
  const graph = [ORG, WEBSITE,
    { '@type': 'CollectionPage', '@id': url + '#page', url, name: hub.title, description: hub.meta, isPartOf: { '@id': SITE + '/#website' }, breadcrumb: { '@id': url + '#breadcrumb' }, inLanguage: 'en-US', dateModified: updated, mainEntity: { '@id': url + '#list' } },
    crumbsLd(url, [['Home', SITE + '/'], [hub.name, url]]),
    { '@type': 'ItemList', '@id': url + '#list', numberOfItems: list.length, itemListElement: list.map((b, i) => ({ '@type': 'ListItem', position: i + 1, url: b.url, name: b.def.name })) }
  ];
  if (list.length < 2) err(hub.id, `hub has ${list.length} calculator(s); no hub for a single calculator`);
  if ((hub.title || '').length > 60) err(hub.id, `hub title ${hub.title.length} chars (max 60)`);
  return { hub, url, title: hub.title, html: shell({ title: hub.title, meta: hub.meta, url, body, graph }), count: list.length, list, updated };
});
if (liveHubs.length > 5) err('hubs', `${liveHubs.length} hubs (max 5)`);

/* ---------------- /retirement (noindex) ---------------- */
let retirementHtml = null;
if (retiredCalcs.length) {
  const body = `<div class="wrap">
${crumbsHtml([['Home', SITE + '/'], ['Retirement calculators', RETIRE_URL]])}
<div class="hub-hero"><h1>Retirement calculators<span class="dot">.</span></h1><p>${retiredCalcs.length} US retirement calculators from an earlier version of this site. They still work, but they stay out of search results until a credentialed reviewer (CFP or CPA) has checked each one and is named on the page. For the maths behind growth and decay, see <a href="/math-calculators">exponents, roots and growth</a>.</p></div>
${retiredHubs.map(h => { const l = built.filter(b => b.def.hub === h.id); return l.length ? `<h2 class="section-h">${esc(h.name)}</h2><div class="twrap"><table class="hub-table"><thead><tr><th scope="col">Calculator</th><th scope="col">Example answer</th></tr></thead><tbody>${l.map(b => `<tr><td><a href="/${b.def.slug}">${esc(b.def.name)}</a></td><td>${esc(strip(b.r.value))}</td></tr>`).join('')}</tbody></table></div>` : ''; }).join('\n')}
<p class="trust">Not financial, tax or legal advice. Not yet reviewed by a credentialed professional.</p>
</div>`;
  retirementHtml = shell({ title: 'Retirement Calculators (Archive) | calculator.rest', meta: 'Archive of US retirement calculators from an earlier version of calculator.rest: withdrawals, 401(k), Roth IRA, RMDs and Social Security. Not yet professionally reviewed.', url: RETIRE_URL, robots: NOINDEX, body, graph: [ORG, WEBSITE, crumbsLd(RETIRE_URL, [['Home', SITE + '/'], ['Retirement calculators', RETIRE_URL]])] });
}

/* ---------------- homepage ---------------- */
function homePage() {
  const url = SITE + '/';
  const feat = B.get('percentage-calculator');
  const title = 'calculator.rest: Maths Calculators That Show the Work';
  const meta = '30% of 150 is 45: multiply 150 by 0.30. Free calculators for percentages, grades, averages, exponents and decay word problems, with every step shown.';
  const fd = feat.def;
  const cb = calcBlock(fd, defaultsOf(fd.inputs), feat.r, '');
  const body = `<div class="wrap">
<header class="page-head v2-head home-head">
<h1>Calculators that show the work</h1>
<p class="answer-line">${feat.answer} Change the numbers and every step below updates.</p>
</header>
${cb.html}
<section id="calculators">
<h2 class="section-h">${mathCalcs.length} calculators in ${hubPages.length} groups</h2>
<p class="tnote">Each one solves your exact numbers step by step: the formula, the numbers put in, each piece of arithmetic and the rounded answer with units.</p>
<div class="hubs">
${hubPages.map(hp => `<div class="hub-card" data-group><h3><a href="/${hp.hub.slug}">${esc(hp.hub.name)}</a></h3><p class="count">${esc(hp.hub.intro)}</p><ul>${hp.list.map(b => `<li><a href="/${b.def.slug}">${esc(b.def.name)}</a></li>`).join('')}</ul></div>`).join('\n')}
</div>
</section>
<section id="history-wrap" hidden><h2 class="section-h">your last answers</h2><ul id="history"></ul><button class="linkbtn" id="history-clear" type="button">clear history</button></section>
</div>`;
  const graph = [ORG, WEBSITE,
    { '@type': 'WebPage', '@id': url + '#page', url, name: title, description: meta, isPartOf: { '@id': SITE + '/#website' }, inLanguage: 'en-US', dateModified: built.filter(b => b.index).map(b => b.updated).sort().pop() || RELEASE },
    { '@type': 'WebApplication', '@id': url + '#app', name: fd.name, url, applicationCategory: 'EducationalApplication', operatingSystem: 'Any', isAccessibleForFree: true, offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' } },
    { '@type': 'ItemList', '@id': url + '#hubs', itemListElement: hubPages.map((hp, i) => ({ '@type': 'ListItem', position: i + 1, url: hp.url, name: hp.hub.name })) }
  ];
  return { title, html: shell({ title, meta, url, body, graph, scripts: cb.script }) };
}
const home = homePage();
if (home.title.length > 60) err('home', `title ${home.title.length} chars`);

/* ---------------- static pages ---------------- */
const staticPages = pages.map(p => {
  const url = `${SITE}/${p.slug}`;
  const ctx = { calcs: built.filter(b => b.index), hubs: hubPages, retired: retiredCalcs.length };
  const body = `<div class="wrap">${crumbsHtml([['Home', SITE + '/'], [p.name, url]])}<div class="prose"><h1>${esc(p.h1)}</h1>${typeof p.html === 'function' ? p.html(ctx) : p.html}</div></div>`;
  return { p, url, index: p.index !== false, html: shell({ title: p.title, meta: p.meta, url, robots: p.index === false ? NOINDEX : INDEX, body, graph: [ORG, WEBSITE, { '@type': p.type || 'WebPage', '@id': url + '#page', url, name: p.title, description: p.meta, isPartOf: { '@id': SITE + '/#website' }, dateModified: p.updated || RELEASE }, crumbsLd(url, [['Home', SITE + '/'], [p.name, url]])] }) };
});

/* ---------------- sitemap set + site-level checks ---------------- */
const homeLastmod = built.filter(b => b.index).map(b => b.updated).sort().pop() || RELEASE;
const sitemapUrls = [
  [SITE + '/', homeLastmod],
  ...hubPages.map(hp => [hp.url, hp.updated]),
  ...staticPages.filter(sp => sp.index).map(sp => [sp.url, sp.p.updated || RELEASE]),
  ...built.filter(b => b.index).map(b => [b.url, b.updated])
];
if (sitemapUrls.length > MAX_INDEXABLE) err('site', `${sitemapUrls.length} indexable URLs (max ${MAX_INDEXABLE})`);
{
  const dates = new Set(sitemapUrls.map(([, d]) => d));
  if (dates.size === 1 && !dates.has(RELEASE)) err('site', `every lastmod is ${[...dates][0]}: lastmod must be each page's real edit date, not one date for all (only the ${RELEASE} release may share one)`);
  for (const [u, d] of sitemapUrls) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(d)) err(u, `lastmod "${d}" is not a date`);
    else if (d > TODAY) err(u, `lastmod ${d} is in the future`);
  }
  const html = [home.html, ...hubPages.map(h => h.html), ...staticPages.map(s => s.html), ...built.map(b => b.html)];
  for (const h of html) { const c = (h.match(/<link rel="canonical" href="([^"]+)"/) || [])[1]; if (!c || !c.startsWith(SITE + '/')) err('site', `canonical not on ${SITE}: ${c}`); }
}

/* ---------------- report ---------------- */
const quiet = !!args.quiet;
if (ONLY) {
  const mine = m => [...ONLY].some(x => m.includes(x + ':') || m.includes(x + ' ↔') || m.includes('↔ ' + x) || m.includes(x + '.mjs'));
  const keepE = errors.filter(mine), keepW = warnings.filter(mine);
  errors.length = 0; errors.push(...keepE); warnings.length = 0; warnings.push(...keepW);
  for (const x of ONLY) if (!bySlug.has(x)) errors.push(`✗ ${x}: no file content/calculators/${x}.mjs`);
}
if (warnings.length && !quiet) console.log(warnings.join('\n'));
if (errors.length) console.log(errors.join('\n'));
const totalPages = built.length + hubPages.length + staticPages.length + 1 + (retirementHtml ? 1 : 0);
const wcs = live.filter(b => b.words).map(b => b.words);
console.log(`\n${live.length} show-the-work calculators · ${retiredCalcs.length} retirement (noindex) · ${hubPages.length} hubs · ${staticPages.length} static · ${totalPages} pages`);
console.log(`indexable URLs ${sitemapUrls.length}/${MAX_INDEXABLE} · words ${Math.min(...wcs)}–${Math.max(...wcs)} · max overlap ${(maxOverlap * 100).toFixed(1)}% (${maxPair}) · ${warnings.length} warnings · ${errors.length} errors`);
if (errors.length && STRICT) { console.log('Build failed (use --no-strict to write anyway).'); process.exit(1); }

if (CHECK) { console.log('Check only: nothing written.'); process.exit(0); }
/* ---------------- write ---------------- */
fs.rmSync(OUT, { recursive: true, force: true });
fs.mkdirSync(path.join(OUT, 'assets'), { recursive: true });
const copyDir = (src, dst) => { if (!fs.existsSync(src)) return; for (const e of fs.readdirSync(src, { withFileTypes: true })) { const a = path.join(src, e.name), b = path.join(dst, e.name); if (e.isDirectory()) { fs.mkdirSync(b, { recursive: true }); copyDir(a, b); } else fs.copyFileSync(a, b); } };
copyDir(path.join(ROOT, 'public'), OUT);
fs.writeFileSync(path.join(OUT, APP_URL), appJs);
const write = (rel, html) => fs.writeFileSync(path.join(OUT, rel), html);
write('index.html', home.html);
for (const b of built) write(`${b.def.slug}.html`, b.html);
for (const hp of hubPages) write(`${hp.hub.slug}.html`, hp.html);
for (const sp of staticPages) write(`${sp.p.slug}.html`, sp.html);
if (retirementHtml) write('retirement.html', retirementHtml);
write('404.html', shell({ title: 'Page not found | calculator.rest', meta: 'This page does not exist. Pick a calculator from the homepage: percentages, grades, averages, exponents and decay word problems, with steps.', url: SITE + '/404', robots: 'noindex', body: `<div class="wrap prose"><h1>404: dot looked everywhere<span class="dot">.</span></h1><p>That page doesn't exist. Try the <a href="/#calculators">full list of ${mathCalcs.length} calculators</a> or one of these groups:</p><ul>${hubPages.map(hp => `<li><a href="/${hp.hub.slug}">${esc(hp.hub.name)}</a></li>`).join('')}</ul></div>` }));

// one sitemap with only the indexable URLs, each with its real lastmod
write('sitemap.xml', `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${sitemapUrls.map(([u, d]) => `<url><loc>${u}</loc><lastmod>${d}</lastmod></url>`).join('\n')}\n</urlset>\n`);
write('robots.txt', `# calculator.rest: every crawler, including AI search and assistant crawlers, is welcome\nUser-agent: *\nUser-agent: Googlebot\nUser-agent: Bingbot\nUser-agent: OAI-SearchBot\nUser-agent: ChatGPT-User\nUser-agent: GPTBot\nUser-agent: Claude-SearchBot\nUser-agent: Claude-User\nUser-agent: ClaudeBot\nUser-agent: PerplexityBot\nUser-agent: Perplexity-User\nUser-agent: Applebot\nAllow: /\nDisallow: /*?\n\n# Backlink scrapers\nUser-agent: AhrefsBot\nUser-agent: DataForSeoBot\nUser-agent: SERankingBacklinksBot\nDisallow: /\n\nSitemap: ${SITE}/sitemap.xml\n`);
// llms.txt: every indexable tool's worked answer, for answer engines
{
  const plain = x => String(x ?? '').replace(/<[^>]+>/g, '').replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;|&rsquo;/g, "'").replace(/\s+/g, ' ').trim();
  write('llms.txt', `# ${BRAND}\n\n> Calculators that show the work for school and everyday maths: percentages, grades and averages, exponents, roots, growth and decay word problems, rates and units. Every page solves the reader's numbers step by step (formula, substitution, each arithmetic step, rounded answer with units). Free, no sign-up, nothing entered is stored.\n\n${hubPages.map(hp => `## ${hp.hub.name}\n${hp.list.map(b => `- [${b.def.name}](${b.url}): ${plain(b.answer)}`).join('\n')}`).join('\n\n')}\n\n## About\n- [How steps are checked](${SITE}/methodology)\n- [About and error reports](${SITE}/about)\n`);
}
write('urls.txt', sitemapUrls.map(([u]) => u).join('\n') + '\n'); // indexable URLs only (IndexNow guard)
console.log(`Wrote ${totalPages} pages to dist/`);
