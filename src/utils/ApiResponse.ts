import { Response } from "express";

interface IResponse<T> {
  statusCode: number;
  success: boolean;
  message: string;
  data?: T;
}

const sendResponse = <T>(res: Response, data: IResponse<T>) => {
  const { statusCode, success, message, data: resData } = data;

  res.status(statusCode).json({
    success,
    message,
    data: resData,
  });
};

export default sendResponse;
