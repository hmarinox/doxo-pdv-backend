import * as  xml2js from 'xml2js'


async function xmlMigrate( xmlMigrate: string ): Promise<any>
{
    return new Promise( async ( resolve ) =>
    {
        let res = null;
        try
        {
            res = await xml2js.parseStringPromise( xmlMigrate )
        } catch
        {

        }
        resolve( res )
    } )
}
async function xmlSefaz( xmlSefaz: string ): Promise<any>
{
    return new Promise( async ( resolve ) =>
    {
        let res = null;
        try
        {
            res = await xml2js.parseStringPromise( xmlSefaz )
        }
        catch
        {

        }
        resolve( res )
    } )
}
async function xmlNFe( xmlNFe: string ): Promise<any>
{
    const docNFe = atob( xmlNFe )
    return new Promise( async ( resolve ) =>
    {
        let res = null;
        try
        {
            res = await xml2js.parseStringPromise( docNFe )
        } catch
        {

        }
        resolve( res )
    } )
}



export const XmlService = {
    xmlMigrate,
    xmlSefaz,
    xmlNFe
} 