//this is a HOF, we dont need to write try catch blocks again and again now
import { NextFunction, Request, Response } from "express"
import { ErrorCodes, HttpException } from "./src/exceptions/root"
import { InternalException } from "./src/exceptions/internal-exception"

export const errorHandler = (method : Function) => { //its taking a method as a parameter and return a controller function
    return async (req : Request, res: Response, next: NextFunction) => {
        try{
            await method(req, res, next)
        }catch(error : any){
            let exception: HttpException;
            if(error instanceof HttpException){ //this means its an handled error(we have handled it)
                exception = error;
            }else{ //this means its an unhandled exception
                exception = new InternalException("Something went wrong", error, ErrorCodes.INTERNAL_EXCEPTION)
            }
            next(exception)
        }
    }
}