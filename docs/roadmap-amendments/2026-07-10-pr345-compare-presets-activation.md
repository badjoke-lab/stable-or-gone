# PR #345 Compare presets activation

Status: active roadmap amendment  
Updated: 2026-07-10

## Authoritative current workstream

```text
PR #343 deterministic comparison projection and machine-readable output: complete
PR #344 /compare/ v1: complete
PR #345 Compare presets: active
PR #346 access and regulation index generator: next
```

This amendment supersedes stale current-position wording in earlier roadmap amendments while preserving their historical implementation boundaries.

## Purpose

PR #345 adds bounded editorial shortcuts to `/compare/`.

Each preset may change only:

```text
selected asset slugs
visible facet groups
```

Presets must not change:

```text
canonical values
readiness
freshness
evidence boundaries
Market Access governance
unknown-state semantics
score policy
```

## Preset set

PR #345 defines exactly five presets:

```text
USD issuer-backed
Model contrast
Lifecycle outcomes
Protocol stablecoins
Legal and access focus
```

Each preset contains two to four unique canonical assets.

## URL boundary

Preset state is shareable through:

```text
preset
assets
groups
```

Preset-only URLs must normalize to explicit asset and non-default group state.

Manual asset or group changes must clear active preset identity while preserving the resulting custom comparison state.

## Facet-group boundary

Users may hide or show PR #344 presentation groups.

At least one facet group must remain visible.

Group visibility is presentation state only and must not alter the underlying 110 × 19 projection.

## Market Access boundary

PR #345 does not add Market Access Records and does not import PR #339 editorial research into the comparison matrix.

The legal/access preset only changes selected assets and visible groups. It consumes the same PR #343 canonical projection as every other comparison state.

## Completion condition

PR #345 completes when:

- exactly five preset definitions exist;
- all preset assets exist in the canonical comparison projection;
- all preset group IDs exist in PR #344 group config;
- preset buttons expose exclusive `aria-pressed` state;
- Model contrast applies four assets and two groups;
- manual group expansion clears preset identity and preserves custom URL state;
- manual asset change clears preset identity;
- preset-only URL restoration works;
- desktop and mobile preset interaction audits pass;
- no page-level horizontal overflow is introduced;
- general CI, responsive accessibility, screenshot capture, and dedicated PR #345 workflow are green;
- no canonical data, readiness, freshness, comparison projection, or statistics-history values change.

## Next item

After PR #345 merges, PR #346 is authorized to implement the access and regulation index generator.

PR #346 remains canonical-only and must preserve the PR #341 Market Access promotion and evidence-governance contract.
