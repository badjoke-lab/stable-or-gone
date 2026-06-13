import fs from 'node:fs'
import path from 'node:path'

const root = process.cwd()
const distDir = path.join(root, 'dist')
const baselinePath = path.join(root, 'docs', 'migration', 'registry-v2-baseline.json')
const minimumStaticPages = 75
const failures = []

function fail(message) {
  failures.push(message)
}

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'))
}

function recordsFromJson(relativePath) {
  const value = readJson(path.join(root, relativePath))
  if (Array.isArray(value)) return value
  if (Array.isArray(value.records)) return value.records
  throw new Error(`${relativePath}: expected an array or { records: [] }`)
}

function routeFile(route) {
  if (route === '/') return path.join(distDir, 'index.html')
  const normalized = route.replace(/^\//, '').replace(/\/$/, '')
  return path.join(distDir, normalized, 'index.html')
}

function requireRoute(route, label) {
  if (!fs.existsSync(routeFile(route))) {
    fail(`${label} route was not generated: ${route}`)
  }
}

function routeFromPageSource(source) {
  if (source.includes('[')) return null
  let relative = source.replace(/^src\/pages\//, '')
  if (relative === 'index.astro') return '/'
  relative = relative.replace(/\/index\.astro$/, '').replace(/\.astro$/, '')
  return `/${relative}/`
}

function listHtmlFiles(directory) {
  if (!fs.existsSync(directory)) return []
  const files = []
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const fullPath = path.join(directory, entry.name)
    if (entry.isDirectory()) files.push(...listHtmlFiles(fullPath))
    else if (entry.isFile() && entry.name.endsWith('.html')) files.push(fullPath)
  }
  return files
}

if (!fs.existsSync(distDir)) {
  throw new Error('dist directory does not exist; run Astro build before deployment verification')
}

if (!fs.existsSync(baselinePath)) {
  throw new Error('Registry v2 baseline file is missing')
}

const baseline = readJson(baselinePath)
const htmlFiles = listHtmlFiles(distDir)

if (htmlFiles.length < minimumStaticPages) {
  fail(`static HTML page count fell below ${minimumStaticPages}: ${htmlFiles.length}`)
}

for (const source of baseline.required_route_sources ?? []) {
  const route = routeFromPageSource(source)
  if (route) requireRoute(route, 'required static')
}

for (const stablecoin of baseline.protected_stablecoins ?? []) {
  requireRoute(`/stablecoin/${stablecoin.slug}/`, `protected stablecoin ${stablecoin.id}`)
}

for (const organization of baseline.protected_organizations ?? []) {
  requireRoute(`/issuer/${organization.slug}/`, `protected organization ${organization.id}`)
}

const eventRecords = (baseline.data_groups?.events ?? []).flatMap(recordsFromJson)
const eventIds = new Set()
for (const event of eventRecords) {
  if (!event?.id) {
    fail('event record without id found while verifying generated routes')
    continue
  }
  eventIds.add(event.id)
}

const minimumEvents = baseline.minimum_counts?.events ?? 0
if (eventIds.size < minimumEvents) {
  fail(`event route source count fell below ${minimumEvents}: ${eventIds.size}`)
}

for (const eventId of eventIds) {
  requireRoute(`/event/${eventId}/`, `event ${eventId}`)
}

const llmsPath = path.join(distDir, 'llms.txt')
if (!fs.existsSync(llmsPath)) {
  fail('dist/llms.txt was not generated')
} else if (!fs.readFileSync(llmsPath, 'utf8').includes('Stable or Gone')) {
  fail('dist/llms.txt does not identify Stable or Gone')
}

if (failures.length > 0) {
  console.error('Post-migration deployment verification failed:')
  for (const failure of failures) console.error(`- ${failure}`)
  process.exit(1)
}

console.log('Post-migration deployment verification passed.')
console.log(`Static HTML pages: ${htmlFiles.length}`)
console.log(`Protected stablecoin routes: ${baseline.protected_stablecoins.length}`)
console.log(`Protected organization compatibility routes: ${baseline.protected_organizations.length}`)
console.log(`Event routes: ${eventIds.size}`)
console.log('AI-readable guide: dist/llms.txt')
