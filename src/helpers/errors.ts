import { IApiError } from "../interfaces/IApiError";


function ApiError( message: string, statusCode?: number ): IApiError
{
    let error = new Error( message ) as IApiError;
    error.statusCode = statusCode;
    return error
}

export function GenericError( message: string )
{
    return ApiError( message, 500 )
}

export function NotFound( message: string )
{
    return ApiError( message, 404 )
}
export function UserLogginError( message: string )
{
    return ApiError( message, 401 )
}

export function ZodErrorMessage( message: string )
{
    return ApiError( message )
}
export function RegistrationCompletedError( message: string )
{
    return ApiError( message, 409 )
}