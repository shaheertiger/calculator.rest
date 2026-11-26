# Authoring a calculator page ("show the work" template)

One module per calculator: `content/calculators/<slug>.mjs`, default-exporting an object. The build
(`node build.mjs`) runs `compute()` with the default inputs so the **solved example and its steps are in the
server HTML**, then serializes `compute()` into the page so the same function updates the answer and steps live.
Reference pages: `percentage-calculator.mjs` (three modes) and `car-depreciation-calculator.mjs` (word problems).

Check one page while writing: `node build.mjs --check --only=<slug>`. Every rule marked **(fails)** stops the build.

## The page, top to bottom

1. **Title** `title` (fails if > 60 chars or no digit): the search + a worked number, worded the way the page
   ranked in Search Console. "Percentage Calculator: 30% of 150 = 45 (With Steps)".
2. **H1** = `name`: the tool's name as people search it ("Grade Calculator"). Optional `h1` overrides it.
3. **Answer sentence** `answer: ({ r, v }) => '…'` (fails without a digit or outside 6–40 words): ONE sentence that
   answers the default example, using `r.value`. "30% of 150 is <strong>45</strong>: multiply 150 by 0.30."
4. **The calculator**: `inputs` (≤ 4 visible fields by default so the answer is above the fold on a phone) and
   `compute(v, H)`.
5. **Show the work**: `compute` returns `steps`, an array of HTML strings, rendered as a numbered list (fails if
   < 3 steps, if the first does not start with `<b>Formula:</b>`, or if the last does not start with
   `<b>Answer:</b>`). Order: Formula (letters) → Substitute (the user's numbers) → one step per arithmetic
   operation, in the order a student does them → Answer with units and the rounding rule ("rounded to 2 decimal
   places", "exact, no rounding needed"). Steps must be built from `v`, never hard-coded text.
6. **Key facts** `facts: { formula, vars: [[symbol, meaning]], rounding, note? }` (fails if any of the first three
   are missing).
7. **Worked example** `example: { h2, html }`: one textbook-style word problem written out, ending in an answer
   and a sense check.
8. **Variants** `variants: [{ h2, html }]` (fails unless 2–3): H2s worded the way people search
   ("What is 30% of 150?", "How do you find the percentage of a number?"), each answered in the first sentence.
9. **Common mistakes** `mistakes: [html]` (fails unless 2–5): real errors students make with this formula.
10. **Related calculators** `related: [slug]` (fails unless 3–5, all existing indexable calculators).
11. **FAQs** `faq: [{ q, a }]` (fails unless 3–5). Rendered as FAQPage schema.
12. `sources: [{ name, url }]`: only pages you opened that state the formula (OpenStax, Wolfram MathWorld, NIST
    SP 811 for units). No source is better than a decorative one.

Also required: `slug`, `hub` (`everyday`, `school`, `math`, `science`), `keyword` (the main query), `meta`
(110–160 chars, leads with the worked example's numbers), `updated` (YYYY-MM-DD of the last real edit).

## Hard rules

- **600–1,100 words (fails)**, counted over the answer sentence, the default result and steps, Key facts,
  example, variants, mistakes, related links and FAQs.
- **≤ 30% text overlap with any other calculator (fails)**, measured as name-masked 5-gram overlap.
- **No page per numeric variant (fails)**: no digits in slugs, no two pages with the same `compute`. "What is 30%
  of 150?" is an H2 on the percentage page, never its own page.
- No filler: no "What is a calculator", no generic intro, no history of the formula, no testing or credential
  claims. Use "math" in body copy (US searchers); pages target US queries.
- `compute` must be self-contained (it is serialized into the page): no variables from module scope; use `H`
  helpers (`H.num(x, dp)`, `H.round(x, dp)`, `H.pct`, `H.money`, `H.plural`, `H.mean`, `H.gcd`…, see
  `src/helpers.js`).
- Every number in the prose must match what the calculator gives for those inputs. Work each one out with the
  calculator before publishing.
- Retirement modules (hubs `income`, `planning`, `rules`) use the old template, are `noindex,follow`, out of the
  sitemap and linked only from `/retirement`. They can return to the index only with a credentialed reviewer
  (CFP/CPA) set in `reviewer: { name, credential, url, date }`; that is an owner decision, not an authoring one.

## Site-level checks (fail the build)

≤ 45 indexable URLs; ≤ 5 hubs and none with fewer than 2 calculators; canonical on https://calculator.rest;
lastmod values must not all be identical unless they are all the release date (2026-11-26); no future dates.
