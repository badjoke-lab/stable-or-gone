# SOG UI and public-information repair baseline

Status: supporting audit  
Recorded: 2026-06-26  
Source main commit: `94db111dc48e7dfb30576cda52d60e5494565ec0`  
Machine-readable baseline: `docs/ui-redesign/repair-baseline.json`

## 1. Purpose

This audit freezes the starting condition for the 100-record UI and public-information repair program.

It records:

- the canonical repository checkpoint;
- expected generated route and sitemap counts;
- the public origin observed on 2026-06-26;
- confirmed defects that later PRs must close;
- representative records that must be used in information architecture, responsive design, mocks, and regression testing.

This document is historical evidence. Later fixes do not rewrite the observed production snapshot recorded here.

## 2. Governing specifications

```text
AGENTS.md
docs/spec-governance.md
docs/roadmap.md
docs/deployment-policy.md
docs/ui-redesign/master-spec.md
docs/ui-redesign/implementation-plan.md
docs/public-taxonomy-spec.md
```

## 3. Canonical repository checkpoint

The current canonical repository contains:

| Record group | Count |
|---|---:|
| Stable assets | 92 |
| Organizations | 86 |
| Relationships | 101 |
| Classifications | 92 |
| Reserve/redemption profiles | 92 |
| Events | 150 |
| Event details | 150 |
| Evidence | 455 |
| Evidence relations | 455 |
| Reserve reports/context | 100 |
| Known unknowns | 253 |
| Regulatory notes | 9 |
| Deployments | 130 |
| Legal profiles | 92 |
| Stable-asset relationships | 4 |
| Reserve components | 125 |
| Income profiles | 92 |

Canonical sources:

```text
docs/migration/registry-v3-baseline.json
data/generated/registry-stats.json
data/generated/registry-integrity-audit.json
```

Required-layer coverage is 92/92 for classifications, profiles, relationships, events, evidence, known unknowns, deployments, legal profiles, reserve components, and income profiles. Reserve-report/context coverage is 80/92 and remains informational rather than mandatory for every asset.

## 4. Expected generated output

A build from the current canonical checkpoint must produce:

| Output | Expected count |
|---|---:|
| Stablecoin detail routes | 92 |
| Organization detail routes | 86 |
| Event detail routes | 150 |
| Total detail routes | 328 |
| Stablecoin sitemap URLs | 92 |
| Organization sitemap URLs | 86 |
| Event sitemap URLs | 150 |
| Total detail sitemap URLs | 328 |

The machine-readable primary counts must be:

```json
{
  "primary_records": 92,
  "events": 150,
  "evidence": 455
}
```

## 5. Public origin observed on 2026-06-26

Observed origin:

```text
https://sog.badjoke-lab.com/
```

### 5.1 Public HTML

| Public page | Stablecoins | Organizations | Relationships | Events | Evidence |
|---|---:|---:|---:|---:|---:|
| Home | 82 | 73 | — | 128 | 386 |
| Stablecoin index | 82 | 73 | — | — | — |
| Organization index | — | 73 | 86 | — | — |
| Event index | 82 covered | — | — | 128 | — |

### 5.2 Public machine-readable layer

`version.json` and `data/manifest.json` reported:

```text
Build commit: 24eb8bef07fff093bf8f366dd1aab5804a2367c3
Generated at: 2026-06-18T04:59:28.519Z
Design generation: registry_v2
Stablecoins: 70
Organizations: 59
Relationships: 72
Events: 92
Evidence: 279
Evidence relations: 279
Reserve reports: 72
Known unknowns: 153
Regulatory notes: 9
Deployments: 101
```

### 5.3 Finding

Production contained at least three different generations:

```text
Canonical repository        92 / 86 / 150 / 455
Public HTML                 82 / 73 / 128 / 386
Public machine-readable     70 / 59 /  92 / 279
                              assets / organizations / events / evidence
```

This is a blocking release-integrity defect. It demonstrates that successful local generation and repository validation do not prove that every public route family and machine-readable file belongs to the same deployed snapshot.

The public sitemap was not independently counted in the initial external capture. PR 3 must make sitemap count and deployed-commit verification mandatory and reproducible.

## 6. Confirmed defect inventory

The machine-readable baseline assigns stable IDs and target PRs to sixteen confirmed defects.

### Blockers

- `SOG-UI-001` — production contains multiple data generations;
- `SOG-UI-008` — primary organization depends on relationship array order;
- `SOG-UI-011` — generic mobile CSS removes unrelated material fields.

### High-priority defects

- lifecycle and legacy-status inconsistency;
- free-text model filters;
- internal reference identifiers as public peg labels;
- event-category proliferation;
- evidence reliability/provenance contamination;
- deployment work-state leakage;
- duplicate evidence presentation;
- flat and unbounded stablecoin detail hierarchy.

### Medium-priority defects

- internal implementation terminology in public records;
- record-specific copy hard-coded in rendering components;
- non-shareable filter state;
- home-page selected records determined by array order;
- flat global navigation.

The authoritative defect objects are in `docs/ui-redesign/repair-baseline.json`.

## 7. Representative record set

All later architecture, mock, responsive, and regression work must include the representative records from the machine-readable baseline.

The set covers:

- active reserve-backed assets;
- depeg and recovery history;
- collapse;
- orderly wind-down and termination;
- impaired or restricted current state;
- migration and rebrand;
- floating and CPI/index references;
- yield-bearing receipts and wrappers;
- fund-share and legal-structure cases;
- multiple organizations and roles;
- multiple deployments and issuer-control context;
- non-USD assets;
- restricted launches;
- unknown launch dates and unresolved reserve details;
- identity-collision risks such as Noble USDN versus Neutrino USD.

Required records include USDT, USDC, UST, BUSD, sUSD, SAI, Neutrino USD, RAI, SPOT, sUSDe, USYC, USD1, msUSD, JPYSC, USA₮, EURAU, USDH, AE Coin, Origin Dollar, and Noble Dollar.

## 8. Validation

`npm run validate:ui-repair-baseline` verifies:

- canonical counts against generated stats, the integrity audit, and the Registry v3 baseline;
- expected route and sitemap counts;
- machine-readable primary counts;
- the historical production-snapshot structure;
- existence and slug identity of every representative record;
- required representative coverage tags;
- unique defect IDs, severity, evidence, and target-PR mappings.

The normal build chain must run this validator.

## 9. Exit condition for PR 1

PR 1 is complete when:

- the machine-readable baseline is merged;
- this audit is merged;
- the validator passes in normal CI;
- the roadmap moves to PR 2, build provenance;
- no canonical data or production deployment is included.
