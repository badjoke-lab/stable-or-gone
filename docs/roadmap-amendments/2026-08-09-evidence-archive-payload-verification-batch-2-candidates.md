# 2026-08-09 — Evidence Archive Payload Verification Batch 2 Candidate Handoff

## Decision

The merged Batch 2 review authority is now instantiated as a deterministic ten-Evidence candidate set. This remains review-only preparation; no canonical archive mutation is authorized.

## Input checkpoint

```text
Evidence: 585
Evidence Relations: 585
Archive recorded: 463
Archive not recorded: 122
Market Access Records: 12
Canonical hash: sha256:f386c1043ca5e83cafbd88e99746d0609aab0154ed48de1970677758a66ed5fa
Canonical file count: 466
```

## Selection result

The Queue v7 non-ranking priority semantics were reapplied to the current canonical unarchived set, with the merged Batch 2 exclusions and all Batch 1 reviewed identities excluded.

```text
eligible pool: 68
selected: 10
priority bucket of selected set: official_issuer_protocol_product
canonical changes: 0
public-output changes: 0
```

Selected Evidence IDs:

```text
sog_src_susd_legacy_context_batch_a
sog_src_susd_rebuilding_2026
sog_src_susd_roadmap_2026
sog_src_susd_sip_status_2026
sog_src_susd_sip420_2024
sog_src_susd_sip423_2026
sog_src_susd_synthetix_docs
sog_src_susd_v3_faq_batch_a
sog_src_terra_docs
sog_src_tether_transparency
```

The current unarchived input contains three Batch 1 reviewed identities; seven other Batch 1 identities already carry reviewed archive additions. The full ten-identity Batch 1 set remains semantically excluded from Batch 2.

## Next action

Perform manual payload review for exactly these ten candidates. For each candidate, inspect the exact canonical source URL and a dated Wayback snapshot. A snapshot is not promotable unless its archived payload is independently fetched and preserves the relevant claim scope. Redirect-only or CDX-only evidence is insufficient.

Allowed review dispositions are:

```text
dated_exact_archive_proposal
reviewed_no_safe_change
```

## Boundary

No canonical `archived_url`, Evidence identity, Evidence Relation, asset, event, Market Access Record, route, public output, UI, or CSS change is authorized by this handoff.

If manual review identifies safe archive additions, a separately reviewed and merged implementation authority is required before canonical mutation.
