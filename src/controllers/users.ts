import { Request, Response } from 'express'
import prisma from '../database/prisma-client'
import { z } from 'zod';
import { GenericError, NotFound, RegistrationCompletedError, ZodErrorMessage } from '../helpers/errors';
import bcrypt from 'bcrypt'

const createUserschema = z.object( {
    id: z.number().optional().default( 0 ),
    name: z.string(),
    email: z.string(),
    password: z.string(),
    level: z.union( [
        z.literal( 'ADMIN' ),
        z.literal( 'OPERATOR' )
            .default( `OPERATOR` ),
    ] )
} )



export const Users = {
    CreateOrUpdate: async ( req: Request, res: Response ): Promise<any> =>
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

        let userCrated: {
            id: number;
            name: string;
            email: string;
            password: string;
            level: "ADMIN" | "OPERATOR";
        }
        const salt = await bcrypt.genSalt( 10 )
        const hash = await bcrypt.hash( user.password, salt )
        try
        {
            userCrated = await prisma.users.upsert( {
                where: { id: user.id },
                update: user,
                create: {
                    name: user.name,
                    email: user.email,
                    password: hash,
                    level: user.level
                }
            } );
        } catch ( error )
        {
            console.log( error )
            throw RegistrationCompletedError( "Erro ao criar colaborador" )
        }
        return res.status( 201 ).json( {
            message: user.id ? "Colaboradot atualizado com sucesso!" : "Colaborador criado com sucesso!", user: {
                name: userCrated.name,
                email: userCrated.email,
                level: userCrated.level,
            }
        } );
    },
    FindById: async ( req: Request, res: Response ): Promise<any> =>
    {
        try
        {
            const { id } = req.params as { id: string }

            const user = await prisma.users.findUniqueOrThrow( {
                where: {
                    id: parseInt( id ),
                },
                select: {
                    id: true,
                    name: true,
                    email: true,
                    level: true,
                }
            } );

            if ( !user )
                throw NotFound( "Colaborador não encontrado!" )

            return res.status( 200 ).json( user )
        } catch ( error )
        {
            throw GenericError( "Erro ao buscar colaborador" )
        }
    },
    FindAll: async ( req: Request, res: Response ): Promise<any> =>
    {

        let findAllusers: {
            id: number;
            name: string;
            email: string;
            level: "ADMIN" | "OPERATOR";
        }[]
        try
        {
            findAllusers = await prisma.users.findMany( {
                select: {
                    id: true,
                    name: true,
                    email: true,
                    level: true,

                }
            } );

            if ( !findAllusers )
            {
                throw NotFound( "Colaboradores não encontrados" )
            }
        } catch ( error )
        {
            throw GenericError( "Erro ao buscar Colaboradores" )
        }
        return res.status( 200 ).json( findAllusers );
    },
    Delete: async ( req: Request, res: Response ): Promise<any> =>
    {

        try
        {
            const { id } = req.params as { id: string };
            const deleteuser = await prisma.users.delete( {
                where: {
                    id: parseInt( id ),
                },
            } );

            if ( !deleteuser )
                throw NotFound( "Colaborador não encontrado!" )

        } catch ( error )
        {
            throw GenericError( "Erro ao deletar colaborador" )
        }
        return res.status( 200 ).json( { message: "Colaborador deletada com sucesso!" } );
    },


}