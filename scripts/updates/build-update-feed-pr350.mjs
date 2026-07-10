import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = process.cwd();
const CONFIG_PATH = 'config/update-feed-v1.json';
const UPDATES_PATH = 'data/registry-updates.json';

const readText = (file) => fs.readFileSync(path.join(root, file), 'utf8');
const readJson = (file) => JSON.parse(readText(file));
const uniqueSorted = (values) => [...new Set(values.filter(Boolean).map(String))].sort();

function routeFamilyForPath(pathname, rules) {
  for (const rule of rules) {
    if (rule.exact && pathname === rule.exact) return rule.id;
    if (rule.prefix && pathname.startsWith(rule.prefix)) return rule.id;
  }
  return 'unclassified';
}

function countBy(entries, getter) {
  const counts = new Map();
  for (const entry of entries) {
    for (const token of uniqueSorted([].concat(getter(entry) ?? []))) {
      counts.set(token, (counts.get(token) ?? 0) + 1);
    }
  }
  return [...counts.entries()]
    .map(([value, item_count]) => ({ value, item_count }))
    .sort((left, right) => right.item_count - left.item_count || left.value.localeCompare(right.value));
}

export function buildUpdateFeed() {
  const config = readJson(CONFIG_PATH);
  const updates = readJson(UPDATES_PATH);

  const entries = updates.map((update) => {
    const relatedPaths = uniqueSorted(update.related_paths ?? []);
    const routeFamilies = uniqueSorted(relatedPaths.map((pathname) => routeFamilyForPath(pathname, config.route_family_rules ?? [])));
    return {
      update_id: update.id,
      publication_date: update.date,
      year: update.date.slice(0, 4),
      category: update.category,
      title: update.title,
      summary: update.summary,
      related_paths: relatedPaths,
      route_families: routeFamilies
    };
  }).sort((left, right) => right.publication_date.localeCompare(left.publication_date) || left.update_id.localeCompare(right.update_id));

  const filters = {
    category: countBy(entries, (entry) => entry.category),
    year: countBy(entries, (entry) => entry.year),
    route_family: countBy(entries, (entry) => entry.route_families)
  };

  const summary = {
    item_count: entries.length,
    earliest_publication_date: entries.at(-1)?.publication_date ?? null,
    latest_publication_date: entries[0]?.publication_date ?? null,
    category_counts: Object.fromEntries(filters.category.map((row) => [row.value, row.item_count])),
    year_counts: Object.fromEntries(filters.year.map((row) => [row.value, row.item_count]))
  };

  const digest = crypto.createHash('sha256')
    .update(CONFIG_PATH).update('\0').update(readText(CONFIG_PATH)).update('\0')
    .update(UPDATES_PATH).update('\0').update(readText(UPDATES_PATH)).update('\0')
    .digest('hex');

  return {
    schema_version: '1.0',
    feed_id: config.config_id,
    status: 'public_registry_publication_feed',
    generated_at: '2026-07-10',
    source_file: config.source_file,
    source_endpoint: config.source_endpoint,
    ordering: config.ordering,
    semantics: config.semantics,
    item_count: entries.length,
    input_digest_sha256: digest,
    summary,
    filters,
    entries
  };
}

export function serializeUpdateFeed(feed) {
  return `${JSON.stringify(feed, null, 2)}\n`;
}

const isCli = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (isCli) {
  const feed = buildUpdateFeed();
  const serialized = serializeUpdateFeed(feed);
  const outputPath = process.argv[2];
  if (outputPath) {
    fs.mkdirSync(path.dirname(path.join(root, outputPath)), { recursive: true });
    fs.writeFileSync(path.join(root, outputPath), serialized);
    console.log(outputPath);
  } else {
    process.stdout.write(serialized);
  }
}
