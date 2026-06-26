# SOG evidence taxonomy normalization audit

Status: supporting audit  
Recorded: 2026-06-26  
Phase: 2 / PR 11  
Checkpoint: 455 evidence records and 455 projected evidence relations

## Purpose

This audit separates concepts that were previously mixed inside `source_type` and `reliability`.

The normalized public layer keeps the following axes distinct:

```text
public source category
canonical source type
source provenance
primary or secondary state
reliability
publisher identity
publication date
original URL
archive URL and archive state
claim scope
subject relation
record confidence
```

A source being primary does not automatically make every claim reliable. An explorer or repository is a provenance/type signal, not a reliability grade.

## Canonical coverage

```text
Evidence records:                    455
Projected evidence relations:       455
Canonical source types:              75
Duplicate evidence IDs:               0
Records with subject relations:     455
Records with claim scopes:          455
Records with publisher:             455
Records with reliability value:     455
Records with publication date:      151
Records with accessed date:         419
Records with archived URL:          282
Explicit v2 relation origins:       361
Legacy subject projections:          94
Multi-subject records:              421
Multi-claim records:                307
```

Generated diagnostics:

```text
data/generated/evidence-taxonomy-migration.json
data/generated/evidence-taxonomy-validation.json
```

Validation command:

```text
npm run validate:evidence-taxonomy
```

## Public evidence categories

| Category | Count |
|---|---:|
| Official documentation or product page | 200 |
| Official statement or announcement | 141 |
| Reserve, assurance, or financial report | 19 |
| Technical documentation or repository | 18 |
| On-chain record or explorer | 17 |
| Governance record | 15 |
| Independent news or analysis | 11 |
| Legal terms or disclosure | 11 |
| Research or security report | 9 |
| Archive or historical record | 5 |
| Regulatory or court record | 5 |
| Data or market reference | 4 |
| Other or not yet classified | 0 |
| **Total** | **455** |

The canonical 75-value `source_type` vocabulary remains preserved. The public category is a browsing and comparison layer, not a replacement for the canonical type.

## Source provenance

| Provenance | Count |
|---|---:|
| Subject-controlled source | 363 |
| Technical primary source | 31 |
| Independent third-party source | 20 |
| Governance primary source | 14 |
| Assurance or financial-report source | 13 |
| Archive capture | 5 |
| Government, regulator, or legal source | 5 |
| Data or market aggregator | 4 |
| Unknown | 0 |
| **Total** | **455** |

Provenance identifies who or what produced the source. It does not grade truthfulness by itself.

## Primary or secondary state

```text
Primary source:   431
Secondary source:  24
Unknown:            0
```

The state is derived from the reviewed canonical source-type mapping until dedicated canonical fields are added. It remains separate from reliability.

## Reliability normalization

Canonical raw values currently contain both reliability grades and provenance/type-like values.

Reviewed public reliability:

```text
High:    356
Medium:   63
Low:       0
Unknown:  36
```

The following raw values are not treated as reliability grades:

```text
primary:                         28
explorer:                         3
primary_repository:               2
primary_interface:                1
primary_or_ecosystem_dashboard:   1
primary_repository_index:         1
```

All 36 are displayed as public reliability `Unknown`. Their original raw value remains visible for compatibility and later canonical cleanup. SOG does not infer `High` merely because a source is primary, an explorer, or a repository.

## Archive state

```text
Archive index or wildcard: 282
No archive recorded:       173
Direct archived snapshot:    0
Other archive reference:     0
```

Original and archived URLs remain separate. An archived URL never silently replaces source identity.

## Evidence relation origin

```text
Explicit v2 relation origin: 361
Legacy subject projection:    94
```

The loader projects both groups into complete public subject and claim arrays. The public manifest preserves the origin distinction so that migration history is not lost.

## Duplicate URL inventory

```text
Duplicate URLs:             32
Duplicate URL-title pairs:   7
```

No evidence record is merged or deleted in PR 11. One URL can support different subjects or claims, and duplicate-looking records can preserve distinct relation semantics. Deduplication is reserved for PR 15, where claim preservation is an explicit requirement.

## Public presentation

The shared evidence table is used by stablecoin, organization, and event detail pages. It displays:

```text
Source
Publisher
Source category
Canonical source type
Provenance
Primary or secondary
Supported claims
Archive state and archive link
Normalized reliability
Recorded raw reliability when it differs
```

All eight material columns are protected by mobile information-preservation validation.

## Machine-readable and statistics output

Public machine-readable breakdowns expose:

```text
public_evidence_category
canonical_evidence_source_type
evidence_source_provenance
evidence_primary_state
evidence_reliability
canonical_evidence_reliability_raw
evidence_archive_state
evidence_relation_kind
evidence_claim_scope_non_exclusive
```

Registry statistics expose equivalent composition axes and quality counters for unresolved reliability, unresolved provenance, unresolved primary state, missing archives, polluted compatibility values, and duplicate URLs preserved for review.

## Authoritative mapping files

```text
config/evidence-taxonomy.mjs
config/evidence-relation-kinds.mjs
src/utils/evidenceTaxonomy.ts
```

## Validation guarantees

The validator rejects:

- missing or duplicate evidence identities;
- evidence without a subject relation or claim scope;
- unmapped canonical source types;
- unresolved public category, provenance, or primary state for current records;
- invalid public reliability or archive state;
- changed category distributions without explicit review;
- changed multi-subject or multi-claim counts;
- silent deletion or merging of the duplicate-URL inventory;
- promotion of polluted reliability values to inferred quality grades;
- evidence tables that omit category, provenance, primary state, claims, archive, or reliability;
- mobile presentation that hides the normalized evidence fields.

## Non-scope

This work does not:

- merge duplicate evidence records;
- change canonical evidence IDs, URLs, publishers, dates, claim scopes, or subject relations;
- replace original URLs with archive URLs;
- infer low or high reliability from provenance alone;
- normalize deployment status;
- change canonical record counts;
- deploy production.
