# Evidence Archive Payload Verification Batch 2 Implementation Authority — 2026-08-12

## Purpose

Authorize one bounded canonical Evidence maintenance implementation using only the eight exact dated archive URLs already payload-reviewed and recorded by PR #543.

## Entry state

```text
Main: 2825eb293f833061deb1ef8bdb628b32a93538cc
Russia Guide lane: complete and production verified by run 31509169378
Current canonical stage: REVIEW_GATE
Evidence reviewed: 10
Dated exact archive proposals: 8
Reviewed no-safe-change: 2
Archive recorded / not recorded: 463 / 122
Evidence / Relations: 585 / 585
Market Access Records: 12
Stable assets: 119
```

## Authorized exact additions

```text
sog_src_susd_legacy_context_batch_a -> https://web.archive.org/web/20250720161454/https://docs.synthetix.io/exchange/perps-v2-optimism/introduction-legacy
sog_src_susd_rebuilding_2026 -> https://web.archive.org/web/20260514190950/https://blog.synthetix.io/rebuilding-susd/
sog_src_susd_roadmap_2026 -> https://web.archive.org/web/20260427180444/https://blog.synthetix.io/2026-roadmap/
sog_src_susd_sip_status_2026 -> https://web.archive.org/web/20251117181931/https://sips.synthetix.io/
sog_src_susd_synthetix_docs -> https://web.archive.org/web/20251014024417/https://docs.synthetix.io/
sog_src_susd_v3_faq_batch_a -> https://web.archive.org/web/20250430131854/https://docs.synthetix.io/developer-docs/v3-frequently-asked-questions-faq
sog_src_terra_docs -> https://web.archive.org/web/20210903073902/https://www.terra.money/
sog_src_tether_transparency -> https://web.archive.org/web/20220712233033/https://tether.to/en/transparency/
```

These URLs are copied exactly from the completed manual payload-review artifact. No normalized or substitute archive URL is authorized.

## Explicitly unchanged

```text
sog_src_susd_sip420_2024 — reviewed no-safe-change; redirect-only exact canonical replay
sog_src_susd_sip423_2026 — reviewed no-safe-change; zero reviewed HTTP-200 capture
```

## Canonical boundary

The implementation may add `archived_url` only to the eight existing Evidence identities above.

```text
Evidence identities: 585 -> 585
Evidence Relations: 585 -> 585
Stable assets: 119 -> 119
Market Access Records: 12 -> 12
Archive recorded: 463 -> at most 471
Archive not recorded: 122 -> at least 114
Maximum archive delta: +8 / -8
```

Source URLs, Evidence IDs, relation topology, asset data, Market Access, schema/taxonomy, public routes, material UI/CSS, rankings, scoring, and recommendations are outside authority.

Existing repository checkpoint/statistics/release-integrity artifacts may be refreshed only when required by existing deterministic validation and only to reflect the bounded archive coverage change with all same-count record inventories preserved.

## Implementation exit

After the exact eight additions are validated, merged, and production-verified, return to `REVIEW_GATE`. No Batch 3, source normalization, or further archive promotion is automatically authorized.
