# UI v3 production verification and closure audit

Date: 2026-07-02
Roadmap item: PR #273
Status: execution pending

## Purpose

PR #273 closes the Editorial Ledger UI v3 sequence by verifying the public site at `https://sog.badjoke-lab.com`.

The process has two phases:

1. Pre-merge: verify the currently deployed `main` commit, production provenance, exact public-output parity, and representative desktop/mobile images.
2. Post-merge: wait for the PR #273 merge commit to become the public commit, rerun the same checks, create an immutable release tag, and publish closure reports.

## Existing deployment contract

Production remains controlled by `.github/workflows/deploy-production.yml`.

Every `main` push builds the site, publishes `dist` to the existing Cloudflare Pages project, and runs `npm run check:production`. PR #273 independently verifies that result and does not replace the deployment workflow.

## Gate V3-G

The project owner instructed the active PR #261–#273 sequence to proceed. The exact PR #273 release candidate may merge only after:

- normal pull-request workflows pass;
- the pre-merge production baseline equals current `main`;
- production provenance and route/output parity pass;
- production representative images pass;
- PR #273 changes no canonical data, public route, logo, wallet value, or machine-readable schema.

The final merge commit is verified after merge rather than guessed in advance.

## Gate V3-H

The post-merge verification must confirm:

- `/version.json` reports the exact merge commit;
- `/data/manifest.json` reports identical build provenance;
- the public branch is `main`;
- canonical data hash and file count are present;
- canonical stable assets remain 98;
- public record counts and detail-route sets match canonical data;
- canonical URLs and JSON-LD URLs match public routes;
- public data is canonical-only and excludes unreviewed or internal material;
- production desktop/mobile representative captures contain zero rendered failures.

## Production representative screenshots

Required coverage:

- twelve unique pages per device;
- three stablecoin detail pages per device;
- three organization detail pages per device;
- three event detail pages per device;
- three guide pages per device;
- 24 desktop and 24 mobile full-page images.

Required automated results:

- capture failures: 0;
- horizontal overflow: 0;
- broken images: 0;
- brand violations: 0;
- legacy visual markers: 0;
- false initial empty states: 0;
- H1/main-landmark errors: 0.

## Immutable release record

Successful post-merge verification creates an immutable release tag:

```text
ui-v3-closed-<12-character-commit>
```

The release records the exact production commit and includes `ui-v3-production-closure.json` and `ui-v3-production-closure.md`. The same reports and images are retained as workflow artifacts. Commit status `ui-v3/production-closure` links the commit to its verification run.

## Preservation

- Canonical stable assets changed: 0.
- Canonical record groups changed: 0.
- Public routes changed: 0.
- Logo assets changed: 0.
- Contact, support, and wallet values changed: 0.
- Machine-readable schema changed: 0.
- Deployment configuration changed: 0.

## Completion rule

UI v3 closes only after the pre-merge baseline passes, Gate V3-G authorizes merge, the merge commit is published by the normal production workflow, post-merge parity and images pass, an immutable release tag is created, and Gate V3-H is recorded in the closure report.
