import { NextFunction, Request, Response } from "express";
import { userService } from "./user.service";
import sendResponse from "../../utils/ApiResponse";
import { UserRole } from "../../middleware/auth";

const getTutors = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await userService.getTutors();

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
      throw new Error("Login before performing this task");
    }
    if (req.user.role !== UserRole.tutor) {
      throw new Error("You don't have permission to access the resouce.");
    }

    const { id: userID } = req.params;

    if (!userID) {
      return res.status(404).json({
        success: false,
        message: "user ID not found.",
      });
    }

    const result = await userService.createTutor(userID as string, req.body);

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
export const userController = {
  getTutors,
  createTutor,
};
