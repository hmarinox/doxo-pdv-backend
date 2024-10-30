import { Request, Response } from 'express'
import prisma from '../database/prisma-client'
import { z } from 'zod';
import { GenericError, NotFound, RegistrationCompletedError, ZodErrorMessage } from '../helpers/errors';


const createPdvSchema = z.object( {
    name: z.string(),
    storeId: z.number(),
    macAddress: z.string()

} )

type createPdvType = z.infer<typeof createPdvSchema>
export const Pdv = {
    Create: async ( req: Request, res: Response ): Promise<any> =>
    {
        /*
               #swagger.responses[201] = { 
                    description: "Created",
                      content: {
                        "application/json": {
                            example:{
                                message:  "Pdv registrado com sucesso!"
                            }
                        }
                    }
               }
               #swagger.responses[409] = { 
                    description: "Registration Error",
                   content: {
                        "application/json": {
                            example:{
                                message: "Erro ao registrar pdv"
                            }
                        }
                    }
               }
               #swagger.responses[500] = { 
                    description:  "Schema validation error",
                    content: {
                        "application/json": {
                            example:{
                                message: "string"
                            }
                        }
                    }
               }
                #swagger.requestBody = {
                  required: true,
                  content: {
                      "application/json": {
                          example: {
                            name: "",
                            storeId: 0,
                            name: "string",
                            macAddress: "string"
                          }
                      }
                  }
              }
          */
        let store: createPdvType;
        try
        {
            store = createPdvSchema.parse( req.body )
        } catch ( error: any )
        {
            throw ZodErrorMessage( error )
        }
        try
        {
            await prisma.pdv.create( {
                data: store
            } );

        } catch ( error )
        {
            throw RegistrationCompletedError( "Erro ao criar pdv" )
        }
        return res.status( 201 ).json( { message: "pdv registrado com sucesso!" } );
    },
    FindBymacAddress: async ( req: Request, res: Response ): Promise<any> =>
    {
        try
        {
            const { macAddress } = req.params as { macAddress: string }

            const store = await prisma.pdv.findFirst( {
                where: {
                    macAddress: macAddress
                },
            } );

            if ( !store )
                throw NotFound( "pdv não encontrado!" )

            return res.status( 200 ).json( store )
        } catch ( error )
        {
            throw GenericError( "Erro ao buscar pdv" )
        }
    },
    FindAll: async ( req: Request, res: Response ): Promise<any> =>
    {

        let findAllPdvs: {
            name: string;
            storeId: number;
            macAddress: string;
            id: number;
        }[]
        try
        {
            findAllPdvs = await prisma.pdv.findMany();

            if ( !findAllPdvs )
            {
                throw NotFound( "Lojas não encontradas" )
            }
        } catch ( error )
        {
            throw GenericError( "Erro ao buscar pdvs" )
        }
        return res.status( 200 ).json( findAllPdvs );
    },
    Delete: async ( req: Request, res: Response ): Promise<any> =>
    {
        let deletePdvs: {
            name: string;
            storeId: number;
            macAddress: string;
            id: number;
        }
        try
        {
            const { id } = req.params as { id: string };
            deletePdvs = await prisma.pdv.delete( {
                where: {
                    id: parseInt( id ),
                },
            } );

            if ( !deletePdvs )
                throw NotFound( "Loja não encontrada!" )

        } catch ( error )
        {
            throw GenericError( "Erro ao deletar pdv" )
        }
        return res.status( 200 ).json( { message: "Loja deletada com sucesso!" } );
    }
}