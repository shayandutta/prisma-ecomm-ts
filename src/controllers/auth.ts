import { type Request, type Response } from "express";
import { prismaClient } from "..";
import { compareSync, hashSync } from "bcrypt";
import * as jwt from "jsonwebtoken";
import { JWT_SECRET } from "../secrets";
import { BadRequestsException } from "../exceptions/bad-requests";
import { ErrorCodes } from "../exceptions/root";
import { SignupSchema } from "../schema/users";
import { NotFoundException } from "../exceptions/not-found";
import { UnauthorizedException } from "../exceptions/unauthorized";

export const signUp = async (req: Request, res: Response) => {
  SignupSchema.parse(req.body);
  const { email, password, name } = req.body;

  let user = await prismaClient.user.findFirst({
    where: {
      email,
    },
  });
  if (user) {
    throw new BadRequestsException(
      "User already exists!",
      ErrorCodes.USER_ALREADY_EXISTS
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
export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  let user = await prismaClient.user.findFirst({
    where: {
      email,
    },
  });
  if (!user) {
    throw new NotFoundException("user not found", ErrorCodes.USER_NOT_FOUND);
  }
  if (!compareSync(password, user.password)) {
    throw new BadRequestsException(
      "incorrect password",
      ErrorCodes.INCORRECT_PASSWORD
    );
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

//me -> return the logged in user (logged in user will be based on the auth token, will send by headers)  -> authMiddleware
//me controller
export const me = async (req: Request, res: Response) => {
  const user = req.user
  res.json(user); //in authMiddleware we have assigned the user to the req object so in the me api we can directly use the req.user
};

