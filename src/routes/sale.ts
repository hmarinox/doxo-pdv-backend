import express from 'express'
import { Sale } from '../controllers/sale';
let saleRoutes = express.Router()
saleRoutes.post( "/", Sale.Create );
saleRoutes.get( "/:id", Sale.FindById );
saleRoutes.get( "/taxReceipt/:pdvId", Sale.FindLastTaxReceiptSequence );
saleRoutes.get( "/", Sale.FindAll );
// saleRoutes.delete( "/:id", Pdv.Delete );
export default saleRoutes