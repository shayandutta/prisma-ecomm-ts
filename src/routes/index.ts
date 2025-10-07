//this is a hub of all the routes being used with base endpoint (like auth)(so it becomes /auth/login)
import {Router} from "express"
import authRoutes from "./auth";
import productRoutes from "./products";
import userRoutes from "./users";
import cartRoutes from "./cart";
import orderRoutes from "./orders";

const RootRouter:Router = Router();

RootRouter.use('/auth', authRoutes)
RootRouter.use('/products', productRoutes)
RootRouter.use('/users', userRoutes)
RootRouter.use('/cart', cartRoutes)
RootRouter.use('/orders', orderRoutes)

export default RootRouter;




//ADMIN FUNCTIONALITY 
//1. user management
//      a. list users
//      b. get user by id
//      c. change user role

//2. order management
//      a. list all orders (filter by status)
//      b. change order status

//3. products
//      a. search api for products (for both users and admins) -> full text search