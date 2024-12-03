import { Request, Response } from 'express'
import prisma from '../database/prisma-client'
import { z } from 'zod';
import dayjs from 'dayjs'
import { GenericError, NotFound, RegistrationCompletedError, ZodErrorMessage } from '../helpers/errors';
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
type ProductType = z.infer<typeof createProductSchema>


const createSaleSchema = z.object( {
    products: z.array( createProductSchema ),
    pdvId: z.number(),
    taxReceiptEmitDate: z.string().datetime( { offset: true } ),
    taxReceiptNumber: z.number(),
    taxReceiptSerie: z.number(),
    taxReceiptKey: z.string(),
    MigrateResult: z.string(),


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

type createSaleType = z.infer<typeof createSaleSchema>
type syncCreateSaleType = z.infer<typeof syncCreateSaleSchema>
export const Sale = {
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
        let sale: createSaleType;
        try
        {
            sale = createSaleSchema.parse( req.body )
        } catch ( error: any )
        {
            throw ZodErrorMessage( error )
        }
        if ( sale.products.length == 0 )
            throw RegistrationCompletedError( "Necessário ter produtos!" )
        const saleId = uuidv7()


        try
        {
            const saleCreated = await prisma.sales.create( {
                data: {
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
        return res.status( 201 ).json( { message: "venda registrada com sucesso!" } );
    },
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
    FindById: async ( req: Request, res: Response ): Promise<any> =>
    {
        try
        {
            const { id } = req.params as { id: string }

            const sale = await prisma.sales.findFirst( {
                where: {
                    id: parseInt( id )
                },
                include: {
                    SalesProducts: true,
                    TaxReceipt: true
                }
            } );

            if ( !sale )
                throw NotFound( "Venda não encontrada!" )

            return res.status( 200 ).json( sale )
        } catch ( error )
        {
            throw GenericError( "Erro ao buscar venda" )
        }
    },
    FindAll: async ( req: Request, res: Response ): Promise<any> =>
    {
        let findAllSales: ( {
            SalesProducts: {
                saleId: number;
                createdAt: Date;
                products: JsonValue;
                id: number;
            } | null;
        } & {
            pdvId: number;
            id: number;
            saleUUID: string;
            isSync: boolean;
        } )[]

        try
        {
            findAllSales = await prisma.sales.findMany( {
                include: {
                    SalesProducts: true
                }
            } );

            if ( !findAllSales )
            {
                throw NotFound( "Nenhum registro de venda encontrado!" )
            }
        } catch ( error )
        {
            throw GenericError( "Erro ao buscar registros de vendas" )
        }
        return res.status( 200 ).json( findAllSales );
    },
    FindSaleInfo: async ( req: Request, res: Response ): Promise<any> =>
    {
        try
        {
            console.log( "FindSaleInfo" )
            const { pdvId } = req.params as { pdvId: string }
            console.log( pdvId )
            const checkpopulate = await prisma.taxReceipt.findMany( {
                select: {
                    id: true,
                    taxReceiptNumber: true,
                    Sale: {
                        select: {
                            Pdv: {
                                select: {
                                    taxReceiptSerie: true,

                                }
                            }
                        }
                    }

                },
            } )
            if ( checkpopulate.length === 0 )
            {
                const pdv = await prisma.pdv.findFirstOrThrow( { where: { id: parseInt( pdvId ) } } )
                return res.status( 200 ).json( {
                    taxReceiptNumber: 0,
                    id: 0,
                    Sale: {
                        Pdv: {
                            taxReceiptSerie: pdv.taxReceiptSerie
                        }
                    }
                } )
            }
            const lastTaxReceipt = await prisma.taxReceipt.findFirst( {
                orderBy: [{ id: 'desc' }],

                where: {
                    Sale: {
                        pdvId: parseInt( pdvId )
                    },
                },
                select: {
                    id: true,
                    taxReceiptNumber: true,
                    Sale: {
                        select: {
                            Pdv: {
                                select: {
                                    taxReceiptSerie: true,

                                }
                            }
                        }
                    }

                },
            } );
            if ( !lastTaxReceipt )
                throw NotFound( "Última nota não encontrada!" )

            return res.status( 200 ).json( lastTaxReceipt )
        } catch ( error )
        {
            throw GenericError( "Erro ao buscar nota" )
        }
    }

}