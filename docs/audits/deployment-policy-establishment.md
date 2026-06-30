# Deployment Policy Establishment Audit

Updated: 2026-06-19

## Scope

This audit records the repository-side establishment of the Stable or Gone deployment policy.

## Implemented controls

- `AGENTS.md` is the mandatory work entry point.
- `docs/deployment-policy.md` is the canonical policy.
- the pull request template requires a deployment classification.
- the former deployment-policy text validator has been retired.
- `npm run build` validates guide metadata and builds the publishable Astro site.
- `deploy-production.yml` runs automatically on `main` pushes and can be manually dispatched as fallback only.
- normal pull requests do not poll or wait for Cloudflare Pages; merged `main` commits publish through the production workflow.
- README, Cloudflare documentation, and the roadmap point to the canonical policy.

## Validation result

The guide validator and publishable-site build now represent the routine production build path.

## Remaining operator work

Repository code cannot change the Cloudflare dashboard or create secret values. The following remain external operator actions:

- disable automatic production deployments in Cloudflare Pages
- disable automatic preview deployments in Cloudflare Pages
- confirm the Pages project name
- add the required Cloudflare secrets to GitHub
- run the future manual deployment workflow once

## Next repository work

Add `.github/workflows/deploy-production.yml` as a manual-only Wrangler deployment workflow.
