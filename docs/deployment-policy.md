# Deployment Policy

Updated: 2026-06-22

## Status

This file is the canonical deployment policy for Stable or Gone.

```text
Manual publication architecture: operational
First controlled deployment: PASS
Workflow run: 27908380603
Source commit: 1aa87b0ca8251eea651af74f2af80f30c791e39c
Pages project: stable-or-gone
Public origin: https://sog.badjoke-lab.com/
```

All deployment decisions, pull-request classifications, Cloudflare settings, production workflows, and verification rules must follow this file. `AGENTS.md`, `README.md`, `docs/cloudflare-pages.md`, pull-request templates, workflows, audits, and roadmaps may summarize this policy but must not contradict it.

## Core principle

Development and production publication are separate processes.

```text
Development completion
= source changes complete
+ repository validation complete
+ GitHub CI successful

Production publication completion
= deliberate manual deployment
+ deployed commit confirmed
+ production consistency successful
```

Cloudflare Pages availability, queue length, or deployment completion must not block ordinary repository development.

## Source-of-truth architecture

```text
latest intended main
→ manual GitHub Actions dispatch
→ install dependencies
→ npm run build
→ upload prebuilt dist with Wrangler
→ verify the public origin against the deployed commit
```

Cloudflare receives prebuilt assets. It is not the routine build system for branches, pull requests, or ordinary `main` merges.

## Pull-request deployment classifications

Every pull request must select exactly one classification.

### No production deployment required

Default for normal development, data enrichment, validation, documentation, roadmaps, workflows, and non-emergency corrections that can wait for the next checkpoint.

Completion condition:

```text
GitHub CI successful
```

Cloudflare is not checked and production is not polled.

### Publication checkpoint deployment required after merge

Use for planned public releases, canonical count-growth checkpoints, phase-completion releases, or bundled corrections that should become visible together.

Completion condition:

```text
PR merged
→ intended main manually deployed
→ deployed commit confirmed
→ production consistency successful
```

### Emergency production deployment required

Use only for a broken public site, missing or corrupt public files, materially incorrect public data already visible to users, a security issue, rollback, or urgent repair.

The reason and deployed commit must be recorded.

## Cloudflare dashboard policy

The required Cloudflare Pages settings are:

```text
Production branch: main
Automatic production branch deployments: OFF
Automatic preview branch deployments: OFF
Build cache: ON
Build command: npm run build
Build output: dist
Build watch paths: *
```

The Git repository connection may remain attached. Automatic Git-triggered Pages builds remain disabled, while prebuilt assets are uploaded directly with Wrangler.

## GitHub production controls

Required repository secrets:

```text
CLOUDFLARE_API_TOKEN
CLOUDFLARE_ACCOUNT_ID
```

The API token must be limited to the designated Cloudflare account and the Pages edit permission required for deployment.

Required environment:

```text
Name: production
Allowed deployment branch: main
Required reviewers: none
Wait timer: none
Environment secrets: none required
```

Repository secrets are consumed by the deployment job running in the `production` environment.

Secrets must never be written to repository files, PR bodies, issues, workflow output, or public documentation.

## Workflow policy

### Normal CI

Normal CI may install dependencies, validate canonical data, run integrity checks, run Astro checks, build the site, and verify generated files locally.

Normal CI must not:

- call `wrangler pages deploy`
- wait for Cloudflare Pages
- poll production for a new deployment
- require Cloudflare credentials

### Production consistency workflows

Production consistency is manual-only. It may run after a manual deployment, an operator-requested verification, or an emergency repair.

It must not run automatically on every `main` push.

### Manual production deployment workflow

`.github/workflows/deploy-production.yml` must:

- use `workflow_dispatch`
- require an explicit deployment classification
- require exact `DEPLOY` confirmation
- run only from `main`
- check out the latest intended `main`
- install dependencies and run the full repository build
- upload `dist` with Wrangler
- pass the source commit SHA to the deployment
- run production consistency after deployment
- write a deployment summary
- use the `production` environment
- use concurrency control to prevent overlapping deployments

It must not have `push`, `pull_request`, or `schedule` triggers.

## Publication frequency

```text
normal PR                         no deployment
normal main merge                 no deployment
several quality PRs               bundle into one later deployment
planned checkpoint                one manual deployment
verified emergency                one immediate manual deployment
```

Short-interval repeated deployments and no-op trigger commits are prohibited.

## Canonical count-growth gates

The following checkpoints require one manual publication and full production parity before the next growth batch begins:

```text
75 → 80
80 → 85
85 → 90
90 → 95
95 → 100
```

The 70 → 75 gate and initial manual-publication activation are complete.

At every remaining gate verify:

- deployed commit equals the intended `main` commit
- homepage counts match generated JSON and manifests
- stablecoin, organization, and event counts match canonical data
- detail-link counts match canonical counts
- sitemap route counts match canonical counts
- canonical, hreflang, metadata, Open Graph, and JSON-LD checks pass
- obsolete count markers are absent
- production has no material errors

A failed gate blocks the next count-growth batch. It does not invalidate unrelated completed quality work.

## Retry and rollback rules

Do not retry an old failed deployment after code has changed. An old run republishes the old commit.

Instead:

1. confirm the intended `main` commit
2. fix the repository if needed
3. run one new manual deployment from the intended commit
4. verify production

Use rollback only when a previously successful deployment is the correct emergency recovery target.

## Reporting requirements

A production deployment report must include:

- deployment classification
- source commit SHA
- workflow run result
- Cloudflare Pages project
- public origin checked
- production consistency result
- any remaining discrepancy

A normal no-deploy PR report should state only that production deployment was not required under this policy.

## Completed activation checklist

- [x] automatic production deployments disabled in Cloudflare Pages
- [x] automatic preview deployments disabled in Cloudflare Pages
- [x] Pages project confirmed as `stable-or-gone`
- [x] least-privilege Cloudflare API token created
- [x] `CLOUDFLARE_API_TOKEN` added to GitHub Repository Secrets
- [x] `CLOUDFLARE_ACCOUNT_ID` added to GitHub Repository Secrets
- [x] GitHub `production` environment created
- [x] deployment branch restricted to `main`
- [x] manual deployment workflow executed successfully
- [x] deployed production verified successfully

Activation evidence:

```text
Workflow run: 27908380603
Job: 82581060887
Audit: docs/audits/manual-production-activation-2026-06-22.md
```

## Official Cloudflare references

- Branch deployment controls: https://developers.cloudflare.com/pages/configuration/branch-build-controls/
- Git integration: https://developers.cloudflare.com/pages/configuration/git-integration/
- Direct Upload with CI: https://developers.cloudflare.com/pages/how-to/use-direct-upload-with-continuous-integration/
- Wrangler Pages commands: https://developers.cloudflare.com/workers/wrangler/commands/pages/
