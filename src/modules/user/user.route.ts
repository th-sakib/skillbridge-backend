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

// ======== tutor availability ============
router.get(
  "/tutor/availability",
  auth(UserRole.tutor),
  userController.getAvailability,
);

router.post(
  "/tutor/availability",
  auth(UserRole.tutor),
  userController.createAvailability,
);
router.delete(
  "/tutor/availability/:availabilityId",
  auth(UserRole.tutor),
  userController.deleteAvailability,
);

router.patch(
  "/tutor/availability/:availabilityId",
  auth(UserRole.tutor),
  userController.updateAvailability,
);

// get user and tutor by id
router.get("/:userId", userController.getUserById);
router.get("/tutor/:userId", userController.getTutorById);

export const userRouter = router;
