import { statusCodes, User } from "better-auth";
import { DayOfWeek, TutorProfiles } from "../../../generated/prisma/client";
import {
  TutorProfilesWhereInput,
  UserWhereInput,
} from "../../../generated/prisma/models";
import { auth } from "../../lib/auth";
import { prisma } from "../../lib/prisma";
import { UserRole } from "../../middleware/auth";
import { TFilter } from "../../types/filter.type";
import { ApiError } from "../../utils/ApiError";
import { changePassword } from "better-auth/api";
import { Request } from "express";

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

const createAvailability = async (
  tutorId: string,
  dayOfWeek: DayOfWeek,
  start: number,
  end: number,
) => {
  const result = await prisma.$transaction(async (tx) => {
    // retrive tutorProfileId

    const tutorProfile = await tx.tutorProfiles.findFirst({
      where: {
        userId: tutorId,
      },
    });

    if (!tutorProfile) {
      throw new ApiError("TutorProfile not found", 404);
    }

    const overlap = await prisma.availability.findFirst({
      where: {
        tutorProfileId: tutorProfile.id,
        day: dayOfWeek,
        OR: [{ startMinute: { lt: end }, endMinute: { gt: start } }],
      },
    });

    if (overlap) {
      throw new ApiError(
        "Your provided time conflicts with existing time slot.",
        400,
      );
    }

    return await prisma.availability.create({
      data: {
        tutorProfileId: tutorProfile.id,
        day: dayOfWeek,
        startMinute: start,
        endMinute: end,
      },
    });
  });

  return result;
};

const deleteAvailability = async (availabilityId: string) => {
  const result = await prisma.availability.delete({
    where: {
      id: availabilityId,
    },
  });
  return result;
};

const getAvailability = async () => {
  const result = await prisma.availability.findMany();

  return result;
};

const updateAvailability = async (
  tutorId: string,
  availabilityId: string,
  dayOfWeek: DayOfWeek,
  start: number,
  end: number,
) => {
  const result = await prisma.$transaction(async (tx) => {
    const tutorProfile = await tx.tutorProfiles.findUnique({
      where: {
        id: tutorId,
      },
    });
    if (!tutorProfile) {
      throw new ApiError("TutorProfile not found", 404);
    }

    const overlap = await tx.availability.findFirst({
      where: {
        tutorProfileId: tutorProfile.id,
        day: dayOfWeek,
        OR: [{ startMinute: { lt: end }, endMinute: { gt: start } }],
      },
    });

    if (overlap) {
      throw new ApiError(
        "Your provided time conflicts with existing time slot.",
        400,
      );
    }

    return await prisma.availability.update({
      where: {
        id: availabilityId,
      },
      data: {
        day: dayOfWeek,
        startMinute: start,
        endMinute: end,
      },
    });
  });

  return result;
};

// profile management
const getProfile = async (userId: string) => {
  const result = await prisma.user.findMany({
    where: {
      id: userId,
    },
    include: {
      tutorProfiles: {
        include: {
          availabilities: true,
        },
      },
      bookings: true,
    },
  });

  return result;
};

const updateProfile = async (userId: string, payload: User) => {
  const result = await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      name: payload.name,
      image: payload.image,
    },
  });

  return result;
};

const updateEmail = async (userId: string, email: string) => {
  // TODO: enable change email functionality within better auth
};

const updatePass = async (
  req: Request,
  newPassword: string,
  currentPassword: string,
) => {
  const headers = new Headers();

  Object.entries(req.headers).forEach(([key, value]) => {
    if (typeof value === "string") {
      headers.append(key, value);
    }
  });

  const result = await auth.api.changePassword({
    body: {
      newPassword,
      currentPassword,
      revokeOtherSessions: true,
    },
    headers,
  });

  return result;
};

export const userService = {
  getTutors,
  createTutor,
  getUserById,
  getTutorById,
  updateTutorProfile,
  createAvailability,
  deleteAvailability,
  getAvailability,
  updateAvailability,

  getProfile,
  updateProfile,
  updateEmail,
  updatePass,
};
