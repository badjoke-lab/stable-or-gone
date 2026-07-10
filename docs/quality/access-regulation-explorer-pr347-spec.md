# SOG Access & Regulation Explorer — PR #347

Status: canonical UI implementation specification  
Updated: 2026-07-10

## 1. Purpose

PR #347 implements the public Access & Regulation Explorer at:

```text
/access-regulation/
```

The Explorer consumes the deterministic PR #346 index and allows users to search and filter canonical legal profiles, Regulatory Notes, and Market Access record presence without ranking stable assets or inferring conclusions from absent records.

## 2. Source boundary

The Explorer fetches only:

```text
/data/access-regulation-index.json
```

It must not fetch or import:

- PR #339 editorial research;
- monitoring observations;
- monitoring candidates;
- private review notes;
- source-discovery queues;
- unreviewed candidates.

The PR #346 index remains the authority for the Explorer.

## 3. UI filter boundary

PR #346 exposes fourteen machine-readable index axes.

PR #347 intentionally exposes nine primary UI filters:

```text
lifecycle_status
legal_profile_state
legal_classification
legal_jurisdiction
regulatory_record_state
regulatory_note_type
regulatory_jurisdiction
market_access_record_state
market_access_state
```

The following five axes remain available in the machine-readable index and are preserved for later UI expansion:

```text
licensed_or_regulated_as
regulatory_authority_or_source
market_access_jurisdiction
market_access_function
market_access_platform
```

The UI does not delete or reinterpret those machine axes.

## 4. Search

The Explorer supports text search across:

```text
asset name
symbol
slug
```

The search parameter is:

```text
q
```

Search does not inspect private notes, editorial research, or monitoring text.

## 5. URL state

Explorer state is encoded through:

```text
q
lifecycle
legal_state
legal_class
legal_jurisdiction
reg_state
reg_type
reg_jurisdiction
access_record_state
access_state
```

Rules:

- filter values are single-value in v1;
- unknown values are ignored;
- empty values are removed;
- user filter changes update URL state;
- search input updates URL state without adding a history entry per keystroke;
- browser back/forward restores search and filter state;
- Copy filtered view copies the normalized current URL.

## 6. Result ordering and limits

Results remain in PR #346 canonical asset ID order.

The Explorer must not sort by:

- Regulatory Note count;
- legal classification presence;
- freshness;
- evidence count;
- Market Access coverage;
- any synthetic score.

Initial visible result limit:

```text
50
```

Show more increment:

```text
25
```

Filtering always applies to all 110 rows before visible-result slicing.

## 7. Result card layers

Every result card displays three independent layers.

### Legal profile

Shows:

- profile state;
- readiness;
- freshness;
- classification values;
- legal jurisdictions;
- holder claim type;
- reserve ownership;
- reserve segregation;
- bankruptcy remoteness;
- licensed/regulated-as values when present.

### Regulatory Notes

Shows:

- record state;
- record count;
- readiness;
- freshness;
- note types;
- jurisdictions;
- expandable canonical note records.

Record count is inventory context only.

### Market Access

Shows:

- record state;
- record count;
- readiness;
- freshness;
- access states when canonical values exist;
- access jurisdictions when canonical values exist;
- expandable canonical records when present.

## 8. Absence semantics

The page must visibly state:

```text
No Regulatory Note does not prove no regulatory action or development exists.
No Market Access Record does not mean unavailable.
Unclassified legal profile does not mean illegal, unregulated, banned, or unsafe.
```

A zero-result filter intersection is a search result only. It is not a legal, regulatory, availability, or safety conclusion.

## 9. Current canonical expectations

At PR #347 start, the deterministic index currently contains:

```text
assets: 110
legal profile state explicit_classification_present: 63
legal profile state unclassified_only: 47
assets with Regulatory Notes: 5
Regulatory Note records: 9
assets with regulatory_action note type: 2
assets with canonical Market Access records: 0
Market Access canonical records: 0
```

These values are current deterministic index observations, not permanent schema constants.

The dedicated PR #347 interaction audit may bind them for this reviewed checkpoint, while source validators must continue to validate index shape and semantics rather than hard-code future conclusions.

## 10. Market Access empty-axis behavior

The canonical Market Access entrypoint remains empty at PR #347 start.

Therefore:

- `market_access_record_state` exposes `no_canonical_record`;
- `market_access_state` has no canonical token values and its select control is disabled;
- the Explorer must not fill disabled options from PR #339 editorial research;
- filtering `access_record_state=no_canonical_record` returns all 110 assets.

## 11. Readiness and freshness

Legal, Regulatory, and Market Access layers each display their PR #346-preserved readiness and freshness separately.

The Explorer does not merge them into one badge or score.

Examples of valid combinations include:

```text
ready_with_unknowns + fresh
ready_with_unknowns + undated
ready_with_unknowns + no_canonical_record
```

## 12. Responsive behavior

Desktop presents result cards with three side-by-side layers when space permits.

At narrower widths, the three layers stack vertically.

The Explorer must preserve:

- page-level horizontal overflow at or below 2 px audit tolerance;
- controls at least 44 px high;
- readable body text using site readability tokens;
- stablecoin dossier links;
- filter labels and native select semantics;
- live result count and active-filter summary.

## 13. Navigation and discovery

`/access-regulation/` must be registered in:

- Registry navigation group;
- Registry footer group;
- site architecture map;
- sitemap;
- machine-readable manifest main routes;
- PR #346 manifest section as the Explorer companion route.

Primary navigation remains unchanged at six items.

## 14. Validation requirements

PR #347 validators and Actions must prove:

1. Explorer config exposes nine valid PR #346 axes;
2. five remaining PR #346 axes are preserved as machine-only axes;
3. UI and preserved axis sets form the exact fourteen-axis PR #346 set;
4. page loads 110 canonical index rows;
5. initial visible result count is 50;
6. Show more increases visible cards to 75;
7. explicit legal profile filter yields 63 assets at the current checkpoint;
8. Regulatory Note presence filter yields 5 assets;
9. `regulatory_action` note-type filter yields 2 assets;
10. explicit legal profile + regulatory record presence yields zero assets at the current checkpoint;
11. `q=usdt` yields one asset;
12. `access_record_state=no_canonical_record` yields 110 assets;
13. empty Market Access state axis remains disabled;
14. URL filter state restores on desktop and mobile;
15. desktop and mobile page-level horizontal overflow stays within 2 px;
16. controls remain at least 44 px high;
17. general CI, Site Architecture, responsive accessibility, full-page screenshots, and dedicated PR #347 workflow are green.

## 15. Non-goals

PR #347 does not:

- add Market Access Records;
- promote editorial research;
- ingest monitoring output;
- create compliance conclusions;
- infer illegality;
- infer availability from record absence;
- create risk scoring;
- create ranking;
- sort by adverse-note count;
- change legal profiles;
- change Regulatory Notes;
- change PR #346 index semantics;
- change Comparison Readiness;
- change freshness derivation;
- change immutable statistics history.

## 16. Next item

After PR #347 merges, PR #348 is authorized to build the change-timeline projection generator.

That projection must remain canonical-only and preserve event, status, effective-date, and review-date semantics rather than collapsing them into one generic timestamp.
