# Stable or Gone non-UI quality program

Status: canonical implementation plan  
Updated: 2026-06-28  
Registry checkpoint: 92 canonical stable assets

## Purpose

This program advances SOG while detailed visual review is temporarily unavailable. It does not approve the current UI, pass Gate V2-F, select a release candidate, or authorize production publication.

The UI implementation merged through PR #216 remains an intermediate repository state. Further visual corrections and the full all-route visual audit resume only when owner review is practical.

## Required reading order

Before changing canonical data, evidence, workflows, monitoring, or quality documentation, read:

1. `AGENTS.md`
2. `docs/spec-governance.md`
3. `docs/roadmap.md`
4. `docs/deployment-policy.md`
5. this plan
6. the relevant canonical data specification
7. `docs/migration/registry-v3-baseline.json`
8. the queue, validator, and supporting audit named by the active PR

Relevant canonical data specifications include:

```text
docs/stable-asset-scope.md
docs/classification-spec.md
docs/data-model-v3-spec.md
docs/stats-spec.md
```

## Fixed operating rules

- Repository specifications remain the source of truth.
- Every non-trivial PR cites the exact queue, audit, schema, and validator it changes.
- Unknown values remain unknown unless reviewed evidence supports a canonical value.
- Month- or year-level evidence is not coerced into a day-level date.
- UI work must not clear quality queues through hiding, defaults, or relabeling.
- Candidate monitoring output never writes directly to canonical public data.
- Normal quality PRs require no production deployment.
- Routine record growth remains paused until a later roadmap amendment.

## Starting quality inventory

```text
Missing canonical launch dates:           20
Historical terminal dates unresolved:      4
Historical relationship end dates:         7
Reserve applicability queue:               12
Public duplicate evidence URL groups:       0
Evidence reliability values unknown:       36
Direct workflow placeholders retained:    112
Deployment canonicality not recorded:      67
Deployment verification not recorded:     130
Deployment source review needed:           15
```

The queue files and canonical null/unknown sets must remain machine-checkable and exactly aligned.

## PR sequence

### PR #217 — workstream transition and queue alignment

- mark detailed UI review and Gate V2-F as deferred, not passed;
- make this document the active implementation plan;
- update roadmap, governance, deployment references, and agent instructions;
- correct stale human-readable launch-date queue counts;
- preserve all canonical records and public output.

### PR #218 — launch-date source review: partial-date and missing-primary group

Audit the seven Category B/D records:

```text
BRZ
HONEY
USDz
HUSD
TRYB
USYC
AECoin
```

Outcomes may be a supported canonical day, a stronger bounded range, a better reason code, or an explicitly preserved `null` with improved source trail.

### PR #219–#220 — launch-date boundary-conflict groups

Audit the thirteen Category C records in bounded groups. Separate contract deployment, first mint, guarded access, public availability, rebrand, migration, and staking activation. Do not force one boundary across different products.

### PR #221 — terminal-date and relationship-end review

Recheck the four terminal-date records and seven historical relationship end dates. Future dates such as an open redemption deadline remain unresolved until the matching terminal boundary actually occurs and is evidenced.

### PR #222 — reserve applicability review

Resolve the twelve applicability records by distinguishing issuer reserve reports, protocol collateral reporting, non-applicable algorithmic designs, and genuinely missing disclosure.

### PR #223–#225 — evidence quality review

- audit 36 unknown reliability values;
- split 112 direct-workflow placeholders into replaceable, intentionally unknown, and invalid groups;
- preserve the zero duplicate-public-URL invariant;
- improve source identity and evidence relation traceability.

### PR #226–#229 — deployment quality review

Review canonicality, verification, and source status for all deployment records in chain- or asset-bounded groups. Record canonical, bridged, legacy, migration, explorer, and issuer-source state without guessing.

### PR #230–#232 — monitored candidate pipeline

Implement a review-only monitoring pipeline:

```text
official-source observation
→ private candidate record
→ duplicate and lineage checks
→ evidence draft
→ reviewable PR material
→ human approval before canonical publication
```

The pipeline may watch reserve updates, redemption changes, issuer changes, regulatory actions, minting state, contract replacement, migration, depeg, shutdown, and rebrand signals. Automatic canonical publication remains prohibited.

## UI resumption gate

The deferred UI audit resumes only after the owner can inspect representative desktop and mobile pages. On resumption, the roadmap assigns a new PR number for the 92-record and all-route visual audit. Gate V2-F remains pending until that audit is complete.

## Growth decision

After the existing 92 records and their quality queues are materially improved, the roadmap must explicitly choose whether to:

1. publish a repaired 92-record release after the deferred UI gates; or
2. promote a reviewed final set toward 100 before publication.

Neither path is authorized by this document alone.

## Deployment classification

All PRs in this program default to:

```text
No production deployment required
```

Emergency publication remains governed exclusively by `docs/deployment-policy.md`.
