import express from 'express'
import productsRoutes from './products';
let routes = express.Router()
routes.use( "/products", productsRoutes );
export default routes