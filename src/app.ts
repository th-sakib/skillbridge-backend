import e, { Application, Request, Response } from "express";
import cors from "cors";
import globalErrorHandler from "./utils/globalErrorHandler";
import { notFound } from "./middleware/notFound";

import { userRouter } from "./modules/user/user.route";
import { categoryRouter } from "./modules/category/category.route";
import { authRouter } from "./modules/auth/auth.route";

const app: Application = e();

app.use(e.json());
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  }),
);

// NOTE after removal: handling this with backend endpoints instead
// app.all("/api/auth/*splat", toNodeHandler(betterAuth));

app.use("/api/v1/user/", userRouter);
app.use("/api/v1/category/", categoryRouter);
app.use("/api/v1/auth/", authRouter);

app.get("/", (req: Request, res: Response) => {
  res.send("Yes the server is connected.");
});

app.use(globalErrorHandler);
app.use(notFound);

export default app;
