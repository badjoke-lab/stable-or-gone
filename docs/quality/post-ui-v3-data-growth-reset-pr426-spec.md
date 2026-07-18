# PR #426 Post-UI v3 Data-Growth Reset Specification

Status: canonical on merge  
Deployment class: private governance and planning only

## 1. Governing references

```text
AGENTS.md
docs/spec-governance.md
docs/roadmap.md
docs/deployment-policy.md
docs/post-351-data-growth-operating-spec.md
docs/roadmap-amendments/2026-07-18-pr426-post-ui-v3-data-growth-reset.md
config/post-ui-v3-data-growth-reset-pr426.json
docs/migration/ui-v3-owner-approval-pr422.json
docs/migration/ui-v3-issue-281-closure-pr425.md
docs/migration/tier-a-candidate-queue-v2-2-pr375.json
docs/migration/evidence-archive-maintenance-batch-8-pr405-reviewed-handoff.json
data/editorial-research/record-growth-batch-1-pr358-candidates.json
```

## 2. Purpose

PR #426 closes the governance gap left after UI v3 completion. It restores the post-351 default operating mode and authorizes one bounded internal candidate audit before any further canonical growth.

## 3. Binding findings

```text
UI v3: complete
Issue #281: closed as completed
Active UI implementation workstream: none
Canonical stable assets: 112
History-aware dossier queue candidates: 0
Archive Batch 8 selected / safe canonical changes: 10 / 0
Archive recorded / not recorded: 430 / 129
```

The previous dossier lane has no currently eligible candidate. The latest archive-maintenance batch had zero safe canonical yield. The next useful step is therefore a fresh growth-candidate audit rather than another forced dossier or archive batch.

## 4. Approved next work item

```text
PR #427 Record Growth Candidate Audit v2
REVIEW GATE
```

PR #427 must remain internal and noncanonical. It may review no more than twelve candidate stable assets and must stop at a review gate.

## 5. Candidate audit requirements

Each reviewed candidate must include:

- candidate identity and aliases;
- proposed symbol and slug;
- issuer or operator identity;
- official domain and source leads;
- current lifecycle state hypothesis;
- mechanism and reference asset hypothesis;
- deployment identity where relevant;
- duplicate review against all 112 canonical assets;
- source coverage by claim scope;
- blocking unknowns;
- one reviewed disposition.

Allowed dispositions:

```text
ready_for_full_record_review
duplicate_existing
prelaunch_or_noncanonical
insufficient_evidence
out_of_scope
deferred
```

## 6. Duplicate review requirements

The audit must check at least:

```text
asset id
slug
canonical name
symbol
aliases
issuer or operator
official domain
deployment identity
predecessor / successor lineage
```

A symbol collision alone is not identity. A new marketing name alone is not a new canonical asset. A pre-launch announcement is not an active canonical record.

## 7. Source requirements

A candidate may be classified `ready_for_full_record_review` only when:

1. asset identity is supported by a current official or equivalent primary source;
2. issuer/operator identity is supported;
3. mechanism and lifecycle state can be described without invented certainty;
4. at least two independent source identities are available, including at least one primary source;
5. duplicate and lineage review is complete;
6. the expected complete-record families can be produced without a thin placeholder.

## 8. Required outputs

```text
data/editorial-research/record-growth-candidate-audit-v2-pr427.json
docs/migration/record-growth-candidate-audit-v2-pr427-duplicate-report.json
docs/migration/record-growth-candidate-audit-v2-pr427-source-coverage.json
docs/migration/record-growth-candidate-audit-v2-pr427-handoff.json
```

## 9. Explicit non-goals

PR #426 and PR #427 do not authorize:

- canonical asset or supporting-record changes;
- public candidate or monitoring output;
- automatic promotion;
- automatic canonical PR creation;
- more than two future asset additions;
- new routes or public product surfaces;
- UI v3 changes;
- metadata-contract changes;
- rankings, scores, endorsements, safety claims, or investment recommendations.

## 10. Preservation rules

The PR must preserve exact content under:

```text
data/
src/
public/
```

It must also preserve statistics history, release-integrity checkpoints, owner approval records, and the Issue #281 closure record.

## 11. Exit state

On merge, PR #427 becomes the sole active work item. After PR #427, stop at a mandatory review gate. A canonical Record Growth Batch 2 remains unapproved until that gate reviews actual audit results.
