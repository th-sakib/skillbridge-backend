import { asyncHandler } from "../../utils/AsyncHandler";
import { Request, Response, NextFunction } from "express";
import { authService } from "./auth.service";
import sendResponse from "../../utils/ApiResponse";

const registerUser = asyncHandler(async (req: Request, res: Response) => {
  const result = await authService.registerUser(req.body);

  sendResponse(res, {
    success: true,
    message: "User created successfully",
    statusCode: 201,
    data: result,
  });
});

const loginUser = asyncHandler(async (req: Request, res: Response) => {
  const result = await authService.loginUser(req.body);

  sendResponse(res, {
    success: true,
    message: "User Logged In.",
    statusCode: 200,
    data: result,
  });
});

export const authController = {
  registerUser,
  loginUser,
};
