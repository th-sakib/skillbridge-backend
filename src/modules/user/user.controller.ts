import { NextFunction, Request, Response } from "express";
import { userService } from "./user.service";
import sendResponse from "../../utils/ApiResponse";
import { UserRole } from "../../middleware/auth";
import { TFilter } from "../../types/filter.type";
import { ApiError } from "../../utils/ApiError";

const parseSafeNumber = (val: string): number | undefined => {
  const parsed = Number(val);

  return isNaN(parsed) ? undefined : parsed;
};

const getTutors = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const limit = req.query.limit ? Number(req.query.limit) : 5;
    const page = req.query.page ? Number(req.query.page) : 1;

    const skip = limit * (page - 1);

    const filter: TFilter = {
      searchTerm: req.query.searchTerm as string,
      category: req.query.category as string,
      minPrice: req.query.minPrice
        ? parseSafeNumber(req.query.minPrice as string)
        : undefined,
      maxPrice: req.query.maxPrice
        ? parseSafeNumber(req.query.maxPrice as string)
        : undefined,
      minRating: req.query.minRating
        ? parseSafeNumber(req.query.minRating as string)
        : undefined,
      skip,
      limit,
    };

    const result = await userService.getTutors(filter);

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Successfully retrieved tutors",
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

const createTutor = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.user) {
      throw new ApiError("Login before performing this task", 401);
    }
    if (req.user.role !== UserRole.tutor) {
      throw new ApiError(
        "You don't have permission to access the resouce.",
        403,
      );
    }

    const { userId } = req.params;

    if (!userId) {
      throw new ApiError("User Id not found", 404);
    }
    if (req.user.id !== userId) {
      throw new ApiError(
        "You don't have permission to modify this profile",
        403,
      );
    }

    const result = await userService.createTutor(userId as string, req.body);

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Successfully retrieved tutors",
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

const updateTutorProfile = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    if (!req.user) {
      throw new ApiError("Login before performing this task", 401);
    }
    if (req.user.role !== UserRole.tutor) {
      throw new ApiError(
        "You don't have permission to access the resouce.",
        403,
      );
    }

    const { profileId } = req.params;

    if (!profileId) {
      throw new ApiError("Profile Id not found", 404);
    }
    // if (req.user.id !== profileId) {
    //   throw new ApiError(
    //     "You don't have permission to modify this profile",
    //     403,
    //   );
    // }

    const result = await userService.updateTutorProfile(
      profileId as string,
      req.body,
    );

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Successfully updated tutors",
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

const getTutorById = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      throw new ApiError("tutorId not found", 404);
    }

    const result = await userService.getTutorById(userId as string);

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Successfully retrieved the tutor.",
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

const getUserById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      throw new ApiError("tutorId not found", 404);
    }

    const result = await userService.getUserById(userId as string);

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Successfully retrieved the user.",
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

const createAvailability = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    if (!req.user) {
      throw new ApiError("Please login first", 400);
    }

    const tutorId = req.user.id;

    const result = await userService.createAvailability(tutorId);

    sendResponse(res, {
      success: true,
      statusCode: 201,
      message: "Availability is created",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const userController = {
  getTutors,
  createTutor,
  getUserById,
  getTutorById,
  updateTutorProfile,
  createAvailability,
};
