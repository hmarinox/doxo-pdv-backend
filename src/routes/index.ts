import express from 'express'
import productsRoutes from './products';
import companiesRoutes from './companies';
let routes = express.Router()
routes.use( "/products", productsRoutes );
routes.use( "/companies", companiesRoutes );
export default routes