import consumeOmie from ".";
import prisma from "../../../database/prisma-client";
import dayjs from "dayjs";
import { NotFound } from "../../../helpers/errors";
const getAllProductsOmieAndSyncWithDB = async () =>
{
    console.log( "getAllProductsOmieAndSyncWithDB  data = ", dayjs().format( "DD/MM/YY - HH:mm:ss" ) )
    try
    {
        const callExample = "ListarProdutos";
        const paramExample = [
            {
                pagina: 1,
                registros_por_pagina: 50,
                apenas_importado_api: "N",
                filtrar_apenas_omiepdv: "N",
                inativo: "N",
            },
        ];
        const path = "/geral/produtos/";

        const findAllProducts = await prisma.products.findMany();
        const company = await prisma.companies.findFirst( {
            select: {
                Settings: true
            }
        } )
        if ( !company )
        {
            throw NotFound( "Empresa não encontrada" )
        }

        const finAllProductsOmie = await consumeOmie(
            callExample,
            paramExample,
            path,
            company?.Settings[0].omieAppKey,
            company?.Settings[0].omieAppSecret,

        );

        if ( !finAllProductsOmie )
        {
            throw new Error()
        }


        if ( findAllProducts && finAllProductsOmie )
        {
            const newArrayDB = [...findAllProducts];
            const newArrayOmie = finAllProductsOmie.produto_servico_cadastro;

            for ( const omieProduct of newArrayOmie )
            {
                const existingProductIndex = newArrayDB.findIndex(
                    ( dbProduct ) => dbProduct.codigo === omieProduct.codigo
                );

                if ( existingProductIndex === -1 )
                {
                    await prisma.products.create( {
                        data:
                        {
                            valor_unitario: omieProduct.valor_unitario,
                            aliquota_cofins: omieProduct.aliquota_cofins,
                            aliquota_pis: omieProduct.aliquota_pis,
                            aliquota_ibpt: omieProduct.aliquota_ibpt,
                            codigo_produto: omieProduct.codigo_produto,
                            aliquota_icms: omieProduct.aliquota_icms,
                            per_icms_fcp: omieProduct.per_icms_fcp,
                            red_base_cofins: omieProduct.red_base_cofins,
                            red_base_icms: omieProduct.red_base_icms,
                            red_base_pis: omieProduct.red_base_pis,
                            tipoItem: omieProduct.tipoItem,
                            ncm: omieProduct.ncm,
                            dias_garantia: omieProduct.dias_garantia,
                            marca: omieProduct.marca,
                            ean: omieProduct.ean,
                            codigo: omieProduct.codigo,
                            codigo_produto_integracao: omieProduct.codigo_produto_integracao,
                            descricao: omieProduct.descricao,
                            unidade: omieProduct.unidade,
                            peso_bruto: omieProduct.peso_bruto,
                            qtd: omieProduct.quantidade_estoque,
                        }
                    } );
                } else
                {
                    const existingProduct = newArrayDB[existingProductIndex];

                    if ( !isEqual( existingProduct, omieProduct ) )
                    {
                        await prisma.products.update( {
                            where: {
                                codigo_produto: omieProduct.codigo_produto
                            },
                            data: {
                                valor_unitario: omieProduct.valor_unitario,
                                aliquota_cofins: omieProduct.aliquota_cofins,
                                aliquota_pis: omieProduct.aliquota_pis,
                                aliquota_ibpt: omieProduct.aliquota_ibpt,
                                aliquota_icms: omieProduct.aliquota_icms,
                                per_icms_fcp: omieProduct.per_icms_fcp,
                                red_base_cofins: omieProduct.red_base_cofins,
                                red_base_icms: omieProduct.red_base_icms,
                                red_base_pis: omieProduct.red_base_pis,
                                tipoItem: omieProduct.tipoItem,
                                ncm: omieProduct.ncm,
                                dias_garantia: omieProduct.dias_garantia,
                                marca: omieProduct.marca,
                                ean: omieProduct.ean,
                                codigo: omieProduct.codigo,
                                codigo_produto_integracao: omieProduct.codigo_produto_integracao,
                                descricao: omieProduct.descricao,
                                unidade: omieProduct.unidade,
                                peso_bruto: omieProduct.peso_bruto,
                                qtd: omieProduct.quantidade_estoque,
                            }
                        } );
                    }

                    newArrayDB.splice( existingProductIndex, 1 );
                }
            }
        } else
        {
            console.error( "Erro ao buscar os produtos na Omie ou DB" );
        }
    } catch ( error )
    {
        console.error( "Erro ao buscar o produto:", error );
    }
};

const isEqual = ( obj1: any, obj2: any ) =>
{
    const keys1 = Object.keys( obj1 );
    const keys2 = Object.keys( obj2 );

    // if ( keys1.length !== keys2.length )
    // {
    //     return false;
    // }

    for ( const key of keys1 )
    {
        if ( obj1[key] !== obj2[key] )
        {
            return false;
        }
    }

    return true;
};

export default getAllProductsOmieAndSyncWithDB;
