import express from 'express'
import { Employees } from '../controllers/employees';

let employeesRoutes = express.Router()
employeesRoutes.post( "/", Employees.CreateOrUpdate );
employeesRoutes.get( "/barcode/:id", Employees.FindBybarcode );
employeesRoutes.get( "/:id", Employees.FindById );
employeesRoutes.get( "/", Employees.FindAll );
employeesRoutes.delete( "/:id", Employees.Delete );
export default employeesRoutes