# Stable or Gone Deployment Policy

Updated: 2026-09-10

## Production contract

```text
Source of truth: main
Production workflow: .github/workflows/deploy-production.yml
Pages project: stable-or-gone
Official public origin: https://www.stableorgone.com
Legacy migration origin: https://sog.badjoke-lab.com
Automatic main publication: enabled
Deployment record: Issue #479
Current product workstream: Public Stats / Registry Health split
Current implementation branch: ui/stats-registry-health-20260910
```

A merge to `main` automatically enters the production publication path. Significant paired information-architecture changes must therefore be completed and validated off `main` before merge.

## UI Redesign V4 cutover status

UI Redesign V4 completed its one-shot production integration through PR #636, merge commit `60940f0c1ad1d69961e839fa4979a7c4e29d91af`.

The former rule that the outgoing UI remain live until Gate 8 is historical. The V4 observatory UI is now production lineage.

## Current Stats / Registry Health publication rule

The current post-cutover refinement is developed on `ui/stats-registry-health-20260910`.

Release unit:

```text
Public Stats rebuild
+
Registry Health / Maintenance rebuild
```

Do not merge only one half of the split.

Before release:

```text
fetch current main
-> sync any newer reviewed main changes when necessary
-> validate canonical/statistics/registry contracts
-> Astro check + production-equivalent build
-> route/internal-link checks
-> representative desktop/mobile inspection
-> confirm no mock values/private monitoring rows
-> record pre-merge main SHA
-> merge both surfaces together
-> normal main production deployment
-> verify /stats/ and /maintenance/
-> verify /data/stats.json and /data/maintenance-log.json
-> rollback on critical regression
```

## Preserved deployment invariants

- official origin remains `https://www.stableorgone.com`;
- legacy host remains a migration-only origin and permanently redirects with HTTP 301 while preserving path/query:

```text
https://sog.badjoke-lab.com/<path>?<query>
-> 301 https://www.stableorgone.com/<path>?<query>
```

- deterministic public JSON, manifest/version, llms/ai, sitemap/robots, provenance, and Ledger Series outputs remain derived from reviewed data;
- `/data/stats.json`, `/data/stats-history.json`, and `/data/maintenance-log.json` remain public deterministic/reviewed outputs under their existing contracts;
- no new GA4 Measurement ID/property is created, guessed, or hardcoded;
- current work does not authorize DNS or Cloudflare account mutation;
- a repository merge is not itself production-parity evidence.

## Current release verification

Validation must include, as applicable:

- canonical/classification/profile/event/evidence checks;
- statistics validation;
- registry integrity;
- Astro check/build;
- reproducibility/public-layer verification;
- route/internal-link checks;
- responsive overflow checks;
- basic accessibility;
- representative desktop/mobile browser inspection;
- explicit data-vs-UI spot checks for `/stats/` and `/maintenance/`;
- confirmation that historical failure rates use correct category denominators;
- confirmation that private monitoring/candidate data is absent from public output.

Obsolete pixel/visual equality to older UI compositions is not a deployment requirement.

## Emergency rollback

Before the release merge, record the exact pre-merge `main` SHA. A critical production regression after deployment requires rollback to that known-good checkpoint and re-verification.
