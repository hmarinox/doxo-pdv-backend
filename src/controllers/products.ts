import { Request, Response } from 'express'
import prisma from '../database/prisma-client'
import { z, ZodError } from 'zod';
import { GenericError, NotFound, RegistrationCompletedError, ZodErrorMessage } from '../helpers/errors';
const createProductSchema = z.object( {
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

export const Products = {

    Create: async ( req: Request, res: Response ): Promise<any> =>
    {
        /*
               #swagger.responses[201] = { 
                    description: "Created",
                      content: {
                        "application/json": {
                            example:{
                                message: "Produto cadastrado com sucesso!"
                            }
                        }
                    }
               }
               #swagger.responses[409] = { 
                    description: "Registration Error",
                   content: {
                        "application/json": {
                            example:{
                                message: "Erro ao cadastrar o produto"
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
                           marca: "string",
                           descricao: "string",
                           unidade: "string",
                           ncm: "string",
                           valor_unitario: 0,
                           ean: "string",
                           codigo: "string",
                           codigo_produto: 0,
                           codigo_produto_integracao: "string",
                           peso_bruto: 0,
                           ageToBuy: 0,
                           qtd: 0,
                           dias_garantia: 0,
                           tagId: "string",
                           tagChecked: false,
                           datamatrixId: "string",
                           aliquota_cofins: 0,
                           aliquota_ibpt: 0,
                           aliquota_icms: 0,
                           aliquota_pis: 0,
                           cest: "string",
                           cfop: "string",
                           csosn_icms: "string",
                           cst_cofins: "string",
                           cst_icms: "string",
                           cst_pis: "string",
                           per_icms_fcp: 0,
                           red_base_cofins: 0,
                           red_base_icms: 0,
                           red_base_pis: 0,
                           tipoItem: "string",
                          }
                      }
                  }
              }
          */
        let createProduct: ProductType
        let newProduct;
        try
        {
            createProduct = createProductSchema.parse( req.body )
        } catch ( error: any )
        {
            throw ZodErrorMessage( error )
        }
        try
        {
            newProduct = await prisma.products.create( {
                data: {
                    marca: createProduct.marca,
                    descricao: createProduct.descricao,
                    unidade: createProduct.unidade,
                    ncm: createProduct.ncm,
                    valor_unitario: createProduct.valor_unitario,
                    ean: createProduct.ean,
                    codigo: createProduct.codigo,
                    codigo_produto: createProduct.codigo_produto,
                    codigo_produto_integracao: createProduct.codigo_produto_integracao,
                    peso_bruto: createProduct.peso_bruto,
                    ageToBuy: createProduct.ageToBuy,
                    qtd: createProduct.qtd,
                    dias_garantia: createProduct.dias_garantia,
                    tagId: createProduct.tagId,
                    tagChecked: createProduct.tagChecked,
                    datamatrixId: createProduct.datamatrixId,
                    aliquota_cofins: createProduct.aliquota_cofins,
                    aliquota_ibpt: createProduct.aliquota_ibpt,
                    aliquota_icms: createProduct.aliquota_icms,
                    aliquota_pis: createProduct.aliquota_pis,
                    cest: createProduct.cest,
                    cfop: createProduct.cfop,
                    csosn_icms: createProduct.cst_icms,
                    cst_cofins: createProduct.cst_cofins,
                    cst_icms: createProduct.cst_icms,
                    cst_pis: createProduct.cst_pis,
                    per_icms_fcp: createProduct.per_icms_fcp,
                    red_base_cofins: createProduct.red_base_cofins,
                    red_base_icms: createProduct.red_base_icms,
                    red_base_pis: createProduct.red_base_pis,
                    tipoItem: createProduct.tipoItem,

                }
            } );

        } catch ( error )
        {
            throw RegistrationCompletedError( "Erro ao cadastrar o produto" )
        }
        return res.status( 201 ).json( { message: "Produto cadastrado com sucesso!" } );
    },
    FindById: async ( req: Request, res: Response ): Promise<any> =>
    {

        const { id } = req.params as { id: string };

        const findOneProducts = await prisma.products.findFirst( {
            where: {
                id: parseInt( id ),
            },
        } );
        const product = JSON.parse(
            JSON.stringify( findOneProducts, ( key, value ) =>
                typeof value === 'bigint' ? value.toString() : value
            )
        );
        if ( !findOneProducts )
            throw NotFound( "Produto não encontrado" )
        return res.status( 200 ).json( product );
    },
    FindByBarcode: async ( req: Request, res: Response ): Promise<any> =>
    {
        try
        {

            const { ean } = req.params as { ean: string };
            const findOneProducts = await prisma.products.findFirst( {
                where: {
                    ean: ean,
                },
            } );

            if ( !findOneProducts )
                throw NotFound( "Produto não encontrado" );

            const product = JSON.parse(
                JSON.stringify( findOneProducts, ( key, value ) =>
                    typeof value === 'bigint' ? value.toString() : value
                )
            );
            return res.status( 200 ).json( product );
        }
        catch 
        {
            throw GenericError()
        }
    },
    FindByTagId: async ( req: Request, res: Response ): Promise<any> =>
    {
        try
        {
            const { tagId } = req.params;

            const findOneProducts = await prisma.products.findFirst( {
                where: {
                    tagId: tagId,
                },
            } );

            if ( !findOneProducts )
                throw NotFound( "Produto não encontrado" );
            const product = JSON.parse(
                JSON.stringify( findOneProducts, ( key, value ) =>
                    typeof value === 'bigint' ? value.toString() : value
                )
            );
            return res.status( 200 ).json( product );
        } catch ( error )
        {
            console.error( "Erro ao buscar o produto:", error );
            throw GenericError()
        }
    },
    FindByDatamatrixId: async ( req: Request, res: Response ): Promise<any> =>
    {
        try
        {
            const { datamatrixId } = req.params;

            const findOneProducts = await prisma.products.findFirst( {
                where: {
                    datamatrixId: datamatrixId,
                },
            } );

            if ( !findOneProducts )
                throw NotFound( "Produto não encontrado" );
            const product = JSON.parse(
                JSON.stringify( findOneProducts, ( key, value ) =>
                    typeof value === 'bigint' ? value.toString() : value
                )
            );
            return res.status( 200 ).json( product );
        } catch ( error )
        {
            console.error( "Erro ao buscar o produto:", error );
            throw GenericError()
        }
    },
    FindAll: async ( req: Request, res: Response ): Promise<any> =>
    {
        try
        {
            let findAllProducts = await prisma.products.findMany();

            if ( findAllProducts.length === 0 )
                throw NotFound( "Nenhum Produto encontrado" )
            findAllProducts = findAllProducts.map( ( findOneProducts ) =>
            {
                return JSON.parse(
                    JSON.stringify( findOneProducts, ( key, value ) =>
                        typeof value === 'bigint' ? value.toString() : value
                    )
                );
            } )
            return res.status( 200 ).json( findAllProducts );
        } catch ( error )
        {
            console.error( "Erro ao buscar o produto:", error );
            throw GenericError()
        }
    },
    Delete: async ( req: Request, res: Response ): Promise<any> =>
    {
        try
        {
            const { id } = req.params as { id: string }


            const deleteProduct = await prisma.products.delete( {
                where: {
                    id: parseInt( id ),
                },
            } );

            if ( !deleteProduct )
                throw NotFound( "Produto não deletado" )
            return res.status( 200 ).json( deleteProduct );
        } catch ( error )
        {
            console.error( "Erro ao deletar o produto:", error );
            throw GenericError()
        }
    }
}