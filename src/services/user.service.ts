import mongoose from "mongoose";
import { User } from "../models/user.model";
import bcrypt from "bcrypt";
import createHttpError from "http-errors";

export const userSerice = {
  newUser: async ({ username, email, password }: INewUser) => {
    const exists = await User.findOne({ email }).exec();
    if (exists) {
      throw createHttpError(400, "이미 존재하는 이메일입니다.");
    }
    if (!username || !email || !password) {
      throw createHttpError(400, "필수 정보가 누락되었습니다.");
    }
    const user = new User({
      _id: new mongoose.Types.ObjectId(),
      username,
      email,
      password: await bcrypt.hash(password, 10),
    });

    await user.save();

    return ({ username, email } = user);
  },
  signIn: async ({ email, password }: ISignIn) => {
    if (!email || !password) {
      throw createHttpError(400, "필수 정보가 누락되었습니다.");
    }
    const exists = await User.findOne({ email }).exec();
    if (!exists) {
      throw createHttpError(400, "가입되지 않은 이메일입니다.");
    }

    const match = await bcrypt.compare(password, exists.password);
    if (!match) {
      throw createHttpError(400, "비밀번호가 일치하지 않습니다.");
    }

    return { username: exists.username, email: exists.email };
  },
};

interface INewUser {
  username: string;
  email: string;
  password: string;
}

interface ISignIn {
  email: string;
  password: string;
}
