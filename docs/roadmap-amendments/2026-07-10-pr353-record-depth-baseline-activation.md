# PR #353 Record Depth & Coverage Baseline activation

Status: active roadmap amendment  
Updated: 2026-07-10

## Authoritative current position

```text
PR #351 Monthly Maintenance Log: complete
PR #352 post-351 authority reset: complete
PR #353 Record Depth & Coverage Baseline: active
PR #354 Tier A Dossier Deepening — Batch 1: next
```

This amendment activates the first implementation item under the post-351 data-growth operating mode.

## Binding references

```text
AGENTS.md
docs/spec-governance.md
docs/roadmap.md
docs/deployment-policy.md
docs/post-351-data-growth-operating-spec.md
docs/roadmap-amendments/2026-07-10-post-351-data-growth-activation.md
docs/quality/record-depth-coverage-baseline-spec.md
```

PR #353 must reuse reviewed Comparison Readiness and Facet Freshness derivations rather than invent conflicting readiness or freshness semantics.

Reviewed Compare preset configuration may be used only for product-leverage membership in Tier A queue refinement. It must not change dimension states, canonical values, readiness, freshness, or public Compare behavior.

## PR #353 purpose

PR #353 measures reviewed planning coverage across all current 110 canonical stable assets.

Required dimensions:

```text
identity
lifecycle
organization_relationships
mechanism_classification
reserve_structure
redemption
issuance
deployment
legal_profile
regulatory_notes
events
evidence_depth
known_unknowns
comparison_readiness
facet_freshness_support
canonical_market_access
```

Allowed planning states:

```text
strong
usable
partial
sparse
absent
not_applicable
```

## Output boundary

PR #353 outputs internal deterministic planning artifacts only.

Required outputs:

```text
record depth baseline artifact
reviewed Tier A candidate queue with explicit reasons
summary counts by dimension and planning state
input digests
```

The Tier A queue must not contain:

```text
numeric composite score
asset rank
best/worst framing
safety framing
investment recommendation
```

Queue order must be deterministic and non-ranking.

The reviewed Tier A queue must remain selective and bounded. Common cross-registry gaps must not automatically make every asset a candidate.

## Source boundary

Allowed inputs:

```text
reviewed canonical Registry v2 groups
reviewed canonical Registry v3 groups
reviewed income profile manifest data
Comparison Readiness derivation
Facet Freshness derivation
canonical Market Access Records
reviewed Compare preset configuration for product-leverage membership only
```

Forbidden inputs:

```text
monitoring artifacts
news discovery leads
unreviewed candidates
editorial research rows not promoted to canonical data
private notes
private source queues
candidate URLs
```

## Planning rule boundary

Planning states must be deterministic and auditable.

A planning state may use:

```text
canonical record presence
canonical record count
applicable field completeness
Comparison Readiness state
Facet Freshness support state
canonical Market Access record presence
```

Compare preset membership does not affect planning dimension states. It may affect queue membership only when the asset also has a material dossier gap under documented deterministic rules.

A state must not infer a factual negative claim.

For example:

```text
no Regulatory Note row
!= no regulatory issue

no Market Access Record
!= unavailable

no known-unknown row
!= nothing is unknown
```

These are planning coverage states only.

## Tier A queue refinement boundary

Queue membership may be justified by deterministic combinations of:

```text
historical importance with multiple material dossier gaps
comparison and evidence-maintenance leverage
reviewed Compare preset membership with material dossier gap
regional relevance with multiple material dossier gaps
```

Material dossier gaps exclude universal or broad cross-registry conditions that would make the queue non-selective by themselves.

Queue order remains:

```text
asset_slug_ascending_non_ranking
```

No queue position is an asset rank or priority score.

## Completion condition

PR #353 completes when:

- exactly 110 canonical assets are evaluated;
- every asset has exactly the 16 required dimensions;
- only allowed planning states appear;
- each dimension/state rule is documented in configuration or code and validated;
- repeated builds are byte-identical;
- summary counts reconcile with asset rows;
- Tier A queue members have explicit reasons;
- reviewed Compare preset membership is derived exactly from the preset configuration;
- reviewed Tier A queue remains selective and bounded;
- no numeric composite score or asset rank is emitted;
- forbidden private/candidate/monitoring inputs are not read;
- canonical data is unchanged;
- public route behavior is unchanged;
- dedicated PR #353 workflow and general non-regression workflows are green.

## Handoff

After PR #353 merges:

```text
PR #354 Tier A Dossier Deepening — Batch 1: active
```

PR #354 must select its assets from the reviewed PR #353 baseline and candidate queue and cite the explicit selection reasons.
