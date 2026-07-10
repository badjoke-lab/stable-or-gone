import type { APIRoute } from 'astro';
import { getPublicMaintenanceLog } from '../../lib/maintenanceLogData.mjs';

export const GET: APIRoute = () => {
  const log = getPublicMaintenanceLog();
  return new Response(JSON.stringify(log, null, 2), {
    headers: {
      'content-type': 'application/json; charset=utf-8',
      'cache-control': 'public, max-age=3600, must-revalidate'
    }
  });
};
