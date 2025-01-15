import express from 'express'
import { Companies } from '../controllers/companies';
let companiesRoutes = express.Router()
companiesRoutes.post( "/", Companies.CreateOrUpdate );
companiesRoutes.post( "/settings", Companies.CreateSettings );
companiesRoutes.get( "/settings/:id", Companies.GetSettings );
companiesRoutes.get( "/:id", Companies.FindById );
companiesRoutes.get( "/", Companies.FindAll );
companiesRoutes.delete( "/:id", Companies.Delete );
export default companiesRoutes