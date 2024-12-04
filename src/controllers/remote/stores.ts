import { Request, Response } from 'express'
import prisma from '../../database/prisma-client'
import { z } from 'zod';
import { GenericError, NotFound, RegistrationCompletedError, ZodErrorMessage } from '../../helpers/errors';

const companySchema = z.object( {

    id: z.number(),
    name: z.string(),
    cnpj: z.string(),
    ie: z.string(),
    isSync: z.string(),
    companyUUID: z.string(),

} )
const createStoreSchema = z.object( {
    id: z.number().optional(),
    storeUUID: z.string(),
    name: z.string(),
    companyUUID: z.string(),
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
    Company: companySchema

} )

type createStoreType = z.infer<typeof createStoreSchema>
export const RemoteStores = {
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
            const company = await prisma.companies.findUnique( { where: { companyUUID: store.companyUUID } } )
            if ( !company )
                throw NotFound( "company not found!" )

            storeCreated = await prisma.stores.upsert( {
                where: { storeUUID: store.storeUUID },
                update: {
                    name: store.name,
                    companyId: company.id,
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
                },
                create: {
                    storeUUID: store.storeUUID,
                    name: store.name,
                    companyId: company.id,
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
        return res.status( 201 ).json( { store: storeCreated } );
    },

}