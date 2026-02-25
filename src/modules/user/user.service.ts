import { prisma } from "../../lib/prisma";

const getTutors = async () => {
  const res = await prisma.user.findMany({
    where: {
      role: "TUTOR",
    },
  });

  return res;
};

export const userService = {
  getTutors,
};
