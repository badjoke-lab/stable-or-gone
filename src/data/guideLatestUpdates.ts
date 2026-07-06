export interface GuideLatestUpdate {
  title: string;
  body: string;
  sourceLabel: string;
  sourceUrl: string;
}

export const guideLatestUpdates: Record<string, GuideLatestUpdate> = {
  'After MiCA: Which Stablecoins Can Europeans Actually Use?': {
    title: 'Ripple EU CASP authorisation — July 6 update',
    body: "Ripple says its regulated end-to-end crypto payments product is now available to financial institutions, corporates, and businesses across all 30 countries of the European Economic Area. Its June preliminary-approval announcement described banks, fintechs, and corporates accessing collection, exchange, and payout functions through a single integration. This is Ripple service-provider and institutional/business product scope; it does not establish universal retail RLUSD availability or RLUSD token-level MiCA status.",
    sourceLabel: 'Ripple — full MiCA CASP authorisation announcement',
    sourceUrl: 'https://ripple.com/ripple-press/ripple-receives-full-eu-mica-casp-license/'
  }
};
