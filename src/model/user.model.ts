import pool from "../db";
import { hash } from "bcrypt";
import { UserType } from "../type";

export const createUser = async (
  username: string,
  email: string,
  password: string
): Promise<UserType> => {
  const hasshedPassword = await hash(password, 9);
  const text =
    "INSERT INTO users(username, email, password) VALUES($1, $2, $3) RETURNING *";
  const values = [username, email, hasshedPassword];

  const res = await pool.query(text, values);

  return res.rows[0] as UserType;
};

export const findUserById = async (id: number): Promise<UserType | null> => {
  const text = "SELECT * FROM users WHERE id = $1";
  const values = [id];

  const res = await pool.query(text, values);
  if (res.rows.length === 0) {
    return null;
  }
  return res.rows[0] as UserType;
};

export const findUserByEmail = async (
  email: string
): Promise<UserType | null> => {
  const text = "SELECT * FROM users WHERE email = $1";
  const values = [email];

  const res = await pool.query(text, values);
  if (res.rows.length === 0) {
    return null;
  }
  return res.rows[0] as UserType;
};
