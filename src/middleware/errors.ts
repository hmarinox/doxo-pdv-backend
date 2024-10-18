import { NextFunction, Request, Response } from "express";
import { IApiError } from "../interfaces/IApiError";
export function Errors( error: IApiError, req: Request, res: Response, next: NextFunction )
{
    const statusCode = error.statusCode ?? 500;
    const message = error.message ?? "Internal Server Error";
    res.status( statusCode ).json( { message } );

}