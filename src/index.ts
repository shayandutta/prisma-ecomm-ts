import express, { type Express, type Request, type Response } from "express";
import { PORT } from "./secrets";
import RootRouter from "./routes";

const app: Express = express();

app.use("/api", RootRouter);

//PORT is comming from secrets.ts and not directly from .env
//all the env variables will be first handled by secrets.ts and then from secrets will be imported wheresoever required
app.listen(PORT, () => {
  console.log(`app is listening on port ${PORT}`);
});
