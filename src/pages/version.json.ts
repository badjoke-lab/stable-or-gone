import { GET as getBaseVersion } from '../lib/versionBase';
import { normalizePublicRecordBreakdown } from '../lib/publicRecordBreakdown';

export async function GET() {
  const baseResponse = getBaseVersion();
  const version: any = await baseResponse.json();
  version.data.record_count_breakdown = normalizePublicRecordBreakdown(version.data.record_count_breakdown);
  return new Response(JSON.stringify(version, null, 2), { headers: baseResponse.headers });
}
