import express from 'express'
import { Companies } from '../controllers/companies';
let companiesRoutes = express.Router()
companiesRoutes.post( "/", Companies.CreateOrUpdate );
companiesRoutes.get( "/:id", Companies.FindById );
companiesRoutes.get( "/", Companies.FindAll );
companiesRoutes.delete( "/:id", Companies.Delete );
export default companiesRoutes