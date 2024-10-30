import { Request, Response } from 'express'
import prisma from '../database/prisma-client'
import { z } from 'zod';
import { GenericError, NotFound, RegistrationCompletedError, ZodErrorMessage } from '../helpers/errors';
import { v7 as uuidv7 } from 'uuid';
const createProductSchema = z.object( {
    saleId: z.number().optional(),
    marca: z.string(),
    descricao: z.string(),
    unidade: z.string(),
    ncm: z.string().optional().default( `` ),
    valor_unitario: z.number(),
    ean: z.string().optional(),
    codigo: z.string(),
    codigo_produto: z.number(),
    codigo_produto_integracao: z.string(),
    peso_bruto: z.number(),
    ageToBuy: z.number(),
    qtd: z.number(),
    dias_garantia: z.number(),
    tagId: z.string().optional(),
    tagChecked: z.boolean().optional(),
    datamatrixId: z.string().optional(),
    aliquota_cofins: z.number(),
    aliquota_ibpt: z.number(),
    aliquota_icms: z.number(),
    aliquota_pis: z.number(),
    cest: z.string().optional(),
    cfop: z.string().optional(),
    csosn_icms: z.string().optional(),
    cst_cofins: z.string().optional(),
    cst_icms: z.string().optional(),
    cst_pis: z.string().optional(),
    per_icms_fcp: z.number(),
    red_base_cofins: z.number(),
    red_base_icms: z.number(),
    red_base_pis: z.number(),
    tipoItem: z.string(),
} )
type ProductType = z.infer<typeof createProductSchema>


const createSaleSchema = z.object( {
    products: z.array( createProductSchema ),
    pdvId: z.number()

} )

type createPdvType = z.infer<typeof createSaleSchema>
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
        let sale: createPdvType;
        try
        {
            sale = createSaleSchema.parse( req.body )
        } catch ( error: any )
        {
            throw ZodErrorMessage( error )
        }
        const saleId = uuidv7()
        try
        {
            const saleCreated = await prisma.sales.create( {
                data: {

                    saleId,
                    pdvId: sale.pdvId
                }
            } )
            if ( !saleCreated )

                throw RegistrationCompletedError( "Erro ao criar pdv" )
            const products = sale.products.map( ( product ) =>
            {
                product.saleId = saleCreated.id
                return product
            } )
            await prisma.salesProducts.createMany( {
                data: products,
            } )


        } catch ( error )
        {
            throw RegistrationCompletedError( "Erro ao criar pdv" )
        }
        return res.status( 201 ).json( { message: "pdv registrado com sucesso!", pdv } );
    },

    Update: async ( req: Request, res: Response ): Promise<any> =>
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
        const { macAddress } = req.params as { macAddress: string }
        try
        {
            pdv = createSaleSchema.parse( req.body )
        } catch ( error: any )
        {
            throw ZodErrorMessage( error )
        }
        try
        {
            let pdvUpdated = await prisma.pdv.update( {
                where: {

                    macAddress: macAddress

                },
                data: {
                    name: pdv.name,
                    storeId: pdv.storeId,
                    taxReceiptSerie: pdv.taxReceiptSerie
                }
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

            const pdv = await prisma.pdv.findFirst( {
                where: {
                    macAddress: macAddress
                },
            } );

            if ( !pdv )
                throw NotFound( "pdv não encontrado!" )

            return res.status( 200 ).json( pdv )
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
            taxReceiptSerie: number;
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
            taxReceiptSerie: number;
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