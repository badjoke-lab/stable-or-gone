import fs from 'node:fs';
import path from 'node:path';
import {
  escapeRegExp,
  likelyPublicCopy,
  listSourceFiles,
  surfaceKind,
  uniqueStrings
} from './record-public-copy-audit-lib.mjs';

function termPattern(term) {
  const escaped = escapeRegExp(term);
  return new RegExp(`(?:['\"\x60]${escaped}['\"\x60]|\\b${escaped}\\b)`, 'i');
}

function recordTerms(record) {
  return [
    { type: 'id', value: record.id },
    { type: 'slug', value: record.slug },
    { type: 'canonical_name', value: record.name ?? record.canonical_name },
    ...(typeof record.symbol === 'string' && record.symbol.length >= 4
      ? [{ type: 'symbol', value: record.symbol }]
      : [])
  ].filter((item) => typeof item.value === 'string' && item.value.length >= 4);
}

function occurrenceKey(row) {
  return `${row.file}:${row.line}:${row.stablecoin_id}:${row.term_type}:${row.term}`;
}

export function collectRecordPublicCopyOccurrences(root, stablecoins) {
  const files = listSourceFiles(root);
  const termsByRecord = stablecoins.map((record) => ({ record, terms: recordTerms(record) }));
  const occurrences = [];

  for (const file of files) {
    const lines = fs.readFileSync(path.join(root, file), 'utf8').split(/\r?\n/);
    for (let index = 0; index < lines.length; index += 1) {
      const line = lines[index];
      for (const { record, terms } of termsByRecord) {
        for (const term of terms) {
          if (!termPattern(term.value).test(line)) continue;
          occurrences.push({
            file,
            line: index + 1,
            surface: surfaceKind(file),
            stablecoin_id: record.id,
            slug: record.slug,
            term_type: term.type,
            term: term.value,
            likely_public_copy: likelyPublicCopy(file, line),
            context: line.trim().replace(/\s+/g, ' ').slice(0, 280)
          });
        }
      }
    }
  }

  const deduplicated = [...new Map(occurrences.map((row) => [occurrenceKey(row), row])).values()]
    .sort((left, right) => left.file.localeCompare(right.file) || left.line - right.line || left.stablecoin_id.localeCompare(right.stablecoin_id));
  const filesWithFindings = uniqueStrings(deduplicated.map((row) => row.file)).sort();

  return {
    scanned_files: files,
    occurrences: deduplicated,
    files: filesWithFindings.map((file) => ({
      file,
      surface: surfaceKind(file),
      occurrences: deduplicated.filter((row) => row.file === file).length,
      likely_public_copy_occurrences: deduplicated.filter((row) => row.file === file && row.likely_public_copy).length,
      stablecoin_ids: uniqueStrings(deduplicated.filter((row) => row.file === file).map((row) => row.stablecoin_id)).sort()
    }))
  };
}
