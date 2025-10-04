import {Router} from "express"//Router class enables us to split the routes across multiple files and use them 
import { login, signUp } from "../controllers/auth";
import { errorHandler } from "../../error-handler";

const authRoutes:Router= Router();
// authRoutes = variable (container)
// Router() = object (the actual router with methods)
// authRoutes stores the Router object

authRoutes.post('/signup',errorHandler(signUp))
authRoutes.post("/login", errorHandler(login))

export default authRoutes;


