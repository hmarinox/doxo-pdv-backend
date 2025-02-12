import 'express-async-errors'
import express from 'express'
import cors, { CorsOptions } from 'cors'
import swaggerDocs from './docs/swagger_output.json'
import swaggerUi from 'swagger-ui-express'
import routes from './routes'
import { Errors } from './middleware/errors'
// import env from './zod-validation-env'
const env = process.env
import { CronShedule } from './services/shedule'
import getAllProductsOmieAndSyncWithDB from './integrations/erp/omie/databaseSync'



const PORT = env.PORT

const operationLocal = env.OPERATION
function server() 
{
    let app = express()

    const options: CorsOptions = {
        origin: ['http://localhost:3000', 'app://.'],
        //origin: [`*`],
        methods: "GET,PUT,POST,DELETE",
        preflightContinue: false,
        optionsSuccessStatus: 204,

        allowedHeaders: "Content-Type, Authorization, Cookie",
    }
    app.use( cors( options ) )

    getAllProductsOmieAndSyncWithDB()
    if ( operationLocal === 'local' )
    {

        CronShedule.syncGetProductsOmie()
        CronShedule.syncPushSales()
    }

    app.use( express.json( { limit: '3mb' } ) )


    //app.use( "/checkConnection", ( req, res ) => res.send( 'server is running' ) )
    app.use( "/api/v1", routes )
    // app.use( accessControlRoutes )

    app.use(
        "/docs",
        swaggerUi.serve, swaggerUi.setup( swaggerDocs ) );
    app.use( Errors )
    app.listen( PORT, () => { console.log( `litens on ${ PORT }` ) } )
}

server()