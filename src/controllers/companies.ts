import { Request, Response } from 'express'
import prisma from '../database/prisma-client'
import { z } from 'zod';
import { GenericError, NotFound, RegistrationCompletedError, ZodErrorMessage } from '../helpers/errors';
import { threadId } from 'worker_threads';

const createCompanySchema = z.object( {
    name: z.string(),
    cnpj: z.string(),
    ie: z.string(),
} )

type createCompanyType = z.infer<typeof createCompanySchema>
export const Companies = {
    CreateCompany: async ( req: Request, res: Response ): Promise<any> =>
    {
        let company: createCompanyType;
        try
        {
            company = createCompanySchema.parse( req.body )
        } catch ( error: any )
        {
            throw ZodErrorMessage( error )
        }
        try
        {
            await prisma.companies.create( {
                data: company
            } );

        } catch ( error )
        {
            throw RegistrationCompletedError( "Erro ao criar empresa" )
        }
        return res.status( 201 ).json( { message: "Empresa criada com sucesso!" } );
    },
    GetCompanyById: async ( req: Request, res: Response ): Promise<any> =>
    {
        try
        {
            const { id } = req.params as { id: string }

            const company = await prisma.companies.findUniqueOrThrow( {
                where: {
                    id: parseInt( id ),
                },
            } );

            if ( !company )
                throw NotFound( "empresa não encontrada!" )

            return res.status( 200 ).json( company )
        } catch ( error )
        {
            throw GenericError( "Erro ao buscar empresa" )
        }
    },
    FindAllCompanies: async ( req: Request, res: Response ): Promise<any> =>
    {

        let findAllCompanies: {
            name: string;
            cnpj: string;
            ie: string;
            id: number;
        }[]
        try
        {
            findAllCompanies = await prisma.companies.findMany();

            if ( !findAllCompanies )
            {
                throw NotFound( "Empresas não encontradas" )
            }
        } catch ( error )
        {
            throw GenericError( "Erro ao buscar empresas" )
        }
        return res.status( 200 ).json( findAllCompanies );
    },
    DestroyCompanies: async ( req: Request, res: Response ): Promise<any> =>
    {
        let destroyCompanies: {
            name: string;
            cnpj: string;
            ie: string;
            id: number;
        }
        try
        {
            const { id } = req.params as { id: string };
            destroyCompanies = await prisma.companies.delete( {
                where: {
                    id: parseInt( id ),
                },
            } );

            if ( !destroyCompanies )
                throw NotFound( "Empresa não encontrada!" )

        } catch ( error )
        {
            throw GenericError( "Erro ao deletar empresa" )
        }
        return res.status( 200 ).json( { message: "Empresa deletada com sucesso!" } );
    }
}