import express, { type Express, type Request, type Response } from "express";
import { PORT } from "./secrets";
import RootRouter from "./routes";
import {PrismaClient} from "@prisma/client"
import { errorMiddleware } from "./middlewares/errors";
import { SignupSchema } from "./schema/users";


const app: Express = express();

app.use(express.json())


app.use("/api", RootRouter);


export const prismaClient = new PrismaClient({
    log:['query']
})



app.use(errorMiddleware)


//PORT is comming from secrets.ts and not directly from .env
//all the env variables will be first handled by secrets.ts and then from secrets will be imported wheresoever required
app.listen(PORT, () => {
  console.log(`app is listening on port ${PORT}`);
})
