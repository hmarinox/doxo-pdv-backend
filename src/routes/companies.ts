import express from 'express'
import { Companies } from '../controllers/companies';
let companiesRoutes = express.Router()
companiesRoutes.post( "/", Companies.CreateCompany );
companiesRoutes.get( "/:id", Companies.findCompany );
companiesRoutes.get( "/", Companies.findAllCompanies );
companiesRoutes.delete( "/:id", Companies.destroyCompanies );
export default companiesRoutes