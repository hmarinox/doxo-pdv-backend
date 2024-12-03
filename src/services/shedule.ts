import cron from 'node-cron'
import getAllProductsOmieAndSyncWithDB from '../integrations/erp/omie/databaseSync';
import { RemoteServerSync } from '../integrations/remote-server/database-sync';
function syncGetProductsOmie()
{
    cron.schedule( '0 1 * * *', getAllProductsOmieAndSyncWithDB );
}
function syncPushSales()
{
    cron.schedule( '1 * * * *', RemoteServerSync.pushSales );
    console.log( "   cron.schedule( '1 * * * *', RemoteServerSync.pushSales );" )
}

export const CronShedule = {
    syncGetProductsOmie,
    syncPushSales
}