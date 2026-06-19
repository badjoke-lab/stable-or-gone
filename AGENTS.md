# Stable or Gone Agent Instructions

This file is the mandatory entry point for humans, AI agents, and automation working in this repository.

## Required reading order

Before changing code, data, workflows, or documentation, read:

1. `AGENTS.md`
2. `docs/roadmap.md`
3. `docs/deployment-policy.md`
4. the specification or audit file for the current work item

For data work, also inspect the current generated statistics and integrity audit before editing canonical records.

## Non-negotiable deployment rule

Development and production publication are separate processes.

- GitHub CI success is the completion condition for normal development work.
- A normal pull request must not wait for Cloudflare Pages.
- A normal `main` merge must not trigger or wait for a production deployment.
- Production deployment is allowed only through the manual production deployment workflow at a defined publication checkpoint or for an approved emergency.
- Production verification runs only after a deliberate production deployment.

The canonical policy is `docs/deployment-policy.md`. Do not duplicate or reinterpret it elsewhere.

## Prohibited behavior

Do not:

- enable automatic Cloudflare production deployments from `main`
- enable automatic Cloudflare preview deployments for every branch or pull request
- add `wrangler pages deploy` to normal CI, pull-request workflows, or data migration workflows
- treat Cloudflare deployment completion as a normal PR merge requirement
- repeatedly push no-op commits to trigger a deployment
- retry an old failed Cloudflare deployment after the code has changed
- poll production deployment status during ordinary data or code work
- lower data, evidence, or validation standards to reduce build time

## Deployment classifications

Every pull request must use one classification:

1. **No production deployment required** — normal default for data, code, validation, documentation, and internal workflow changes.
2. **Publication checkpoint deployment required after merge** — used for defined public release checkpoints, including canonical count-growth gates.
3. **Emergency production deployment required** — used only for a verified public breakage, security issue, or materially incorrect public state.

## Growth gates

Canonical count growth must follow:

```text
merge growth batch
→ manually deploy latest main
→ run production consistency against the deployed commit
→ proceed only after parity succeeds
```

The current gates are 75, 80, 85, 90, 95, and 100 canonical stable assets.

## Pull-request discipline

- Start from the latest confirmed `main`.
- Prefer one complete change over repeated trigger commits.
- Run normal repository validation before merge.
- Remove temporary migration scripts, trigger files, and one-time workflows before merge.
- Update `docs/roadmap.md` when the current position, queues, or execution order changes.
- State the deployment classification in the PR body.

## Current publication architecture

The intended architecture is:

```text
GitHub Actions builds and validates the repository
→ a manual workflow uploads the prebuilt dist directory with Wrangler
→ production consistency verifies the public origin
```

Until the manual deployment workflow and Cloudflare dashboard controls are fully configured, do not compensate by restoring automatic deployment triggers.
