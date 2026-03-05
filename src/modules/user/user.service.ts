import { create } from "node:domain";
import { Category, TutorProfiles } from "../../../generated/prisma/client";
import {
  TutorProfilesWhereInput,
  UserWhereInput,
} from "../../../generated/prisma/models";
import { prisma } from "../../lib/prisma";
import { UserRole } from "../../middleware/auth";
import { TFilter } from "../../types/filter.type";
import { ApiError } from "../../utils/ApiError";

const getTutors = async (filters: TFilter) => {
  const { skip, limit, searchTerm, category, maxPrice, minPrice, minRating } =
    filters;

  // creating filters
  const where: UserWhereInput = {
    role: UserRole.tutor,
  };

  if (searchTerm) {
    where.OR = [
      {
        name: {
          contains: searchTerm,
          mode: "insensitive",
        },
      },
    ];
  }

  // creating profile filter based on queries
  // **profileFilter** can be empty if there is no queries related to profile
  const profileFilter: TutorProfilesWhereInput = {};
  if ((minPrice && maxPrice) || category || minRating) {
    where.tutorProfiles = {
      isNot: null,
    };
  }
  if (minPrice && maxPrice) {
    profileFilter.hourlyRate = {
      gte: minPrice,
      lte: maxPrice,
    };
  }

  if (category) {
    profileFilter.categories = {
      some: {
        name: { equals: category, mode: "insensitive" },
      },
    };
  }

  if (minRating) {
    profileFilter.averageRating = {
      gte: minRating,
    };
  }

  // docking the filters with where
  if (Object.keys(profileFilter).length > 0) {
    where.tutorProfiles = profileFilter;
  }

  const res = await prisma.user.findMany({
    where,
    take: limit,
    skip: skip,
    include: {
      tutorProfiles: {
        include: {
          categories: true,
          reviews: true,
        },
      },
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

const updateTutorProfile = async (profileId: string, payload: any) => {
  const { experience, bio, hourlyRate, categories } = payload;

  const result = await prisma.tutorProfiles.update({
    where: {
      id: profileId,
    },
    data: {
      bio,
      hourlyRate,
      experience,
      ...(categories && {
        categories: {
          set: [],
          connect: categories.map((id: string) => ({ id })),
        },
      }),
    },
    include: {
      categories: true,
      user: {
        select: {
          name: true,
          email: true,
        },
      },
    },
  });

  return result;
};

const getTutorById = async (userId: string) => {
  const res = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    include: {
      tutorProfiles: {
        include: {
          categories: true,
          reviews: true,
        },
      },
    },
  });

  if (!res) {
    throw new ApiError("Tutor retrieval failed.", 400);
  }

  if (res.role === UserRole.student || res.role === UserRole.admin) {
    throw new ApiError("You can't access this user", 400);
  }

  return res;
};

const getUserById = async (userId: string) => {
  const res = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });

  return res;
};

const createAvailability = async (payload: any) => {};

export const userService = {
  getTutors,
  createTutor,
  getUserById,
  getTutorById,
  updateTutorProfile,
  createAvailability,
};
