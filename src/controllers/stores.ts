import { Request, Response } from 'express'
import prisma from '../database/prisma-client'
import { z } from 'zod';
import { GenericError, NotFound, RegistrationCompletedError, ZodErrorMessage } from '../helpers/errors';
import { threadId } from 'worker_threads';

const createStoreSchema = z.object( {
    name: z.string(),
    companyId: z.number(),
    street: z.string(),
    number: z.string(),
    neighborhood: z.string(),
    city: z.string(),
    state: z.string(),
    country: z.string(),
    zipCode: z.string(),
    complement: z.string(),
    emitModel: z.number(),
    ufCode: z.number(),
    cityCode: z.number(),

} )

type createStoreType = z.infer<typeof createStoreSchema>
export const Stores = {
    Create: async ( req: Request, res: Response ): Promise<any> =>
    {
        /*
               #swagger.responses[201] = { 
                    description: "Created",
                      content: {
                        "application/json": {
                            example:{
                                message:  "Loja criada com sucesso!"
                            }
                        }
                    }
               }
               #swagger.responses[409] = { 
                    description: "Registration Error",
                   content: {
                        "application/json": {
                            example:{
                                message: "Erro ao criar loja"
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
                            companyId: 0,
                            street: "",
                            number: "",
                            neighborhood: "",
                            city: "",
                            state: "",
                            country: "",
                            zipCode: "",
                            complement: "",
                            emitModel: 0,
                            ufCode: 0,
                            cityCode: 0,
                          }
                      }
                  }
              }
          */
        let store: createStoreType;
        try
        {
            store = createStoreSchema.parse( req.body )
        } catch ( error: any )
        {
            throw ZodErrorMessage( error )
        }
        try
        {
            await prisma.stores.create( {
                data: store
            } );

        } catch ( error )
        {
            throw RegistrationCompletedError( "Erro ao criar loja" )
        }
        return res.status( 201 ).json( { message: "loja criada com sucesso!" } );
    },
    FindById: async ( req: Request, res: Response ): Promise<any> =>
    {
        try
        {
            const { id } = req.params as { id: string }

            const store = await prisma.stores.findFirst( {
                where: {
                    id: parseInt( id )
                },
            } );

            if ( !store )
                throw NotFound( "loja não encontrada!" )

            return res.status( 200 ).json( store )
        } catch ( error )
        {
            throw GenericError( "Erro ao buscar loja" )
        }
    },
    FindAll: async ( req: Request, res: Response ): Promise<any> =>
    {

        let findAllStores: {
            number: string;
            name: string;
            companyId: number;
            street: string;
            neighborhood: string;
            city: string;
            state: string;
            country: string;
            zipCode: string;
            complement: string;
            emitModel: number;
            ufCode: number;
            cityCode: number;
            id: number;
        }[]
        try
        {
            findAllStores = await prisma.stores.findMany();

            if ( !findAllStores )
            {
                throw NotFound( "Lojas não encontradas" )
            }
        } catch ( error )
        {
            throw GenericError( "Erro ao buscar lojas" )
        }
        return res.status( 200 ).json( findAllStores );
    },
    Delete: async ( req: Request, res: Response ): Promise<any> =>
    {
        let deleteStores: {
            number: string;
            name: string;
            companyId: number;
            street: string;
            neighborhood: string;
            city: string;
            state: string;
            country: string;
            zipCode: string;
            complement: string;
            emitModel: number;
            ufCode: number;
            cityCode: number;
            id: number;
        }
        try
        {
            const { id } = req.params as { id: string };
            deleteStores = await prisma.stores.delete( {
                where: {
                    id: parseInt( id ),
                },
            } );

            if ( !deleteStores )
                throw NotFound( "Loja não encontrada!" )

        } catch ( error )
        {
            throw GenericError( "Erro ao deletar loja" )
        }
        return res.status( 200 ).json( { message: "Loja deletada com sucesso!" } );
    }
}