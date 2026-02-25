import { toNodeHandler } from "better-auth/node";
import e, { Application, Request, Response } from "express";
import { auth } from "./lib/auth";
import cors from "cors";

const app: Application = e();

app.use(e.json());
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  }),
);

app.all("/api/auth/*splat", toNodeHandler(auth));

app.get("/", (req: Request, res: Response) => {
  res.send("Yes the server is connected.");
});

export default app;
