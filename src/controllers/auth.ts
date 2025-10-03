import {type Request, type Response} from "express" //imported by @types/express
import { prismaClient } from "..";
import {compareSync, hashSync} from "bcrypt"
import * as jwt from "jsonwebtoken"
import { JWT_SECRET } from "../secrets";


export const signUp = async (req:Request, res: Response) => {
    const {email, password, name} = req.body //in signUp we will be getting all the data in the body so we have to destructure the data first

    let user = await prismaClient.user.findFirst({
        where:{
            email
        }
    })
    if(user){
        throw Error("user already exists")
    }
    user = await prismaClient.user.create({
        data:{
            name,
            email,
            password: hashSync(password, 10) //10 -> salt round
        }
    })
    res.json(user)
}



//req:Request -> req of type Request
export const login = async (req:Request, res:Response) => {
    const {email, password} = req.body;

    let user = await prismaClient.user.findFirst({
        where:{
            email
        }
    })
    if(!user){
        throw Error("user does not exists!")
    }
    if(!compareSync(password, user.password)){
        throw Error("incorrect password")
    }
    const token = jwt.sign({
        userId: user.id
    }, JWT_SECRET)
    res.json({user, token})
}