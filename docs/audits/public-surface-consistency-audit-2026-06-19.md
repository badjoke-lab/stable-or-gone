# SOG public-surface consistency audit — 2026-06-19

## Purpose

This audit addresses the risk that Stable or Gone may expose different registry generations across human-readable HTML, machine-readable metadata, repository documentation, sitemap output, and deployed Cloudflare artifacts.

The protected canonical checkpoint for this repair is:

```text
Stablecoins:        70
Organizations:      59
Events:             92
Evidence:          279
Reserve reports:    72
Deployments:       101
Known unknowns:    153
Regulatory notes:    9
```

Launch-date Batch O remains outside this repair. Its reviewed target set is preserved as crvUSD, EURCV, EURI, EURQ, and USDY.

## Audited public surfaces

```text
/
/stablecoins/
/stablecoin/{slug}/
/issuers/
/issuer/{slug}/
/events/
/event/{id}/
/version.json
/data/manifest.json
/llms.txt
/ai.txt
/sitemap-index.xml
/robots.txt
README.md
```

The build validator expands the parameterized routes to all 70 stablecoin pages, all 59 organization pages, and all 92 event pages.

## Data-source map

| Surface | Canonical runtime source |
|---|---|
| Home counts | `src/lib/data/registry.ts` getters |
| Stablecoin list and detail routes | `getStablecoins()` |
| Organization list and detail routes | `getOrganizations()` and `getRelationships()` |
| Event list and detail routes | `getEvents()` |
| Evidence shown on details | `getEvidence()` |
| Reserve history | `getReserveReports()` |
| Redemption profiles | canonical stablecoin profile overlays returned by `getStablecoins()` |
| Deployments | `getDeployments()` |
| Regulatory notes | `getRegulatoryNotes()` |
| Known unknowns | `getKnownUnknowns()` |
| Version, manifest, llms, ai | `src/lib/machine-readable.ts`, backed by the same registry getters |
| Sitemap | the same stablecoin, organization, and event getters |

The registry remains physically layered across reviewed repository JSON files, but there is one logical publication source: the canonical runtime assembly in `src/lib/data/registry.ts`. Public routes must not import individual batch files directly.

## Findings before repair

### 1. Current page source already used the canonical loader

The current source for the home page, `/stablecoins/`, `/issuers/`, `/events/`, and all three detail-route families used the common runtime loader. Count labels were computed from array lengths rather than manually typed.

No current source string for `20 records / 16 issuers` or `23 events` was found in the active page generators.

### 2. Repository documentation was stale

`README.md` still described the older 40-record checkpoint:

```text
40 stable assets
32 organizations
48 events
182 evidence records
```

Because repository documentation is indexed and commonly read by search engines and AI systems, this was a confirmed public inconsistency even when the built site was current.

### 3. Build validation did not compare HTML with canonical counts

The previous public-layer validator compared `version.json` and `manifest.json` with repository data, but did not verify:

- rendered list-row counts
- rendered home-page counts
- every generated detail route
- sitemap membership and exact dynamic-route counts
- canonical, hreflang, metadata, OGP, JSON-LD, or build identity on every route
- stale count strings in public documentation and generated text

### 4. Production smoke checks covered only metadata endpoints

The previous production check inspected `version.json`, `manifest.json`, `llms.txt`, and `ai.txt`. A stale HTML deployment could therefore coexist with current JSON and still pass.

### 5. Deployed-artifact risk could not be distinguished from source state

The old `20` and `23` values are absent from current route source. If they are observed in production, the likely causes are an older Cloudflare Pages deployment, a wrong production branch or artifact, or cached HTML. The repair adds the build commit to every HTML page and requires production HTML to match the expected main commit.

## Repair

- Updated README to the 70-record canonical checkpoint.
- Declared `src/lib/data/registry.ts` as the logical canonical publication source.
- Added complete record counts, schema identity, canonical-only metadata, and safety flags to version and manifest output.
- Added complete counts and canonical-source notes to `llms.txt` and `ai.txt`.
- Added build commit, branch, schema, canonical-only markers, and English/x-default alternate links to generated HTML.
- Added no-cache revalidation for core HTML routes and short revalidation for metadata, robots, and sitemap output.
- Added a build-time parity validator covering all current human and machine surfaces.
- Added a production parity checker covering core pages, every sitemap-listed stablecoin, organization, and event page, and the deployed build commit.
- Kept the existing command entrypoints so current CI and operator workflows continue to work.

## Time-context rules

- Stablecoins and organizations must expose `last_verified_at` in canonical records.
- Reserve-report records must expose `report_date` or `period_covered`.
- Known-unknown records must expose `last_checked_at`.
- Regulatory notes must expose `note_date`.
- `version.json` and `manifest.json` expose build-time `generated_at` values.
- Time-dependent claims shown on a stablecoin detail page retain their record-level `as_of` or review fields; the build validator rejects missing required time context in the canonical supporting layers listed above.

## Route and redirect result

No obsolete standalone `/stablecoins/` or `/events/` implementation was found in the current source tree, and no duplicate public route was identified. No redirect is required by this repair. The compatibility route `/issuer/{slug}/` remains intentional.

## Production verification rule

After merge, the main-branch production smoke workflow must confirm:

1. the deployed HTML build commit equals the merge commit expected by GitHub Actions;
2. deployed JSON counts meet the canonical checkpoint;
3. home and list HTML counts match deployed JSON;
4. sitemap dynamic-route counts match deployed JSON;
5. all sitemap-listed stablecoin, organization, and event pages return current HTML with matching canonical URL, metadata, structured data, and build marker;
6. old `20`, `23`, and 40-record checkpoint strings are absent from public output.

A direct production result is recorded only after that workflow completes against the deployed site.
