# Stablecoin Logo Disposition Operating Specification

Updated: 2026-08-12  
Status: permanent operating requirement after merge

## Purpose

This specification makes Stablecoin mark review a normal part of canonical record growth instead of an optional follow-up UI task.

The goal is not to maximize logo count. The goal is to ensure that every canonical stablecoin has a reviewed display disposition at the same time the canonical record is introduced.

## Canonical principle

A canonical stablecoin may render either:

```text
direct Stablecoin/product logo
or
neutral monogram fallback
```

Both are valid outcomes. What is prohibited is introducing a new canonical asset without deciding which outcome is supported by the reviewed source record.

## Required research step for every new canonical stablecoin

Every growth review that can promote a new canonical stablecoin must include a logo/mark check alongside identity, organization, lifecycle, reserve, redemption, deployment, legal, Evidence, and known-unknown review.

The logo check must review, where relevant and available:

```text
official product site
official product documentation
official product repository
issuer site only as a discovery source unless the mark is explicitly asset-specific
pinned third-party asset repositories with exact asset/deployment identity binding
existing local audited assets and collision-safe resolver mappings
```

No source is accepted by filename or symbol resemblance alone.

## Required disposition fields

Every promoted canonical stablecoin must have one record containing:

```text
slug
name
symbol
decision
mark_type
asset_path
source_page
source_asset_url
source_class
identity_basis
evidence
transformation
```

`asset_path` and `source_asset_url` may be null only for an explicit neutral fallback.

## Accepted direct-logo mark types

A direct display logo may use only a reviewed mark attributable to the stablecoin itself or its specific product.

Examples of acceptable classes include:

```text
token_logo
official_product_mark
previously_audited_mark with preserved identity provenance
```

A pinned third-party repository mark may be accepted only when the same canonical asset is bound through exact deployment identity or another reviewed non-ambiguous identifier.

## Neutral fallback classes

The neutral fallback remains mandatory when the best reviewed imagery is only:

```text
official_project_mark
official_issuer_mark
verified_directory_mark without sufficient direct asset attribution
ambiguous or colliding symbol art
unverifiable imagery
```

The existence of a project or issuer logo is not sufficient reason to present it as the stablecoin's own logo.

## Asset handling

Accepted direct-logo assets must be vendored locally. Public rendering must not depend on a third-party runtime image host.

The local asset family must preserve:

- canonical-slug-first resolution;
- audited unique-symbol fallback only where explicitly allow-listed;
- source and license provenance;
- equivalent display geometry for direct and fallback marks;
- decorative mark semantics with adjacent name and symbol authoritative.

Generated substitute brand artwork is prohibited.

## Permanent merge gates

A PR that adds one or more canonical stablecoins must not merge unless all of the following are true:

1. every new canonical slug has a reviewed logo disposition;
2. total logo dispositions equal total canonical stablecoin records;
3. every direct-logo disposition points to an existing local asset;
4. every direct-logo mapping resolves consistently from the public mark resolver;
5. every fallback disposition is represented in the display policy;
6. the Stablecoin logo coverage audit runs on the PR;
7. the all-record mark catalog can represent every canonical record;
8. no unrelated issuer/project mark is silently promoted to token-logo status.

The build/CI trigger configuration must treat canonical stablecoin data changes as relevant to logo coverage validation. A record-growth PR must not be able to avoid the logo gate merely because it does not touch `src/**` or `public/stablecoin-logos/**`.

## Record-growth specification requirement

Every future work-item specification that authorizes new canonical stablecoin additions must cite this file and include a `logo disposition` item in its complete-record requirement.

The growth specification must state one of the following for every proposed asset before implementation closeout:

```text
direct logo accepted with reviewed provenance
neutral fallback accepted with reviewed reason
```

A statement such as “logo not addressed”, “to be added later”, or an omitted disposition is not complete-record status.

## Corrections and later promotion

A neutral fallback may later become a direct logo when stronger current evidence is reviewed. Such a change is public-presentation maintenance and does not change the canonical stablecoin identity.

The later review must still record:

```text
source
mark type
identity basis
provenance/license
local asset path
reason the previous fallback can now be replaced
```

## Baseline at activation

At activation of this operating specification:

```text
Canonical stablecoins: 119
Direct Stablecoin/product logos: 98
Neutral fallbacks: 21
Reviewed dispositions required: 119
```

The current 21 fallback records are separately scheduled for a fresh re-audit under `config/compare-logo-maintenance-authority.json`. This operating specification does not predetermine how many of those 21 will remain fallback.

## Safety boundary

Logo review does not authorize:

- canonical stablecoin additions by itself;
- lifecycle or status changes;
- Evidence or Evidence Relation changes;
- Market Access changes;
- archive URL changes;
- ranking, scoring, recommendations, or risk inference;
- new public routes;
- generated substitute logos.
