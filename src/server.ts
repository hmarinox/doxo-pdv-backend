import 'express-async-errors'
import express from 'express'
import cors, { CorsOptions } from 'cors'
import swaggerDocs from './docs/swagger_output.json'
import swaggerUi from 'swagger-ui-express'
import routes from './routes'
import { Cron } from './services/OmieDatabaseSync'
import { Errors } from './middleware/errors'
import getAllProductsOmieAndSyncWithDB from './integrations/erp/omie/databaseSync'

const PORT = process.env.PORT
function server() 
{
    let app = express()

    const options: CorsOptions = {
        origin: ['http://localhost:3000'],
        //origin: [`*`],
        methods: "GET,PUT,POST,DELETE",
        preflightContinue: false,
        optionsSuccessStatus: 204,

        allowedHeaders: "Content-Type, Authorization, Cookie",
    }
    app.use( cors( options ) )

    //getAllProductsOmieAndSyncWithDB()
    Cron.scheduleSync()


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