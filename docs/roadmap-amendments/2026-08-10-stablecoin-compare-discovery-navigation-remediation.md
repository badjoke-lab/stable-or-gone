# Stablecoin Compare Discovery and Navigation Remediation — 2026-08-10

Status: authority only — implementation begins only after this authority is merged.

## Trigger

Direct production review of `/stablecoins/` showed that the matrix itself works, but the interaction flow does not. The comparison panel sits after the full twenty-record register and pagination, making discovery weak and forcing repeated register-to-bottom scrolling when users change candidates.

This is a material public-UI defect under `docs/ui-v3-remediation-authority.md`; automated visual success does not override the observed defect.

## Authorized remediation

The next implementation PR may modify only the `/stablecoins/` Compare interaction and its dedicated tests/audits. It must:

- move the comparison panel ahead of the public-register result table rather than after pagination;
- show a persistent Compare dock after the first selected record;
- show selection count and selected record identities in that dock;
- provide a `View comparison` action from the dock without automatically stealing scroll position on checkbox changes;
- provide an in-comparison `Add / replace record` control so a removed column can be replaced without scrolling back through the register;
- preserve the existing two-to-four-column aligned matrix, `Differences only`, explicit `Unknown` / `Not recorded`, individual removal, fifth-selection rejection, URL restoration, and bounded mobile horizontal scrolling.

## Boundaries

Canonical and public data counts remain unchanged. No Evidence archive proposal is implemented here. No ranking, score, recommendation, winner/loser language, schema/taxonomy change, route addition, or unrelated sitewide redesign is authorized.

The Evidence Archive Payload Verification Batch 2 review result remains preserved at `REVIEW_GATE`: ten reviewed, eight proposals, two no-safe-change, zero canonical promotions authorized.

## Acceptance

Before merge, the implementation must demonstrate desktop and mobile states for zero/one/two/four selected records, dock visibility/discovery, direct dock-to-matrix navigation, remove-and-replace without register scrolling, fifth-selection rejection, shared URL restore, no page-level overflow, and normal Compare matrix behavior.

After implementation production verification, this temporary UI authority must close and control returns to the preserved Evidence Archive `REVIEW_GATE`.
