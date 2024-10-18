import express from 'express'
import { Products } from '../controllers/products';
let productsRoutes = express.Router()
productsRoutes.post( "/", Products.createProducts );
productsRoutes.get( "/:id", Products.findOneProducts );
productsRoutes.get( "/ean/:ean", Products.findOneProductsByBarcode );
productsRoutes.get( "/tag/:tagId", Products.findOneProductsByTagId );
productsRoutes.get( "/datamatrix/:datamatrixId", Products.findOneProductsByDatamatrixId );
productsRoutes.delete( "/:id", Products.destroyProducts );
productsRoutes.get( "/", Products.findAllProducts );
export default productsRoutes