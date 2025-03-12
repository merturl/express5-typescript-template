// src/types/express-session.d.ts
import "express-session";

declare module "express-session" {
  interface SessionData {
    user?: {
      // user는 선택적 속성으로 설정
      username: string;
      email: string;
    };
  }
}
