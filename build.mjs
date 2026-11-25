#!/usr/bin/env node
// calculator.rest static site builder. Zero dependencies.
// Usage: node build.mjs [--only=slug,slug] [--no-strict] [--quiet]
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
const args = Object.fromEntries(process.argv.slice(2).map(a => { const [k, v] = a.replace(/^--/, '').split('='); return [k, v ?? true]; }));
const STRICT = !args['no-strict'];
const ONLY = args.only ? new Set(String(args.only).split(',').map(x => x.trim()).filter(Boolean)) : null;
const CHECK = !!args.check;
const PLAN_ROWS = fs.readFileSync(path.join(ROOT, 'content/plan.tsv'), 'utf8').split('\n').slice(1).map(l => l.split('\t')).filter(r => r[0]);
const PLAN = new Set(PLAN_ROWS.map(r => r[0]));
const HOT = new Set(PLAN_ROWS.filter(r => /\bHOT\b/.test(r[4] || '')).map(r => r[0]));

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
calcs.sort((a, b) => (planIndex.get(a.slug) ?? 1e9) - (planIndex.get(b.slug) ?? 1e9)); // demand order from plan.tsv, never alphabetical
const bySlug = new Map(calcs.map(c => [c.slug, c]));
const hubById = new Map(hubs.map(h => [h.id, h]));

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

