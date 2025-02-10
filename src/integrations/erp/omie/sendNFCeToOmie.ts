const fetch = require( "node-fetch" )
import prisma from "../../../database/prisma-client";
import { XmlService } from "../../../helpers/converter-xml";
import * as crypto from "crypto"
type RequestImportNFCeType = {
    emiNome: string,
    emiVersao: string,
    emiId: string,
    chNFe: string;
    nfceXml: string;
    nfceMd5: string;
    cAcaoCliente: string,
    idCliente?: number,
    idVendedor?: number,
    idProjeto?: number,
    idLocalEstoque?: number,
    cNaoMovEstoque: "S" | "N",
    cNaoGerarTitulo: "S" | "N",
    cIncluirProduto: "S" | "N",
}
function Md5HashGenerator( xml: any ): string
{
    return crypto.createHash( 'md5' ).update( xml ).digest( 'hex' );
}
function replaceEspecialCharacters( xml: any )
{
    return xml
        .replace( /&/g, "&amp;" )
        .replace( /</g, "&lt;" )
        .replace( />/g, "&gt;" )
        .replace( /'/g, "&apos;" )
        .replace( /"/g, "&quot;" )
        .replace( /\|/g, "&#124;" )
        .replace( /\\/g, "" );
}
const sendNFCe = async ( chNFe: string, nfceXml: any, emiNome: string,
    emiVersao: string,
    emiId: string ) =>
{
    try
    {
        const company = await prisma.companies.findFirst( {
            select: {
                Settings: true
            }
        } )
        if ( !company )
        {
            return
        }
        const soapEnvelope = nfceXml["SOAP-ENV:Envelope"]
        const soapBody = soapEnvelope["SOAP-ENV:Body"];
        const recepcao = soapBody[0]["recepcao.ExecuteResponse"];
        const sefazResult = await XmlService.xmlSefaz( recepcao[0].Invoicyretorno[0].Mensagem[0].MensagemItem[0].Documentos[0].DocumentosItem[0].Documento[0] )
        const xml = replaceEspecialCharacters( sefazResult )
        const param: RequestImportNFCeType[] = [{
            emiNome,
            emiVersao,
            emiId,
            chNFe: chNFe,
            nfceXml: xml,
            nfceMd5: Md5HashGenerator( xml ),
            cAcaoCliente: "INCLUIR",
            cNaoMovEstoque: 'N',
            cNaoGerarTitulo: 'N',
            cIncluirProduto: 'S'
        }]
        const path = "/produtos/nfce"
        const url = `${ process.env.OMIE_API_URL }${ path }`;

        const newRequest = {
            call: "ImportarNFCe",
            app_key: company.Settings[0].omieAppKey,
            app_secret: company.Settings[0].omieAppSecret,
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
            return { status: 200 }
        }
    } catch
    {
        return null
    }
};


export default sendNFCe;
