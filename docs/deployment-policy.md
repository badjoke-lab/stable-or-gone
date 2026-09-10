# Stable or Gone Deployment Policy

Updated: 2026-09-11

## Production contract

```text
Source of truth: main
Production workflow: .github/workflows/deploy-production.yml
Pages project: stable-or-gone
Official public origin: https://www.stableorgone.com
Legacy migration origin: https://sog.badjoke-lab.com
Automatic main publication: enabled
Deployment record: Issue #479
Completed product workstream: Public Stats / Registry Health split
Verified production commit: 157ec8c391a9134552c9e0beabb3ff430e867fd6
Verified deployment: run #516 / 34497114140 / success
```

A merge to `main` automatically enters the production publication path. Significant paired information-architecture changes should therefore be completed and validated off `main` before merge when partial publication would create an inconsistent product state.

## UI Redesign V4 cutover status

UI Redesign V4 completed its one-shot production integration through PR #636, merge commit `60940f0c1ad1d69961e839fa4979a7c4e29d91af`.

The V4 observatory UI is production lineage.

## Stats / Registry Health release status

The post-cutover Public Stats / Registry Health refinement is complete.

```text
Feature branch: ui/stats-registry-health-20260910
Feature PR: #653
Feature merge: 0fc86a7d1020e1271306b5c479e2747383b84680
Smoke hotfix PR: #658
Verified production commit: 157ec8c391a9134552c9e0beabb3ff430e867fd6
Deploy production run: #516 / 34497114140 / success
```

The release shipped `/stats/` and `/maintenance/` together. The follow-up hotfix changed only the production smoke contract so it validates the accepted post-split Stats structure rather than obsolete pre-split copy.

Production verification passed for the deterministic public layer, stablecoin record JSON, Stats lifecycle-quality cross-surface checks, and the released public routes. Canonical data was not changed by the smoke hotfix.

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
- current product work does not authorize DNS or Cloudflare account mutation;
- a repository merge is not itself production-parity evidence.

## Release verification for future substantial changes

Validation should include, as applicable:

- canonical/classification/profile/event/evidence checks;
- statistics validation;
- registry integrity;
- Astro check/build;
- reproducibility/public-layer verification;
- route/internal-link checks;
- responsive overflow checks;
- basic accessibility;
- representative desktop/mobile browser inspection;
- explicit data-vs-UI spot checks for changed analytical surfaces;
- confirmation that historical failure rates use correct category denominators;
- confirmation that private monitoring/candidate data is absent from public output.

Obsolete pixel/visual equality to older UI compositions is not a deployment requirement.

## Emergency rollback

Before a substantial release merge, record the exact pre-merge `main` SHA. A critical production regression after deployment requires rollback to that known-good checkpoint and re-verification.
