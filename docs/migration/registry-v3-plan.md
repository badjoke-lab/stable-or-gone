# Registry v3 implementation plan

Status: historical plan — superseded  
Original migration type: additive  
Original starting baseline: 40 canonical stable assets  
Superseded: 2026-06-26

## 1. Historical purpose

This document originally planned the Registry v3 migration from the protected forty-record Registry v2 checkpoint.

That migration established or extended:

- legal profiles;
- stable-asset relationships;
- reserve components;
- expanded classification axes;
- deployment canonicality;
- yield and income mechanics;
- typed event details;
- Registry v3 loaders and validators;
- machine-readable Registry v3 coverage.

The registry has since reached 92 canonical stable assets with required-layer coverage across the current canonical groups.

## 2. Current status

```text
Stable assets:               92
Organizations:               86
Relationships:              101
Classifications:             92
Reserve/redemption profiles: 92
Events:                     150
Event v2 details:           150
Evidence:                   455
Evidence relations:         455
Reserve reports/context:    100
Known unknowns:             253
Regulatory notes:             9
Deployments:                130
Legal profiles:              92
Stable-asset relationships:   4
Reserve components:         125
Income profiles:             92
```

The old phases and recommended PR sequence below are no longer the active execution schedule.

## 3. Replacement documents

Current work must follow:

```text
AGENTS.md
docs/spec-governance.md
docs/roadmap.md
docs/deployment-policy.md
docs/ui-redesign/master-spec.md
docs/ui-redesign/implementation-plan.md
```

The active program repairs the public taxonomy, production snapshot integrity, information architecture, responsive behavior, evidence presentation, known-unknown presentation, and visual system before the 100-record publication checkpoint.

## 4. Historical goals retained as requirements

The following Registry v3 principles remain binding through the current canonical specifications:

- existing canonical IDs do not change without a dedicated migration;
- existing slugs and public route patterns remain protected;
- distinct historical identities are not merged for convenience;
- chain deployments and simple wrappers do not become separate canonical assets by default;
- legal classification remains separate from economic classification;
- organizations and roles remain separate;
- evidence relations and known unknowns remain first-class records;
- unsupported values remain unknown or null rather than being invented;
- public machine-readable output contains reviewed canonical data only.

The canonical meaning of these rules now resides in:

```text
docs/stable-asset-scope.md
docs/classification-spec.md
docs/data-model-v3-spec.md
```

## 5. Historical phase record

The original migration used these phases:

```text
Phase 1  schema and templates
Phase 2  loaders and validators
Phase 3  migrate the existing forty records
Phase 4  public presentation
Phase 5  machine-readable public layer
Phase 6  statistics
Phase 7  migration audit
```

The schema, loader, migration, and public-layer work evolved beyond the original forty-record baseline. The old Phase 4 public-presentation description is not sufficient for the current registry and must not be used as the design specification for the 100-record release.

## 6. Current public-presentation replacement

Public presentation is now governed by `docs/ui-redesign/master-spec.md`.

That specification requires, among other things:

- one verified production snapshot across all route families;
- canonical/public/legacy value separation;
- stable filter taxonomies rather than free-text enumeration;
- explicit primary relationship selection;
- evidence-source deduplication with preserved claim relations;
- separation of deployment status from verification work state;
- explicit unknown, missing, disputed, and not-applicable semantics;
- stablecoin detail hierarchy for current state, organizations, mechanisms, deployments/legal context, history, evidence, and known unknowns;
- page-specific mobile transformations;
- accessibility, performance, SEO, route, and machine-readable parity.

## 7. Current implementation sequence

The binding PR sequence is `docs/ui-redesign/implementation-plan.md`.

Summary:

```text
documentation reset
production-integrity repair
public-taxonomy and semantic migration
information architecture and mock approval
registry UI implementation
stablecoin dossier implementation
search and editorial alignment
responsive, accessibility, performance, SEO, and parity hardening
92-record audit
final eight-record promotion
100-record release candidate
manual production publication
```

## 8. Compatibility and rollback rules retained

- Every migration PR must be independently buildable.
- Legacy fields remain until compatibility validation proves removal safe.
- New public fields fall back to explicit approved value states.
- A failed migration batch is reverted without altering unaffected records.
- Public URLs and canonical IDs remain protected.
- Before-and-after record-group counts must be reported.
- Canonical record loss requires an explicit audited decision.

## 9. Statistics dependency

`docs/stats-spec.md` remains a canonical specification for statistics, but statistics work is not the current next item.

Statistics implementation or revision resumes only after the repaired taxonomy, information architecture, and 100-record release gates permit it. Statistics must consume the repaired canonical/public mappings rather than the legacy public labels or free-text groupings.

## 10. Historical completion reference

The original forty-record completion criteria are retained only as migration history:

```text
legal profiles present
yield or income profiles present
deployments classified or explicitly unknown
material asset relationships represented
Registry v2 compatibility checked
machine-readable output synchronized
migration audit completed
```

They do not replace the current 92-record repair and 100-record release criteria.
