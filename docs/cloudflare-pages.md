# Cloudflare Pages Deployment

Updated: 2026-06-22

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
- a deployment classification
- exact `DEPLOY` confirmation
- a successful full repository build
- the GitHub `production` environment
- configured Cloudflare repository secrets

It uploads the prebuilt `dist` directory to the fixed Pages project and then runs production consistency against the deployed commit.

## Cloudflare dashboard controls

Configured state:

```text
Automatic production branch deployments: OFF
Automatic preview branch deployments:    OFF
Build cache:                              ON
Build watch paths:                        *
```

The Git repository connection remains attached, but Git pushes do not trigger Pages builds. Publication occurs through Wrangler direct upload only.

## GitHub operator setup

Configured state:

```text
Repository secrets:
- CLOUDFLARE_API_TOKEN
- CLOUDFLARE_ACCOUNT_ID

Environment:
- production
- deployment branch: main
- required reviewers: none
- wait timer: none
```

The Cloudflare token is account-scoped and limited to the Pages edit permission required by the deployment workflow.

## Equivalent operation

The workflow performs the equivalent of:

```text
wrangler pages deploy dist
project: stable-or-gone
branch: main
commit: checked-out main SHA
```

## First controlled deployment

```text
Result: PASS
Workflow run: 27908380603
Job: 82581060887
Source commit: 1aa87b0ca8251eea651af74f2af80f30c791e39c
Deployment classification: publication-checkpoint
Public origin: https://sog.badjoke-lab.com/
```

The run completed the full repository build, uploaded the prebuilt site to Cloudflare Pages, verified production, and wrote the deployment summary.

Audit:

```text
docs/audits/manual-production-activation-2026-06-22.md
```

## Retry rule

Do not retry an old deployment after code has changed. Run one new manual deployment from the intended `main` commit.

## Operational state

```text
Repository policy:              implemented
Policy validator:               implemented
Manual deployment workflow:     operational
Production checks:              manual-only and operational
Cloudflare dashboard controls:  configured
GitHub credentials:             configured
GitHub production environment:  configured
First manual deployment:        passed
```

Normal GitHub development does not depend on Cloudflare availability. Production publication is performed only at planned checkpoints or verified emergencies.

## Official references

- https://developers.cloudflare.com/pages/configuration/branch-build-controls/
- https://developers.cloudflare.com/pages/configuration/git-integration/
- https://developers.cloudflare.com/pages/how-to/use-direct-upload-with-continuous-integration/
- https://developers.cloudflare.com/workers/wrangler/commands/pages/
