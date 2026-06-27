# Stable or Gone Meaningful Change History v1

Status: approved information-architecture specification  
Phase: Phase 3  
Plan unit: PR 20 — define meaningful public change history  
Implementation boundary: specification and validation only. Public implementation remains PR 34.

## 1. Purpose

SOG must explain **what changed**, not merely show when a record was checked or when the site was built.

A meaningful public change entry connects:

```text
change type
recorded date
effective date or explicit date state
affected records
changed fields
before and after values
supporting evidence
summary
related public routes
source pull requests
correction or supersession links
```

Routine review timestamps, source publication dates, and generated build timestamps are not change entries by themselves.

## 2. Current update layer

The current public Updates page reads 13 records from:

```text
data/registry-updates.json
```

Current legacy categories:

```text
data:        8
content:     2
ui:          2
foundation:  1
```

All 13 entries have reviewed public-copy overlays in `src/data/updatePublicCopy.ts`. They remain public history and are not deleted.

The current format has:

```text
id
date
title
category
summary
related_paths
```

It does not yet contain structured change type, affected records, changed fields, before and after values, evidence links, effective date state, source PRs, or correction relationships. Therefore no current entry is silently treated as a v1 structured change entry.

Migration of the 13 legacy records must be manual. Broad categories such as `data` and `ui` are not sufficient to infer a meaningful change type.

## 3. Approved change types

### Status change

Use when lifecycle or issuance state changes.

Requirements:

```text
before and after required
evidence required
effective date required or explicitly unknown
stablecoin record required
```

A review that confirms the existing status is not a status change.

### Event added

Use when a reviewed historical event is added to the registry.

Requirements:

```text
event record required
affected stablecoins and organizations linked when applicable
evidence required
effective date comes from the event record
```

The entry records that SOG added the event. It does not claim the event happened on the date SOG recorded it.

### Evidence added

Use when a new public source identity or evidence relationship is added.

Requirements:

```text
added source identity or relation identified
supported claims identified
affected records identified
recorded date required
effective date not applicable
```

Source identity count and evidence relation count remain separate.

### Relationship change

Use when an organization relationship is added, ended, corrected, or materially reclassified.

Requirements:

```text
before and after required
evidence required
stablecoin and organization affected records required
effective date required or explicitly unknown
```

Changing only the primary display selection does not imply that the canonical organization relationship changed.

### Reserve or redemption change

Use when reserve composition, disclosure status, redemption access, settlement asset, fees, timing, eligibility, or related mechanics materially change.

Requirements:

```text
before and after required
evidence required
effective date required or explicitly unknown
affected stablecoin required
```

Adding an old reserve report without a current mechanics change is normally `evidence_added`, not this type.

### Known unknown added

Use when review identifies a material unresolved question that should be publicly tracked.

Requirements:

```text
known-unknown record required
affected record required
review basis or evidence required
effective date not applicable
```

This is a change to SOG’s documented knowledge state, not necessarily a change to the stablecoin itself.

### Known unknown resolved

Use when sufficient evidence resolves a previously recorded known unknown.

Requirements:

```text
prior unknown ID required
before and after required
evidence required
effective date required or explicitly unknown
```

The prior unknown remains visible in history.

### Copy-only correction

Use when wording, grammar, formatting, or a non-factual presentation defect is corrected without changing canonical facts.

Requirements:

```text
old and new wording required
canonical changed-fields list empty
no factual effective date
no fabricated evidence requirement
```

A copy-only correction must never appear as a lifecycle, reserve, relationship, event, or evidence change.

## 4. Canonical change entry

Required fields:

```text
id
change_type
recorded_at
effective_date_state
affected_records
changed_fields
before
after
evidence_ids
summary
related_paths
source_prs
```

Optional fields:

```text
effective_at
prior_unknown_id
correction_of
supersedes
notes
```

Identity format:

```text
sog_chg_YYYY_MM_DD_descriptive_slug
```

### Affected records

Allowed record kinds include:

```text
stablecoin
organization
relationship
event
evidence_source_identity
evidence_relation
reserve_report
redemption_profile
known_unknown
deployment
guide
project_page
```

Every affected record link must name the record kind and canonical ID. A public route may be added separately for navigation.

### Before and after

Before and after values preserve the eight-state public model:

```text
known
unknown_after_review
not_recorded
not_applicable
not_public
unverified
disputed
approximate
```

Unknown is not represented as zero, empty string, false, or worst.

### Effective date

Approved effective-date states:

```text
known
not_recorded
not_applicable
disputed
approximate
```

`recorded_at` means when SOG recorded the change. `effective_at` means when the underlying event or state became effective. They must not be conflated.

## 5. Date signal audit

The canonical data contains three different classes of date signal:

```text
historical or effective dates
review-only dates
source metadata dates
```

Review-only examples:

```text
stablecoin.last_verified_at
organization.last_verified_at
evidence.accessed_at
known_unknown.last_checked_at
```

Source metadata examples:

```text
evidence.published_at
reserve report publication date
```

Excluded generated dates:

```text
build.generated_at
manifest.generated_at
version.generated_at
```

None of these create a meaningful change entry automatically.

## 6. Public placement

### Updates index

`/updates/` shows the complete public change feed across all eight types.

### Stablecoin record

`/stablecoin/{slug}/` shows every structured change that affects the stablecoin.

### Organization record

`/issuer/{slug}/` shows relevant event, evidence, relationship, reserve/redemption, known-unknown, and copy corrections.

### Event record

`/event/{id}/` shows event creation, evidence additions, known-unknown changes, and copy corrections affecting that event.

The detail-page history is a filtered view of the same canonical change entries, not a separately maintained narrative.

## 7. Append-only and correction rules

- Public change history is append-only.
- A later correction references the earlier entry.
- Superseded entries remain visible and marked.
- Historical before/after values are not overwritten when the current value changes again.
- Copy corrections do not rewrite factual history.
- Known-unknown resolution does not erase the original unknown.
- Evidence identity and evidence relation changes remain distinguishable.

## 8. Current audit result

```text
Legacy update entries:               13
Legacy categories:                    4
Duplicate legacy IDs:                 0
Public-copy overrides:               13
Missing public-copy overrides:        0
Target-ready legacy entries:          0
Date signals scanned:             1,324
Review-only date signals:            850
Source metadata date signals:        151
Historical/effective date signals:   323
Invalid date shapes:                   0
Public placement surfaces:             4
```

The legacy layer remains intact until a reviewed PR 34 migration maps each entry into zero, one, or several structured changes.

## 9. Machine validation

Authoritative configuration:

```text
config/change-history-contract.mjs
```

Generated diagnostics:

```text
data/generated/change-history-audit.json
data/generated/change-history-validation.json
```

The validator requires:

- exactly eight approved change types;
- 12 required change-entry fields;
- complete preservation of 13 legacy entries and overlays;
- no automatic legacy type inference;
- review and build timestamps excluded from meaningful changes;
- before/after and evidence rules by type;
- prior unknown and evidence for unknown resolution;
- copy-only corrections separated from factual changes;
- four public placement surfaces;
- implementation deferred to PR 34;
- zero route changes.

## 10. Implementation boundary

```text
PR 20: specification and validation only
PR 34: public Updates and editorial alignment implementation
Current legacy entries rewritten: no
Routes changed: no
Records added: no
Production deployment: no
```

The next approved work after PR 20 is PR 21: finalize responsive and accessibility specifications.
