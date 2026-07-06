# Stable or Gone roadmap amendment — editorial insertions and PR renumbering

Status: canonical roadmap amendment — active  
Date: 2026-07-06  
Applies to: `docs/roadmap.md`, `AGENTS.md`, `docs/spec-governance.md`, `docs/quality/non-ui-quality-program.md`, and numbered implementation references in `docs/comparison-and-change-product-spec.md`

## Purpose

This amendment records the owner-directed editorial corrections inserted after PR #309 and renumbers the remaining implementation schedule without changing the approved work order or scope.

The editorial insertions were required factual updates to the published EU/EEA stablecoin-access guide. They consumed PR numbers that had previously been reserved in planning documents for later non-UI hardening work.

Repository governance requires consumed PR numbers and deviations to be recorded explicitly rather than pretending the original numeric sequence remained available.

## Recorded deviation

```text
PR #310  parity audit branch opened but superseded by the implementation path completed in PR #311
PR #311  Registry v2/v3 and machine-readable parity implementation — merged
PR #312  Ripple EU CASP status guide update — merged
PR #313  first EEA-scope follow-up implementation — closed without merge
PR #314  corrected guide follow-up implementation — merged
PR #315  this schedule amendment and renumbering — active
```

PR #311 fulfills the original roadmap work item named `Registry v2/v3 and machine-readable parity`.

PR #312 and PR #314 are narrow owner-directed factual editorial interruptions. PR #313 is retained as explicit unmerged history.

The guide updates do not replace canonical registry records, do not create canonical market-access records, and do not change the review-only monitoring boundary.

## New current position

```text
Current reviewed main checkpoint before this amendment:
24c7d9e87becfa3fe182d42ee70b02332c00f8d2

Canonical stable assets: 100
Organizations: 94
Relationships: 110
Events: 172
Evidence: 502
Evidence relations: 502
Deployments: 140
Detail routes: 366

Registry v2/v3 and machine-readable parity: complete via PR #311
Current item: PR #315 schedule amendment and PR renumbering
Next implementation item: PR #316 counts, manifest, version, and provenance integrity
```

## Renumbered implementation schedule

The approved work order is unchanged. Only PR identifiers after the parity item are reassigned.

### Phase B — remaining non-UI release hardening

```text
PR #316  counts, manifest, version, and provenance integrity
PR #317  reproducible build and generated-output audit
PR #318  audited 100-record canonical checkpoint
PR #319  non-UI release material
```

### Phase C — monitoring expansion and operation

```text
PR #320  100-asset monitoring baseline synchronization
PR #321  reserve and redemption source expansion
PR #322  lifecycle, regulatory, and EU market-access source/schema expansion
PR #323  bounded scheduled read-only monitoring
```

Target monitoring cadence after PR #323 remains:

```text
platform policy sources: daily
platform announcement sources: daily
news discovery: daily
ESMA and regulatory registers: weekly
issuer regulatory/transparency sources: weekly unless a stricter cadence is already defined
article stale-state review: weekly
```

Monitoring remains review-only and read-only. It may not write canonical data, accept its own baselines, create branches or pull requests automatically, edit guides automatically, publish candidates, or deploy.

### Phase D — statistics implementation

```text
PR #324  deterministic statistics generator and validator
PR #325  immutable checkpoint history
PR #326  /stats/ foundation
PR #327  historical, deployment, organization, and data-quality statistics
```

Statistics remain derived from reviewed canonical data and do not become price, market-cap, APY, safety, transparency, or risk rankings.

### Phase E — candidate audit and controlled growth to 110

```text
PR #328  next candidate audit
PR #329  100 -> 102
PR #330  102 -> 104
PR #331  104 -> 106
PR #332  106 -> 108
PR #333  108 -> 110
```

Each growth PR remains limited to two new stable assets and must preserve all applicable supporting record groups and explicit unknown states.

### Phase F — Comparison Foundation

```text
PR #334  define Comparison Readiness contract and audit method
PR #335  audit all 110 assets for comparison readiness
PR #336  normalize comparison-critical gaps and validators
PR #337  define canonical Market Access Record schema and governance
PR #338  define facet-freshness derivation contract and validators
```

Phase F still starts only after the reviewed 110-asset checkpoint. It remains data- and contract-first.

### Phase G — Compare

```text
PR #339  deterministic comparison projection generator and machine-readable output
PR #340  /compare/ v1
PR #341  Compare presets
```

Compare remains factual side-by-side research. It must preserve unknown states, evidence scope, jurisdiction scope, function scope, and date scope.

### Phase H — Change Research Tools

```text
PR #342  access and regulation index generator
PR #343  Access & Regulation Explorer
PR #344  change-timeline projection generator
PR #345  Change Timeline UI
```

The Access & Regulation Explorer may share discovery surfaces while preserving separate canonical legal/regulatory and market-access record families.

### Phase I — Reviewed Public Update Layer

```text
PR #346  SOG Registry Update feed/page
PR #347  Monthly Stablecoin Change Log
```

These surfaces derive from reviewed merged canonical changes and are not raw monitoring feeds or automatic news digests.

### Optional Phase J — Query Translation

```text
PR #348+  natural-language filter translation only after separate approval
```

The optional natural-language layer may translate user requests into structured filters. It may not bypass canonical data, evidence, unknown-state semantics, or scoped query constraints.

## Supersession rule for old numeric references

For PR numbering only, this amendment and the updated `docs/roadmap.md` supersede older numeric references in subordinate implementation plans and product specifications.

The work content, phase order, safety boundaries, data semantics, monitoring review boundary, statistics rules, growth limits, and post-110 product direction are unchanged.

Any future inserted urgent factual correction, verified public breakage fix, owner-directed dated editorial work, or security fix must again record consumed PR numbers before the planned sequence resumes.
