export type GuideCategory = 'regulation' | 'asset-comparisons' | 'core-concepts';
export type GuideTheme = 'us' | 'eu' | 'uk' | 'jp' | 'neutral';

export interface GuideRevision {
  date: string;
  note: string;
  kind?: 'update' | 'correction';
}

export interface GuideEntry {
  slug: string;
  title: string;
  summary: string;
  category: GuideCategory;
  publishedAt: string | null;
  informationCurrentThrough: string;
  updatedAt: string | null;
  revisions: GuideRevision[];
  featured?: boolean;
  theme?: GuideTheme;
  regionLabel?: string;
}

export const guideCategoryLabels: Record<GuideCategory, string> = {
  regulation: 'Regulation',
  'asset-comparisons': 'Asset comparisons',
  'core-concepts': 'Core concepts'
};

export const guideCategoryDescriptions: Record<GuideCategory, string> = {
  regulation: 'How laws, regulatory transitions, and issuer rules affect stablecoins and the services around them.',
  'asset-comparisons': 'Side-by-side explanations of assets that look similar but use different legal, reserve, redemption, or distribution structures.',
  'core-concepts': 'The basic terms and distinctions used throughout the Stable or Gone registry.'
};

export const guides: GuideEntry[] = [
  {
    slug: 'global-stablecoin-regulation-2026',
    title: 'Stablecoin Regulation in 2026: Seven Jurisdictions Compared',
    summary: 'A current-through-August comparison of the United States, European Union, United Kingdom, Japan, mainland China, Hong Kong, and Russia across issuance, distribution, payments, cross-border use, and regulatory direction.',
    category: 'regulation',
    publishedAt: '2026-08-08',
    informationCurrentThrough: '2026-08-08',
    updatedAt: null,
    revisions: [],
    featured: true,
    theme: 'neutral',
    regionLabel: 'Global'
  },
  {
    slug: 'clarity-act-2026-stablecoins',
    title: 'CLARITY Act Misses the August Window',
    summary: 'What the U.S. Senate delay means for crypto market structure, why the bill is not dead, and why the separate GENIUS Act remains the central federal stablecoin law.',
    category: 'regulation',
    publishedAt: '2026-08-08',
    informationCurrentThrough: '2026-08-08',
    updatedAt: null,
    revisions: [],
    featured: true,
    theme: 'us',
    regionLabel: 'United States'
  },
  {
    slug: 'china-hong-kong-stablecoin-rules-2026',
    title: 'China Restricts, Hong Kong Licenses',
    summary: 'Why mainland China and Hong Kong now present sharply different stablecoin policy environments, and why jurisdiction must be separated from asset-level access claims.',
    category: 'regulation',
    publishedAt: '2026-08-08',
    informationCurrentThrough: '2026-08-08',
    updatedAt: null,
    revisions: [],
    featured: true,
    theme: 'neutral',
    regionLabel: 'Mainland China / Hong Kong'
  },
  {
    slug: 'russia-stablecoin-rules-2026',
    title: 'Russia’s Stablecoin Rules in 2026',
    summary: 'How Russia distinguishes domestic settlement from investment and cross-border uses for stablecoin-like digital financial assets, and what remains under policy discussion.',
    category: 'regulation',
    publishedAt: '2026-08-08',
    informationCurrentThrough: '2026-08-08',
    updatedAt: null,
    revisions: [],
    featured: true,
    theme: 'neutral',
    regionLabel: 'Russia'
  },
  {
    slug: 'japan-stablecoin-access-usdc-rlusd-jpysc',
    title: 'RLUSD’s Japan Launch Is Only Part of the Story',
    summary: 'What USDC, RLUSD, and JPYSC reveal about Japan’s emerging stablecoin access model, legal routes, platform functions, and the difference between availability and unrestricted circulation.',
    category: 'regulation',
    publishedAt: '2026-07-10',
    informationCurrentThrough: '2026-07-10',
    updatedAt: null,
    revisions: [],
    featured: true,
    theme: 'jp',
    regionLabel: 'Japan'
  },
  {
    slug: 'eu-stablecoin-access-after-mica',
    title: 'After MiCA: Which Stablecoins Can Europeans Actually Use?',
    summary: 'A reviewed guide to EU/EEA stablecoin access, separating issuer status, platform state, customer scope, product functions, direct mint and redemption routes, payment rails, supported networks, and dates.',
    category: 'regulation',
    publishedAt: '2026-07-06',
    informationCurrentThrough: '2026-07-06',
    updatedAt: '2026-07-06',
    revisions: [
      {
        date: '2026-07-06',
        note: "Updated Ripple's European regulatory status after Ripple announced that it had obtained an EU CASP licence. Preserved the distinction between Ripple group authorizations, RLUSD issuer identity, token-level regulatory status, and platform-specific access.",
        kind: 'update'
      }
    ],
    featured: true,
    theme: 'eu',
    regionLabel: 'European Union / EEA'
  },
  {
    slug: 'open-usd-reserve-revenue-model',
    title: 'Open USD Explained: Who Gets the Reserve Income?',
    summary: 'Open Standard says partners will receive all reserve earnings after a small management fee. This guide separates that partner model from holder yield and records what is still unknown before launch.',
    category: 'core-concepts',
    publishedAt: '2026-07-01',
    informationCurrentThrough: '2026-07-01',
    updatedAt: '2026-07-01',
    revisions: [
      {
        date: '2026-07-01',
        note: 'Updated from Open Standard’s official launch announcement: clarified that partners are promised all reserve earnings after a small management fee, added the no-artificial-volume-limit claim, recorded the partner-composed board claim, and added the official announcement URL.',
        kind: 'correction'
      }
    ],
    featured: true,
    theme: 'neutral',
    regionLabel: 'Global'
  },
  {
    slug: 'genius-act-stablecoins',
    title: 'GENIUS Act and Stablecoins',
    summary: 'A beginner-friendly guide to the U.S. payment-stablecoin law, its implementation timeline, and the questions it creates for representative dollar stablecoins.',
    category: 'regulation',
    publishedAt: '2026-06-25',
    informationCurrentThrough: '2026-06-25',
    updatedAt: null,
    revisions: [],
    featured: true,
    theme: 'us',
    regionLabel: 'United States'
  },
  {
    slug: 'mica-stablecoins',
    title: 'MiCA and Stablecoins',
    summary: 'A beginner-friendly guide to EU stablecoin rules, the 2026 CASP transition deadline, and the different questions facing representative dollar, euro, and protocol-issued assets.',
    category: 'regulation',
    publishedAt: '2026-06-25',
    informationCurrentThrough: '2026-06-25',
    updatedAt: null,
    revisions: [],
    featured: true,
    theme: 'eu',
    regionLabel: 'European Union'
  },
  {
    slug: 'uk-stablecoin-capital-rules-2026',
    title: 'UK Stablecoin Rules: Capital Is Not Backing',
    summary: 'What the reported cut from a 2% to 1% issuer-capital requirement means, why it does not halve stablecoin backing, and how the FCA and Bank of England regimes differ.',
    category: 'regulation',
    publishedAt: '2026-06-30',
    informationCurrentThrough: '2026-06-30',
    updatedAt: null,
    revisions: [],
    featured: true,
    theme: 'uk',
    regionLabel: 'United Kingdom'
  },
  {
    slug: 'jpyc-vs-jpysc',
    title: 'JPYC vs JPYSC',
    summary: 'A side-by-side guide to two Japanese-yen stablecoins with different issuers, legal structures, reserves, redemption routes, launch stages, and wallet availability.',
    category: 'asset-comparisons',
    publishedAt: '2026-06-25',
    informationCurrentThrough: '2026-06-25',
    updatedAt: null,
    revisions: [],
    theme: 'jp',
    regionLabel: 'Japan'
  },
  {
    slug: 'what-is-a-depeg',
    title: 'What Is a Depeg?',
    summary: 'Learn what counts as a depeg, how recoveries are recorded, and when a depeg becomes part of a larger collapse.',
    category: 'core-concepts',
    publishedAt: null,
    informationCurrentThrough: '2026-06-25',
    updatedAt: null,
    revisions: []
  },
  {
    slug: 'status-vs-event',
    title: 'Status and Event Records',
    summary: 'See why a stablecoin can remain active after an incident, and how status labels differ from dated events.',
    category: 'core-concepts',
    publishedAt: null,
    informationCurrentThrough: '2026-06-25',
    updatedAt: null,
    revisions: []
  },
  {
    slug: 'reserve-disclosure-basics',
    title: 'Reading Reserve Disclosures',
    summary: 'Understand issuer reports, attestations, audits, protocol collateral data, and gaps in public reporting.',
    category: 'core-concepts',
    publishedAt: null,
    informationCurrentThrough: '2026-06-25',
    updatedAt: null,
    revisions: []
  },
  {
    slug: 'stablecoin-lifecycle-terms',
    title: 'Stablecoin Lifecycle Terms',
    summary: 'A guide to launches, migrations, rebrands, wind-downs, failures, and post-collapse trading.',
    category: 'core-concepts',
    publishedAt: null,
    informationCurrentThrough: '2026-06-25',
    updatedAt: null,
    revisions: []
  }
];

const byPublishedDate = (a: GuideEntry, b: GuideEntry) => {
  const dateOrder = String(b.publishedAt).localeCompare(String(a.publishedAt));
  return dateOrder || a.title.localeCompare(b.title);
};

export function getPublishedGuides(): GuideEntry[] {
  return guides.filter((entry) => Boolean(entry.publishedAt)).sort(byPublishedDate);
}

export function getFeaturedGuides(limit = 3): GuideEntry[] {
  return getPublishedGuides().filter((entry) => entry.featured).slice(0, limit);
}

export function getGuide(slug: string): GuideEntry {
  const guide = guides.find((entry) => entry.slug === slug);
  if (!guide) throw new Error(`Unknown guide: ${slug}`);
  return guide;
}
