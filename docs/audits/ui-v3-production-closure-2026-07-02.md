# UI v3 production verification and closure audit

Date: 2026-07-02
Roadmap item: PR #273
Status: execution pending

## Purpose

PR #273 closes the Editorial Ledger UI v3 sequence by verifying the public site at `https://sog.badjoke-lab.com` against one exact immutable commit.

The PR head becomes the release candidate. After normal pull-request workflows pass, `main` is fast-forwarded to that exact SHA. The PR production-closure workflow waits for the standard production deployment to publish the same SHA, then verifies provenance, exact public-output parity, and production desktop/mobile images.

This avoids guessing a future merge commit. The verified source commit, `main` commit, and production commit are identical.

## Existing deployment contract

Production remains controlled by `.github/workflows/deploy-production.yml`.

Every `main` push builds the site, publishes `dist` to the existing Cloudflare Pages project, and runs `npm run check:production`. PR #273 independently verifies that result and does not replace the deployment workflow.

## Gate V3-G

The project owner instructed the active PR #261–#273 sequence to proceed. The exact PR #273 head may become `main` only after:

- normal pull-request workflows pass;
- the source-level closure contract passes;
- current production remains internally consistent while the release candidate is prepared;
- PR #273 changes no canonical data, public route, logo, wallet value, or machine-readable schema.

Moving `main` to the exact checked head is the release authorization recorded for Gate V3-G.

## Gate V3-H

The production-closure workflow must confirm after `main` moves:

- `/version.json` reports the exact PR #273 head SHA;
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

The exact 40-character production commit SHA is the immutable release identifier. The production-closure workflow writes:

```text
artifacts/ui-v3-production-closure.json
artifacts/ui-v3-production-closure.md
artifacts/screenshots/**
artifacts/screenshots-desktop.zip
artifacts/screenshots-mobile.zip
```

The reports contain the source/main/production SHA, build provenance, canonical data hash, record and route counts, Gate V3-G status, Gate V3-H status, and production image results. They are retained as the PR workflow artifact and copied into the PR record after verification.

## Preservation

- Canonical stable assets changed: 0.
- Canonical record groups changed: 0.
- Public routes changed: 0.
- Logo assets changed: 0.
- Contact, support, and wallet values changed: 0.
- Machine-readable schema changed: 0.
- Deployment configuration changed: 0.

## Completion rule

UI v3 closes only after normal PR checks pass, Gate V3-G fast-forwards `main` to the exact PR head, the standard deployment publishes that same commit, the PR production-closure workflow verifies production parity and 48 images, and Gate V3-H is recorded in the closure report and PR record.
