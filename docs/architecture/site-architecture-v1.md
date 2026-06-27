# Stable or Gone Site Architecture v1

Status: approved architecture specification  
Phase: Phase 3  
Plan unit: PR 17 — finalize site architecture and route roles  
Implementation boundary: this specification does not change routes or render the new navigation. Global-shell implementation remains PR 23.

## 1. Architecture principle

SOG has four public information layers:

1. **Registry** — canonical records and historical relationships;
2. **Learn** — explanatory material that helps readers understand the registry;
3. **Project** — methodology, changes, corrections, project identity, and support;
4. **Data access** — machine-readable and crawler-facing entrypoints.

The home page is the entry to the registry rather than a separate marketing layer. Sitemap output is a discovery surface, not a user navigation destination.

## 2. Global navigation map

### Registry

```text
Stablecoins    /stablecoins/
Organizations  /issuers/
Events         /events/
```

Registry detail routes are contextual destinations and do not appear as global-navigation items:

```text
/stablecoin/{slug}/
/issuer/{slug}/
/event/{id}/
```

### Learn

```text
Guides    /guides/
Glossary  /glossary/
Models    /models/
```

Individual guide articles remain contextual destinations linked from the guide index, related-record modules, and editorial cross-links.

### Project

```text
Methodology  /methodology/
Updates      /updates/
About        /about/
```

### Utility actions

```text
Corrections  /contact/   primary utility
Support      /support/   secondary utility
```

Corrections must remain visible as an operational action. Support must remain available without competing with registry access.

### Data-access footer and discovery links

```text
/version.json
/data/manifest.json
/llms.txt
/ai.txt
```

These endpoints remain visible through the footer and document metadata. They do not belong in the main human-navigation groups.

## 3. Route inventory

The current source tree contains 27 route patterns:

```text
HTML route patterns:             22
Machine-readable route patterns:  5
Static routes:                   24
Dynamic route families:           3
```

### Entry

| Route | Source | Role | Decision |
|---|---|---|---|
| `/` | `src/pages/index.astro` | Registry home and project entry | Keep |

### Registry

| Route | Source | Role | Decision |
|---|---|---|---|
| `/stablecoins/` | `src/pages/stablecoins/index.astro` | Stablecoin index | Keep |
| `/stablecoin/{slug}/` | `src/pages/stablecoin/[slug].astro` | Stablecoin record | Keep |
| `/issuers/` | `src/pages/issuers/index.astro` | Organization index | Keep |
| `/issuer/{slug}/` | `src/pages/issuer/[slug].astro` | Organization record | Keep |
| `/events/` | `src/pages/events/index.astro` | Event index | Keep |
| `/event/{id}/` | `src/pages/event/[id].astro` | Event record | Keep |

The public navigation label remains **Organizations** even though the route is `/issuers/`. Route compatibility is preserved; terminology cleanup does not silently rename the path.

### Learn

| Route | Source | Role | Decision |
|---|---|---|---|
| `/guides/` | `src/pages/guides/index.astro` | Guide index | Keep |
| `/guides/genius-act-stablecoins/` | `src/pages/guides/genius-act-stablecoins/index.astro` | Guide article | Keep |
| `/guides/jpyc-vs-jpysc/` | `src/pages/guides/jpyc-vs-jpysc/index.astro` | Guide article | Keep |
| `/guides/mica-stablecoins/` | `src/pages/guides/mica-stablecoins/index.astro` | Guide article | Keep |
| `/guides/reserve-disclosure-basics/` | `src/pages/guides/reserve-disclosure-basics/index.astro` | Guide article | Keep |
| `/guides/stablecoin-lifecycle-terms/` | `src/pages/guides/stablecoin-lifecycle-terms/index.astro` | Guide article | Keep |
| `/guides/status-vs-event/` | `src/pages/guides/status-vs-event/index.astro` | Guide article | Keep |
| `/guides/what-is-a-depeg/` | `src/pages/guides/what-is-a-depeg/index.astro` | Guide article | Keep |
| `/glossary/` | `src/pages/glossary/index.astro` | Glossary | Keep |
| `/models/` | `src/pages/models/index.astro` | Stablecoin-model explainer | Keep |

### Project

