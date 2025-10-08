import { Router } from "express";
import { createProduct, deleteProduct, getProductbyId, ListProducts, updateProduct, searchProducts } from "../controllers/products";
import { errorHandler } from '../../error-handler';
import { authMiddleware } from "../middlewares/auth";
import adminMiddleware from "../middlewares/admin";

const productRoutes:Router = Router();

productRoutes.post('/',[authMiddleware], [adminMiddleware], errorHandler(createProduct))
productRoutes.put('/:id',[authMiddleware], [adminMiddleware], errorHandler(updateProduct))
productRoutes.delete('/:id',[authMiddleware], [adminMiddleware], errorHandler(deleteProduct))
productRoutes.get('/',[authMiddleware], [adminMiddleware], errorHandler(ListProducts))
productRoutes.get('/search',[authMiddleware], errorHandler(searchProducts))  //      /search?q=""  -> q = the query(production practice)
productRoutes.get('/:id',[authMiddleware], [adminMiddleware], errorHandler(getProductbyId))


export default productRoutes;