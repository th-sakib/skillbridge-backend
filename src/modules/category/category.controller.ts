import { NextFunction, Request, Response } from "express";
import sendResponse from "../../utils/ApiResponse";
import { categoryService } from "./category.service";

const createCategory = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { name } = req.body;

    if (!name) {
      throw new Error("Invalid input, 'name' not found");
    }

    const result = await categoryService.createCategory(name);

    sendResponse(res, {
      statusCode: 201,
      success: true,
      message: "category created successfully.",
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

const getCategory = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id: categoryId } = req.params;

    const result = await categoryService.getCategory(categoryId as string);

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "category retrieved successfully.",
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

export const categoryController = {
  createCategory,
  getCategory,
};
