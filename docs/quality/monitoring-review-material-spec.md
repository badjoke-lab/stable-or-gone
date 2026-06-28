# Stable or Gone monitoring review material

Status: canonical specification  
Updated: 2026-06-29  
Roadmap item: PR #232

## Purpose

PR #232 converts private official-source observations and candidates into structured review material. The output helps an operator decide whether a separate canonical-data PR is justified. It does not create, approve, commit, merge, or publish canonical changes.

This specification supplements:

- `docs/quality/monitoring-pipeline-spec.md`
- `docs/quality/monitoring-official-source-spec.md`
- `docs/quality/monitoring-official-source-schema.md`

## Mode

PR #232 adds:

```text
review-material
```

The mode performs the same allowlisted official-source observation as `official-sources` and then generates review files. It remains manual-only under `workflow_dispatch` with `contents: read` permission.

## Output contract

A `review-material` run writes exactly:

```text
manifest.json
health.json
official-source-observations.json
monitoring-candidates.json
review-material.json
pr-material.json
review-report.md
summary.md
```

All files remain private workflow artifacts under `data-staging/monitoring/<run_id>/`.

## Review-material contract

`review-material.json` separates:

```text
observed_facts
candidate_inferences
unresolved_questions
duplicate_and_lineage_reviews
evidence_drafts
rejected_or_no_action
```

### Observed facts

Observed facts may state only directly recorded response metadata:

- an allowlisted official page was fetched;
- the HTTP status and final URL;
- observation time;
- response digest and size;
- configured keywords and signal types present in the response.

Observed facts must not claim that a reserve, redemption, issuer, status, or lifecycle change occurred.

### Candidate inferences

Candidate inferences are explicitly non-canonical. They may state that a page contains configured terminology and may warrant review. Every inference requires:

```text
classification: inference
confidence: low
canonical_status: not_assigned
requires_human_review: true
```

### Unresolved questions

Every candidate receives unresolved questions covering:

- whether the observed content is new since the last canonical review;
- whether an exact dated report or announcement is available;
- whether any canonical entity, event, evidence, reserve, relationship, or deployment field should change;
- whether an archive snapshot is required;
- whether the candidate should be rejected as no material change.

### Evidence drafts

Evidence drafts are unapproved suggestions only. Required fields:

```text
draft_id
review_status
source_url
source_title
source_kind
accessed_at
target_stablecoin_ids
target_organization_ids
proposed_reliability
proposed_claim_scopes
notes
```

Fixed values:

```text
review_status: unapproved
proposed_reliability: high
```

The high proposal reflects issuer- or protocol-controlled source identity, not correctness of an inferred change.

### Rejected or no-action rows

Error observations and successful observations without configured signals are placed in `rejected_or_no_action`. They do not create evidence drafts or candidate inferences.

## PR-material contract

`pr-material.json` is a draft review envelope, not a GitHub write instruction.

Required fields:

```text
schema_version
run_id
created_at
requires_human_approval
canonical_changes_allowed
suggested_branch
suggested_title
suggested_body
candidate_ids
review_files
operator_checklist
```

Fixed values:

```text
requires_human_approval: true
canonical_changes_allowed: false
```

The suggested body must state that monitoring signals are not final SOG classifications and that any canonical changes require a separate reviewed PR.

## Markdown report

`review-report.md` contains exactly these top-level review sections:

```text
# SOG Monitoring Review Report
## Run
## Observed facts
## Candidate inferences
## Unresolved questions
## Duplicate and lineage review
## Evidence drafts
## Rejected / no-action items
## Operator checklist
```

The report must not include raw response bodies, cookies, authorization material, internal credentials, or executable instructions.

## Validation

PR #232 validation uses injected fixture responses and checks:

- exact eight-file output;
- facts/inferences/questions are separated;
- every candidate has one evidence draft;
- drafts remain unapproved;
- canonical changes are disallowed in PR material;
- human approval is required;
- report headings are complete;
- raw body markers are absent;
- canonical before/after hashes match;
- no workflow write permission or automatic PR action exists.

## Completion state

PR #232 completes the planned non-UI quality sequence from PR #217 through PR #232. It does not pass UI Gate V2-F, resume routine record growth, select a production release candidate, or authorize publication. Those require a later roadmap decision.

## Deployment classification

```text
No production deployment required
```
