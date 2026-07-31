# Stable or Gone Agent Instructions

This file is the mandatory entry point for humans, AI agents, and automation working in this repository.

## Current authority

The current reviewed canonical state is:

```text
Canonical stable assets: 116
Organizations: 107
Relationships: 128
Events: 191
Canonical Evidence: 571
Evidence Relations: 571
Archive recorded: 442
Archive not recorded: 129
Deployments: 182
Market Access Records: 8
Detail routes: 414
Official public origin: https://www.stableorgone.com
Official-domain migration checkpoint: bd0e63ac36b1824bf705e8c80d1fb0a1cd79d221
```

Current authority chain:

1. PR #467 is the reviewed 116-asset canonical-data checkpoint.
2. PR #487 through PR #492 are the completed public UI, Statistics, responsive, logo, and deployment-chain normalization sequence.
3. PR #493 made `https://www.stableorgone.com` the official origin and was production-verified.
4. PR #495 synchronized post-domain repository authority and completed obsolete issue reconciliation.
5. PR #496 completed the private Record Growth Batch 4 candidate audit.
6. `docs/roadmap-amendments/2026-07-31-record-growth-batch-4-review-gate.md` defines the active reviewed decision.
7. `docs/ui-v3-remediation-authority.md` remains the regression-protection contract for material public UI work.

## Mandatory reading order

Before changing code, canonical data, workflows, infrastructure, or documentation, read:

1. `AGENTS.md`
2. `docs/spec-governance.md`
3. `docs/roadmap.md`
4. `docs/deployment-policy.md`
5. `docs/roadmap-amendments/2026-07-31-record-growth-batch-4-review-gate.md`
6. `docs/post-351-data-growth-operating-spec.md`
7. `docs/quality/record-growth-batch-4-review-gate-pr497-spec.md`
8. `docs/quality/record-growth-batch-4-candidate-audit-pr496-spec.md`
9. every named baseline, queue, audit, handoff, source-coverage report, and prior output required by the work item

Merged repository authority outranks chat memory, handoff prose, issue discussion, generated reports, and unmerged drafts.

## Current workstream

```text
PR #487 stablecoin logo coverage: complete
PR #488 white background, status badges, and mobile density: complete
PR #489 homepage information architecture: complete
PR #490 broad desktop/mobile remediation: complete
PR #491 Statistics redesign: complete
PR #492 Statistics panel flow and deployment-chain normalization: complete
PR #493 official-domain migration: complete and production-verified
PR #495 post-domain authority synchronization and issue reconciliation: complete
PR #496 Record Growth Batch 4 candidate audit: complete and production-verified
PR #497 Record Growth Batch 4 review gate: active
PR #498 Record Growth Batch 4 — MNEE: authorized next
Next boundary after PR #498: REVIEW GATE
```

## PR #497 decision

Authorize exactly one later complete-record implementation:

```text
MNEE — sog_cand_pr496_mnee
Maximum new canonical assets in PR #498: 1
Replacement candidate: prohibited
```

Figure YLDS is deferred. Its issuer describes it as a registered fixed-income security rather than a stablecoin. Its $0.01 face-amount units, holder yield, issuer-credit exposure, securities eligibility, transfer, redemption, and chain/wrapper semantics require a separate scope amendment.

PR #497 changes no canonical or public data. MNEE is not promoted by this review gate; PR #498 must perform fresh entry-gate review and may withhold the asset if complete support fails.

## PR #498 entry gate

Before canonical edits, PR #498 must recheck:

- canonical duplicate and lineage;
- current primary sources;
- exact contract or inscription identities;
- first public issuance date;
- current reserve composition and custodian;
- current attestation reports and archive availability;
- current issuance and redemption terms, fees, and minimums;
- MNEE Limited organization identity and relationships.

Every applicable canonical record family must be complete. Unsupported details remain explicit known unknowns. Thin records are prohibited. No replacement candidate may be substituted.

## Mandatory UI working rule

Before changing public HTML, components, layouts, CSS, client scripts, UI validators, screenshot workflows, or visual acceptance records, read `docs/ui-v3-remediation-authority.md` and the PR #492 Statistics contract.

Every material UI pull request must:

- identify the governing authority;
- list changed route families and preserved contracts;
- include desktop and mobile screenshots;
- manually inspect generated images rather than relying on CI status alone;
- inspect page top, middle, and bottom, long-page flow, card heights, whitespace, overlaps, duplicates, footer completion, and mobile source order;
- preserve or strengthen exhaustive color, readability, overlap, route-completeness, and responsive checks;
- preserve canonical data, routes, metadata, and machine-readable outputs unless separate authority permits a change.

For `/stats/` specifically:

- no data may be hidden in collapsibles;
- desktop columns must pack independently without shared row heights;
- mobile must preserve source order in one column;
- bare `Arbitrum` is unresolved and must not be mapped to Arbitrum One;
- Arbitrum One and Arbitrum Nova remain distinct;
- canonical chain totals plus unresolved deployments must reconcile to total deployments.

Automated success never overrides a known visual or semantic defect.

## Canonical-data boundary

- Unknown values remain unknown unless reviewed evidence supports replacement.
- Partial dates must not be coerced into day-level dates.
- Monitoring, candidates, discovery leads, editorial research, and private notes are not canonical data.
- Candidate source leads are not canonical Evidence.
- Canonical counts change only through explicit audited data PRs.
- Rebrands, aliases, wrappers, migrations, and deployments do not become separate canonical assets without scope and lineage review.
- Name or symbol similarity never authorizes automatic deduplication.
- USDF Consortium USDF must not be merged with Falcon USDf.
- Open USD must be disambiguated from Origin Dollar before any future record.
- YLDS must not be treated as an ordinary stablecoin without a separate reviewed scope amendment.
- Automatic promotion is prohibited.
- PR #498 may add at most one canonical stable asset: MNEE.

## Domain and deployment boundary

The only official origin is:

```text
https://www.stableorgone.com
```

Canonical metadata, hreflang, OGP, JSON-LD, machine-readable files, robots, sitemap, production smoke tests, and deployment reporting must use that origin.

The legacy host `sog.badjoke-lab.com` still resolves to the Pages project. Its 301 redirect is an external Cloudflare configuration task, not permission to reintroduce the old host into repository canonical output.

Issue #479 remains open for deployment history and the externally blocked redirect.

A merge to `main` is not proof of production parity. Current main/production equality is established dynamically by `docs/deployment-policy.md`, the deployment workflow, and Issue #479.
