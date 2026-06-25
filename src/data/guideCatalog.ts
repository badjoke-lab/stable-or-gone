export type GuideCategory = 'regulation' | 'asset-comparisons' | 'core-concepts';

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
    slug: 'genius-act-stablecoins',
    title: 'GENIUS Act and Stablecoins',
    summary: 'A beginner-friendly guide to the U.S. payment-stablecoin law, its implementation timeline, and the questions it creates for representative dollar stablecoins.',
    category: 'regulation',
    publishedAt: '2026-06-25',
    informationCurrentThrough: '2026-06-25',
    updatedAt: null,
    revisions: []
  },
  {
    slug: 'mica-stablecoins',
    title: 'MiCA and Stablecoins',
    summary: 'A beginner-friendly guide to EU stablecoin rules, the 2026 CASP transition deadline, and the different questions facing representative dollar, euro, and protocol-issued assets.',
    category: 'regulation',
    publishedAt: '2026-06-25',
    informationCurrentThrough: '2026-06-25',
    updatedAt: null,
    revisions: []
  },
  {
    slug: 'jpyc-vs-jpysc',
    title: 'JPYC vs JPYSC',
    summary: 'A side-by-side guide to two Japanese-yen stablecoins with different issuers, legal structures, reserves, redemption routes, launch stages, and wallet availability.',
    category: 'asset-comparisons',
    publishedAt: '2026-06-25',
    informationCurrentThrough: '2026-06-25',
    updatedAt: null,
    revisions: []
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

export function getGuide(slug: string): GuideEntry {
  const guide = guides.find((entry) => entry.slug === slug);
  if (!guide) throw new Error(`Unknown guide: ${slug}`);
  return guide;
}
