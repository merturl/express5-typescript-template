import mongoose from "mongoose";
import { config } from "./env.config";
import logger from "../utils/logger";

export const connectDB = async (): Promise<void> => {
  try {
    await mongoose.connect(config.mongoURL);
    logger.info("MongoDB 연결 성공");
  } catch (error) {
    logger.error("MongoDB 연결 실패:", error);
    process.exit(1);
  }
};

export const closeDB = async (): Promise<void> => {
  try {
    await mongoose.connection.close();
    logger.info("MongoDB 연결 종료");
  } catch (error) {
    logger.error("MongoDB 연결 종료 실패:", error);
  }
};
