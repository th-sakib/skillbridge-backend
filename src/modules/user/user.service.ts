import { Category, TutorProfiles } from "../../../generated/prisma/client";
import { prisma } from "../../lib/prisma";

const getTutors = async () => {
  const res = await prisma.user.findMany({
    where: {
      role: "TUTOR",
    },
  });

  return res;
};

const createTutor = async (
  userId: string,
  data: TutorProfiles & { categories: string[] },
) => {
  const res = await prisma.tutorProfiles.create({
    data: {
      hourlyRate: data.hourlyRate,
      bio: data.bio,
      user: {
        connect: { id: userId },
      },
      categories: {
        connect: data.categories.map((id) => ({ id })),
      },
    },
    include: {
      categories: true,
    },
  });

  return res;
};

export const userService = {
  getTutors,
  createTutor,
};
