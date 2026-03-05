import e, { type Router } from "express";
import { userController } from "./user.controller";
import auth, { UserRole } from "../../middleware/auth";

const router: Router = e.Router();

router.post(
  "/create-tutor/:userId",
  auth(UserRole.tutor),
  userController.createTutor,
);
router.patch(
  "/update-tutor/:profileId",
  auth(UserRole.tutor),
  userController.updateTutorProfile,
);

router.get("/tutors", userController.getTutors);

// get user and tutor by id
router.get("/:userId", userController.getUserById);
router.get("/tutor/:userId", userController.getTutorById);

// tutor availability
router.post(
  "/availability",
  auth(UserRole.tutor),
  userController.createAvailability,
);

export const userRouter = router;
