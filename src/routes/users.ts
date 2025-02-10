import express from 'express'
import { Users } from '../controllers/users';

let usersRoutes = express.Router()
usersRoutes.post( "/", Users.CreateOrUpdate );
usersRoutes.get( "/:id", Users.FindById );
usersRoutes.get( "/", Users.FindAll );
usersRoutes.delete( "/:id", Users.Delete );
export default usersRoutes