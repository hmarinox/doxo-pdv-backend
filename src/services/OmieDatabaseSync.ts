import cron from 'node-cron'
import getAllProductsOmieAndSyncWithDB from '../integrations/erp/omie/databaseSync';
function scheduleSync()
{
    cron.schedule( '0 1 * * *', getAllProductsOmieAndSyncWithDB );
}

export const Cron = {
    scheduleSync
}