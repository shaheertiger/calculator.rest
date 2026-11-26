# Bing Webmaster Tools export: not available (2026-11-26)

No Bing data could be pulled for this release:

- No Bing Webmaster API key is set in this environment (no `BING_*` variables exist), and
- no Bing export was uploaded.

To complete Phase 0 for Bing, export from Bing Webmaster Tools → Search Performance → Pages and Keywords
(date range: Nov 13 – today) and drop the two CSVs in this folder. `research/phase0-rank.mjs` can be pointed at a
folder with the same `Pages.csv` / `Queries.csv` column layout (rename Bing's columns to
`Top pages,Clicks,Impressions,CTR,Position` and `Top queries,Clicks,Impressions,CTR,Position`).

The launch set in `docs/reset-2026-11.md` is therefore based on Google Search Console only.
