# UI v3 Organizations and Events corrective audit

Date: 2026-07-01

## Reason

Merged PR #266 changed only the Organization and Event row components. It did not complete the four page families and must be treated as a partial precursor.

## Corrective scope

- Organizations index routed through `OrganizationEditorialRegister.astro`.
- Organization details routed through `OrganizationEditorialRecord.astro`.
- Events index routed through `EventEditorialRegister.astro`.
- Event details routed through `EventEditorialRecordV3.astro`.
- Dedicated view models preserve canonical relationships, taxonomy, subjects, typed details, evidence, value states, and known unknowns.
- Index search, filters, sorting, zero-result behavior, desktop tables, and compact mobile records remain available.
- PageHero, MetricCard, oversized visual marks, glow treatments, and rounded dashboard-card composition are removed from the four route files.

## Data and route impact

- Canonical stable assets changed: 0.
- Organization, relationship, event, evidence, deployment, reserve, guide, and known-unknown records changed: 0.
- Public routes changed: 0.
- Logo assets changed: 0.
- Machine-readable schema changed: 0.

## Acceptance

Gate V3-C may be recorded only after Astro check, production build, existing data validators, mobile-information validation, and pull-request workflows succeed for the corrective head commit.

## Schedule correction

The corrective pull request occupies the next available pull-request number. Guides and later UI work move one number later than the schedule written before the partial #266 merge.
