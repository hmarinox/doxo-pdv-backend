import { Request, Response } from 'express'
import prisma from '../database/prisma-client'
import { z } from 'zod';
import { NotFound, RegistrationCompletedError, ZodErrorMessage } from '../helpers/errors';

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



            const createdCompany = await prisma.companies.create( {
                data: company
            } );

            return res.status( 201 ).json( { message: "Empresa criada com sucesso!" } );
        } catch ( error )
        {
            console.error( "Erro ao criar o produto:", error );
            throw RegistrationCompletedError( "Erro ao criar o produto" )

        }
    },
    GetCompanyById: async ( req: Request, res: Response ): Promise<any> =>
    {
        try
        {
            const { id } = req.params as { id: string }

            const company = await prisma.companies.findUnique( {
                where: {
                    id: parseInt( id ),
                },
            } );

            if ( !company )
                throw NotFound( "usuário não encontrado" )

            return res.status( 200 ).json( company )
        } catch ( error )
        {
            console.error( "Erro ao buscar o produto:", error );
            return res.status( 500 ).json( { error: "Erro ao buscar o produto" } );
        }
    },
    FindAllCompanies: async ( req: Request, res: Response ): Promise<any> =>
    {
        try
        {
            const findAllCompanies = await prisma.companies.findMany();

            if ( findAllCompanies )
            {
                return res.status( 200 ).json( findAllCompanies );
            } else
            {
                return res.status( 404 ).json( { error: "Produto não encontrado" } );
            }
        } catch ( error )
        {
            console.error( "Erro ao buscar o produto:", error );
            return res.status( 500 ).json( { error: "Erro ao buscar o produto" } );
        }
    },
    DestroyCompanies: async ( req: Request, res: Response ): Promise<any> =>
    {
        try
        {
            const { id } = req.params;

            const destroyCompanies = await prisma.companies.delete( {
                where: {
                    id: parseInt( id ),
                },
            } );

            if ( destroyCompanies )
            {
                return res.status( 200 ).json( destroyCompanies );
            } else
            {
                return res.status( 404 ).json( { error: "Produto não deletado" } );
            }
        } catch ( error )
        {
            console.error( "Erro ao deletar o produto:", error );
            return res.status( 500 ).json( { error: "Erro ao deletar o produto" } );
        }
    }
}