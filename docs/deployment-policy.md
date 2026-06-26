# Deployment Policy

Updated: 2026-06-26

## Status

This file is the canonical deployment policy for Stable or Gone.

```text
Manual publication architecture: operational
First controlled deployment: PASS
Workflow run: 27908380603
Source commit: 1aa87b0ca8251eea651af74f2af80f30c791e39c
Pages project: stable-or-gone
Public origin: https://sog.badjoke-lab.com/
Current publication state: routine publication paused during the repair program
```

All deployment decisions, pull-request classifications, Cloudflare settings, production workflows, audits, and roadmaps must follow this file. `AGENTS.md`, `README.md`, `docs/cloudflare-pages.md`, pull-request templates, workflows, audits, and roadmaps may summarize this policy but must not contradict it.

Document authority and change control are defined in `docs/spec-governance.md`.

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

Default for normal documentation, data enrichment, taxonomy migration, UI implementation, validation, workflows, roadmaps, and non-emergency corrections that can wait for the next checkpoint.

Completion condition:

```text
GitHub CI successful
```

Cloudflare is not checked and production is not polled.

### Publication checkpoint deployment required after merge

Use only for a defined planned public release, an approved phase-completion release, or a bundled correction set that the roadmap explicitly marks for publication.

Completion condition:

```text
PR merged
→ intended main manually deployed
→ deployed commit confirmed
→ production consistency successful
```

### Emergency production deployment required

Use only for a broken public site, missing or corrupt public files, materially incorrect public data already visible to users, a security issue, rollback, or an urgent repair approved under the roadmap.

The reason, source commit, workflow run, and production verification must be recorded.

## Current repair-program publication gate

As of 2026-06-26, routine publication and routine record-growth gates are paused while SOG completes the 100-record UI and public-information repair program.

Binding documents:

```text
docs/roadmap.md
docs/ui-redesign/master-spec.md
docs/ui-redesign/implementation-plan.md
```

The next planned non-emergency publication checkpoint is:

```text
100 canonical stable assets
+ repaired production snapshot integrity
+ repaired public taxonomy
+ repaired information architecture and UI
+ complete 92-record audit
+ final eight-record promotion
+ release-candidate verification
```

Documentation, migration, mock, implementation, audit, and normal `main` merges before that checkpoint do not deploy to production.

A verified emergency may interrupt the sequence, but it must be limited to the emergency and must not be used to publish unfinished redesign work.

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

- call `wrangler pages deploy`;
- wait for Cloudflare Pages;
- poll production for a new deployment;
- require Cloudflare credentials.

### Production consistency workflows

Production consistency is manual-only. It may run after a manual deployment, an operator-requested verification, or an emergency repair.

It must not run automatically on every `main` push.

### Manual production deployment workflow

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
- use concurrency control to prevent overlapping deployments.

It must not have `push`, `pull_request`, or `schedule` triggers.

## Publication frequency

```text
normal PR                         no deployment
normal main merge                 no deployment
repair phase completion           no deployment unless roadmap says otherwise
several quality PRs               no deployment during the current pause
verified emergency                one immediate manual deployment
100-record repaired release       one planned manual deployment
```

Short-interval repeated deployments and no-op trigger commits are prohibited.

## Superseded count-growth gates

The previous routine sequence was:

```text
75 → 80
80 → 85
85 → 90
90 → 95
95 → 100
```

The registry is now at 92 canonical assets. The 90 → 95 and 95 → 100 routine gates are superseded by the repair-program gate.

Do not publish at 95 merely because the count is reached. Do not begin the final eight-record promotion until `docs/ui-redesign/implementation-plan.md` permits it.

## 100-record repaired-release verification

Before the planned publication, verify:

- deployed commit equals the intended `main` commit;
- build provenance identifies one canonical data snapshot;
- homepage, stablecoin, organization, and event counts match canonical data;
- every expected detail route exists;
- no stale route family from an older build remains;
- sitemap route counts match canonical counts;
- canonical, hreflang, metadata, Open Graph, and JSON-LD checks pass;
- `version.json`, `data/manifest.json`, `llms.txt`, and `ai.txt` match the same snapshot;
- search and shareable filter URLs work;
- compatibility routes work without exposing implementation notes;
- mobile smoke tests preserve material information;
- production has no material errors.

A failed gate blocks publication. It does not invalidate unrelated completed repository work.

## Retry and rollback rules

Do not retry an old failed deployment after code has changed. An old run republishes the old commit.

Instead:

1. confirm the intended `main` commit;
2. fix the repository if needed;
3. run one new manual deployment from the intended commit;
4. verify production.

Use rollback only when a previously successful deployment is the correct emergency recovery target.

## Reporting requirements

A production deployment report must include:

- deployment classification;
- source commit SHA;
- canonical data hash or provenance identifier when implemented;
- workflow run result;
- Cloudflare Pages project;
- public origin checked;
- production consistency result;
- record and route counts;
- any remaining discrepancy.

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
