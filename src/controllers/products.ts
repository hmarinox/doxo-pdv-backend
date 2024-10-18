import { Request, Response } from 'express'
import prisma from '../database/prisma-client'
export const Products = {
    createProducts: async ( req: Request, res: Response ): Promise<any> =>
    {
        try
        {
            const {
                valor_unitario,
                ncm,
                dias_garantia,
                marca,
                ean,
                codigo,
                codigo_produto_integracao,
                descricao,
                unidade,
                peso_bruto,
                ageToBuy,
                qtd,
                tagId,
                tagChecked,
                codigo_produto,
                datamatrixId,
                aliquota_cofins,
                aliquota_ibpt,
                aliquota_pis,
                aliquota_icms,
                per_icms_fcp,
                red_base_cofins,
                red_base_icms,
                red_base_pis,
                tipoItem
            } = req.body;


            const newProduct = await prisma.produtos.create( {
                data: {
                    valor_unitario,
                    aliquota_cofins,
                    aliquota_pis,
                    aliquota_ibpt,
                    aliquota_icms,
                    per_icms_fcp,
                    red_base_cofins,
                    red_base_icms,
                    red_base_pis,
                    tipoItem,
                    ncm: ncm === '' ? null : ncm,
                    dias_garantia,
                    marca,
                    ean,
                    codigo,
                    codigo_produto,
                    codigo_produto_integracao,
                    descricao,
                    unidade,
                    peso_bruto,
                    ageToBuy,
                    qtd,

                }
            } );

            return res.status( 201 ).json( newProduct );
        } catch ( error )
        {
            console.error( "Erro ao criar o produto:", error );
            return res.status( 500 ).json( { error: "Erro ao criar o produto" } );
        }
    },
    findOneProducts: async ( req: Request, res: Response ): Promise<any> =>
    {
        try
        {
            const { id } = req.params;

            const findOneProducts = await prisma.produtos.findUnique( {
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
    findOneProductsByBarcode: async ( req: Request, res: Response ): Promise<any> =>
    {
        try
        {
            const { ean } = req.params;
            console.log( ean )
            const findOneProducts = await prisma.produtos.findFirst( {
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
    findOneProductsByTagId: async ( req: Request, res: Response ): Promise<any> =>
    {
        try
        {
            const { tagId } = req.params;

            const findOneProducts = await prisma.produtos.findFirst( {
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
    findOneProductsByDatamatrixId: async ( req: Request, res: Response ): Promise<any> =>
    {
        try
        {
            const { datamatrixId } = req.params;

            const findOneProducts = await prisma.produtos.findFirst( {
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
    findAllProducts: async ( req: Request, res: Response ): Promise<any> =>
    {
        try
        {
            const findAllProducts = await prisma.produtos.findMany();

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
    destroyProducts: async ( req: Request, res: Response ): Promise<any> =>
    {
        try
        {
            const { id } = req.params;

            const destroyProducts = await prisma.produtos.delete( {
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