import e, { type Router } from "express";
import { userController } from "./user.controller";
import auth, { UserRole } from "../../middleware/auth";

const router: Router = e.Router();

router.post("/tutor", userController.createTutor);

router.get("/tutors", auth(UserRole.tutor), userController.getTutors);

export const userRouter = router;
