# Stable or Gone monitoring review material

Status: canonical specification  
Updated: 2026-06-29  
Roadmap item: PR #232

## Purpose

PR #232 completes the review-only monitoring sequence by transforming private official-source observations and candidates into material that a human operator can inspect before opening a separate canonical-data pull request.

The binding sequence remains:

```text
official-source observation
→ private candidate record
→ duplicate and lineage checks
→ evidence draft
→ reviewable PR material
→ human approval before canonical publication
```

Review material is not canonical data, is not a public claim, and is not authorization to change lifecycle, reserve, redemption, regulatory, issuer, deployment, or evidence records.

## Trigger and permissions

The workflow remains manual-only and read-only:

```text
workflow_dispatch
contents: read
```

PR #232 does not add a schedule, push trigger, pull-request trigger, write permission, automatic branch, automatic commit, automatic pull request, issue creation, or production action.

## Output contract

A review-enabled `official-sources` run writes exactly:

```text
data-staging/monitoring/<run_id>/
  manifest.json
  health.json
  official-source-observations.json
  monitoring-candidates.json
  review-material.json
  evidence-drafts.json
  review-report.md
  pr-material.md
  summary.md
```

Raw source bodies remain prohibited. The additional files may contain only source identity, URLs, response metadata, digests, configured signal matches, canonical target IDs, review questions, and draft-only recommendations.

## Fact and inference boundary

Every review item must separate four classes:

```text
observed_facts
inferences
unresolved_questions
rejected_duplicates
```

### Observed facts

Observed facts are limited to values directly emitted by the PR #231 observation contract:

- source identity and URL;
- final allowlisted URL;
- observation timestamp;
- HTTP and content metadata;
- body SHA-256 digest and byte count;
- configured signal types and matched allowlisted keywords;
- configured affected stablecoin and organization IDs;
- duplicate and lineage review states.

The monitor must not convert a matched keyword into a statement that reserves, redemptions, issuance, backing, or assurance terms actually changed.

### Inferences

Inferences are low-confidence review prompts derived from configured signal types. Every inference must use:

```text
status: unconfirmed
confidence: low
canonical_action: none
```

An inference is never a canonical event, evidence claim, reserve report, lifecycle state, or regulatory conclusion.

### Unresolved questions

Each review item must state the questions a reviewer must answer from the official source and any period-specific document. At minimum, review must determine whether:

- a material change occurred rather than recurring page language;
- a new effective date, report period, or publication date exists;
- the finding belongs to an existing canonical event, reserve report, profile, or evidence record;
- a new canonical record is needed at all;
- the affected asset and organization scope is correct.

### Rejected duplicates

Exact duplicate private candidates are excluded from review items and recorded under `rejected_duplicates` with the retained candidate ID and rejection reason. Duplicate rejection applies only to private candidate material and does not delete or rewrite canonical records.

## review-material.json

Required top-level fields:

```text
schema_version
created_at
status
source_run
counts
review_items
rejected_duplicates
safety
```

Fixed values:

```text
status: needs_human_review
safety.canonical_action: none
safety.automatic_pull_request: false
safety.automatic_canonical_write: false
safety.production_publication: false
```

Each `review_item` requires:

```text
review_id
candidate_id
review_status
observed_facts
inferences
unresolved_questions
duplicate_review
lineage_review
existing_evidence_matches
evidence_draft_id
recommended_next_step
canonical_action
```

Fixed item values:

```text
review_status: pending_human_decision
canonical_action: none
recommended_next_step: review_official_source_and_open_separate_data_pr_if_supported
```

## Evidence draft contract

`evidence-drafts.json` is a draft-only queue. It must not use canonical evidence IDs and must not be loaded by public or canonical loaders.

Required top-level fields:

```text
schema_version
created_at
status
draft_count
drafts
policy
```

Fixed values:

```text
status: draft_only
policy.human_approval_required: true
policy.canonical_action: none
policy.public_output: false
```

Each draft requires:

```text
draft_id
candidate_id
status
draft_action
source_url
source_identity
observed_at
body_sha256
affected_stablecoin_ids
affected_organization_ids
signal_types
claim_scope_hints
existing_evidence_ids
canonical_source_type
canonical_action
review_notes
```

Fixed values:

```text
status: draft_needs_human_review
canonical_source_type: null
canonical_action: none
```

`draft_action` is one of:

```text
link_existing_evidence
create_canonical_evidence_candidate
```

When the normalized source URL already exists in canonical evidence, the draft must use `link_existing_evidence` and list all matching canonical evidence IDs. The monitor must not create a duplicate evidence proposal.

## Review report

`review-report.md` is an operator-facing summary and must contain:

```text
# SOG Monitoring Review Report
## Run
## Review summary
## Observed facts
## Inferences requiring review
## Unresolved questions
## Rejected duplicates
## Evidence draft actions
## Human approval checklist
## Safety boundary
```

The report must label inferences as unconfirmed and must not present any candidate as an approved canonical change.

## Pull-request material

`pr-material.md` is a draft for a future, separately opened canonical-data pull request. It must start with a visible `DRAFT ONLY` warning and contain:

```text
## Candidate scope
## Observed source material
## Proposed evidence work
## Proposed canonical changes
## Data preservation
## Validation checklist
## Human approval
## Deployment classification
```

The `Proposed canonical changes` section must state that no canonical change is pre-approved. The human approval section must include explicit promote, hold, and reject choices for every review item.

The deployment classification remains:

```text
No production deployment required
```

## Manifest and summary

For a review-enabled run, `manifest.json` additionally records:

```text
review_material_enabled: true
review_item_count
evidence_draft_count
rejected_duplicate_count
unresolved_question_count
```

`summary.md` must state the same counts and repeat:

```text
Human approval required
Canonical action: none
Automatic pull request: false
```

## Validation

Repository validation must use deterministic fixtures and must not require live network access. PR #232 validation checks:

- exact nine-file output;
- observed fact and inference separation;
- low-confidence unconfirmed inference states;
- unresolved questions for every review item;
- deterministic draft and review IDs;
- normalized canonical evidence URL matching;
- exact duplicate candidate rejection;
- no raw source-body retention;
- no canonical or public file changes;
- no automatic pull-request or production behavior;
- required Markdown sections and warnings.

## Public-output rule

All PR #232 output remains under the ignored private monitoring root and workflow artifact. It is excluded from public pages, public JSON, version metadata, manifests, AI files, sitemap output, and canonical counts.

## Deployment classification

```text
No production deployment required
```
