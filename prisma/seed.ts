import { PrismaClient } from '@prisma/client';


const prisma = new PrismaClient();
import bcrypt from 'bcrypt'

const MASTER_PASSWORD = process.env.MASTER_PASSWORD || "abcd1234"

async function dbSeed()
{
    console.log( "seed-finction.js" )
    const admin = await prisma.users.findFirst(
        {
            where: {
                email: "doxo@gmail.com",
            }
        }
    )
    if ( admin )
        return;

    const salt = await bcrypt.genSalt( 10 )
    console.log( "aLT" )
    const hash = await bcrypt.hash( MASTER_PASSWORD, salt )
    const masterUser = await prisma.users.create( {
        data: {
            name: "doxo tech",
            email: "doxo@gmail.com",
            password: hash,
            level: "ADMIN"
        }
    } )



}
dbSeed()