import { UserRole } from "../middleware/auth";
import { prisma } from "../lib/prisma";
import { env } from "../config";
import { auth } from "../lib/auth";

(async function () {
  try {
    console.log("***** Admin Seeding Started....");
    const adminData = {
      name: "Admin",
      email: "admin@admin.com",
      role: UserRole.student,
      password: "AdminIsHereToControlYou91",
      adminKey: env.SECRET_KEY,
    };
    console.log("***** Checking Admin Exist or not");
    // check user exist on db or not
    const existingUser = await prisma.user.findUnique({
      where: {
        email: adminData.email,
      },
    });

    if (existingUser) {
      throw new Error("User already exists!!");
    }
    const result = await auth.api.signUpEmail({
      body: {
        ...adminData,
        role: "ADMIN",
      },
    });

    console.log("Admin Seeded:", result);

    if (result.user) {
      console.log("**** Admin created");
      await prisma.user.update({
        where: {
          email: adminData.email,
        },
        data: {
          emailVerified: true,
        },
      });

      console.log("**** Email verification status updated!");
      console.log("******* SUCCESS ******");
    }
  } catch (error) {
    console.log("******* FAILED ******");
    console.error(error);
  }
})();
