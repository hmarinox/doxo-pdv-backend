import express from 'express'
import { Users } from '../controllers/users';

let employeesRoutes = express.Router()
employeesRoutes.post( "/", Users.CreateOrUpdate );
employeesRoutes.get( "/:id", Users.FindById );
employeesRoutes.get( "/", Users.FindAll );
employeesRoutes.delete( "/:id", Users.Delete );
export default employeesRoutes