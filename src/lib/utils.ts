function removeLeadingZeros( str: string )
{
    return str.replace( /^0+/, "" ); // Remove todos os zeros do início
}

const Utils = { removeLeadingZeros }
export default Utils