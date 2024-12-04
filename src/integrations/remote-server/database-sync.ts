import { promise } from "zod";
import prisma from "../../database/prisma-client"
import env from "../../zod-validation-env";
const remoteUrl = env.REMOTE_API_URL

async function pushSales()
{
    console.log( "sync" )
    const companies = await prisma.companies.findMany( { where: { isSync: false } } )
    console.log( companies )

    if ( companies.length !== 0 )
    {
        console.log( "sync company" )
        const companiesQueue = companies.map( company => fetch( `${ remoteUrl }/remote-sync/companies`, {
            method: "POST",
            headers: {
                "Content-type": "application/json"
            },
            body: JSON.stringify( company )
        } ) )
        const result = await Promise.all( companiesQueue )
        result.forEach( async ( res ) =>
        {
            const data = await res.json();
            console.log( "companies res = ", data )
            if ( !res.ok )
                return
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
    const stores = await prisma.stores.findMany( {
        where: { isSync: false }, select: {
            id: true,
            storeUUID: true,
            name: true,
            street: true,
            emitModel: true,
            neighborhood: true,
            number: true,
            country: true,
            state: true,
            city: true,
            zipCode: true,
            complement: true,
            ufCode: true,
            cityCode: true,
            Company: true
        }
    } )
    if ( stores.length !== 0 )
    {

        const storesQueue = stores.map( store => fetch( `${ remoteUrl }/remote-sync/stores`, {
            method: "POST",
            headers: {
                "Content-type": "application/json"
            },
            body: JSON.stringify( store )
        } ) )
        console.log( storesQueue )
        const result = await Promise.all( storesQueue )
        result.forEach( async ( res ) =>
        {
            const data = await res.json();
            console.log( "data= ", data )
            if ( !res.ok )
                return
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
    const pdvs = await prisma.pdv.findMany( {
        where: { isSync: false },
        select: {
            id: true,
            name: true,
            isSync: true,
            pdvUUID: true,
            storeId: true,
            macAddress: true,
            taxReceiptSerie: true,
            Store: {
                select: {
                    storeUUID: true
                }
            }
        }
    } )
    if ( pdvs.length !== 0 )
    {

        const pdvQueue = pdvs.map( pdv => fetch( `${ remoteUrl }/remote-sync/pdv`, {
            method: "POST",
            headers: {
                "Content-type": "application/json"
            },
            body: JSON.stringify( pdv )
        } ) )
        const result = await Promise.all( pdvQueue )
        result.forEach( async ( res ) =>
        {
            const data = await res.json();
            console.log( "data= ", data )
            if ( !res.ok )
                return

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
            Pdv: { select: { pdvUUID: true } },
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
    console.log( "salesNotSync = ", salesNotSync )
    const queue = salesNotSync.map( ( sale ) => fetch( `${ remoteUrl }/remote-sync/sale`, {
        method: "POST",
        headers: {
            "Content-type": "application/json"
        },
        body: JSON.stringify( sale )
    } ) )
    const result = await Promise.all( queue )

    const updateSaleQueue = result.map( async ( res ) => 
    {
        const data = await res.json();
        console.log( "data = ", data )
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