# UI v3 Guides Editorial Article audit

Date: 2026-07-02
Roadmap item: PR #268

## Scope

- Rebuild `/guides/` as an Editorial Ledger index with a masthead, collection summary, category navigation, featured guide, and ruled article lists.
- Rebuild all nine guide routes as one Editorial Article family.
- Replace the former hero and publication-information panels with a common masthead containing title, deck, publication state, information-current-through date, revision state, and automatically generated contents navigation.
- Render revision history and related Stable or Gone records as ruled editorial sections rather than dashboard cards.
- Preserve all article body text, tables, source links, related record links, metadata, JSON-LD, sitemap routes, and canonical paths.

## Guide routes

```text
/guides/open-usd-reserve-revenue-model/
/guides/genius-act-stablecoins/
/guides/mica-stablecoins/
/guides/uk-stablecoin-capital-rules-2026/
/guides/jpyc-vs-jpysc/
/guides/what-is-a-depeg/
/guides/status-vs-event/
/guides/reserve-disclosure-basics/
/guides/stablecoin-lifecycle-terms/
```

## Preservation

- Canonical stable assets changed: 0.
- Guide article facts changed: 0.
- Guide publication dates changed: 0.
- Information-current-through dates changed: 0.
- Public routes changed: 0.
- Stablecoin-to-guide link mappings changed: 0.
- Logo assets changed: 0.
- Machine-readable schema changed: 0.

## Acceptance

PR #268 may be completed only after:

- all guide routes use `GuideArticleHeader.astro`;
- the guide index and article family contain no v2 hero composition;
- the guide validator, Astro check, production build, responsive contract, public consistency, and all pull-request workflows succeed;
- the roadmap, implementation plan, AGENTS, and active-workstream validator identify PR #268 as the active item and PR #269 as next.
