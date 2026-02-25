import e from "express";
import { userController } from "./user.controller";

const router = e.Router();

router.get("/tutors", userController.getTutors);

export const userRouter = router;
