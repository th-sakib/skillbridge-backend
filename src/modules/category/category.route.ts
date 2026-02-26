import e, { Router } from "express";
import { categoryController } from "./category.controller";
import auth, { UserRole } from "../../middleware/auth";

const router: Router = e.Router();

router.post("/", auth(UserRole.admin), categoryController.createCategory);

router.get(
  "/",
  auth(UserRole.admin, UserRole.tutor, UserRole.student),
  categoryController.getCategory,
);

export const categoryRouter = router;
