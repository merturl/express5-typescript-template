import dotenv from "dotenv";
dotenv.config();

export const config = {
  port: process.env.PORT || 3000,
  nodeEnv: process.env.NODE_ENV || "development",
  mongoURL: process.env.DATABASE_URL || "mongodb://localhost:27017/omok",
  logLevel: process.env.LOG_LEVEL || "info",
  sessionSecret: process.env.SESSION || "session-login",
};
