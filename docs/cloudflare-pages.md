# Cloudflare Pages Deployment

## Current production branch

Use `main`.

## Build settings

```txt
Framework preset: Astro
Build command: npm run build
Build output directory: dist
Root directory: /
```

## Important deployment note

Do not retry an old failed deployment when code has changed.

Retrying an old deployment rebuilds the same old commit. Create or wait for a new deployment from the latest `main` commit instead.

## Production consistency recovery — 2026-06-19

The public consistency repair was merged through PR #59 and its reserve-context validator follow-up through PR #62. A GitHub-hosted runner reproduced the exact Cloudflare build command successfully, but production still reported commit `bb5f762cc7555108b28678395362d529ec26f90d` instead of the repaired main commit `822e9650d2ba3b559ea986742728291c892a6f76`.

This documentation update intentionally creates a new `main` push so Cloudflare Pages Git integration can create a fresh production deployment from the latest repository state. After merge, production must be verified with `npm run check:production`; the deployed commit, HTML counts, JSON counts, sitemap counts, metadata, and obsolete 16/20/23 markers must all pass.
