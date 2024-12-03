import z from 'zod'


const envSchema = z.object( {
    DATABASE_URL: z.string(),
    PORT: z.coerce.number(),
    OMIE_API_URL: z.string(),
    REMOTE_API_URL: z.string(),
    APP_KEY: z.string(),
    APP_SECRET: z.string(),
    OPERATION: z.union( [
        z.literal( 'local' ),
        z.literal( 'remote' )
    ] )
        .default( 'local' )
} )

const env = envSchema.parse( process.env )

export default env