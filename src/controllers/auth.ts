import { Request, Response } from 'express'
import prisma from '../database/prisma-client'
import { z } from 'zod';
import { GenericError, NotFound, RegistrationCompletedError, ZodErrorMessage } from '../helpers/errors';
import { userLevel } from '@prisma/client';


const createUserschema = z.object( {
    email: z.string(),
    password: z.string(),
} )



export const Auth = {
    SignIn: async ( req: Request, res: Response ): Promise<any> =>
    {
        /*
              
          */
        let user;
        try
        {
            user = createUserschema.parse( req.body )
        } catch ( error: any )
        {
            throw ZodErrorMessage( error )
        }

        let userCrated;
        try
        {
            userCrated = await prisma.users.findFirst( {
                where: { email: user.email },

            } );
        } catch ( error )
        {
            console.log( error )
            throw RegistrationCompletedError( "Erro ao buscar colaborador" )
        }
        if ( !userCrated )
            throw RegistrationCompletedError( "Erro ao buscar colaborador" )
        return res.status( 200 ).json( { message: "logado com sucesso!" } )
    },
}


