# Roadmap amendment — PR #319 maintenance insertion and remaining-plan renumbering

Status: active roadmap amendment  
Date: 2026-07-06

## 1. Reason

While PR #318 remained open, PR #319 was consumed by a narrow guide-layout maintenance fix:

```text
PR #319
Fix guide article list clipping and spacing
Merge commit: 547c639df35e39f657a77bbfd82a49a988877367
```

The change is a shared guide presentation fix. It changes two UI files and does not change canonical stablecoin, organization, event, evidence, deployment, or machine-readable registry data.

The planned PR #319 work item was:

```text
non-UI release material
```

That planned work did not occur in PR #319 and must not be represented as complete.

## 2. Rule applied

Per repository governance for inserted urgent or verified-breakage work:

```text
record the inserted work
preserve actual merge history
move the displaced planned item to the next unused PR number
renumber every later planned item without changing work order or scope
update roadmap and active-workstream authority before planned work resumes
```

PR #320 did not exist when this amendment was prepared.

## 3. Corrected remaining sequence

### Phase B — remaining non-UI release hardening

```text
PR #318 audited 100-record canonical checkpoint — active
PR #319 guide article spacing maintenance — complete, inserted work
PR #320 non-UI release material
```

### Phase C — monitoring expansion and operation

```text
PR #321 100-asset monitoring baseline synchronization
PR #322 reserve and redemption source expansion
PR #323 lifecycle, regulatory, and EU market-access source/schema expansion
PR #324 bounded scheduled read-only monitoring
```

### Phase D — statistics implementation

```text
PR #325 deterministic statistics generator and validator
PR #326 immutable checkpoint history
PR #327 /stats/ foundation
PR #328 historical, deployment, organization, and data-quality statistics
```

### Phase E — candidate audit and controlled growth from 100 to 110

```text
PR #329 next candidate audit
PR #330 100 -> 102
PR #331 102 -> 104
PR #332 104 -> 106
PR #333 106 -> 108
PR #334 108 -> 110
```

### Phase F — Comparison Foundation

```text
PR #335 define Comparison Readiness contract and audit method
PR #336 audit all 110 assets for comparison readiness
PR #337 normalize comparison-critical gaps and validators
PR #338 define canonical Market Access Record schema and governance
PR #339 define facet-freshness derivation contract and validators
```

### Phase G — Compare

```text
PR #340 deterministic comparison projection generator and machine-readable output
PR #341 /compare/ v1
PR #342 Compare presets
```

### Phase H — Change Research Tools

```text
PR #343 access and regulation index generator
PR #344 Access & Regulation Explorer
PR #345 change-timeline projection generator
PR #346 Change Timeline UI
```

### Phase I — Reviewed Public Update Layer

```text
PR #347 SOG Registry Update feed/page
PR #348 Monthly Stablecoin Change Log
```

### Optional Phase J — Query Translation

```text
PR #349+ natural-language filter translation only after separate approval
```

## 4. Scope preservation

This amendment changes numbering only.

It does not:

- change the order of planned work;
- change monitoring safety boundaries;
- move statistics ahead of monitoring;
- move growth ahead of candidate audit;
- activate comparison work before the reviewed 110-asset checkpoint;
- convert monitoring observations into canonical Market Access Records;
- authorize automated canonical writes or automatic guide editing.

## 5. Production checkpoint interaction

PR #319 changed presentation only and is already the current production source commit at the time of this amendment.

The PR #318 audited canonical checkpoint continues to record the canonical source checkpoint from merged PR #317:

```text
9a106f0938e6323de833c941d6ae863050f1f03b
```

Production verification for PR #318 therefore validates canonical checkpoint hash, canonical file count, reviewed counts, route parity, provenance, and exact public output integrity rather than requiring the public deployment commit to equal the older checkpoint source commit exactly.

A later production release is acceptable only when its canonical checkpoint content remains identical and all production verification gates pass.

## 6. Authority update requirement

Before PR #318 merges, update:

```text
docs/roadmap.md
AGENTS.md
docs/spec-governance.md
docs/quality/non-ui-quality-program.md
scripts/check-workstream-100.mjs
```

The corrected next planned item after PR #318 is:

```text
PR #320 non-UI release material
```
