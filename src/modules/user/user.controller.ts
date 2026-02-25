import { NextFunction, Request, Response } from "express";
import { userService } from "./user.service";
import sendResponse from "../../utils/ApiResponse";

const getTutors = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await userService.getTutors();

    console.log(result);

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
};
