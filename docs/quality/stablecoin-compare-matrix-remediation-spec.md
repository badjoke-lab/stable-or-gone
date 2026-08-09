# Stablecoin Compare Matrix Remediation Specification

Date: 2026-08-10  
Authority: `docs/roadmap-amendments/2026-08-10-stablecoin-compare-matrix-remediation-authority.md`

## Defect

The public Stablecoin Register allows two to four comparison selections but renders each selected record as a separate vertically stacked dossier. That presentation does not align like-for-like values, makes three/four-record comparison worse as selections increase, and fails the intended compare interaction.

## Required interaction contract

### Selection

- zero selections: comparison region hidden;
- one selection: comparison region visible with `1 selected. Select one more record to compare.`;
- two to four selections: comparison ready;
- fifth attempted selection: rejected without changing the selected set;
- clearing comparison: empties the set and URL state;
- removing a column: removes only that record and synchronizes the register checkbox plus URL state.

### Matrix structure

The comparison uses a single table/matrix with this conceptual shape:

```text
Attribute | Record 1 | Record 2 | Record 3 | Record 4
```

Only selected record columns are rendered. Rows are grouped with compact section separators for:

1. Identity and current state
2. Reference, backing, stabilization
3. Reserve and redemption
4. Organizations and control
5. Historical record depth

Required rows:

```text
Lifecycle
Issuance
Asset class
Launch
Reference
Backing
Stabilization
Reserve disclosure
Redemption
Organizations / control
Deployments
Linked events
Source identities
Evidence relations
Known unknowns
```

### Difference detection

`Differences only` compares normalized displayed text across all selected record cells in a row.

- If every selected record has the same normalized displayed value, the row may be hidden when the control is enabled.
- `Unknown` and `Not recorded` are values, not blanks.
- Section separators with no remaining visible rows are hidden in differences-only mode.
- The default is differences-only OFF.
- The control is public presentation state only; it does not alter the `compare` URL parameter or canonical data.

### Responsive behavior

Desktop:

- the attribute column remains visually distinct;
- stablecoin identities remain visible at the top of their columns;
- two columns should use available width without oversized empty space;
- three/four columns may use a bounded horizontally scrollable comparison viewport if required.

Mobile:

- do not convert selected records into stacked dossier cards;
- keep one comparison matrix in a horizontally scrollable region;
- no page-level horizontal overflow;
- interactive controls remain at least 40px high, targeting 44px under the shared UI system;
- essential names and values must remain readable and not be ellipsized away.

### Public-safety constraints

- No winner/loser treatment.
- No scoring, ranking, safety grade, recommendation, or investment judgment.
- Counts such as events/evidence are descriptive record-depth facts only.
- Existing disclaimer remains visible.

## Data contract

The UI may use only values already assembled by the Stablecoin Register record projection. No canonical source file or record schema changes are authorized.

Canonical baseline remains:

```text
Stable assets 119
Evidence 585
Evidence Relations 585
Market Access 12
Archive recorded 463
Archive not recorded 122
Canonical hash sha256:f386c1043ca5e83cafbd88e99746d0609aab0154ed48de1970677758a66ed5fa
Canonical file count 466
```

## Acceptance tests

Implementation is incomplete until exact-head checks prove:

1. 2-record matrix aligns all required attributes.
2. 3-record matrix adds a third value column without changing row semantics.
3. 4-record matrix adds a fourth value column and remains usable.
4. 5th selection is rejected.
5. `Differences only` hides same-value rows and preserves differing/unknown/not-recorded rows correctly.
6. Column removal updates checkbox state, matrix, status text, and URL.
7. URL restoration preserves selected order up to four records.
8. Desktop and mobile changed-route screenshots show no overlap, clipping, or page-level overflow.
9. All existing repository, canonical-integrity, provenance, public-consistency, and UI V3 regression gates pass.
10. Direct artifact inspection finds no known visual defect.

## Exit state

Successful implementation returns the repository to the paused Evidence Archive Payload Verification Batch 2 manual-review lane through a separate closeout/authority-restoration change.