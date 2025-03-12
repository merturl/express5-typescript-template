import { Server as SocketIOServer } from "socket.io";
import { Server as HttpServer } from "http";
import logger from "../utils/logger";
import { setupRoomHandlers } from "./handlers/room.handler";
import { sessionMiddleware } from "../middlewares/session.middler";

export const setupSocketIO = (httpServer: HttpServer): SocketIOServer => {
  const io = new SocketIOServer(httpServer, {
    cors: {
      methods: ["GET", "POST"],
    },
  });

  io.use((socket, next) => {
    sessionMiddleware(socket.request as any, {} as any, (err?: any) => {
      if (err) {
        next(new Error("세션 처리 중 오류 발생"));
      } else {
        next();
      }
    });
  });

  io.on("connection", (socket) => {
    const session = (socket.request as any).session;

    if (session && session.user) {
      logger.info(`세션 사용자 연결됨: ${session.user.username}`);
    } else {
      logger.info("비로그인 사용자 연결됨");
    }

    socket.on("message", (msg) => {
      if (session && session.user) {
        logger.info(`[${session.user.username}] 메시지: ${msg}`);
      } else {
        logger.warn("인증되지 않은 사용자의 메시지 수신");
      }
    });

    socket.on("disconnect", () => {
      logger.info("클라이언트 연결 해제");
    });
  });

  return io;
};
