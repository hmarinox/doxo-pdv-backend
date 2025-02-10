import { Request, Response } from 'express'
import prisma from '../database/prisma-client'
import { z } from 'zod';
import { GenericError, NotFound, RegistrationCompletedError, ZodErrorMessage } from '../helpers/errors';
import { threadId } from 'worker_threads';

const createStoreSchema = z.object( {
    id: z.number().optional(),
    name: z.string(),
    companyId: z.number(),
    street: z.string(),
    number: z.string(),
    neighborhood: z.string(),
    city: z.string(),
    state: z.string(),
    country: z.string().optional(),
    zipCode: z.string(),
    complement: z.string().optional(),
    emitModel: z.number(),
    ufCode: z.string(),
    cityCode: z.string(),

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
                            ufCode: "string",
                            cityCode: "string",
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
        let storeCreated: {
            number: string;
            id: number;
            storeUUID: string | null;
            name: string;
            companyId: number;
            street: string;
            neighborhood: string;
            city: string;
            state: string;
            country: string;
            zipCode: string;
            complement: string | null;
            isSync: boolean;
            emitModel: number;
            ufCode: string;
            cityCode: string;
        }
        try
        {

            storeCreated = await prisma.stores.upsert( {
                where: { id: store.id },
                update: store,
                create: {
                    name: store.name,
                    companyId: store.companyId,
                    street: store.street,
                    number: store.number,
                    neighborhood: store.neighborhood,
                    city: store.city,
                    state: store.state,
                    country: store.country,
                    zipCode: store.zipCode.replace( /[^a-zA-Z0-9]/g, "" ),
                    complement: store.complement,
                    emitModel: store.emitModel,
                    ufCode: store.ufCode,
                    cityCode: store.cityCode
                }
            } );

        } catch ( error )
        {
            throw RegistrationCompletedError( "Erro ao criar loja" )
        }
        return res.status( 201 ).json( { message: store.id ? "Loja atualizada com sucesso!" : "Loja criada com sucesso!", store: storeCreated } );
    },
    FindById: async ( req: Request, res: Response ): Promise<any> =>
    {
        try
        {
            const { id } = req.params as { id: string }
            const { companyId } = req.query as { companyId: string }
            let whereClause: { id?: number, companyId?: number } = {
                id: parseInt( id )
            }

            if ( id === "0" )
                whereClause = {
                    companyId: parseInt( companyId )
                }
            console.log( "where clause =", whereClause )
            const store = await prisma.stores.findFirst( {
                where: whereClause,

            } );
            console.log( "store = ", store )
            if ( !store )
                throw NotFound( "loja não encontrada!" )

            return res.status( 200 ).json( store )
        } catch ( error )
        {
            throw GenericError( "Erro ao buscar loja" )
        }
    },
    FindByPdvId: async ( req: Request, res: Response ): Promise<any> =>
    {
        try
        {
            console.log( "params = ", req.params )
            const { id } = req.params as { id: string }
            const { companyId } = req.query as { companyId: string }


            const store = await prisma.pdv.findFirst( {
                where: {
                    id: parseInt( id )
                },
                select: {
                    Store: {
                        select: {
                            number: true,
                            id: true,
                            name: true,
                            companyId: true,
                            street: true,
                            neighborhood: true,
                            city: true,
                            state: true,
                            country: true,
                            zipCode: true,
                            complement: true,
                            emitModel: true,
                            ufCode: true,
                            cityCode: true,
                            Company: {
                                select: {
                                    id: true,
                                    name: true,
                                    cnpj: true,
                                    ie: true,
                                    companyUUID: true,
                                    Settings: true
                                }
                            }
                        }
                    },

                }
            } );
            console.log( "store = ", store )
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
            storeUUID: string | null;
            isSync: boolean;
            neighborhood: string;
            city: string;
            state: string;
            country: string;
            zipCode: string;
            complement: string | null;
            emitModel: number;
            ufCode: string;
            cityCode: string;
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
            storeUUID: string | null;
            isSync: boolean;
            neighborhood: string;
            city: string;
            state: string;
            country: string;
            zipCode: string;
            complement: string | null;
            emitModel: number;
            ufCode: string;
            cityCode: string;
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