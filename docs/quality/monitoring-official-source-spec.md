# Stable or Gone official-source monitoring

Status: canonical specification  
Updated: 2026-07-05  
Roadmap items: PR #231, amended through PR #238 and the EU market-access specification amendment

## Purpose

Official-source monitoring observes allowlisted issuer, protocol, platform-policy, and regulator/register pages, normalizes responses deterministically, compares them with reviewed baselines, and produces private review material only.

Observations and candidates are not canonical facts or public classifications.

Related specifications:

```text
docs/quality/monitoring-pipeline-spec.md
docs/quality/monitoring-baseline-spec.md
docs/quality/monitoring-change-detection-spec.md
docs/quality/monitoring-observation-classification-spec.md
docs/quality/monitoring-normalization-spec.md
docs/quality/eu-stablecoin-market-access-research-and-monitoring-spec.md
```

The current implementation remains limited to the checked-in allowlist and existing schema. EU/EEA market-access platform-policy and regulatory-register observation becomes an implementation work item only at the roadmap's monitoring-expansion phase.

## Trigger and permissions

Until the scheduled-read-only roadmap item is implemented, the workflow remains manual-only and read-only:

```text
workflow_dispatch
contents: read
```

There is no automatic commit, automatic pull request, baseline mutation, canonical write, guide edit, or production action.

The later scheduled workflow authorized by the roadmap must preserve `contents: read` and the same no-write boundary.

## Source allowlist

Sources exist only in reviewed monitoring source configuration and require, at minimum:

```text
source_id
display_name
url
allowed_hosts
source_kind
affected_stablecoin_ids
affected_organization_ids
signal_types
enabled
```

The EU market-access implementation may extend the schema with reviewed fields needed to preserve:

```text
platform identity
platform legal entity
region scope
function scope
market-access signal family
regulator/register family
```

Any schema extension requires an earlier or same-PR schema/specification update and validator coverage. It must not overload issuer IDs or stablecoin IDs to represent platform identity when that would be semantically false.

URLs must use HTTPS. Configured and final hosts must be allowlisted. Target IDs must already exist when an ID field points to canonical SOG records. Authentication, cookies, and bypass behavior are prohibited.

Approved source families are:

```text
issuer or protocol transparency
issuer redemption or product terms
issuer lifecycle documentation
first-party platform asset-availability policy
first-party platform regional restriction or delisting notice
official regulator action or guidance
official regulatory register or register export
```

News and search discovery are separate lead-generation inputs and are not accepted official-source observations merely because they mention a monitored platform or asset.

## Baseline and normalization

Comparison points exist in `scripts/monitoring/baselines/official-source-baselines.json` or a later reviewed successor approved by specification.

The current baseline and every current observation use:

```text
normalization_version: sog_official_source_normalization_v2
```

The monitor records exact-byte and normalized-content SHA-256 digests. Raw response bodies and normalized page text are not stored. No source-specific normalization exception is approved unless the specification and fixtures are amended first.

A run may read the baseline but cannot modify or accept it.

## Observation contract

Private observations include source identity, URLs, timestamp, fetch state, response metadata, exact and normalized digests, normalization version, matched signals, classification, comparison provenance, and any fetch error.

Allowed states:

```text
new_source
unchanged
metadata_changed
content_changed
fetch_failed
```

Tracked metadata includes exact body digest, final URL, content type, ETag, and Last-Modified.

Fetch limits for the current implementation:

```text
timeout: 20 seconds per source
maximum response body: 2 MiB
user agent: Stable-or-Gone-Review-Monitor/1.0
```

## Candidate contract

A candidate exists only when the fetch succeeded, at least one configured signal matched visible normalized content, and the state is `new_source` or `content_changed`.

`unchanged`, `metadata_changed`, and `fetch_failed` create zero candidates.

Every candidate carries normalization version, classification reason, prior/current digests, metadata differences, target IDs, duplicate review, lineage review where applicable, and these fixed values:

```text
status: needs_human_review
canonical_action: none
```

No candidate authorizes a baseline update, canonical change, article revision, or public market-access claim.

## EU/EEA market-access observation rule

Platform-policy monitoring must not collapse service availability into one boolean.

The implementation must preserve, where the source supports them:

```text
buy
sell
spot trading
margin
earn
deposit
withdraw
custody
convert
auto-conversion
```

A candidate must preserve the narrowest supported geography or legal-entity scope. EEA must not be rewritten as EU. A customer-cohort migration notice must not be generalized to a worldwide policy.

Material access candidates include:

```text
available -> unavailable
unavailable -> available
trading enabled or disabled
deposit enabled or disabled
withdrawal enabled or disabled
custody-only transition
sell-only transition
convert-only transition
auto-conversion deadline added or changed
region scope changed
customer legal entity changed
new stablecoin support
stablecoin support removal
regulatory register status changed
```

Cosmetic page changes, footer changes, cookie text, analytics markup, and metadata-only changes are not market-access candidates.

## Output contract

Review-disabled runs retain the current five-file contract. Review-enabled runs retain the current nine-file contract until a later reviewed schema amendment deliberately changes that contract. Private manifests, observation reports, candidate reports, and summaries record the normalization version and five-state counts.

The canonical before/after digest and protected path set must remain identical.

## Test rule

Offline fixtures validate allowlists, baselines, normalization, classification, identifiers, review material, no raw-content retention, and zero canonical changes.

Any market-access schema extension must add fixtures for:

```text
function-specific changes
region-scope changes
legal-entity changes
false-positive cosmetic page changes
multiple assets on one platform page
regulatory register additions or removals
```

Live official-source access occurs only in the approved manual or later bounded scheduled read-only workflow.

## Public-output rule

Sources, baselines, observations, normalized digests, comparisons, candidates, and raw market-access monitoring results remain excluded from public pages, public JSON, machine-readable public files, sitemap output, and canonical counts.

A reviewed editorial PR may use confirmed source facts to update `/guides/eu-stablecoin-access-after-mica/`, but the article is not a rendering of raw monitoring output and never updates automatically.

## Scheduled-operation target

The later roadmap item for bounded scheduled read-only monitoring targets:

```text
platform policy and announcement sources: daily
ESMA and regulatory registers: weekly
issuer regulatory/transparency sources: weekly unless an existing cadence is stricter
article stale-state review: weekly
```

News discovery may run daily as a separate lead-generation layer. It does not create a confirmed market-access fact without source review.

## Deployment classification

```text
No production deployment required
```
