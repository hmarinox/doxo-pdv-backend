import { Request, Response } from 'express'
import prisma from '../../database/prisma-client'
import { z } from 'zod';
import dayjs from 'dayjs'
import { GenericError, NotFound, RegistrationCompletedError, ZodErrorMessage } from '../../helpers/errors';
import { v7 as uuidv7 } from 'uuid';
import { JsonValue } from '@prisma/client/runtime/library';
const createProductSchema = z.object( {
    saleId: z.number().optional(),
    marca: z.string(),
    descricao: z.string(),
    unidade: z.string(),
    ncm: z.string().nullable().optional().default( `` ),
    valor_unitario: z.number(),
    ean: z.string().nullable().optional(),
    codigo: z.string(),
    codigo_produto: z.coerce.number(),
    codigo_produto_integracao: z.string(),
    peso_bruto: z.number(),
    ageToBuy: z.number(),
    qtd: z.number(),
    dias_garantia: z.number(),
    tagId: z.string().nullable().optional(),
    tagChecked: z.boolean().nullable().optional().default( false ),
    datamatrixId: z.string().nullable().optional(),
    aliquota_cofins: z.number(),
    aliquota_ibpt: z.number(),
    aliquota_icms: z.number(),
    aliquota_pis: z.number(),
    cest: z.string().nullable().optional(),
    cfop: z.string().nullable().optional(),
    csosn_icms: z.string().nullable().optional(),
    cst_cofins: z.string().nullable().optional(),
    cst_icms: z.string().nullable().optional(),
    cst_pis: z.string().nullable().optional(),
    per_icms_fcp: z.number(),
    red_base_cofins: z.number(),
    red_base_icms: z.number(),
    red_base_pis: z.number(),
    tipoItem: z.string(),
    createdAt: z.string().datetime(),
    updatedAt: z.string().datetime(),
} )

const syncCreateSaleSchema = z.object( {
    products: z.array( createProductSchema ),
    pdvId: z.number(),
    taxReceiptEmitDate: z.string().datetime( { offset: true } ),
    taxReceiptNumber: z.number(),
    taxReceiptSerie: z.number(),
    taxReceiptKey: z.string(),
    MigrateResult: z.string(),
    saleUUID: z.string(),

} )


type syncCreateSaleType = z.infer<typeof syncCreateSaleSchema>
export const RemoteSale = {

    SyncCreate: async ( req: Request, res: Response ): Promise<any> =>
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
        let sale: syncCreateSaleType;
        try
        {
            sale = syncCreateSaleSchema.parse( req.body )
        } catch ( error: any )
        {
            throw ZodErrorMessage( error )
        }
        if ( sale.products.length == 0 )
            throw RegistrationCompletedError( "Necessário ter produtos!" )


        let saleCreated: {
            pdvId: number;
            id: number;
            saleUUID: string;
            isSync: boolean;
        }
        try
        {
            saleCreated = await prisma.sales.create( {
                data: {
                    isSync: true,
                    saleUUID: sale.saleUUID,
                    pdvId: sale.pdvId,
                    SalesProducts: {
                        create: {
                            createdAt: sale.taxReceiptEmitDate,
                            products: sale.products
                        }
                    },
                    TaxReceipt: {
                        create: {
                            taxReceiptEmitDate: sale.taxReceiptEmitDate,
                            taxReceiptNumber: sale.taxReceiptNumber,
                            taxReceiptSerie: sale.taxReceiptSerie,
                            taxReceiptKey: sale.taxReceiptKey,
                            TaxReceiptXML: {
                                create: {
                                    MigrateResult: sale.MigrateResult,
                                }
                            }
                        }
                    }



                }
            } )
            if ( !saleCreated )
                throw RegistrationCompletedError( "Erro ao registrar venda" )



        } catch ( error )
        {
            throw RegistrationCompletedError( "Erro ao criar pdv" )
        }
        return res.status( 201 ).json( { saleUUID: saleCreated.saleUUID } );
    },


}