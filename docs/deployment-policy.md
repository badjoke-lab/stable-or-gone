# Deployment Policy

Updated: 2026-06-28

## Status

This file is the canonical deployment policy for Stable or Gone.

```text
Manual publication architecture: operational
First controlled deployment: PASS
Workflow run: 27908380603
Source commit: 1aa87b0ca8251eea651af74f2af80f30c791e39c
Pages project: stable-or-gone
Public origin: https://sog.badjoke-lab.com/
Current publication state: paused during the quality and UI repair programs
```

All deployment decisions, classifications, Cloudflare settings, production workflows, audits, and roadmaps must follow this file. Document authority and change control are defined in `docs/spec-governance.md`.

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

Cloudflare availability or queue length must not block ordinary repository development.

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

Every PR selects exactly one classification.

### No production deployment required

Default for documentation, data enrichment, quality audits, taxonomy work, UI implementation, validators, monitoring-candidate workflows, roadmaps, and non-emergency corrections.

Completion condition:

```text
GitHub CI successful
```

Cloudflare is not checked and production is not polled.

### Publication checkpoint deployment required after merge

Use only when `docs/roadmap.md` defines a planned public release and the owner explicitly approves the exact candidate.

Completion condition:

```text
PR merged
→ intended main manually deployed
→ deployed commit confirmed
→ production consistency successful
```

### Emergency production deployment required

Use only for a broken public site, corrupt public files, materially incorrect public data already visible, a security issue, rollback, or another verified emergency. Record the reason, source commit, workflow run, and verification result.

## Current publication gate

As of 2026-06-28, routine publication is paused while SOG performs the non-UI quality program and defers detailed UI review.

Binding documents:

```text
docs/roadmap.md
docs/quality/non-ui-quality-program.md
docs/ui-redesign/implementation-plan.md
```

No release candidate is currently selected. The later roadmap must explicitly choose and define one publication path after the quality program and deferred UI gates:

```text
repaired 92-record release
or
reviewed growth path toward 100 before release
```

Neither path is authorized yet. Documentation, data, monitoring, validation, migration, UI, audit, and normal `main` merges do not deploy to production.

A verified emergency may interrupt the sequence, but it must not be used to publish unfinished redesign or quality work.

## Cloudflare dashboard policy

Required settings:

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

The API token must be limited to the designated account and the Pages edit permission required for deployment. Secrets must never be written to repository files, PR bodies, issues, workflow output, or public documentation.

Required environment:

```text
Name: production
Allowed deployment branch: main
Required reviewers: none
Wait timer: none
Environment secrets: none required
```

## Workflow policy

Normal CI may install dependencies, validate canonical data, run integrity checks, run Astro checks, build the site, and verify generated files locally.

Normal CI must not:

- call `wrangler pages deploy`;
- wait for Cloudflare Pages;
- poll production for a new deployment;
- require Cloudflare credentials.

Production consistency is manual-only and must not run automatically on every `main` push.

`.github/workflows/deploy-production.yml` must:

- use `workflow_dispatch`;
- require an explicit deployment classification;
- require exact `DEPLOY` confirmation;
- run only from `main`;
- check out the latest intended `main`;
- install dependencies and run the full repository build;
- upload `dist` with Wrangler;
- pass the source commit SHA to the deployment;
- run production consistency after deployment;
- write a deployment summary;
- use the `production` environment;
- prevent overlapping deployments.

It must not have `push`, `pull_request`, or `schedule` triggers.

## Publication frequency

```text
normal PR                         no deployment
normal main merge                 no deployment
quality-program PR                no deployment
paused UI-program PR              no deployment
verified emergency                one immediate manual deployment
later approved release            one planned manual deployment
```

Short-interval repeated deployments and no-op trigger commits are prohibited.

## Planned-release verification

Before any later planned publication, verify:

- deployed commit equals intended `main`;
- build provenance identifies one canonical data snapshot;
- page and machine-readable counts match canonical data;
- every expected detail route exists;
- no stale route family remains;
- sitemap and metadata checks pass;
- `version.json`, `data/manifest.json`, `llms.txt`, and `ai.txt` match the same snapshot;
- search and shareable filter URLs work;
- mobile checks preserve material information;
- production has no material errors.

A failed gate blocks publication but does not invalidate unrelated completed repository work.

## Retry and rollback

Do not retry an old failed deployment after source changes. Confirm intended `main`, fix the repository if needed, run one new manual deployment, and verify production. Use rollback only when a previously successful deployment is the correct emergency recovery target.

## Reporting requirements

A production report includes classification, source commit, provenance identifier when available, workflow result, Pages project, public origin, consistency result, route/count results, and remaining discrepancies.

A normal no-deploy PR states only that production deployment was not required under this policy.

## Completed activation checklist

- [x] automatic production deployments disabled
- [x] automatic preview deployments disabled
- [x] Pages project confirmed as `stable-or-gone`
- [x] least-privilege token created
- [x] required GitHub secrets added
- [x] `production` environment created
- [x] deployment branch restricted to `main`
- [x] manual deployment workflow executed successfully
- [x] deployed production verified successfully

Activation evidence:

```text
Workflow run: 27908380603
Job: 82581060887
Audit: docs/audits/manual-production-activation-2026-06-22.md
```