function shell({ title, meta, url, body, graph, robots = 'index,follow,max-image-preview:large', ogType = 'website', scripts = '' }) {
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
<nav class="nav" aria-label="Main"><a class="hide-sm" href="/#calculators">calculators</a><a class="hide-sm" href="/about">about</a><a class="pill" href="/#calculators">all ${calcs.length} retirement tools</a></nav>
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
  const top = ['how-long-will-money-last-calculator', 'retirement-withdrawal-calculator', 'monte-carlo-retirement-calculator', 'retirement-calculator', '401k-retirement-calculator', 'retirement-tax-calculator', 'social-security-calculator', 'rmd-calculator'].filter(s => bySlug.has(s));
  return `<footer>
<div class="wrap">
<div class="foot">
<div><a class="brand" href="/"><i></i>calculator.rest</a><p>Retirement math, handled. You, rested. Free retirement calculators that show their formula, cite the IRS and SSA, run in your browser and never ask you to sign up.</p></div>
<div><h2>Categories</h2><ul>${hubs.map(h => `<li><a href="/${h.slug}">${esc(h.name)}</a></li>`).join('')}</ul></div>
<div><h2>Site</h2><ul><li><a href="/about">About</a></li><li><a href="/methodology">Methodology</a></li><li><a href="/privacy">Privacy</a></li></ul></div>
<div><h2>Popular</h2><ul>${top.map(s => `<li><a href="/${s}">${esc(bySlug.get(s).name)}</a></li>`).join('')}</ul></div>
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

/* ---------------- calculator block (inputs left, results right) ---------------- */
function calcBlock(def, v, r, summary, opts = {}) {
  const inputsLite = (def.inputs || []).map(c => ({ id: c.id, type: c.type, showIf: c.showIf, max: c.max, fields: c.fields && c.fields.map(f => ({ id: f.id, type: f.type, value: f.value, blank: f.blank })) }));
  const notes = def.notes || null;
  const script = `<script>window.CALC={slug:${jsonScript(def.slug)},name:${jsonScript(def.name)},inputs:${jsonScript(inputsLite)},notes:${notes ? jsonScript(notes) : 'null'},data:${def.data ? jsonScript(def.data) : 'null'},compute:${fnSource(def.compute)}};</script>\n<script src="${APP_URL}" defer></script>`;
  const html = `<section class="calc" aria-label="${esc(def.name)}">
<form id="calc-form" class="calc-in" data-calc autocomplete="off" novalidate>
${opts.inputsTitle ? `<h2 class="calc-h">${esc(opts.inputsTitle)}</h2>` : ''}
${fieldsHtml(def, v)}
<div class="actions"><button type="button" data-copy>Copy result</button><button type="button" data-share>Share</button><button type="button" data-reset>Reset</button></div>
</form>
<div class="calc-out">
<h2 class="calc-h">Your results</h2>
<output id="result" for="calc-form" aria-live="polite">${renderResult(r, H, notes)}</output>
<div class="summary"><h3>Summary</h3><p id="summary">${summary}</p>${def.assumptions ? `<p class="assume">${def.assumptions}</p>` : ''}</div>
<p class="privacy-note">Calculated on your device. Nothing you enter is sent or stored.</p>
</div>
</section>`;
  return { html, script };
}

/* ---------------- calculator pages ---------------- */
const built = []; // {def, r, url, text}
const YEAR = '2026';
for (const def of calcs) {
  const s = def.slug;
  def.title = def.seoTitle || `${YEAR} ${def.name} | ${BRAND}`;
  def.h1 = def.seoH1 || `${def.name} ${YEAR}`;
  if (!hubById.has(def.hub)) err(s, `unknown hub "${def.hub}"`);
  const v = defaultsOf(def.inputs);
  let r;
  const run = (over = {}) => { try { return def.compute({ ...v, ...over }, H, def.data) || {}; } catch (e) { err(s, 'compute threw: ' + e.message); return {}; } };
  try { r = def.compute(v, H, def.data); } catch (e) { err(s, 'compute(defaults) threw: ' + e.message); r = { error: 'error' }; }
  if (!r || r.error) err(s, 'compute(defaults) returned error: ' + (r && r.error));
  try { new Function('return ' + fnSource(def.compute)); } catch (e) { err(s, 'compute is not serializable: ' + e.message); }
  // serialization round-trip test (catches closures over module scope)
  try {
    const fn = new Function('H', 'return (' + fnSource(def.compute) + ')')(H);
    const rr = fn(JSON.parse(JSON.stringify(v, (k, x) => (typeof x === 'number' && !isFinite(x)) ? null : x)), H, def.data ? JSON.parse(JSON.stringify(def.data)) : undefined);
    if (strip(rr && rr.value) !== strip(r && r.value) && !(Object.values(v).some(x => typeof x === 'number' && isNaN(x)))) warn(s, 'serialized compute gives different value: ' + strip(rr && rr.value));
  } catch (e) { err(s, 'serialized compute fails in isolation (uses outside variables?): ' + e.message); }
  const ctx = { v, r: r || {}, H, D: def.data, run };
  let quick = '';
  try { quick = typeof def.quick === 'function' ? def.quick(ctx) : String(def.quick || ''); } catch (e) { err(s, 'quick() threw: ' + e.message); }
  let tableRows = [];
  if (def.table) { try { tableRows = typeof def.table.rows === 'function' ? def.table.rows(ctx) : (def.table.rows || []); } catch (e) { err(s, 'table.rows() threw: ' + e.message); } }
  const url = `${SITE}/${s}`;
  const hub = hubById.get(def.hub) || hubs[0];
  const updated = def.updated || '2026-11-13';
  const related = (def.related || []).filter(x => {
    if (!PLAN.has(x)) { err(s, `related slug not in content/plan.tsv: ${x}`); return false; }
    if (!bySlug.has(x)) { if (!ONLY) warn(s, `related calculator not written yet: ${x}`); return false; }
    return x !== s;
  });
  if (!PLAN.has(s)) warn(s, 'slug is not in content/plan.tsv');

  const formula = def.formula ? `<div class="formula"><div class="expr-big">${def.formula.expr}</div>${def.formula.vars ? `<dl>${def.formula.vars.map(([a, b]) => `<dt>${a}</dt><dd>${b}</dd>`).join('')}</dl>` : ''}</div>${def.formula.note ? `<p>${def.formula.note}</p>` : ''}` : '';
  const explore = [...related, ...calcs.filter(c => c.hub === def.hub && c.slug !== s && !related.includes(c.slug)).map(c => c.slug)];
  const article = [
    def.table && tableRows.length ? `<h2 id="table">${esc(def.table.title)}</h2>${def.table.intro ? `<p>${def.table.intro}</p>` : ''}<div class="twrap"><table><thead><tr>${def.table.head.map(h => `<th scope="col">${h}</th>`).join('')}</tr></thead><tbody>${tableRows.map(row => `<tr>${row.map(c => `<td>${c}</td>`).join('')}</tr>`).join('')}</tbody></table></div>${def.table.note ? `<p class="tnote">${def.table.note}</p>` : ''}` : '',
    (def.formula || def.example) ? `<h2 id="formula">${esc(def.formulaTitle || 'How is it calculated?')}</h2>${formula}${def.example ? `<h3>Worked example</h3><div class="example">${def.example}</div>` : ''}` : '',
    ...(def.sections || []).map(sec => `<h2>${esc(sec.h2)}</h2>${sec.html}`),
    explore.length ? `<h2 id="explore">Explore other retirement calculators</h2><ul class="explore">${explore.map(x => `<li><a href="/${x}">${esc(bySlug.get(x).name)}</a></li>`).join('')}</ul>` : '',
    def.faq && def.faq.length ? `<section class="faq"><h2 id="faq">FAQs</h2>${def.faq.map(f => `<h3>${esc(f.q)}</h3><div class="faq-a">${/^\s*</.test(f.a) ? f.a : `<p>${f.a}</p>`}</div>`).join('')}</section>` : '',
    `<h2 id="sources">Sources and method</h2>${def.sources && def.sources.length ? `<ul class="sources">${def.sources.map(x => `<li><a href="${esc(x.url)}" rel="nofollow noopener" target="_blank">${esc(x.name)}</a></li>`).join('')}</ul>` : ''}<p class="trust">Built and maintained by calculator.rest${def.reviewer ? ` · Reviewed by ${def.reviewer.url ? `<a href="${esc(def.reviewer.url)}">${esc(def.reviewer.name)}</a>` : esc(def.reviewer.name)}, ${esc(def.reviewer.credential)}${def.reviewer.date ? ` on ${fmtDay(def.reviewer.date)}` : ''}` : ''} · Formula follows the sources above · Last updated ${fmtDay(updated)} · <a href="/methodology">How we build and check calculators</a>${def.disclaimer ? `<br>${def.disclaimer}` : ''}</p>`
  ].join('\n');

  const cb = calcBlock(def, v, r || {}, quick);
  const script = cb.script;
  const body = `<div class="wrap">
${crumbsHtml([['Home', SITE + '/'], [hub.name, `${SITE}/${hub.slug}`], [def.name, url]])}
<header class="page-head">
<h1>${esc(def.h1)}</h1>
<p class="intro">${def.intro || quick}</p>
${def.intro && quick ? `<div class="answer"><span class="tag">Quick answer</span><p>${quick}</p></div>` : ''}
<p class="meta-line">Updated ${fmtDay(updated)} · Free, no sign-up · Sources: ${esc((def.sources || []).map(x => x.name.split(':')[0]).filter((x, i, a) => a.indexOf(x) === i).slice(0, 3).join(', ') || 'see below')}</p>
</header>
${cb.html}
<article class="article">
${article}
</article>
</div>`;

  const graph = [ORG, WEBSITE,
    { '@type': 'WebPage', '@id': url + '#page', url, name: def.title, description: def.meta, isPartOf: { '@id': SITE + '/#website' }, breadcrumb: { '@id': url + '#breadcrumb' }, inLanguage: 'en-US', datePublished: def.published || '2026-11-13', dateModified: updated, author: { '@id': SITE + '/#org' }, publisher: { '@id': SITE + '/#org' }, mainEntity: { '@id': url + '#app' }, ...(def.reviewer ? { reviewedBy: { '@type': 'Person', name: def.reviewer.name, jobTitle: def.reviewer.credential, ...(def.reviewer.url ? { url: def.reviewer.url } : {}) }, ...(def.reviewer.date ? { lastReviewed: def.reviewer.date } : {}) } : {}) },
    crumbsLd(url, [['Home', SITE + '/'], [hub.name, `${SITE}/${hub.slug}`], [def.name, url]]),
    { '@type': 'WebApplication', '@id': url + '#app', name: def.name, url, description: def.meta, applicationCategory: APP_CAT[def.hub] || 'UtilitiesApplication', operatingSystem: 'Any', browserRequirements: 'Requires JavaScript for live updates; default answer works without it', isAccessibleForFree: true, offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' }, publisher: { '@id': SITE + '/#org' } },
    def.table && tableRows.length ? { '@type': 'Table', '@id': url + '#table', about: def.table.title } : null,
    def.faq && def.faq.length ? { '@type': 'FAQPage', '@id': url + '#faq', mainEntity: def.faq.map(f => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: strip(f.a) } })) } : null
  ].filter(Boolean);

  const html = shell({ title: def.title, meta: def.meta, url, body, graph, scripts: script });
  const text = strip((def.intro || '') + ' ' + quick + ' ' + article);
  built.push({ def, r: r || {}, url, html, text, quick, tableRows, updated });
}

function cardLine(slug) {
  const b = built.find(x => x.def.slug === slug);
  const def = bySlug.get(slug);
  if (def && def.card) return def.card;
  let r = b && b.r;
  if (!r && def) { try { r = def.compute(defaultsOf(def.inputs), H, def.data); } catch (e) { r = {}; } }
  if (!r || r.error) return '';
  const val = strip(r.value);
  return (r.expr ? strip(r.expr) + ' → ' : '') + val;
}

/* ---------------- checks ---------------- */
const seen = { title: new Map(), meta: new Map(), h1: new Map(), keyword: new Map() };
const MONEY_HEALTH = new Set(['income', 'planning', 'rules']);
for (const b of built) {
  const d = b.def, s = d.slug;
  for (const k of ['name', 'title', 'h1', 'meta', 'keyword', 'hub']) if (!d[k]) err(s, `missing ${k}`);
  for (const k of ['title', 'meta', 'h1', 'keyword']) {
    if (!d[k]) continue;
    const key = String(d[k]).toLowerCase().trim();
    if (seen[k].has(key)) err(s, `duplicate ${k} with ${seen[k].get(key)}`); else seen[k].set(key, s);
  }
  const tl = (d.title || '').length;
  if (tl > 66) err(s, `title ${tl} chars (max 62)`); else if (tl > 62) warn(s, `title ${tl} chars (aim ≤ 62)`);
  const ml = (d.meta || '').length;
  if (ml < 100 || ml > 170) err(s, `meta ${ml} chars (110–160)`); else if (ml < 110 || ml > 160) warn(s, `meta ${ml} chars (aim 110–160)`);
  if (d.meta && d.title && d.meta.trim().toLowerCase() === d.title.trim().toLowerCase()) err(s, 'meta equals title');
  if (!/\d/.test(d.title || '')) warn(s, 'title has no number');
  const qw = words(b.quick);
  if (!/\d/.test(strip(b.quick))) err(s, 'quick answer has no number');
  if (qw < 25 || qw > 95) warn(s, `quick answer ${qw} words (aim 40–70)`);
  const nf = (d.faq || []).length;
  if (nf < 5) err(s, `only ${nf} FAQs (need 10–15)`); else if (nf < 10 || nf > 16) warn(s, `${nf} FAQs (aim 10–15)`);
  const ns = (d.sections || []).length;
  if (ns < 2) err(s, `only ${ns} question sections (need 3–4)`); else if (ns < 3) warn(s, `${ns} question sections (aim 3–4)`);
  if (!d.intro) warn(s, 'no intro (one plain sentence under the H1, template style)');
  for (const c of d.inputs || []) if (c.type !== 'rows' && !c.help) warn(s, `input "${c.id}" has no help text`);
  if (!d.notes) warn(s, 'no result notes');
  if (!d.table || !b.tableRows.length) warn(s, 'no computed table');
  if ((d.related || []).length < 3) warn(s, 'fewer than 3 related');
  if (!d.sources || !d.sources.length) (MONEY_HEALTH.has(d.hub) ? err : warn)(s, 'no sources');
  const wc = words(b.text);
  b.words = wc;
  if (HOT.has(s) && wc < 1500) warn(s, `HOT page has ${wc} words (playbook: 1,500–2,200)`);
  else if (wc < 500) warn(s, `body ${wc} words (playbook: 500–800 minimum for small tools)`);
  if (/[$€£]\s?\d{1,3}\.\d{3}\.\d{3}/.test(b.text)) err(s, 'European-style money format (use $1,000,000)'); else if (/\$\d{1,3}\.\d{3}(?![\d%])/.test(b.text)) warn(s, 'possible wrong-locale number like $10.412 (US uses $10,412)');
  if (/\b(tested|we tested|our testing|hands-on)\b/i.test(b.text)) warn(s, 'mentions testing; keep only claims that are literally true');
  if (/what is an? [\w\s]*calculator\?/i.test((d.sections || []).map(x => x.h2).join(' '))) warn(s, 'filler "What is a … calculator?" heading');
}
// one query, one owning page: a query may appear as keyword/also on only one page
{
  const owner = new Map();
  for (const b of built) for (const q of [b.def.keyword, ...(b.def.also || [])]) {
    if (!q) continue; const k = String(q).toLowerCase().trim();
    if (owner.has(k) && owner.get(k) !== b.def.slug) warn(`${owner.get(k)} ↔ ${b.def.slug}`, `both claim the query "${k}"`); else owner.set(k, b.def.slug);
  }
}
// name-masked 5-gram overlap between pages in the same hub
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
let maxOverlap = 0;
for (let i = 0; i < sh.length; i++) for (let j = i + 1; j < sh.length; j++) {
  const A = sh[i], B = sh[j];
  if (A.b.def.hub !== B.b.def.hub) continue;
  if (ONLY && !ONLY.has(A.b.def.slug) && !ONLY.has(B.b.def.slug)) continue;
  let inter = 0; for (const x of A.set) if (B.set.has(x)) inter++;
  const o = inter / Math.max(1, Math.min(A.set.size, B.set.size));
  maxOverlap = Math.max(maxOverlap, o);
  const pair = `${A.b.def.slug} ↔ ${B.b.def.slug}`;
  if (o > 0.35) err(pair, `5-gram overlap ${(o * 100).toFixed(0)}% (> 35%)`); else if (o > 0.25) warn(pair, `5-gram overlap ${(o * 100).toFixed(0)}%`);
}

/* ---------------- hub pages ---------------- */
const hubPages = hubs.map(hub => {
  const list = built.filter(b => b.def.hub === hub.id);
  const url = `${SITE}/${hub.slug}`;
  const title = hub.title.replace('{n}', list.length);
  const totalWords = list.reduce((a, b) => a + (b.words || 0), 0);
  const body = `<div class="wrap">
${crumbsHtml([['Home', SITE + '/'], [hub.name, url]])}
<div class="hub-hero"><h1>${esc(hub.name)} calculators<span class="dot">.</span></h1><p>${list.length} free calculators. ${hub.intro}</p></div>
<h2 class="section-h">Every ${esc(hub.name.toLowerCase())} calculator, with a worked answer</h2>
<p class="tnote">Each row shows the answer the calculator gives for its example inputs, so you can see what it does before you open it.</p>
<div class="twrap"><table class="hub-table"><thead><tr><th scope="col">Calculator</th><th scope="col">Example answer</th></tr></thead><tbody>
${list.map(b => `<tr><td><a href="/${b.def.slug}">${esc(b.def.name)}</a></td><td>${esc(strip(b.r.value))}${b.r.label ? `<br><span class="tnote">${esc(strip(b.r.label))}</span>` : ''}</td></tr>`).join('\n')}
</tbody></table></div>
<div class="prose">
<h2>Common questions</h2>
${(hub.faq || []).map(([q, a]) => `<h3>${esc(q)}</h3><p>${a}</p>`).join('')}
<p class="trust">${list.length} calculators · ${totalWords.toLocaleString('en-US')} words of formulas, examples and answers · Last updated ${fmtDay(list.map(b => b.updated).sort().pop() || '2026-11-13')} · <a href="/methodology">Methodology</a></p>
</div>
</div>`;
  const graph = [ORG, WEBSITE,
    { '@type': 'CollectionPage', '@id': url + '#page', url, name: title, description: hub.meta, isPartOf: { '@id': SITE + '/#website' }, breadcrumb: { '@id': url + '#breadcrumb' }, inLanguage: 'en-US', dateModified: list.map(b => b.updated).sort().pop() || '2026-11-13', mainEntity: { '@id': url + '#list' } },
    crumbsLd(url, [['Home', SITE + '/'], [hub.name, url]]),
    { '@type': 'ItemList', '@id': url + '#list', numberOfItems: list.length, itemListElement: list.map((b, i) => ({ '@type': 'ListItem', position: i + 1, url: b.url, name: b.def.name })) },
    hub.faq ? { '@type': 'FAQPage', '@id': url + '#faq', mainEntity: hub.faq.map(([q, a]) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: strip(a) } })) } : null
  ].filter(Boolean);
  if (list.length === 0) warn(hub.id, 'hub has no calculators');
  return { hub, url, title, html: shell({ title, meta: hub.meta, url, body, graph }), count: list.length };
});

/* ---------------- homepage ---------------- */
function homePage() {
  const url = SITE + '/';
  const feat = built.find(b => b.def.slug === 'how-long-will-money-last-calculator');
  const chips = ['retirement-withdrawal-calculator', 'monte-carlo-retirement-calculator', 'retirement-calculator', '401k-retirement-calculator', 'retirement-tax-calculator', 'social-security-calculator'].filter(s => bySlug.has(s));
  const title = `Retirement Calculator 2026: How Long Will Your Money Last?`;
  const meta = `How long will your money last? $500,000 at $3,000 a month lasts about 18 years. Free calculators for withdrawals, Monte Carlo odds, 401(k) and 2026 taxes.`;
  const fd = feat.def, fv = defaultsOf(fd.inputs);
  const cb = calcBlock(fd, fv, feat.r, feat.quick);
  const script = cb.script;
  const body = `<div class="wrap">
<header class="page-head home-head">
<p class="eyebrow">Free retirement calculators · 2026</p>
<h1>Retirement calculator: how long will your money last?</h1>
<p class="intro">Plug in your savings and what you spend, and we'll show you how many years it lasts, the monthly withdrawal that lasts 30 years and your balance year by year. Every tool shows its formula and cites the IRS or SSA.</p>
${feat.quick ? `<div class="answer"><span class="tag">Quick answer</span><p>${feat.quick}</p></div>` : ''}
<ul class="chips">${chips.map(s => `<li><a href="/${s}">${esc(bySlug.get(s).name.replace(/ Calculator$/, ''))}</a></li>`).join('')}</ul>
</header>
${cb.html}
<section id="history-wrap" hidden><h2 class="section-h">your last calcs</h2><ul id="history"></ul><button class="linkbtn" id="history-clear" type="button">clear history</button></section>
<section id="calculators">
<h2 class="section-h">${calcs.length} retirement calculators, one question each</h2>
<label class="search"><i aria-hidden="true"></i><input id="calc-search" type="search" placeholder="search: 401k, withdrawal, social security, rmd…" aria-label="Search calculators"></label>
<p id="search-empty" hidden>No calculator matches that yet.</p>
<div class="hubs">
${hubPages.map(hp => `<div class="hub-card" data-group><h3><a href="/${hp.hub.slug}">${esc(hp.hub.name)}</a></h3><p class="count">${hp.count} calculators</p><ul>${built.filter(b => b.def.hub === hp.hub.id).map(b => `<li data-search="${esc((b.def.name + ' ' + b.def.keyword + ' ' + hp.hub.name).toLowerCase())}"><a href="/${b.def.slug}">${esc(b.def.name)}</a></li>`).join('')}</ul></div>`).join('\n')}
</div>
</section>
<section class="why" aria-label="Why calculator.rest">
<div><h3>your numbers, not averages</h3><p>Every tool runs a year-by-year model with your savings, spending, return, inflation and taxes, and shows the table behind the answer.</p></div>
<div><h3>2026 rules, cited</h3><p>Contribution limits, tax brackets, Social Security thresholds and RMD tables come from the IRS and SSA, with a link to each source.</p></div>
<div><h3>private by design</h3><p>Your balances never leave your device. There is no account, no email capture and no advisor sales call.</p></div>
<div><h3>not a sales funnel</h3><p>We don't sell annuities, funds or advice. The calculators exist to give you an honest number.</p></div>
</section>
</div>`;
  const graph = [ORG, WEBSITE,
    { '@type': 'WebPage', '@id': url + '#page', url, name: title, description: meta, isPartOf: { '@id': SITE + '/#website' }, inLanguage: 'en-US', dateModified: built.map(b => b.updated).sort().pop() || '2026-11-24' },
    { '@type': 'WebApplication', '@id': url + '#app', name: 'calculator.rest retirement calculator', url, applicationCategory: 'FinanceApplication', operatingSystem: 'Any', isAccessibleForFree: true, offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' } },
    { '@type': 'ItemList', '@id': url + '#hubs', itemListElement: hubPages.map((hp, i) => ({ '@type': 'ListItem', position: i + 1, url: hp.url, name: hp.hub.name })) }
  ];
  return shell({ title, meta, url, body, graph, scripts: script });
}

/* ---------------- static pages ---------------- */
const staticPages = pages.map(p => {
  const url = `${SITE}/${p.slug}`;
  const body = `<div class="wrap">${crumbsHtml([['Home', SITE + '/'], [p.name, url]])}<div class="prose"><h1>${esc(p.h1)}</h1>${typeof p.html === 'function' ? p.html({ calcs: built, hubs: hubPages }) : p.html}</div></div>`;
  return { p, url, html: shell({ title: p.title, meta: p.meta, url, body, graph: [ORG, WEBSITE, { '@type': p.type || 'WebPage', '@id': url + '#page', url, name: p.title, description: p.meta, isPartOf: { '@id': SITE + '/#website' }, dateModified: p.updated || '2026-11-13' }, crumbsLd(url, [['Home', SITE + '/'], [p.name, url]])] }) };
});

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
const totalPages = built.length + hubPages.length + staticPages.length + 1;
console.log(`\n${built.length} calculators · ${hubPages.length} hubs · ${staticPages.length} static · ${totalPages} pages · ${warnings.length} warnings · ${errors.length} errors · max sibling overlap ${(maxOverlap * 100).toFixed(1)}%`);
if (errors.length && STRICT) { console.log('Build failed (use --no-strict to write anyway).'); process.exit(1); }

if (CHECK) { console.log('Check only: nothing written.'); process.exit(0); }
/* ---------------- write ---------------- */
fs.rmSync(OUT, { recursive: true, force: true });
fs.mkdirSync(path.join(OUT, 'assets'), { recursive: true });
const copyDir = (src, dst) => { if (!fs.existsSync(src)) return; for (const e of fs.readdirSync(src, { withFileTypes: true })) { const a = path.join(src, e.name), b = path.join(dst, e.name); if (e.isDirectory()) { fs.mkdirSync(b, { recursive: true }); copyDir(a, b); } else fs.copyFileSync(a, b); } };
copyDir(path.join(ROOT, 'public'), OUT);
fs.writeFileSync(path.join(OUT, APP_URL), appJs);
const write = (rel, html) => fs.writeFileSync(path.join(OUT, rel), html);
write('index.html', homePage());
for (const b of built) write(`${b.def.slug}.html`, b.html);
for (const hp of hubPages) write(`${hp.hub.slug}.html`, hp.html);
for (const sp of staticPages) write(`${sp.p.slug}.html`, sp.html);
write('404.html', shell({ title: 'Page not found | calculator.rest', meta: 'This page does not exist. Search all calculators on calculator.rest or go back to the homepage to find the tool you need.', url: SITE + '/404', robots: 'noindex', body: `<div class="wrap prose"><h1>404: dot looked everywhere<span class="dot">.</span></h1><p>That page doesn't exist. Try the <a href="/#calculators">full list of ${calcs.length} calculators</a> or one of these:</p><ul>${hubPages.map(hp => `<li><a href="/${hp.hub.slug}">${esc(hp.hub.name)}</a></li>`).join('')}</ul></div>` }));

// sitemaps: one per page family, honest lastmod
const sm = (urls) => `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.map(([u, d]) => `<url><loc>${u}</loc><lastmod>${d}</lastmod></url>`).join('\n')}\n</urlset>\n`;
const latest = built.map(b => b.updated).sort().pop() || '2026-11-13';
const families = [['pages', [[SITE + '/', latest], ...hubPages.map(hp => [hp.url, latest]), ...staticPages.map(sp => [sp.url, sp.p.updated || '2026-11-13'])]]];
for (const hub of hubs) families.push([hub.id, built.filter(b => b.def.hub === hub.id).map(b => [b.url, b.updated])]);
for (const [name, urls] of families) write(`sitemap-${name}.xml`, sm(urls));
write('sitemap.xml', `<?xml version="1.0" encoding="UTF-8"?>\n<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${families.map(([n]) => `<sitemap><loc>${SITE}/sitemap-${n}.xml</loc><lastmod>${latest}</lastmod></sitemap>`).join('\n')}\n</sitemapindex>\n`);
write('robots.txt', `# calculator.rest: every crawler, including AI search and assistant crawlers, is welcome\nUser-agent: *\nUser-agent: Googlebot\nUser-agent: Bingbot\nUser-agent: OAI-SearchBot\nUser-agent: ChatGPT-User\nUser-agent: GPTBot\nUser-agent: Claude-SearchBot\nUser-agent: Claude-User\nUser-agent: ClaudeBot\nUser-agent: PerplexityBot\nUser-agent: Perplexity-User\nUser-agent: Applebot\nAllow: /\nDisallow: /*?\n\n# Backlink scrapers\nUser-agent: AhrefsBot\nUser-agent: DataForSeoBot\nUser-agent: SERankingBacklinksBot\nDisallow: /\n\nSitemap: ${SITE}/sitemap.xml\n`);
// llms.txt: plain-text facts and every tool's worked answer, for answer engines (AI search, assistants)
{
  const plain = x => String(x ?? '').replace(/<[^>]+>/g, '').replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;|&rsquo;/g, "'").replace(/\s+/g, ' ').trim();
  const facts = [
    '401(k), 403(b) and governmental 457(b) employee deferral limit: $24,500; catch-up at 50+: $8,000; ages 60–63: $11,250.',
    'IRA and Roth IRA contribution limit: $7,500; catch-up at 50+: $1,100.',
    'Roth IRA MAGI phase-out: $153,000–$168,000 single, $242,000–$252,000 married filing jointly.',
    'Social Security PIA formula: 90% of the first $1,286 of AIME, 32% up to $7,749, 15% above. Full retirement age is 67 for anyone born 1960 or later.',
    'Up to 85% of Social Security is taxable; provisional income thresholds $25,000/$34,000 single, $32,000/$44,000 married filing jointly.',
    'Senior deduction (2025–2028): $6,000 per person 65+, phasing out above $75,000 MAGI single / $150,000 joint.',
    'RMDs start at 73 (75 if born 1960 or later). RMD = Dec 31 balance ÷ IRS Uniform Lifetime Table divisor (26.5 at 73, 24.6 at 75, 20.2 at 80).',
    'Early withdrawals from a 401(k) or IRA before 59½ usually owe a 10% additional tax on top of income tax; 401(k) cash-outs have 20% mandatory federal withholding.',
    '4% rule: a first-year withdrawal of 4% of savings, raised for inflation, means a nest egg of 25 × yearly spending.'
  ];
  const groups = hubs.map(h => [h, built.filter(b => b.def.hub === h.id)]).filter(([, l]) => l.length);
  write('llms.txt', `# ${BRAND}\n\n> Free US retirement calculators that run your own numbers and show the formula: how long savings last, safe withdrawals, Monte Carlo odds, 401(k), 403(b), 457(b), Roth IRA, RMDs, Social Security and retirement taxes. Figures are for ${YEAR}; sources are the IRS and SSA. No sign-up; nothing entered is stored.\n\n## ${YEAR} retirement figures\n${facts.map(f => '- ' + f).join('\n')}\n\n${groups.map(([h, l]) => `## ${h.name}\n${l.map(b => `- [${b.def.name}](${b.url}): ${plain(b.quick)}`).join('\n')}`).join('\n\n')}\n\n## About\n- [Methodology](${SITE}/methodology): how calculators are built and checked\n- [About](${SITE}/about)\n`);
}
write('urls.txt', [SITE + '/', ...hubPages.map(h => h.url), ...staticPages.map(s => s.url), ...built.map(b => b.url)].join('\n') + '\n');
console.log(`Wrote ${totalPages} pages to dist/`);
