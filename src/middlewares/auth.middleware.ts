import { Request, Response, NextFunction } from "express";

export const needAuth = (req: Request, res: Response, next: NextFunction) => {
  const user = req.session.user; // 타입이 자동으로 확장됨

  if (!user) {
    res.status(401).json({ message: "로그인이 필요합니다." });
    return;
  }

  // 인증된 사용자라면, user를 req 객체에 추가하여 후속 미들웨어에서 사용할 수 있게 함
  req.user = user;
  next();
};
