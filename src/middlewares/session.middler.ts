import session from "express-session";
import FileStoreModule from "session-file-store"; // 파일 기반 세션 저장소
import { config } from "../config/env.config";

const FileStore = FileStoreModule(session);

export const sessionMiddleware = session({
  store: new FileStore({
    path: "./sessions", // 세션 파일 저장 위치
    ttl: 86400, // 세션 만료 시간 (초)
  }),
  secret: config.sessionSecret, // 환경 변수에서 가져온 세션 키
  resave: false,
  saveUninitialized: false,
  name: "omok-session",
  cookie: {
    maxAge: 1000 * 60 * 60 * 24, // 1일
    httpOnly: true,
    secure: config.nodeEnv === "production", // HTTPS에서만 쿠키 허용
  },
});
