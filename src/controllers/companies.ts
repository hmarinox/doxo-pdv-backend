import { Request, Response } from 'express'
import prisma from '../database/prisma-client'
import { z } from 'zod';
import { GenericError, NotFound, RegistrationCompletedError, ZodErrorMessage } from '../helpers/errors';


const createCompanySchema = z.object( {
    id: z.number().optional(),
    name: z.string(),
    cnpj: z.string(),
    ie: z.string(),
} )
const createSettingsCompanySchema = z.object( {
    id: z.number().optional(),
    companyId: z.number(),
    migrateAccessKey: z.string(),
    migratePartnerKey: z.string(),
    clisitefRegisterToken: z.string(),
    clisitefPort: z.string(),
    clisitefDefaultMessage: z.string(),
    clisitefEnabledTransactions: z.string(),
    omieAppKey: z.string(),
    omieAppSecret: z.string(),

} )
type createSettingsCompanyType = z.infer<typeof createSettingsCompanySchema>

type createCompanyType = z.infer<typeof createCompanySchema>
export const Companies = {
    CreateOrUpdate: async ( req: Request, res: Response ): Promise<any> =>
    {
        /*
               #swagger.responses[201] = { 
                    description: "Created",
                      content: {
                        "application/json": {
                            example:{
                                message:  "Empresa criada com sucesso!"
                            }
                        }
                    }
               }
               #swagger.responses[409] = { 
                    description: "Registration Error",
                   content: {
                        "application/json": {
                            example:{
                                message: "Erro ao criar empresa"
                            }
                        }
                    }
               }
               #swagger.responses[500] = { 
                    description:  "Schema validation error",
                    content: {
                        "application/json": {
                            example:{
                                message: "string"
                            }
                        }
                    }
               }
                #swagger.requestBody = {
                  required: true,
                  content: {
                      "application/json": {
                          example: {
                            name: "string",
                            cnpj: "string",
                            ie: "string",
                          }
                      }
                  }
              }
          */
        let company: createCompanyType;
        try
        {
            company = createCompanySchema.parse( req.body )
        } catch ( error: any )
        {
            throw ZodErrorMessage( error )
        }
        console.log( "compnay = ", company )
        let companyCrated: {
            id: number;
            name: string;
            cnpj: string;
            ie: string;
            isSync: boolean;
        }
        try
        {
            companyCrated = await prisma.companies.upsert( {
                where: { id: company.id },
                update: company,
                create: {
                    name: company.name,
                    cnpj: company.cnpj.replace( /[^a-zA-Z0-9]/g, "" ),
                    ie: company.ie
                }
            } );

        } catch ( error )
        {
            console.log( error )
            throw RegistrationCompletedError( "Erro ao criar empresa" )
        }
        return res.status( 201 ).json( { message: company.id ? "Empresa atualizada com sucesso!" : "Empresa criada com sucesso!", company: companyCrated } );
    },
    FindById: async ( req: Request, res: Response ): Promise<any> =>
    {
        try
        {
            const { id } = req.params as { id: string }

            const company = await prisma.companies.findUniqueOrThrow( {
                where: {
                    id: parseInt( id ),
                },
                select: {
                    id: true,
                    name: true,
                    cnpj: true,
                    ie: true,
                    isSync: true,
                    companyUUID: true,
                    Settings: {
                        select: {
                            id: true,
                            migrateAccessKey: true,
                            migratePartnerKey: true,
                            omieAppKey: true,
                            omieAppSecret: true,
                            clisitefDefaultMessage: true,
                            clisitefEnabledTransactions: true,
                            clisitefPort: true,
                            clisitefRegisterToken: true
                        }
                    }
                }
            } );

            if ( !company )
                throw NotFound( "empresa não encontrada!" )

            return res.status( 200 ).json( company )
        } catch ( error )
        {
            throw GenericError( "Erro ao buscar empresa" )
        }
    },
    FindAll: async ( req: Request, res: Response ): Promise<any> =>
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
    Delete: async ( req: Request, res: Response ): Promise<any> =>
    {
        let deleteCompany: {
            name: string;
            cnpj: string;
            ie: string;
            id: number;
        }
        try
        {
            const { id } = req.params as { id: string };
            deleteCompany = await prisma.companies.delete( {
                where: {
                    id: parseInt( id ),
                },
            } );

            if ( !deleteCompany )
                throw NotFound( "Empresa não encontrada!" )

        } catch ( error )
        {
            throw GenericError( "Erro ao deletar empresa" )
        }
        return res.status( 200 ).json( { message: "Empresa deletada com sucesso!" } );
    },
    CreateSettings: async ( req: Request, res: Response ): Promise<any> =>
    {
        console.log( "hjbdjhbjhbd = ", req.body )
        let settingsCreate: createSettingsCompanyType;
        try
        {
            settingsCreate = createSettingsCompanySchema.parse( req.body )
        } catch ( error: any ) 
        {
            console.log( error )
            throw ZodErrorMessage( error )
        }

        const settings = await prisma.settings.upsert( {
            where: { id: settingsCreate.id },
            update: settingsCreate,
            create: {
                migrateAccessKey: settingsCreate.migrateAccessKey,
                migratePartnerKey: settingsCreate.migratePartnerKey,
                clisitefRegisterToken: settingsCreate.clisitefRegisterToken,
                clisitefPort: settingsCreate.clisitefPort,
                clisitefDefaultMessage: settingsCreate.clisitefDefaultMessage,

                clisitefEnabledTransactions: settingsCreate.clisitefEnabledTransactions,
                omieAppKey: settingsCreate.omieAppKey,
                omieAppSecret: settingsCreate.omieAppSecret,
                companyId: settingsCreate.companyId
            }
        } )


        return res.status( 201 ).json( {
            message: settings.id ? "Configurações da empresa atualizada com sucesso!" : "Configurações da empresa  criada com sucesso!"
        } );
    },
    GetSettings: async ( req: Request, res: Response ): Promise<any> =>
    {
        try
        {
            const { id } = req.params as { id: string }

            const settings = await prisma.settings.findUniqueOrThrow( {
                where: {
                    id: parseInt( id ),
                },
            } );

            if ( !settings )
                throw NotFound( "Configurações não encontradas!" )

            return res.status( 200 ).json( settings )
        } catch ( error )
        {
            throw GenericError( "Erro ao buscar Configurações" )
        }
    }
}