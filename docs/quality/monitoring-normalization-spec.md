# Stable or Gone official-source normalization

Status: canonical specification  
Updated: 2026-06-29  
Roadmap item: PR #238

## Purpose

This specification defines the deterministic normalization used before hashing official-source content. Its purpose is to suppress demonstrably non-semantic representation noise without suppressing dates, quantities, percentages, reserve composition, redemption terms, issuer identity, regulatory language, contract addresses, migration language, or lifecycle statements.

Normalization reduces false monitoring candidates. It does not interpret, summarize, translate, classify, or approve source content.

## Version

The active version is:

```text
sog_official_source_normalization_v2
```

The version is recorded in the repository baseline set, every successful or failed observation, every emitted candidate, and comparison metadata.

An accepted baseline is valid only under the exact normalization version that produced its normalized digest. A normalization-version change requires a reviewed repository migration. Monitoring must not compare accepted digests created under different normalization versions.

## Shared rules

All text processing:

- decodes response bytes as UTF-8;
- normalizes Unicode to NFC;
- removes byte-order marks and zero-width formatting characters U+200B through U+200D, U+2060, and U+FEFF;
- collapses Unicode whitespace runs to one ASCII space;
- trims leading and trailing whitespace;
- preserves letter case, punctuation, digits, currency symbols, percentages, dates, addresses, URLs present as visible text, and array order.

The normalized text is used in memory for signal matching and hashing. It is never written to monitoring artifacts or baselines.

## HTML rules

For `text/html` and `application/xhtml+xml`, normalization:

- removes HTML comments;
- removes complete `script`, `style`, `template`, and `svg` containers including their contents;
- removes the document type declaration;
- replaces remaining markup with spaces;
- decodes decimal and hexadecimal numeric entities;
- decodes only the reviewed named entities required for visible spacing and punctuation;
- applies the shared Unicode and whitespace rules.

Removing markup does not remove visible element text. Removing the four listed containers is allowed because they contain executable code, presentation rules, inert templates, or vector markup that otherwise creates recurring representation noise. No other container is removed by default.

## JSON rules

For `application/json` and media types ending in `+json`, normalization:

- parses valid JSON;
- sorts object keys recursively;
- preserves array order;
- preserves numbers, booleans, nulls, and string values;
- serializes the result deterministically.

If parsing fails, the response falls back to shared plain-text normalization. JSON keys or values are not removed as noise.

## Plain-text rules

All other content types use only shared Unicode and whitespace normalization. No line, token, timestamp, identifier, or numeric value is deleted.

## Values that must remain material

Fixture validation must prove that changing any of these changes the normalized digest:

```text
calendar date or reporting period
integer or decimal quantity
currency amount
percentage or ratio
reserve or collateral composition term
redemption, minting, eligibility, or fee language
issuer, custodian, auditor, or regulator identity
contract or account address
migration, suspension, shutdown, or lifecycle statement
```

A rule that erases one of these is invalid even when it reduces monitoring noise.

## Source-specific exceptions

No source-specific normalization exceptions are approved in PR #238.

A future exception requires a separate reviewed pull request containing:

- the source ID;
- the exact volatile fragment and why it is non-semantic;
- positive fixtures proving the noise is suppressed;
- negative fixtures proving dates, values, identities, addresses, and lifecycle language remain material;
- an updated normalization version;
- a baseline migration plan.

An undocumented source-specific regular expression, selector, token deletion, or value replacement is prohibited.

## Baseline and comparison contract

`scripts/monitoring/baselines/official-source-baselines.json` requires:

```text
normalization_version: sog_official_source_normalization_v2
```

Each observation and candidate records the same version. Comparison metadata records both baseline and observed normalization versions.

The baseline validator rejects a missing, unknown, or stale normalization version. Current source baselines remain `pending_initial_acceptance`; PR #238 does not invent or accept live digests.

## Safety boundary

Normalization must not:

- retain or publish raw bodies;
- retain or publish normalized page text;
- remove visible dates, numbers, percentages, addresses, identities, or terms;
- use AI or probabilistic summarization;
- fetch another URL;
- update a baseline;
- create a canonical record;
- open a pull request;
- write public output;
- deploy the site.

## Deterministic validation

Offline fixtures must prove:

- comments, script/style/template/svg contents, markup, whitespace, numeric entities, zero-width characters, and canonically equivalent Unicode do not create normalized-content changes;
- meaningful date, amount, ratio, address, identity, and lifecycle changes do create normalized-content changes;
- JSON object-key order is ignored while array order and values remain material;
- the version is present and identical across baseline, observation, candidate, and comparison metadata;
- a stale version is rejected;
- no source-specific exception exists;
- raw and normalized text remain absent from artifacts;
- canonical and public files remain unchanged.

## Deployment classification

```text
No production deployment required
```