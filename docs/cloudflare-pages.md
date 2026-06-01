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

## Last trigger

This file exists to document Cloudflare Pages settings and to force a fresh Pages deployment after fixing the Astro empty JSON typing issue.

Updated: 2026-06-01
