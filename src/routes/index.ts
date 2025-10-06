//this is a hub of all the routes being used with base endpoint (like auth)(so it becomes /auth/login)
import {Router} from "express"
import authRoutes from "./auth";
import productRoutes from "./products";
import userRoutes from "./users";
import cartRoutes from "./cart";

const RootRouter:Router = Router();

RootRouter.use('/auth', authRoutes)
RootRouter.use('/products', productRoutes)
RootRouter.use('/users', userRoutes)
RootRouter.use('/cart', cartRoutes)

export default RootRouter;