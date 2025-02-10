import fetch from "node-fetch";
import { ReqeustOmieType } from "./RequestOmietype";

type ProductType = {
    aliquota_cofins: number;
    aliquota_ibpt: number;
    aliquota_icms: number;
    aliquota_pis: number;
    altura: number;
    bloqueado: string;
    bloquear_exclusao: string;
    cest: string;
    cfop: string;
    codInt_familia: string;
    codigo: string;
    codigo_beneficio: string;
    codigo_familia: number;
    codigo_produto: number;
    codigo_produto_integracao: string;
    csosn_icms: string;
    cst_cofins: string;
    cst_icms: string;
    cst_pis: string;
    descr_detalhada: string;
    descricao: string;
    descricao_familia: string;
    dias_crossdocking: number;
    dias_garantia: number;
    ean: string;
    estoque_minimo: number;
    exibir_descricao_nfe: string;
    exibir_descricao_pedido: string;
    importado_api: string;
    inativo: string;
    info: any,
    largura: number;
    lead_time: number;
    marca: string;
    modelo: string;
    motivo_deson_icms: string;
    ncm: string;
    obs_internas: string;
    per_icms_fcp: number;
    peso_bruto: number;
    peso_liq: number;
    profundidade: number;
    quantidade_estoque: number;
    recomendacoes_fiscais: any;
    red_base_cofins: number;
    red_base_icms: number;
    red_base_pis: number;
    tipoItem: string;
    unidade: string;
    valor_unitario: number;
}

type FindAllProductsOmieType =
    {
        pagina: number;
        total_de_paginas: number;
        registros: number;
        total_de_registros: number;
        produto_servico_cadastro: ProductType[]

    }
const consumeOmie = async ( call: string, param: ReqeustOmieType[], path: string, appKey: string, appSecret: string ) =>
{
    try
    {


        const url = `${ process.env.OMIE_API_URL }${ path }`;

        const newRequest = {
            call,
            app_key: appKey,
            app_secret: appSecret,
            param,
        };

        const omieApiResponse = await fetch( url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify( newRequest ),
        } );

        if ( omieApiResponse.ok )
        {
            const omieData = await omieApiResponse.json();
            return omieData as FindAllProductsOmieType
        }
    } catch
    {
        return null
    }
};

export default consumeOmie;
