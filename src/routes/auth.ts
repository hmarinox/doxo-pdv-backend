import express from 'express'
import { Auth } from '../controllers/auth';


let authRoutes = express.Router()
authRoutes.post( "/signin", Auth.SignIn );
// authRoutes.get( "/:id", Auth.FindById );

export default authRoutes