| Route | Source | Role | Decision |
|---|---|---|---|
| `/methodology/` | `src/pages/methodology/index.astro` | Methodology and classification rules | Keep |
| `/updates/` | `src/pages/updates/index.astro` | Meaningful registry updates | Keep |
| `/about/` | `src/pages/about/index.astro` | Project purpose and scope | Keep |
| `/contact/` | `src/pages/contact/index.astro` | Corrections and submissions | Keep |
| `/support/` | `src/pages/support/index.astro` | Project support | Keep |

`/about/` was the only current HTML route without a preliminary role in the generated audit. PR 17 assigns it to Project.

### Data access and discovery

| Route | Source | Role | Decision |
|---|---|---|---|
| `/version.json` | `src/pages/version.json.ts` | Build and data version | Keep |
| `/data/manifest.json` | `src/pages/data/manifest.json.ts` | Public data manifest | Keep |
| `/llms.txt` | `src/pages/llms.txt.ts` | LLM guide | Keep |
| `/ai.txt` | `src/pages/ai.txt.ts` | AI entrypoint | Keep |
| `/sitemap-index.xml` | `src/pages/sitemap-index.xml.ts` | Search-engine discovery | Keep |

## 4. Route-decision policy

Every current route receives the decision `keep` in PR 17.

```text
Routes removed:       0
Routes renamed:       0
Redirects introduced: 0
Compatibility breaks: 0
```

Any future route rename, merge, removal, or redirect requires a dedicated migration that updates:

- source route;
- internal links;
- canonical metadata;
- sitemap output;
- machine-readable declarations;
- public consistency verification;
- compatibility behavior;
- production parity checks.

A navigation-label change is not permission to change its route.

## 5. Current-to-target navigation transition

Current navigation is one flat list of nine items. The approved target contains three groups of three items plus two utility actions.

### Retained destinations

```text
/stablecoins/
/issuers/
/events/
/guides/
/glossary/
/methodology/
/updates/
/contact/
/support/
```

### Added to grouped navigation

```text
/models/
/about/
```

These routes already exist. They are navigation additions, not new pages or route changes.

### Moved from flat navigation to utilities

```text
/contact/  Contact → Corrections
/support/  Support remains Support
```

The label change from Contact to Corrections clarifies the primary operational purpose while preserving the route.

## 6. Content and access rules

### Registry

- prioritizes browse, compare, record detail, evidence, and known unknowns;
- uses Organizations as the public concept, not issuer as a universal synonym;
- keeps detail routes contextual rather than overcrowding global navigation.

### Learn

- explains terms, models, regulation, and record interpretation;
- may link to registry records but does not replace canonical record content;
- does not expose internal taxonomy or migration terminology as reader-facing copy.

### Project

- explains method, project scope, changes, correction process, and support;
- keeps corrections visible and actionable;
- keeps support secondary to registry and correction tasks.

### Data access

- remains discoverable in metadata and footer utilities;
- preserves current machine-readable contracts;
- does not enter the primary human-navigation groups.

## 7. Mobile and implementation boundary

PR 17 approves information roles only. It does not prescribe a desktop-only hover menu or a mobile multi-row link dump.

PR 21 will finalize responsive and accessibility behavior. PR 23 will implement the global shell and navigation. That implementation must:

- provide access to all three groups on desktop and mobile;
- expose current-page state;
- keep Corrections visible;
- keep Support secondary;
- preserve data-access links in the footer;
- avoid material information suppression;
- avoid changing any route implicitly.

## 8. Machine validation

The approved architecture is encoded in:

```text
config/site-architecture.mjs
```

Generated diagnostics:

```text
data/generated/site-architecture-audit.json
data/generated/site-architecture-validation.json
```

The validator requires:

- all 27 source routes to have one architecture entry;
- source files and output kinds to match;
- zero duplicate route patterns;
- zero missing navigation destinations;
- zero declaration-only main routes;
- exactly Registry, Learn, and Project global groups;
- Corrections and Support utilities;
- all current routes to remain `keep`;
- zero redirects and removals in PR 17;
- `/about/` and `/models/` to be the only additions to grouped navigation.

## 9. Completion decision

PR 17 is complete when the generated route inventory and approved architecture map agree, the dedicated validation workflow passes, and no route change is present in the diff.

The next approved work is PR 18: finalize the stablecoin dossier hierarchy and field-to-section matrix.
