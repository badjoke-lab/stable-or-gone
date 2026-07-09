# PR #335 controlled growth activation — AUDD and NZDS

Status: active roadmap amendment  
Updated: 2026-07-09

## Authoritative current workstream

```text
PR #330 100 -> 102 controlled growth: complete
PR #331 Stats contrast and responsive UI remediation: complete
PR #332 102 -> 104 controlled growth: complete
PR #333 104 -> 106 controlled growth: complete
PR #334 106 -> 108 controlled growth: complete
PR #335 108 -> 110 controlled growth: active
PR #336 Comparison Readiness contract and audit method: next
```

This amendment supersedes stale numeric labels in `docs/roadmap.md` where PR #335 was still assigned to the first Phase F item. PR #331 was consumed by UI remediation, shifting the final Phase E growth batch and all later unused PR numbers by one.

## Promotion allocation

PR #335 may promote only:

```text
sog_cand_000109 -> sog_st_audd   AUDD
sog_cand_000110 -> sog_st_nzds   NZD Stablecoin / NZDS
```

The candidate audit is a research allocation, not canonical publication authority. Promotion requires current first-party review and explicit preservation of unresolved fields.

## AUDD research boundary

The PR must verify, from current first-party sources where available:

- canonical AUDD identity and current issuer/operator legal entity;
- Australian-dollar reference and backing model;
- reserve custody and assurance or transparency model;
- direct and indirect issuance/redemption access conditions;
- exact supported chain identifiers and canonicality;
- original launch-date precision;
- material issuer, deployment, or regulatory lifecycle events.

The PR must not infer current activity from contract persistence or third-party listings alone.

## NZDS research boundary

The PR must verify, from current first-party sources where available:

- canonical NZDS identity and Techemynt/current operator relationship;
- New Zealand-dollar reference and backing model;
- reserve, assurance, and transparency model;
- minting/redemption eligibility and settlement constraints;
- exact supported chain identifiers and canonicality;
- original launch-date precision;
- any issuer-structure, deployment, or regulatory lifecycle changes.

The PR must not infer a current issuer structure or active redemption path from historical launch material alone.

## Canonical transition target

The exact supporting-group counts remain subject to reviewed source findings, but the stable-asset denominator is fixed:

```text
stable assets: 108 -> 110
```

All applicable supporting record families must advance consistently:

```text
organizations
relationships
classifications
reserve/redemption profiles
events
event details
evidence
reserve reports
known unknowns
deployments
legal profiles
reserve components
income profiles
statistics checkpoint history
release-integrity and parity baselines
```

## Statistics checkpoint boundary

The immutable reviewed prefix must remain:

```text
100
102
104
106
108
```

PR #335 may append exactly one reviewed 110-asset checkpoint after that prefix. It may not rewrite, reorder, truncate, or regenerate earlier snapshots from changed semantics.

Target checkpoint identity:

```text
sog_controlled_growth_110_checkpoint_pr335_2026_07_09
```

## Phase E completion condition

PR #335 closes Phase E only when:

- exactly candidates 109 and 110 are promoted;
- canonical stable asset count is exactly 110;
- current-state lifecycle classifications are supported by reviewed evidence;
- unresolved launch, issuer-structure, assurance-history, and deployment-lineage questions remain explicit known unknowns where not resolved;
- Registry v2/v3 parity is exact at 110 assets;
- public counts, detail routes, statistics, and provenance bind the reviewed 110-asset checkpoint;
- the 110-asset history snapshot is appended after the immutable 100/102/104/106/108 prefix;
- full CI and independent audit workflows are green.

## Post-110 renumbering authority

Unused roadmap items shift by one from the stale roadmap numbering:

```text
Phase F — Comparison Foundation
PR #336 define Comparison Readiness contract and audit method
PR #337 audit all 110 assets for comparison readiness
PR #338 normalize comparison-critical gaps and validators
PR #339 define canonical Market Access Record schema and governance
PR #340 define facet-freshness derivation contract and validators

Phase G — Compare
PR #341 deterministic comparison projection generator and machine-readable output
PR #342 /compare/ v1
PR #343 Compare presets

Phase H — Change Research Tools
PR #344 access and regulation index generator
PR #345 Access & Regulation Explorer
PR #346 change-timeline projection generator
PR #347 Change Timeline UI

Phase I — Reviewed Public Update Layer
PR #348 SOG Registry Update feed/page
PR #349 Monthly Stablecoin Change Log

Optional Phase J — Query Translation
PR #350+ natural-language filter translation only after separate approval
```

Work order and product scope do not change; only unused PR numbering changes.
