# Compare Feedback and Stablecoin Logo Maintenance Spec

Updated: 2026-08-12  
Status: implementation contract after authority merge

## Scope

This specification governs the bounded maintenance lane authorized by `config/compare-logo-maintenance-authority.json`.

It covers exactly four outcomes:

1. make the comparison-difference control visibly understandable even when it has no row-removal effect;
2. show the existing audited Stablecoin mark system in Compare record headers;
3. re-audit the current 21 neutral-logo fallbacks and promote only marks with sufficient Stablecoin/product attribution;
4. make logo disposition a permanent blocking part of future canonical stablecoin growth.

Canonical registry content is frozen by this authority.

## 1. Compare matching-row control

### Semantics

The control means:

```text
hide a comparison row only when every selected record has the same normalized displayed value for that attribute
```

It does not mean “show important differences”, rank records, score records, or suppress unknown/not-recorded values merely because they are unknown.

### Label and feedback

The implementation should prefer a plain-language label such as `Hide matching rows`. If the existing `Differences only` wording is retained for compatibility, adjacent feedback must make the exact behavior equally clear.

When the control is enabled, the comparison UI must expose a live textual result containing at least:

```text
differing attribute count
matching rows hidden count
```

If the selected records already differ on every displayed attribute, the UI must state explicitly that there are no matching rows to hide. A control activation that causes no visible row change must never appear to be ignored.

When the control is disabled, the full aligned comparison rows must return.

### Blocking interaction tests

At least two deterministic selection fixtures are required:

- one selection with one or more matching rows so enabling the control reduces the visible comparison-row count;
- one selection where all displayed comparison rows differ so enabling the control preserves the row count but displays the explicit no-op explanation.

The test must then disable the control and verify restoration of the complete row set.

## 2. Compare Stablecoin marks

Every selected Compare column must show the same mark result that the corresponding record receives elsewhere in the product:

```text
audited local Stablecoin/product logo
or
shared neutral monogram fallback
```

The implementation must reuse `StablecoinMark` output and `stablecoinLogo` resolver semantics. The preferred shape is to render the mark in the existing hidden comparison source and clone/reuse that output when the JavaScript comparison header is constructed.

Prohibited:

- a second Compare-only logo mapping table;
- symbol-only guessing outside the existing audited allow-list;
- runtime image fetching from third-party hosts;
- issuer/project artwork substituted for a Stablecoin logo without reviewed asset-specific attribution;
- generated substitute brand artwork.

The mark remains decorative; adjacent name and symbol remain authoritative.

## 3. Current fallback re-audit

The review population is exactly the 21 baseline fallback slugs frozen in `config/compare-logo-maintenance-authority.json`.

Each record receives exactly one fresh disposition:

```text
direct_logo
neutral_fallback
```

A `direct_logo` result requires a Stablecoin-specific or product-specific mark attributable to the same canonical asset. Sources may include first-party product sites/docs/repositories or a pinned third-party asset repository only when identity is independently bound to the same canonical asset, such as by exact deployment identity or another reviewed non-ambiguous identifier.

A `neutral_fallback` result is required when review finds only:

```text
issuer-level artwork
protocol/project-level artwork
generic directory artwork without sufficient asset binding
ambiguous symbol-based artwork
unverifiable or unattributable imagery
```

Every reviewed disposition must record source/provenance, mark type, identity basis, evidence/rationale, and local asset path or explicit null.

`mnee`, `bison-bank-eub`, and `bison-bank-usb` are priority rechecks, but priority does not imply a required promotion outcome.

## 4. Eligible logo import rules

Only marks accepted by the reviewed fallback re-audit may be added in the implementation phase.

Accepted files must:

- be vendored under the existing local Stablecoin-logo asset family;
- have provenance and source/license information recorded;
- resolve by canonical slug first;
- preserve the existing collision-safe symbol fallback policy;
- avoid external runtime dependencies;
- preserve equivalent geometry between direct logos and neutral fallback marks.

The public logo README and machine display policy must be synchronized to the final reviewed counts.

## 5. Permanent future record-growth requirement

For every new canonical stablecoin added after this lane, logo disposition becomes part of record-entry completeness.

Before merge, the new canonical slug must have a reviewed logo decision containing at least:

```text
canonical slug
canonical name
symbol
decision
mark type
source page
source asset URL or explicit null
source class
identity basis
evidence or reason for fallback
asset path or explicit null
transformation or none
```

The absence of a usable direct logo is acceptable. The absence of a reviewed disposition is not.

Core validation must fail if:

- a canonical stablecoin slug has no logo disposition;
- the total reviewed logo dispositions do not equal the canonical stablecoin count;
- a direct-logo decision points to a missing local asset;
- a direct-logo asset is not mapped consistently by the resolver/display policy;
- a neutral fallback is not explicitly represented by policy;
- a PR adds a canonical stablecoin but does not run the Stablecoin logo coverage validation.

This requirement is permanent and applies to future growth batches even when the growth work item does not otherwise modify public UI.

## 6. Visual acceptance

Material Compare changes require direct artifact review under `docs/ui-v3-remediation-authority.md`.

Changed states must include at least:

```text
desktop direct-logo Compare header
desktop neutral-fallback Compare header
mobile direct-logo Compare header
mobile neutral-fallback Compare header
matching-row toggle removes rows
all-different toggle displays explicit no-op feedback
```

No page-level horizontal overflow, clipping, footer overlap, essential ellipsis, or control-target regression is permitted.

## 7. Preserved behavior

The maintenance implementation must preserve:

- 2–4 selected records;
- fifth-selection rejection;
- URL selection order and history restoration;
- explicit `Unknown` and `Not recorded` states;
- existing comparison sections and aligned record columns unless a separately reviewed specification changes them;
- fixed Compare dock/footer non-overlap behavior;
- bounded horizontal matrix scrolling on mobile;
- canonical-only public data;
- no ranking, score, recommendation, winner/loser language, or safety inference.

## 8. Canonical boundary

```text
Entry main: e28e60beeea07a0a6dfd7af217d2c3b9ac616bbd
Stable assets: 119 -> 119
Organizations: 109 -> 109
Relationships: 131 -> 131
Events: 194 -> 194
Evidence: 585 -> 585
Evidence Relations: 585 -> 585
Market Access Records: 12 -> 12
Archive recorded / not recorded: 471 / 114 -> 471 / 114
Canonical hash: sha256:4e7570b6fab88a8178a01ae280a36d98787573b376440b891491f25469458798 unchanged
Canonical file count: 466
```

Logo display configuration/assets and UI code are public-presentation maintenance, not canonical registry mutation.
