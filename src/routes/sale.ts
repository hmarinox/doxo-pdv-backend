import express from 'express'
import { Sale } from '../controllers/sale';
let saleRoutes = express.Router()
saleRoutes.post( "/", Sale.Create );
// saleRoutes.get( "/:macAddress", Pdv.FindBymacAddress );
// saleRoutes.get( "/", Pdv.FindAll );
// saleRoutes.delete( "/:id", Pdv.Delete );
export default saleRoutes