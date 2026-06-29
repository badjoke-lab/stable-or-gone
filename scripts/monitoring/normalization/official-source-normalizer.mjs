export const OFFICIAL_SOURCE_NORMALIZATION_VERSION = 'sog_official_source_normalization_v2';

export function normalizeOfficialSourceBody(bytes, contentType) {
  const text = Buffer.from(bytes).toString('utf8');
  const type = String(contentType ?? '').split(';', 1)[0].trim().toLowerCase();
  if (type === 'application/json' || type.endsWith('+json')) return normalizeJson(text);
  if (type === 'text/html' || type === 'application/xhtml+xml') return normalizeHtml(text);
  return normalizeText(text);
}

function normalizeText(value) {
  return value.normalize('NFC').replace(/[\u200B-\u200D\u2060\uFEFF]/g, '').replace(/[\s\u00A0]+/gu, ' ').trim();
}

function normalizeHtml(value) {
  return normalizeText(
    decodeEntities(
      value
        .replace(/<!--[\s\S]*?-->/g, ' ')
        .replace(/<script\b[^>]*>[\s\S]*?<\/script\s*>/gi, ' ')
        .replace(/<style\b[^>]*>[\s\S]*?<\/style\s*>/gi, ' ')
        .replace(/<template\b[^>]*>[\s\S]*?<\/template\s*>/gi, ' ')
        .replace(/<svg\b[^>]*>[\s\S]*?<\/svg\s*>/gi, ' ')
        .replace(/<!doctype\b[^>]*>/gi, ' ')
        .replace(/<[^>]+>/g, ' ')
    )
  );
}

function decodeEntities(value) {
  const named = { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ', ensp: ' ', emsp: ' ', thinsp: ' ', ndash: '–', mdash: '—', minus: '−' };
  return value.replace(/&(#x[0-9a-f]+|#[0-9]+|[a-z][a-z0-9]+);/gi, (match, token) => {
    const lower = token.toLowerCase();
    if (lower.startsWith('#x')) {
      const codePoint = Number.parseInt(lower.slice(2), 16);
      return Number.isInteger(codePoint) && codePoint >= 0 && codePoint <= 0x10ffff ? String.fromCodePoint(codePoint) : match;
    }
    if (lower.startsWith('#')) {
      const codePoint = Number.parseInt(lower.slice(1), 10);
      return Number.isInteger(codePoint) && codePoint >= 0 && codePoint <= 0x10ffff ? String.fromCodePoint(codePoint) : match;
    }
    return named[lower] ?? match;
  });
}

function stableJson(value) {
  if (Array.isArray(value)) return value.map(stableJson);
  if (value && typeof value === 'object') return Object.fromEntries(Object.keys(value).sort().map((key) => [key, stableJson(value[key])]));
  return value;
}

function normalizeJson(value) {
  try {
    return JSON.stringify(stableJson(JSON.parse(value)));
  } catch {
    return normalizeText(value);
  }
}

export function officialSourceNormalizationProfile() {
  return {
    version: OFFICIAL_SOURCE_NORMALIZATION_VERSION,
    unicode_normalization: 'NFC',
    removes_zero_width_characters: true,
    collapses_whitespace: true,
    html_removes_comments: true,
    html_removed_containers: ['script', 'style', 'template', 'svg'],
    html_strips_markup: true,
    html_decodes_numeric_entities: true,
    json_sorts_object_keys: true,
    json_preserves_array_order: true,
    source_specific_exceptions: []
  };
}
