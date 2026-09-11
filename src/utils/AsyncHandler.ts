import { NextFunction, Request, RequestHandler, Response } from "express";

export const asyncHandler = (Fn: RequestHandler) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(Fn(req, res, next)).catch((err) => {
      console.error(err);

      res.status(500).json({
        success: false,
        message: err instanceof Error && err.message,
        error: (err instanceof Error && err.message) || "Internal Server Error",
      });
    });
  };
};
