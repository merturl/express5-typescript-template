import winston from "winston";
import { config } from "../config/env.config";

const { combine, timestamp, printf, colorize, json } = winston.format;

const myFormat = printf(({ level, message, timestamp, ...metadata }) => {
  return `${timestamp} ${level}: ${message}  ${
    Object.keys(metadata).length ? JSON.stringify(metadata) : ""
  }`;
});

const logger = winston.createLogger({
  level: config.logLevel,
  format: combine(timestamp(), myFormat),
  transports: [
    new winston.transports.Console({
      format: combine(colorize(), timestamp(), myFormat),
    }),
    new winston.transports.File({
      filename: "error.log",
      level: "error",
    }),
    new winston.transports.File({
      filename: "combined.log",
    }),
  ],
});

export default logger;
