# Writing a calculator page for calculator.rest

Each calculator is one ES module: `content/calculators/<slug>.mjs`. The build (`build.mjs`) turns it into a
static, server-rendered page with the working tool, the default answer already in the HTML, JSON-LD and sitemaps.

**Read these two finished examples first and match their depth and tone:**
- `content/calculators/tip-calculator.mjs` (simple inputs, computed table)
- `content/calculators/gpa-calculator.mjs` (repeatable rows input, `data`, long hot page)

The page list, hubs and primary keywords are in `content/plan.tsv` (slug, hub, name, keyword, notes).
Real search queries are in the keyword CSV (path given in your task). Grep it for your topic to find the
follow-up questions people actually ask; use them for H2s and FAQs.

## The SEO playbook rules you must follow (non-negotiable)

1. **Title (≤ 62 chars):** query first, page type ("Calculator"), then the answer/number/year.
   Good: `Overtime Calculator: Time and a Half on $20/hr Is $30` · `RMD Calculator 2026: IRS Uniform Lifetime Table`.
   The title should carry a real number whenever possible.
2. **Meta (110–160 chars), hand-written:** the answer or a worked number + who it's for. Never repeat the title.
3. **H1:** tool name + the job. Different wording from the title.
4. **Quick answer (40–70 words):** the first line answers the main query with numbers, quotable on its own,
   naming the entity ("A 20% tip on a $64 bill is $12.80…"). It may use `${r.value}` from the default result.
   Must match the default inputs' computed result exactly.
5. **H2s are real searcher questions** (from the CSV / People Also Ask) or the tool's steps. Never label
   headings ("Overview", "Introduction") and never filler like "What is a {X} calculator?".
6. **Something nobody else has:** a computed table (via `table.rows` using `run()`), a benchmark table,
   worked examples with real numbers.
7. **Length from real follow-ups, not filler:** 700–1,300 words of body for most tools; 500–800 for small
   ones; 1,500–2,200 for pages marked HOT in plan.tsv. Every paragraph must answer something.
8. **Truthful sources:** money/tax/health pages must cite official sources (IRS, SSA, CFPB, HUD, BLS, CDC,
   NIH/StatPearls, ACOG, OSHA, NIST, manufacturer data). Only cite URLs you are confident exist; prefer the
   agency's landing page over a deep link you are unsure of. Use 2026 figures where the law sets them
   (see notes in plan.tsv). Never invent credentials, testing, statistics or surveys.
9. **One query, one page:** don't duplicate a sibling's job. Link to it instead. Keep wording distinct
   from sibling pages (the build fails at > 35% shared 5-word phrases within a hub).
10. **US formatting:** `$1,234.56`, `1,000,000`, dates "Nov 13, 2026". (Non-US tools: use that market's
    currency symbol via `H.cur(x, '₹')` etc.)

## Module shape

```js
export default {
  slug: 'overtime-calculator',            // = filename, from plan.tsv
  hub: 'pay',                             // from plan.tsv
  name: 'Overtime Calculator',            // short name used in links/cards
  title: '…',  h1: '…',  meta: '…',
  keyword: 'how to calculate overtime',   // primary query from plan.tsv (must be unique)
  also: ['overtime pay calculator', …],   // other real queries from the CSV this page owns
  updated: '2026-11-13',
  inputs: [ … ],                          // see below; defaults = a realistic example
  data: { … },                            // optional JSON data (tables) passed to compute as 3rd arg
  compute(v, H, D) { … return { value, label, expr, rows, sub, table } },
  quick: ({ v, r, H, D, run }) => `…`,    // build-time only; HTML string
  stepsTitle: 'How to calculate overtime pay',   // optional, default "How to use the {name}"
  steps: ['…', '…', '…'],                 // 3–6 numbered steps (HTML allowed); name the step people get wrong
  formulaTitle: 'What is the overtime formula?', // optional
  formula: { expr: 'HTML', vars: [['symbol','meaning'], …], note: 'optional HTML' },
  example: 'HTML worked example with real numbers',
  table: { title: 'Question-style H2?', intro: '…', head: ['…'], rows: ({ run, H, D, v }) => [[…], …], note: '…' },
  sections: [{ h2: 'Real question?', html: '<p>…</p>' }, …],   // 3–5
  faq: [{ q: '…?', a: 'Answer in the first sentence…' }, …],   // 6–8, answers in plain text or simple HTML
  related: ['slug', 'slug', 'slug'],      // 3–5 true siblings; MUST exist in content/plan.tsv
  sources: [{ name: 'IRS: Topic 409 Capital Gains', url: 'https://www.irs.gov/…' }],
  disclaimer: 'optional one-line note shown under sources (e.g. not medical advice)'
};
```

