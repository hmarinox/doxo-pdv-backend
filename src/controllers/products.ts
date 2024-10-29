import { Request, Response } from 'express'
import prisma from '../database/prisma-client'
import { z, ZodError } from 'zod';
import { ZodErrorMessage } from '../helpers/errors';
const createProductSchema = z.object( {
    valor_unitario: z.number(),
    ncm: z.string(),
    dias_garantia: z.string(),
    marca: z.string(),
    ean: z.string(),
    codigo: z.string(),
    codigo_produto_integracao: z.string(),
    descricao: z.string(),
    unidade: z.string(),
    peso_bruto: z.string(),
    ageToBuy: z.string(),
    qtd: z.string(),
    tagId: z.string(),
    tagChecked: z.string(),
    codigo_produto: z.string(),
    datamatrixId: z.string(),
    aliquota_cofins: z.string(),
    aliquota_ibpt: z.string(),
    aliquota_pis: z.string(),
    aliquota_icms: z.string(),
    per_icms_fcp: z.string(),
    red_base_cofins: z.string(),
    red_base_icms: z.string(),
    red_base_pis: z.string(),
    tipoItem: z.string(),
} )
type createProductType = z.infer<typeof createProductSchema>

export const Products = {

    CreateProducts: async ( req: Request, res: Response ): Promise<any> =>
    {
        let createProduct: createProductType
        try
        {

            try
            {
                createProduct = createProductSchema.parse( req.body )
            } catch ( error: any )
            {
                throw ZodErrorMessage( error )
            }

            const newProduct = await prisma.products.create( {
                data: {
                    valor_unitario: createProduct.valor_unitario,
                    aliquota_cofins: createProduct.aliquota_cofins,
                    aliquota_pis: createProduct.aliquota_pis,
                    aliquota_ibpt: createProduct.aliquota_ibpt,
                    aliquota_icms: createProduct.aliquota_icms,
                    per_icms_fcp: createProduct.per_icms_fcp,
                    red_base_cofins: createProduct.red_base_cofins,
                    red_base_icms: createProduct.red_base_icms,
                    red_base_pis: createProduct.red_base_pis,
                    tipoItem: createProduct.tipoItem,
                    ncm: createProduct.ncm: ncm === '' ? null : createProduct.ncm,
                dias_garantia: createProduct.dias_garantia,
                marca: createProduct.marca,
                ean: createProduct.ean,
                codigo: createProduct.codigo,
                codigo_produto: createProduct.codigo_produto,
                codigo_produto_integracao: createProduct.codigo_produto_integracao,
                descricao: createProduct.descricao,
                unidade: createProduct.unidade,
                peso_bruto: createProduct.peso_bruto,
                ageToBuy: createProduct.ageToBuy,
                qtd: createProduct.qtd,

            }
            } );

        return res.status( 201 ).json( newProduct );
    } catch( error )
    {
        console.error( "Erro ao criar o produto:", error );
        return res.status( 500 ).json( { error: "Erro ao criar o produto" } );
    }
},
    FindOneProducts: async ( req: Request, res: Response ): Promise<any> =>
    {
        try
        {
            const { id } = req.params;

            const findOneProducts = await prisma.products.findUnique( {
                where: {
                    id: parseInt( id ),
                },
            } );

            if ( findOneProducts )
            {
                return res.status( 200 ).json( findOneProducts );
            } else
            {
                return res.status( 404 ).json( { error: "Produto não encontrado" } );
            }
        } catch ( error )
        {
            console.error( "Erro ao buscar o produto:", error );
            return res.status( 500 ).json( { error: "Erro ao buscar o produto" } );
        }
    },
        FindOneProductsByBarcode: async ( req: Request, res: Response ): Promise<any> =>
        {
            try
            {
                const { ean } = req.params;
                console.log( ean )
                const findOneProducts = await prisma.products.findFirst( {
                    where: {
                        ean: ean,
                    },
                } );

                if ( findOneProducts )
                {
                    const product = JSON.parse(
                        JSON.stringify( findOneProducts, ( key, value ) =>
                            typeof value === 'bigint' ? value.toString() : value
                        )
                    );

                    return res.status( 200 ).json( product );
                } else
                {
                    return res.status( 404 ).json( { error: "Produto não encontrado" } );
                }
            } catch ( error )
            {
                console.error( "Erro ao buscar o produto:", error );
                return res.status( 500 ).json( { error: "Erro ao buscar o produto" } );
            }
        },
            FindOneProductsByTagId: async ( req: Request, res: Response ): Promise<any> =>
            {
                try
                {
                    const { tagId } = req.params;

                    const findOneProducts = await prisma.products.findFirst( {
                        where: {
                            tagId: tagId,
                        },
                    } );

                    if ( findOneProducts )
                    {
                        return res.status( 200 ).json( findOneProducts );
                    } else
                    {
                        return res.status( 404 ).json( { error: "Produto não encontrado" } );
                    }
                } catch ( error )
                {
                    console.error( "Erro ao buscar o produto:", error );
                    return res.status( 500 ).json( { error: "Erro ao buscar o produto" } );
                }
            },
                FindOneProductsByDatamatrixId: async ( req: Request, res: Response ): Promise<any> =>
                {
                    try
                    {
                        const { datamatrixId } = req.params;

                        const findOneProducts = await prisma.products.findFirst( {
                            where: {
                                datamatrixId: datamatrixId,
                            },
                        } );

                        if ( findOneProducts )
                        {
                            return res.status( 200 ).json( findOneProducts );
                        } else
                        {
                            return res.status( 404 ).json( { error: "Produto não encontrado" } );
                        }
                    } catch ( error )
                    {
                        console.error( "Erro ao buscar o produto:", error );
                        return res.status( 500 ).json( { error: "Erro ao buscar o produto" } );
                    }
                },
                    FindAllProducts: async ( req: Request, res: Response ): Promise<any> =>
                    {
                        try
                        {
                            const findAllProducts = await prisma.products.findMany();

                            if ( findAllProducts )
                            {
                                return res.status( 200 ).json( findAllProducts );
                            } else
                            {
                                return res.status( 404 ).json( { error: "Produto não encontrado" } );
                            }
                        } catch ( error )
                        {
                            console.error( "Erro ao buscar o produto:", error );
                            return res.status( 500 ).json( { error: "Erro ao buscar o produto" } );
                        }
                    },
                        DestroyProducts: async ( req: Request, res: Response ): Promise<any> =>
                        {
                            try
                            {
                                const { id } = req.params;

                                const destroyProducts = await prisma.products.delete( {
                                    where: {
                                        id: parseInt( id ),
                                    },
                                } );

                                if ( destroyProducts )
                                {
                                    return res.status( 200 ).json( destroyProducts );
                                } else
                                {
                                    return res.status( 404 ).json( { error: "Produto não deletado" } );
                                }
                            } catch ( error )
                            {
                                console.error( "Erro ao deletar o produto:", error );
                                return res.status( 500 ).json( { error: "Erro ao deletar o produto" } );
                            }
                        }
}