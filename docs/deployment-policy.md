# Stable or Gone Deployment Policy

Updated: 2026-09-09

## Production contract

```text
Source of truth: main
Production workflow: .github/workflows/deploy-production.yml
Pages project: stable-or-gone
Official public origin: https://www.stableorgone.com
Legacy migration origin: https://sog.badjoke-lab.com
Automatic main publication: enabled
Deployment record: Issue #479
Active presentation authority: config/ui-redesign-v4-authority.json
```

A merge to `main` automatically enters the production publication path. Therefore the UI redesign must not be merged to `main` incrementally.

## Redesign publication rule

During `docs/UI-REDESIGN-SCHEDULE.md` Gates 0–7:

- production continues from `main` with the outgoing UI;
- canonical record growth/evidence/guides/maintenance may continue normally;
- redesign implementation remains isolated on `ui/sog-redesign-v4`;
- preview/branch builds may be used for redesign review;
- partial redesign pages are not production candidates.

At Gate 8:

```text
sync latest main
-> repeat critical release checks
-> record pre-cutover main SHA
-> merge complete redesign once
-> normal main production deployment
-> verify deployed commit/data/public layer/routes
-> representative desktop/mobile production verification
-> rollback on critical regression
```

## Preserved deployment invariants

- official origin remains `https://www.stableorgone.com`;
- legacy host remains a migration-only origin and permanently redirects with HTTP 301 while preserving path/query:

```text
https://sog.badjoke-lab.com/<path>?<query>
-> 301 https://www.stableorgone.com/<path>?<query>
```

- current deterministic public JSON, manifest/version, llms/ai, sitemap/robots, provenance, and Ledger Series outputs remain derived from reviewed data;
- no new GA4 Measurement ID/property is created, guessed, or hardcoded;
- redesign does not authorize DNS or Cloudflare account mutation;
- a repository merge is not itself production-parity evidence.

## Release verification

Gate 7/8 verification includes canonical/classification/profile/event/evidence checks, registry integrity, Astro check/build, reproducibility/public-layer verification, route/link checks, responsive overflow checks, basic accessibility, and representative desktop/mobile browser inspection.

Obsolete pixel/visual equality to the outgoing UI is not a deployment requirement.

## Emergency rollback

Before Gate 8 merge, record the exact pre-cutover `main` SHA. A critical production regression after cutover requires rollback to that known-good checkpoint and re-verification.
