# UI v3 representative visual audit

Date: 2026-07-02
Roadmap item: PR #271
Gate: V3-F
Status: passed

## Purpose

This audit verifies the rendered Editorial Ledger UI rather than relying only on source markers. The pull request built the current site, captured real full-page screenshots from the built output, measured the rendered DOM, preserved the image artifacts, and completed human image review.

## Execution record

```text
Workflow: Capture full-page screenshots
Run ID: 28538275448
Artifact ID: 8018828396
Artifact name: sog-full-page-screenshots-all-representative-28538275448
Artifact digest: sha256:23fd96a60be43a19315da7abe9baffd7654e4383c6ee07731be218997ac2ccb8
Capture head: e0e1b2f41017d6f19387bd03eb258d54c464b78c
Result: PASS
```

The capture head contains the complete rendered-audit implementation. Later changes in the same pull request only record the successful audit and do not alter rendered pages, canonical data, public routes, logos, or machine-readable output.

## Devices and coverage

- desktop: 1440 × 900
- mobile: 393 × 852
- public routes discovered: 378
- selected routes per device: 24
- captured routes per device: 24
- total full-page images reviewed: 48
- capture failures: 0

Both devices used representative mode and reduced-motion rendering.

## Unique pages captured on both devices

```text
/
/stablecoins/
/issuers/
/events/
/models/
/guides/
/glossary/
/methodology/
/updates/
/about/
/support/
/contact/
```

## Repeated-family samples captured on both devices

Stablecoin details:

```text
/stablecoin/gusd/
/stablecoin/fei/
/stablecoin/usdt/
```

Organization details:

```text
/issuer/gemini/
/issuer/agoric/
/issuer/makerdao-sky/
```

Event details:

```text
/event/sog_ev_euri_active_batch_j/
/event/sog_ev_spot_v5_upgrade_2025/
/event/sog_ev_usdt_2026_06_12_tron_blacklist/
```

Guide articles:

```text
/guides/what-is-a-depeg/
/guides/jpyc-vs-jpysc/
/guides/mica-stablecoins/
```

This satisfies the requirement for three stablecoin detail records, three organization detail records, three event detail records, and three guide articles per device.

## Automated rendered results

| Check | Desktop | Mobile |
| --- | ---: | ---: |
| Selected / captured | 24 / 24 | 24 / 24 |
| Horizontal overflow | 0 | 0 |
| Broken images | 0 | 0 |
| Brand violations | 0 | 0 |
| Legacy visual markers | 0 | 0 |
| Unexpected initial empty states | 0 | 0 |
| Pages without exactly one `h1` | 0 | 0 |
| Pages without exactly one `main` | 0 | 0 |

Every screenshot exceeded the minimum diagnostic file size. The generated machine-readable and Markdown reports contained zero failures and zero warnings.

## Human image review

The top, middle, and bottom regions of all 48 full-page images were reviewed, together with full-page silhouettes and focused contact sheets for unique and repeated page families.

Findings:

- hierarchy and reading order remained clear across all page families;
- no clipped labels, values, controls, or page-level horizontal overflow were visible;
- registry indexes rendered populated records rather than false empty states;
- Stablecoin, Organization, Event, and Guide detail samples retained their distinct dossier, responsible-body, incident-record, and Editorial Article structures;
- no giant hero, KPI-card row, blue-purple glow, or SaaS-dashboard composition remained visible;
- shared Stable or Gone logo use was consistent and no substitute logo appeared;
- long record pages were intentionally dense but remained structured by headings, rules, compact records, and readable section rhythm;
- mobile tables, disclosures, identifiers, evidence, correction links, and support copy controls remained usable and legible;
- no visual defect required a source or CSS correction in PR #271.

## Outputs reviewed

```text
artifacts/screenshots/manifest.desktop.json
artifacts/screenshots/manifest.mobile.json
artifacts/screenshots/desktop/*.png
artifacts/screenshots/mobile/*.png
artifacts/screenshots-desktop.zip
artifacts/screenshots-mobile.zip
artifacts/screenshots/representative-visual-audit.json
artifacts/screenshots/representative-visual-audit.md
```

## Preservation

- Canonical stable assets changed: 0.
- Organization, relationship, event, evidence, reserve, deployment, guide, update, and known-unknown records changed: 0.
- Public routes changed: 0.
- Logo assets changed: 0.
- Contact and support destinations changed: 0.
- Machine-readable schema changed: 0.

## Gate result

Gate V3-F passed. Automated desktop/mobile rendered checks reported zero failures, all 48 uploaded images received human review, and the normal pull-request workflows passed for the complete audit implementation. PR #272 may proceed to accessibility, performance, and legacy cleanup after PR #271 merges.
