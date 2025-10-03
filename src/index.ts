import express, { type Express, type Request, type Response } from "express";

const app: Express = express();

app.get("/", (req: Request, res: Response) => {
  res.send("Working");
});

app.listen(3030, () => {
  console.log("app is listening on port 3030");
});
