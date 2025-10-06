import { Router } from "express";
import { authMiddleware } from "../middlewares/auth";
import { errorHandler } from "../../error-handler";
import { addItemsToCart, changeQuantity, deleteItemFromCart, getCart } from "../controllers/cart";

const cartRoutes:Router = Router();

cartRoutes.post('/', [authMiddleware], errorHandler(addItemsToCart))
cartRoutes.get('/', [authMiddleware], errorHandler(getCart))
cartRoutes.delete('/:id', [authMiddleware], errorHandler(deleteItemFromCart))
cartRoutes.put('/:id', [authMiddleware], errorHandler(changeQuantity))

export default cartRoutes;