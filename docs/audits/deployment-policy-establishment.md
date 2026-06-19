# Deployment Policy Establishment Audit

Updated: 2026-06-19

## Scope

This audit records the repository-side establishment of the Stable or Gone deployment policy.

## Implemented controls

- `AGENTS.md` is the mandatory work entry point.
- `docs/deployment-policy.md` is the canonical policy.
- the pull request template requires a deployment classification.
- `scripts/validate-deployment-policy.mjs` checks policy references and workflow triggers.
- `npm run build` runs deployment-policy validation.
- `production-consistency.yml` is manual-only.
- the legacy `production-smoke.yml` is manual-only.
- normal pull requests and normal `main` merges do not poll or wait for Cloudflare Pages.
- README, Cloudflare documentation, and the roadmap point to the canonical policy.

## Validation result

The policy validator and full repository build completed successfully after the legacy automatic production-smoke triggers were removed.

## Remaining operator work

Repository code cannot change the Cloudflare dashboard or create secret values. The following remain external operator actions:

- disable automatic production deployments in Cloudflare Pages
- disable automatic preview deployments in Cloudflare Pages
- confirm the Pages project name
- add the required Cloudflare secrets to GitHub
- run the future manual deployment workflow once

## Next repository work

Add `.github/workflows/deploy-production.yml` as a manual-only Wrangler deployment workflow.
