import { Request, Response } from 'express'
import { z } from "zod";
import { RegistrationCompletedError, ZodErrorMessage } from "../../helpers/errors";
import prisma from "../../database/prisma-client";


const createCompanySchema = z.object( {
    id: z.number().optional(),
    name: z.string(),
    cnpj: z.string(),
    ie: z.string(),
    companyUUID: z.string()
} )

type createCompanyType = z.infer<typeof createCompanySchema>
export const RemoteCompany = {
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
            companyUUID: string | null;
            isSync: boolean;
        }
        try
        {
            companyCrated = await prisma.companies.upsert( {
                where: { companyUUID: company.companyUUID },
                update: company,
                create: {
                    name: company.name,
                    companyUUID: company.companyUUID,
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
    }
}