import { Request, Response } from "express";
import { BodySignIn, BodySignUp } from "../protocols/authProtocol";
import httpStatus from "http-status";
import authServices from "../services/authServices";


export async function signUp(req: Request, res: Response) {
  const body = req.body as BodySignUp;
  await authServices.signUp(body);
  res.sendStatus(httpStatus.CREATED);
}

const authController = {
  signUp,
};

export default authController;