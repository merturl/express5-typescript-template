import { Request, NextFunction, Response } from "express";
import createError from "http-errors";

export const notFoundMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  return next(createError(404));
};
