import { Request, Response } from 'express';
import prisma from '../database/prisma-client';
import { z } from 'zod';
import { RegistrationCompletedError, UserLogginError, ZodErrorMessage } from '../helpers/errors';
import bcrypt from 'bcrypt'

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
            if ( !userCrated )
                throw RegistrationCompletedError( "" )
        } catch ( error )
        {
            console.log( error )
            throw RegistrationCompletedError( "Erro ao buscar colaborador" )
        }
        const passwordIsMath = await bcrypt.compare( user.password, userCrated.password )
        if ( !passwordIsMath )
        {
            throw UserLogginError( "Credenciais erradas!" )
        }
        if ( !userCrated )
            throw UserLogginError( "Erro ao buscar colaborador" )
        return res.status( 200 ).json( { message: "logado com sucesso!" } )
    },
}


