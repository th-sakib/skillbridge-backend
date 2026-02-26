import { TutorProfiles } from "../../../generated/prisma/client";
import { prisma } from "../../lib/prisma";

const getTutors = async () => {
  const res = await prisma.user.findMany({
    where: {
      role: "TUTOR",
    },
  });

  return res;
};

const createTutor = async (userID: string, data: TutorProfiles) => {
  const res = await prisma.$transaction(async (tx) => {
    // tx.tutorProfiles.create({
    //   data: {
    //     hourlyRate: data.hourlyRate,
    //     bio: data.bio,
    //     categories: data.categories
    //   }
    // })
  });

  return res;
};

export const userService = {
  getTutors,
  createTutor,
};
