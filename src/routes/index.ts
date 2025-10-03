//this is a hub of all the routes being used with base endpoint (like auth)(so it becomes /auth/login)
import {Router} from "express"
import authRoutes from "./auth";

const RootRouter:Router = Router();

RootRouter.use('/auth', authRoutes)

export default RootRouter;