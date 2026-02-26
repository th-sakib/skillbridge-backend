import e, { type Router } from "express";
import { userController } from "./user.controller";
import auth, { UserRole } from "../../middleware/auth";

const router: Router = e.Router();

router.post(
  "/create-tutor/:userId",
  auth(UserRole.tutor),
  userController.createTutor,
);

router.get("/tutors", auth(UserRole.student), userController.getTutors);

export const userRouter = router;
