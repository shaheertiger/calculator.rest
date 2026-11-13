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

## How this follows the SEO playbook (v4, Nov 13 2026)

| Playbook rule | Where it is enforced |
| --- | --- |
| 1. One page per real search, gated by demand | `content/plan.tsv` built from the US keyword export; low-volume ideas were cut |
| 2. Never multiply one answer | Build fails at > 35% name-masked 5-gram overlap within a hub (warns at 25%) and on duplicate primary keywords; warns when two pages claim the same query |
| 3. No news, blogs, changelogs, filler explainers | Only tool pages, hubs, About, Methodology, Privacy; build flags "What is a … calculator?" headings |
| 4–6. Title = query + page type + number; hand-written meta; first line answers with numbers | Build checks title length/number, meta length and uniqueness, and that the quick answer contains a number computed from the tool |
| 7. H2s are questions or steps | Authoring spec; numbered steps + question sections |
| 8. Something nobody else has | Every page has a table computed by its own calculator (`table.rows` uses `run()`) and hubs list every tool's example answer |
| 9–10. The tool itself, in the server HTML, light page | Default answer, inputs and FAQ answers are in the raw HTML; one shared ~8 KB gzipped script; inline CSS; no images on tool pages |
| 11. Follow-ups only | Word targets: 500–800 small, 800–1,500 main, 1,500–2,200 HOT (build warns) |
| 13. Source, date, maker, truthfully | Sources on every page, `updated` date set by hand (never the build day), Methodology + About pages; build warns on testing claims |
| 14. YMYL trust bar | Money pages cite IRS/SSA/CFPB/HUD/BLS figures; health pages cite the original equation and CDC/NIH/ACOG and carry a disclaimer; optional `reviewer` field renders a named credentialed reviewer + `reviewedBy` schema |
| 17. Hubs, ≤ 3 clicks | 15 hubs with a table of every child and its computed answer; homepage links every calculator |
| 18. Market formatting | US `$1,000,000` formats; build fails on `$1.000.000` |
| 19 / Bing | IndexNow after every production deploy (changed URLs only), named AI crawlers allowed in robots.txt, year in tax titles |
| Technical setup | Apex host + www 308, canonical = live URL, `Disallow: /*?`, one sitemap per hub with honest lastmod, one JSON-LD graph per page |

## After launch (weekly routine from the playbook)

- **Day 1:** verify Search Console and Bing Webmaster Tools, submit the sitemap, enable Vercel Web Analytics,
  make sure no Vercel bot/attack challenge is shown to Googlebot, Bingbot or AI crawlers. Set up the
  `hello@calculator.rest` mailbox used on the About page.
- **Weekly:** check which engine sends visits (Google vs Bing); pages with rising impressions but flat clicks
  get a new title, meta and first line only; answer new 8+ word Bing queries on the page that owns them.
- **Every January:** update tax, retirement and benefit figures (brackets, limits, bend points) and the
  `updated` dates of the pages you changed.
- **Day 90:** prune or merge any calculator with zero impressions; add sections and sibling links to pages
  sitting at positions 4–10 with 1K+ volume. Zero link budget for the first 90 days, then 50–100 legitimate
  homepage links (directories, honest forum answers, roundups).
- **YMYL:** adding a real, credentialed reviewer (`reviewer: { name, credential, url, date }`) to health and
  money pages is the single biggest trust upgrade available.
