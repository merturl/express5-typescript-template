import { createServer, Server } from "http";
import createApp from "./app";
import { config } from "./config/env.config";
import logger from "./utils/logger";
import { connectDB, closeDB } from "./config/db.config";
import { setupSocketIO } from "./socket/socket";

/**
 * Initialize and start the server after DB connection is established
 */
async function startServer() {
  try {
    // Create Express app
    const app = createApp();

    // Create HTTP server
    const httpServer = createServer(app);
    const io = setupSocketIO(httpServer);

    // MongoDB 연결 시도
    await connectDB();

    // DB 연결 성공 후에만 서버 시작
    httpServer.listen(config.port, () => {
      logger.info(
        `서버가 포트 ${config.port}에서 실행 중입니다 (환경: ${config.nodeEnv})`
      );
    });

    // 정상 종료 처리
    setupGracefulShutdown(httpServer);

    return { httpServer, io };
  } catch (error) {
    logger.error("서버 초기화 실패:", error);
    process.exit(1);
  }
}

/**
 * Set up graceful shutdown handlers
 */
function setupGracefulShutdown(httpServer: Server) {
  // 정상적이지 않은 종료 처리
  process.on("unhandledRejection", (error) => {
    logger.error("처리되지 않은 Promise 거부:", error);
    shutdown(httpServer, 1);
  });

  process.on("uncaughtException", (error) => {
    logger.error("처리되지 않은 예외:", error);
    shutdown(httpServer, 1);
  });

  // 정상 종료 처리
  process.on("SIGTERM", () => {
    logger.info("SIGTERM 신호 수신. 서버를 종료합니다...");
    shutdown(httpServer, 0);
  });

  process.on("SIGINT", () => {
    logger.info("SIGINT 신호 수신. 서버를 종료합니다...");
    shutdown(httpServer, 0);
  });
}

/**
 * Gracefully shut down the server and database connection
 */
function shutdown(httpServer: Server, exitCode: number) {
  httpServer.close(async () => {
    logger.info("HTTP 서버가 종료되었습니다");
    await closeDB();
    logger.info("데이터베이스 연결이 종료되었습니다");
    process.exit(exitCode);
  });
}

// Start the server and export the objects
const serverPromise = startServer();

// Since we need to export items now but they're not available synchronously,
// we'll use module.exports to ensure exports are available when needed
serverPromise.then(({ httpServer, io }) => {});
