# Cloudflare Pages Deployment

## Production configuration

```text
Production branch: main
Framework preset: Astro
Build command: npm run build
Build output directory: dist
Root directory: /
Custom domain: sog.badjoke-lab.com
```

## Deployment rule

Do not retry an old failed deployment when code has changed.

Retrying an old deployment rebuilds the same old commit. Create or wait for a new deployment from the latest `main` commit instead.

## Production consistency recovery — 2026-06-19

The public consistency repair was merged through PR #59 and its reserve-context validator follow-up through PR #62. PR #64 created a fresh `main` push intended to retrigger Cloudflare Pages.

The repository build, public consistency checks, and production checker are implemented. Production verification is now scheduled as a mandatory gate when the canonical asset count changes:

```text
70 → 75
75 → 80
80 → 85
85 → 90
90 → 95
95 → 100
```

At each gate run `npm run check:production` with `SOG_EXPECTED_COMMIT` set to the latest merged `main` commit. The next growth batch must not start until deployed commit, HTML counts, JSON counts, sitemap counts, metadata, and obsolete-marker checks all pass.

Issue #66 remains open until the production parity sequence is confirmed. It is a deferred verification item and does not block 70-record quality work.
