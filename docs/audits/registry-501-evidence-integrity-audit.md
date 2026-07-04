# SOG 501-Record Evidence and Source-Identity Integrity Audit

- Audit ID: `sog_registry_501_evidence_integrity_pr299`
- Baseline: `sog_registry_v2_reserve_source_context_2026_06_25_batch_o_batch_p_batch_q_batch_r_batch_s_batch_t`
- Canonical evidence records: **501**
- Public source identities: **455**
- Evidence relations: **501**
- Source identity groups: **33**
- Source aliases: **46**
- Critical findings: **0**

## Identity and Relation Integrity

```text
exact duplicate URL groups: 33
normalized-only duplicate URL groups: 0
public duplicate URL groups: 0
orphan relation source identities: 0
public source identities without canonical relations: 0
```

All 33 exact duplicate canonical URL groups are covered by approved source-identity mappings. The 46 alias evidence IDs collapse into 33 reviewed source-identity groups while preserving all canonical evidence relations and relation unions.

## Metadata Integrity

```text
publisher not recorded: 0
reliability not recorded: 0
claim scope not recorded: 0
unknown public evidence category: 0
unknown provenance: 0
unknown primary state: 0
unknown reliability: 0
```

The audit also verifies source URL validity, archived URL syntax when present, stablecoin references, organization references, event references, subject coverage, and public source projection.

## Archive Coverage Queue

Archive state:

```text
archive_index: 328
not_recorded: 173
```

The 173 records without a recorded archive remain an explicit data-quality queue. Absence of an archive URL does not invalidate an otherwise reviewed source and is not converted into a critical evidence-integrity finding.

Future archive work must preserve the distinction between:

- a direct historical snapshot;
- an archive index or wildcard entry;
- another archive reference;
- no archive recorded.

No archive state may be fabricated from an unverified URL.

## Result

PASS. Canonical evidence IDs, URL identity grouping, public source projection, subject references, and relation unions are structurally valid.

PR #299 closes with:

```text
canonical evidence: 501
public source identities: 455
evidence relations: 501
source identity groups: 33
source aliases: 46
critical findings: 0
archive not-recorded queue: 173
```

The next registry-wide audit item is PR #300: reserve, redemption, and backing applicability across all 100 assets.
