# calculator.rest

Calculators that show the work, for school and everyday math. Every page solves the reader's exact numbers step
by step, the way a teacher would: formula → substitution → each arithmetic step → answer with units and the
rounding rule. 24 calculator pages in 4 hubs, built as plain static HTML by a zero-dependency Node script and
deployed on Vercel.

The Nov 2026 reset that produced this scope (data, launch set, rollout rules) is in
[`docs/reset-2026-11.md`](docs/reset-2026-11.md). **Read it before adding or changing pages.**

## How it works

- `content/calculators/<slug>.mjs`: one module per calculator: inputs, `compute()` (returns the answer **and**
  the steps), the answer sentence, Key facts, a worked example, 2–3 search-worded variants, common mistakes,
  related tools and FAQs. See `content/AUTHORING.md` for the spec.
- `build.mjs` imports every module, runs `compute()` with the default inputs so **the solved example and its steps
  are in the server HTML**, renders pages, JSON-LD (WebApplication + FAQPage + BreadcrumbList), hubs, homepage,
  one sitemap of indexable URLs, robots.txt and llms.txt, and runs the build checks.
- `compute()` is serialized into each page, so the same function updates the answer and the steps live in the
  browser (`src/runtime.js` + `src/helpers.js` + `src/render.js`).
- Retirement calculators (hubs `income`, `planning`, `rules` in `src/hubs.mjs`, marked `retired`) are kept live
  but `noindex,follow`, out of the sitemap and linked only from `/retirement`.

## Commands

```bash
node build.mjs                          # build to dist/ (fails on any check error)
node build.mjs --check --only=a,b       # check specific calculators without writing
node scripts/serve.mjs                  # preview dist/ at http://localhost:4173 with clean URLs
node scripts/indexnow.mjs --dry-run     # show the IndexNow release list (scripts/indexnow-release.txt)
node research/phase0-rank.mjs <dir>     # re-run the Phase 0 ranking (see docs/reset-2026-11.md)
```

## Build checks (fail the build)

- indexable URLs ≤ 45; ≤ 5 hubs; no hub with fewer than 2 calculators
- every indexable calculator: title ≤ 60 chars with a worked number, a one-sentence answer with a number, a
  server-rendered solved example with ≥ 3 steps (first "Formula", last "Answer"), Key facts, a worked example,
  2–3 variants, 2–5 mistakes, 3–5 related, 3–5 FAQs
- 600–1,100 words per calculator
- no two calculators with more than 30% text overlap (name-masked 5-grams)
- no page for a single numeric variant (no digits in indexable slugs, no duplicate `compute()`, no names that
  differ only by numbers)
- lastmod values not all identical, except the 2026-11-26 release date; no future dates; canonical on the apex
  host

## Deploy (Vercel)

`vercel.json` sets the build command, `dist` output, clean URLs, cache headers, www → apex 308, and 301s from the
three old retirement hubs to `/retirement`. Pre-pivot URLs outside the launch set return 404 on purpose (no
redirects to the homepage).

IndexNow runs from `.github/workflows/indexnow.yml` after a production deploy, and submits
`scripts/indexnow-release.txt` **only if that file changed in the deployed commit**. Ordinary deploys submit
nothing. To announce new pages later, replace the list with just those URLs in the same PR.

## After launch

Follow the rollout plan in `docs/reset-2026-11.md`: no structural changes in weeks 1–8; only titles, metas and
first sentences of pages at #8–20 with impressions and no clicks (max 3 a week, logged with dates); from month 3,
5–10 new calculators a month, only for queries already showing impressions. Never re-pivot the topic.
