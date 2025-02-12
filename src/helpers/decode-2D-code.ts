import dayjs from "dayjs"
import customParseFormat from "dayjs/plugin/customParseFormat"
dayjs.extend( customParseFormat )

const GS1_SEPARATOR = "\u001D"
type GS1BarcodeType = {
    GTIN: string;
    validity?: string;
    price?: number;
    batch?: string;
    weight?: number;
    SSCC?: string
}
function adjustBarcode( barcode: string ): string
{
    barcode = barcode.replace( /\_/g, GS1_SEPARATOR )
    barcode = barcode.replace( /\*/g, GS1_SEPARATOR )
    barcode = barcode.replace( /\|/g, GS1_SEPARATOR )
    barcode = barcode.replace( /\}/g, GS1_SEPARATOR )
    barcode = barcode.replace( /\{/g, GS1_SEPARATOR )
    barcode = barcode.replace( /\`/g, GS1_SEPARATOR )
    return barcode
}
function removeLeadingZeros( str: string )
{
    return str.replace( /^0+/, "" ); // Remove todos os zeros do início
}
function parseGS1Barcode( barcode: string ): GS1BarcodeType
{
    barcode = adjustBarcode( barcode )
    const aiPatterns: any = {
        "01": { length: 14, label: "GTIN" },
        "17": { length: 6, label: "validity" },
        "10": { length: "var", label: "batch" },
        "00": { length: 18, label: "SSCC" },
        "310": { length: 6, label: "weight", decimal: true },
        "392": { length: "var", label: "price", decimal: true }
    };
    let result: any = {};
    let i = 0;
    while ( i < barcode.length )
    {
        let ai = barcode.substring( i, i + 2 );
        if ( ai === "31" || ai === "39" )
            ai = barcode.substring( i, i + 4 );
        let info = aiPatterns[ai.substring( 0, 3 )];
        if ( !info )
        {
            i++;
            continue;
        }
        let length = info.length;
        let value = "";
        if ( length === "var" )
        {
            let endIndex = barcode.indexOf( GS1_SEPARATOR, i + ai.length );
            if ( endIndex === -1 ) endIndex = barcode.length;
            value = barcode.substring( i + ai.length, endIndex );
            i = endIndex;
        } else
        {
            value = barcode.substring( i + ai.length, i + ai.length + length );
            i += ai.length + length;
        }
        if ( info.decimal )
        {
            let decimalPlaces = parseInt( ai[3] );
            const result1 = value
            let numericValue = parseFloat( result1 ) / Math.pow( 10, decimalPlaces );
            result[info.label] = numericValue;
        } else
        {
            result[info.label] = value;
            if ( info.label === aiPatterns["17"].label )
                result[info.label] = dayjs( value, "YYMMDD" ).format( "DD/MM/YY" );
            if ( info.label === aiPatterns["01"].label )
                result[info.label] = removeLeadingZeros( value )
        }
    }
    return result;
}
export default parseGS1Barcode 