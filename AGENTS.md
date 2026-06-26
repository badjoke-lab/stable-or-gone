# Stable or Gone Agent Instructions

This file is the mandatory entry point for humans, AI agents, and automation working in this repository.

## Required reading order

Before changing code, data, workflows, or documentation, read:

1. `AGENTS.md`
2. `docs/spec-governance.md`
3. `docs/roadmap.md`
4. `docs/deployment-policy.md`
5. the canonical specification and implementation plan for the current work item
6. any audit or baseline named by that work item

For the active 100-record UI and public-information repair program, also read:

```text
docs/ui-redesign/master-spec.md
docs/ui-redesign/implementation-plan.md
docs/public-taxonomy-spec.md
```

For data work, inspect the current generated statistics, protected baseline, and integrity audit before editing canonical records.

## Repository source of truth

Repository specifications outrank chat memory, handoff prose, mock images, issue discussion, and unmerged drafts.

A decision becomes binding only when the relevant canonical repository document is updated and merged. If implementation conflicts with a canonical specification, treat the implementation as defective until the specification is deliberately changed through review.

The document-authority and change-control rules are in `docs/spec-governance.md`.

## Current workstream

As of 2026-06-26, the approved workstream is the 100-record UI and public-information repair program.

Routine growth beyond 92 canonical stable assets is paused until the gates in `docs/ui-redesign/implementation-plan.md` permit it. Do not start Batch 18, statistics implementation, or an independent visual reskin outside that plan.

Verified emergency repairs may interrupt the sequence only under `docs/deployment-policy.md` and must be recorded in `docs/roadmap.md`.

## Non-negotiable deployment rule

Development and production publication are separate processes.

- GitHub CI success is the completion condition for normal development work.
- A normal pull request must not wait for Cloudflare Pages.
- A normal `main` merge must not trigger or wait for a production deployment.
- Production deployment is allowed only through the manual production deployment workflow at a defined publication checkpoint or for an approved emergency.
- Production verification runs only after a deliberate production deployment.

The canonical policy is `docs/deployment-policy.md`.

## Prohibited behavior

Do not:

- enable automatic Cloudflare production or preview deployments;
- add production deployment commands to normal CI or data workflows;
- use no-op commits to trigger publication;
- retry an obsolete deployment after source changes;
- reduce data, evidence, or validation requirements;
- implement undocumented UI, taxonomy, route, or responsive behavior;
- create public filter categories from arbitrary free-text values;
- hide material mobile information through generic numbered-column rules;
- change the approved PR sequence without updating the plan and roadmap;
- use conversation history as a substitute for repository specifications.

## Deployment classifications

Every pull request must use one classification:

1. **No production deployment required** — the default for documentation, data, code, validation, and workflow changes.
2. **Publication checkpoint deployment required after merge** — for a defined public release checkpoint.
3. **Emergency production deployment required** — only for a verified public breakage, security issue, or materially incorrect public state.

## Current repair gate

```text
92-record repair baseline
→ documentation reset
→ production integrity repair
→ taxonomy and data-semantics repair
→ information architecture and mocks
→ UI implementation and hardening
→ 92-record full audit
→ final eight-record promotion
→ 100-record release candidate
→ manual production publication
→ production parity verification
```

## Pull-request discipline

- Start from the latest confirmed `main`.
- Keep each PR within one approved responsibility.
- Run normal repository validation before merge.
- Remove temporary migration artifacts unless the active plan explicitly retains them.
- Update `docs/roadmap.md` when the current position or sequence changes.
- Update the relevant canonical specification when semantics, routes, information hierarchy, responsive behavior, or machine-readable output change.
- Preserve canonical record-group counts unless an explicit audited migration approves a change.
- State the deployment classification in the PR body.

Every non-trivial PR body must include:

```text
Specification references
Roadmap item
Scope and non-scope
Data-preservation checks
Validation performed
Deployment classification
```

A PR that cannot cite its approved specification section and roadmap item must be paused.

## Current publication architecture

```text
GitHub Actions builds and validates the repository
→ a manual workflow uploads the prebuilt dist directory with Wrangler
→ production consistency verifies the public origin
```
