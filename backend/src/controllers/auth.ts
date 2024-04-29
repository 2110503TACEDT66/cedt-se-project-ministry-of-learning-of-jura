import { UserModel, User } from "../models/User";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import type { CookieOptions, NextFunction, Request, Response } from "express";
import env from "../config/env";
import { Document } from "mongoose";
import { Duration } from "typed-duration";
const tokenCookieOptions: CookieOptions = {
  maxAge: Duration.milliseconds.from(Duration.days.of(env.JWT_EXPIRING_DAYS)),
  httpOnly: true,
};
if (env.DEPLOY_MODE == "production") {
  tokenCookieOptions.secure = true;
}
//@desc   : Register User
//@route  : POST /api/v1/auth/register
//@access : Public
export async function register(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { username, email, password, role } = req.body;
    const user = await UserModel.create({ username, email, password, role });

    responseWithToken(user, 200, res);
  } catch (err: any) {
    res.status(400).json({ success: false });
    // console.log(err.stack);
  }
}

//@desc   : Login user
//@route  : POST /api/v1/auth/login
//@access : Public
export async function login(req: Request, res: Response, next: NextFunction) {
  console.log("login attempt", req.body);
  const { username, email, password } = req.body;
  if ((!username && !email) || !password) {
    return res
      .status(400)
      .json({ success: false, msg: "Please provide an emall and password" });
  }
  let filterQuery: {
    username?: string;
    email?: string;
  } = {};
  if (username) {
    filterQuery.username = username;
  }
  if (email) {
    filterQuery.email = email;
  }

  const user = await UserModel.findOne(filterQuery).select("email password");

  if (!user) {
    return res.status(400).json({ success: false, msg: "Invalid credentials" });
  }

  const isMatch = await user.matchPassword(password);
  if (!isMatch) {
    return res.status(401).json({ success: false, msg: "Wrong password" });
  }
  responseWithToken(user, 200, res);
}

//@desc   : Login superuser
//@route  : POST /api/v1/auth/superuser/login
//@access : Private
export async function superUserLogin(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const isMatch = await bcrypt.compare(req.body, env.SUPERUSER_PASSWORD);
  if (!isMatch) {
    return res.status(400).json({
      success: false,
      message: "wrong password",
    });
  }
  const user = {
    superuser: "superuser",
  };
  responseWithTokenSuperUser(user, 200, res);
}

//@desc   : logout
//@route  : POST /api/v1/auth/logout
//@access : Private
export async function logout(req: Request, res: Response, next: NextFunction) {
  res.status(200).clearCookie("token").json({
    success: true,
  });
}

//@desc   : get user data
//@route  : GET /api/v1/auth/me
//@access : Private
export async function getMe(req: Request, res: Response, next: NextFunction) {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: "Token is invalid",
    });
  }
  return res.status(200).json(req.user);
}

//@desc   : delete user account
//@route  : DELETE /api/v1/auth/deleteAccount
//@access : Private
export async function deleteAccount(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    await UserModel.deleteOne({
      username: req.params.username,
      role: "user",
    });
    res.status(200).json({
      success: true,
    });
  } catch (err) {
    res.status(400).json({
      success: false,
    });
  }
}

function responseWithToken(
  user: User & Document,
  statusCode: number,
  res: Response,
) {
  const { _id, email, password } = user;
  const signedJwt = jwt.sign(
    {
      id: _id,
      email,
      password,
    },
    env.JWT_SECRET,
    {
      expiresIn: env.JWT_EXPIRING_DAYS + "d",
    },
  );
  res.cookie("token", signedJwt, tokenCookieOptions);
  res.status(statusCode).json({
    success: true,
    token: signedJwt,
  });
}

function responseWithTokenSuperUser(
  superuser: { superuser: string },
  statusCode: number,
  res: Response,
) {
  const signedJwt = jwt.sign(superuser, env.JWT_SECRET, {
    expiresIn: "1h",
  });
  res.cookie("token", signedJwt, tokenCookieOptions);
  res.status(statusCode).json({
    success: true,
    token: signedJwt,
  });
}