### Inputs

Defaults (`value`) must be a realistic example; the page's answer and quick answer come from them.

| type | keys |
| --- | --- |
| `number` | `id, label, value, prefix?, suffix?, help?, placeholder?` (`value: ''` = blank → `NaN`) |
| `select` | `id, label, value, options: [['value','Label'], …]` → compute receives the **string** value |
| `text` | `id, label, value, multiline?: true\|rows, placeholder?` (for lists of numbers use `H.list(v.x)`) |
| `date` | `id, label, value: 'YYYY-MM-DD' \| 'today' \| 'today+30' \| 'today-365'` → string `YYYY-MM-DD` |
| `time` | `id, label, value: 'HH:MM'` |
| `checkbox` | `id, label, value: true/false` → boolean |
| `rows` | `id, label, addLabel, max, fields: [{id,label,type,value,options?,blank?,placeholder?}], value: [{…}, …]` → array of objects |

Any input can take `showIf: { otherInputId: ['valueA','valueB'] }` to show only for some select values,
and `wide: true` to span the full width.

### compute(v, H, D) — the rules that matter

- It is **serialized with `.toString()` and shipped to the browser**. It must be self-contained: use only
  `v`, `H`, `D`, `Math`, `Number`, `String`, `Date`, arrays/objects. **No outside variables, no imports,
  no helper functions defined outside it** (define inner functions inside compute, or put data in `data`).
  Write it in ES5-ish style (`var`, `function`) or modern syntax: both are fine.
- Inputs arrive typed: numbers may be `NaN` when blank. Validate and `return { error: 'Plain message.' }`.
- Return strings already formatted: `value` (the big number), `label` (what it is), `expr` (short
  mono line like `$64.00 × 20%`), `rows` (`[[label, value, highlight?], …]`), `sub` (one sentence of
  interpretation), optional `table: { head: [], rows: [[]], caption }` for schedules.
- Never throw. Guard divisions by zero and impossible inputs.

### Helpers `H` (see `src/helpers.js`)

Formatting: `H.money(x, dp=2)`, `H.money0(x)`, `H.cur(x, '₹', dp)`, `H.num(x, maxDp=2)`, `H.fix(x, dp)`,
`H.int(x)`, `H.pct(x, dp)` (x already in percent), `H.sig(x, n)`, `H.dur(minutes)`, `H.ym(months)`,
`H.ord(n)`, `H.plural(n, 'day')`, `H.esc(s)`.
Math/stats: `H.sum, H.mean, H.median, H.mode, H.variance(a, sample), H.sd(a, sample), H.quantile(a,p),
H.gcd, H.lcm, H.round(x,dp), H.clamp, H.solve(f, lo, hi), H.list(text)`,
`H.normCdf, H.normInv, H.tCdf(t,df), H.tInv(p,df), H.chi2Cdf(x,k), H.chi2Inv(p,k), H.fCdf, H.betainc,
H.gammainc, H.gammaln, H.pearson(xs,ys), H.linreg(xs,ys)`.
Finance (positive conventions): `H.pmt(r, n, pv, fv)`, `H.fv(r, n, pmt, pv)`, `H.pvAnn(r, n, pmt)`,
`H.nper(r, pmt, pv)`, `H.npv(r, cfs)` (cfs[0] at t=0), `H.irr(cfs)`,
`H.amort(pv, annualRatePct, months, extraMonthly)` → `{ payment, months, totalInterest, schedule[] }`.
Dates (UTC): `H.today()`, `H.parseDate(s)`, `H.iso(d)`, `H.fmtDate(d, long)`, `H.addDays(d,n)`,
`H.addMonths(d,n)`, `H.daysBetween(a,b)`, `H.ymdDiff(a,b)` → `{y,m,d}`, `H.weekday(d)`, `H.isLeap(y)`.

### quick / table helpers

`quick` and `table.rows` get `{ v, r, H, D, run }`. `run({ bill: 100 })` re-runs compute with some inputs
overridden and returns the result object, which is how tables are computed ("computed data nobody else
has"). Keep tables to 6–15 rows.

## Check your work

```bash
node build.mjs --check --only=slug-one,slug-two
```

It must print `0 errors`. Fix warnings too unless there is a good reason (e.g. a title without a number
where no number makes sense). Also sanity-check numbers: run your compute mentally on the default inputs and
make sure the quick answer, meta, example and FAQ numbers agree with what the tool outputs.
Do not edit `build.mjs`, `src/*`, `plan.tsv` or other agents' files. Do not run `node build.mjs` without
`--check` (others are building concurrently).
