import { Handler } from "express";
import { userSerice } from "../services/user.service";
import logger from "../utils/logger";
import createHttpError from "http-errors";

export const signUp: Handler = async (req, res, next) => {
  try {
    const data = await userSerice.newUser(req.body);
    res.status(200).json(data);
  } catch (error) {
    logger.error("예제 데이터 조회 실패:", error);
    next(error);
  }
};

export const signIn: Handler = async (req, res, next) => {
  try {
    const data = await userSerice.signIn(req.body);
    req.session.user = data;
    logger.info("로그인 성공:", { data });
    res.status(200).json(data);
  } catch (error) {
    logger.error("로그인 실패:", error);
    next(error);
  }
};

export const signOut: Handler = async (req, res, next) => {
  if (!req.session.user) {
    return next(createHttpError(400, "로그인 상태가 아닙니다."));
  }

  req.session.destroy((error) => {
    if (error) {
      logger.error("로그아웃 실패:", error);
      return next(error);
    }

    res.clearCookie("connect.sid"); // 세션 쿠키 삭제
    res.status(200).json({ message: "로그아웃 완료" });
  });
};
