import express from 'express'
import { Pdv } from '../controllers/pdv';
let pdvRoutes = express.Router()
pdvRoutes.post( "/", Pdv.Create );
pdvRoutes.get( "/mac-address/:macAddress", Pdv.FindBymacAddress );
pdvRoutes.get( "/:id", Pdv.FindById );
pdvRoutes.get( "/", Pdv.FindAll );
pdvRoutes.delete( "/:id", Pdv.Delete );
export default pdvRoutes