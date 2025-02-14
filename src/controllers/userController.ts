import e, { Request, Response } from "express";
import httpStatus from "http-status";
import userServices from "../services/userServices";

async function deleteAccount(req: Request, res: Response) {
  const userId: number = res.locals.userId;
  await userServices.deleteAccount(userId);
  res.sendStatus(httpStatus.NO_CONTENT);
}

const userController = {
  deleteAccount,
};

export default userController;
