# Value-state normalization audit

Date: 2026-06-27  
Scope: Phase 2 / PR 13  
Status: PASS after PR #180 merges

## Purpose

This audit defines how SOG distinguishes an actual reviewed value from missing, unresolved, non-applicable, non-public, unverified, disputed, or approximate information.

The repair does not infer facts that are absent from canonical records. It preserves canonical raw values and adds a reviewed public presentation layer.

## Approved public states

```text
known
unknown_after_review
not_recorded
not_applicable
not_public
unverified
disputed
approximate
```

Public labels:

```text
Known
Unknown after review
Not yet recorded
Not Applicable
Not publicly disclosed
Not yet verified
Disputed
Approximate
```

## Canonical inventory coverage

The collector scans every source file listed by the protected Registry v2 baseline.

```text
Canonical source files scanned: 236
Canonical records scanned:    2,167
Scalar values scanned:        31,908
Canonical data groups:            14
```

Protected record checkpoints covered:

```text
Stable assets:     92
Organizations:     86
Relationships:    101
Events:           150
Evidence:         455
Known unknowns:   253
Deployments:      130
```

## Reviewed raw-signal inventory

Reference IDs, slugs, URLs, and related reference fields are excluded from ordinary value-state detection unless they contain a compact workflow placeholder. Narrative prose is counted separately from direct field values.

```text
Direct-value findings:     1,227
Narrative-text findings:      39
Excluded reference scalars:  435
```

Direct-value signals:

```text
Null value:                 999
Work-queue placeholder:     111
Explicit unknown:            64
Not-applicable marker:       46
Approximate marker:           4
Not-recorded marker:          2
Mixed placeholder:            1
```

Narrative-text signals:

```text
Explicit unknown wording:    23
Approximate wording:           8
Not-recorded wording:          4
Work-queue wording:            3
Unverified wording:            1
```

Narrative findings are audit signals only. A sentence is not rewritten merely because it contains words such as `unknown`, `estimated`, or `review needed`.

## High-volume direct fields

The inventory confirmed that the largest clusters are not semantically interchangeable:

```text
Evidence published_at
Evidence-relation published_at
Relationship end_date
Event recovery_date
Deployment contract_address
Stable-asset discontinued_date
Event recovered
Relationship start_date
Reserve-report asset_categories
Organization jurisdiction
Stable-asset minimum_redemption
Event failure_mechanism
Stable-asset launch_date
Deployment status
```

Examples:

- an absent evidence publication date is `not_recorded`;
- an event recovery date may be `not_applicable`, `unknown_after_review`, or `not_recorded` depending on the reviewed recovery category;
- a deployment identifier under source review is `unverified`, not an identifier value;
- a known-unknown record is `unknown_after_review`, not an accidental blank;
- an explicit canonical `unknown` differs from a field that was never recorded.

## Public implementation

The shared resolver is used by:

```text
Evidence rows
Deployment tables
Structured event details
Event detail summaries
Organization detail pages
Stablecoin overview fields
Stablecoin reserve profiles
Stablecoin redemption profiles
Reserve-report history
Regulatory notices
Known-unknown tables
```

Every rendered state includes a public text label and a `data-value-state` attribute. The meaning does not depend on color alone.

## Known unknowns

Known-unknown records remain first-class canonical records.

The stablecoin detail table now displays an explicit `Unknown after review` state for each open question. The description, severity, and last-checked date remain separate fields.

A known-unknown record is never reduced to:

```text
blank
—
missing data
not applicable
```

## Deployment-specific mapping

PR 12 already separated deployment operational, canonicality, verification, contract-identity, and network-record states. PR 13 maps those public results to the shared value-state vocabulary without destroying the deployment-specific taxonomy.

```text
Recorded identifier                -> known
Identifier/source review needed    -> unverified
Identifier not recorded            -> not_recorded
Unresolved N/A-or-review marker     -> unknown_after_review
Canonicality explicitly unknown    -> unknown_after_review
Canonicality field absent          -> not_recorded
Explicitly verified deployment     -> known
Other unresolved verification      -> unverified or unknown_after_review
```

## Machine-readable output

`version.json` and `data/manifest.json` now include canonical-only value-state breakdowns for selected public fields:

```text
public_value_state_definitions
stablecoin_symbol_value_state
stablecoin_launch_date_value_state
stablecoin_discontinued_date_value_state
organization_jurisdiction_value_state
relationship_start_date_value_state
relationship_end_date_value_state
event_date_value_state
event_recovery_date_value_state
evidence_published_at_value_state
reserve_report_date_value_state
known_unknown_record_value_state
deployment_canonicality_value_state
deployment_verification_value_state
deployment_contract_identity_value_state
```

The field-level migration inventory is a CI diagnostic. It is not published as canonical public data because it contains repository paths and review-oriented details.

## Validation

The build now verifies:

- the exact eight-state registry and order;
- public-taxonomy label and filterability parity;
- coverage of all protected canonical record checkpoints;
- direct-value and narrative-text inventory separation;
- required public rendering surfaces;
- absence of internal workflow literals from protected public surfaces;
- preservation of mobile table identities and fields;
- exact `version.json` and manifest value-state breakdown parity.

## Non-inference rules

- Do not convert every null to `unknown_after_review`.
- Do not convert every null to `not_applicable`.
- Do not infer public disclosure merely because a field is absent.
- Do not infer verification from identifier syntax or source presence.
- Do not rewrite narrative text solely from keyword detection.
- Do not use `—` unless accessible context preserves the exact state.
- Do not collapse `unknown_after_review` and `not_recorded`.
- Do not treat a known-unknown record as a data-entry defect.
- Do not change primary organization selection in this PR.
- Do not deduplicate evidence in this PR.

## Preserved boundaries

This PR does not:

- add, delete, merge, or renumber canonical records;
- change organization relationship priority;
- deduplicate evidence identities;
- select Batch 18;
- change production deployment policy;
- deploy production.

## Remaining work

```text
PR 14  explicit primary display relationships
PR 15  evidence-source deduplication with claim preservation
PR 16  record-specific copy migration and complete 92-record taxonomy audit
```
