import e, { type Router } from "express";
import { userController } from "./user.controller";
import auth, { UserRole } from "../../middleware/auth";

const router: Router = e.Router();

router.post(
  "/create-tutor",
  auth(UserRole.tutor),
  userController.createTutorProfile,
);
router.patch(
  "/update-tutor/:profileId",
  auth(UserRole.tutor),
  userController.updateTutorProfile,
);
// profile management
router.get(
  "/me",
  auth(UserRole.admin, UserRole.student, UserRole.tutor),
  userController.getProfile,
);
router.patch(
  "/profile",
  auth(UserRole.student, UserRole.tutor, UserRole.admin),
  userController.updateProfile,
);

router.patch(
  "/email",
  auth(UserRole.student, UserRole.tutor, UserRole.admin),
  userController.updateEmail,
  // TODO: enable change email functionality within better auth
);
router.post(
  "/password",
  auth(UserRole.student, UserRole.tutor, UserRole.admin),
  userController.updatePass,
  // TODO: enable change email functionality within better auth
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
