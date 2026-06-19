# Cloudflare Pages Deployment

Updated: 2026-06-19

## Canonical policy

Deployment timing and classification are governed by:

```text
docs/deployment-policy.md
```

## SOG production target

```text
Production branch: main
Framework: Astro
Build command: npm run build
Build output: dist
Pages project: stable-or-gone
Public origin: https://sog.badjoke-lab.com/
```

## Repository workflows

Manual production deployment:

```text
.github/workflows/deploy-production.yml
```

Manual standalone verification:

```text
.github/workflows/production-consistency.yml
.github/workflows/production-smoke.yml
```

All three workflows are manual-only. Normal pull requests and normal `main` merges do not deploy or poll production.

The production workflow requires:

- dispatch from `main`
- deployment classification
- exact `DEPLOY` confirmation
- successful full repository build
- the GitHub `production` environment
- configured Cloudflare credentials

It uploads the prebuilt `dist` directory to the fixed Pages project and then runs production consistency against the deployed commit.

## Cloudflare dashboard controls

The operator must confirm:

```text
Automatic production branch deployments: OFF
Automatic preview branch deployments:    OFF
```

In the Pages project, open branch deployment controls, disable automatic production deployments, set preview branches to None, and save.

## GitHub operator setup

Before the first production run:

1. Create or review the `production` environment.
2. Configure the Cloudflare credentials described in `docs/deployment-policy.md`.
3. Restrict production deployment to `main` where available.
4. Confirm the Pages project name is `stable-or-gone`.
5. Run `Deploy production` once from `main`.
6. Verify the workflow's production-consistency result.

## Equivalent operation

The workflow uses Cloudflare's Wrangler Action to perform the equivalent of:

```text
wrangler pages deploy dist
project: stable-or-gone
branch: main
commit: checked-out main SHA
```

## Retry rule

Do not retry an old deployment after code has changed. Run one new manual deployment from the intended `main` commit.

## Migration state

```text
Repository policy:              implemented
Policy validator:               implemented
Manual deployment workflow:     implemented
Production checks:              manual-only
Cloudflare dashboard controls:  operator confirmation required
First manual deployment:        not yet executed
```

Pending external configuration does not block normal GitHub development.

## Official references

- https://developers.cloudflare.com/pages/configuration/branch-build-controls/
- https://developers.cloudflare.com/pages/configuration/git-integration/
- https://developers.cloudflare.com/pages/how-to/use-direct-upload-with-continuous-integration/
- https://developers.cloudflare.com/workers/wrangler/commands/pages/
