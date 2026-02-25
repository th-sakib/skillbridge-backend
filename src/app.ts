import { toNodeHandler } from "better-auth/node";
import e, { Application, Request, Response } from "express";
import { auth as betterAuth } from "./lib/auth";
import cors from "cors";
import auth from "./middleware/auth";
import globalErrorHandler from "./utils/globalErrorHandler";

import { userRouter } from "./modules/user/user.route";

const app: Application = e();

app.use(e.json());
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  }),
);

app.all("/api/auth/*splat", toNodeHandler(betterAuth));

app.use("/api/v1/user/", userRouter);

app.get("/", auth(), (req: Request, res: Response) => {
  res.send("Yes the server is connected.");
});

app.use(globalErrorHandler);

export default app;
