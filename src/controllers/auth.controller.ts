import { Request, Response } from "express";
import { createUser, findUserByEmail } from "../model/user.model";
import { compare } from "bcrypt";
import generateToken from "../../utils/generateToken";

export const signup = async (req: Request, res: Response) => {
  try {
    const { username, email, password, confirmPassword } = req.body;

    if (!username || !email || !password || !confirmPassword) {
      return res.status(400).json({ message: "invalid data" });
    }

    const find = await findUserByEmail(email);
    if (find) {
      return res.status(400).json({ message: "user already exists" });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ message: "passwords don't match" });
    }

    const newUser = await createUser(username, email, password);
    generateToken(newUser.id.toString(), res);
    return res
      .status(201)
      .json({ message: "user creado correctamente", newUser });
  } catch (error) {
    if (error instanceof Error) {
      return res.status(500).json({ error: error.message });
    }
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Invalid data" });
    }

    const find = await findUserByEmail(email);
    if (!find) {
      return res.status(400).json({ message: "user don't exists" });
    }

    const comparePasswords = await compare(password, find.password);
    if (!comparePasswords) {
      return res.status(400).json({ message: "invalid password" });
    }

    generateToken(find.id.toString(), res);
    return res.status(200).json({ message: "User loged", find });
  } catch (error) {
    if (error instanceof Error) {
      return res.status(500).json({ error: error.message });
    }
  }
};

export const logout = async (req: Request, res: Response) => {
  try {
    res.cookie("jwt", "", { maxAge: 0 });
    return res.status(200).json({ message: "logout" });
  } catch (error) {
    if (error instanceof Error) {
      return res.status(500).json({ error: error.message });
    }
  }
};
