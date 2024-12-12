import cron from 'node-cron'
import getAllProductsOmieAndSyncWithDB from '../integrations/erp/omie/databaseSync';
import { RemoteServerSync } from '../integrations/remote-server/database-sync';
function syncGetProductsOmie()
{
    console.log( "syncGetProductsOmie" )
    cron.schedule( '0 */1 * * *', getAllProductsOmieAndSyncWithDB );
}
function syncPushSales()
{
    console.log( "syncPushSales" )
    cron.schedule( '*/10 * * * *', RemoteServerSync.pushSales )
}

export const CronShedule = {
    syncGetProductsOmie,
    syncPushSales
}