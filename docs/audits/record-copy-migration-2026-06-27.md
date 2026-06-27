# Record-specific public-copy migration audit

Date: 2026-06-27  
Scope: Phase 2 / PR 16  
Status: PASS after PR #184 merges

## Purpose

PR 16 completes the data-semantics migration for the existing 92 stable assets. It removes stablecoin-specific summary text from rendering components, places reviewed overrides in an explicit copy registry, and checks every asset against the normalized public axes introduced in PRs 5–15.

The migration does not add records, infer missing facts, or change canonical routes.

## Authority

```text
docs/ui-redesign/implementation-plan.md — PR 16
docs/ui-redesign/master-spec.md
docs/public-taxonomy-spec.md
docs/spec-governance.md
docs/roadmap.md
```

## Canonical preservation

Before and after counts are identical:

```text
Stable assets:                92
Organizations:                86
Organization relationships:  101
Events:                      150
Canonical evidence records:  455
Deployments:                 130
Known unknowns:              253
Reserve reports:             100
Regulatory notes:              9
```

Canonical stablecoin IDs are preserved. No record was added, removed, merged, or renumbered.

## Public-copy migration

Before PR 16, `StablecoinDetailView.astro` contained a component-level summary map for 20 named assets.

After PR 16:

```text
Curated copy-registry summaries: 20
Canonical record summaries:      72
Missing-summary fallbacks:         0
Rendering-component summary maps:  0
Asset-specific component findings: 0
```

The reviewed copy registry is:

```text
config/stablecoin-public-copy.mjs
```

The TypeScript public interface is:

```text
src/data/stablecoinPublicCopy.ts
```

Rendering components use `getStablecoinPublicSummary()` and do not own named-asset summary tables.

## 92-record audit

Every current stable asset is checked for:

```text
public summary source
lifecycle status
issuance status
reference target
backing types
stabilization mechanism
organization relationships
events
canonical evidence records
public source identities
deployments
reserve reports
regulatory notes
known unknowns
last reviewed date
```

Result:

```text
Passing records: 92
Failing records:  0
Missing required axes: none
Invalid copy slugs: none
Empty curated summaries: none
Duplicate curated summaries: none
```

## Evidence count boundary

PR 15 distinctions remain preserved:

```text
Canonical evidence records: 455
Public source identities:    410
Evidence relations:          455
```

Stablecoin detail pages now label `Evidence records` and `Source identities` separately. The difference does not indicate deleted evidence.

## Component and page scan

The audit scans Astro, TypeScript, JavaScript, and MJS files under:

```text
src/components
src/pages
```

It rejects:

- a `publicSummaries` map inside rendering code;
- named stablecoin slug keys embedded as public-copy maps in components or pages;
- named `coin.slug` or `coin.id` conditionals that alter one asset’s public meaning.

Approved record-specific copy belongs in reviewed data or copy registries, not presentation components.

## Generated reports

```text
data/generated/record-copy-migration-audit.json
data/generated/record-copy-migration-validation.json
```

The audit contains one row for each of the 92 assets and records its copy source, normalized axes, related-record counts, missing-axis list, and pass/fail result.

## Validation

CI rejects:

- canonical count drift;
- missing or duplicate stablecoin audit rows;
- copy entries for unknown slugs;
- empty or duplicate curated summaries;
- fallback summaries;
- component-level asset-specific copy;
- missing organization relationships;
- missing canonical evidence or source identities;
- missing deployments;
- failure of any of the 92 migration rows.

## Non-inference rules

- Do not create a curated summary merely to replace an unresolved canonical fact.
- Do not convert an unknown or missing value into a known value through prose.
- Do not hide known unknowns because a summary is concise.
- Do not move record-specific semantic decisions back into components.
- Do not alter source, relationship, event, deployment, or evidence identity counts without a separate audited migration.

## Gate result

After PR #184 merges:

```text
Phase 2 / Gate C — PASS
PR 5 through PR 16 — complete
Existing 92-record migration — complete
```

## Next

```text
PR 17 — finalize site architecture and route roles
```

PR 17 begins Phase 3. Record growth, Batch 18 selection, visual implementation, and production publication remain outside PR 16.
