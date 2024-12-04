import express from "express";

import authRouter from "./routes/auth.routes";

import { UserType } from "./type";
declare global {
  namespace Express {
    interface Request {
      user: UserType;
    }
  }
}

const app = express();
const PORT = 8080;

app.use(express.json());

app.use("/auth", authRouter);

app.listen(PORT, () => {
  console.log(`Server listening on port: ${PORT}`);
});
