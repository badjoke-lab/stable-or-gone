import { GET as getBaseManifest } from '../../lib/data/manifestBase';
import { normalizePublicRecordBreakdown } from '../../lib/publicRecordBreakdown';

export async function GET() {
  const baseResponse = getBaseManifest();
  const manifest: any = await baseResponse.json();
  manifest.record_count_breakdown = normalizePublicRecordBreakdown(manifest.record_count_breakdown);
  return new Response(JSON.stringify(manifest, null, 2), { headers: baseResponse.headers });
}
