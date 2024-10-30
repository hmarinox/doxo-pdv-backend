import express from 'express'
import { Products } from '../controllers/products';
let productsRoutes = express.Router()
productsRoutes.post( "/", Products.Create );
productsRoutes.get( "/:id", Products.FindById );
productsRoutes.get( "/ean/:ean", Products.FindByBarcode );
productsRoutes.get( "/tag/:tagId", Products.FindByTagId );
productsRoutes.get( "/datamatrix/:datamatrixId", Products.FindByDatamatrixId );
productsRoutes.delete( "/:id", Products.Delete );
productsRoutes.get( "/", Products.FindAll );
export default productsRoutes