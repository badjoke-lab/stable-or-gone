# PR #365 Evidence and Archive Maintenance Batch 2 Specification

Status: active work-item specification  
Updated: 2026-07-14

## 1. Roadmap item

PR #365 — Evidence and Archive Maintenance Batch 2.

PR #364 is complete and merged at:

```text
bf72662a86d252ab827be437ff4d498a6463e98e
```

Binding reviewed handoff:

```text
docs/migration/tier-a-batch-4-pr364-reviewed-handoff.json
```

Binding review-gate decision:

```text
docs/migration/post-pr360-review-gate-pr361.json
```

## 2. Purpose

PR #365 is a bounded Evidence-quality maintenance batch. It reviews the highest-priority current Evidence records that still lack a verified archive capture or require source-identity maintenance.

Priority maintenance families are:

```text
verified dated archive supplementation
invalid or wildcard archive removal/replacement
broken canonical source repair
official-source replacement when claim scope is preserved or improved
Evidence source-identity maintenance
reviewed no-safe-change recording
```

## 3. Starting checkpoint

```text
canonical assets: 112
canonical Evidence: 559
Evidence Relations: 559
archive recorded: 387
archive not recorded: 172
Market Access Records: 8
```

## 4. Bounded scope

PR #365 may review and touch no more than:

```text
10 canonical Evidence records
```

The internal queue is selected deterministically from the current canonical Evidence set by maintenance priority and `evidence_id` ascending.

Previously selected PR #360 Evidence records are excluded from the refreshed queue unless a new source-version fact is explicitly added to the queue by a later reviewed amendment. Queue inclusion is not automatic canonical correction.

## 5. Archive and source rules

A dated archive may be added only after an exact-source capture is verified. A wildcard Wayback URL is not evidence of a valid capture.

An archive capture must preserve the same source identity and claim scope. A capture of a homepage, redirect target, translated page, or neighboring document must not be substituted without reviewed source-equivalence evidence.

A current official source may replace a broken source only when it preserves or improves the supported claim and does not erase historical version boundaries.

Different documents sharing a publisher or domain must remain separate Evidence identities.

## 6. Required preservation

PR #365 must preserve:

```text
112 canonical assets
559 Evidence identities unless a separately reviewed source-identity correction proves an exact duplicate
559 Evidence Relations unless an Evidence identity correction requires a synchronized relation correction
8 canonical Market Access Records
PR #353 and PR #363 planning checkpoints
PR #354–#364 reviewed handoffs
canonical-only public output
no automatic monitoring or editorial-research promotion
no asset ranking
no composite score
no new public product surface
```

No asset, organization relationship, event, deployment, reserve report, income profile, legal profile, redemption profile, Market Access Record, route, or UI change is authorized by this specification.

## 7. Required outputs

```text
docs/migration/evidence-archive-maintenance-queue-pr365.json
docs/migration/evidence-archive-maintenance-outcomes-pr365.json
docs/migration/evidence-archive-maintenance-batch-2-pr365-reviewed-handoff.json
```

The queue and outcomes are internal review material and must not be published.

## 8. Validation

The dedicated workflow must validate:

```text
PR #361 review-gate authority
PR #364 reviewed handoff and merge boundary
maximum ten selected Evidence records
deterministic queue selection
canonical Evidence identity and relation integrity
archive-state transition
source-identity deduplication
Registry v2/v3 parity
release integrity
deterministic statistics and immutable history
Astro check and build
public-layer safety
```

Each outcome must record the previous value, new value, review method, evidence basis, reason, and remaining uncertainty.

## 9. Exit criteria

PR #365 completes when:

1. exactly ten refreshed high-priority Evidence candidates are reviewed;
2. only verified source-preserving corrections are committed;
3. unsupported candidates are recorded as reviewed with no safe change;
4. canonical and public source-identity unions remain synchronized;
5. all validation and CI are green;
6. the next review gate is explicitly named and no later growth or public-surface work is implied.
