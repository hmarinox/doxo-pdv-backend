import express from 'express'
import { Companies } from '../controllers/companies';
let companiesRoutes = express.Router()
companiesRoutes.post( "/", Companies.CreateCompany );
companiesRoutes.get( "/:id", Companies.GetCompanyById );
companiesRoutes.get( "/", Companies.FindAllCompanies );
companiesRoutes.delete( "/:id", Companies.DestroyCompanies );
export default companiesRoutes