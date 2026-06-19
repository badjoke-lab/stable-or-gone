# Deployment Policy

Updated: 2026-06-19

## Status

This file is the canonical deployment policy for Stable or Gone.

All deployment decisions, pull-request classifications, Cloudflare settings, and production verification rules must follow this file. `AGENTS.md`, `README.md`, `docs/cloudflare-pages.md`, pull-request templates, workflows, and roadmaps may summarize this policy but must not contradict it.

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

## Why this policy exists

The project operates on free infrastructure. Cloudflare Pages Git integration can automatically build both production and preview branches, and account-level build concurrency can cause unrelated projects and branches to queue behind one another.

The repository therefore uses GitHub as the development and validation system and reserves Cloudflare for deliberate publication only.

## Source-of-truth architecture

The target publication architecture is:

```text
latest main
→ GitHub Actions checkout
→ install dependencies
→ npm run build
→ upload the prebuilt dist directory with Wrangler
→ verify the public origin against the deployed commit
```

Cloudflare must receive prebuilt assets. It must not be the routine build system for every branch, pull request, or `main` merge.

## Pull-request deployment classifications

Every pull request must select exactly one classification.

### 1. No production deployment required

This is the default.

Use it for:

- canonical data improvements that do not require an immediate public release
- evidence, event, profile, and relationship enrichment
- validation and integrity changes
- tests and build improvements
- documentation
- roadmap updates
- internal workflows
- machine-readable layer maintenance
- non-emergency corrections that can wait for the next publication checkpoint

Completion condition:

```text
GitHub CI successful
```

Cloudflare is not checked and production is not polled.

### 2. Publication checkpoint deployment required after merge

Use it for:

- planned public releases
- canonical count-growth checkpoints
- phase-completion releases
- bundled public corrections that should become visible together

Completion condition:

```text
PR merged
→ latest main manually deployed
→ deployed commit matches main
→ production consistency successful
```

### 3. Emergency production deployment required

Use it only for:

- a broken public site
- missing or corrupt public files
- materially incorrect public data already visible to users
- a security issue
- a deployment rollback or urgent public repair

Emergency publication may interrupt the roadmap. The reason and deployed commit must be recorded.

## Automatic deployment policy

The intended Cloudflare Pages settings are:

```text
Automatic production branch deployments: OFF
Automatic preview branch deployments:    OFF
```

A Git-integrated Pages project may keep its repository connection while automatic builds are disabled. Prebuilt assets may then be deployed directly with Wrangler.

Dashboard configuration is an operator action and cannot be enforced by repository code alone. The current dashboard state must be verified before the manual deployment workflow is considered operational.

## Workflow policy

### Normal CI

Normal CI may:

- install dependencies
- validate canonical data
- run integrity checks
- run Astro checks
- build the site
- verify generated files and public-layer consistency locally

Normal CI must not:

- call `wrangler pages deploy`
- wait for Cloudflare Pages
- poll the public origin for a new deployment
- require Cloudflare secrets

### Production consistency workflow

Production consistency is manual-only.

It may be run after:

- a manual production deployment
- an operator-requested verification
- an emergency repair

It must not run automatically on every `main` push.

### Manual production deployment workflow

The production deployment workflow must:

- use `workflow_dispatch`
- run only from an explicitly selected ref, normally `main`
- install dependencies and run the full repository build
- upload `dist` with Wrangler
- pass the commit SHA to the deployment
- run production consistency after deployment
- use GitHub Secrets for Cloudflare credentials
- use concurrency control to prevent overlapping production deployments

It must not have `push`, `pull_request`, or `schedule` triggers.

## Required GitHub secrets

The manual deployment workflow requires:

```text
CLOUDFLARE_API_TOKEN
CLOUDFLARE_ACCOUNT_ID
```

The token must have only the permissions required to deploy the designated Pages project.

Secrets must never be written to repository files, PR bodies, issues, logs, or public documentation.

## Publication frequency

Do not deploy after every PR.

Default publication rule:

```text
normal PR                         no deployment
normal main merge                 no deployment
several quality PRs               bundle into one later deployment
planned checkpoint                one deployment
verified emergency                immediate deployment
```

Short-interval repeated deployments and no-op trigger commits are prohibited.

## Canonical count-growth gates

The following checkpoints require publication and full production parity before the next growth batch begins:

```text
70 → 75
75 → 80
80 → 85
85 → 90
90 → 95
95 → 100
```

At every gate verify:

- deployed commit equals the latest intended `main` commit
- homepage counts match generated JSON and manifest counts
- stablecoin, organization, and event list counts match canonical data
- detail-link counts match canonical counts
- sitemap route counts match canonical counts
- canonical, hreflang, metadata, Open Graph, and JSON-LD checks pass
- obsolete count markers are absent

A failed gate blocks the next count-growth batch. It does not retroactively invalidate unrelated completed quality work.

## Retry and rollback rules

Do not retry an old failed deployment after code has changed. An old deployment rebuilds or republishes the old commit.

Instead:

1. confirm the intended `main` commit
2. fix the repository if needed
3. run one new manual deployment from the intended commit
4. verify production

Use rollback only when a previously successful production deployment is the correct emergency recovery target.

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

## Dashboard migration checklist

Before relying on the manual workflow:

- [ ] disable automatic production deployments in Cloudflare Pages
- [ ] disable automatic preview deployments in Cloudflare Pages
- [ ] confirm the Pages project name
- [ ] create a least-privilege Cloudflare API token
- [ ] add `CLOUDFLARE_API_TOKEN` to GitHub Secrets
- [ ] add `CLOUDFLARE_ACCOUNT_ID` to GitHub Secrets
- [ ] run the manual deployment workflow once
- [ ] confirm the deployed commit
- [ ] run production consistency successfully

## Official Cloudflare references

- Branch deployment controls: https://developers.cloudflare.com/pages/configuration/branch-build-controls/
- Git integration: https://developers.cloudflare.com/pages/configuration/git-integration/
- Direct Upload with CI: https://developers.cloudflare.com/pages/how-to/use-direct-upload-with-continuous-integration/
- Wrangler Pages commands: https://developers.cloudflare.com/workers/wrangler/commands/pages/
