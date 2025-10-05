//to be reviewed
//req.user is not considered as a typescript type though we have explicitely defined the user as type of Request in express.d.ts



// import { NextFunction, Request, Response } from "express";
// import { UnauthorizedException } from "../exceptions/unauthorized";
// import { ErrorCodes } from "../exceptions/root";
// import * as jwt from "jsonwebtoken"; //import everything(*) from jsonwebtoken as jwt
// import { JWT_SECRET } from "../secrets";
// import { prismaClient } from "..";

// export const authMiddleware = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   //1. extract token from header

//   const token = req.headers.authorization; //sending the token in the authorization key of the header

//   //2. if token is not present, throw an error of unauthorized

//   if (!token) {
//     next(new UnauthorizedException("Unauthorized", ErrorCodes.UNAUTHORIZED));
//     return;
//   }

//   //3. if the token is present, verify that token and extract the payload

//   let payload: any;
//   try {
//     payload = jwt.verify(token, JWT_SECRET) as any;
//   } catch (error) {
//     next(new UnauthorizedException("Unauthorized", ErrorCodes.UNAUTHORIZED));
//     return;
//   }

//   //4. to get the use from the payload

//   const user = await prismaClient.user.findFirst({
//     where: {
//       id: payload.userId,
//     },
//   });
//   if (!user) {
//     next(new UnauthorizedException("Unauthorized", ErrorCodes.UNAUTHORIZED));
//     return; //since user can be null but req.user expect a non null user, so need a return as to stop the next execution
//   }

//   //5. to attach to user to the current request object
// //   req.user = user;
//   next(); //move to the next controller(me controller)
// };
