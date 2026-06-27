# Evidence source identity deduplication audit

Date: 2026-06-27  
Scope: Phase 2 / PR 15

## Purpose

SOG previously stored one evidence row for each research or claim context. The same public URL could therefore appear several times on a page even though the rows referred to one underlying source page.

PR 15 separates:

```text
canonical evidence record
public source identity
evidence relation
```

The raw evidence records remain available for audit history. Public pages show one source identity with the union of supported assets, organizations, events, and claim scopes.

## Canonical baseline

```text
Canonical evidence records:       455
Unique evidence IDs:              455
Duplicate evidence IDs:             0
Exact duplicate URL groups:        32
Records inside duplicate groups:   77
URL groups with repeated titles:    5
Duplicate URL-title keys:            7
Normalized-only URL groups:          0
```

## Approved identity migration

```text
Approved source identity groups:    32
Alias evidence IDs:                 45
Public source identities:          410
Public duplicate URL groups:         0
Evidence relations preserved:      455
Relation source identities:        410
Orphan relation source IDs:          0
```

The identity equation is:

```text
410 public source identities
+45 alias evidence records
=455 canonical evidence records
```

## Classification review

The initial audit found:

```text
Exact metadata identity with different relations:  3 groups
Same URL with metadata variants:                  29 groups
```

All 32 groups were reviewed as one public source identity because every member used the exact same source URL. Differences such as event-specific titles, source-type wording, publisher wording, or access dates remain represented through the canonical source metadata and preserved evidence relations.

## Canonical identity rules

Each approved group records:

```text
canonical evidence ID
alias evidence IDs
exact public URL
```

The approved mappings are split across:

```text
config/evidence-source-groups-a.mjs
config/evidence-source-groups-b.mjs
config/evidence-source-groups-c.mjs
config/evidence-source-groups-d.mjs
```

The combined registry and alias resolver are defined in:

```text
config/evidence-source-identities.mjs
config/evidence-source-deduplication.mjs
```

## Metadata merge rules

- the approved canonical evidence row supplies the public identity and base metadata;
- the newest reviewed access date is retained;
- a timestamped archive is preferred over a wildcard archive entry;
- the strongest already-recorded reliability value is retained without inventing a new assessment;
- stablecoin, organization, event, and claim-scope arrays are unioned;
- every removed public row remains addressable as a source alias ID;
- conflicting publication dates fail validation rather than being silently selected;
- a changed URL set fails validation.

## Relation preservation

Every original evidence record still projects one evidence relation. Alias evidence IDs are rewritten to the approved canonical source identity ID only in the relation projection.

The following remain unchanged in coverage:

```text
stablecoin relations
organization relations
event relations
claim scopes
relation count
```

The validator confirms that every merged source identity matches the exact union from its audit group.

## Public behavior

`EvidenceSourceTable.astro` receives the existing page-specific evidence selection, resolves each evidence ID to its canonical source identity, and renders each identity once.

Each rendered row shows the union of supported claim scopes. The table also exposes internal diagnostic attributes for evidence-record count and source-identity count, allowing responsive and regression tests to distinguish relations from public rows.

## Machine-readable behavior

`version.json` and `data/manifest.json` retain the canonical evidence count and add source-identity fields, including:

```text
evidence_source_identities
evidence_source_identity_groups
evidence_source_aliases
evidence_duplicate_public_rows_removed
evidence_canonical_relations
evidence_relation_source_identities
evidence_orphan_relation_source_ids
```

They also publish source-identity category, provenance, primary-state, reliability, and archive-state distributions.

## Registry statistics

Registry statistics now publish a dedicated `evidence_source_identities` section and preserve:

```text
canonical evidence records: 455
public source identities:    410
evidence relations:          455
source aliases:               45
public duplicate URL groups:   0
```

## Validation

CI now rejects:

- a missing canonical or alias evidence ID;
- a source identity group whose URL changes;
- conflicting publication dates inside a group;
- an unapproved duplicate URL group;
- an alias that remains as a separate public source row;
- a public duplicate URL after projection;
- lost stablecoin, organization, event, or claim-scope coverage;
- an evidence relation pointing to a missing source identity;
- source-identity statistics that differ from a fresh deterministic build.

## Preserved boundaries

This PR does not:

- delete the 45 alias evidence records from repository data;
- reduce the 455 evidence-relation count;
- change event, organization, stablecoin, or deployment identities;
- rewrite record-specific public copy;
- select Batch 18;
- deploy production.

## Next

```text
PR 16  move record-specific public copy and complete the 92-record migration
```
