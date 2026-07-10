import { buildMaintenanceLog } from '../../scripts/maintenance/build-maintenance-log-pr351.mjs';

export function getPublicMaintenanceLog() {
  return buildMaintenanceLog();
}
