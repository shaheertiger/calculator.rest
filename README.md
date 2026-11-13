# calculator.rest

Free calculators that show their formula. ~290 calculator pages + 15 category hubs, built as plain static
HTML by a zero-dependency Node script and deployed on Vercel.

## How it works

- `content/calculators/<slug>.mjs`: one module per calculator: inputs, a `compute()` function, the
  quick answer, steps, formula, worked example, computed table, question sections, FAQ, related tools and
  sources. See `content/AUTHORING.md` for the full spec and SEO rules.
- `build.mjs`: imports every calculator, runs `compute()` with the example inputs so **the answer is in the
  server HTML**, renders the page, the JSON-LD graph (WebApplication + HowTo + FAQPage + BreadcrumbList +
  Organization), hub pages, homepage, sitemaps (one per category), robots.txt, and runs the build checks.
- `compute()` is serialized into each page, so the same function powers the live tool in the browser
  (`src/runtime.js` + `src/helpers.js`, ~8 KB gzipped, shared and cached).
- `content/plan.tsv`: the page plan: slug, hub, name, primary keyword, notes.

## Commands

```bash
node build.mjs                       # build to dist/ (fails on any check error)
node build.mjs --check --only=a,b    # check specific calculators without writing
node scripts/serve.mjs               # preview dist/ at http://localhost:4173 with clean URLs
node scripts/indexnow.mjs            # after a production deploy: submit all URLs to IndexNow
```

## Build checks (fail the build)

Duplicate titles / metas / H1s / primary keywords, meta equal to title, titles over 66 characters, metas
outside 100–170 characters, a quick answer without a number, fewer than 5 FAQs or 2 question sections,
`compute()` that errors on its example inputs or can't run in isolation, related links to unknown pages,
money/health pages without sources, and more than 35% name-masked 5-gram overlap between pages in the
same hub.

## Deploy (Vercel)

1. Import this repository in Vercel. `vercel.json` sets the build command (`node build.mjs`), output
   directory (`dist`), clean URLs, cache headers and the www → apex redirect.
2. Add the domain `calculator.rest` (apex) and `www.calculator.rest` (redirects to apex).
3. Verify the site in Google Search Console and Bing Webmaster Tools, submit
   `https://calculator.rest/sitemap.xml`, then run `node scripts/indexnow.mjs`.
