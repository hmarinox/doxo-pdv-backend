import { Request, Response } from 'express'
import prisma from '../../database/prisma-client'
import { z } from 'zod';
import { GenericError, NotFound, RegistrationCompletedError, ZodErrorMessage } from '../../helpers/errors';
import { machine } from 'os';


const createPdvSchema = z.object( {
    id: z.number().optional(),
    name: z.string(),
    isSync: z.boolean(),
    Store: z.object( {
        storeUUID: z.string()
    } ),
    pdvUUID: z.string(),
    storeId: z.number(),
    macAddress: z.string(),
    taxReceiptSerie: z.number()


} )

type createPdvType = z.infer<typeof createPdvSchema>
export const RemotePdv = {
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
                            macAddress: "string",
                            taxReceiptSerie: 260
                          }
                      }
                  }
              }
          */
        let pdv: createPdvType;
        try
        {
            pdv = createPdvSchema.parse( req.body )
        } catch ( error: any )
        {
            throw ZodErrorMessage( error )
        }
        const store = await prisma.stores.findUnique( { where: { storeUUID: pdv.Store.storeUUID } } )
        if ( !store )
            throw NotFound( "store not found" )
        let pdvCreated: {
            id: number;
            name: string;
            isSync: boolean;
            pdvUUID: string;
            storeId: number;
            macAddress: string;
            taxReceiptSerie: number;
        }
        try
        {
            pdvCreated = await prisma.pdv.upsert( {

                where: { pdvUUID: pdv.pdvUUID },
                create: {
                    name: pdv.name,
                    pdvUUID: pdv.pdvUUID,
                    macAddress: pdv.macAddress,
                    storeId: store.id,
                    taxReceiptSerie: pdv.taxReceiptSerie
                },
                update: {
                    name: pdv.name,
                    macAddress: pdv.macAddress,
                    taxReceiptSerie: pdv.taxReceiptSerie
                }
            } );

        } catch ( error )
        {
            throw RegistrationCompletedError( "Erro ao criar pdv" )
        }
        return res.status( 201 ).json( { pdv: pdvCreated } );
    },


}