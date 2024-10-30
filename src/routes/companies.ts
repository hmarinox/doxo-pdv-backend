import express from 'express'
import { Companies } from '../controllers/companies';
let companiesRoutes = express.Router()
companiesRoutes.post( "/", Companies.Create );
companiesRoutes.get( "/:id", Companies.FindById );
companiesRoutes.get( "/", Companies.FindAll );
companiesRoutes.delete( "/:id", Companies.Delete );
export default companiesRoutes