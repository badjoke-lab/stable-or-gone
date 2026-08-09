# Stablecoin Compare Matrix Remediation Authority

Date: 2026-08-10  
Status: active implementation authority after merge  
Scope: public stablecoin register comparison only

## Reason for the interruption

The current `/stablecoins/` comparison control already permits two to four selected records, but the rendered result clones one full record dossier per selection. Two, three, and four selected records are therefore stacked as independent vertical articles instead of being aligned by comparable attributes. This is a blocking comparison-design defect, not a canonical-data defect.

The Evidence Archive Payload Verification Batch 2 manual review is paused at its existing draft-review checkpoint while this bounded public-UI regression is corrected. PR #539 and its probe artifacts remain review evidence only and must not be merged or promoted while this authority is active.

## Authorized implementation

The implementation may change only the public comparison presentation and the tests/audits required to prove it.

Authorized product behavior:

- preserve the existing two-to-four-record comparison boundary;
- preserve rejection of a fifth selected record;
- render one attribute-by-record comparison matrix rather than stacked dossiers;
- support two, three, and four selected records with the same matrix model;
- keep the attribute labels in a dedicated first column;
- keep selected stablecoin identity visible in column headers;
- allow removal of an individual selected record from its comparison column;
- add a `Differences only` control that hides rows whose normalized displayed values are identical across all selected records;
- keep `Unknown` and `Not recorded` explicit rather than treating them as empty values;
- preserve compare selection order in the shareable `compare` URL state;
- keep comparison historical/registry-only with no score, rank, recommendation, winner, safety judgment, or investment framing;
- keep mobile usable through bounded horizontal scrolling inside the comparison region instead of page-level overflow or stacked dossier cards.

The matrix may include the currently exposed comparison facts only:

- lifecycle;
- issuance;
- asset class;
- launch date;
- reference target;
- backing model;
- stabilization mechanism;
- reserve disclosure status;
- redemption status;
- organizations/control summary;
- recorded deployment count;
- linked event count;
- source identity count;
- evidence relation count;
- known unknown count.

## Explicit exclusions

This authority does not permit:

- canonical stablecoin, organization, relationship, event, evidence, reserve, legal, income, deployment, Market Access, or archive changes;
- new comparison facts derived from unreviewed data;
- new public routes;
- taxonomy/schema changes;
- ranking, scoring, recommendation, risk grading, or winner/loser language;
- more than four selected records;
- replacing the stablecoin register or dossier information architecture;
- unrelated sitewide redesign;
- merging the paused Evidence Archive review branch.

## Required files and regression gates

Implementation is expected to be limited primarily to:

```text
src/pages/stablecoins/index.astro
src/scripts/stablecoin-index.ts
src/components/StablecoinComparisonSource.astro or a bounded replacement component
src/styles/public-ui.css
comparison-specific validation/tests/audits
```

The enduring UI V3 regression authority remains binding. Before merge, the exact implementation head must pass all repository workflows and the required UI visual gates. Direct artifact review must cover at least:

```text
desktop: 2 selected, 3 selected, 4 selected
mobile: 2 selected, 4 selected
Differences only: off and on
column removal
fifth-selection rejection
shared compare URL restoration
Unknown / Not recorded visibility
```

Page-level horizontal overflow, clipped essential text, overlapping labels, inaccessible controls, or a known visual defect blocks merge even when CI is green.

## Canonical baseline

```text
Stable assets: 119
Organizations: 109
Relationships: 131
Events: 194
Evidence: 585
Evidence Relations: 585
Reserve reports: 127
Known unknowns: 352
Regulatory notes: 9
Deployments: 186
Legal profiles: 119
Reserve components: 153
Income profiles: 119
Market Access Records: 12
Archive recorded: 463
Archive not recorded: 122
Canonical hash: sha256:f386c1043ca5e83cafbd88e99746d0609aab0154ed48de1970677758a66ed5fa
Canonical file count: 466
```

Every value above must remain unchanged by this lane.

## Exit

After the implementation is merged, production-verified, and visually accepted, a closeout must restore the prior Evidence Archive Payload Verification Batch 2 manual-review authority without silently promoting any archive candidate.