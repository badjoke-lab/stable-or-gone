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
5. `docs/roadmap-amendments/2026-07-31-record-growth-batch-4-candidate-audit.md` defines the active bounded work item.
6. `docs/ui-v3-remediation-authority.md` remains the regression-protection contract for material public UI work.

## Mandatory reading order

Before changing code, canonical data, workflows, infrastructure, or documentation, read:

1. `AGENTS.md`
2. `docs/spec-governance.md`
3. `docs/roadmap.md`
4. `docs/deployment-policy.md`
5. `docs/roadmap-amendments/2026-07-31-record-growth-batch-4-candidate-audit.md`
6. `docs/post-351-data-growth-operating-spec.md`
7. `docs/quality/record-growth-batch-4-candidate-audit-pr496-spec.md`
8. every named baseline, queue, audit, handoff, and prior output required by the work item

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
PR #496 Record Growth Batch 4 candidate audit: active
Next boundary: REVIEW GATE
```

PR #496 reviews exactly eight private candidates and changes no canonical or public data.

```text
ready_for_full_record_review: MNEE, Figure YLDS
prelaunch_or_noncanonical: Open USD, Roughrider Coin, Qivalis euro stablecoin
insufficient_current_evidence: FIUSD, ANZ A$DC, USDF Consortium USDF
exact canonical duplicates: 0
canonical changes: 0
public changes: 0
```

“Ready for full-record review” is not promotion authorization. No candidate pair, canonical promotion PR, or later growth batch is authorized before the review gate.

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
- Automatic promotion is prohibited.
- A growth PR may add at most two canonical stable assets unless a separate reviewed amendment changes that limit.

## PR #496 review boundary

PR #496 may record private candidate analysis, source coverage, duplicate review, blocking unknowns, and complete-record feasibility.

PR #496 may not:

- edit canonical record families;
- change public routes, counts, metadata, machine-readable output, UI, CSS, sitemap, or guides;
- create candidate pages;
- rank, score, recommend, or imply safety;
- create an automatic canonical PR;
- authorize MNEE, YLDS, or any other candidate for promotion.

After PR #496, stop at the review gate and decide whether zero, one, or at most two future additions should be separately authorized.

## Domain and deployment boundary

The only official origin is:

```text
https://www.stableorgone.com
```

Canonical metadata, hreflang, OGP, JSON-LD, machine-readable files, robots, sitemap, production smoke tests, and deployment reporting must use that origin.

The legacy host `sog.badjoke-lab.com` still resolves to the Pages project. Its 301 redirect is an external Cloudflare configuration task, not permission to reintroduce the old host into repository canonical output.

Issue #479 remains open for deployment history and the externally blocked redirect.

A merge to `main` is not proof of production parity. Current main/production equality is established dynamically by `docs/deployment-policy.md`, the deployment workflow, and Issue #479.
