import express from 'express'
import productsRoutes from './products';
import companiesRoutes from './companies';
import storesRoutes from './stores';
import pdvRoutes from './pdv';
let routes = express.Router()
routes.use( "/products", productsRoutes );
routes.use( "/companies", companiesRoutes );
routes.use( "/stores", storesRoutes );
routes.use( "/pdv", pdvRoutes );
export default routes