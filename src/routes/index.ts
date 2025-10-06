//this is a hub of all the routes being used with base endpoint (like auth)(so it becomes /auth/login)
import {Router} from "express"
import authRoutes from "./auth";
import productRoutes from "./products";
import userRoutes from "./users";

const RootRouter:Router = Router();

RootRouter.use('/auth', authRoutes)
RootRouter.use('/products', productRoutes)
RootRouter.use('/users', userRoutes)

export default RootRouter;