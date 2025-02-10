import { Request, Response } from 'express';
import prisma from '../database/prisma-client';
import { z } from 'zod';
import { GenericError, NotFound, RegistrationCompletedError, ZodErrorMessage } from '../helpers/errors';
import bcrypt from 'bcrypt'

const createEmployeeSchema = z.object( {
    id: z.number().optional().default( 0 ),
    name: z.string(),
    storeId: z.number(),
    email: z.string(),
    password: z.string(),
    registrationCode: z.string(),
    level: z.union( [
        z.literal( 'MANAGER' ),
        z.literal( 'COLLABORATOR' )
            .default( `COLLABORATOR` ),
    ] )
} )
const createSettingsemployeeSchema = z.object( {
    id: z.number().optional().default( 0 ),
    employeeId: z.number(),
    migrateAccessKey: z.string(),
    migratePartnerKey: z.string(),
    clisitefRegisterToken: z.string(),
    clisitefPort: z.string(),
    clisitefDefaultMessage: z.string(),
    clisitefEnabledTransactions: z.string(),
    omieAppKey: z.string(),
    omieAppSecret: z.string(),

} )
type createSettingsemployeeType = z.infer<typeof createSettingsemployeeSchema>

type createemployeeType = z.infer<typeof createEmployeeSchema>
export const Employees = {
    CreateOrUpdate: async ( req: Request, res: Response ): Promise<any> =>
    {
        /*
              
          */
        let employee;
        try
        {
            employee = createEmployeeSchema.parse( req.body )
        } catch ( error: any )
        {
            throw ZodErrorMessage( error )
        }

        let employeeCrated: createemployeeType
        try
        {
            const salt = await bcrypt.genSalt( 10 )


            const hash = await bcrypt.hash( employee.password, salt )
            employeeCrated = await prisma.employees.upsert( {
                where: { id: employee.id },
                update: employee,
                create: {
                    name: employee.name,
                    email: employee.email,
                    storeId: employee.storeId,
                    password: hash,
                    registrationCode: employee.registrationCode,
                    level: employee.level
                }
            } );
        } catch ( error )
        {
            console.log( error )
            throw RegistrationCompletedError( "Erro ao criar colaborador" )
        }
        return res.status( 201 ).json( {
            message: employee.id ? "Colaboradot atualizado com sucesso!" : "Colaborador criado com sucesso!", employee: {
                name: employeeCrated.name,
                email: employeeCrated.email,
                level: employeeCrated.level,
                registrationCode: employeeCrated.registrationCode
            }
        } );
    },
    FindById: async ( req: Request, res: Response ): Promise<any> =>
    {
        try
        {
            const { id } = req.params as { id: string }

            const employee = await prisma.employees.findUniqueOrThrow( {
                where: {
                    id: parseInt( id ),
                },
                select: {
                    id: true,
                    name: true,
                    email: true,
                    level: true,
                }
            } );

            if ( !employee )
                throw NotFound( "Colaborador não encontrado!" )

            return res.status( 200 ).json( employee )
        } catch ( error )
        {
            throw GenericError( "Erro ao buscar colaborador" )
        }
    },
    FindBybarcode: async ( req: Request, res: Response ): Promise<any> =>
    {
        try
        {
            const { id } = req.params as { id: string }

            const employee = await prisma.employees.findFirst( {
                where: {
                    registrationCode: id,
                },
                select: {
                    id: true,
                    name: true,
                    email: true,
                    level: true,
                }
            } );

            if ( !employee )
                throw NotFound( "Colaborador não encontrado!" )

            return res.status( 200 ).json( employee )
        } catch ( error )
        {
            throw GenericError( "Erro ao buscar colaborador" )
        }
    },
    FindAll: async ( req: Request, res: Response ): Promise<any> =>
    {

        let findAllemployees: {
            id: number;
            name: string;
            storeId: number;
            email: string;

            registrationCode: string;
            level: "MANAGER" | "COLLABORATOR";
        }[]
        try
        {
            findAllemployees = await prisma.employees.findMany( {
                select: {
                    id: true,
                    name: true,
                    email: true,
                    storeId: true,
                    level: true,
                    registrationCode: true
                }
            } );

            if ( !findAllemployees )
            {
                throw NotFound( "Colaboradores não encontrados" )
            }
        } catch ( error )
        {
            throw GenericError( "Erro ao buscar Colaboradores" )
        }
        return res.status( 200 ).json( findAllemployees );
    },
    Delete: async ( req: Request, res: Response ): Promise<any> =>
    {

        try
        {
            const { id } = req.params as { id: string };
            const deleteEmployee = await prisma.employees.delete( {
                where: {
                    id: parseInt( id ),
                },
            } );

            if ( !deleteEmployee )
                throw NotFound( "Colaborador não encontrado!" )

        } catch ( error )
        {
            throw GenericError( "Erro ao deletar colaborador" )
        }
        return res.status( 200 ).json( { message: "Colaborador deletada com sucesso!" } );
    },


}