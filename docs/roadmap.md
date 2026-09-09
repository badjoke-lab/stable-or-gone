# Stable or Gone Roadmap

Updated: 2026-09-09
Status: UI_REDESIGN_V4_AUTHORITY

## Active lane

The active presentation workstream is the production-safe SOG UI redesign authorized by:

```text
config/ui-redesign-v4-authority.json
docs/roadmap-amendments/2026-09-09-ui-redesign-v4-authority.md
docs/UI-REDESIGN-SPEC.md
docs/UI-REDESIGN-SCHEDULE.md
```

Primary implementation branch: `ui/sog-redesign-v4`.
Production branch: `main`.

The current production UI remains live until the redesign is complete. Partial redesign merges to `main` are forbidden.

## Work order

```text
Gate 0 authority / isolation / old visual-gate quarantine
-> Gate 1 design system + desktop/mobile shell
-> Gate 2 Home + Register
-> Gate 3 Stablecoin Dossier
-> Gate 4 Events + Event Detail + Timeline
-> Gate 5 Compare + Issuer + Stats
-> Gate 6 Reference + Access/Regulation + Guides + utility pages
-> Gate 7 full branch verification
-> Gate 8 one-shot production cutover
-> Gate 9 outgoing-UI cleanup
```

`docs/UI-REDESIGN-SCHEDULE.md` is the detailed schedule and progress ledger.

## Parallel canonical lane

Canonical record growth, evidence work, guides, monitoring, and ordinary maintenance may continue on `main` while Gates 0–7 proceed. The redesign branch periodically syncs current `main` and adapts to the latest reviewed data.

Do not freeze stale record counts in the redesign authority. Current counts/hash are read from current `main` when verification runs.

## Preserved contracts

The redesign must preserve reviewed canonical facts, explicit unknowns, evidence/provenance relationships, deterministic per-asset JSON, public machine-readable outputs, Ledger Series projection, official-origin/legacy-redirect contracts, Stablecoin logo disposition/fallback rules, keyboard/focus fundamentals, mobile information preservation, and production verification.

## UI regression authority treatment

`docs/ui-v3-remediation-authority.md` remains historical regression context for accessibility, responsive safety, state handling, route completeness, and canonical/public boundaries. Its exact outgoing visual layout and exhaustive screenshot equality are not the active redesign target.

## Production boundary

No DNS/Cloudflare account mutation, new GA4 identity, ranking/scoring/recommendation, or canonical-fact invention is authorized by the UI redesign.

Before Gate 8, production change from the redesign is expected to be `no`.
