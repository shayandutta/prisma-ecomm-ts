import {type Request, type Response} from "express" //imported by @types/express

//req:Request -> req of type Request
export const login = (req:Request, res:Response) => {
    res.send("login works")
}