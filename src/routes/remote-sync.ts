import express from 'express'
import { RemoteCompany } from '../controllers/remote/companies';
import { RemoteSale } from '../controllers/remote/sale';
import { RemoteStores } from '../controllers/remote/stores';
import { RemotePdv } from '../controllers/remote/pdv';

let remoteSyncRoutes = express.Router()
remoteSyncRoutes.post( "/companies", RemoteCompany.CreateOrUpdate );
remoteSyncRoutes.post( "/stores", RemoteStores.Create );
remoteSyncRoutes.post( "/pdv", RemotePdv.Create );
remoteSyncRoutes.post( "/sale", RemoteSale.SyncCreate );

export default remoteSyncRoutes