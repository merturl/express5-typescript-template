import express, { Application } from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import helmet from "helmet";
import routes from "./routes";
import { errorMiddleware, notFoundMiddleware } from "./middlewares";
import { sessionMiddleware } from "./middlewares/session.middler";

function createApp() {
  const app: Application = express();

  // Middleware
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(cookieParser());
  app.use(helmet());

  app.use(sessionMiddleware);
  // Routes
  app.use(routes);

  // not found middleware
  app.use(notFoundMiddleware);
  // error handlemiddleware
  app.use(errorMiddleware);

  return app;
}

export default createApp;
