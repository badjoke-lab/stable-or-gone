# DESIGN.md — Stable or Gone

Status: active rebuild authority
Updated: 2026-07-03
Visual family: Modern Evidence Registry
Tracking: issue #281

## 0. Authority

The Editorial Ledger UI v3 is a rejected visual completion state. Its data, route, accessibility, and rendering work may be reused, but its visual rules and completion claims are not binding.

The current authority is:

```text
docs/ui-redesign/rebuild-contract-v4.md
config/ui-v4-visual-acceptance.json
docs/roadmap.md
```

No document or workflow may claim UI completion without satisfying the visual acceptance contract.

## 1. Product identity

Stable or Gone is a source-backed historical and operational registry for stablecoins and related stable-value assets.

It must help a reader answer:

- What is this asset now?
- Can it be issued or redeemed?
- What backs or stabilizes it?
- Who issues, controls, or operates it?
- What material events changed it?
- What evidence supports the record?
- What remains unknown?

It must not feel like a trading terminal, promotional crypto landing page, generic SaaS dashboard, newspaper reproduction, or raw database dump.

## 2. Visual direction

Use a modern evidence-registry system:

- neutral light background with distinct content surfaces;
- dark charcoal text;
- existing muted dark-red SOG accent used sparingly;
- readable sans-serif body and data typography;
- compact but not microscopic metadata;
- visible grouping through spacing, surfaces, typography, and borders;
- restrained radius and shadow, without card-grid excess;
- clear interaction states;
- no giant decorative masthead;
- no border-only hierarchy;
- no unbounded full-dataset page as the primary browsing mode.

## 3. Protected assets and contracts

Reuse the existing approved logo. Preserve canonical data, routes, machine-readable outputs, provenance, keyboard operation, visible focus, reduced motion, forced-colors support, 320px behavior, and 200 percent zoom support.

## 4. Typography minimums

Default targets:

- body and primary data: 15–16px;
- controls: at least 14px;
- metadata: at least 12px;
- table headings: at least 12px;
- H1: prominent but not theatrical;
- line height must support sustained reading.

Exceptions require a documented reason and screenshot approval.

## 5. Page hierarchy

### Home

A product entrypoint with prominent registry search, current registry state, recent material changes, records requiring attention, and direct exploration paths.

### Stablecoin register

A bounded, usable exploration surface with search, visible filter options and counts, selected-filter chips, clear-all, sorting, pagination, understandable compare behavior, and deliberate mobile transformation.

### Stablecoin dossier

Order information by operational meaning:

1. current status;
2. redemption;
3. backing and reserves;
4. issuer and control;
5. latest material events;
6. lifecycle timeline;
7. deployments and legal context;
8. evidence;
9. unresolved questions;
10. raw registry fields.

### Events

Use bounded browsing, useful grouping, event type and impact distinctions, sticky context where appropriate, and deliberate mobile presentation.

### Organizations

Prioritize role, jurisdiction, related assets, relationship state, and evidence. Do not present one undifferentiated long table.

### Guides and long-form

Use readable width, contents navigation, summaries, examples, callouts, tables, and source presentation.

## 6. Acceptance

Screenshot generation is not design approval. Automated rendering checks establish technical health only.

Completion requires the exact desktop and mobile artifacts, every required template approval, no skipped audit step, and explicit owner approval recorded in `config/ui-v4-visual-acceptance.json`.
