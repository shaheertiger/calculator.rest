# Writing a calculator page for calculator.rest

Each calculator is one ES module: `content/calculators/<slug>.mjs`. The build (`build.mjs`) turns it into a
static, server-rendered page with the working tool, the default answer already in the HTML, JSON-LD and sitemaps.

**Read these two finished examples first and match their depth and tone:**
- `content/calculators/how-long-will-money-last-calculator.mjs` (simulation, year-by-year table, long hot page)
- `content/calculators/rmd-calculator.mjs` (IRS table in `data`, computed table)

The page list, hubs and primary keywords are in `content/plan.tsv` (slug, hub, name, keyword, notes).
Real search queries are in the keyword CSV (path given in your task). Grep it for your topic to find the
follow-up questions people actually ask; use them for H2s and FAQs.

## Page template (modeled on the best-ranking calculator pages, e.g. bank/broker tax calculators)

Every page follows the same layout. The build renders it; you supply the content fields.

1. **SEO title and H1 are generated:** title = `2026 {name} | calculator.rest`, H1 = `2026 {name}`. Do not set
   `title` or `h1` in the module (delete them if present). Make `name` read well after "2026 ".
2. **Meta (110–160 chars), template style:** `Estimate … with our free … calculator. See your A, B and C.`
   Name the concrete outputs the tool shows. Never repeat the title.
3. **`intro` (one or two sentences under the H1):** "Plug in … and we'll show you …". Plain, no numbers needed.
4. **Calculator:** every input has a `help` line (one sentence: what to enter, where to find it). It is shown
   between the label and the box. Defaults are a realistic example.
5. **Results panel ("Your results"):** the big value + `rows`. Add `notes: { 'Row label': 'one-line meaning' }`
   so every row explains itself ("Total tax divided by total income."). Keys must equal the row label text
   (HTML stripped). Rows whose label contains numbers can't be matched; give those a fixed label instead.
6. **Summary:** the build shows `quick` (40–70 words, the answer for the defaults with numbers, must match
   compute exactly) as the Summary paragraph; in the browser it is replaced by `r.sub` after edits, so `sub`
   must be a complete sentence that reads well alone. `assumptions`: one or two sentences on what the
   estimate assumes, shown under the Summary.
7. **Article order (rendered by the build):** reference `table` (H2 is a question; computed rows) → formula
   (`formulaTitle` "How is X calculated?" + `formula` + `example`) → `sections` → "Explore other retirement
   calculators" (automatic: `related` first, then the hub) → "FAQs" → sources.
8. **`sections` (4–7):** H2s are real searcher questions or explainer topics. Use H3 subsections inside `html`
   like the template: the first section should usually be **"Understanding your inputs"** with one `<h3>`
   per input explaining what to enter and the common mistake; later sections group related concepts
   ("Other income to understand in retirement" → H3 per concept). No `steps` (delete if present; fold the
   useful content into the inputs section).
9. **FAQs: 10–15**, real questions from the keyword CSVs / People Also Ask, answer in the first sentence with
   a number where possible. Numbers must come from running compute.
10. **Truthful sources:** money/tax pages cite official sources (IRS, SSA, CMS, BLS, CFPB, investor.gov).
    Only URLs you are confident exist. Use 2026 figures. Never invent credentials, testing, statistics.
11. **One query, one page:** don't duplicate a sibling's job; link to it. The build fails at > 35% shared
    5-word phrases within a hub.
12. **US formatting:** `$1,234.56`, dates "Nov 13, 2026".

Reference page already converted to this template:
`content/calculators/how-long-will-money-last-calculator.mjs` — match its structure.

## Module shape

```js
export default {
  slug: 'overtime-calculator',            // = filename, from plan.tsv
  hub: 'pay',                             // from plan.tsv
  name: 'Overtime Calculator',            // short name used in links/cards
  meta: '…',  intro: '…',              // title/h1 are generated: "2026 {name}"
  keyword: 'how to calculate overtime',   // primary query from plan.tsv (must be unique)
  also: ['overtime pay calculator', …],   // other real queries from the CSV this page owns
  updated: '2026-11-13',
  inputs: [ … ],                          // see below; defaults = a realistic example
  data: { … },                            // optional JSON data (tables) passed to compute as 3rd arg
  compute(v, H, D) { … return { value, label, expr, rows, sub, table } },
  notes: { 'Row label': 'what it means' }, // one line per result row
  assumptions: '…',                       // shown under the Summary
  quick: ({ v, r, H, D, run }) => `…`,    // Summary text for the defaults; build-time only; HTML string
  formulaTitle: 'What is the overtime formula?', // optional
  formula: { expr: 'HTML', vars: [['symbol','meaning'], …], note: 'optional HTML' },
  example: 'HTML worked example with real numbers',
  table: { title: 'Question-style H2?', intro: '…', head: ['…'], rows: ({ run, H, D, v }) => [[…], …], note: '…' },
  sections: [{ h2: 'Understanding your inputs', html: '<p>…</p><h3>…</h3><p>…</p>' }, …],   // 4–7, H3s inside
  faq: [{ q: '…?', a: 'Answer in the first sentence…' }, …],   // 10–15, plain text or simple HTML
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
