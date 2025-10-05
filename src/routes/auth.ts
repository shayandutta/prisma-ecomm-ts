import { Router } from "express"; //Router class enables us to split the routes across multiple files and use them
import { login, me, signUp } from "../controllers/auth";
import { errorHandler } from "../../error-handler";
// import { authMiddleware } from "../middlewares/auth";

const authRoutes: Router = Router();
// authRoutes = variable (container)
// Router() = object (the actual router with methods)
// authRoutes stores the Router object

authRoutes.post("/signup", errorHandler(signUp));
authRoutes.post("/login", errorHandler(login));
authRoutes.get("/me", errorHandler(me));

export default authRoutes;
