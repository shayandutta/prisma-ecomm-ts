import { NextFunction, type Request, type Response } from "express"; //imported by @types/express
import { prismaClient } from "..";
import { compareSync, hashSync } from "bcrypt";
import * as jwt from "jsonwebtoken";
import { JWT_SECRET } from "../secrets";
import { BadRequestsException } from "../exceptions/bad-requests";
import { ErrorCodes } from "../exceptions/root";

export const signUp = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { email, password, name } = req.body; //in signUp we will be getting all the data in the body so we have to destructure the data first

  let user = await prismaClient.user.findFirst({
    where: {
      email,
    },
  });
  if (user) {
    return next(
      new BadRequestsException(
        "User already exists",
        ErrorCodes.USER_ALREADY_EXISTS
      )
    );
  }
  user = await prismaClient.user.create({
    data: {
      name,
      email,
      password: hashSync(password, 10), //10 -> salt round
    },
  });
  res.json(user);
};

//req:Request -> req of type Request
export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { email, password } = req.body;

  let user = await prismaClient.user.findFirst({
    where: {
      email,
    },
  });
  if (!user) {
    return next(
      new BadRequestsException("User not found", ErrorCodes.USER_NOT_FOUND)
    );
  }
  if (!compareSync(password, user.password)) {
    return next(new BadRequestsException(
        "incorrect password",
        ErrorCodes.INCORRECT_PASSWORD
    ))
  }
  //in order to generate a token, we need to sign a jwt with some payload
  //generally we provide the userId, for which user the token belongs(so userId -> user.id)
  //the second arguement is the JWT_SECRET
  const token = jwt.sign(
    {
      userId: user.id,
    },
    JWT_SECRET
  );
  res.json({ user, token });
};



//# Complete Flow Example

// Request: POST /api/auth/signup with existing email
// Controller: signUp finds existing user
// Error creation: next(new BadRequestsException("User already exists", ErrorCodes.USER_ALREADY_EXISTS))
// Express: passes the error to the error middleware
// Error middleware: formats and sends the response:
// {
//     "message": "User already exists",
//     "ErrorCodes": 1002,
//     "errors": null
//   }