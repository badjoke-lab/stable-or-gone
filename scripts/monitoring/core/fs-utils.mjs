import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';

export function ensureDir(directory) {
  fs.mkdirSync(directory, { recursive: true });
}

export function readJson(root, relativePath) {
  return JSON.parse(fs.readFileSync(path.join(root, relativePath), 'utf8'));
}

export function writeJson(filePath, value) {
  ensureDir(path.dirname(filePath));
  fs.writeFileSync(filePath, `${JSON.stringify(value, null, 2)}\n`);
}

export function writeText(filePath, value) {
  ensureDir(path.dirname(filePath));
  fs.writeFileSync(filePath, value.endsWith('\n') ? value : `${value}\n`);
}

export function sha256(value) {
  return crypto.createHash('sha256').update(value).digest('hex');
}

export function hashFile(filePath) {
  return sha256(fs.readFileSync(filePath));
}
