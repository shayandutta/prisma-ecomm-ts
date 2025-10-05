import { HttpException } from "./root";

export class UnauthorizedException extends HttpException{
    constructor (message : string, errorCodes: number, errors?: any){
        super(message, errorCodes, 401, errors)
    }
}