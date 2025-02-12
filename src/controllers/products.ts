import { Request, Response } from 'express'
import prisma from '../database/prisma-client'
import { z, ZodError } from 'zod';
import { GenericError, NotFound, RegistrationCompletedError, ZodErrorMessage } from '../helpers/errors';
import parseGS1Barcode from '../helpers/decode-2D-code'
import { validateHeaderName } from 'http';
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


const BARCODE_LENGTH = 13
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
    FindByCode: async ( req: Request, res: Response ): Promise<any> =>
    {

        let weight = 1;
        let price: number = -1;
        let { code } = req.params as { code: string };
        let validity;
        if ( code.length > BARCODE_LENGTH )
        {
            const result = parseGS1Barcode( code )
            console.log()
            code = result.GTIN
            if ( result.weight )
                weight = result.weight
            if ( result.price )
                price = result.price
            if ( result.validity )
                validity = result.validity
        }
        else if ( code.length === BARCODE_LENGTH && code.startsWith( "2", 0 ) )
        {
            weight = parseInt( code.substring( 7, 12 ) ) / 1000
            code = code.substring( 2, 7 )
        }
        const findOneProducts = await prisma.products.findFirst( {
            where: {
                ean: code,
            },
        } );

        if ( !findOneProducts )
            throw NotFound( "Produto não encontrado" );
        try
        {
            console.log( typeof findOneProducts )
            let product: {
                marca: string;
                descricao: string;
                unidade: string;
                ncm: string;
                valor_unitario: number;
                ean: string | null;
                codigo: string;
                codigo_produto: bigint;
                codigo_produto_integracao: string;
                qtd: number;
                peso_bruto: number;
                id: number;
                ageToBuy: number;
                dias_garantia: number;
                tagId: string | null;
                tagChecked: boolean | null;
                datamatrixId: string | null;
                aliquota_cofins: number;
                aliquota_ibpt: number;
                aliquota_icms: number;
                aliquota_pis: number;
                cest: string | null;
                cfop: string | null;
                csosn_icms: string | null;
                cst_cofins: string | null;
                cst_icms: string | null;
                cst_pis: string | null;
                per_icms_fcp: number;
                red_base_cofins: number;
                red_base_icms: number;
                red_base_pis: number;
                tipoItem: string;
                valor_total: number;
                validade?: string;
            }

            product = {
                ...findOneProducts,
                qtd: 1,
                valor_total: findOneProducts.valor_unitario,
                validade: validity
            }

            if ( product.unidade === 'KG' )
            {
                console.log( "weight =", price / product.valor_unitario )
                weight = price == -1 ? weight : price / product.valor_unitario
                product.peso_bruto = weight
                product.qtd = weight
                product.valor_total = price == -1 ? product.valor_unitario * weight : price
            }
            console.log( product )
            product = JSON.parse(
                JSON.stringify( product, ( key, value ) =>
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
        const { tagId } = req.params;

        const findOneProducts = await prisma.products.findFirst( {
            where: {
                tagId: tagId,
            },
        } );

        if ( !findOneProducts )
            throw NotFound( "Produto não encontrado" );
        try
        {
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

        const { datamatrixId } = req.params;

        const findOneProducts = await prisma.products.findFirst( {
            where: {
                datamatrixId: datamatrixId,
            },
        } );

        if ( !findOneProducts )
            throw NotFound( "Produto não encontrado" );
        try
        {
            const product = JSON.parse(
                JSON.stringify( findOneProducts, ( key, value ) =>
                    typeof value === 'bigint' ? value.toString() : value
                )
            );
            return res.status( 200 ).json( product );
        } catch ( error )
        {

            throw GenericError()
        }
    },
    FindAll: async ( req: Request, res: Response ): Promise<any> =>
    {

        let findAllProducts = await prisma.products.findMany();

        if ( findAllProducts.length === 0 )
            throw NotFound( "Nenhum Produto encontrado" )
        try
        {
            findAllProducts = findAllProducts.map( ( findOneProducts: any ) =>
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

