import { ErrorRequestHandler } from "express";

export const errorMiddleware: ErrorRequestHandler = (err, req, res, next) => {
  const status = err.status || 500;
  const message = err.message;
  res.status(status).json({ message });
};
