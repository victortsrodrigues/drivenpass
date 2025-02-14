import { Request, Response } from "express";
import { BodyCredential } from "../protocols/authProtocol";
import credentialsServices from "../services/credentialsServices";
import httpStatus from "http-status";

async function createCredential(req: Request, res: Response) {
  const body = req.body as BodyCredential;
  const userId = res.locals.userId;
  await credentialsServices.createCredential(body, userId);
  res.sendStatus(httpStatus.CREATED);
}

const credentialsController = {
  createCredential,
};

export default credentialsController;