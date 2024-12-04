import jwt from "jsonwebtoken";
import { Response, Request, NextFunction } from "express";
import { findUserById } from "../model/user.model";
import { TokenPayload } from "../type";

const protectedRoute = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.cookies.jwt;
    if (!token) {
      return res.status(401).send("No token provided");
    }
    if (typeof process.env.JWT_SECRET !== "string") {
      return res.status(500).send("Internal error: JWT_SECRET is not defined");
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET) as TokenPayload;
    if (!decoded) {
      return res.status(401).send("Token not valid");
    }
    const user = await findUserById(parseInt(decoded.userId));
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }
    req.user = user;
    next();
  } catch (error) {
    if (error instanceof Error) {
      return res.status(500).json({ error: error.message });
    }
  }
};
