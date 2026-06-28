# Evidence traceability and duplicate-invariant review

Status: supporting audit  
Date: 2026-06-28  
Roadmap item: PR #225

## Scope

This review closes the evidence-quality phase by checking the complete path from canonical evidence history to public source identity and subject relations.

```text
Canonical evidence records
        ↓ reviewed source-identity groups
Public source identities
        ↓ canonical evidence relations
Stablecoin, organization, event, and claim-scope context
```

## Result

```text
Canonical evidence records: 457
Unique canonical evidence IDs: 457
Canonical exact duplicate-URL groups: 32
Approved source-identity groups: 32
Approved source alias IDs: 45
Public source identities: 412
Public duplicate-URL groups: 0
Evidence relations: 457
Orphan relation source IDs: 0
Invalid stablecoin relation IDs: 0
Invalid organization relation IDs: 0
Invalid event relation IDs: 0
Subjectless evidence records: 0
Claimless evidence records: 0
Unconfigured duplicate-URL groups: 0
```

## Identity model

The 457 canonical evidence records remain append-only historical and claim records. Forty-five reviewed alias IDs collapse into 32 canonical public source identities. The public projection therefore contains 412 unique source identities without deleting canonical evidence history.

Every configured identity group must contain:

- one canonical evidence ID;
- the reviewed alias IDs;
- one exact URL shared by all members;
- preserved stablecoin, organization, event, and claim-scope unions.

An exact duplicate canonical URL is allowed only when it belongs to one of the 32 reviewed identity groups. Public output must contain no duplicate URL rows.

## Relation traceability

Every canonical evidence record projects one evidence relation. Alias evidence IDs resolve to their reviewed canonical source identity, while the original relation context remains preserved.

The review requires:

- every relation source ID to resolve to an existing public source identity;
- every stablecoin, organization, and event reference to exist canonically;
- every canonical evidence record to retain at least one subject relation;
- every canonical evidence record to retain at least one claim scope;
- the relation union of each reviewed identity group to match its public source projection.

## Duplicate invariants

Canonical duplicate URLs are not automatically deleted or merged. They remain separate historical evidence records when they carry distinct claims, subjects, events, dates, or notes.

Public deduplication is allowed only through the reviewed identity-group registry. Unconfigured duplicate URLs, missing group members, URL drift, relation loss, and alias rows leaking into public output are validation failures.

## Fixed rules

- Canonical evidence history is append-only.
- Public source identity is separate from canonical history.
- Alias resolution requires an approved identity group.
- Relation unions must survive public deduplication.
- Every public relation source must exist.
- Every subject reference must be canonical.
- Public duplicate URL rows are prohibited.
- No evidence record is automatically deleted or merged by this review.

## Data changes

No canonical evidence, evidence relation, source identity, URL, claim scope, subject relation, or public route changes are made. PR #225 adds only the final quality checkpoint, audit, validator, and roadmap transition.

## Follow-up

The evidence-quality phase is complete. PR #226 begins deployment-quality review with canonicality and source-status classification.

## Deployment classification

```text
No production deployment required
```
