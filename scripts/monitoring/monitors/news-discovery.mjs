import crypto from 'node:crypto';

export const NEWS_DISCOVERY_QUERIES = [
  { query_id: 'mica-exchange-eea', query: 'stablecoin MiCA exchange EEA when:1d' },
  { query_id: 'stablecoin-delisting-europe', query: 'stablecoin delisting Europe exchange when:1d' },
  { query_id: 'stablecoin-deposit-withdrawal-eea', query: 'stablecoin deposit withdrawal EEA exchange when:1d' },
  { query_id: 'stablecoin-casp-authorization-europe', query: 'stablecoin CASP authorization Europe when:1d' },
  { query_id: 'visa-vsp-open-usd', query: '"Visa Stablecoin Platform" OR "Open USD" Visa when:1d' },
  { query_id: 'open-standard-ousd-launch', query: '"Open Standard" "Open USD" OUSD launch when:1d' }
];

const MAX_QUERIES = 6;
const MAX_ITEMS_PER_QUERY = 20;
const MAX_BODY_BYTES = 1024 * 1024;
const TIMEOUT_MS = 15_000;

function sha256(value) {
  return crypto.createHash('sha256').update(value).digest('hex');
}

function decodeXml(value) {
  return value
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&#(\d+);/g, (_, code) => String.fromCodePoint(Number(code)))
    .replace(/&#x([0-9a-f]+);/gi, (_, code) => String.fromCodePoint(Number.parseInt(code, 16)));
}

function firstTag(block, tag) {
  const match = block.match(new RegExp(`<${tag}(?:\\s[^>]*)?>([\\s\\S]*?)<\\/${tag}>`, 'i'));
  return match ? decodeXml(match[1].trim()) : null;
}

function sourceTag(block) {
  const match = block.match(/<source(?:\s[^>]*)?>([\s\S]*?)<\/source>/i);
  return match ? decodeXml(match[1].trim()) : null;
}

export function parseNewsRss(xml, queryId, discoveredAt, maxItems = MAX_ITEMS_PER_QUERY) {
  const items = [];
  const blocks = xml.match(/<item(?:\s[^>]*)?>[\s\S]*?<\/item>/gi) ?? [];
  for (const block of blocks.slice(0, maxItems)) {
    const title = firstTag(block, 'title');
    const link = firstTag(block, 'link');
    if (!title || !link) continue;
    let normalizedLink;
    try {
      const parsed = new URL(link);
      if (!['https:', 'http:'].includes(parsed.protocol)) continue;
      normalizedLink = parsed.toString();
    } catch {
      continue;
    }
    const pubDate = firstTag(block, 'pubDate');
    const parsedDate = pubDate && Number.isFinite(Date.parse(pubDate)) ? new Date(pubDate).toISOString() : null;
    items.push({
      discovery_id: `news_${sha256(`${queryId}|${title}|${normalizedLink}`).slice(0, 20)}`,
      query_id: queryId,
      title,
      link: normalizedLink,
      publisher: sourceTag(block),
      published_at: parsedDate,
      discovered_at: discoveredAt,
      status: 'discovery_only',
      canonical_action: 'none'
    });
  }
  return items;
}

function feedUrl(query) {
  return `https://news.google.com/rss/search?q=${encodeURIComponent(query)}&hl=en-US&gl=US&ceid=US:en`;
}

export async function runNewsDiscovery(options = {}) {
  const discoveredAt = options.discoveredAt ?? new Date().toISOString();
  const fetchImpl = options.fetchImpl ?? globalThis.fetch;
  const queries = options.queries ?? NEWS_DISCOVERY_QUERIES;
  if (!Array.isArray(queries) || queries.length === 0 || queries.length > MAX_QUERIES) {
    throw new Error(`News discovery query count must be between 1 and ${MAX_QUERIES}`);
  }
  const queryIds = new Set();
  for (const query of queries) {
    if (!query?.query_id || !query?.query || queryIds.has(query.query_id)) throw new Error('News discovery queries require unique query_id and non-empty query');
    queryIds.add(query.query_id);
  }

  const results = [];
  const errors = [];
  for (const query of queries) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), options.timeoutMs ?? TIMEOUT_MS);
    try {
      const response = await fetchImpl(feedUrl(query.query), {
        signal: controller.signal,
        headers: { 'user-agent': 'Stable-or-Gone-Private-News-Discovery/1.0', accept: 'application/rss+xml,application/xml,text/xml;q=0.9,*/*;q=0.1' }
      });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const bytes = new Uint8Array(await response.arrayBuffer());
      if (bytes.byteLength > (options.maxBodyBytes ?? MAX_BODY_BYTES)) throw new Error(`response exceeds ${options.maxBodyBytes ?? MAX_BODY_BYTES} bytes`);
      const xml = new TextDecoder().decode(bytes);
      results.push(...parseNewsRss(xml, query.query_id, discoveredAt, options.maxItemsPerQuery ?? MAX_ITEMS_PER_QUERY));
    } catch (error) {
      errors.push({
        query_id: query.query_id,
        error: error instanceof Error ? error.message : String(error)
      });
    } finally {
      clearTimeout(timeout);
    }
  }

  const deduplicated = [...new Map(results.map((item) => [item.discovery_id, item])).values()]
    .sort((a, b) => a.discovery_id.localeCompare(b.discovery_id));

  return {
    schema_version: '1.0',
    monitor: 'bounded-news-discovery',
    status: errors.length === 0 ? 'ok' : errors.length === queries.length ? 'failed' : 'partial',
    discovered_at: discoveredAt,
    query_count: queries.length,
    item_count: deduplicated.length,
    error_count: errors.length,
    max_queries: MAX_QUERIES,
    max_items_per_query: MAX_ITEMS_PER_QUERY,
    max_body_bytes: options.maxBodyBytes ?? MAX_BODY_BYTES,
    items: deduplicated,
    errors,
    policy: {
      discovery_only: true,
      human_review_required: true,
      canonical_action: 'none',
      public_output: false,
      raw_response_retained: false
    }
  };
}
