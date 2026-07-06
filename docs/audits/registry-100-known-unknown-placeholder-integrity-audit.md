# SOG 100-Record Known-Unknown and Placeholder Integrity Audit

- Audit ID: `sog_registry_100_known_unknown_placeholder_integrity_pr308`
- Audit date: `2026-07-06`
- Baseline family: Registry v2 baseline with overlays through batch U
- Stable assets: **100**
- Organizations: **94**
- Known-unknown rows: **289**
- Assets with known-unknown coverage: **100**

## Result

PASS after one wording correction.

The initial audit found one known-unknown description that was structurally valid but too short and generic for the audit's minimum specificity threshold:

```text
sog_ku_usd3_upgrade_batch_t
```

The row was corrected to describe the unresolved Reserve Protocol 4.2.0 execution status, implementation timing, deployed contract changes, and on-chain completion evidence. No canonical fact was filled in and the row remains unresolved.

Final integrity result:

```text
duplicate known-unknown IDs: 0
invalid stablecoin references: 0
invalid issuer references: 0
invalid severity values: 0
invalid or future review dates: 0
generic topics: 0
generic or weak descriptions: 0
structural placeholder findings: 0
assets without known-unknown coverage: 0
```

## Coverage

All 100 canonical stable assets have at least one known-unknown row.

```text
minimum rows per asset: 1
maximum rows per asset: 7
```

Coverage is not treated as a completeness score. An asset with one unresolved item is not more complete or safer than an asset with seven. The count reflects the current reviewed decomposition of unresolved knowledge.

## Review-age queue

At the 2026-07-06 audit checkpoint:

```text
known-unknown rows older than 30 days: 44
```

These remain review queues. Age alone does not authorize automatic deletion, resolution, field filling, or downgrade. A stale row may still be accurate as an unresolved statement until reviewed evidence changes it.

## Explicit unknown-value semantics

The registry-wide structural scan inventories explicit unresolved value states rather than treating them as defects.

```text
source_review_needed: 87
unknown: 50
not_recorded: 0
not_applicable: 35
```

`null` values are also preserved according to their field semantics and are not converted merely to satisfy completeness.

These values are intentionally different from structural placeholders.

## Placeholder integrity boundary

The audit scans structural identity-like fields including IDs, URLs, dates, addresses, contracts, and identifiers for placeholder-like values.

Examples treated as defects include:

```text
TODO / TBD / TBC identity values
placeholder identity strings
example.com or localhost URLs
placeholder.invalid URLs
fabricated sentinel dates such as 0000-00-00
```

Final result:

```text
structural placeholder findings: 0
```

The audit deliberately does not classify the following as placeholders merely because they represent unresolved knowledge:

```text
null
unknown
not_recorded
not_applicable
source_review_needed
```

## Duplicate review

The audit checks:

```text
exact duplicate IDs
normalized duplicate asset/topic pairs
normalized duplicate descriptions
```

No duplicate ID, asset/topic, or normalized-description finding remained in the reviewed checkpoint.

## Data preservation

This audit does not change canonical asset, organization, relationship, event, evidence, reserve-context, deployment, or regulatory-note counts.

The only canonical data change in PR #308 is a wording clarification to one existing USD3 known-unknown description. The unresolved state, stablecoin reference, issuer reference, topic, severity, review date, and notes remain unchanged.

## Next item

After PR #308, the next scheduled item is:

```text
PR #309 monitoring coverage recalculation for 100 assets
```

PR #309 must distinguish issuer/protocol source reach from EU market-access platform-policy coverage and must not treat general issuer monitoring as proof of function-level platform access monitoring.
