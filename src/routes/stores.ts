import express from 'express'
import { Stores } from '../controllers/stores';
let storesRoutes = express.Router()
storesRoutes.post( "/", Stores.Create );
storesRoutes.get( "/:id", Stores.FindById );
storesRoutes.get( "/pdv-id/:id", Stores.FindByPdvId );
storesRoutes.get( "/", Stores.FindAll );
storesRoutes.delete( "/:id", Stores.Delete );
export default storesRoutes