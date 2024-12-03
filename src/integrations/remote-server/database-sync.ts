import { promise } from "zod";
import prisma from "../../database/prisma-client"
import env from "../../zod-validation-env";
const remoteUrl = env.REMOTE_API_URL

async function pushSales()
{
    const companies = await prisma.companies.findMany( { where: { isSync: false } } )
    if ( companies.length !== 0 )
    {
        const companiesQueue = companies.map( company => fetch( `${ remoteUrl }/companies`, {
            method: "POST",
            body: JSON.stringify( company )
        } ) )
        const result = await Promise.all( companiesQueue )
        result.forEach( async ( res ) =>
        {
            if ( !res.ok )
                return
            const data = await res.json();
            await prisma.companies.update( {
                where: {
                    cnpj: data.company.cnpj
                },
                data: {
                    isSync: true
                }
            } )
        } );
    }
    const stores = await prisma.stores.findMany( { where: { isSync: false } } )
    if ( stores.length !== 0 )
    {
        const storesQueue = companies.map( store => fetch( `${ remoteUrl }/stores`, {
            method: "POST",
            body: JSON.stringify( store )
        } ) )
        const result = await Promise.all( storesQueue )
        result.forEach( async ( res ) =>
        {
            if ( !res.ok )
                return
            const data = await res.json();
            await prisma.stores.update( {
                where: {
                    storeUUID: data.store.storeUUID
                },
                data: {
                    isSync: true
                }
            } )
        } );
    }
    const pdv = await prisma.pdv.findMany( { where: { isSync: false } } )
    if ( pdv.length !== 0 )
    {
        const pdvQueue = companies.map( pdv => fetch( `${ remoteUrl }/stores`, {
            method: "POST",
            body: JSON.stringify( pdv )
        } ) )
        const result = await Promise.all( pdvQueue )
        result.forEach( async ( res ) =>
        {
            if ( !res.ok )
                return
            const data = await res.json();
            await prisma.pdv.update( {
                where: {
                    macAddress: data.pdv.macAddress
                },
                data: {
                    isSync: true
                }
            } )
        } );
    }

    const salesNotSync = await prisma.sales.findMany( {
        where: {
            isSync: false
        },
        select: {
            saleUUID: true,
            Pdv: true,
            SalesProducts: {
                select: {
                    products: true,
                    createdAt: true
                }
            },
            TaxReceipt: {
                select: {
                    taxReceiptEmitDate: true,
                    taxReceiptNumber: true,
                    taxReceiptSerie: true,
                    taxReceiptKey: true,
                    TaxReceiptXML: {
                        select: {
                            MigrateResult: true
                        }
                    }
                }
            }
        }
    } )
    if ( salesNotSync.length === 0 )
        return;
    const queue = salesNotSync.map( ( sale ) => fetch( `${ remoteUrl }/sale/remote-sync`, {
        method: "POST",
        body: JSON.stringify( sale )
    } ) )
    const result = await Promise.all( queue )

    const updateSaleQueue = result.map( async ( res ) => 
    {
        const data = await res.json();
        if ( res.status === 201 )
            return prisma.sales.update( {
                where: {
                    saleUUID: data.saleUUID
                },
                data: {
                    isSync: true
                }
            } )
    } )

    await Promise.all( updateSaleQueue )

}



export const RemoteServerSync = { pushSales }