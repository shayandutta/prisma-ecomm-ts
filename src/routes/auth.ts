import {Router} from "express"//Router class enables us to split the routes across multiple files and use them 
import { login, signUp } from "../controllers/auth";

const authRoutes:Router= Router();
// authRoutes = variable (container)
// Router() = object (the actual router with methods)
// authRoutes stores the Router object

authRoutes.post('/signup', signUp)
authRoutes.post("/login", login)

export default authRoutes;


